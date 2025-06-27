import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
const token = localStorage.getItem('token');
import toastr from 'toastr';
function Update() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [pin, setPin] = useState("");
    const [aadhar, setAadhar] = useState("");
    const [active, setActive] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

  const handleClear = () => {
    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setPin("");
    setAadhar("");
    setActive(false);
  };

  const getBuyerData = async () => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/buyer-details/${id}`, {
        method: "GET",
        headers: { 'authorization': `Bearer ${token}` },
      });
      if (response) {
        const result = await response.json();
        if (response.ok) {
            setName(result.doc.name);
            setPhone(result.doc.phone);
            setEmail(result.doc.email);
            setAddress(result.doc.address);
            setPin(result.doc.pin);
            setAadhar(result.doc.aadhar);
            setActive(result.doc.active);
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
    getBuyerData();
  }, []);

  const handleEdit = async (event) => {
    event.preventDefault();
    const updateBuyer = {name, phone, email, address, pin, aadhar, active };
    if (!name || !phone ){
      toastr.error("Please enter all the required values.");
      return;
    }
    try {
      const response = await fetch(`${HOST}:${PORT}/server/buyer-update/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updateBuyer),
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          toastr.success("Buyer's details updated successfully.");
            navigate("/buyers/buyer-list");
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
            <input name="aadhar" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={aadhar} onChange={(e) => setAadhar(e.target.value)}/>
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
        <button type="submit" className="btn btn-primary">Update</button>
        <button onClick={handleClear} type="button" className="btn btn-primary mx-2">Clear</button>
      </form>
    </div>
  );
}

export default Update;
