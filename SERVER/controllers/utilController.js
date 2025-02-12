const {ObjectId} = require('mongodb');
const bcrypt = require('bcryptjs');
const codeSequenceModel = require("../models/codesequence");
const companyModel = require("../models/companies");
const userModel = require("../models/user");
const authModel = require("../models/authentication");
const stockStructureModel = require("../models/stockStructure");
module.exports = {
    createCode: async (userType) => {
        try {
            if(!userType){
                return {status: false, msg: "Undefined user type."};
            }
            let notation;
            if (userType == "SUPPORTADMIN") {
                notation = "SA";
            } else if (userType == "DIRECTOR") {
                notation = "DR";
            } else if (userType == "OPERATOR") {
                notation = "OP";
            } else if (userType == "COMPANY") {
                notation = "CP";
            } else if (userType == "SELLER") {
                notation = "SL";
            } else if (userType == "BUYER") {
                notation = "BY";
            } else if (userType == "ITEM") {
                notation = "IT";
            } else if (userType == "CATEGORY") {
                notation = "CT";
            } else {
                notation = "A";
            }
            const sequenceResult = await codeSequenceModel.findOneAndUpdate({user_type: userType}, {$inc: {value: 1}}, {
                upsert: true, returnDocument: "after", projection: {value: 1},
            });
            let code = ""+sequenceResult.value;
            code = notation+ (code.padStart(6, "0"));
            return {status: true, code: code};
        } catch (err) {
            return {status: false, code: null};
        }
    },
    getCompanyNames: async(req, res)=>{
        try {
            const companies = await companyModel.find({active: 1}).sort({name: 1});
            res.status(200).json({ companies: companies });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve companies" });
          }
    },
    getCustomizeAddStockDetails: async(req, res)=>{
        try {
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            if (userType === "COMPANY") {
                companyId = userId;
            } else if(userType === "OPERATOR"){
                let user = await userModel.findById(userId, {company:1});
                companyId = new ObjectId(user.company)
            }
            let stockStructure = await stockStructureModel.findOne({companyId: companyId});
            res.status(200).json({ stockStructure: stockStructure });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve stock structure" });
          }
    },

    operatorList: async(req, res)=>{
        try {
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            const matchStage = { user_type: { $in: ["OPERATOR"] } };

            if (userType === "COMPANY") {
                matchStage.company = { $in: [userId] };
            }
            const docs = await userModel.aggregate([
                {$match: matchStage},
                {$lookup: {from: "authentications",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "auth"}},
                {$unwind: "$auth"},
                {$lookup: {from: "companies",
                        localField: "company",
                        foreignField: "_id",
                        as: "company"}},
                {$unwind: "$auth"},
                {$project: { _id: 1,
                        code: 1,
                        company: "$company.name",
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
    operatorCreate: async(req, res)=>{
        try {
            const body = req.body;
            if (!body.company || !body.name || !body.phone || !body.email || !body.pin || !body.address){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            body.createdBy = new ObjectId(req.user.id);
            body.updatedBy = new ObjectId(req.user.id);
            body.user_type = "OPERATOR";
            const codeGenerator =await require("../controllers/utilController").createCode(body.user_type);
            body.code = codeGenerator.code
            const active = body.active;
            const password = body.phone;
            const login_id = body.code;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const userDoc = await userModel.create(body);
            await authModel.create({
            user_code: userDoc.code,
            user_id: userDoc._id,
            user_type: userDoc.user_type,
            name: userDoc.name,
            login_id: login_id,
            password: hashedPassword,
            active: active,
            last_log_in: null,
            first_log_in: true,
            });
            res.status(201).json({ status: true, msg: "Operator created successfully.", doc:userDoc});
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "Same code already exists. Please contact to technical team." });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    operatorDetails: async(req, res)=>{
        try {
            const params = req.params
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            // const doc = await userModel.findById({ _id: params.id });
            const docs = await userModel.aggregate([
                {$match: {_id: new ObjectId(params.id)}},
                {$lookup: {from: "authentications",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "auth"}},
                {$unwind: "$auth"},
                {$lookup: {from: "companies",
                        let: {companyId: "$company"},
                        pipeline: [{$match: {$expr: {$eq: ["$_id", "$$companyId"]}}},
                        {$project: {_id: 1, name: 1}}],
                        as: "company"}},
                {$unwind: "$company"},
                {$project: { _id: 1,
                        code: 1,
                        company:"$company._id",
                        name: 1,
                        phone:1,
                        email:1,
                        address:1,
                        pin:1,
                        active: "$auth.active"}}
            ]);
            let doc = {}
            if(docs.length>0){
                doc=docs[0]
            }
            res.status(200).json({ doc: doc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    operatorUpdate: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await userModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "Operator Details updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    operatorDelete: async(req, res)=>{
        try {
            const params = req.params;
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            await userModel.findByIdAndDelete({ _id: params.id });
            await authModel.deleteOne({ user_id: params.id });
            res.status(200).json({ message: "Operator deleted successfully" });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    operatorUpdateActive: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await authModel.updateOne({user_id: params.id},{$set: body}, {new: true});
            res.status(200).json({ message: "Operator updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
}    