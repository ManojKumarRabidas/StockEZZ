import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT
import toastr from 'toastr';
const token = localStorage.getItem('token');

function Create() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [pin, setPin] = useState("");
    const [aadhar, setAadhar] = useState("");
    const [active, setActive] = useState(false);
    const navigate = useNavigate();


  const handleClear = () => {
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setPin("");
    setAadhar("");
    setActive(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const buyerData = {name, phone, email, address, pin, aadhar, active };
    if (!name || !phone ){
      toastr.error("Please enter name and phone.");
      return;
    }
    const response = await fetch(`${HOST}:${PORT}/server/buyer-create`, {
      method: "POST",
      body: JSON.stringify(buyerData),
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      }
    });
    if (response){
      const result = await response.json();
      if (response.ok){
        toastr.success("Buyer created successfully.");
        navigate("/buyers/buyer-list");
      } else{
        toastr.error(result.msg);
      }
    } else{
      toastr.error("We are unable to process now. Please try again later.")
    }
  };

  return (
    <div className="container my-2">
      <form onSubmit={handleSubmit} className="shadow-sm p-3 my-4 bg-body-tertiary rounded"> 
        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Name <span className="ei-col-red">*</span></label>
            <input name="name" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
        </div>
        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Phone <span className="ei-col-red">*</span></label>
            <input name="phone" type="text" maxLength={10} className="form-control" aria-describedby="emailHelp" value={phone} onChange={(e) => setPhone(e.target.value)}/>
          </div>
          <div className="col mb-3">
            <label className="form-label">Email </label>
            <input name="email" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
        </div>
        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Aadhar Number </label>
            <input name="aadhar" type="text" maxLength={12} className="form-control" aria-describedby="emailHelp" value={aadhar} onChange={(e) => setAadhar(e.target.value)}/>
          </div>
          <div className="col mb-3">
            <label className="form-label">PIN Code </label>
            <input name="pin" type="text" maxLength={6} className="form-control" aria-describedby="emailHelp" value={pin} onChange={(e) => setPin(e.target.value)}/>
          </div>
        </div>
        <div className="row">
          <div className="col mb-3">
            <label className="form-label">Address </label>
            <input name="address" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={address} onChange={(e) => setAddress(e.target.value)}/>
          </div>
        </div>
        <div className="mb-3 form-switch" style={{paddingLeft: "0"}}>
          <label className="form-label">Active <span className="ei-col-red">*</span></label>
          <div>
            <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="activeSwitch" checked={active} onChange={(e) => setActive(e.target.checked)}/>
            <label className="form-check-label mx-3" htmlFor="activeSwitch">{active ? "On" : "Off"}</label>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mx-2">Create</button>
        <button onClick={handleClear} type="button" className="btn btn-primary mx-2">Clear</button>
      </form>
    </div>
  );
}
export default Create;