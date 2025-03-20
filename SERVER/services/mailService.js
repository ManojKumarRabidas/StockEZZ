const nodemailer = require("nodemailer");
module.exports = {
    sendMail: async(mailId, otp, name, code)=>{
        try{
            const auth = nodemailer.createTransport({
                service: "gmail",
                secure : true,
                port : 465,
                auth: {
                    user: "stockezz.rabi@gmail.com",
                    pass: "ktzz vmol qyof vulc"
        
                }
            });
            const receiver = {
                from : "stockezz.rabi@gmail.com",
                to : mailId,
                subject : "StockEZZ Support Team : OTP for Forgot Password",
                text : `Dear ${name}. 

                        Your One Time Password (OTP) for verify is: ${otp}.

                        OTP is valid only for 05:00 mins. Do not share this OTP with anyone.

                        If you did not request this OTP, please connect with us immediately at complaint.support@stockezz.in.
                        
                        Regards,
                        Team StockEZZ`,
            };
        
            auth.sendMail(receiver, (error, emailResponse) => {
                if(error)
                    return {status: false, msg: "Fail to send OTP, Please check your email id or try again later"};
                // throw error;
                response.end();
            });
            return {status: true, msg: "OTP sent to your registered email id"};
        } catch(err){
            return {status: false, msg: "Fail to send OTP due to some technical problem. Please try again later."};
        }
    }
}