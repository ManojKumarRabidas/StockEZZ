// import "../App.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toastr from 'toastr';
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function ForgotPasswordOuter() {
    const [stage, setStage] = useState(-1);
    const [user_code, setUserCode] = useState("");
    const [user_email, setUserEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [new_password, setNewPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [response, setResponse] = useState("");
    const navigate = useNavigate();
    const sendOtp = async()=>{
        try{
            setTimeout(() => {
                setResponse("");
                setError("");
            }, 4000);
            // setOtp("")
            if(!user_code || !user_email){
                setError("Enter user code and email");
                return;
            }
        const response = await fetch(`${HOST}:${PORT}/server/outer-forgot-password-send-otp`, {
            method: "POST",
            body: JSON.stringify({user_code: user_code, user_email: user_email}),
            headers: { 
            "Content-Type": "application/json",
            },
        });
        if (response){
            const result = await response.json();
            if (response.ok){
                setStage(1)
            } else{
                setError(result.msg);
            }
        } else{
            setError("We are unable to process now. Please try again later.")
        }
        } catch(err){
            setError("We are unable to process now. Please try again later.")
        }
        
    }
    const resendOtp = async()=>{
        try{
        setNewOtp("")
        const response = await fetch(`${HOST}:${PORT}/server/forgot-password-send-otp`, {
            method: "POST",
            // body: JSON.stringify({}),
            headers: { 
            "Content-Type": "application/json",
            },
        });
        if (response){
            const result = await response.json();
            if (response.ok){
            toastr.success(result.msg)
            setSendOtpStatus(true)
            setValidOtpStatus(false)
            } else{
            toastr.error(result.msg);
            setSendOtpStatus(false)
            }
        } else{
            toastr.error("We are unable to process now. Please try again later.")
            setSendOtpStatus(false)
        }
        }catch(err){
        toastr.error("We are unable to process now. Please try again later.")
        setSendOtpStatus(false)
        }
    }
    const checkOtp = async()=>{
        if(!newOtp){
        toastr.error("Please enter OTP first.")
        return;
        }
        try{
        const response = await fetch(`${HOST}:${PORT}/server/forgot-password-check-otp`, {
            method: "POST",
            body: JSON.stringify({otp: newOtp}),
            headers: { 
            "Content-Type": "application/json",
            },
        });
        if (response){
            const result = await response.json();
            if (response.ok){
            toastr.success(result.msg)
            setSendOtpStatus(false)
            setValidOtpStatus(true)
            } else{
            toastr.error(result.msg);
            setValidOtpStatus(false)
            }
        } else{
            toastr.error("We are unable to process now. Please try again later.")
            setValidOtpStatus(false)
        }
        }catch(err){
        toastr.error("We are unable to process now. Please try again later.")
        setValidOtpStatus(false)
        }
    }
    const changePassword = async()=>{
        if(!new_password || !confirm_password){
        toastr.error("Please enter both password and confirm password.")
        return;
        }
        if(new_password != confirm_password){
        toastr.error("Password and confirm password must be same.")
        return;
        }
        try{
        const response = await fetch(`${HOST}:${PORT}/server/forgot-password-change-password`, {
            method: "POST",
            body: JSON.stringify({password: new_password}),
            headers: { 
            "Content-Type": "application/json",
            'authorization': `Bearer ${token}` 
            },
        });
        if (response){
            const result = await response.json();
            if (response.ok){
            toastr.success(result.msg)
            navigate("/home");
            } else{
            toastr.error(result.msg);
            }
        } else{
            toastr.error("We are unable to process now. Please try again later.")
        }
        }catch(err){
        toastr.error("We are unable to process now. Please try again later.")
        }
    }

  return (
    <>
      <style>{`
        body {
          background-color: #fff;
          }

        h5{
          color: rgb(47, 24, 41);
        }
        a{
            text-decoration: underline !important;
        }
      `}</style>

      <div>
        <main className="container my-4">
            <section className="">
                <form>
                    <h2 className="mb-3">Forgot Password</h2>
                    <div className="bg-light shadow-sm p-3 mb-3 bg-body-tertiary rounded">
                        {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
                        {response && (<div className="alert alert-success" role="alert">{response}</div>)}
                        {stage == -1 && <div>
                            <img style={{maxWidth: "-webkit-fill-available"}} src="https://i.ytimg.com/vi/DYuXf0QeO78/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGGUgUyhXMA8=&rs=AOn4CLBpXZJ3tuFMEMwLXIvND9gbJZWHTg" alt="err" srcset="" />
                            <h5 className="mt-3">Password vul geya to ghar ja, Vagg</h5>
                            <a className="mx-5" href="/login">Click kar yeha ghar jane k liye</a>
                            </div>}
                        {stage == 0 && <div>
                            <div className=" mb-3">
                                <label className="form-label">Enter User Code <span className="ei-col-red">*</span></label>
                                <input placeholder="Ex: CP0045102" name="user_code" type="text" className="form-control" aria-describedby="emailHelp" value={user_code} onChange={(e) => setUserCode(e.target.value)}/>
                            </div>
                            <div className=" mb-3">
                                <label className="form-label">Enter Email Id <span className="ei-col-red">*</span></label>
                                <input placeholder="Ex: abc@mail.com" name="user_email" type="text" className="form-control" aria-describedby="emailHelp" value={user_email} onChange={(e) => setUserEmail(e.target.value)}/>
                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                                <button type="button" onClick={() =>sendOtp()} className="btn btn-primary mx-2 ">Send OTP</button>
                            </div>
                            <span className="d-flex justify-content-center align-items-center m-2">Or</span>
                            <div className="d-flex justify-content-center align-items-center mt-2">
                                <a className="mx-2" href="/login">Back to Log In</a>
                                <a onClick={() =>setStage(2)} className="mx-2" href="#">Forgot User Code</a>
                            </div>
                        </div>}
                        {stage == 1 && <div>
                            <div className=" mb-3">
                                <label className="form-label">Enter OTP <span className="ei-col-red">*</span></label>
                                <input placeholder="Ex: CP0045102" name="otp" type="text" className="form-control" aria-describedby="emailHelp" value={otp} onChange={(e) => setOtp(e.target.value)}/>
                            </div>
                            <div className="d-flex justify-content-center align-items-center">
                                <button type="button" onClick={() =>resendOtp()} className="btn btn-primary mx-2 ">Resend OTP</button>
                                <button type="button" onClick={() =>checkOtp()} className="btn btn-primary mx-2 ">Submit</button>
                            </div>
                        </div>}
                        {stage == 2 && <div>
                            <h5 className="p-5">In case you have forgot your code please contact with Admin.</h5>  
                            <div className="d-flex justify-content-center align-items-center mt-2">
                                <a onClick={() =>setStage(0)} className="mx-2" href="#">Back to Previous Page</a>
                                <a className="mx-2" href="/log-in">Back to Log In</a>
                            </div> 
                        </div>}
                        {stage == 3 && <div>
                            <div className="mb-3">
                                <label className="form-label">New Password <span className="ei-col-red">*</span></label>
                                <input name="new_password" type="password" className="form-control" aria-describedby="emailHelp" value={new_password} onChange={(e) => setNewPassword(e.target.value)}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Confirm Password <span className="ei-col-red">*</span></label>
                                <input name="confirm_password" type="text" className="form-control" aria-describedby="emailHelp" value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)}/>
                            </div>
                            <button type="button" onClick={() =>changePassword()} className="btn btn-primary mx-2">Change</button>
                        </div>}
                        {stage == 4 && <div>
                            <h5>Your password has updated. Log in with your updated password.</h5>  
                            <a className="mx-2" href="/log-in">Back to Log In</a>  
                        </div>}
                    </div>
                </form>
            </section>
        </main>  
    </div>
    </>
  );
}

export default ForgotPasswordOuter;

