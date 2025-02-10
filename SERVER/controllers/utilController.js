
const codeSequenceModel = require("../models/codesequence");
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
            code = notation+ (code.padStart(6, "0"));
            return {status: true, code: code};
        } catch (err) {
            return {status: false, code: null};
        }
    },


}    