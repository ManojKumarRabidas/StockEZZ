const {ObjectId} = require('mongodb');
const moment = require('moment');
const bcrypt = require('bcryptjs');
const codeSequenceModel = require("../models/codesequence");
const companyModel = require("../models/companies");
const userModel = require("../models/user");
const authModel = require("../models/authentication");
const stockStructureModel = require("../models/stockStructure");
const buyerModel = require("../models/buyers");
const sellerModel = require("../models/sellers");
const brandModel = require("../models/brands");
const stockModel = require("../models/stock");
const billModel = require("../models/bills");
const itemModel = require("../models/items");
const categoryModel = require("../models/categories");
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
            if(userType == "BUYER"){
                code = notation+ (code.padStart(9, "0"));
            }else{
                code = notation+ (code.padStart(6, "0"));
            }
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
    fetchCompanyDetails: async(req, res)=>{
        try {
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            let company_id;
            if (userType === "COMPANY") {
                company_id = userId;
            } else if(userType === "OPERATOR"){
                let operator = await userModel.findOne({_id: userId}, {company: 1});
                company_id = new ObjectId(operator.company)
            }
            if (!company_id){
                res.status(400).json({ msg: "We are facing some technical error! Please try again later 1." });
                return;
            }
            const company = await companyModel.findById({ _id: new ObjectId(company_id) },{name: 1, phone: 1, address: 1, gstNo: 1, company_type: 1, company_subtype: 1});
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
    getCustomizeAddStockDetails: async(req, res)=>{
        try {
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            if (userType === "COMPANY") {
                company_id = userId;
            } else if(userType === "OPERATOR"){
                let operator = await userModel.findOne({_id: userId}, {company: 1});
                company_id = new ObjectId(operator.company)
            }
            let stockStructure = await stockStructureModel.findOne({company_id: company_id});
            res.status(200).json({ stockStructure: stockStructure });
          } catch (err) {
            res.status(500).json({ msg: "Failed to retrieve stock structure" });
          }
    },
    saveCustomizeAddStockDetails: async(req, res)=>{
        try{
            const body = req.body;
            let company_id;
            if (req.user.user_type === "COMPANY") {
                company_id = new ObjectId(req.user.id);;
            } else if(req.user.user_type === "OPERATOR"){
                let operator = await userModel.findOne({_id: req.user.id}, {company: 1});
                company_id = new ObjectId(operator.company)
            }
            body.company_id = company_id;
            body.date = true;
            body.item = true;
            body.total_quantity = true;
            body.batch_buy_price = true;
            if(body.unique_code || body.model || body.brand || body.color || body.capacity || body.height || body.power || body.watt || body.description || body.extended_description || body.location || body.mfg_date || body.exp_date || body.item_buy_price || body.item_sell_price || body.form || body.remarks || body.warrantee_guarantee || body.warrantee_guarantee_duration){
                body.quantity = true;
            } else{
                body.quantity = false;
            }
            body.updatedBy = new ObjectId(req.user.id);
            const doc = await stockStructureModel.updateOne({company_id: body.company_id},{$set: body}, {upsert: true, new: true});
            res.status(201).json({ status: true, msg: "Structure saved successfully.", doc:doc});
        } catch(err){
            res.status(500).json({ msg: "Failed to save stock structure" });
        }
    },
    stockList: async(req, res)=>{
        try {
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            const value = req.headers.value;
            const sold_status = req.headers.sold_status;
            const manage = req.headers.manage;
            const exchange = req.headers.exchange;
            const filter = req.headers.filter;
            let cmpMatchStage ={}
            let matchStage ={}
            let projectionStage ={}
            if(value){
                if(filter){
                    // cmpMatchStage = {[filter]: {$regex: value, $options: "i"}, quantity: {$gt: 0}} 
                    cmpMatchStage = {$expr: {$and: [{$regexMatch: {input: {$trim: { input: `$${filter}`}}, regex: value.trim(),options: "i" }},{$gt: ["$quantity", 0] }]}};
                } else{
                    cmpMatchStage = {description: {$regex: value, $options: "i"}, quantity: {$gt: 0}} 
                }
                if(!manage && !exchange){
                    projectionStage = {batch_id:1, batch_no:1, description: 1, quantity: 1,item_sell_price: 1, item_buy_price: 1, mfg_date: 1, exp_date: 1, warrantee_guarantee: 1, warrantee_guarantee_duration: 1}
                } else if(exchange){
                    projectionStage = {description: 1, description_key: 1,quantity: 1, item_status: 1}
                } else{
                    projectionStage = {date: 1, description: 1, challan_no: 1, item_buy_price: 1, quantity: 1, remarks: 1, seller_name: { $ifNull: ["$seller.name", "N/A"] }, batch_id: 1, batch_no: 1, item_status: 1}
                }
            } else if(sold_status){
                if(sold_status == "UNSOLD"){
                    matchStage.quantity = {$gt: 0}
                } else if(sold_status == "SOLD"){
                    matchStage.quantity = {$lte: 0}
                } else if(sold_status == "ALL"){
                    matchStage.quantity = {$gte: 0}
                } else if(sold_status == "DAMAGED"){
                    matchStage.$expr = { $gt: [{ $size: "$damages" }, 0] };
                } else if(sold_status == "RETURNED"){
                    matchStage.$expr = { $gt: [{ $size: "$returns_to_seller" }, 0] };
                } else if(sold_status == "CLEARED"){
                    matchStage.$expr = { $gt: [{ $size: "$clears" }, 0] };
                }
                projectionStage = { _id: 1,
                    sl_no: 1,
                    date: 1,
                    sub_category: 1,
                    challan_no: 1,
                    item: "$item.name",
                    brand_name: { $ifNull: ["$brand.name", "N/A"] },
                    batch_id: 1,
                    description: 1,
                    model: 1,
                    color: 1,
                    capacity: 1,
                    height: 1,
                    power: 1,
                    watt: 1,
                    seller_name: { $ifNull: ["$seller.name", "N/A"] },
                    total_quantity: 1,
                    quantity: 1,
                    batch_no: 1,
                    location: 1,
                    item_status: 1,
                    remarks: 1,
                    mfg_date: 1,
                    exp_date: 1,
                    item_buy_price: 1,
                    item_sell_price: 1,
                    warrantee_guarantee: 1,
                    warrantee_guarantee_duration: 1,
                    damages: 1,
                    returns_to_seller: 1, 
                    clears: 1

                }
            }
            if (userType === "COMPANY") {
                matchStage.company_id = userId;
            } else if(userType === "OPERATOR"){
                let operator = await userModel.findOne({_id: userId}, {company: 1});
                matchStage.company_id = new ObjectId(operator.company)
            }
            const docs = await stockModel.aggregate([
                {$match: matchStage},
                {$lookup: {from: "items",
                    localField: "item_id",
                    foreignField: "_id",
                    as: "item"}},
                {$unwind: "$item"},
                {$lookup: {from: "brands",
                        let: { brand_id: "$brand_id" },
                        pipeline: [{$match: {$expr: {$eq: ["$_id", "$$brand_id"]}}}],
                        as: "brand"}},
                {$unwind: { path: "$brand", preserveNullAndEmptyArrays: true}},
                {$lookup: {from: "sellers",
                        let: { seller_id: "$seller_id" },
                        pipeline: [{$match: {$expr: {$eq: ["$_id", "$$seller_id"]}}}],
                        as: "seller"}},
                {$unwind: {path: "$seller",preserveNullAndEmptyArrays: true}},
                {$project: projectionStage},
                {$match: cmpMatchStage},
                
            ]);
            let finalDocs = [];

            if (docs.length > 0) {
                for (let i = 0; i < docs.length; i++) {
                    const ref = docs[i];

                    const baseData = {
                        ...ref,
                        sub_category: ref.sub_category || "N/A",
                        challan_no: ref.challan_no || "N/A",
                        brand: ref.brand || "N/A",
                        model: ref.model || "N/A",
                        color: ref.color || "N/A",
                        capacity: ref.capacity || "N/A",
                        height: ref.height || "N/A",
                        power: ref.power || "N/A",
                        watt: ref.watt || "N/A",
                        form: ref.form || "N/A",
                        seller: ref.seller || "N/A",
                        sl_no: ref.sl_no || "N/A",
                        item_sell_price: ref.item_sell_price || 0,
                        description: ref.description || "N/A",
                        remarks: ref.remarks || "N/A",
                        location: ref.location || "N/A",
                        mfg_date: ref.mfg_date ? moment(ref.mfg_date).format('DD/MM/YYYY') : "N/A",
                        exp_date: ref.exp_date ? moment(ref.exp_date).format('DD/MM/YYYY') : "N/A",
                        warrantee_guarantee: ref.warrantee_guarantee || "N/A",
                        warrantee_guarantee_duration: ref.warrantee_guarantee_duration ? `${ref.warrantee_guarantee_duration} Months` : "N/A"
                    };

                    if (sold_status === "DAMAGED" && Array.isArray(ref.damages) && ref.damages.length > 0) {
                        ref.damages.forEach(d => {
                            finalDocs.push({
                                ...baseData,
                                quantity: d.quantity,
                                date: moment(d.updatedAt).format('DD/MM/YYYY'),
                                reason: d.reason || "N/A",
                                type: "DAMAGED"
                            });
                        });
                    } else if (sold_status === "CLEARED" && Array.isArray(ref.clears) && ref.clears.length > 0) {
                        ref.clears.forEach(c => {
                            finalDocs.push({
                                ...baseData,
                                quantity: c.quantity,
                                date: moment(c.updatedAt).format('DD/MM/YYYY'),
                                reason: c.reason || "N/A",
                                type: "CLEARED"
                            });
                        });
                    } else if (sold_status === "RETURNED" && Array.isArray(ref.returns_to_seller) && ref.returns_to_seller.length > 0) {
                        ref.returns_to_seller.forEach(c => {
                            finalDocs.push({
                                ...baseData,
                                quantity: c.quantity,
                                date: moment(c.updatedAt).format('DD/MM/YYYY'),
                                reason: c.reason || "N/A",
                                type: "RETURNED"
                            });
                        });
                    } else {
                        baseData.date = moment(ref.date).format('DD/MM/YYYY');
                        finalDocs.push(baseData);
                    }
                }
            }

            res.status(200).json({ docs: finalDocs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    billList: async(req, res)=>{
        try {
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            const bill_type = req.headers.bill_type;
            let cmpMatchStage ={}
            let matchStage ={}
            let tempMatchStage ={}
            let projectionStage = { _id: 1,
                    bill_type: 1,
                    bill_no: 1,
                    date: 1,
                    items: 1,
                    buyer: 1,
                    total: 1,
                    expected_profit: 1,
                    additional_charges: 1,
                    discount: 1,
                    grand_total: 1,
                    payment_mode: 1,
                    paid_amount: 1,
                    remaining_amount: 1,
                    info: 1,
                    installation_status: 1,
                    payments: 1
                }
            
            if (userType === "COMPANY") {
                matchStage.company_id = userId;
                tempMatchStage.company_id = userId;
            } else if(userType === "OPERATOR"){
                let operator = await userModel.findOne({_id: userId}, {company: 1});
                matchStage.company_id = new ObjectId(operator.company)
                tempMatchStage.company_id = new ObjectId(operator.company)
            }

            if (bill_type && bill_type == "FRESH-AND-RE-CREATED"){
                matchStage.bill_type = {$in: ["FRESH", "RE-CREATED"]}
            } else if(bill_type && bill_type!="ALL"){
                matchStage.bill_type = bill_type
            }
            const docs = await billModel.aggregate([
                {$match: matchStage},
                {$unwind: { path: "$item", preserveNullAndEmptyArrays: true}},
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
                                                in: {stock_id: "$$filteredItem._id",
                                                    description_key: "$$filteredItem.description_key",
                                                    description: "$$filteredItem.description"}}},
                                        0]}}}}}},
                {$project: projectionStage},
                {$match: cmpMatchStage},
                
            ]);
            if(docs.length>0){
                for(let i=0; i<docs.length; i++){
                    const outerRef = docs[i];
                    outerRef.date = moment(outerRef.date).format('DD/MM/YYYY');
                    outerRef.buyer_name = outerRef.buyer ? outerRef.buyer.name : "N/A";
                    outerRef.buyer_phone = outerRef.buyer ? outerRef.buyer.phone : "N/A";
                    outerRef.installation_status = outerRef.installation_status ? outerRef.installation_status : "N/A";
                    outerRef.info = outerRef.info ? outerRef.info : "N/A";
                    for(let j=0; j<outerRef.payments.length; j++){
                        outerRef.payments[j].billed_at = moment(outerRef.payments[j].billed_at).format('DD/MM/YYYY');
                    }
                }
            }
            const finalDoc = {user_type: userType, bills: docs}
            res.status(200).json({ doc: finalDoc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    billDetails: async(req, res)=>{
        try {
            const params = req.params
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            let matchStage ={_id: new ObjectId(params.id)}
            let tempMatchStage ={}
            let projectionStage ={_id: 1,
                    date: 1,
                    items: 1,
                    buyer: 1,
                    total: 1,
                    additional_charges: 1,
                    discount: 1,
                    grand_total: 1,
                    payment_mode: 1,
                    paid_amount: 1,
                    remaining_amount: 1,
                    info: 1,
                    installation_status: 1,
                    expected_profit: 1,
                    total_profit: 1,
                    payments: 1
                }
            
            if (userType === "COMPANY") {
                tempMatchStage.company_id = userId;
            } else if(userType === "OPERATOR"){
                let operator = await userModel.findOne({_id: userId}, {company: 1});
                tempMatchStage.company_id = new ObjectId(operator.company)
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
                                                    in: {item_id: "$$filteredItem.item_id",
                                                        brand_id: "$$filteredItem.brand_id",
                                                        batch_id: "$$filteredItem.batch_id",
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
                //   outerRef.buyer = outerRef.buyer ? outerRef.buyer : {name: "Not available",phone: "Not available",email: "Not available",aadhar: "Not available",pin: "Not available",address: "Not available",};
                //   outerRef.buyer = outerRef.buyer ? outerRef.buyer : "Not-available";
                  outerRef.installation_status = outerRef.installation_status ? outerRef.installation_status : "N/A";
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
                for(let j=0; j<outerRef.payments.length; j++){
                    const ref = outerRef.payments[j];
                    ref.billed_at = moment(ref.billed_at).format('DD/MM/YYYY');
                }
              } 
            }
            let doc = {}
            if(docs.length>0){
                doc=docs[0]
            }
            doc.userType = userType;
            res.status(200).json({ doc: doc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },

    dashboardMetrics: async(req, res)=>{
        try{
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            let company_id;
            if (userType === "COMPANY") {
                company_id = userId;
            } else if(userType === "OPERATOR"){
                let operator = await userModel.findOne({_id: userId}, {company: 1});
                company_id = new ObjectId(operator.company)
            }
            const stocks = await stockModel.find({company_id: company_id, quantity: {$gt: 0}}, {quantity: 1, item_buy_price: 1});
            let totalStockValue = 0;
            for(let i=0; i<stocks.length; i++){
                let temp = Number(stocks[i].quantity) * Number(stocks[i].item_buy_price);
                totalStockValue = totalStockValue + temp
            }
            const bills = await billModel.aggregate([
                    {$match: {
                        company_id: company_id,
                        $or: [
                            {remaining_amount: {$gt: 0}},
                            {installation_status: "PENDING"}
                        ],
                        bill_type: {$in: ["FRESH", "RE-CREATED"]}
                    }},
                    {$lookup: {
                        from: "buyers",
                        localField: "buyer_id",
                        foreignField: "_id",
                        as: "buyer_info"
                    }},
                    {$unwind: {path: "$buyer_info", preserveNullAndEmptyArrays: true}},
                    {$project: {
                        bill_no: 1, date: 1, grand_total: 1, remaining_amount: 1, installation_status: 1, buyer_name: "$buyer_info.name", buyer_phone: "$buyer_info.phone", buyer_email: "$buyer_info.email", buyer_address: "$buyer_info.address",buyer_pin: "$buyer_info.pin"
                    }}                     
            ]);
            let totalPendingInstallation = 0
            let totalPendingBills = 0
            const finalBills = []
            for (let i=0; i<bills.length; i++){
                totalPendingBills = totalPendingBills + bills[i].remaining_amount;
                if(bills[i].installation_status == "PENDING"){totalPendingInstallation++}
                else if(!bills[i].installation_status){bills[i].installation_status = "N/A"}
                bills[i].buyer_name = bills[i].buyer_name ? bills[i].buyer_name : "N/A";
                bills[i].buyer_phone = bills[i].buyer_phone ? bills[i].buyer_phone : "N/A";
                bills[i].buyer_email = bills[i].buyer_email ? bills[i].buyer_email : "N/A";
                bills[i].buyer_address = bills[i].buyer_address ? bills[i].buyer_address : "N/A";
                bills[i].buyer_pin = bills[i].buyer_pin ? bills[i].buyer_pin : "N/A";
                bills[i].date = moment(bills[i].date).format('DD/MM/YYYY');
                if(bills[i].remaining_amount != 0){
                    finalBills.push(bills[i]);
                }
            }
            res.status(200).json({status: true, doc:{totalPendingBills: totalPendingBills, totalStockValue: totalStockValue, totalPendingInstallation: totalPendingInstallation, bills: finalBills} });
        } catch(err){
            res.status(400).json({ msg: err.message });
        }
    },
    dashboardFinancials: async(req, res)=>{
        try{
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            let company_id;
            if (userType === "COMPANY") {
                company_id = userId;
            } else if(userType === "OPERATOR"){
                let operator = await userModel.findOne({_id: userId}, {company: 1});
                company_id = new ObjectId(operator.company)
            }
            const {start, end} = req.query;
            if(!(start && end)){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            startDate = new Date(start);
            startDate.setHours(0, 0, 0, 0);
            endDate = new Date(end);
            endDate.setHours(23, 59, 59, 999);
            const revenueProfitResult = await billModel.aggregate([
                {$match: {company_id: company_id, date: { $gte: startDate, $lte: endDate }, bill_type: {$in: ["FRESH", "RE-CREATED"]}}},
                {$project: {paid_amount: 1, total_profit: 1, month: { $dateToString: { format: "%Y-%m", date: "$date" } }}},
                {$group: {
                    _id: "$month",
                    totalRevenue: { $sum: "$paid_amount" },
                    totalProfit: { $sum: "$total_profit" }
                    }},
                {$sort: { _id: 1 }}
            ])
            // **Processing the results**
            let totalRevenue = 0;
            let totalProfit = 0;
            let profitRevenue = [];
            revenueProfitResult.forEach((item) => {
            totalRevenue += item.totalRevenue;
            totalProfit += item.totalProfit;

            profitRevenue.push({
                month: new Date(item._id + "-01").toLocaleString("en-US", { month: "long" }),
                Revenue: item.totalRevenue,
                Profit: item.totalProfit
            });
            });
            const stockInPipeline = [
                {$match: {"date": { $gte: startDate, $lte: endDate }, "company_id": company_id}},
                {$lookup: {from: "items",
                    localField: "item_id",
                    foreignField: "_id",
                    as: "item"}},
                {$unwind: "$item"},
                {$project: {
                    month: { $dateToString: { format: "%Y-%m", date: "$date" } },
                    // stockIn: "$quantity",
                    stockIn: "$total_quantity",
                    item: "$item.name"}},
                {$group: {
                    _id: { month: "$month", item: "$item" },
                    totalStockIn: { $sum: "$stockIn" }}},
                {$sort: { "_id.month": 1 }}
            ];
            
            const stockOutPipeline = [
                {$unwind: "$sell_details"},
                {$match: {"sell_details.sold_at": { $gte: startDate, $lte: endDate }, "company_id": company_id}},
                {$lookup: {from: "items",
                    localField: "item_id",
                    foreignField: "_id",
                    as: "item"}},
                {$unwind: "$item"},
                {$project: {
                    month: { $dateToString: { format: "%Y-%m", date: "$sell_details.sold_at" } },
                    stockOut: {$subtract: ["$sell_details.quantity", "$sell_details.returned_quantity"]},
                    item: "$item.name"}},
                {$group: {
                    _id: { month: "$month", item: "$item" },
                    totalStockOut: { $sum: "$stockOut" }}},
                {$sort: { "_id.month": 1}}
            ];
            
            const stockInResult = await stockModel.aggregate(stockInPipeline)
            const stockOutResult = await stockModel.aggregate(stockOutPipeline)
            
            const formatMonth = (monthStr) => {
                const [year, monthNum] = monthStr.split('-');
                const months = [
                    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
                    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
                ];
                return `${months[parseInt(monthNum) - 1]} ${year}`;
            };
        
            // Helper function to parse month string back to Date for sorting
            const parseMonthForSorting = (monthStr) => {
                const [monthName, year] = monthStr.split(' ');
                const monthIndex = [
                    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
                    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
                ].indexOf(monthName);
                return new Date(parseInt(year), monthIndex);
            };
        
            // Create a Map to store combined data
            const combinedMap = new Map();
        
            // Process stockInResult
            stockInResult.forEach(stockIn => {
                const key = stockIn._id.item;
                const formattedMonth = formatMonth(stockIn._id.month);
                const existing = combinedMap.get(key) || {
                    item: stockIn._id.item,
                    stockInOut: []
                };
        
                existing.stockInOut.push({
                    month: formattedMonth,
                    stockIn: stockIn.totalStockIn,
                    stockOut: 0
                });
        
                combinedMap.set(key, existing);
            });
        
            // Process stockOutResult and merge with existing data
            stockOutResult.forEach(stockOut => {
                if (!stockOut.totalStockOut) return;
        
                const key = stockOut._id.item;
                const formattedMonth = formatMonth(stockOut._id.month);
                let existing = combinedMap.get(key);
        
                if (!existing) {
                    existing = {
                        item: stockOut._id.item,
                        stockInOut: []
                    };
                }
        
                const monthEntry = existing.stockInOut.find(
                    entry => entry.month === formattedMonth
                );
        
                if (monthEntry) {
                    monthEntry.stockOut = stockOut.totalStockOut;
                } else {
                    existing.stockInOut.push({
                        month: formattedMonth,
                        stockIn: 0,
                        stockOut: stockOut.totalStockOut
                    });
                }
        
                combinedMap.set(key, existing);
            });
        
            // Convert Map to array and sort stockInOut arrays
            const stockInOutResult = Array.from(combinedMap.values()).map(item => {
                item.stockInOut.sort((a, b) => {
                    return parseMonthForSorting(a.month) - parseMonthForSorting(b.month);
                });
                return item;
            });
            
            const finalOutput = {
                totalRevenue,
                totalProfit,
                profitRevenue,
                stockMovement: stockInOutResult
              };
            res.status(200).json({status: true, doc: finalOutput})
        } catch(err){
            res.status(400).json({ msg: err.message });
        }
    },
    dashboardLowStock: async(req, res)=>{
        try{
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            let company_id;
            if (userType === "COMPANY") {
                company_id = userId;
            } else if(userType === "OPERATOR"){
                let operator = await userModel.findOne({_id: userId}, {company: 1});
                company_id = new ObjectId(operator.company)
            }
            let {threshold} = req.query;
            if(!threshold){return res.status(400).json({ msg: "Missing Parameters!" });}
            threshold = Number(threshold);

            const docs = await itemModel.aggregate([
                { $match: { company_id: company_id } },
                { $lookup: {
                    from: 'stocks',
                    let: { item_id: '$_id' },
                    pipeline: [
                        { $match: { $expr: { $eq: ['$item_id', '$$item_id'] } } },
                        { $project: {
                            quantity: 1,
                            description: 1,
                            description_key: 1,
                            _id: 0
                        }}
                    ],
                    as: 'stocks'
                }},
            
                { $unwind: { path: "$stocks", preserveNullAndEmptyArrays: true } },
            
                // Group by (item + description_key) to sum quantities
                { $group: {
                    _id: {
                        itemId: "$_id",
                        name: "$name",
                        code: "$code",
                        description_key: "$stocks.description_key",
                        description: "$stocks.description"
                    },
                    available_quantity: { $sum: "$stocks.quantity" }
                }},
            
                // Filter only those descriptions where available quantity <= threshold
                { $match: { available_quantity: { $lte: threshold } } },
            
                // Regroup by item
                { $group: {
                    _id: {
                        itemId: "$_id.itemId",
                        name: "$_id.name",
                        code: "$_id.code"
                    },
                    lowStockDescriptions: {
                        $push: {
                            description_key: "$_id.description_key",
                            description: "$_id.description",
                            available_quantity: "$available_quantity"
                        }
                    },
                    total_quantity: { $sum: "$available_quantity" }
                }},
            
                // Sort lowStockDescriptions array in ascending order by available_quantity
                { $addFields: {
                    lowStockDescriptions: {
                        $sortArray: {
                            input: "$lowStockDescriptions",
                            sortBy: { description: 1 }  // 1 = ascending
                        }
                    }
                }},
            
                // Final projection
                { $project: {
                    _id: 0,
                    name: "$_id.name",
                    code: "$_id.code",
                    lowStockDescriptions: 1,
                    total_quantity: 1
                }}
            ]);
            res.status(200).json({status: true, docs: docs})
        } catch(err){
            res.status(400).json({ msg: err.message });
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
                        let: {company_id: "$company"},
                        pipeline: [{$match: {$expr: {$eq: ["$_id", "$$company_id"]}}},
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

    
    buyerList: async(req, res)=>{
        try {
            const cmpVal = req.headers.value;
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            const activeStatus = req.headers.active;
            let matchStage = {};
            let projectionStage = {};
            if (userType === "COMPANY") {
                company_id = userId;
            } else if(userType === "OPERATOR"){
                if(!req.headers.company_id){
                    res.status(400).json({ msg: "Unable to find company details! Please try again later." });
                    return;
                }
                company_id = new ObjectId(req.headers.company_id)
            }
            if(activeStatus && cmpVal){
                matchStage = {company_id: company_id, active: true, phone: {$regex: cmpVal, $options: "i"}} 
                projectionStage = {name: 1, phone: 1, email: 1, address: 1, pin: 1, aadhar: 1}
            } else{
                matchStage = {company_id: company_id}
            }
            const docs = await buyerModel.find(matchStage, projectionStage);
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    buyerCreate: async(req, res)=>{
        try {
            const body = req.body;
            if (!body.name || !body.phone ){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            body.createdBy = new ObjectId(req.user.id);
            body.updatedBy = new ObjectId(req.user.id);
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            if (userType === "COMPANY") {
                company_id = userId;
            } else if(userType === "OPERATOR"){
                let user = await userModel.findById(userId, {company:1});
                company_id = new ObjectId(user.company)
            }
            body.company_id= company_id;
            const codeGenerator =await require("../controllers/utilController").createCode("BUYER");
            // const codeGenerator = createCode("BUYER");
            body.code = codeGenerator.code
            const doc = await buyerModel.create(body);
            res.status(201).json({ status: true, msg: "Buyer created successfully.", doc:doc});
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "Same buyer already exists. Please check from buyer list." });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    buyerDetails: async(req, res)=>{
        try {
            const params = req.params
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await buyerModel.findById({ _id: params.id });
            res.status(200).json({ doc: doc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    buyerUpdate: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await buyerModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "Buyer details updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    buyerDelete: async(req, res)=>{
        try {
            const params = req.params;
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            await buyerModel.findByIdAndDelete({ _id: params.id });
            res.status(200).json({ message: "Buyer deleted successfully" });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    buyerUpdateActive: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await buyerModel.updateOne({_id: new ObjectId(params.id)},{$set: body}, {new: true});
            res.status(200).json({ message: "Buyer's activation status updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    
    sellerList: async(req, res)=>{
        try {
            const cmpVal = req.headers.value;
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            const activeStatus = req.headers.active;
            let matchStage = {};
            let projectionStage = {};
            if (userType === "COMPANY") {
                company_id = userId;
            } else if(userType === "OPERATOR"){
                let user = await userModel.findById(userId, {company:1});
                company_id = new ObjectId(user.company)
            }
            if(activeStatus && cmpVal){
                matchStage = {company_id: company_id, active: true, name: {$regex: cmpVal, $options: "i"}} 
                projectionStage = {name: 1}
            } else if(activeStatus){
                matchStage = {company_id: company_id,  active: true}
            } else{
                matchStage = {company_id: company_id}
            }
            const docs = await sellerModel.find(matchStage, projectionStage);
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    sellerCreate: async(req, res)=>{
        try {
            const body = req.body;
            if (!body.name || !body.company_name ){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            body.createdBy = new ObjectId(req.user.id);
            body.updatedBy = new ObjectId(req.user.id);
            const userId = new ObjectId(req.user.id);
            const userType = req.user.user_type;
            if (userType === "COMPANY") {
                company_id = userId;
            } else if(userType === "OPERATOR"){
                let user = await userModel.findById(userId, {company:1});
                company_id = new ObjectId(user.company)
            }
            body.company_id= company_id;
            const codeGenerator =await require("../controllers/utilController").createCode("SELLER");
            body.code = codeGenerator.code
            const doc = await sellerModel.create(body);
            res.status(201).json({ status: true, msg: "Seller created successfully.", doc:doc});
        } catch (err) {
            if(err.code==11000){
                res.status(500).json({ status: false, msg: "Seller already exists. Please check from seller list." });
                return
            }
            res.status(500).json({ status: false, msg: err.message });
        }
    },
    sellerDetails: async(req, res)=>{
        try {
            const params = req.params
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await sellerModel.findById({ _id: params.id });
            res.status(200).json({ doc: doc });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    sellerUpdate: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await sellerModel.findByIdAndUpdate(params.id, body, {new: true});
            res.status(200).json({ message: "Seller details updated successfully", doc: doc });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    },
    sellerDelete: async(req, res)=>{
        try {
            const params = req.params;
            if (!params || !params.id){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            await sellerModel.findByIdAndDelete({ _id: params.id });
            res.status(200).json({ message: "Seller deleted successfully" });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
    sellerUpdateActive: async(req, res)=>{
        try {
            const params = req.params;
            const body = req.body;
            body.updatedBy = new ObjectId(req.user.id);
            if (!params || !params.id || !body){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const doc = await sellerModel.updateOne({_id: new ObjectId(params.id)},{$set: body}, {new: true});
            res.status(200).json({ message: "Seller's activation status updated successfully", doc: doc });
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
            let company_ids=[]
            if (userType === "COMPANY") {
                company_ids = [userId, new ObjectId("67a826f87c2ba5493e1d7a1f")];
            } else if(userType === "OPERATOR"){
                let user = await userModel.findById(userId, {company:1});
                company_ids = [new ObjectId(user.company), new ObjectId("67a826f87c2ba5493e1d7a1f")]
            }
            if(activeStatus && cmpVal){
                matchStage = {company_id: {$in: company_ids}, active: true, name: {$regex: cmpVal, $options: "i"}} 
                projectionStage = {name: 1}
            } else if(activeStatus){
                matchStage = {company_id: {$in: company_ids},  active: true}
                projectionStage = {code: 1, name: 1, category: "$category.category", sub_category: 1, active: 1}
            } else{
                projectionStage = {code: 1,name: 1, category: "$category.category", sub_category: 1, active: 1}
                if (userType == "ADMIN" || userType =="SUPPORTADMIN") {
                    matchStage = {}
                } else {
                    matchStage = {company_id: {$in: company_ids}}
                }
            }
            const docs = await itemModel.aggregate([
                {$match: matchStage},
                {$lookup: {from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"}},
                {$unwind: "$category"},
                {$project: projectionStage},
                
            ]);
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
                body.company_id = new ObjectId("67a826f87c2ba5493e1d7a1f"); // Id of Admin user
            } else if (userType === "COMPANY") {
                body.company_id = userId;
            } else if(userType === "OPERATOR"){
                let user = await userModel.findById(userId, {company:1});
                body.company_id = new ObjectId(user.company)
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
    },

    brandList: async(req, res)=>{
        try {
            const cmpVal = req.body.value;
            const company_id = req.body.company_id;
            let matchStage = {};
            let projectionStage = {};
            if(cmpVal){
                matchStage = {company_id: company_id, name: {$regex: cmpVal, $options: "i"}} 
                projectionStage = {name: 1}
            } else{
                matchStage = {company_id: company_id}
            }
            const docs = await brandModel.find(matchStage, projectionStage);
            res.status(200).json({ docs: docs });
        } catch (err) {
            res.status(400).json({ msg: err.message });
        }
    },
}    