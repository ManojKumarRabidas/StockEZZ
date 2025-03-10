// import "../App.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toastr from 'toastr';
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
const token = sessionStorage.getItem('token');
function ForgotPassword(){
    const [newOtp, setNewOtp] = useState("");
    const [new_password, setNewPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const [sendOtpStatus, setSendOtpStatus] = useState(false);
    const [validOtpStatus, setValidOtpStatus] = useState(false);
    const navigate = useNavigate();
    const sendOtp = async()=>{
      try{
        setNewOtp("")
        const response = await fetch(`${HOST}:${PORT}/server/forgot-password-send-otp`, {
          method: "POST",
          // body: JSON.stringify({}),
          headers: { 
            "Content-Type": "application/json",
            'authorization': `Bearer ${token}` 
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
            'authorization': `Bearer ${token}` 
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
    return(
        <div>
            <main className="container my-4">
                <section className="">
                    {/* <div className="alert alert-danger" role="alert">The functionality of "Forgot Password" is not in working now. </div> */}
                    {/* <form onSubmit={handleSubmit}> */}
                    <form>
                        <div className=" justify-content-center">
                          {!validOtpStatus &&
                          <div className="bg-light shadow-sm p-3 mb-3 bg-body-tertiary rounded">
                            <div className="my-3">
                              <small>Send Otp to registered email id</small>
                              <button type="button" className="btn btn-outline-light m-1" onClick={() => sendOtp()}> {sendOtpStatus ? "Resend": "Send"}</button>
                            </div>
                            
                            {sendOtpStatus && <div className="row"> 
                              <hr />
                              <div className="mb-3 col-9 row">
                                <label className="form-label col">Enter OTP <span className="ei-col-red">*</span></label>
                                <input name="newOtp" type="text" maxLength={6} placeholder="Enter 6 digit OTP you get via email" className="form-control col" aria-describedby="emailHelp" value={newOtp} onChange={(e) => setNewOtp(e.target.value)}/>
                              </div>
                              <div className="mb-3 col-3">
                                <button  type="button" onClick={() => checkOtp()} className="btn btn-primary form-control">Submit</button> </div>
                              </div>}
                          </div>}
                          {validOtpStatus && <div className="bg-light shadow-sm p-3 mb-3 bg-body-tertiary rounded">
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
                        </div>
                    </form>
                </section>
            </main>
        </div>
    )
}
export default ForgotPassword;