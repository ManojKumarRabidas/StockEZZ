const {ObjectId} = require('mongodb')
const userModel = require("../models/user");
const authModel = require("../models/authentication");
const companyModel = require("../models/companies");
const categoryModel = require("../models/categories");
const itemModel = require("../models/items");
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
            res.status(201).json({ status: true, msg: "Support Admin created successfully.", doc:userDoc});
        } catch (err) {
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
            const matchFilter = {};
            if(req.user.user_type == "COMPANY"){
                matchFilter._id = new ObjectId(req.user.id)
            }
            const docs = await companyModel.find(matchFilter);
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    companyCreate: async(req, res)=>{
        try {
            const body = req.body;
            if (!body.company_type || !body.name || !body.phone || !body.email || !body.pin || !body.address || !body.director){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            body.createdBy = new ObjectId(req.user.id);
            body.updatedBy = new ObjectId(req.user.id);
            body.company_type = new ObjectId(body.company_type);
            const codeGenerator =await require("../controllers/utilController").createCode("COMPANY");
            body.code = codeGenerator.code
            const active = body.active;
            const password = body.phone;
            const login_id = body.code;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const companyDoc = await companyModel.create(body);
            await authModel.create({
            user_code: companyDoc.code,
            user_id: companyDoc._id,
            user_type: "COMPANY",
            name: companyDoc.name,
            login_id: login_id,
            password: hashedPassword,
            active: active,
            last_log_in: null,
            first_log_in: true,
            });
            res.status(201).json({ status: true, msg: "Company created successfully.", doc:companyDoc});
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
            const doc = await companyModel.findById({ _id: params.id });
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
            const doc = await companyModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "Company updated successfully", doc: doc });
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
            await companyModel.findByIdAndDelete({ _id: params.id });
            await authModel.deleteOne({ user_id: params.id });
            res.status(200).json({ message: "Company deleted successfully" });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    companyUpdateActive: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
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
    },

    categoryList: async(req, res)=>{
        try {
            const cmpVal = req.headers.value;
            const activeStatus = req.headers.active;
            let docs;
            if(cmpVal && activeStatus){
                docs = await categoryModel.find({category: {$regex: cmpVal, $options: "i"}, active: true}, {category: 1, sub_categories: 1}).limit(10);
            } else if(activeStatus){
                docs = await categoryModel.find({active: true}, {category: 1, sub_categories: 1});
            } else {
                docs = await categoryModel.find().lean();
                for(let i=0; i<docs.length; i++){
                    if(docs[i].sub_categories && ((docs[i].sub_categories).length > 0)){
                        docs[i].sub_categories = (docs[i].sub_categories).toString();
                    }
                }
            }
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    categoryCreate: async(req, res)=>{
        try {
            const body = req.body;
            if (!body.category ){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            body.createdBy = new ObjectId(req.user.id);
            body.updatedBy = new ObjectId(req.user.id);
            const codeGenerator =await require("../controllers/utilController").createCode("CATEGORY");
            body.code = codeGenerator.code
            const doc = await categoryModel.create(body);
            res.status(201).json({ status: true, msg: "Company created successfully.", doc:doc});
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "Same Code/Category already exists. Please contact to technical team." });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    categoryDetails: async(req, res)=>{
        try {
            const params = req.params
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await categoryModel.findById({ _id: params.id });
            res.status(200).json({ doc: doc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    categoryUpdate: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await categoryModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "Category updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    categoryDelete: async(req, res)=>{
        try {
            const params = req.params;
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            await categoryModel.findByIdAndDelete({ _id: params.id });
            res.status(200).json({ message: "Category deleted successfully" });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    categoryUpdateActive: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await categoryModel.updateOne({_id: new ObjectId(params.id)},{$set: body}, {new: true});
            res.status(200).json({ message: "Category activation status updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },

    itemList: async(req, res)=>{
        try {
            const cmpVal = req.headers.value;
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            const activeStatus = req.headers.active;
            let matchStage = {};
            let projectionStage = {};
            let companyIds;
            if (userType === "COMPANY") {
                companyIds = [userId, new ObjectId("67a826f87c2ba5493e1d7a1f")];
            } else if(userType === "OPERATOR"){
                let user = await userModel.findById(userId, {company:1});
                companyIds = [new ObjectId(user.company), new ObjectId("67a826f87c2ba5493e1d7a1f")]
            }
            if(activeStatus && cmpVal){
                matchStage = {companyId: {$in: companyIds}, active: true, name: {$regex: cmpVal, $options: "i"}} 
                projectionStage = {name: 1}
            } else if(activeStatus){
                matchStage = {companyId: {$in: companyIds},  active: true}
            } else{
                if (userType != ("ADMIN" && "SUPPORTADMIN")) {
                    matchStage = {companyId: {$in: companyIds}}
                }
            }
            const docs = await itemModel.find(matchStage, projectionStage);
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    itemCreate: async(req, res)=>{
        try {
            const body = req.body;
            if (!body.name || !body.category ){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            if (userType === ("ADMIN" || "SUPPORTADMIN")) {
                body.companyId = new ObjectId("67a826f87c2ba5493e1d7a1f"); // Id of Admin user
            } else if (userType === "COMPANY") {
                body.companyId = userId;
            } else if(userType === "OPERATOR"){
                let user = await userModel.findById(userId, {company:1});
                body.companyId = new ObjectId(user.company)
            }
            body.createdBy = new ObjectId(req.user.id);
            body.updatedBy = new ObjectId(req.user.id);
            const codeGenerator =await require("../controllers/utilController").createCode("ITEM");
            body.code = codeGenerator.code
            const doc = await itemModel.create(body);
            res.status(201).json({ status: true, msg: "Item created successfully.", doc:doc});
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "Same Code/Item already exists. Please contact to technical team." });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    itemDetails: async(req, res)=>{
        try {
            const params = req.params
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await itemModel.findById({ _id: params.id });
            res.status(200).json({ doc: doc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    itemUpdate: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await itemModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "Item updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    itemDelete: async(req, res)=>{
        try {
            const params = req.params;
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            await itemModel.findByIdAndDelete({ _id: params.id });
            res.status(200).json({ message: "Item deleted successfully" });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    itemUpdateActive: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await itemModel.updateOne({_id: new ObjectId(params.id)},{$set: body}, {new: true});
            res.status(200).json({ message: "Item activation status updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    }
}