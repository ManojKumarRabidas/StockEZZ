// import "../App.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toastr from 'toastr';

const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT
let token;
export default function ChangePassword(){
    const [old_password, setOldPassword] = useState("");
    const [new_password, setNewPassword] = useState("");
    const [confirm_password, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
      token = sessionStorage.getItem('token');
    }, []);
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!new_password || !confirm_password){
          if (new_password != confirm_password){
            toastr.error("New password and confirm password must be same.");
            return;
          }
        }
        const passwordData = { old_password, new_password};
        if (!old_password || !new_password){
          toastr.error("Please enter old and new password.");
          return;
        }
        const response = await fetch(`${HOST}:${PORT}/server/change-password`, {
          method: "POST",
          body: JSON.stringify(passwordData),
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
          },
        });
        if (response){
          const result = await response.json();
          if (response.ok){
            toastr.success("Password changed successfully.");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
            navigate("/password/change-password");
          } else{
            toastr.error(result.msg);
          }
        } else{
          toastr.error("We are unable to process now. Please try again later.")
        }
      };
    return(
        <div>
            <main className="container my-4">
                <section className="bg-light shadow-sm p-3 mb-5 bg-body-tertiary rounded">
                    <form onSubmit={handleSubmit}>
                        <div className=" justify-content-center">
                            <div className="mb-3">
                                <label className="form-label">Old Password <span className="ei-col-red">*</span></label>
                                <input name="old_password" type="text" className="form-control" aria-describedby="emailHelp" value={old_password} onChange={(e) => setOldPassword(e.target.value)}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">New Password <span className="ei-col-red">*</span></label>
                                <input name="new_password" type="password" className="form-control" aria-describedby="emailHelp" value={new_password} onChange={(e) => setNewPassword(e.target.value)}/>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Confirm Password <span className="ei-col-red">*</span></label>
                                <input name="confirm_password" type="password" className="form-control" aria-describedby="emailHelp" value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)}/>
                            </div>
                            <button type="submit" className="btn btn-primary mx-2">Change</button>
                        </div>
                    </form>
                </section>
            </main>
        </div>
    )
}