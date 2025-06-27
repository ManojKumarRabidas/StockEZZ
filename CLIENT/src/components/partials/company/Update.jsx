import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
const token = localStorage.getItem('token');
import toastr from 'toastr';
function Update() {
    const [company_types, setCompanyTypes] = useState([]);
    const [company_subtypes, setCompanySubtypes] = useState([]);
    const [company_type, setCompanyType] = useState("");
    const [company_subtype, setCompanySubtype] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [pin, setPin] = useState("");
    const [address, setAddress] = useState("");
    const [gstNo, setGstNo] = useState("");
    const [director, setDirector] = useState("");
    const [active, setActive] = useState(false);
    const [subscription, setSubscription] = useState(false);
    const [subscriptionDuration, setSubscriptionDuration] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

  const handleClear = () => {
    setCompanyType("");
    setCompanySubtypes("");
    setName("");
    setPhone("");
    setEmail("");
    setPin("");
    setAddress("");
    setGstNo("");
    setDirector("");
    setActive(false);
    setSubscription(false);
    setSubscriptionDuration("");
  };

  const changeSubscription = (value) =>{
    setSubscription(value)
    setSubscriptionDuration("")
  }
  const getCompanyCategories = async ()=>{
    try {
      const response = await fetch(`${HOST}:${PORT}/server/category-list`, {
        method: "GET",
        headers: { 'authorization': `Bearer ${token}`, 'active': true },
      });
      if (response) {
        const result = await response.json();
        if (response.ok) {
          setCompanyTypes(result.docs);
        } else {
          toastr.error(result.msg);
        }
      } else {
        toastr.error("We are unable to process now. Please try again later.");
      }
    } catch (error) {
      toastr.error("We are unable to process now. Please try again later.");
    }
  }

  const getCompanyData = async () => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/company-details/${id}`, {
        method: "GET",
        headers: { 'authorization': `Bearer ${token}` },
      });
      if (response) {
        const result = await response.json();
        if (response.ok) {
            setCompanyType(result.doc.company_type);
            setName(result.doc.name);
            setPhone(result.doc.phone);
            setEmail(result.doc.email);
            setPin(result.doc.pin);
            setAddress(result.doc.address);
            setGstNo(result.doc.gstNo);
            setDirector(result.doc.director);
            setActive(result.doc.active);
            setSubscription(result.doc.subscription);
            setSubscriptionDuration(result.doc.subscriptionDuration);
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
    getCompanyCategories();
    getCompanyData();
  }, []);
  
  const changeCompanyType = (value)=>{
    setCompanyType(value)
    for(let i=0; i<company_types.length; i++){
      if(value == company_types[i]._id){
        setCompanySubtypes(company_types[i].sub_categories)
      }
    }

  };

  const handleEdit = async (event) => {
    event.preventDefault();
    const updateCompany = {company_type, company_subtype, name, phone, email, pin, address, gstNo, director, active, subscription, subscriptionDuration };
    if (!company_type || !name || !phone || !email || !pin || !address || !director){
      toastr.error("Please enter all the required values.");
      return;
    }
    try {
      const response = await fetch(`${HOST}:${PORT}/server/company-update/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updateCompany),
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          toastr.success("Company details updated successfully.");
            navigate("/companies/company-list");
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

  return (
    <div className="container my-2">
      <form onSubmit={handleEdit} className="shadow-sm p-3 my-4 bg-body-tertiary rounded">
        
      <div className="row">
            <div className="col mb-3">
              <label className="form-label">Company Type <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="type" value={company_type} onChange={(e) => changeCompanyType(e.target.value)}>
                  <option>--Select company type--</option>
                  {company_types.map((item)=>(
                    <option key={item._id} value={item._id}>{item.category}</option>
                  ))}
              </select>
          </div>
          {company_type && <div className="col mb-3">
              <label className="form-label">Company Sub-Type </label>
              <select className="form-select" aria-label="Default select example" name="type" value={company_subtype} onChange={(e) => setCompanySubtype(e.target.value)}>
                  <option>--Select company sub-type (Optional)--</option>
                  {company_subtypes.map((item)=>(
                    <option key={item} value={item}>{item}</option>
                  ))}
              </select>
          </div>}
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
                <input name="gstNo" type="text" maxLength={20} className="form-control" aria-describedby="emailHelp" value={gstNo} onChange={(e) => setGstNo(e.target.value)}/>
            </div>
            <div className="col mb-3">
                <label className="form-label">Director Name <span className="ei-col-red">*</span></label>
                <input name="pin" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={director} onChange={(e) => setDirector(e.target.value)}/>
            </div>
        </div>
        <div className="row">  
            <div className="col mb-3">
              <div className="mb-3 form-switch" style={{paddingLeft: "0"}}>
                <label className="form-label">Active <span className="ei-col-red">*</span></label>
                <div>
                  <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="activeSwitch" checked={active} onChange={(e) => setActive(e.target.checked)}/>
                  <label className="form-check-label mx-3" htmlFor="activeSwitch">{active ? "On" : "Off"}</label>
                </div>
              </div>
            </div>
            <div className="col mb-3">
              <div className="mb-3 form-switch" style={{paddingLeft: "0"}}>
                <label className="form-label">Subscription <span className="ei-col-red">*</span></label>
                <div>
                  <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="activeSubscription" checked={subscription} onChange={(e) => changeSubscription(e.target.checked)}/>
                  <label className="form-check-label mx-3" htmlFor="activeSubscription">{subscription ? "Yes" : "No"}</label>
                </div>
              </div>
            </div>
            {subscription && <div className="col mb-3">
              <label className="form-label">Subscription Duration <span className="ei-col-red">*</span></label>
                <select className="form-select" aria-label="Default select example" name="type" value={subscriptionDuration} onChange={(e) => setSubscriptionDuration(e.target.value)}>
                    <option>--Select duration--</option>
                    <option value="1">1 Month</option>
                    <option value="6">6 Months</option>
                    <option value="12">1 Year</option>
                    <option value="36">3 Years</option>
                    <option value="60">5 Years</option>
                    <option value="120">10 Years</option>
                </select>
            </div>}
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
        <button onClick={handleClear} type="button" className="btn btn-primary mx-2">Clear</button>
      </form>
    </div>
  );
}

export default Update;
