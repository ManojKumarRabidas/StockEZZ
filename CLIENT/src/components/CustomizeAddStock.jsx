import "../App.css";
import React, { useState, useEffect } from "react";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
import toastr from "toastr";
const token = sessionStorage.getItem("token");
function TeacherFeedback() {
  const [sl_no, setSlNo] = useState(true);
  const [date, setDate] = useState(true);
  const [time, setTime] = useState(false);
  const [companyCode, setCompanyCode] = useState(true);
  const [seller, setSeller] = useState(false);
  const [category, setCategory] = useState(false);
  const [sub_category, setSubCategory] = useState(false)
  const [itemName, setItemName] = useState(true);
  const [batchNo, setBatchNo] = useState(false);
  const [quantity, setQuantity] = useState(false);
  const [batchPrice, setBatchPrice] = useState(false);
  const [itemStatus, setItemStatus] = useState(false);
  const [returnReason, setReturnReason] = useState(false);
  const [remarks, setRemarks] = useState(false);
  const [model, setModel] = useState(false);
  const [uniqueCode, setUniqueCode] = useState(false);
  const [mfgDate, setMfgDate] = useState(false);
  const [expDate, setExpDate] = useState(false)
  const [item_buy_price, setItemBuyPrice] = useState(false)
  const [item_sell_price, setItemSellPrice] = useState(false);
  const [sold_date, setSoldDate] = useState(false)
  const [sold_to, setSoldTo] = useState(false)
  const [warrantee_guarente, setWarranteeGuarente] = useState(false)
  const [warrantee_guarente_duration, setWarranteeGuarenteDuration] = useState(false)

  const fetchDetails = async () => {
    try {
        const response = await fetch(`${HOST}:${PORT}/server/customize-add-stock-details`, {
            method: "GET",
            headers: { 'authorization': `Bearer ${token}` },
          });
          if (response) {
            const result = await response.json();
            if (response.ok) {
                if(result.stockStructure != null){
                    setSlNo(result.stockStructure.sl_no);
                    setDate(result.stockStructure.date);
                    setTime(result.stockStructure.time);
                    setCompanyCode(result.stockStructure.companyCode);
                    setSeller(result.stockStructure.seller);
                    setCategory(result.stockStructure.category);
                    setSubCategory(result.stockStructure.sub_category);
                    setItemName(result.stockStructure.itemName);
                    setBatchNo(result.stockStructure.batchNo);
                    setQuantity(result.stockStructure.quantity);
                    setBatchPrice(result.stockStructure.batchPrice);
                    setItemStatus(result.stockStructure.itemStatus);
                    setReturnReason(result.stockStructure.returnReason);
                    setRemarks(result.stockStructure.remarks);
                    setModel(result.stockStructure.model);
                    setUniqueCode(result.stockStructure.uniqueCode);
                    setMfgDate(result.stockStructure.mfgDate);
                    setExpDate(result.stockStructure.expDate);
                    setItemBuyPrice(result.stockStructure.item_buy_price);
                    setItemSellPrice(result.stockStructure.item_sell_price);
                    setSoldDate(result.stockStructure.sold_date);
                    setSoldTo(result.stockStructure.sold_to);
                    setWarranteeGuarente(result.stockStructure.warrantee_guarente);
                    setWarranteeGuarenteDuration(result.stockStructure.warrantee_guarente_duration);
                }
            } else {
              toastr.error(result.msg);
            }
          } else {
            toastr.error("We are unable to process now. Please try again later.");
          }
    } catch (err) {
        console.log("err", err)
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
    setCompanyCode(true)
    setSeller(true)
    setCategory(true);
    setSubCategory(true);
    setItemName(true);
    setBatchNo(true);
    setQuantity(true);
    setBatchPrice(true);
    setItemStatus(true);
    setReturnReason(true);
    setRemarks(true);
    setModel(true);
    setUniqueCode(true);
    setMfgDate(true);
    setExpDate(true);
    setItemBuyPrice(true);
    setItemSellPrice(true);
    setSoldDate(true);
    setSoldTo(true);
    setWarranteeGuarente(true);
    setWarranteeGuarenteDuration(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {time, seller, category, sub_category, batchNo, quantity, batchPrice, itemStatus, remarks, model, uniqueCode, mfgDate, expDate, item_buy_price, item_sell_price, sold_date, sold_to, warrantee_guarente, warrantee_guarente_duration};
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
        <h6>Fields for a batch : </h6>
        <hr />
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrl justify-content-between" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Sl No </label>
                    <div title="This can't be changed" >
                        <input disabled className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="sl_noSwitch" checked={sl_no} onChange={(e) => setSlNo(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="sl_noSwitch">{sl_no ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrl justify-content-between" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Date </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="dateSwitch" checked={date} onChange={(e) => setDate(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="dateSwitch">{date ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between justify-content-between" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Time</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="timeSwitch" checked={time} onChange={(e) => setTime(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="timeSwitch">{time ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Company Code </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="companyCodeSwitch" checked={companyCode} onChange={(e) => setCompanyCode(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="companyCodeSwitch">{companyCode ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Seller </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="sellerSwitch" checked={seller} onChange={(e) => setSeller(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="sellerSwitch">{seller ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Category</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="categorySwitch" checked={category} onChange={(e) => setCategory(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="categorySwitch">{category ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Sub Category </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="sub_categorySwitch" checked={sub_category} onChange={(e) => setSubCategory(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="sub_categorySwitch">{sub_category ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Item Name </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="itemNameSwitch" checked={itemName} onChange={(e) => setItemName(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="itemNameSwitch">{itemName ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Batch No</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchNoSwitch" checked={batchNo} onChange={(e) => setBatchNo(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batchNoSwitch">{batchNo ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Quantity </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="quantitySwitch" checked={quantity} onChange={(e) => setQuantity(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="quantitySwitch">{quantity ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Batch Price </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="batchPriceSwitch" checked={batchPrice} onChange={(e) => setBatchPrice(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="batchPriceSwitch">{batchPrice ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Remarks </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="remarksSwitch" checked={remarks} onChange={(e) => setRemarks(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="remarksSwitch">{remarks ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Item Status (Received/ Accepted/ Returned)</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="itemStatusSwitch" checked={itemStatus} onChange={(e) => setItemStatus(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="itemStatusSwitch">{itemStatus ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Return Reason(If Returned) </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="returnReasonSwitch" checked={returnReason} onChange={(e) => setReturnReason(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="returnReasonSwitch">{returnReason ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <hr />
        <h6>Multiple Item fields in a batch : </h6>
        <hr />
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Model</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="modelSwitch" checked={model} onChange={(e) => setModel(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="modelSwitch">{model ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Unique Code </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="uniqueCodeSwitch" checked={uniqueCode} onChange={(e) => setUniqueCode(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="uniqueCodeSwitch">{uniqueCode ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Mfg Date </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="mfgDateSwitch" checked={mfgDate} onChange={(e) => setMfgDate(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="mfgDateSwitch">{mfgDate ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Exp Date</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="expDateSwitch" checked={expDate} onChange={(e) => setExpDate(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="expDateSwitch">{expDate ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Item Buy Price </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="item_buy_priceSwitch" checked={item_buy_price} onChange={(e) => setItemBuyPrice(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="item_buy_priceSwitch">{item_buy_price ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Item Sell Price </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="item_sell_priceSwitch" checked={item_sell_price} onChange={(e) => setItemSellPrice(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="item_sell_priceSwitch">{item_sell_price ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Sold Date</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="sold_dateSwitch" checked={sold_date} onChange={(e) => setSoldDate(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="sold_dateSwitch">{sold_date ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Sold To </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="sold_toSwitch" checked={sold_to} onChange={(e) => setSoldTo(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="sold_toSwitch">{sold_to ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between vrl" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Warrantee/Guarente (Applicable or not) </label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="warrantee_guarenteSwitch" checked={warrantee_guarente} onChange={(e) => setWarranteeGuarente(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="warrantee_guarenteSwitch">{warrantee_guarente ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
                    </div>
                </div>
            </div>
            <div className="col mb-3">
                <div className="mb-3 form-switch d-flex justify-content-between" style={{paddingLeft: "0"}}>
                    <label className="form-label mx-3">Warrantee/Guarente Duration (In months)</label>
                    <div>
                        <input className="form-check-input cursor-pointer" style={{ marginLeft: "0" }} type="checkbox" role="switch" id="warrantee_guarente_durationSwitch" checked={warrantee_guarente_duration} onChange={(e) => setWarranteeGuarenteDuration(e.target.checked)}/>
                        <label className="form-check-label mx-3" htmlFor="warrantee_guarente_durationSwitch">{warrantee_guarente_duration ? <span style={{color: "green"}}>Enabled</span> : <span style={{color: "red"}}>Disabled</span>}</label>
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
export default TeacherFeedback;
