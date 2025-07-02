import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import toastr from 'toastr';
const token = localStorage.getItem('token');

function Create() {
  const [companies, setCompanies] = useState([]);
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [address, setAddress] = useState("");
  const [active, setActive] = useState(false);
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/server/company-list`, {
        method: "GET",
        headers: { 'authorization': `Bearer ${token}`, 'active': true },
      });
      if (response) {
        const result = await response.json();
        if (response.ok) {
          setCompanies(result.docs);
        } else {
          toastr.error(result.msg);
        }
      } else {
        toastr.error("We are unable to process now. Please try again later.");
      }
    } catch (error) {
      toastr.error("We are unable to process now. Please try again later.");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleClear = () => {
    setCompany("");
    setName("");
    setPhone("");
    setEmail("");
    setPin("");
    setAddress("");
    setActive(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const operatorData = {company, name, phone, email, pin, address, active };
    if (!company || !name || !phone || !email || !pin || !address){
      toastr.error("Please enter all the required values.");
      return;
    }
    const response = await fetch(`${VITE_API_BASE_URL}/server/operator-create`, {
      method: "POST",
      body: JSON.stringify(operatorData),
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      }
    });
    if (response){
      const result = await response.json();
      if (response.ok){
        toastr.success("Operator created successfully.");
        toastr.info("Login id is the 'CODE' and password is the 'Phone Number'.");
        navigate("/operators/operator-list");
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
              <label className="form-label">Company Name <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="type" value={company} onChange={(e) => setCompany(e.target.value)}>
                <option value="">--Select Company--</option>
                {companies.map((company) => (
                  <option key={company._id} value={company._id}>
                    {company.name}
                  </option>
                ))}
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