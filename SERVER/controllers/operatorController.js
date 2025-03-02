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
const buyerModel = require("../models/buyers");
const billModel = require("../models/bills");
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
            if(!(stockDetailsBody[0].unique_code || stockDetailsBody[0].mfg_date || stockDetailsBody[0].exp_date || stockDetailsBody[0].item_buy_price || stockDetailsBody[0].item_sell_price || stockDetailsBody[0].warrantee_guarantee || stockDetailsBody[0].warrantee_guarantee_duration)){
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
                    sub_category : body.sub_category,
                    companyId : body.companyId,
                    active: true
                }
                const codeGenerator = await require("../controllers/utilController").createCode("ITEM");
                newItem.code = codeGenerator.code
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
            if(stockDetailsBody.length > 0){
                if(stockDetailsBody.length < itemQuantity){
                    body.mfg_date = additionalData.batch_mfg_date ? new Date(additionalData.batch_mfg_date): null;
                    body.exp_date = additionalData.batch_exp_date ? new Date(additionalData.batch_exp_date): null;
                    body.item_buy_price = additionalData.per_peace_buy_price ? Number(additionalData.per_peace_buy_price): null;
                    body.item_sell_price = additionalData.per_peace_sell_price ? Number(additionalData.per_peace_sell_price): null;
                    body.warrantee_guarantee = additionalData.batch_warrantee_guarantee ? additionalData.batch_warrantee_guarantee: null;
                    body.warrantee_guarantee_duration = additionalData.batch_warrantee_guarantee_duration ? Number(additionalData.batch_warrantee_guarantee_duration): null;
                    body.quantity = itemQuantity - stockDetailsBody.length;
                    finalStockBody.push(body);
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
            const company = await companyModel.findById({ _id: new ObjectId(companyId.company) },{name: 1, phone: 1, address: 1, gstNo: 1, company_type: 1, company_subtype: 1});
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
            doc.name = company.name;
            doc.address = company.address;
            doc.phone = company.phone;
            doc.gstNo = company.gstNo ? company.gstNo : "Not available";
            res.status(200).json({ doc: doc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    createBill: async(req, res)=>{
        try{
            const body = req.body
            const user = req.user
            console.log(body)
            if(!body || !body.company_id || !body.date){
                res.status(400).json({status: false, msg: "Missing Parameters!" });
                return;
            }
            body.buyer_id = null;
            if(body.buyer_name || body.buyer_phone){
                const matchString = {}
                if(body.buyer_name){matchString.name = body.buyer_name}
                if(body.buyer_phone){matchString.phone = body.buyer_phone}
                const buyerBody = {
                    name: body.buyer_name,
                    phone: body.buyer_phone,
                    email: body.buyer_email,
                    address: body.buyer_address,
                    pin: body.buyer_pin,
                    aadhar: body.buyer_aadhar,
                    active: true,
                    createdBy: new ObjectId(user.id),
                    updatedBy: new ObjectId(user.id)
                }
                const codeGenerator = await require("../controllers/utilController").createCode("BUYER");
                buyerBody.code = codeGenerator.code
                const buyerDoc = await buyerModel.updateOne(matchString, {$set: buyerBody}, {upsert: true, new: true});
                console.log("buyerDoc", buyerDoc)
                if (buyerDoc.matchedCount === 0 && buyerDoc.upsertedCount === 0) {
                    res.status(400).json({ msg: "We are facing some technical error! Please try again later." });
                    return;
                }
                body.buyer_id = buyerDoc.upsertedId;
            }
            for(let i=0; i<body.items.length; i++){
                body.items[i].item_id = new ObjectId(body.items[i].item_id)
                const ref = body.items[i];
                const stock = await stockModel.findOne({_id: ref.item_id});
                if (!stock) {
                  console.log("Stock not found");
                  return;
                }
            
                if (stock.quantity < ref.quantity) {
                  console.log("Not enough stock available");
                  return;
                }
                stock.quantity -= ref.quantity;
                if (!Array.isArray(stock.sell_details)) {
                    stock.sell_details = [];
                  }
                stock.sell_details.push({ buyer_id: body.buyer_id, sell_price: Number(ref.sell_price), quantity: Number(ref.quantity) });
                await stock.save();
            
                console.log("Stock updated successfully");
            }
            delete body.buyer_name
            delete body.buyer_phone
            delete body.buyer_email
            delete body.buyer_address
            delete body.buyer_aadhar
            delete body.buyer_pin
            body.company_id = new ObjectId(body.company_id);
            body.date = new Date(body.date);
            body.total = Number(body.total);
            body.additional_charges = body.additional_charges ? Number(body.additional_charges): 0;
            body.discount = body.discount ? Number(body.discount): 0;
            body.grandTotal = Number(body.grandTotal);
            body.paid_amount = body.paid_amount ? Number(body.paid_amount): 0;
            body.ramaining_amount = body.ramaining_amount ? Number(body.ramaining_amount): 0;
            const doc = await billModel.create(body)
            res.status(201).json({ status: true, msg: "Bill created successfully.", doc:doc});
        } catch(err){
            res.status(500).json({ status: false, msg: err.message });
        }
    },
}