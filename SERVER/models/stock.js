const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
    company_id: {type: mongoose.Schema.Types.ObjectId},
    batch_id: {type: String},
    category_id: {type: mongoose.Schema.Types.ObjectId},
    sl_no: {type: String},
    date: {type: Date, required: true},
    time: {type: Date},
    sub_category: {type: String},
    challan_no: {type: String},
    item_id: {type: mongoose.Schema.Types.ObjectId, required: true},
    brand_id: {type: mongoose.Schema.Types.ObjectId},
    color: {type: String},
    capacity: {type: String},
    height: {type: String},
    power: {type: String},
    watt: {type: String},
    description: {type: String},
    description_key: {type: String},
    form: {type: String},
    location: {type: String},
    model: {type: String},
    seller_id: {type: mongoose.Schema.Types.ObjectId},
    total_quantity: {type: Number},
    quantity: {type: Number},
    batch_no: {type: String},
    batch_buy_price: {type: Number},
    batch_sell_price: {type: Number},
    per_piece_buy_price: {type: Number},
    per_piece_sell_price: {type: Number},
    batch_mfg_date: {type: Date},
    batch_exp_date: {type: Date},
    batch_warrantee_guarantee: {type: String},
    batch_warrantee_guarantee_duration: {type: Number},
    item_status: {type: String},
    return_reason: {type: String},
    remarks: {type: String},
    unique_code: {type: String},
    mfg_date: {type: Date},
    exp_date: {type: Date},
    item_buy_price: {type: Number},
    item_sell_price: {type: Number},
    warrantee_guarantee: {type: String},
    warrantee_guarantee_duration: {type: Number},  
    sell_details: {
        type: [
          {
            bill_id: mongoose.Schema.Types.ObjectId,
            buyer_id: mongoose.Schema.Types.ObjectId,
            sell_price: Number,
            quantity: Number,
            returned_quantity: Number,
            replaced_quantity: Number,
            profit: Number,
            sold_at: { type: Date, default: Date.now },
          },
        ],
        default: [],
      },
      damages: {
          type: [
              {
                  quantity: Number,
                  reason: String,
                  updatedBy: mongoose.Schema.Types.ObjectId,
                  updatedAt: { type: Date, default: Date.now },
              }
          ],
          default: [],
      },
      returns_to_seller: {
          type: [
              {
                  quantity: Number,
                  reason: String,
                  updatedBy: mongoose.Schema.Types.ObjectId,
                  updatedAt: { type: Date, default: Date.now },
              }
          ],
          default: [],
      },
      clears: {
          type: [
              {
                  quantity: Number,
                  reason: String,
                  updatedBy: mongoose.Schema.Types.ObjectId,
                  updatedAt: { type: Date, default: Date.now },
              }
          ],
          default: [],
      },
      returns_from_buyer: {
        type: [{
                sold_date: Date,
                return_date: Date,
                sold_to: mongoose.Schema.Types.ObjectId,
                sold_price: Number,
                return_type: String,
                updatedBy: mongoose.Schema.Types.ObjectId,
                updatedAt: { type: Date, default: Date.now },
            }],
        default: [],
    },
    createdBy: {type: mongoose.Schema.Types.ObjectId},
    updatedBy: {type: mongoose.Schema.Types.ObjectId}
}, { timestamps: true });

const Stock = mongoose.model('stock', stockSchema)
module.exports = Stock