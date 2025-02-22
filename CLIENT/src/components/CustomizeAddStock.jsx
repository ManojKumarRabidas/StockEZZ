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
  const [item, setItem] = useState(true);
  const [brand, setBrand] = useState(true);
  const [color, setColor] = useState(true);
  const [capacity, setCapacity] = useState(true);
  const [height, setHeight] = useState(true);
  const [power, setPower] = useState(true);
  const [description, setDescription] = useState(true);
  const [seller, setSeller] = useState(true);
  const [quantity, setQuantity] = useState(true);
  const [batch_no, setBatchNo] = useState(true);
  const [batch_buy_price, setBatchBuyPrice] = useState(true);
  const [batch_sell_price, setBatchSellPrice] = useState(true);
  const [per_peace_buy_price, setPerPeaceBuyPrice] = useState(true);
  const [per_peace_sell_price, setPerPeaceSellPrice] = useState(true);
  const [batch_mfg_date, setBatchMfgDate] = useState(true);
  const [batch_exp_date, setBatchExpDate] = useState(true);
  const [batch_warrantee_guarantee, setBatchWarranteeGuarente] = useState(true)
  const [batch_warrantee_guarantee_duration, setBatchWarranteeGuarenteDuration] = useState(true)
  const [item_status, setItemStatus] = useState(true);
  const [return_reason, setReturnReason] = useState(true);
  const [remarks, setRemarks] = useState(true);

  const [model, setModel] = useState(true);
  const [unique_code, setUniqueCode] = useState(true);
  const [mfg_date, setMfgDate] = useState(true);
  const [exp_date, setExpDate] = useState(true)
  const [item_buy_price, setItemBuyPrice] = useState(true)
  const [item_sell_price, setItemSellPrice] = useState(true);
  const [warrantee_guarantee, setWarranteeGuarente] = useState(true)
  const [warrantee_guarantee_duration, setWarranteeGuarenteDuration] = useState(true)

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
                    setItem(result.stockStructure.item);
                    setBrand(result.stockStructure.item);
                    setColor(result.stockStructure.item);
                    setCapacity(result.stockStructure.item);
                    setHeight(result.stockStructure.item);
                    setPower(result.stockStructure.item);
                    setDescription(result.stockStructure.item);
                    setSeller(result.stockStructure.seller);
                    setQuantity(result.stockStructure.quantity);
                    setBatchNo(result.stockStructure.batch_no);
                    setBatchBuyPrice(result.stockStructure.batch_buy_price);
                    setBatchSellPrice(result.stockStructure.batch_sell_price);
                    setPerPeaceBuyPrice(result.stockStructure.per_peace_buy_price);
                    setPerPeaceSellPrice(result.stockStructure.per_peace_sell_price);
                    setBatchMfgDate(result.stockStructure.batch_mfg_date);
                    setBatchExpDate(result.stockStructure.batch_exp_date);
                    setBatchWarranteeGuarente(result.stockStructure.batch_warrantee_guarantee);
                    setBatchWarranteeGuarenteDuration(result.stockStructure.batch_warrantee_guarantee_duration);
                    setItemStatus(result.stockStructure.item_status);
                    setReturnReason(result.stockStructure.return_reason);
                    setRemarks(result.stockStructure.remarks);
                    setModel(result.stockStructure.model);
                    setUniqueCode(result.stockStructure.unique_code);
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
    setItem(true);
    setBrand(true);
    setColor(true);
    setCapacity(true);
    setHeight(true);
    setPower(true);
    setDescription(true);
    setSeller(true)
    setQuantity(true);
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
    setModel(true);
    setUniqueCode(true);
    setMfgDate(true);
    setExpDate(true);
    setItemBuyPrice(true);
    setItemSellPrice(true);
    setWarranteeGuarente(true);
    setWarranteeGuarenteDuration(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {sl_no, date, time, sub_category, item, brand, color, capacity, height, power, description, seller, quantity, batch_no, batch_buy_price, batch_sell_price, per_peace_buy_price, per_peace_sell_price, batch_mfg_date, batch_exp_date, batch_warrantee_guarantee, batch_warrantee_guarantee_duration, item_status, return_reason, remarks, model, unique_code, mfg_date, exp_date, item_buy_price, item_sell_price, warrantee_guarantee, warrantee_guarantee_duration};
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
        
        toastr.success("'Add Stock' customization saved successfully.");
        // navigate("/home");
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
                <div className="mb-3 form-switch d-flex justify-content-between vrrl  justify-content-between" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Sl No </label>
                    <div title="This can't be changed" >
                        <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="sl_noSwitch" checked={sl_no} onChange={(e) => setSlNo(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="sl_noSwitch">{sl_no ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl  justify-content-between" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Date </label>
                    <div title="This can't be changed">
                        <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="dateSwitch" checked={date} onChange={(e) => setDate(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="dateSwitch">{date ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl  justify-content-between" style={{paddingLeft: "0"}}>
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
        </div>
        <div className="row">
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
                    <label className="form-label mx-2">Brand </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="brandSwitch" checked={brand} onChange={(e) => setBrand(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="brandSwitch">{brand ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Capacity</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="capacitySwitch" checked={capacity} onChange={(e) => setCapacity(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="capacitySwitch">{color ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
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
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Quantity </label>
                    <div title="This can't be changed">
                        <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="quantitySwitch" checked={quantity} onChange={(e) => setQuantity(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="quantitySwitch">{quantity ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
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
                    <label className="form-label mx-2">Seller </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="sellerSwitch" checked={seller} onChange={(e) => setSeller(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="sellerSwitch">{seller ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
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
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Batch Buy Price</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batch_buy_priceSwitch" checked={batch_buy_price} onChange={(e) => setBatchBuyPrice(e.target.checked)}/>
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
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Model</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="modelSwitch" checked={model} onChange={(e) => setModel(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="modelSwitch">{model ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Per Peace Buy Price</label>
                    <div title="This can't be changed">
                        <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="per_peace_buy_priceSwitch" checked={per_peace_buy_price} onChange={(e) => setPerPeaceBuyPrice(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="per_peace_buy_priceSwitch">{per_peace_buy_price ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Per Peace Sell Price</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="per_peace_sell_priceSwitch" checked={per_peace_sell_price} onChange={(e) => setPerPeaceSellPrice(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="per_peace_sell_priceSwitch">{per_peace_sell_price ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
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
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Batch Warrantee/Guarente</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batch_warrantee_guaranteeSwitch" checked={batch_warrantee_guarantee} onChange={(e) => setBatchWarranteeGuarente(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batch_warrantee_guaranteeSwitch">{batch_warrantee_guarantee ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Batch Warrantee/Guarente Duration</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batch_warrantee_guarantee_durationSwitch" checked={batch_warrantee_guarantee_duration} onChange={(e) => setBatchWarranteeGuarenteDuration(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batch_warrantee_guarantee_durationSwitch">{batch_warrantee_guarantee_duration ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Item Status (Received/ Accepted/ Returned)</label>
                    <div title="This can't be changed">
                        <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="itemStatusSwitch" checked={item_status} onChange={(e) => setItemStatus(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="itemStatusSwitch">{item_status ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
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
                    <label className="form-label mx-2">Mfg Date </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="mfgDateSwitch" checked={mfg_date} onChange={(e) => setMfgDate(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="mfgDateSwitch">{mfg_date ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Exp Date</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="expDateSwitch" checked={exp_date} onChange={(e) => setExpDate(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="expDateSwitch">{exp_date ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
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
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl " style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Warrantee/Guarente (Applicable or not) </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="warrantee_guaranteeSwitch" checked={warrantee_guarantee} onChange={(e) => setWarranteeGuarente(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="warrantee_guaranteeSwitch">{warrantee_guarantee ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-2">Warrantee/Guarente Duration</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="warrantee_guarantee_durationSwitch" checked={warrantee_guarantee_duration} onChange={(e) => setWarranteeGuarenteDuration(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="warrantee_guarantee_durationSwitch">{warrantee_guarantee_duration ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-primary ms-4" onClick={handleReset}>Reset</button>
      </form>
    </div>
  );
}
export default CustomizeAddStock;
