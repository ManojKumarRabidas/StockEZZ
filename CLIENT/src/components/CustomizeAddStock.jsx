import "../App.css";
import React, { useState, useEffect } from "react";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
import toastr from "toastr";
const token = sessionStorage.getItem("token");
function CustomizeAddStock() {
  const [sl_no, setSlNo] = useState(true);
  const [date, setDate] = useState(true);
  const [time, setTime] = useState(true);
  const [sub_category, setSubCategory] = useState(true)
  const [challan_no, setChallanNo] = useState(true);
  const [item, setItem] = useState(true);
  const [batch_brand, setBatchBrand] = useState(true);
  const [batch_color, setBatchColor] = useState(true);
  const [batch_capacity, setBatchCapacity] = useState(true);
  const [batch_height, setBatchHeight] = useState(true);
  const [batch_power, setBatchPower] = useState(true);
  const [batch_description, setBatchDescription] = useState(true);
  const [total_quantity, setTotalQuantity] = useState(true);
  const [seller, setSeller] = useState(true);
  const [batch_model, setBatchModel] = useState(true);
  const [batch_no, setBatchNo] = useState(true);
  const [batch_buy_price, setBatchBuyPrice] = useState(true);
  const [batch_sell_price, setBatchSellPrice] = useState(true);
  const [per_piece_buy_price, setPerPeaceBuyPrice] = useState(true);
  const [per_piece_sell_price, setPerPeaceSellPrice] = useState(true);
  const [batch_mfg_date, setBatchMfgDate] = useState(true);
  const [batch_exp_date, setBatchExpDate] = useState(true);
  const [batch_warrantee_guarantee, setBatchWarranteeGuarente] = useState(true)
  const [batch_warrantee_guarantee_duration, setBatchWarranteeGuarenteDuration] = useState(true)
  const [item_status, setItemStatus] = useState(true);
  const [return_reason, setReturnReason] = useState(true);
  const [remarks, setRemarks] = useState(true);
  
  const [unique_code, setUniqueCode] = useState(true);
  const [model, setModel] = useState(true);
  const [brand, setBrand] = useState(true);
  const [color, setColor] = useState(true);
  const [capacity, setCapacity] = useState(true);
  const [height, setHeight] = useState(true);
  const [power, setPower] = useState(true);
  const [description, setDescription] = useState(true);
  const [quantity, setQuantity] = useState(true);
  const [mfg_date, setMfgDate] = useState(true);
  const [exp_date, setExpDate] = useState(true)
  const [item_buy_price, setItemBuyPrice] = useState(true)
  const [item_sell_price, setItemSellPrice] = useState(true);
  const [warrantee_guarantee, setWarranteeGuarente] = useState(true)
  const [warrantee_guarantee_duration, setWarranteeGuarenteDuration] = useState(true)

  const [form_reset_status, setFormResetStatus] = useState(true)
  const [header_reset_status, setHeaderResetStatus] = useState(true)
  const [footer_reset_status, setFooterResetStatus] = useState(true)

  const fetchDetails = async () => {
    try {
        const response = await fetch(`${HOST}:${PORT}/server/customize-add-stock-details`, {
            method: "PATCH",
            headers: { 'authorization': `Bearer ${token}` },
          });
          if (response) {
            const result = await response.json();
            if (response.ok) {
                if(result.stockStructure != null){
                    setSlNo(result.stockStructure.sl_no);
                    setDate(result.stockStructure.date);
                    setTime(result.stockStructure.time);
                    setSubCategory(result.stockStructure.sub_category);
                    setChallanNo(result.stockStructure.challan_no);
                    setItem(result.stockStructure.item);
                    setBatchBrand(result.stockStructure.batch_brand);
                    setBatchColor(result.stockStructure.batch_color);
                    setBatchCapacity(result.stockStructure.batch_capacity);
                    setBatchHeight(result.stockStructure.batch_height);
                    setBatchPower(result.stockStructure.batch_power);
                    setBatchModel(result.stockStructure.batch_model);
                    setBatchDescription(result.stockStructure.batch_description);
                    setSeller(result.stockStructure.seller);
                    setTotalQuantity(result.stockStructure.total_quantity);
                    setBatchNo(result.stockStructure.batch_no);
                    setBatchBuyPrice(result.stockStructure.batch_buy_price);
                    setBatchSellPrice(result.stockStructure.batch_sell_price);
                    setPerPeaceBuyPrice(result.stockStructure.per_piece_buy_price);
                    setPerPeaceSellPrice(result.stockStructure.per_piece_sell_price);
                    setBatchMfgDate(result.stockStructure.batch_mfg_date);
                    setBatchExpDate(result.stockStructure.batch_exp_date);
                    setBatchWarranteeGuarente(result.stockStructure.batch_warrantee_guarantee);
                    setBatchWarranteeGuarenteDuration(result.stockStructure.batch_warrantee_guarantee_duration);
                    setItemStatus(result.stockStructure.item_status);
                    setReturnReason(result.stockStructure.return_reason);
                    setRemarks(result.stockStructure.remarks);
                    setUniqueCode(result.stockStructure.unique_code);
                    setModel(result.stockStructure.model);
                    setBrand(result.stockStructure.brand);
                    setColor(result.stockStructure.color);
                    setCapacity(result.stockStructure.capacity);
                    setHeight(result.stockStructure.height);
                    setPower(result.stockStructure.power);
                    setDescription(result.stockStructure.description);
                    setQuantity(result.stockStructure.quantity);
                    setMfgDate(result.stockStructure.mfg_date);
                    setExpDate(result.stockStructure.exp_date);
                    setItemBuyPrice(result.stockStructure.item_buy_price);
                    setItemSellPrice(result.stockStructure.item_sell_price);
                    setWarranteeGuarente(result.stockStructure.warrantee_guarantee);
                    setWarranteeGuarenteDuration(result.stockStructure.warrantee_guarantee_duration);
                }
            } else {
              toastr.error(result.msg);
            }
          } else {
            toastr.error("We are unable to process now. Please try again later.");
          }
    } catch (err) {
      toastr.error("Failed to load details.");
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleReset = () => {
    setSlNo(true);
    setDate(true);
    setTime(true);
    setSubCategory(true)
    setChallanNo(true);
    setItem(true);
    setBatchModel(true);
    setBatchBrand(true);
    setBatchColor(true);
    setBatchCapacity(true);
    setBatchHeight(true);
    setBatchPower(true);
    setBatchDescription(true);
    setSeller(true)
    setTotalQuantity(true);
    setBatchNo(true);
    setBatchBuyPrice(true);
    setBatchSellPrice(true);
    setPerPeaceBuyPrice(true);
    setPerPeaceSellPrice(true);
    setBatchMfgDate(true);
    setBatchExpDate(true);
    setBatchWarranteeGuarente(true);
    setBatchWarranteeGuarenteDuration(true);
    setItemStatus(true);
    setReturnReason(true);
    setRemarks(true);
    setUniqueCode(true);
    setBrand(true);
    setColor(true);
    setCapacity(true);
    setHeight(true);
    setPower(true);
    setDescription(true);
    setMfgDate(true);
    setExpDate(true);
    setItemBuyPrice(true);
    setItemSellPrice(true);
    setModel(true);
    setWarranteeGuarente(true);
    setWarranteeGuarenteDuration(true);
  };
  const handleResetHeader = (value) => {
    if(value){setHeaderResetStatus(false)}else{setHeaderResetStatus(true)}  
    setTime(value);
    setSubCategory(value);
    setChallanNo(value);
    setBatchModel(value);
    setBatchBrand(value);
    setBatchColor(value);
    setBatchCapacity(value);
    setBatchHeight(value);
    setBatchPower(value);
    setBatchDescription(value);
    setSeller(value);
    setBatchNo(value);
    setBatchSellPrice(value);
    setPerPeaceBuyPrice(value);
    setPerPeaceSellPrice(value);
    setBatchMfgDate(value);
    setBatchExpDate(value);
    setBatchWarranteeGuarente(value);
    setBatchWarranteeGuarenteDuration(value);
    setReturnReason(value);
    setRemarks(value);
  };
  const handleResetFooter = (value) => {
    if(value){setFooterResetStatus(false)}else{setFooterResetStatus(true)}  
    setUniqueCode(value);
    setBrand(value);
    setColor(value);
    setCapacity(value);
    setHeight(value);
    setPower(value);
    setDescription(value);
    setMfgDate(value);
    setExpDate(value);
    setItemBuyPrice(value);
    setItemSellPrice(value);
    setModel(value);
    setWarranteeGuarente(value);
    setWarranteeGuarenteDuration(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {sl_no, date, time, sub_category, challan_no, item, batch_brand, batch_color, batch_capacity, batch_height, batch_power, batch_description, batch_model, total_quantity, unique_code, seller, quantity, batch_no, batch_buy_price, batch_sell_price, per_piece_buy_price, per_piece_sell_price, batch_mfg_date, batch_exp_date, batch_warrantee_guarantee, batch_warrantee_guarantee_duration, item_status, return_reason, remarks, model, brand, color, capacity, height, power, description, mfg_date, exp_date, item_buy_price, item_sell_price, warrantee_guarantee, warrantee_guarantee_duration};
    const response = await fetch(`${HOST}:${PORT}/server/save-customize-add-stock-details`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (response) {
      const result = await response.json();
      if (response.ok) {
        setQuantity(result.doc.quantity);
        toastr.success("'Add Stock' customization saved successfully.");
      } else {
        toastr.error(result.msg);
      }
    } else {
      toastr.error("We are unable to process now. Please try again later.");
    }
  };

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
                        <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="dateSwitch" checked={date} onChange={(e) => setDate(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="dateSwitch">{date ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Time</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="timeSwitch" checked={time} onChange={(e) => setTime(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="timeSwitch">{time ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Sub Category </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="sub_categorySwitch" checked={sub_category} onChange={(e) => setSubCategory(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="sub_categorySwitch">{sub_category ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Sl No </label>
                    <div title="This can't be changed" >
                        <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="sl_noSwitch" checked={sl_no} onChange={(e) => setSlNo(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="sl_noSwitch">{sl_no ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Challan No </label>
                    <div title="This can't be changed">
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="challan_noSwitch" checked={challan_no} onChange={(e) => setChallanNo(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="challan_noSwitch">{challan_no ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Item Name </label>
                    <div title="This can't be changed">
                        <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="itemSwitch" checked={item} onChange={(e) => setItem(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="itemSwitch">{item ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Brand</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchbrandSwitch" checked={batch_brand} onChange={(e) => setBatchBrand(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batchbrandSwitch">{batch_brand ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Color</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchcolorSwitch" checked={batch_color} onChange={(e) => setBatchColor(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batchcolorSwitch">{batch_color ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Capacity</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchcapacitySwitch" checked={batch_capacity} onChange={(e) => setBatchCapacity(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batchcapacitySwitch">{batch_capacity ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Height/Weidth </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchheightSwitch" checked={batch_height} onChange={(e) => setBatchHeight(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batchheightSwitch">{batch_height ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Power/Watt</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchpowerSwitch" checked={batch_power} onChange={(e) => setBatchPower(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batchpowerSwitch">{batch_power ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Model</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchModelSwitch" checked={batch_model} onChange={(e) => setBatchModel(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batchModelSwitch">{batch_model ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Description </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchdescriptionSwitch" checked={batch_description} onChange={(e) => setBatchDescription(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batchdescriptionSwitch">{batch_description ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Seller </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="sellerSwitch" checked={seller} onChange={(e) => setSeller(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="sellerSwitch">{seller ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Total Quantity </label>
                    <div title="This can't be changed">
                        <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="totalQuantitySwitch" checked={total_quantity} onChange={(e) => setTotalQuantity(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="totalQuantitySwitch">{total_quantity ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Batch No</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchNoSwitch" checked={batch_no} onChange={(e) => setBatchNo(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batchNoSwitch">{batch_no ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Batch Buy Price</label>
                    <div>
                        <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batch_buy_priceSwitch" checked={batch_buy_price} onChange={(e) => setBatchBuyPrice(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batch_buy_priceSwitch">{batch_buy_price ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Batch Sell Price</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batch_sell_priceSwitch" checked={batch_sell_price} onChange={(e) => setBatchSellPrice(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batch_sell_priceSwitch">{batch_sell_price ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Per Piece Buy Price</label>
                    <div title="This can't be changed">
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="per_peace_buy_priceSwitch" checked={per_piece_buy_price} onChange={(e) => setPerPeaceBuyPrice(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="per_peace_buy_priceSwitch">{per_piece_buy_price ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Per Piece Sell Price</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="per_peace_sell_priceSwitch" checked={per_piece_sell_price} onChange={(e) => setPerPeaceSellPrice(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="per_peace_sell_priceSwitch">{per_piece_sell_price ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Batch Mfg Date</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batch_mfg_dateSwitch" checked={batch_mfg_date} onChange={(e) => setBatchMfgDate(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batch_mfg_dateSwitch">{batch_mfg_date ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Batch Exp Date</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batch_exp_dateSwitch" checked={batch_exp_date} onChange={(e) => setBatchExpDate(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batch_exp_dateSwitch">{batch_exp_date ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Batch Warrantee/Guarente</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batch_warrantee_guaranteeSwitch" checked={batch_warrantee_guarantee} onChange={(e) => setBatchWarranteeGuarente(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batch_warrantee_guaranteeSwitch">{batch_warrantee_guarantee ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Batch Warrantee/Guarente Duration</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batch_warrantee_guarantee_durationSwitch" checked={batch_warrantee_guarantee_duration} onChange={(e) => setBatchWarranteeGuarenteDuration(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batch_warrantee_guarantee_durationSwitch">{batch_warrantee_guarantee_duration ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Item Status <span className="title-class" data-tooltip=" Received/ Accepted/ Returned"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                            </svg>
                        </span>
                    </label>
                    <div title="This can't be changed">
                        <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="itemStatusSwitch" checked={item_status} onChange={(e) => setItemStatus(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="itemStatusSwitch">{item_status ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Return Reason(If Returned) </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="returnReasonSwitch" checked={return_reason} onChange={(e) => setReturnReason(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="returnReasonSwitch">{return_reason ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Remarks </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="remarksSwitch" checked={remarks} onChange={(e) => setRemarks(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="remarksSwitch">{remarks ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="d-flex justify-content-end mb-4">
            <button type="button" className="btn btn-primary ms-4" onClick={()=>handleResetHeader(header_reset_status)}>Reset</button>
        </div>
        <hr />
        <h6>Multiple/Individual item fields in a batch/lot : </h6>
        <hr />
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Unique Code </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="uniqueCodeSwitch" checked={unique_code} onChange={(e) => setUniqueCode(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="uniqueCodeSwitch">{unique_code ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Brand </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="brandSwitch" checked={brand} onChange={(e) => setBrand(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="brandSwitch">{brand ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Color</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="colorSwitch" checked={color} onChange={(e) => setColor(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="colorSwitch">{color ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Capacity</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="capacitySwitch" checked={capacity} onChange={(e) => setCapacity(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="capacitySwitch">{capacity ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Height/Weidth </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="heightSwitch" checked={height} onChange={(e) => setHeight(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="heightSwitch">{height ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Power/Watt</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="powerSwitch" checked={power} onChange={(e) => setPower(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="powerSwitch">{power ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col-3 mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Model</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="modelSwitch" checked={model} onChange={(e) => setModel(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="modelSwitch">{model ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Description </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="descriptionSwitch" checked={description} onChange={(e) => setDescription(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="descriptionSwitch">{description ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
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
                        <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="quantitySwitch" checked={quantity} onChange={(e) => setQuantity(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="quantitySwitch">{quantity ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Item Buy Price </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="item_buy_priceSwitch" checked={item_buy_price} onChange={(e) => setItemBuyPrice(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="item_buy_priceSwitch">{item_buy_price ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Item Sell Price </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="item_sell_priceSwitch" checked={item_sell_price} onChange={(e) => setItemSellPrice(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="item_sell_priceSwitch">{item_sell_price ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Mfg Date </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="mfgDateSwitch" checked={mfg_date} onChange={(e) => setMfgDate(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="mfgDateSwitch">{mfg_date ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-3 mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Exp Date</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="expDateSwitch" checked={exp_date} onChange={(e) => setExpDate(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="expDateSwitch">{exp_date ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col-4 mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Warrantee/Guarente <span className="title-class" data-tooltip="Turn on if Warrantee/Guarente is available"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                            <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                            </svg>
                        </span>
                    </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="warrantee_guaranteeSwitch" checked={warrantee_guarantee} onChange={(e) => setWarranteeGuarente(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="warrantee_guaranteeSwitch">{warrantee_guarantee ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col-5 mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Warrantee/Guarente Duration</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="warrantee_guarantee_durationSwitch" checked={warrantee_guarantee_duration} onChange={(e) => setWarranteeGuarenteDuration(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="warrantee_guarantee_durationSwitch">{warrantee_guarantee_duration ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="d-flex justify-content-end mb-4">
            <button type="button" className="btn btn-primary ms-4" onClick={()=>handleResetFooter(footer_reset_status)}>Reset</button>
        </div>
        <hr />
        <div className="d-flex justify-content-end mb-4">
            <button type="submit" className="btn btn-primary">Save All</button>
            <button type="button" className="btn btn-primary ms-4" onClick={()=>handleReset()}>Reset All</button>
        </div>
      </form>
    </div>
  );
}
export default CustomizeAddStock;
