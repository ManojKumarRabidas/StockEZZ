const {ObjectId} = require('mongodb')
const userModel = require("../models/user");
const authModel = require("../models/authentication");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const _ = require('lodash')
const nodemailer = require("nodemailer");

module.exports = {
  ensureAuthenticated: (req, res, next) => {
    if (req.session && req.session.user) {
      next(); // Proceed if authenticated
    } else {
      res.status(401).json({ msg: 'Unauthorized' });
    }
  },
  verifyToken: (req, res, next) => {
    const token = req.cookies.token;  // Get token from cookies
    if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
        req.user = decoded;  // Attach user info to the request object
        next();
    } catch (err) {
        return res.status(401).json({ msg: 'Token is not valid' });
    }
  },
  userCreate: async (req, res) => {
    try {
      const body = req.body;
      if ( !body.user_type || !body.department || !body.name || !body.phone || !body.email || !body.address || !body.pin || !body.login_id || !body.password) {
        res.status(400).json({ msg: "Missing Parameters!" });
        return;
      }
      if ((body.user_type == "TEACHER") && (!body.teacher_code || !body.employee_id || !body.specialization)) {
        res.status(400).json({ msg: "Missing Parameters!" });
        return;
      }
      
      if ((body.user_type == "STUDENT") && (!body.registration_number || !body.registration_year)) {
        res.status(400).json({ msg: "Missing Parameters!" });
        return;
      }
      body.department = new ObjectId(body.department);
      const is_verified = 0;
      const active = 1;
      const password = body.password;
      const login_id = body.login_id;
      delete body.password;
      delete body.login_id;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      const userDoc = await userModel.create(body);
      await authModel.create({
        user_id: userDoc._id,
        user_type: userDoc.user_type,
        name: userDoc.name,
        login_id: login_id,
        password: hashedPassword,
        is_verified: is_verified,
        active: active,
        last_log_in: null,
      });

      res.status(201).json({ status: true, msg: "Registered successfully. Please wait, We are redirecting you to log in page."});
    } catch (err) {
      if (err.code == 11000) {
        if (err.keyPattern.email && err.keyPattern.email==1){
          res.status(500).json({ status: false, msg: "Email Id is not available. Please try something else." });
          return;
        }
        res.status(500).json({ status: false, msg: "Login Id is not available. Please try something else." });
        return;
      }
      res.status(500).json({ status: false, msg: err.message });
    }
  },

  userCheckLoginIdAvailability: async(req, res)=>{
    try {
      const params = req.params;
        if (!params || !params.login_id){
            res.status(400).json({ msg: "Missing Parameters!" });
            return;
        }
      const doc = await authModel.find({login_id: params.login_id});
      if (doc.length<=0){
        res.status(200).json({msg: "Available", available: true });
        return;
      }
      res.status(200).json({msg: "Not Available", available: false});
    } catch (error) {
      res.status(500).json({ msg: "Failed to retrieve departments" });
    }
  },

  userLogin: async (req, res) => {
    const { login_id, password } = req.body;
    try {
      const authUser = await authModel.findOne({ login_id });
      if (!authUser) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
      if (authUser.is_verified == 0){
        return res.status(400).json({ msg: 'Your account is still not verified. Please contact with admin for verification.' });
      }
      if (authUser.is_verified == -1){
        return res.status(400).json({ msg: 'Your account creation request is rejected. Please contact with admin for more information.' });
      }
      if (authUser.active == 0){
        return res.status(400).json({ msg: 'Your account is deactivated. Please contact with admin for activation.' });
      }
      const isMatch = await bcrypt.compare(password, authUser.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }
      authUser.last_log_in = new Date();
      await authUser.save();

      const token = jwt.sign({ id: authUser.user_id, user_type: authUser.user_type, name: authUser.name }, process.env.JWT_SECRET, { expiresIn: '2h' });
      res.cookie('token', token, { httpOnly: true }).json({ token, userName:authUser.name, msg: 'Logged in successfully' });
    } catch (err) {
      res.status(500).json({ msg: 'Server error', error: err.message });
    }
  },

  userLogout: (req, res) => {
    res.clearCookie('token').json({ msg: 'Logged out successfully' });
  }, 
  getUser:(req, res)=>{
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({status: false, msg: 'Authorization denied' });
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {console.log(err); return res.status(403).json({status: false, msg: 'Session expired.' });}
      res.status(200).json({status: true,doc: user });
    });
  },
  profileDetails: async(req, res) =>{
    try {
      var userId = req.user.id
      if (!userId) {
        return res.status(400).json({ msg: 'User ID is missing' });
      }
      userId = new ObjectId(userId);
        const docs = await userModel.aggregate([
          {$match: {_id: userId}},
          {$lookup: {from: "authentications",
                  localField: "_id",
                  foreignField: "user_id",
                  as: "auth"}},
          {$unwind: "$auth"},
          {$lookup: {from: "departments",
                  localField: "department",
                  foreignField: "_id",
                  as: "department"}},
          {$addFields: {department: { $arrayElemAt: ["$department", 0] }}},
          {$project: { _id: 1,
                  user_type: 1,
                  name: 1,
                  teacher_code: 1,
                  employee_id: 1,
                  registration_year: 1,
                  registration_number: 1,
                  phone: 1,
                  email: 1,
                  pin: 1,
                  address: 1,
                  specialization: 1,
                  department: {$ifNull: ["$department.name", ""]},
                  active: "$auth.active",
                  is_verified: "$auth.is_verified",
                  createdAt: 1,
                  last_log_in: "$auth.last_log_in",
                }},
        ]);
        const doc = docs[0]
        doc.createdAt= moment(doc.createdAt).format('DD/MM/YYYY - hh:mm A');
        doc.last_log_in= moment(doc.last_log_in).format('DD/MM/YYYY - hh:mm A');
        doc.active= doc.active === 1 ? "Active" : "Inactive",
        doc.is_verified= doc.is_verified === 1 ? "Verified" : (doc.is_verified === -1 ? "Rejected" : "Not Verified"),
        res.status(200).json({ doc: doc });
    } catch (err) {
        res.status(400).json({ msg: err.message });
    }
  },

  changePassword: async (req, res) => {
    try {
      const tempUser = req.user;
      const body = req.body;
      if ( !body.old_password || !body.new_password) {
        res.status(400).json({ msg: "Missing Parameters!" });
        return;
      }
      var userId;
      if(tempUser && tempUser.id){
        userId = new ObjectId(tempUser.id);
      } else {
        userId = new ObjectId("66da8a1459ec4c0f5b3d0363");
      }

      const user = await authModel.findOne({user_id: userId});
      if (!user) {
        return res.status(404).json({status: false, msg: 'User not found' });
      }
      const isMatch = await bcrypt.compare(body.old_password, user.password);
      if (!isMatch) {
        return res.status(400).json({ status: false, msg: 'Old password is incorrect' });
      }
      const hashedPassword = await bcrypt.hash(body.new_password, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ status: true, msg: 'Password changed successfully' });
    } catch (err) {
      res.status(500).json({ status: false, msg: "An error occurred while changing the password" });
    }
  },

  forgotPasswordSendOtp: async(req, res)=>{
    try{
        const userId = new ObjectId(req.user.id);
        const newOtp = Math.floor(Math.random() * (999999 - 100000 + 1)) + 100000;
        const otpDetails={otp: newOtp, generateAt: new Date(), expireAt: new Date()}
        const setOtp = await authModel.findOneAndUpdate({user_id: userId}, {$set: {otpDetails: otpDetails}}, {upsert: true, returnNewDocument: true});
        if (!setOtp._id){
            res.status(400).json({ msg: "Fail to generate and set otp! Please try again later." });
            return;
        }
      
        const auth = nodemailer.createTransport({
            service: "gmail",
            secure : true,
            port : 465,
            auth: {
                user: "manojkumarrabidas367@gmail.com",
                pass: "owdl prwv scof wzdf"
    
            }
        });
    
         const user = await userModel.findById(new ObjectId(req.user.id));
        if(!user || !user.email){
            res.status(400).json({ msg: "Email Id not found!" });
        }
        const receiver = {
            from : "manojkumarrabidas367@gmail.com",
            to : user.email,
            subject : "EduInsights Support Team : OTP for Forgot Password",
            text : `Dear ${req.user.name}. 

                    Your One Time Password (OTP) for verify is: ${newOtp}.

                    OTP is valid only for 05:00 mins. Do not share this OTP with anyone.

                    If you did not request this OTP, please connect with us immediately at complaint.support@eduinsights.in.
                    
                    Regards,
                    Team EduInsights`,
        };
    
        auth.sendMail(receiver, (error, emailResponse) => {
            if(error)
                res.status(200).json({status: false, msg: "Fail to send OTP, Please check your email id or try again later"});
            // throw error;
            response.end();
        });
    
        res.status(200).json({status: true, msg: "OTP sent to your registered email id"});
    }catch(err){
        res.status(500).json({status: false, msg: "Failed to send mail due to some technical problem. Please try again later." });
    }
  },
  forgotPasswordCheckOtp: async(req, res)=>{
      try{
          if(!req.body || !req.body.otp){
              res.status(400).json({ msg: "Please enter OTP first." });
              return;
          }
          req.body.otp = parseInt(req.body.otp)
          if(_.isNaN(req.body.otp)){
              res.status(400).json({ msg: "Invalid type input for OTP." });
              return;
          }
          const userId = new ObjectId(req.user.id);
          const doc= await authModel.findOne({user_id: userId},{otpDetails: 1});
          if(!doc || !doc.otpDetails){
              res.status(400).json({ status: false, msg: "Unable to check otp duw to some technocal problem! Please resend OTP and try again." });
              return;
          }
          if(doc.otpDetails.otp != req.body.otp){
              res.status(400).json({ status: false, msg: "Invalid OTP! Please try again." });
              return;
          }
          res.status(200).json({status: true, msg: "Validation sucessfull. Please set a new password."});
      }catch(err){
          res.status(500).json({status: false, msg: "Failed to send mail due to some technical problem. Please try again later." });
      }
  },
  forgotPasswordChangePassword: async(req, res)=>{
      try{
          if(!req.body || !req.body.password){
              res.status(400).json({ msg: "Please enter password." });
              return;
          }
          req.body.password = await bcrypt.hash(req.body.password, 10);
          const userId = new ObjectId(req.user.id);
          const doc = await authModel.findOneAndUpdate({user_id: userId}, {$set: {password: req.body.password}}, {upsert: true, returnNewDocument: true});
          if(!doc || !doc._id){
              res.status(500).json({status: false, msg: "Failed to update password due to some technical problem. Please try again later." });
          }
          res.status(200).json({status: true, msg: "Password changed successfully."});
      }catch(err){
          res.status(500).json({status: false, msg: "Failed to update password due to some technical problem. Please try again later." });
      }
  },
};
