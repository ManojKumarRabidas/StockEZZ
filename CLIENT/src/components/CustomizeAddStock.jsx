import "../App.css";
import React, { useState, useEffect } from "react";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
import toastr from "toastr";
const token = sessionStorage.getItem("token");
function CustomizeAddStock() {
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        date: true,
        time: true,
        sl_no: true,
        sub_category: true,
        challan_no: true,
        item: true,
        batch_brand: true,
        batch_color: true,
        batch_capacity: true,
        batch_height: true,
        batch_power: true,
        batch_watt: true,
        batch_model: true,
        batch_form: true,
        batch_description: true,
        batch_extended_description: true,
        seller: true,
        total_quantity: true,
        batch_no: true,
        batch_location: true,
        batch_buy_price: true,
        batch_sell_price: true,
        per_piece_buy_price: true,
        per_piece_sell_price: true,
        batch_mfg_date: true,
        batch_exp_date: true,
        batch_warrantee_guarantee: true,
        batch_warrantee_guarantee_duration: true,
        batch_remarks: true,

        unique_code: true,
        brand: true,
        color: true,
        capacity: true,
        height: true,
        power: true,
        watt: true,
        model: true,
        description: true,
        extended_description: true,
        location: true,
        quantity: true,
        item_buy_price: true,
        item_sell_price: true,
        mfg_date: true,
        exp_date: true,
        form: true,
        remarks: true,
        warrantee_guarantee: true,
        warrantee_guarantee_duration: true,
      });
      
      const updateFormData = (key, value) => {
        console.log(key, value)
        setFormData((prev) => ({
          ...prev,
          [key]: value,
        }));
      };

  const [form_reset_status, setFormResetStatus] = useState(true)
  const [header_reset_status, setHeaderResetStatus] = useState(true)
  const [footer_reset_status, setFooterResetStatus] = useState(true)

  const fetchDetails = async () => {
    setLoading(true);
    try {
        const response = await fetch(`${HOST}:${PORT}/server/customize-add-stock-details`, {
            method: "PATCH",
            headers: { 'authorization': `Bearer ${token}` },
          });
          if (response) {
            const result = await response.json();
            if (response.ok) {
                if(result.stockStructure != null){
                    for (const [key, value] of Object.entries(result.stockStructure)) {
                        updateFormData(key, value);
                      }
                }
            } else {
              toastr.error(result.msg);
            }
            setLoading(false);
          } else {
            toastr.error("We are unable to process now. Please try again later.");
            setLoading(false);
          }
    } catch (err) {
        toastr.error("Failed to load details.");
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleReset = () => {
    const array = ['time', 'sl_no', 'sub_category', 'challan_no', 'batch_brand', 'batch_color', 'batch_capacity', 'batch_height', 'batch_power', 'batch_watt', 'batch_model', 'batch_form', 'batch_description', 'batch_extended_description', 'seller', 'batch_no', 'batch_location', 'batch_sell_price', 'per_piece_buy_price', 'per_piece_sell_price', 'batch_mfg_date', 'batch_exp_date', 'batch_warrantee_guarantee', 'batch_warrantee_guarantee_duration', 'batch_remarks', 'unique_code', 'brand', 'color', 'capacity', 'height', 'power', 'watt', 'model', 'description', 'extended_description', 'location', 'item_buy_price', 'item_sell_price', 'mfg_date', 'exp_date', 'form', 'remarks', 'warrantee_guarantee', 'warrantee_guarantee_duration'];

    for (const [key, value] of Object.entries(formData)) {
        if (array.includes(key)) {
            updateFormData(key, true);
        }
    }
  };
  const handleResetHeader = (value) => {
    if(value){setHeaderResetStatus(false)}else{setHeaderResetStatus(true)}  

    const keysToUpdate = ['time', 'sl_no', 'sub_category', 'challan_no', 'batch_brand', 'batch_color', 'batch_capacity', 'batch_height', 'batch_power', 'batch_watt', 'batch_model', 'batch_form', 'batch_description', 'batch_extended_description', 'seller', 'batch_no', 'batch_location', 'batch_sell_price', 'per_piece_buy_price', 'per_piece_sell_price', 'batch_mfg_date', 'batch_exp_date', 'batch_warrantee_guarantee', 'batch_warrantee_guarantee_duration', 'batch_remarks'];

    keysToUpdate.forEach(key => {
        updateFormData(key, value);
    });
  };
  const handleResetFooter = (value) => {
    if(value){setFooterResetStatus(false)}else{setFooterResetStatus(true)}  
    const keysToUpdate = ['unique_code', 'brand', 'color', 'capacity', 'height', 'power', 'watt', 'model', 'description', 'extended_description', 'location', 'item_buy_price', 'item_sell_price', 'mfg_date', 'exp_date', 'form', 'remarks', 'warrantee_guarantee', 'warrantee_guarantee_duration'];

    keysToUpdate.forEach(key => {
        updateFormData(key, value);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await fetch(`${HOST}:${PORT}/server/save-customize-add-stock-details`, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (response) {
      const result = await response.json();
      if (response.ok) {
        updateFormData("quantity", result.doc.quantity);
        // setFormData(result.doc)
        toastr.success("'Add Stock' customization saved successfully.");
      } else {
        toastr.error(result.msg);
      }
    } else {
      toastr.error("We are unable to process now. Please try again later.");
    }
  };

    if (loading) {
        return (
        <div className="container my-2 d-flex justify-content-center align-items-center" style={{height: "100%"}}>
            <div className="spinner-border text-secondary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
        );
    } else if(formData && !loading){
        return (
            <div className="container my-2">
            <form onSubmit={handleSubmit}>
                <h4 className="my-4">
                Turn on the fields you wish to see in the time of stock entry.
                </h4>
                <hr />
                <h6>Fields for a batch/lot : </h6>
                <hr />
                <div className="row">
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Date </label>
                            <div title="This can't be changed">
                                <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="dateSwitch" checked={formData.date} onChange={(e) => updateFormData("date", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="dateSwitch">{formData.date ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Time</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="timeSwitch" checked={formData.time} onChange={(e) => updateFormData("time", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="timeSwitch">{formData.time ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Sub Category </label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="sub_categorySwitch" checked={formData.sub_category} onChange={(e) => updateFormData("sub_category", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="sub_categorySwitch">{formData.sub_category ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Sl No </label>
                            <div title="This can't be changed" >
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="sl_noSwitch" checked={formData.sl_no} onChange={(e) => updateFormData("sl_no", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="sl_noSwitch">{formData.sl_no ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Challan No </label>
                            <div title="This can't be changed">
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="challan_noSwitch" checked={formData.challan_no} onChange={(e) => updateFormData("challan_no", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="challan_noSwitch">{formData.challan_no ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Item Name </label>
                            <div title="This can't be changed">
                                <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="itemSwitch" checked={formData.item} onChange={(e) => updateFormData("item", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="itemSwitch">{formData.item ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Brand</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchbrandSwitch" checked={formData.batch_brand} onChange={(e) => updateFormData("batch_brand", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batchbrandSwitch">{formData.batch_brand ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Color</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchcolorSwitch" checked={formData.batch_color} onChange={(e) => updateFormData("batch_color", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batchcolorSwitch">{formData.batch_color ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Capacity</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchcapacitySwitch" checked={formData.batch_capacity} onChange={(e) => updateFormData("batch_capacity", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batchcapacitySwitch">{formData.batch_capacity ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Height/Weidth </label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchheightSwitch" checked={formData.batch_height} onChange={(e) => updateFormData("batch_height", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batchheightSwitch">{formData.batch_height ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Power</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchpowerSwitch" checked={formData.batch_power} onChange={(e) => updateFormData("batch_power", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batchpowerSwitch">{formData.batch_power ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Watt</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchwattSwitch" checked={formData.batch_watt} onChange={(e) => updateFormData("batch_watt", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batchwattSwitch">{formData.batch_watt ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Model</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchModelSwitch" checked={formData.batch_model} onChange={(e) => updateFormData("batch_model", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batchModelSwitch">{formData.batch_model ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Form <span className="title-class" data-tooltip="Solid/ Lequid/ Gas or Tablet/ Syrup/ Capsule etc."><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                    </svg>
                                </span></label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchFormSwitch" checked={formData.batch_form} onChange={(e) => updateFormData("batch_form", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batchFormSwitch">{formData.batch_form ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Description </label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchdescriptionSwitch" checked={formData.batch_description} onChange={(e) => updateFormData("batch_description", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batchdescriptionSwitch">{formData.batch_description ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Extended Description </label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchExtendedDescriptionSwitch" checked={formData.batch_extended_description} onChange={(e) => updateFormData("batch_extended_description", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batchExtendedDescriptionSwitch">{formData.batch_extended_description ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Seller </label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="sellerSwitch" checked={formData.seller} onChange={(e) => updateFormData("seller", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="sellerSwitch">{formData.seller ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Total Quantity </label>
                            <div title="This can't be changed">
                                <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="totalQuantitySwitch" checked={formData.total_quantity} onChange={(e) => updateFormData("total_quantity", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="totalQuantitySwitch">{formData.total_quantity ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Batch No</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchNoSwitch" checked={formData.batch_no} onChange={(e) => updateFormData("batch_no", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batchNoSwitch">{formData.batch_no ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Location</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchLocationSwitch" checked={formData.batch_location} onChange={(e) => updateFormData("batch_location", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batchLocationSwitch">{formData.batch_location ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Batch Buy Price</label>
                            <div>
                                <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batch_buy_priceSwitch" checked={formData.batch_buy_price} onChange={(e) => updateFormData("batch_buy_price", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batch_buy_priceSwitch">{formData.batch_buy_price ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Batch Sell Price</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batch_sell_priceSwitch" checked={formData.batch_sell_price} onChange={(e) => updateFormData("batch_sell_price", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batch_sell_priceSwitch">{formData.batch_sell_price ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Per Piece Buy Price</label>
                            <div title="This can't be changed">
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="per_peace_buy_priceSwitch" checked={formData.per_piece_buy_price} onChange={(e) => updateFormData("per_piece_buy_price", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="per_peace_buy_priceSwitch">{formData.per_piece_buy_price ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Per Piece Sell Price</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="per_peace_sell_priceSwitch" checked={formData.per_piece_sell_price} onChange={(e) => updateFormData("per_piece_sell_price", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="per_peace_sell_priceSwitch">{formData.per_piece_sell_price ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Batch Mfg Date</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batch_mfg_dateSwitch" checked={formData.batch_mfg_date} onChange={(e) => updateFormData("batch_mfg_date", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batch_mfg_dateSwitch">{formData.batch_mfg_date ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Batch Exp Date</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batch_exp_dateSwitch" checked={formData.batch_exp_date} onChange={(e) => updateFormData("batch_exp_date", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batch_exp_dateSwitch">{formData.batch_exp_date ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4 mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Batch Warrantee/Guarente</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batch_warrantee_guaranteeSwitch" checked={formData.batch_warrantee_guarantee} onChange={(e) => updateFormData("batch_warrantee_guarantee", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batch_warrantee_guaranteeSwitch">{formData.batch_warrantee_guarantee ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-5 mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Batch Warrantee/Guarente Duration</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batch_warrantee_guarantee_durationSwitch" checked={formData.batch_warrantee_guarantee_duration} onChange={(e) => updateFormData("batch_warrantee_guarantee_duration", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batch_warrantee_guarantee_durationSwitch">{formData.batch_warrantee_guarantee_duration ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-3 mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Remarks </label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchRemarksSwitch" checked={formData.batch_remarks} onChange={(e) => updateFormData("batch_remarks", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="batchRemarksSwitch">{formData.batch_remarks ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                </div>
                <div className="d-flex justify-content-end mb-4">
                    <button type="button" className="btn btn-primary ms-4 bg-danger border-0" onClick={()=>handleResetHeader(header_reset_status)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                        </svg> Reset
                    </button>
                </div>
                <hr />
                <h6>Multiple/Individual item fields in a batch/lot : </h6>
                <hr />
                <div className="row">
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Unique Code </label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="uniqueCodeSwitch" checked={formData.unique_code} onChange={(e) => updateFormData("unique_code", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="uniqueCodeSwitch">{formData.unique_code ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Brand </label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="brandSwitch" checked={formData.brand} onChange={(e) => updateFormData("brand", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="brandSwitch">{formData.brand ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Color</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="colorSwitch" checked={formData.color} onChange={(e) => updateFormData("color", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="colorSwitch">{formData.color ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Capacity</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="capacitySwitch" checked={formData.capacity} onChange={(e) => updateFormData("capacity", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="capacitySwitch">{formData.capacity ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Height/Weidth </label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="heightSwitch" checked={formData.height} onChange={(e) => updateFormData("height", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="heightSwitch">{formData.height ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Power</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="powerSwitch" checked={formData.power} onChange={(e) => updateFormData("power", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="powerSwitch">{formData.power ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Watt</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="wattSwitch" checked={formData.watt} onChange={(e) => updateFormData("watt", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="wattSwitch">{formData.watt ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-3 mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Model</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="modelSwitch" checked={formData.model} onChange={(e) => updateFormData("model", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="modelSwitch">{formData.model ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Description </label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="descriptionSwitch" checked={formData.description} onChange={(e) => updateFormData("description", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="descriptionSwitch">{formData.description ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Extended Description </label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="extendedDescriptionSwitch" checked={formData.extended_description} onChange={(e) => updateFormData("extended_description", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="extendedDescriptionSwitch">{formData.extended_description ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Location <span className="title-class" data-tooltip="Turn on if Warrantee/Guarente is available"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                    </svg>
                                </span>
                            </label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="locationSwitch" checked={formData.location} onChange={(e) => updateFormData("location", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="locationSwitch">{formData.location ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Quantity <span className="title-class" data-tooltip="If any field is turned on in 'Individual items field' section, this 'Quantity' field will show in the 'Add Stock' form autometically."><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                    </svg>
                                </span></label>
                            <div title="This can't be changed">
                                <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="quantitySwitch" checked={formData.quantity} onChange={(e) => updateFormData("quantity", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="quantitySwitch">{formData.quantity ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Buy Price </label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="item_buy_priceSwitch" checked={formData.item_buy_price} onChange={(e) => updateFormData("item_buy_price", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="item_buy_priceSwitch">{formData.item_buy_price ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Sell Price </label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="item_sell_priceSwitch" checked={formData.item_sell_price} onChange={(e) => updateFormData("item_sell_price", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="item_sell_priceSwitch">{formData.item_sell_price ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Mfg Date </label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="mfgDateSwitch" checked={formData.mfg_date} onChange={(e) => updateFormData("mfg_date", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="mfgDateSwitch">{formData.mfg_date ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Exp Date</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="expDateSwitch" checked={formData.exp_date} onChange={(e) => updateFormData("exp_date", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="expDateSwitch">{formData.exp_date ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Form</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="formSwitch" checked={formData.form} onChange={(e) => updateFormData("form", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="formSwitch">{formData.form ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Remarks</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="remarksSwitch" checked={formData.remarks} onChange={(e) => updateFormData("remarks", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="remarksSwitch">{formData.remarks ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Warrantee/Guarente <span className="title-class" data-tooltip="Turn on if Warrantee/Guarente is available"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                    </svg>
                                </span>
                            </label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="warrantee_guaranteeSwitch" checked={formData.warrantee_guarantee} onChange={(e) => updateFormData("warrantee_guarantee", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="warrantee_guaranteeSwitch">{formData.warrantee_guarantee ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                    <div className="col mb-3">
                        <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                            <label className="form-label mx-2">Warrantee/Guarente Duration</label>
                            <div>
                                <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="warrantee_guarantee_durationSwitch" checked={formData.warrantee_guarantee_duration} onChange={(e) => updateFormData("warrantee_guarantee_duration", e.target.checked)}/>
                                <label className="form-check-label mx-3" htmlFor="warrantee_guarantee_durationSwitch">{formData.warrantee_guarantee_duration ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-end mb-4">
                    <button type="button" className="btn btn-primary ms-4 bg-danger border-0" onClick={()=>handleResetFooter(footer_reset_status)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                        </svg> Reset
                    </button>
                </div>
                <hr />
                <div className="d-flex justify-content-end mb-4">
                    <button type="button" className="btn btn-primary bg-danger border-0" onClick={()=>handleReset()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                        </svg> Reset All
                    </button>
                    <button type="submit" className="btn btn-primary bg-success ms-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-floppy" viewBox="0 0 16 16">
                            <path d="M11 2H9v3h2z"/>
                            <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                        </svg> Save All
                    </button>
                </div>
            </form>
            </div>
        );
    }
}
export default CustomizeAddStock;
