import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT
import toastr from 'toastr';
const token = sessionStorage.getItem('token');

function Create() {
    const [company_type, setCompanyType] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [pin, setPin] = useState("");
    const [address, setAddress] = useState("");
    const [gstNo, setGstNo] = useState("");
    const [active, setActive] = useState(false);
    const [subscription, setSubscription] = useState(false);
    const [subscriptionDuration, setSubscriptionDuration] = useState(0);
    const navigate = useNavigate();

  const handleClear = () => {
    setCompanyType("");
    setName("");
    setPhone("");
    setEmail("");
    setPin("");
    setAddress("");
    setGstNo("");
    setActive(false);
    setSubscription(false);
    setSubscriptionDuration(0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const companyData = {company_type, name, phone, email, pin, address, gstNo, active, subscription, subscriptionDuration };
    if (!company_type || !name || !phone || !email || !pin || !address){
      toastr.error("Please enter all the required values.");
      return;
    }
    const response = await fetch(`${HOST}:${PORT}/server/company-create`, {
      method: "POST",
      body: JSON.stringify(companyData),
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      }
    });
    if (response){
      const result = await response.json();
      if (response.ok){
        toastr.success("Company created successfully.");
        navigate("/companies/company-list");
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
              <label className="form-label">Company Type <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="type" value={company_type} onChange={(e) => setCompanyType(e.target.value)}>
                  <option>--Select company type--</option>
                  <option value="ELECTRONICS">ELECTRONICS</option>
                  <option value="MOBILES">MOBILES</option>
                  <option value="CLOTHS">CLOTHS</option>
                  <option value="SOLAR">SOLAR</option>
              </select>
          </div>
        </div>
          <div className="row">
          <div className="col mb-3">
            <label className="form-label">Name <span className="ei-col-red">*</span></label>
            <input name="name" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
          <div className="col mb-3">
            <label className="form-label">Phone <span className="ei-col-red">*</span></label>
            <input name="phone" type="text" maxLength={10} className="form-control" aria-describedby="emailHelp" value={phone} onChange={(e) => setPhone(e.target.value)}/>
          </div>
        </div>
        <div className="row">  
          <div className="col mb-3">
            <label className="form-label">Email Id <span className="ei-col-red">*</span></label>
            <input name="email" type="email" maxLength={70} className="form-control" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
          <div className="col mb-3">
            <label className="form-label">Pin Code<span className="ei-col-red">*</span></label>
            <input name="pin" type="text" maxLength={6} className="form-control" aria-describedby="emailHelp" value={pin} onChange={(e) => setPin(e.target.value)}/>
          </div>
        </div>
        <div className="row">  
          <div className="col mb-3">
            <label className="form-label">Address <span className="ei-col-red">*</span></label>
            <input name="address" type="text" maxLength={255} className="form-control" aria-describedby="emailHelp" value={address} onChange={(e) => setAddress(e.target.value)}/>
          </div>
        </div>
        <div className="row">  
            <div className="col mb-3">
                <label className="form-label">GST No</label>
                <input name="pin" type="text" maxLength={6} className="form-control" aria-describedby="emailHelp" value={gstNo} onChange={(e) => setGstNo(e.target.value)}/>
            </div>
        </div>
        <div className="mb-3 form-switch" style={{paddingLeft: "0"}}>
          <label className="form-label">Active <span className="ei-col-red">*</span></label>
          <div>
            <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="activeSwitch" checked={active} onChange={(e) => setActive(e.target.checked)}/>
            <label className="form-check-label mx-3" htmlFor="activeSwitch">{active ? "On" : "Off"}</label>
          </div>
        </div>
        <div className="mb-3 form-switch" style={{paddingLeft: "0"}}>
          <label className="form-label">Subscription <span className="ei-col-red">*</span></label>
          <div>
            <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="activeSubscription" checked={subscription} onChange={(e) => setSubscription(e.target.checked)}/>
            <label className="form-check-label mx-3" htmlFor="activeSubscription">{subscription ? "Yes" : "No"}</label>
          </div>
        </div>
        <div className="row">
            <div className="col mb-3">
              <label className="form-label">Subscription Duration <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="type" value={subscriptionDuration} onChange={(e) => setSubscriptionDuration(e.target.value)}>
                  <option>--Select duration in months--</option>
                  <option value="1">1 Month</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                  <option value="36">36 Months</option>
                  <option value="60">60 Months</option>
                  <option value="120">120 Months</option>
              </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mx-2">Create</button>
        <button onClick={handleClear} type="button" className="btn btn-primary mx-2">Celar</button>
      </form>
    </div>
  );
}
export default Create;