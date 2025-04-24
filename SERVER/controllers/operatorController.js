const {ObjectId} = require('mongodb');
const mongoose = require('mongoose');
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
            if(!req.body || !req.body.data || !body.date || !body.item || !body.total_quantity || !req.body.additionalData || !additionalData.per_piece_buy_price){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            let stockDetailsBody = body.stock_details;
            if(!(stockDetailsBody[0].unique_code || stockDetailsBody[0].model || stockDetailsBody[0].brand || stockDetailsBody[0].color || stockDetailsBody[0].capacity || stockDetailsBody[0].height || stockDetailsBody[0].power || stockDetailsBody[0].description || stockDetailsBody[0].quantity || stockDetailsBody[0].mfg_date || stockDetailsBody[0].exp_date || stockDetailsBody[0].item_buy_price || stockDetailsBody[0].item_sell_price || stockDetailsBody[0].warrantee_guarantee || stockDetailsBody[0].warrantee_guarantee_duration)){
                stockDetailsBody = []
            }
            let detailsBodyTotalQuantity = 0
            if(stockDetailsBody.length>0){
                for(let i=0; i<stockDetailsBody.length; i++){
                    if(!stockDetailsBody[i].quantity){
                        res.status(400).json({ msg: "Missing quantity! Please re-check the entry." });
                        return;
                    }
                    detailsBodyTotalQuantity = detailsBodyTotalQuantity + Number(stockDetailsBody[i].quantity)
                }
            }
            delete body.stock_details;
            const finalStockBody = []
            const userId = new ObjectId(req.user.id);
            const company = req.body.company;
            body.company_id = new ObjectId(company._id);
            body.category_id = new ObjectId(company.company_type_id);
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
            if(body.item_id){
                body.item_id = new ObjectId(body.item_id);
            } else if(body.item){
                const newItem = {
                    name: body.item,
                    category : company.company_type_id,
                    sub_category : body.sub_category,
                    companyId : body.company_id,
                    active: true
                }
                const codeGenerator = await require("../controllers/utilController").createCode("ITEM");
                newItem.code = codeGenerator.code
                const doc = await itemModel.findOneAndUpdate(
                    { name: { $regex: `^${newItem.name}$`, $options: "i" } },  // Case-insensitive match
                    { $setOnInsert: newItem }, 
                    { upsert: true , returnDocument: 'after'}
                );

                if (!doc._id) {
                    res.status(400).json({ msg: "We are facing some technical error! Please try again later." });
                    return;
                }
                body.item_id = doc._id;
            }
            if(additionalData.batch_brand_id){
                body.brand_id = new ObjectId(additionalData.batch_brand_id);
            } else if(additionalData.batch_brand){
                const newBrand = {
                    name: additionalData.batch_brand,
                    companyId : body.company_id,
                    active: true
                }
                const doc = await brandModel.findOneAndUpdate(
                    { name: { $regex: `^${newBrand.name}$`, $options: "i" } },  // Case-insensitive match
                    { $setOnInsert: newBrand }, 
                    { upsert: true , returnDocument: 'after'}
                );
                
                if (!doc._id) {
                    res.status(400).json({ msg: "We are facing some technical error! Please try again later." });
                    return;
                }
                body.brand_id = doc._id;
            }
            if(body.seller_id){
                
                body.seller_id = new ObjectId(body.seller_id);
            } else if(body.seller){
                const newSeller = {
                    name: body.seller,
                    companyId : body.company_id,
                    active: true
                }
                const codeGenerator = await require("../controllers/utilController").createCode("SELLER");
                newSeller.code = codeGenerator.code
                const doc = await sellerModel.findOneAndUpdate(
                    { name: { $regex: `^${newSeller.name}$`, $options: "i" } },  // Case-insensitive match
                    { $setOnInsert: newSeller }, 
                    { upsert: true , returnDocument: 'after'}
                );
                
                if (!doc._id) {
                    res.status(400).json({ msg: "We are facing some technical error! Please try again later." });
                    return;
                }
                body.seller_id = doc._id;
            } else{
                body.seller_id = null;
            }
            const itemQuantity = body.total_quantity ? Number(body.total_quantity): 0;
            delete body.total_quantity;

            const d = new Date();
            const [dd, mm, yy, h, m] = [
              d.getDate(), d.getMonth() + 1, d.getFullYear() % 100,
              d.getHours(), d.getMinutes()
            ];
            const isPM = h >= 12;
            const hour12 = h % 12 || 12;
            const baseId = (dd < 10 ? '0' : '') + dd +
            (mm < 10 ? '0' : '') + mm +
            (yy < 10 ? '0' : '') + yy +
            (hour12 < 10 ? '0' : '') + hour12 +
            (m < 10 ? '0' : '') + m +
            (isPM ? 'PM' : 'AM')

            const baseUuid = uuidv4().replace(/-/g, '').substring(0, 5).toUpperCase();
            body.batch_id = baseId+baseUuid
            if(detailsBodyTotalQuantity < itemQuantity){
                // body.brand_id = body.brand_id ? additionalData.batch_brand_id: null;
                body.color = additionalData.batch_color ? additionalData.batch_color: null;
                body.capacity = additionalData.batch_capacity ? additionalData.batch_capacity: null;
                body.height = additionalData.batch_height ? additionalData.batch_height: null;
                body.power = additionalData.batch_power ? additionalData.batch_power: null;
                body.description = additionalData.batch_description ? additionalData.batch_description: null;
                body.model = additionalData.batch_model ? additionalData.batch_model: null;
                body.mfg_date = additionalData.batch_mfg_date ? new Date(additionalData.batch_mfg_date): null;
                body.exp_date = additionalData.batch_exp_date ? new Date(additionalData.batch_exp_date): null;
                body.item_buy_price = additionalData.per_piece_buy_price ? Number(additionalData.per_piece_buy_price): null;
                body.item_sell_price = additionalData.per_piece_sell_price ? Number(additionalData.per_piece_sell_price): 0;
                body.warrantee_guarantee = additionalData.batch_warrantee_guarantee ? additionalData.batch_warrantee_guarantee: null;
                body.warrantee_guarantee_duration = additionalData.batch_warrantee_guarantee_duration ? Number(additionalData.batch_warrantee_guarantee_duration): null;
                body.quantity = itemQuantity - detailsBodyTotalQuantity;
                body.total_quantity = itemQuantity - detailsBodyTotalQuantity;

                
                const descriptionParts = [];
                const descriptionKeyParts = [];
                if (body.item) {
                    descriptionParts.push(body.item);
                    descriptionKeyParts.push(body.item.trim().replace(/\s+/g, ''));
                }
                
                if (additionalData.batch_brand && additionalData.batch_brand.trim() !== "") {
                    descriptionParts.push(additionalData.batch_brand);
                    descriptionKeyParts.push(additionalData.batch_brand.trim().replace(/\s+/g, ''));
                }
                
                if (body.model && body.model.trim() !== "") {
                    descriptionParts.push(body.model);
                    descriptionKeyParts.push(body.model.trim().replace(/\s+/g, ''));
                }
                
                if (body.color && body.color.trim() !== "") {
                    descriptionParts.push(body.color);
                    descriptionKeyParts.push(body.color.trim().replace(/\s+/g, ''));
                }
                
                if (body.capacity && body.capacity.trim() !== "") {
                    descriptionParts.push(body.capacity);
                    descriptionKeyParts.push(body.capacity.trim().replace(/\s+/g, ''));
                }
                
                if (body.height && body.height.trim() !== "") {
                    descriptionParts.push(body.height);
                    descriptionKeyParts.push(body.height.trim().replace(/\s+/g, ''));
                }
                
                if (body.power && body.power.trim() !== "") {
                    descriptionParts.push(body.power);
                    descriptionKeyParts.push(body.power.trim().replace(/\s+/g, ''));
                }

                body.description_key = descriptionKeyParts.join("").toLowerCase();

                if (!body.description || body.description.trim() == "") {
                    body.description = descriptionParts.join(" ");
                }

                finalStockBody.push(body);
            }
            if(detailsBodyTotalQuantity > 0){
                for(let i=0; i<stockDetailsBody.length; i++){
                    const ref = stockDetailsBody[i];
                    const newBody = Object.assign({}, body);
                    newBody.quantity = ref.quantity;
                    newBody.total_quantity = ref.quantity;
                    if(ref.brand_id){
                        newBody.brand_id = new ObjectId(ref.brand_id);
                    } else if(ref.brand){
                        const newBrand = {
                            name: ref.brand,
                            companyId : body.company_id,
                            active: true
                        }
                        const doc = await brandModel.findOneAndUpdate(
                            { name: { $regex: `^${newBrand.name}$`, $options: "i" } },  // Case-insensitive match
                            { $setOnInsert: newBrand }, 
                            { upsert: true , returnDocument: 'after'}
                        );
                        
                        if (!doc._id) {
                            res.status(400).json({ msg: "We are facing some technical error! Please try again later." });
                            return;
                        }
                        newBody.brand_id = doc._id;
                    } else{
                        newBody.brand_id = body.brand_id ? body.brand_id: null;
                    }

                    newBody.color = ref.color ? ref.color: additionalData.batch_color;
                    newBody.capacity = ref.capacity ? ref.capacity: additionalData.batch_capacity;
                    newBody.height = ref.height ? ref.height: additionalData.batch_height;
                    newBody.power = ref.power ? ref.power: additionalData.batch_power;
                    newBody.description = ref.description ? ref.description: additionalData.batch_description;
                    newBody.model = ref.model ? ref.model: additionalData.batch_model;
                    newBody.unique_code = ref.unique_code ? ref.unique_code : "";
                    newBody.mfg_date = ref.mfg_date ? new Date(ref.mfg_date) : (additionalData.batch_mfg_date ? new Date(additionalData.batch_mfg_date): null);
                    newBody.exp_date = ref.exp_date ? new Date(ref.exp_date) : (additionalData.batch_exp_date ? new Date(additionalData.batch_exp_date): null);
                    newBody.item_buy_price = ref.item_buy_price ? Number(ref.item_buy_price) : (additionalData.per_piece_buy_price ? Number(additionalData.per_piece_buy_price): null);
                    newBody.item_sell_price = ref.item_sell_price ? Number(ref.item_sell_price) : (additionalData.per_piece_sell_price ? Number(additionalData.per_piece_sell_price): 0);
                    newBody.warrantee_guarantee = ref.warrantee_guarantee ? ref.warrantee_guarantee : ((additionalData.batch_warrantee_guarantee ? additionalData.batch_warrantee_guarantee: null));
                    newBody.warrantee_guarantee_duration = ref.warrantee_guarantee_duration ? Number(ref.warrantee_guarantee_duration) : (((additionalData.batch_warrantee_guarantee_duration ? Number(additionalData.batch_warrantee_guarantee_duration): null)));
                    
                    const descriptionParts = [];
                    const descriptionKeyParts = [];
                    if (newBody.item) {
                        descriptionParts.push(newBody.item);
                        descriptionKeyParts.push(newBody.item.trim().replace(/\s+/g, ''));
                    }
                    if (ref.brand && ref.brand.trim() !== "") {
                        descriptionParts.push(ref.brand);
                        descriptionKeyParts.push(ref.brand.trim().replace(/\s+/g, ''));
                    } else if (additionalData.batch_brand && additionalData.batch_brand.trim() != ""){
                        descriptionParts.push(additionalData.batch_brand);
                        descriptionKeyParts.push(additionalData.batch_brand.trim().replace(/\s+/g, ''));
                    }
                    if (newBody.model && newBody.model.trim() !== "") {
                        descriptionParts.push(newBody.model);
                        descriptionKeyParts.push(newBody.model.trim().replace(/\s+/g, ''));
                    }
                    if (newBody.color && newBody.color.trim() !== "") {
                        descriptionParts.push(newBody.color);
                        descriptionKeyParts.push(newBody.color.trim().replace(/\s+/g, ''));
                    }
                    if (newBody.capacity && newBody.capacity.trim() !== "") {
                        descriptionParts.push(newBody.capacity);
                        descriptionKeyParts.push(newBody.capacity.trim().replace(/\s+/g, ''));
                    }
                    if (newBody.height && newBody.height.trim() !== "") {
                        descriptionParts.push(newBody.height);
                        descriptionKeyParts.push(newBody.height.trim().replace(/\s+/g, ''));
                    }
                    if (newBody.power && newBody.power.trim() !== "") {
                        descriptionParts.push(newBody.power);
                        descriptionKeyParts.push(newBody.power.trim().replace(/\s+/g, ''));
                    }
                    newBody.description_key = descriptionKeyParts.join("").toLowerCase();

                    if (newBody.unique_code && newBody.unique_code.trim() !== "") {
                        descriptionParts.push(newBody.unique_code);
                    }
                    
                    if (!newBody.description || newBody.description.trim() == "") {
                        newBody.description = descriptionParts.join(" ");
                    }
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
            body.bill_no = uuidv4().replace(/-/g, '').substring(0, 12);
            body.bill_type = "FRESH";
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
            let total_profit = 0
            for(let i=0; i<body.items.length; i++){
                const ref = body.items[i];
                body.items[i].item_id = new ObjectId(body.items[i].item_id)
                const profit = (Number(ref.sell_price) - Number(ref.buy_price)) * Number(ref.quantity);
                total_profit = total_profit + profit;
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
            body.grand_total = Number(body.grand_total);
            body.paid_amount = body.paid_amount ? Number(body.paid_amount): 0;
            body.remaining_amount = body.remaining_amount ? Number(body.remaining_amount): 0;
            body.expected_profit = (total_profit+body.additional_charges-body.discount);
            body.total_profit = body.expected_profit - body.remaining_amount;
            body.payments = [
                {
                    paid_amount: body.paid_amount,
                    payment_mode: body.payment_mode,
                    info: body.info,
                    updatedBy: new ObjectId(user.id),
                    billed_at: new Date()
                }
            ]
            const doc = await billModel.create(body)

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
                const profit = (Number(ref.sell_price) - Number(ref.buy_price)) * Number(ref.quantity);
                stock.sell_details.push({bill_id: doc._id, buyer_id: body.buyer_id, sell_price: Number(ref.sell_price), quantity: Number(ref.quantity), returned_quantity: 0, profit: profit });
                await stock.save();
            }


            res.status(201).json({ status: true, msg: "Bill created successfully.", doc:doc});
        } catch(err){
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    billUpdate: async(req, res)=>{
        try {
            const { id } = req.params;
            const body = req.body;
        
            if (!id || !body) {
                return res.status(400).json({ msg: "Missing Parameters!" });
            }
            // Extract payment-related fields to be pushed
            const paymentEntry = {
                paid_amount: body.paid_amount,
                payment_mode: body.payment_mode,
                info: body.info,
                updatedBy: new ObjectId(req.user.id)
            };
        
            // Fields to be updated directly
            const billFieldsToUpdate = {
                total_profit: Number(body.expected_profit) - Number(body.remaining_amount),
                paid_amount: Number(body.prev_paid_amount)+Number(body.paid_amount),
                remaining_amount: body.remaining_amount,
                installation_status: body.installation_status,
                updatedAt: new Date()
            };
        
            // First update installation_status and info
            const updatedBill = await billModel.findByIdAndUpdate(
                id,
                {
                $set: billFieldsToUpdate,
                $push: { payments: paymentEntry }
                },
                { new: true, runValidators: true }
            );
        
            if (!updatedBill) {
                return res.status(404).json({ msg: "Bill not found!" });
            }

            res.status(200).json({ message: "Details updated successfully" });
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
                    bill_no: 1,
                    date: 1,
                    items: 1,
                    buyer: 1,
                    total: 1,
                    additional_charges: 1,
                    discount: 1,
                    grand_total: 1,
                    paid_amount: 1,
                    remaining_amount: 1,
                    info: 1,
                    installation_status: 1,
                    payments: 1,
                    bill_type: 1
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
                                                    in: {sub_category: "$$filteredItem.sub_category",
                                                        description: "$$filteredItem.description"}}},
                                            0]}}}}}},
                {$project: projectionStage}
            ]);
        
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
                  outerRef.installation_status = outerRef.installation_status ? outerRef.installation_status : "N/A";
                  outerRef.payment_mode = outerRef.payments ? outerRef.payments[0].payment_mode : "N/A";
                  for(let j=0; j<outerRef.items.length; j++){
                    const ref = outerRef.items[j].item;
                   
                    ref.sub_category = ref.sub_category ? ref.sub_category: "N/A";
                    ref.description = ref.description ? ref.description: "N/A";
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
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    manageStock: async(req, res)=>{
        try{
            const body = req.body;
            const userId = new ObjectId(req.user.id);
            if (!body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            let action;
            if(body.type == "DAMAGE"){
                action = "damages"
            } else if (body.type == "RETURN"){
                action = "returns_to_seller"
            } else if (body.type == "CLEAR"){
                action = "clears"
            }
            const bulkOps = body.docs.map(update => ({
                updateOne: {
                    filter: { _id: new ObjectId(update._id) },
                    update: {
                        $inc: { quantity: -update.quantity },
                        $push: {
                            [action]: {
                                quantity: update.quantity,
                                reason: update.reason,
                                updatedBy: userId,
                                updatedAt: new Date()
                            }
                        }
                    },
                    upsert: true
                }
            }));
    
            await stockModel.bulkWrite(bulkOps);
            res.status(200).json({status: true});
        } catch(err){
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    generateSellerInvoicePdf: async (req, res)=>{
        try{
            const body = req.body;
            if (!body || !Array.isArray(body)) {
                res.status(400).json({ msg: "Invalid or missing parameters!" });
                return;
            }
            const itemMap = new Map(body.map(item => [item._id.toString(), item.quantity]));
            const docs = await stockModel.aggregate([
                { $match: { _id: { $in: [...itemMap.keys()].map(_id => new ObjectId(_id)) } } },
                {
                    $lookup: {
                        from: "sellers",
                        localField: "seller_id",
                        foreignField: "_id",
                        as: "seller"
                    }
                },
                { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },
                {
                    $project: {
                        _id: 1,
                        date: 1,
                        description: 1,
                        challan_no: 1,
                        batch_no: 1,
                        batch_id: 1,
                        seller: "$seller.name",
                        quantity: 1,
                        item_buy_price: 1,
                    }
                }
            ]);
            if (docs.length === 0) {
                res.status(404).json({ msg: "No records found!" });
                return;
            }
            // Check if all `challan_no` and `seller` values are the same
            const firstChallanNo = docs[0].challan_no;
            const firstSeller = docs[0].seller;
            const isValid = docs.every(doc => doc.challan_no === firstChallanNo && doc.seller === firstSeller);

            if (!isValid) {
                res.status(400).json({ status: false, msg: "Must be same seller and challan no" });
                return;
            }

            let grand_total = 0;
            const updatedDocs = docs.map(doc => {
                let plainDoc = { ...doc };  // Convert to plain object
                const updatedQuantity = itemMap.get(doc._id.toString()); // Ensure lookup by string ID
                plainDoc.date = moment(plainDoc.date).format('DD/MM/YY');
                plainDoc.quantity = updatedQuantity !== undefined ? updatedQuantity : plainDoc.quantity; // Update quantity
                plainDoc.total = plainDoc.quantity * plainDoc.item_buy_price; // Calculate total (quantity + item_buy_price)
                grand_total += plainDoc.total; // Add to grand_total
                return plainDoc;
            });

            // Response format
            let doc = {
                challan_no: firstChallanNo,
                seller: firstSeller,
                grand_total: grand_total,
                items: updatedDocs // The modified array
            };
            const userId = new ObjectId(req.user.id);
            let operator = await userModel.findOne({_id: userId}, {company: 1, name: 1, code: 1});
            company = await companyModel.findOne({_id: operator.company}, {name: 1, phone: 1, email: 1, address: 1, gstNo: 1});

            doc.operator = operator.code+"-"+operator.name;
            doc.company = company;
            doc.today = moment(new Date()).format('DD/MM/YYYY');
            const pdfExportService = require("../services/pdfExportService");
            const result = await pdfExportService.generateSellerInvoice(doc);
            
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
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    // billReCreateOld1: async(req, res)=>{
    //     try{
    //         console.log(req.body)
    //         const body = req.body
    //         const userId = new ObjectId(req.user.id);
    //         const oldBillId = body.bill_id;
    //         const oldBill = await billModel.findById({ _id: body.bill_id });
    //         const newBill = oldBill.toObject();
    //         delete newBill._id;
    //         // console.log(newBill);
    //         newBill.bill_type = "RE-CREATED";
    //         newBill.date = new Date();
    //         let total = 0;
    //         let expected_profit = 0;
    //         for(let i=0; i<newBill.items.length; i++) {
    //             const ref = newBill.items[i];
    //             for(j=0; j<body.returnItems.length; j++){
    //                 const innerRef = body.returnItems[j];
    //                 if(ref.item_id.toString() == innerRef.item_id){
    //                     if(innerRef.return_type == "RETURN"){
    //                         ref.quantity = ref.quantity-innerRef.quantity;

    //                         const stock = await stockModel.findOne({_id: new ObjectId(innerRef.item_id)});
    //                         if (!stock) {
    //                             res.status(400).json({ msg: "Stock not found" });
    //                             return;
    //                         }
                            
    //                         stock.quantity += innerRef.quantity;
    //                         // Ensure sell_details is an array
    //                         if (!Array.isArray(stock.sell_details)) {
    //                             stock.sell_details = [];
    //                         }
                            
    //                         // Find matching sell_details entry for the buyer
    //                         const sellDetailIndex = stock.sell_details.findIndex(detail =>
    //                             detail.bill_id.toString() === oldBillId.toString()
    //                         );
                            
    //                         // If found, update returned_quantity
    //                         if (sellDetailIndex !== -1) {
    //                             const existingReturned = stock.sell_details[sellDetailIndex].returned_quantity || 0;
    //                             stock.sell_details[sellDetailIndex].returned_quantity = existingReturned + innerRef.quantity;
    //                         } else {
    //                             return res.status(400).json({ status: false, msg: "Buyer not found in sell_details. No returned_quantity updated." });
                            
    //                         }
                            
    //                         // Save the updated stock document
    //                         await stock.save();
    //                     // } else if (innerRef.return_type == "EXCHANGE"){
    //                     //     const stocks = await stockModel.find({company_id: new ObjectId(newBill.company_id), description_key: innerRef.description_key, quantity: {$gt: 0}}).sort({ createdAt: -1 });
    //                     //     if (stocks.length<=0) {
    //                     //         res.status(400).json({ msg: "No such stocks not found" });
    //                     //         return;
    //                     //     }
    //                     //     for(let k=0; k<stocks.length; k++){
    //                     //         if((stocks[k]._id).toString() == innerRef.item_id){
    //                     //             const stockRef = stocks[k];
    //                     //             if(stockRef.quantity >= innerRef.quantity){
    //                     //                 if (!Array.isArray(stockRef.sell_details)) {
    //                     //                     stockRef.sell_details = [];
    //                     //                 }
                                        
    //                     //                 // Find matching sell_details entry for the buyer
    //                     //                 const sellDetailIndex = stockRef.sell_details.findIndex(detail =>
    //                     //                     detail.bill_id.toString() === oldBillId.toString()
    //                     //                 );
                                        
    //                     //                 // If found, update returned_quantity
    //                     //                 if (sellDetailIndex !== -1) {
    //                     //                     const existingReplaced = stockRef.sell_details[sellDetailIndex].replaced_quantity || 0;
    //                     //                     stockRef.sell_details[sellDetailIndex].replaced_quantity = existingReplaced + innerRef.quantity;
    //                     //                 } else {
    //                     //                     return res.status(400).json({ status: false, msg: "Buyer not found in sell_details. No returned_quantity updated." });
                                        
    //                     //                 }
    //                     //             }
    //                     //         }
    //                     //     }
    //                     //     await stocks.save();
    //                     // }
    //                     } else if (innerRef.return_type === "EXCHANGE") {
    //                         const requiredQty = innerRef.quantity;
    //                         let remainingQty = requiredQty;
                        
    //                         // Fetch all stocks with the same description_key and company_id, sorted oldest first
    //                         const stocks = await stockModel.find({
    //                             company_id: new ObjectId(newBill.company_id),
    //                             description_key: innerRef.description_key
    //                         }).sort({ createdAt: 1 });
                        
    //                         if (!stocks || stocks.length === 0) {
    //                             return res.status(400).json({ msg: "No matching stock found for exchange." });
    //                         }
                        
    //                         const stockMap = new Map();
    //                         let originalStock = null;
                        
    //                         // Prepare a quick lookup for sell_details updates
    //                         const updateSellDetails = (stock, quantity) => {
    //                             if (!Array.isArray(stock.sell_details)) {
    //                                 stock.sell_details = [];
    //                             }
                        
    //                             const index = stock.sell_details.findIndex(detail =>
    //                                 detail.bill_id.toString() === oldBillId.toString()
    //                             );
                        
    //                             if (index !== -1) {
    //                                 stock.sell_details[index].replaced_quantity =
    //                                     (stock.sell_details[index].replaced_quantity || 0) + quantity;
    //                             } else {
    //                                 stock.sell_details.push({
    //                                     bill_id: oldBillId,
    //                                     buyer_id: newBill.buyer_id,
    //                                     sell_price: 0, // No actual selling price in exchange
    //                                     quantity: 0, // No new quantity sold
    //                                     returned_quantity: 0, // Not a return
    //                                     replaced_quantity: quantity, // Quantity exchanged
    //                                     profit: 0, // No profit involved in exchange
    //                                     sold_at: new Date()
    //                                 });
    //                             }
    //                         };
                        
    //                         // Track which stocks need to be saved
    //                         const stocksToSave = [];
                        
    //                         for (const stock of stocks) {
    //                             if (stock._id.toString() === innerRef.item_id) {
    //                                 originalStock = stock;
    //                             }
                        
    //                             if (stock.quantity <= 0) continue;
                        
    //                             const usedQty = Math.min(stock.quantity, remainingQty);
    //                             stock.quantity -= usedQty;
    //                             updateSellDetails(stock, usedQty);
    //                             stocksToSave.push(stock);
                        
    //                             remainingQty -= usedQty;
    //                             if (remainingQty === 0) break;
    //                         }
                        
    //                         // Ensure sell_details entry is updated in the originalStock even if it didn’t supply quantity
    //                         if (originalStock && !stocksToSave.includes(originalStock)) {
    //                             updateSellDetails(originalStock, requiredQty);
    //                             stocksToSave.push(originalStock);
    //                         }
                        
    //                         if (remainingQty > 0) {
    //                             return res.status(400).json({ msg: `Only partial stock (${requiredQty - remainingQty}/${requiredQty}) available for exchange.` });
    //                         }
                        
    //                         // Save all updated stocks
    //                         await Promise.all(stocksToSave.map(stock => stock.save()));
    //                     }
    //                 }
    //             }
    //             total = total+(ref.sell_price * ref.quantity);
    //             expected_profit = expected_profit + ((ref.sell_price - ref.buy_price) * ref.quantity);
    //         }
    //         for(let i=0; i<body.newAddedItems.length; i++) {
    //             const ref = body.newAddedItems[i];
    //             ref.item_id = new ObjectId(ref.item_id);
    //             const stock = await stockModel.findOne({_id: ref.item_id});
    //             if (!stock) {
    //               res.status(400).json({ msg: "Stock not found" });
    //               return;
    //             }
                
    //             if (stock.quantity < ref.quantity) {
    //                 res.status(400).json({ msg: "Not enough stock available" });
    //                 return;
    //             }
    //             stock.quantity -= ref.quantity;
    //             if (!Array.isArray(stock.sell_details)) {
    //                 stock.sell_details = [];
    //               }
    //             const profit = (Number(ref.sell_price) - Number(ref.buy_price)) * Number(ref.quantity);
    //             stock.sell_details.push({ buyer_id: newBill.buyer_id, sell_price: Number(ref.sell_price), quantity: Number(ref.quantity), profit: profit });
    //             await stock.save();
    //             total = total+(ref.sell_price * ref.quantity);
    //             expected_profit = expected_profit + ((ref.sell_price - ref.buy_price) * ref.quantity);
    //             newBill.items.push(ref)
    //         }
    //         newBill.total = total
    //         newBill.expected_profit = expected_profit;
    //         newBill.grand_total = ((total+newBill.additional_charges)-newBill.discount);
    //         newBill.total_profit = (newBill.expected_profit-newBill.paid_amount);
    //         newBill.remaining_amount = (newBill.grand_total-newBill.paid_amount);
    //         console.log("newBill", newBill)
    //         const newBillDoc = await billModel.create(newBill);
    //         const updateOldBill = await billModel.findByIdAndUpdate(oldBillId, {bill_type: "CANCELLED"}, {new: true});
    //         console.log(newBillDoc, updateOldBill)
    //         res.status(200).json({status: true, doc: newBillDoc});
    //     } catch(err){
    //         console.log(err)
    //         res.status(500).json({ status: false, msg: err.message });
    //     }
    // },
    
    // billReCreateOld2: async (req, res) => {
    //     const session = await mongoose.startSession();
    //     session.startTransaction();
      
    //     try {
    //       const body = req.body;
    //       const userId = new ObjectId(req.user.id);
    //       const oldBillId = body.bill_id;
      
    //       const oldBill = await billModel.findById(oldBillId).session(session);
    //       if (!oldBill) throw new Error("Old bill not found");
      
    //       const newBill = oldBill.toObject();
    //       delete newBill._id;
      
    //       newBill.bill_type = "RE-CREATED";
    //       newBill.date = new Date();
    //       newBill.items = [...newBill.items];
    //       let total = 0;
    //       let expected_profit = 0;
      
    //       for (let i = 0; i < newBill.items.length; i++) {
    //         const ref = newBill.items[i];
    //         const returnItem = body.returnItems.find(item => item.item_id === ref.item_id.toString());
    //         if (!returnItem) continue;
      
    //         const { item_id, return_type, quantity, description_key } = returnItem;
      
    //         const stock = await stockModel.findById(item_id).session(session);
    //         if (!stock) throw new Error("Stock not found");
      
    //         if (return_type === "RETURN") {
    //           ref.quantity -= quantity;
    //           stock.quantity += quantity;
      
    //           if (!Array.isArray(stock.sell_details)) stock.sell_details = [];
    //           const detail = stock.sell_details.find(d => d.bill_id.toString() === oldBillId.toString());
      
    //           if (!detail) throw new Error("Buyer not found in sell_details. No returned_quantity updated.");
    //           detail.returned_quantity = (detail.returned_quantity || 0) + quantity;
      
    //           await stock.save({ session });
    //         } else if (return_type === "EXCHANGE") {
    //           const exchangeQty = quantity;
      
    //           const stockList = await stockModel.find({
    //             company_id: new ObjectId(newBill.company_id),
    //             description_key: description_key
    //           }).sort({ createdAt: 1 }).session(session);
      
    //           if (stockList.length === 0) throw new Error("No matching stocks found for exchange");
      
    //           let remainingQty = exchangeQty;
      
    //           for (let k = 0; k < stockList.length && remainingQty > 0; k++) {
    //             const currentStock = stockList[k];
      
    //             if (currentStock.quantity <= 0) continue;
      
    //             const availableQty = currentStock._id.toString() === item_id ? currentStock.quantity : Math.min(currentStock.quantity, remainingQty);
    //             const usedQty = Math.min(remainingQty, availableQty);
      
    //             if (usedQty <= 0) continue;
      
    //             // Deduct from current stock if it’s not the matched one
    //             if (currentStock._id.toString() !== item_id) {
    //               currentStock.quantity -= usedQty;
    //             }
      
    //             if (!Array.isArray(currentStock.sell_details)) currentStock.sell_details = [];
    //             const detail = currentStock.sell_details.find(d => d.bill_id.toString() === oldBillId.toString());
      
    //             if (detail) {
    //               detail.replaced_quantity = (detail.replaced_quantity || 0) + usedQty;
    //             } else {
    //               currentStock.sell_details.push({
    //                 bill_id: oldBillId,
    //                 buyer_id: newBill.buyer_id,
    //                 sell_price: 0,
    //                 quantity: 0,
    //                 returned_quantity: 0,
    //                 replaced_quantity: usedQty,
    //                 profit: 0,
    //                 sold_at: new Date()
    //               });
    //             }
      
    //             await currentStock.save({ session });
    //             remainingQty -= usedQty;
    //           }
      
    //           if (remainingQty > 0) {
    //             throw new Error("Insufficient stock to complete exchange");
    //           }
    //         }
      
    //         total += ref.sell_price * ref.quantity;
    //         expected_profit += (ref.sell_price - ref.buy_price) * ref.quantity;
    //       }
      
    //       for (let i = 0; i < body.newAddedItems.length; i++) {
    //         const ref = body.newAddedItems[i];
    //         ref.item_id = new ObjectId(ref.item_id);
      
    //         const stock = await stockModel.findById(ref.item_id).session(session);
    //         if (!stock) throw new Error("Stock not found");
      
    //         if (stock.quantity < ref.quantity) throw new Error("Not enough stock available");
      
    //         stock.quantity -= ref.quantity;
    //         if (!Array.isArray(stock.sell_details)) stock.sell_details = [];
      
    //         const profit = (ref.sell_price - ref.buy_price) * ref.quantity;
    //         stock.sell_details.push({
    //           bill_id: oldBillId,
    //           buyer_id: newBill.buyer_id,
    //           sell_price: ref.sell_price,
    //           quantity: ref.quantity,
    //           returned_quantity: 0,
    //           replaced_quantity: 0,
    //           profit: profit,
    //           sold_at: new Date()
    //         });
      
    //         await stock.save({ session });
      
    //         total += ref.sell_price * ref.quantity;
    //         expected_profit += profit;
    //         newBill.items.push(ref);
    //       }
      
    //       newBill.total = total;
    //       newBill.expected_profit = expected_profit;
    //       newBill.grand_total = (total + newBill.additional_charges) - newBill.discount;
    //       newBill.total_profit = newBill.expected_profit - newBill.paid_amount;
    //       newBill.remaining_amount = newBill.grand_total - newBill.paid_amount;
      
    //       const newBillDoc = await billModel.create([newBill], { session });
    //       await billModel.findByIdAndUpdate(oldBillId, { bill_type: "CANCELLED" }, { session });
      
    //       await session.commitTransaction();
    //       session.endSession();
      
    //       res.status(200).json({ status: true, doc: newBillDoc[0] });
    //     } catch (err) {
    //       await session.abortTransaction();
    //       session.endSession();
    //       console.error("Transaction error:", err.message);
    //       console.log(err)
    //       res.status(400).json({ status: false, msg: err.message });
    //     }
    // },

    billReCreate: async (req, res) => {
        const sessionActions = []; // rollback stack
        try {
            const body = req.body;
            const userId = new ObjectId(req.user.id);
            const oldBillId = body.bill_id;
            const oldBill = await billModel.findById({ _id: oldBillId });
            const newBill = oldBill.toObject();
            delete newBill._id;
            newBill.bill_type = "RE-CREATED";
            newBill.date = new Date();
            
            let total = 0;
            let expected_profit = 0;
    
            for (let i = 0; i < newBill.items.length; i++) {
                const ref = newBill.items[i];
    
                for (let j = 0; j < body.returnItems.length; j++) {
                    const innerRef = body.returnItems[j];
                    if (ref.item_id.toString() === innerRef.item_id) {
                        const stock = await stockModel.findById(innerRef.item_id);
                        if (!stock) throw new Error("Stock not found");
    
                        if (innerRef.return_type === "RETURN") {
                            ref.quantity -= innerRef.quantity;
                            const oldQty = stock.quantity;
                            stock.quantity += innerRef.quantity;
    
                            // Initialize sell_details
                            if (!Array.isArray(stock.sell_details)) stock.sell_details = [];
    
                            const detailIndex = stock.sell_details.findIndex(d => d.bill_id.toString() === oldBillId.toString());
                            if (detailIndex !== -1) {
                                const originalReturned = stock.sell_details[detailIndex].returned_quantity || 0;
                                stock.sell_details[detailIndex].returned_quantity = originalReturned + innerRef.quantity;
                            } else {
                                throw new Error("Buyer not found in sell_details");
                            }
    
                            await stock.save();
    
                            // Rollback info
                            sessionActions.push(async () => {
                                stock.quantity = oldQty;
                                stock.sell_details[detailIndex].returned_quantity -= innerRef.quantity;
                                await stock.save();
                            });
    
                        } else if (innerRef.return_type === "EXCHANGE") {
                            const requiredQty = innerRef.quantity;
                            let remainingQty = requiredQty;
                            const stocks = await stockModel.find({
                                company_id: new ObjectId(newBill.company_id),
                                description_key: innerRef.description_key
                            }).sort({ createdAt: 1 });
    
                            if (!stocks.length) throw new Error("No matching stock found for exchange");
    
                            const usedStocks = [];
    
                            for (const stock of stocks) {
                                if (stock.quantity <= 0) continue;
                                const usedQty = Math.min(stock.quantity, remainingQty);
                                const oldQty = stock.quantity;
                                stock.quantity -= usedQty;
    
                                if (!Array.isArray(stock.sell_details)) stock.sell_details = [];
    
                                const detailIndex = stock.sell_details.findIndex(d => d.bill_id.toString() === oldBillId.toString());
    
                                if (detailIndex !== -1) {
                                    stock.sell_details[detailIndex].replaced_quantity =
                                        (stock.sell_details[detailIndex].replaced_quantity || 0) + usedQty;
                                } else {
                                    stock.sell_details.push({
                                        bill_id: oldBillId,
                                        buyer_id: newBill.buyer_id,
                                        sell_price: 0,
                                        quantity: 0,
                                        returned_quantity: 0,
                                        replaced_quantity: usedQty,
                                        profit: 0,
                                        sold_at: new Date()
                                    });
                                }
    
                                await stock.save();
                                usedStocks.push({ stock, oldQty, usedQty });
                                remainingQty -= usedQty;
                                if (remainingQty === 0) break;
                            }
    
                            if (remainingQty > 0) throw new Error(`Only partial stock (${requiredQty - remainingQty}/${requiredQty}) available for exchange`);
    
                            sessionActions.push(async () => {
                                for (const { stock, oldQty } of usedStocks) {
                                    stock.quantity = oldQty;
                                    const index = stock.sell_details.findIndex(d => d.bill_id.toString() === oldBillId.toString());
                                    if (index !== -1) {
                                        stock.sell_details[index].replaced_quantity -= usedStocks.find(u => u.stock._id.equals(stock._id)).usedQty;
                                    }
                                    await stock.save();
                                }
                            });
                        }
                    }
                }
    
                total += (ref.sell_price * ref.quantity);
                expected_profit += (ref.sell_price - ref.buy_price) * ref.quantity;
            }
    
            for (let i = 0; i < body.newAddedItems.length; i++) {
                const ref = body.newAddedItems[i];
                ref.item_id = new ObjectId(ref.item_id);
                const stock = await stockModel.findById(ref.item_id);
                if (!stock) throw new Error("Stock not found");
    
                if (stock.quantity < ref.quantity) throw new Error("Not enough stock");
    
                const oldQty = stock.quantity;
                stock.quantity -= ref.quantity;
    
                if (!Array.isArray(stock.sell_details)) stock.sell_details = [];
    
                const profit = (ref.sell_price - ref.buy_price) * ref.quantity;
                stock.sell_details.push({
                    buyer_id: newBill.buyer_id,
                    sell_price: ref.sell_price,
                    quantity: ref.quantity,
                    profit
                });
    
                await stock.save();
                sessionActions.push(async () => {
                    stock.quantity = oldQty;
                    stock.sell_details.pop(); // remove last entry
                    await stock.save();
                });
    
                total += ref.sell_price * ref.quantity;
                expected_profit += profit;
                newBill.items.push(ref);
            }
    
            newBill.total = total;
            newBill.expected_profit = expected_profit;
            newBill.grand_total = (total + newBill.additional_charges) - newBill.discount;
            newBill.total_profit = newBill.expected_profit - newBill.paid_amount;
            newBill.remaining_amount = newBill.grand_total - newBill.paid_amount;
    
            const newBillDoc = await billModel.create(newBill);
            sessionActions.push(async () => await billModel.findByIdAndDelete(newBillDoc._id));
    
            const updatedOld = await billModel.findByIdAndUpdate(oldBillId, { bill_type: "CANCELLED" }, { new: true });
            sessionActions.push(async () => await billModel.findByIdAndUpdate(oldBillId, { bill_type: oldBill.bill_type }));
    
            res.status(200).json({ status: true, doc: newBillDoc });
        } catch (err) {
            console.error("Error occurred. Rolling back...", err.message);
            for (let i = sessionActions.length - 1; i >= 0; i--) {
                try {
                    await sessionActions[i]();
                } catch (rollbackErr) {
                    console.error("Rollback failed at step", i, rollbackErr.message);
                }
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    }
    
      
}