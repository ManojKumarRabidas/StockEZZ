const {ObjectId} = require('mongodb');
const stockStructureModel = require("../models/stockStructure");
module.exports = {
    getCustomizeAddStockDetails: async(req, res)=>{
        try {
            const companyId = new ObjectId(req.user.id);
            let stockStructure = await stockStructureModel.findOne({companyId: companyId});
            res.status(200).json({ stockStructure: stockStructure });
          } catch (error) {
            res.status(500).json({ msg: "Failed to retrieve stock structure" });
          }
    },
    saveCustomizeAddStockDetails: async(req, res)=>{
        try{
            const body = req.body;
            
            body.companyId = new ObjectId(req.user.id);
            body.sl_no = true;
            body.date = true;
            body.companyCode = true;
            body.updatedBy = new ObjectId(req.user.id);
            console.log("body", body)
            const doc = await stockStructureModel.updateOne({companyId: body.companyId},{$set: body}, {upsert: true, new: true});
            
            res.status(201).json({ status: true, msg: "Structute saved successfully.", doc:doc});
        } catch(err){
            console.log(err)
            res.status(500).json({ msg: "Failed to save stock structure" });
        }
    }
}