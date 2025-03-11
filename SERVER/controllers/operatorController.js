const {ObjectId} = require('mongodb');
const moment = require('moment');
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
            if(stockDetailsBody.length > 0){
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
            if(finalStockBody.length < 1){res.status(400).json({ msg: "Missing Parameters!" }); return;}
            const doc = await stockModel.insertMany(finalStockBody);
            res.status(201).json({ status: true, msg: "Stock saved successfully.", doc:doc});
        } catch(err){
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    stockBulkUpdate: async(req, res) =>{
        try {
            const body = req.body;
            const userId = new ObjectId(req.user.id);
            if (!body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await stockModel.bulkWrite(
                body.map(update => ({
                  updateOne: {
                    filter: { _id: new ObjectId(update._id) },
                    update: { $set: { item_sell_price: update.item_sell_price, description: update.description, item_status: update.item_status, updatedBy: userId, updatedAt: new Date() } }
                  }
                }))
              );
            res.status(200).json({ message: "Operator Details updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    billCreate: async(req, res)=>{
        try{
            const body = req.body
            const user = req.user
            if(!body || !body.company_id){
                res.status(400).json({status: false, msg: "Missing Parameters!" });
                return;
            }
            body.buyer_id = null;
            body.date = new Date();
            body.billNo = uuidv4().replace(/-/g, '').substring(0, 12);
            if(body.buyer_name || body.buyer_phone){
                const matchString = {}
                if(body.buyer_name){matchString.name = body.buyer_name}
                if(body.buyer_phone){matchString.phone = body.buyer_phone}
                const buyerExists = await buyerModel.findOne(matchString);
                const buyerBody = {
                    name: body.buyer_name,
                    phone: body.buyer_phone,
                    email: body.buyer_email,
                    address: body.buyer_address,
                    pin: body.buyer_pin,
                    aadhar: body.buyer_aadhar,
                }
                if(buyerExists){
                    buyerBody.updatedBy= new ObjectId(user.id);
                    await buyerModel.updateOne({_id: buyerExists._id}, {$set: buyerBody})
                    body.buyer_id = buyerExists._id;
                } else{
                    buyerBody.companyId= new ObjectId(body.company_id),
                    buyerBody.active= true,
                    buyerBody.createdBy= new ObjectId(user.id);
                    const codeGenerator = await require("../controllers/utilController").createCode("BUYER");
                    buyerBody.code = codeGenerator.code
                    const buyerDoc = await buyerModel.create(buyerBody);
                    if (!buyerDoc) {
                        res.status(400).json({ msg: "We are facing some technical error! Please try again later." });
                        return;
                    }
                    body.buyer_id = buyerDoc._id;
                }
            }
            for(let i=0; i<body.items.length; i++){
                body.items[i].item_id = new ObjectId(body.items[i].item_id)
                const ref = body.items[i];
                const stock = await stockModel.findOne({_id: ref.item_id});
                if (!stock) {
                  res.status(400).json({ msg: "Stock not found" });
                  return;
                }
                
                if (stock.quantity < ref.quantity) {
                    res.status(400).json({ msg: "Not enough stock available" });
                    return;
                }
                stock.quantity -= ref.quantity;
                if (!Array.isArray(stock.sell_details)) {
                    stock.sell_details = [];
                  }
                stock.sell_details.push({ buyer_id: body.buyer_id, sell_price: Number(ref.sell_price), quantity: Number(ref.quantity) });
                await stock.save();
            }
            delete body.buyer_name
            delete body.buyer_phone
            delete body.buyer_email
            delete body.buyer_address
            delete body.buyer_aadhar
            delete body.buyer_pin
            body.company_id = new ObjectId(body.company_id);
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
    billUpdate: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await billModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "Details updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    generateBillPdf: async (req, res)=>{
        try{
            const params = req.params
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            let matchStage ={_id: new ObjectId(params.id)}
            let tempMatchStage ={}
            let company;
            let projectionStage ={_id: 1,
                    billNo: 1,
                    date: 1,
                    items: 1,
                    buyer: 1,
                    total: 1,
                    additional_charges: 1,
                    discount: 1,
                    grandTotal: 1,
                    payment_type: 1,
                    paid_amount: 1,
                    ramaining_amount: 1,
                    info: 1,
                    pending_installation: 1
                }
            
            if (userType === "COMPANY") {
                tempMatchStage.companyId = userId;
            } else if(userType === "OPERATOR"){
                let operator = await userModel.findOne({_id: userId}, {company: 1});
                tempMatchStage.companyId = new ObjectId(operator.company)
                company = await companyModel.findOne({_id: operator.company}, {name: 1, phone: 1, email: 1, address: 1, gstNo: 1});
            }
            const docs = await billModel.aggregate([
                {$match: matchStage},
                {$lookup: {from: "buyers",
                        localField: "buyer_id",
                        foreignField: "_id",
                        as: "buyer"}},
                {$addFields:{buyer:{ $arrayElemAt: ["$buyer", 0]}}},
                {$lookup: {from: "stocks",
                        localField: "items.item_id",
                        foreignField: "_id",
                        as: "itemDetails"}},
                {$addFields: {items: {$map: {input: "$items",
                                as: "item",
                                in: {sell_price: "$$item.sell_price",
                                    quantity: "$$item.quantity",
                                    item: {$arrayElemAt: [{$map: {
                                                    input: {$filter: {input: "$itemDetails",
                                                            as: "detail",
                                                            cond: { $eq: ["$$detail._id", "$$item.item_id"] }}},
                                                    as: "filteredItem",
                                                    in: {item_id: "$$filteredItem.itemId",
                                                        brand_id: "$$filteredItem.brandId",
                                                        batch_id: "$$filteredItem.batchId",
                                                        sub_category: "$$filteredItem.sub_category",
                                                        color: "$$filteredItem.color",
                                                        capacity: "$$filteredItem.capacity",
                                                        height: "$$filteredItem.height",
                                                        power: "$$filteredItem.power",
                                                        description: "$$filteredItem.description",
                                                        model: "$$filteredItem.model"}}},
                                            0]}}}}}},
                {$project: projectionStage}
            ]);
            const brands = await brandModel.find(tempMatchStage, {name: 1});
            const items = await itemModel.find(tempMatchStage, {name: 1});
        
            if(docs.length>0){
                for(let i=0; i<docs.length; i++){
                  const outerRef = docs[i];
                  outerRef.date = moment(outerRef.date).format('DD/MM/YYYY');
                  if(! outerRef.buyer){
                        outerRef.buyer = {name: "Not available",phone: "Not available",email: "Not available",aadhar: "Not available",pin: "Not available",address: "Not available",};
                  } else {
                        outerRef.buyer.name = outerRef.buyer.name ? outerRef.buyer.name : "Not available"
                        outerRef.buyer.phone = outerRef.buyer.phone ? outerRef.buyer.phone : "Not available"
                        outerRef.buyer.email = outerRef.buyer.email ? outerRef.buyer.email : "Not available"
                        outerRef.buyer.aadhar = outerRef.buyer.aadhar ? outerRef.buyer.aadhar : "Not available"
                        outerRef.buyer.pin = outerRef.buyer.pin ? outerRef.buyer.pin : "Not available"
                        outerRef.buyer.address = outerRef.buyer.address ? outerRef.buyer.address : "Not available"
                  }
                //   outerRef.buyer = outerRef.buyer ? outerRef.buyer : {name: "Not available",phone: "Not available",email: "Not available",aadhar: "Not available",pin: "Not available",address: "Not available",};
                  outerRef.pending_installation = outerRef.pending_installation ? outerRef.pending_installation : "N/A";
                  for(let j=0; j<outerRef.items.length; j++){
                    const ref = outerRef.items[j].item;
                    if(ref.brand_id){
                        for(let i=0; i<brands.length; i++){
                            if((brands[i]._id).toString() == (ref.brand_id).toString()){
                                ref.brand_name = brands[i].name;
                                break;     
                            }
                        }
                    }
                    if(ref.item_id){
                        for(let i=0; i<items.length; i++){
                            if((items[i]._id).toString() == (ref.item_id).toString()){
                                ref.item_name = items[i].name;
                                break;     
                            }
                        }
                    }
                    ref.sub_category = ref.sub_category ? ref.sub_category: "N/A";
                    ref.color = ref.color ? ref.color: "N/A";
                    ref.capacity = ref.capacity ? ref.capacity: "N/A";
                    ref.height = ref.height ? ref.height: "N/A";
                    ref.power = ref.power ? ref.power: "N/A";
                    ref.description = ref.description ? ref.description: "N/A";
                    ref.model = ref.model ? ref.model: "N/A";
                }
              } 
            }
            let doc = {}
            if(docs.length>0){
                doc=docs[0]
            } else{
                return res.status(400).json({ status: false, msg: 'Failed to generate PDF. Please try again later.' });
            }
            doc.userType = userType;
            doc.company = company;
            const pdfExportService = require("../services/pdfExportService");
            const result = await pdfExportService.generateBill(doc);
            
            if (!result.status) {
                return res.status(400).json({ status: false, msg: 'Failed to generate PDF' });
            }

            const pdfDoc = result.doc;
            
            // Set response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="tasting-report1.pdf"');

            // Pipe the PDF document directly to the response
            const { PassThrough } = require('stream');
            const stream = pdfDoc.pipe(new PassThrough());
            stream.pipe(res);

            pdfDoc.end();
        } catch(err){
            console.log(err)
            res.status(500).json({ status: false, msg: err.message });
        }
    },
}