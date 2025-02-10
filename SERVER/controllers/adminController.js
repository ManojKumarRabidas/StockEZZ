const {ObjectId} = require('mongodb')
const userModel = require("../models/user");
const authModel = require("../models/authentication");
const companyModel = require("../models/companies");
const bcrypt = require('bcryptjs');

module.exports = {
    supportAdminList: async(req, res)=>{
        try {
            const docs = await userModel.aggregate([
                {$match: {user_type: {$in: ["SUPPORTADMIN"]}}},
                {$lookup: {from: "authentications",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "auth"}},
                {$unwind: "$auth"},
                {$project: { _id: 1,
                        code: 1,
                        name: 1,
                        phone: 1,
                        email: 1,
                        login_id: "$auth.login_id",
                        active: "$auth.active"}}
            ]);
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    supportAdminCreate: async(req, res)=>{
        try {
            const body = req.body;
            if (!body.name || !body.phone || !body.email || !body.pin || !body.address){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            body.createdBy = new ObjectId(req.user.id);
            body.updatedBy = new ObjectId(req.user.id);
            body.user_type = "SUPPORTADMIN";
            const codeGenerator =await require("../controllers/utilController").createCode(body.user_type);
            body.code = codeGenerator.code
            const active = body.active;
            const password = body.phone;
            const login_id = body.code;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const userDoc = await userModel.create(body);
            await authModel.create({
            user_id: userDoc._id,
            user_type: userDoc.user_type,
            name: userDoc.name,
            login_id: login_id,
            password: hashedPassword,
            active: active,
            last_log_in: null,
            first_log_in: true,
            });
            res.status(201).json({ status: true, msg: "Support Admin created successfully.", doc:userDoc});
        } catch (err) {
            console.log("err", err)
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "Same code already exists. Please contact to technical team." });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    supportAdminDetails: async(req, res)=>{
        try {
            const params = req.params
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await userModel.findById({ _id: params.id });
            res.status(200).json({ doc: doc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    supportAdminUpdate: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await userModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "User updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    supportAdminDelete: async(req, res)=>{
        try {
            const params = req.params;
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            await userModel.findByIdAndDelete({ _id: params.id });
            await authModel.deleteOne({ user_id: params.id });
            res.status(200).json({ message: "Support User deleted successfully" });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    supportAdminUpdateActive: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await authModel.updateOne({user_id: params.id},{$set: body}, {new: true});
            res.status(200).json({ message: "Support User updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    companyList: async(req, res)=>{
        try {
            const docs = await companyModel.find();
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    companyCreate: async(req, res)=>{
        try {
            const body = req.body;
            if (!body.company_type || !body.name || !body.phone || !body.email || !body.pin || !body.address){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            body.createdBy = new ObjectId(req.user.id);
            body.updatedBy = new ObjectId(req.user.id);
            const codeGenerator =await require("../controllers/utilController").createCode("COMPANY");
            body.code = codeGenerator.code
            console.log("body", body)
            const doc = await companyModel.create(body);
            res.status(201).json({ status: true, msg: "Company created successfully.", doc:doc});
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "Same code already exists. Please contact to technical team." });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    companyDetails: async(req, res)=>{
        try {
            const params = req.params
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await userModel.findById({ _id: params.id });
            res.status(200).json({ doc: doc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    companyUpdate: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await userModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "User updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    companyDelete: async(req, res)=>{
        try {
            const params = req.params;
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            await userModel.findByIdAndDelete({ _id: params.id });
            await authModel.deleteOne({ user_id: params.id });
            res.status(200).json({ message: "Support User deleted successfully" });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    companyUpdateActive: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            console.log(req.body)
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await companyModel.updateOne({_id: new ObjectId(params.id)},{$set: body}, {new: true});
            res.status(200).json({ message: "Company activation status updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    }
}