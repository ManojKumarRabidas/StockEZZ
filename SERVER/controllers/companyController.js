const {ObjectId} = require('mongodb');
const stockStructureModel = require("../models/stockStructure");
module.exports = {
    saveCustomizeAddStockDetails: async(req, res)=>{
        try{
            const body = req.body;
            
            body.companyId = new ObjectId(req.user.id);
            body.sl_no = true;
            body.date = true;
            body.company_code = true;
            body.item_name = true;
            body.updatedBy = new ObjectId(req.user.id);
            const doc = await stockStructureModel.updateOne({companyId: body.companyId},{$set: body}, {upsert: true, new: true});
            
            res.status(201).json({ status: true, msg: "Structute saved successfully.", doc:doc});
        } catch(err){
            res.status(500).json({ msg: "Failed to save stock structure" });
        }
    }
}