module.exports = {
    saveStockDetails: async(req, res)=>{
        console.log(req.body)
        res.status(201).json({ status: true, msg: "Incomplete."});
    },
}