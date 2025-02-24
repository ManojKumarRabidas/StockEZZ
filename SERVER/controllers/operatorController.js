const {ObjectId} = require('mongodb');
const { v4: uuidv4 } = require('uuid');
var _ = require('lodash');
const userModel = require("../models/user");
const stockModel = require("../models/stock");
const companyModel = require("../models/companies");
const categoryModel = require("../models/categories");
const sellerModel = require("../models/sellers");
const brandModel = require("../models/brands");
const itemModel = require("../models/items");
module.exports = {
    saveStockDetails: async(req, res)=>{
        try{
            const body = req.body.data;
            const additionalData = req.body.additionalData;
            if(!req.body || !req.body.data || !body.date || !body.item || !body.quantity || !req.body.additionalData || !additionalData.per_peace_buy_price){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            let stockDetailsBody = body.stock_details;
            if(!(stockDetailsBody.unique_code || stockDetailsBody.mfg_date || stockDetailsBody.exp_date || stockDetailsBody.item_buy_price || stockDetailsBody.item_sell_price || stockDetailsBody.warrantee_guarantee || stockDetailsBody.warrantee_guarantee_duration)){
                stockDetailsBody = []
            }
            delete body.stock_details;
            const finalStockBody = []
            const userId = new ObjectId(req.user.id);
            const company = req.body.company;
            body.companyId = new ObjectId(company._id);
            body.categoryId = new ObjectId(company.company_type_id);
            body.createdBy = new ObjectId(userId);
            body.updatedBy = new ObjectId(userId);
            body.date = new Date(body.date);
            body.time = body.time? new Date(body.time): null;
            if(body.sub_category){
                body.sub_category = body.sub_category.toUpperCase()
                if(!(company.company_subtypes.includes(body.sub_category.toUpperCase()))){
                    const doc = await categoryModel.updateOne(
                        {_id: new ObjectId(company.company_type_id)},
                        {$push: { sub_categories: body.sub_category }});
                    if(doc.modifiedCount<1){
                        res.status(400).json({ msg: "We are facing some technical error! Please try again later." });
                        return;
                    }
                }
            }
            if(body.itemId){
                body.itemId = new ObjectId(body.itemId);
            } else if(body.item){
                const newItem = {
                    name: body.item,
                    category : company.company_type_id,
                    companyId : body.companyId,
                    active: true
                }
                const codeGenerator = await require("../controllers/utilController").createCode("ITEM");
                newItem.code = codeGenerator.code
                // const doc = await itemModel.create(newItem);
                const doc = await itemModel.updateOne(
                    { name: { $regex: `^${newItem.name}$`, $options: "i" } },  // Case-insensitive match
                    { $setOnInsert: newItem }, 
                    { upsert: true }
                );
                
                if (doc.matchedCount === 0 && doc.upsertedCount === 0) {
                    res.status(400).json({ msg: "We are facing some technical error! Please try again later." });
                    return;
                }
                body.itemId = doc.upsertedId;
            }
            if(body.brandId){
                body.brandId = new ObjectId(body.brandId);
            } else if(body.brand){
                const newBrand = {
                    name: body.brand,
                    companyId : body.companyId,
                    active: true
                }
                const doc = await brandModel.updateOne(
                    { name: { $regex: `^${newBrand.name}$`, $options: "i" } },  // Case-insensitive match
                    { $setOnInsert: newBrand }, 
                    { upsert: true }
                );
                
                if (doc.matchedCount === 0 && doc.upsertedCount === 0) {
                    res.status(400).json({ msg: "We are facing some technical error! Please try again later." });
                    return;
                }
                body.brandId = doc.upsertedId;
            }
            if(body.sellerId){
                body.sellerId = new ObjectId(body.sellerId);
            } else if(body.seller){
                const newSeller = {
                    name: body.seller,
                    companyId : body.companyId,
                    active: true
                }
                const codeGenerator = await require("../controllers/utilController").createCode("SELLER");
                newSeller.code = codeGenerator.code
                const doc = await sellerModel.updateOne(
                    { name: { $regex: `^${newSeller.name}$`, $options: "i" } },  // Case-insensitive match
                    { $setOnInsert: newSeller }, 
                    { upsert: true }
                );
                
                if (doc.matchedCount === 0 && doc.upsertedCount === 0) {
                    res.status(400).json({ msg: "We are facing some technical error! Please try again later." });
                    return;
                }
                body.sellerId = doc.upsertedId;
            }
            const itemQuantity = body.quantity ? Number(body.quantity): 0;
            delete body.quantity;
            body.batchId = uuidv4().replace(/-/g, '').substring(0, 12);
            // additionalData.batch_buy_price = additionalData.batch_buy_price ? Number(additionalData.batch_buy_price): null;
            // additionalData.batch_sell_price = additionalData.batch_sell_price ? Number(additionalData.batch_sell_price): null;
            if(stockDetailsBody.length > 0){
                if(stockDetailsBody.length < itemQuantity){
                    const restIteration = itemQuantity - stockDetailsBody.length;
                    body.mfg_date = additionalData.batch_mfg_date ? new Date(additionalData.batch_mfg_date): null;
                    body.exp_date = additionalData.batch_exp_date ? new Date(additionalData.batch_exp_date): null;
                    body.item_buy_price = additionalData.per_peace_buy_price ? Number(additionalData.per_peace_buy_price): null;
                    body.item_sell_price = additionalData.per_peace_sell_price ? Number(additionalData.per_peace_sell_price): null;
                    body.warrantee_guarantee = additionalData.batch_warrantee_guarantee ? additionalData.batch_warrantee_guarantee: null;
                    body.warrantee_guarantee_duration = additionalData.batch_warrantee_guarantee_duration ? Number(additionalData.batch_warrantee_guarantee_duration): null;
                    body.quantity = itemQuantity - stockDetailsBody.length;
                    // for(let i=0; i<restIteration; i++){
                    finalStockBody.push(body);
                    // }
                }
                for(let i=0; i<stockDetailsBody.length; i++){
                    const ref = stockDetailsBody[i];
                    const newBody = Object.assign({}, body);
                    body.quantity = 1;
                    newBody.unique_code = ref.unique_code ? ref.unique_code : "";
                    newBody.mfg_date = ref.mfg_date ? new Date(ref.mfg_date) : (additionalData.batch_mfg_date ? new Date(additionalData.batch_mfg_date): null);
                    newBody.exp_date = ref.exp_date ? new Date(ref.exp_date) : (additionalData.batch_exp_date ? new Date(additionalData.batch_exp_date): null);
                    newBody.item_buy_price = ref.item_buy_price ? Number(ref.item_buy_price) : (additionalData.per_peace_buy_price ? Number(additionalData.per_peace_buy_price): null);
                    newBody.item_sell_price = ref.item_sell_price ? Number(ref.item_sell_price) : (additionalData.per_peace_sell_price ? Number(additionalData.per_peace_sell_price): null);
                    newBody.warrantee_guarantee = ref.warrantee_guarantee ? ref.warrantee_guarantee : ((additionalData.batch_warrantee_guarantee ? additionalData.batch_warrantee_guarantee: null));
                    newBody.warrantee_guarantee_duration = ref.warrantee_guarantee_duration ? Number(ref.warrantee_guarantee_duration) : (((additionalData.batch_warrantee_guarantee_duration ? Number(additionalData.batch_warrantee_guarantee_duration): null)));
                    finalStockBody.push(newBody);
                }
            }
            const doc = await stockModel.insertMany(finalStockBody);
            res.status(201).json({ status: true, msg: "Stock saved successfully.", doc:doc});
        } catch(err){
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    fetchCompanyDetails: async(req, res)=>{
        try {
            const userId = new ObjectId(req.user.id);
            const companyId = await userModel.findById({ _id: userId },{company: 1});
            if (!(companyId && companyId.company)){
                res.status(400).json({ msg: "We are facing some technical error! Please try again later 1." });
                return;
            }
            const company = await companyModel.findById({ _id: new ObjectId(companyId.company) },{company_type: 1, company_subtype: 1});
            if (!(company && company.company_type)){
                res.status(400).json({ msg: "We are facing some technical error! Please try again later 2." });
                return;
            }
            const category = await categoryModel.findById({ _id: new ObjectId(company.company_type)}, {category:1, sub_categories: 1})
            if (!(category && category.category)){
                res.status(400).json({ msg: "We are facing some technical error! Please try again later 3." });
                return;
            }
            const doc = {};
            doc._id = new ObjectId(company._id);
            doc.company_type_id = new ObjectId(company.company_type);
            doc.company_type = category.category;
            doc.company_subtype = company.company_subtype;
            doc.company_subtypes = category.sub_categories;
            res.status(200).json({ doc: doc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
}