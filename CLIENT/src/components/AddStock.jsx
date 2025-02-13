import "../App.css";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;
import toastr from "toastr";
const token = sessionStorage.getItem("token");
function AddStock() {
  const [sl_no, setSlNo] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [company_code, setCompanyCode] = useState("");
  const [seller, setSeller] = useState("");
  const [category, setCategory] = useState("");
  const [sub_category, setSubCategory] = useState("")
  const [item_name, setItemName] = useState("");
  const [batch_no, setBatchNo] = useState("");
  const [quantity, setQuantity] = useState("");
  const [batch_price, setBatchPrice] = useState("");
  const [item_status, setItemStatus] = useState("");
  const [return_reason, setReturnReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [model, setModel] = useState("");
  const [unique_code, setUniqueCode] = useState("");
  const [mfg_date, setMfgDate] = useState("");
  const [exp_date, setExpDate] = useState("")
  const [item_buy_price, setItemBuyPrice] = useState("")
  const [item_sell_price, setItemSellPrice] = useState("");
  const [sold_date, setSoldDate] = useState("")
  const [sold_to, setSoldTo] = useState("")
  const [warrantee_guarente, setWarranteeGuarente] = useState("")
  const [warrantee_guarente_duration, setWarranteeGuarenteDuration] = useState("")

  const [stockStructure, setStockStructure] = useState({})
  const [categories, setCategories] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [buyers, setBuyers] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const fetchStructureDetails = async () => {
    try {
        const response = await fetch(`${HOST}:${PORT}/server/customize-add-stock-details`, {
            method: "GET",
            headers: { 'authorization': `Bearer ${token}` },
          });
          if (response) {
            const result = await response.json();
            if (response.ok) {
                if(result.stockStructure != null){
                    setStockStructure(result.stockStructure)
                    // setSlNo(result.stockStructure.sl_no);
                    // setDate(result.stockStructure.date);
                    // setTime(result.stockStructure.time);
                    // setCompanyCode(result.stockStructure.companyCode);
                    // setSeller(result.stockStructure.seller);
                    // setCategory(result.stockStructure.category);
                    // setSubCategory(result.stockStructure.sub_category);
                    // setItemName(result.stockStructure.itemName);
                    // setBatchNo(result.stockStructure.batchNo);
                    // setQuantity(result.stockStructure.quantity);
                    // setBatchPrice(result.stockStructure.batchPrice);
                    // setItemStatus(result.stockStructure.itemStatus);
                    // setReturnReason(result.stockStructure.returnReason);
                    // setRemarks(result.stockStructure.remarks);
                    // setModel(result.stockStructure.model);
                    // setUniqueCode(result.stockStructure.uniqueCode);
                    // setMfgDate(result.stockStructure.mfgDate);
                    // setExpDate(result.stockStructure.expDate);
                    // setItemBuyPrice(result.stockStructure.item_buy_price);
                    // setItemSellPrice(result.stockStructure.item_sell_price);
                    // setSoldDate(result.stockStructure.sold_date);
                    // setSoldTo(result.stockStructure.sold_to);
                    // setWarranteeGuarente(result.stockStructure.warrantee_guarente);
                    // setWarranteeGuarenteDuration(result.stockStructure.warrantee_guarente_duration);
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

  const fetchCategories = async () => {
    try {
        const response = await fetch(`${HOST}:${PORT}/server/category-list`, {
            method: "GET",
            headers: { 'authorization': `Bearer ${token}` },
          });
          if (response) {
            const result = await response.json();
            if (response.ok) {
                if(result.docs != null){
                    setCategories(result.docs)
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
  const fetchBuyers = async () => {
    try {
        const response = await fetch(`${HOST}:${PORT}/server/buyer-list`, {
            method: "GET",
            headers: { 'authorization': `Bearer ${token}`, 'active': true },
          });
          if (response) {
            const result = await response.json();
            if (response.ok) {
                if(result.docs != null){
                    setBuyers(result.docs)
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
  const fetchSellers = async () => {
    try {
        const response = await fetch(`${HOST}:${PORT}/server/seller-list`, {
            method: "GET",
            headers: { 'authorization': `Bearer ${token}` },
          });
          if (response) {
            const result = await response.json();
            if (response.ok) {
                if(result.docs != null){
                    setSellers(result.docs)
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
    fetchStructureDetails();
    fetchCategories();
    fetchBuyers();
    fetchSellers();
  }, []);

  const handleReset = () => {
    setSlNo("");
    setDate(new Date());
    setTime(new Date());
    setCompanyCode("")
    setSeller("")
    setCategory("");
    setSubCategory("");
    setItemName("");
    setBatchNo("");
    setQuantity("");
    setBatchPrice("");
    setItemStatus("");
    setReturnReason("");
    setRemarks("");
    setModel("");
    setUniqueCode("");
    setMfgDate("");
    setExpDate("");
    setItemBuyPrice("");
    setItemSellPrice("");
    setSoldDate("");
    setSoldTo("");
    setWarranteeGuarente("");
    setWarranteeGuarenteDuration("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = {sl_no, date, time, company_code, seller, category, sub_category, batch_no, quantity, batch_price, remarks, item_status, return_reason, model, unique_code, mfg_date, exp_date, item_buy_price, item_sell_price, sold_date, sold_to, warrantee_guarente, warrantee_guarente_duration};
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
        
        toastr.success("Stock saved successfully.");
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
        <div className="row">
            {stockStructure.sl_no && <div className="col mb-3">
                <label className="form-label mx-3">Sl No <span className="ei-col-red">*</span></label>
                <input name="sl_no" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={sl_no} onChange={(e) => setSlNo(e.target.value)}/>
            </div>}
            {stockStructure.date && <div className="col mb-3 d-flex flex-column">
                <label className="form-label mx-3">Received Date <span className="ei-col-red">*</span></label>
                <DatePicker name="date" selected={date} className="form-control" aria-describedby="emailHelp" value={date} onChange={(date) => setDate(date)}/>
            </div>}
            {stockStructure.time && <div className="col mb-3 d-flex flex-column">
                <label className="form-label mx-3">Time </label>
                <DatePicker name="time" selected={time} className="form-control" aria-describedby="emailHelp" value={time} onChange={(time) => setTime(time)} showTimeSelect showTimeSelectOnly timeCaption="Select Time" timeIntervals={10} dateFormat="HH:mm aa"/>
            </div>}
            {stockStructure.category && <div className="col mb-3">
                <label className="form-label mx-3">Category <span className="ei-col-red">*</span></label>
                <input name="category" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={category} onChange={(e) => setCategory(e.target.value)}/>
            </div>}
            {stockStructure.sub_category && <div className="col mb-3">
                <label className="form-label mx-3">Sub Category </label>
                <input name="sub_category" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={sub_category} onChange={(e) => setSubCategory(e.target.value)}/>
            </div>}
        </div>
        <div className="row">
        </div>
        <div className="row">
            {stockStructure.seller && <div className="col mb-3">
                <label className="form-label mx-3">Seller </label>
                <input name="seller" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={seller} onChange={(e) => setSeller(e.target.value)}/>
            </div>}
            {stockStructure.item_name && <div className="col mb-3">
                <label className="form-label mx-3">Item Name <span className="ei-col-red">*</span></label>
                <input name="item_name" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={item_name} onChange={(e) => setItemName(e.target.value)}/>
            </div>}
        </div>
        <div className="row">  
            {stockStructure.batch_no && <div className="col mb-3">
                <label className="form-label mx-3">Batch No </label>
                <input name="batch_no" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={batch_no} onChange={(e) => setBatchNo(e.target.value)}/>
            </div>}
            {stockStructure.batch_price && <div className="col mb-3">
                <label className="form-label mx-3">Batch Price</label>
                <input name="batch_price" type="NUMBER" maxLength={70} className="form-control" aria-describedby="emailHelp" value={batch_price} onChange={(e) => setBatchPrice(e.target.value)}/>
            </div>}
            {stockStructure.quantity && <div className="col mb-3">
                <label className="form-label mx-3">Quantity</label>
                <input name="quantity" type="NUMBER" maxLength={70} className="form-control" aria-describedby="emailHelp" value={quantity} onChange={(e) => setQuantity(e.target.value)}/>
            </div>}
        </div>
        <div className="row">
            {stockStructure.item_status && <div className="col-4 mb-3">
              <label className="form-label">Item Status <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="item_status" value={item_status} onChange={(e) => setItemStatus(e.target.value)}>
                  <option>--Select item status--</option>
                  <option value="RECEIVED">Received</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="RETURNED">Returned</option>
              </select>
            </div>}
            {stockStructure.return_reason && <div className="col-8 mb-3">
                <label className="form-label mx-3">Return Reason(If Returned)</label>
                <input name="return_reason" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={return_reason} onChange={(e) => setReturnReason(e.target.value)}/>
            </div>}
        </div>
        <div className="row">
            {stockStructure.remarks && <div className="col mb-3">
                <label className="form-label mx-3">Remarks (If any)</label>
                <input name="remarks" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={remarks} onChange={(e) => setRemarks(e.target.value)}/>
            </div>}
        </div>
        <hr />
        <div className="row">
            {stockStructure.model && <div className="col mb-3">
                <label className="form-label mx-3">Model</label>
                <input name="model" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={model} onChange={(e) => setModel(e.target.value)}/>
            </div>}
        </div>
        <div className="row">
            {stockStructure.unique_code && <div className="col mb-3">
                <label className="form-label mx-3">Unique Code</label>
                <input name="unique_code" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={unique_code} onChange={(e) => setUniqueCode(e.target.value)}/>
            </div>}
            {stockStructure.mfg_date && <div className="col mb-3">
                <label className="form-label mx-3">Mfg Date</label>
                <input name="mfg_date" type="date" maxLength={70} className="form-control" aria-describedby="emailHelp" value={mfg_date} onChange={(e) => setMfgDate(e.target.value)}/>
            </div>}
            {stockStructure.exp_date && <div className="col mb-3">
                <label className="form-label mx-3">Exp Date</label>
                <input name="exp_date" type="date" maxLength={70} className="form-control" aria-describedby="emailHelp" value={exp_date} onChange={(e) => setExpDate(e.target.value)}/>
            </div>}
        </div>
        <div className="row">
            {stockStructure.item_buy_price && <div className="col mb-3">
                <label className="form-label mx-3">Item Buy Price</label>
                <input name="item_buy_price" type="number" maxLength={70} className="form-control" aria-describedby="emailHelp" value={item_buy_price} onChange={(e) => setItemBuyPrice(e.target.value)}/>
            </div>}
            {stockStructure.item_sell_price && <div className="col mb-3">
                <label className="form-label mx-3">Item Sell Price</label>
                <input name="item_sell_price" type="number" maxLength={70} className="form-control" aria-describedby="emailHelp" value={item_sell_price} onChange={(e) => setItemSellPrice(e.target.value)}/>
            </div>}
            {stockStructure.sold_date && <div className="col mb-3">
                <label className="form-label mx-3">Sold Date</label>
                <input name="sold_date" type="date" maxLength={70} className="form-control" aria-describedby="emailHelp" value={sold_date} onChange={(e) => setSoldDate(e.target.value)}/>
            </div>}
        </div>
        <div className="row">
            {stockStructure.sold_to && <div className="col mb-3">
                <label className="form-label mx-3">Sold To</label>
                <input name="sold_to" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={sold_to} onChange={(e) => setSoldTo(e.target.value)}/>
            </div>}
            {stockStructure.warrantee_guarente && <div className="col mb-3">
              <label className="form-label">Warrantee/Guarente (Applicable or not) <span className="ei-col-red">*</span></label>
              <select className="form-select" aria-label="Default select example" name="warrantee_guarente" value={warrantee_guarente} onChange={(e) => setWarranteeGuarente(e.target.value)}>
                  <option>--Select--</option>
                  <option value="WARRANTEE">Warrantee Applicable</option>
                  <option value="GUARENTE">Guarente Applicable</option>
                  <option value="NOTHING">Nothing Applicable</option>
              </select>
            </div>}
            {stockStructure.warrantee_guarente_duration && <div className="col mb-3">
              <label className="form-label">Warrantee/Guarente Duration</label>
              <select className="form-select" aria-label="Default select example" name="warrantee_guarente_duration" value={warrantee_guarente_duration} onChange={(e) => setWarranteeGuarenteDuration(e.target.value)}>
                  <option>--Select duration if applicable--</option>
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">1 Year</option>
                  <option value="24">2 Years</option>
                  <option value="36">3 Years</option>
                  <option value="48">4 Years</option>
                  <option value="60">5 Years</option>
                  <option value="72">6 Years</option>
                  <option value="84">7 Years</option>
                  <option value="96">8 Years</option>
                  <option value="108">9 Years</option>
                  <option value="120">10 Years</option>
                  <option value="180">15 Years</option>
                  <option value="240">20 Years</option>
                  <option value="300">25 Years</option>
              </select>
            </div>}
        </div>
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-primary ms-4" onClick={handleReset}>Reset</button>
      </form>
    </div>
  );
}
export default AddStock;
