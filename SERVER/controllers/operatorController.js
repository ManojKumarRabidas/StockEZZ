const {ObjectId} = require('mongodb');
const userModel = require("../models/user");
const stockModel = require("../models/stock");
module.exports = {
    saveStockDetails: async(req, res)=>{
        try{
            const body = req.body;
            if(!body.date || !body.category || !body.item_name){
                res.status(400).json({ msg: "Missing Parameters!" });
                return;
            }
            const userId = new ObjectId(req.user.id);
            let user = await userModel.findById(userId, {company:1});
            if(!user || !user.company){
                res.status(400).json({ msg: "Invalid request! Please contact technical team." });
                return;
            }
            body.companyId = new ObjectId(user.company);
            body.createdBy = new ObjectId(req.user.id);
            body.updatedBy = new ObjectId(req.user.id);
            body.date = new Date(body.date);
            body.time = new Date(body.time);
            if(body.sellerId){
                body.sellerId = new ObjectId(body.sellerId);
            }
            if(body.categoryId){
                body.categoryId = new ObjectId(body.categoryId);
            }
            if(body.itemId){
                body.itemId = new ObjectId(body.itemId);
            }
            if(body.quantity){
                body.quantity = Number(body.quantity);
            }
            if(body.batch_price){
                body.batch_price = Number(body.batch_price);
            }
            console.log("body", body)
            if(body.stock_details.length > 0){
                for(let i=0; i<body.stock_details.length; i++){
                    const ref = body.stock_details[i];
                    console.log(body.stock_details[i])
                    console.log("ref", ref)
                    if(ref.mfg_date){
                        ref.mfg_date = new Date(ref.mfg_date)
                    }
                    if(ref.exp_date){
                        ref.exp_date = new Date(ref.exp_date)
                    }
                    if(ref.item_buy_price){
                        ref.item_buy_price = Number(ref.item_buy_price)
                    }
                    if(ref.item_sell_price){
                        ref.item_sell_price = Number(ref.item_sell_price)
                    }
                    if(ref.warrantee_guarantee_duration){
                        ref.warrantee_guarantee_duration = Number(ref.warrantee_guarantee_duration)
                    }
                }
            }
            const doc = await stockModel.create(body);
            res.status(201).json({ status: true, msg: "Stock saved successfully.", doc:doc});
        } catch(err){
            res.status(500).json({ status: false, msg: err.message });
        }
    },
}