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
  const [sub_category, setSubCategory] = useState("")
  const [item, setItem] = useState("");
  const [itemId, setItemId] = useState("");
  const [brand, setBrand] = useState("");
  const [brandId, setBrandId] = useState("");
  const [color, setColor] = useState("");
  const [capacity, setCapacity] = useState("");
  const [height, setHeight] = useState("");
  const [power, setPower] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState("");
  const [seller, setSeller] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [batch_no, setBatchNo] = useState("");
  const [batch_buy_price, setBatchBuyPrice] = useState("");
  const [batch_sell_price, setBatchSellPrice] = useState("");
  const [per_peace_buy_price, setPerPeaceBuyPrice] = useState("");
  const [per_peace_sell_price, setPerPeaceSellPrice] = useState("");
  const [batch_mfg_date, setBatchMfgDate] = useState("");
  const [batch_exp_date, setBatchExpDate] = useState("");
  const [batch_warrantee_guarantee, setBatchWarranteeGuarente] = useState("")
  const [batch_warrantee_guarantee_duration, setBatchWarranteeGuarenteDuration] = useState("")
  const [item_status, setItemStatus] = useState("");
  const [return_reason, setReturnReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [lowerPartEntries, setLowerPartEntries] = useState([
    {
      unique_code: "",
      mfg_date: "",
      exp_date: "",
      item_buy_price: "",
      item_sell_price: "",
      warrantee_guarantee: "",
      warrantee_guarantee_duration: ""
    }
  ]);

  const [company_details, setCompanyDetails] = useState({})
  const [isStockStructure, setIsStockStructure] = useState(true)
  const [stockStructure, setStockStructure] = useState({})
  const [sub_categories, setSubCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sellers, setSellers] = useState([]);

  const addLowerPartEntry = () => {
    setLowerPartEntries([
      ...lowerPartEntries,
      {
        unique_code: "",
        mfg_date: "",
        exp_date: "",
        item_buy_price: "",
        item_sell_price: "",
        warrantee_guarantee: "",
        warrantee_guarantee_duration: ""
      }
    ]);
  };

    // Function to handle changes in lower part fields
  const handleLowerPartChange = (index, field, value) => {
    const updatedEntries = [...lowerPartEntries];
    updatedEntries[index][field] = value;
    setLowerPartEntries(updatedEntries);
  };

    // Function to remove a lower part entry
    const removeLowerPartEntry = (index) => {
      if (lowerPartEntries.length > 1) {
        setLowerPartEntries(lowerPartEntries.filter((_, i) => i !== index));
      }
    };

  const fetchCompanyDetails = async (value) => {
    try {
        const response = await fetch(`${HOST}:${PORT}/server/get-company-details`, {
            method: "GET",
            headers: { 'authorization': `Bearer ${token}` },
          });
          if (response) {
            const result = await response.json();
            if (response.ok) {
                setCompanyDetails(result.doc)
                fetchStructureDetails(result.doc._id);
                if(result.company_subtype != ""){
                  setSubCategory(result.company_subtype)
                }
            } else {
              toastr.error(result.msg);
            }
          } else {
            toastr.error("We are unable to process now. Please try again later.");
          }
    } catch (err) {
      toastr.error("Failed to load details. Please try again later.");
    }
  };
  const fetchStructureDetails = async (companyId) => {
    try {
        const response = await fetch(`${HOST}:${PORT}/server/customize-add-stock-details`, {
            method: "PATCH",
            body: JSON.stringify({companyId: companyId}),
            headers: {  "Content-Type": "application/json", 'authorization': `Bearer ${token}`}
          });
          if (response) {
            const result = await response.json();
            if (response.ok) {
                if(result.stockStructure == null){
                  setIsStockStructure(false)
                } else{
                  setIsStockStructure(true)
                  setStockStructure(result.stockStructure)
                }
            } else {
              toastr.error(result.msg);
            }
          } else {
            toastr.error("We are unable to process now. Please try again later.");
          }
    } catch (err) {
      toastr.error("Failed to load details. Please try again later.");
    }
  };
  const fetchSubCategories = async (value) => {
    if (value && (company_details.company_subtypes.length>0)) {
      const regex = new RegExp(value, "i");
      const matchList = (company_details.company_subtypes).filter(item => regex.test(item));
      setSubCategories(matchList);
    }
  };
  const fetchSellers = async (value) => {
    try {
        const response = await fetch(`${HOST}:${PORT}/server/seller-list`, {
            method: "GET",
            headers: { 'authorization': `Bearer ${token}`, 'value': value, 'active': true },
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
  const fetchItems = async (value) => {
    try {
        const response = await fetch(`${HOST}:${PORT}/server/item-list`, {
            method: "GET",
            headers: { 'authorization': `Bearer ${token}`, 'value': value, 'active': true },
          });
          if (response) {
            const result = await response.json();
            if (response.ok) {
                if(result.docs != null){
                    setItems(result.docs)
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
  const fetchBrands = async (value) => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/brand-list`, {
            method: "PATCH",
            body: JSON.stringify({value: value, companyId: company_details._id}),
            headers: { 'authorization': `Bearer ${token}`},
          });
          if (response) {
            const result = await response.json();
            if (response.ok) {
                if(result.docs != null){
                    setBrands(result.docs)
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
    fetchCompanyDetails();
  }, []);

  const handleDropValueChange = (value, type) => {
    if (type == "SUBCATEGORY"){
      setSubCategory(value);
      setSubCategories([])
      if(value != ""){fetchSubCategories(value)}
    } else if(type == "SELLER"){
      setSeller(value);
      setSellers([])
      if(value != ""){fetchSellers(value)}
    } else if(type == "ITEM"){
      setItem(value);
      setItems([])
      if(value != ""){fetchItems(value)};
    } else if(type == "BRAND"){
      setBrand(value);
      setBrands([])
      if(value != ""){fetchBrands(value)};
    }
  };
  const handleSelect = (name, type, id) => {
    if(type =="SUBCATEGORY"){
      setSubCategory(name);
      setSubCategories([]);
    } else if(type == "SELLER"){
      setSeller(name);
      setSellerId(id);
      setSellers([]);
    } else if(type == "ITEM"){
      setItem(name);
      setItemId(id);
      setItems([]);
    } else if(type == "BRAND"){
      setBrand(name);
      setBrandId(id);
      setBrands([]);
    }
  };
  const handleBuyPrice = (value, type) =>{
    let temp
    if(type == "QUANTITY"){
      setQuantity(value)
      if(batch_buy_price && value != "" && value != 0){
        temp = batch_buy_price/value
        setPerPeaceBuyPrice(temp);
      } else if(per_peace_buy_price && value != "" && value != 0){
        temp = per_peace_buy_price*value
        setBatchBuyPrice(temp);
      }
    } else if(type == "BATCHBUYPRICE"){
      setBatchBuyPrice(value)
      if(quantity && value != "" && value != 0){
        temp = value/quantity
        setPerPeaceBuyPrice(temp);
      } else if(per_peace_buy_price && value != "" && value != 0){
        temp = value/per_peace_buy_price
        setQuantity(temp);
      }
    } else if(type == "PERPEACEBUYPRICE"){
      setPerPeaceBuyPrice(value)
      if(quantity && value != "" && value != 0){
        temp = value*quantity
        setBatchBuyPrice(temp);
      } else if(batch_buy_price && value != "" && value != 0){
        temp = batch_buy_price/value
        setQuantity(temp);
      }
    }
  };
  const handleReset = () => {
    setSlNo("");
    setDate(new Date());
    setTime(new Date());
    setSubCategory("")
    setItem("")
    setBrand("")
    setColor("")
    setCapacity("")
    setHeight("")
    setPower("")
    setDescription("")
    setModel("")
    setSeller("")
    setQuantity("")
    setBatchNo("")
    setBatchBuyPrice("")
    setBatchSellPrice("")
    setPerPeaceBuyPrice("")
    setPerPeaceSellPrice("")
    setBatchMfgDate("")
    setBatchExpDate("")
    setBatchWarranteeGuarente("")
    setBatchWarranteeGuarenteDuration("")
    setItemStatus("")
    setReturnReason("")
    setRemarks("")
    setLowerPartEntries([
      {
        unique_code: "",
        mfg_date: "",
        exp_date: "",
        item_buy_price: "",
        item_sell_price: "",
        warrantee_guarantee: "",
        warrantee_guarantee_duration: ""
      }
    ])
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {sl_no, date, time, sub_category, item, itemId, brand, brandId, color, capacity, height, power, description, model, seller, sellerId, quantity, batch_no, item_status, return_reason, remarks, stock_details: lowerPartEntries};
    const additionalData = {batch_buy_price, batch_sell_price, per_peace_buy_price, per_peace_sell_price, batch_mfg_date, batch_exp_date, batch_warrantee_guarantee, batch_warrantee_guarantee_duration}
    if(!data.date || !data.item || !data.quantity || !additionalData.per_peace_buy_price || !data.item_status){
      toastr.error("Please enter all required field.");
      return;
    }
    const finalData = {data: data, additionalData: additionalData, company: company_details};
    const response = await fetch(`${HOST}:${PORT}/server/save-stock-details`, {
      method: "POST",
      body: JSON.stringify(finalData),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
    });
    if (response) {
      const result = await response.json();
      if (response.ok) {
        
        toastr.success(result.msg);
        handleReset()
      } else {
        toastr.error(result.msg);
      }
    } else {
      toastr.error("We are unable to process now. Please try again later.");
    }
  };

  return (
    <div className="container my-2">
      {isStockStructure && <form onSubmit={handleSubmit}>
        <div className="row">
            {stockStructure.date && <div className="col mb-3 d-flex flex-column">
                <label className="form-label mx-3">Received Date <span className="ei-col-red">*</span></label>
                <DatePicker required name="date" selected={date} className="form-control" aria-describedby="emailHelp" value={date} onChange={(date) => setDate(date)}/>
            </div>}
            {stockStructure.time && <div className="col mb-3 d-flex flex-column">
                <label className="form-label mx-3">Time </label>
                <DatePicker name="time" selected={time} className="form-control" aria-describedby="emailHelp" value={time} onChange={(time) => setTime(time)} showTimeSelect showTimeSelectOnly timeCaption="Select Time" timeIntervals={10} dateFormat="HH:mm aa"/>
            </div>}
            {stockStructure.sub_category && <div className="col mb-3">
                <label className="form-label mx-3">Sub Category </label>
                <input placeholder="Enter sub category (optional)" name="sub_category" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={sub_category} onChange={(e) => handleDropValueChange(e.target.value, "SUBCATEGORY")}/>
                {sub_categories.length > 0 && (
                  <ul style={{ border: "1px solid #ccc", padding: "5px", marginTop: "2px", listStyleType: "none", maxHeight: "150px", overflowY: "auto", position: "absolute", background: "white", width: "25%" }}>
                  {sub_categories.map((item, index) => (
                    <li key={index} onClick={() => handleSelect(item, "SUBCATEGORY")} style={{ padding: "5px", cursor: "pointer", borderBottom: "1px solid #eee",}}>{item}</li>
                  ))}
                </ul>)}
            </div>}
            {stockStructure.sl_no && <div className="col mb-3">
                <label className="form-label mx-3">Sl No</label>
                <input placeholder="Enter Sl no" name="sl_no" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={sl_no} onChange={(e) => setSlNo(e.target.value)}/>
            </div>}
        </div>
        <div className="row">
          {stockStructure.item && <div className="col mb-3">
              <label className="form-label mx-3">Item Name <span className="ei-col-red">*</span></label>
              <input required placeholder="Enter item name" autoComplete="off" name="item" type="text" maxLength={244} className="form-control" aria-describedby="emailHelp" value={item} onChange={(e) => {handleDropValueChange(e.target.value, "ITEM")}} />
              <input hidden name="itemId" type="text" maxLength={244} className="form-control" aria-describedby="emailHelp" value={itemId} />
              {items.length > 0 && (
                <ul style={{ border: "1px solid #ccc", padding: "5px", marginTop: "2px", listStyleType: "none", maxHeight: "150px", overflowY: "auto", position: "absolute", background: "white", width: "25%" }}>
                {items.map((item, index) => (
                  <li key={index} onClick={() => handleSelect(item.name, "ITEM", item._id)} style={{ padding: "5px", cursor: "pointer", borderBottom: "1px solid #eee",}}>{item.name}</li>
                ))}
              </ul>)}
            </div>}
          {stockStructure.brand && <div className="col mb-3">
              <label className="form-label mx-3">Brand</label>
              <input placeholder="Enter brand name" autoComplete="off" name="brand" type="text" maxLength={244} className="form-control" aria-describedby="emailHelp" value={brand} onChange={(e) => {handleDropValueChange(e.target.value, "BRAND")}} />
              <input hidden name="brandId" type="text" maxLength={244} className="form-control" aria-describedby="emailHelp" value={brandId} />
              {brands.length > 0 && (
                <ul style={{ border: "1px solid #ccc", padding: "5px", marginTop: "2px", listStyleType: "none", maxHeight: "150px", overflowY: "auto", position: "absolute", background: "white", width: "25%" }}>
                {brands.map((item, index) => (
                  <li key={index} onClick={() => handleSelect(item.name, "BRAND", item._id)} style={{ padding: "5px", cursor: "pointer", borderBottom: "1px solid #eee",}}>{item.name}</li>
                ))}
              </ul>)}
            </div>}
        </div>
        <div className="row">  
            {stockStructure.color && <div className="col mb-3">
                <label className="form-label mx-3">Color </label>
                <input placeholder="Enter color (if required)" name="color" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={color} onChange={(e) => setColor(e.target.value)}/>
            </div>}
            {stockStructure.capacity && <div className="col mb-3">
                <label className="form-label mx-3">Capacity</label>
                <input placeholder="Enter capacity (if required)" name="capacity" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={capacity} onChange={(e) => setCapacity(e.target.value)}/>
            </div>}
            {stockStructure.height && <div className="col mb-3">
                <label className="form-label mx-3">Height/Width</label>
                <input placeholder="Enter height/width (if required)" name="height" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={height} onChange={(e) => setHeight(e.target.value)}/>
            </div>}
            {stockStructure.power && <div className="col mb-3">
                <label className="form-label mx-3">Power/Watt</label>
                <input placeholder="Enter power/watt (if required)" name="power" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={power} onChange={(e) => setPower(e.target.value)}/>
            </div>}
        </div>
        <div className="row">
            {stockStructure.model && <div className="col mb-3">
                <label className="form-label mx-3">Model</label>
                <input placeholder="Enter model number (if available)"  name="model" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={model} onChange={(e) => setModel(e.target.value)}/>
            </div>}
            {stockStructure.description && <div className="col mb-3">
                <label className="form-label mx-3">Description</label>
                <input placeholder="Enter description (it will help to find the item)"name="description" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={description} onChange={(e) => setDescription(e.target.value)}/>
            </div>}
            {stockStructure.seller && <div className="col mb-3">
                <label className="form-label mx-3">Seller</label>
                <input placeholder="Enter seller name (optional)" autoComplete="off" name="seller" type="text" maxLength={244} className="form-control" aria-describedby="emailHelp" value={seller} onChange={(e) => {handleDropValueChange(e.target.value, "SELLER")}} />
                <input hidden name="sellerId" type="text" maxLength={244} className="form-control" aria-describedby="emailHelp" value={sellerId} />
                {sellers.length > 0 && (
                  <ul style={{ border: "1px solid #ccc", padding: "5px", marginTop: "2px", listStyleType: "none", maxHeight: "150px", overflowY: "auto", position: "absolute", background: "white", width: "25%" }}>
                  {sellers.map((item, index) => (
                    <li key={index} onClick={() => handleSelect(item.name, "SELLER",  item._id)} style={{ padding: "5px", cursor: "pointer", borderBottom: "1px solid #eee",}}>{item.name}</li>
                  ))}
                </ul>)}
            </div>}
        </div>
        <div className="row">  
            {stockStructure.quantity && <div className="col mb-3">
                <label className="form-label mx-3">Quantity <span className="ei-col-red">*</span></label>
                <input required placeholder="Enter quantity" name="quantity" type="NUMBER" className="form-control" aria-describedby="emailHelp" value={quantity} onChange={(e) => handleBuyPrice(e.target.value, "QUANTITY")}/>
            </div>}
            {stockStructure.batch_no && <div className="col mb-3">
                <label className="form-label mx-3">Batch No </label>
                <input placeholder="Enter batch number" name="batch_no" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={batch_no} onChange={(e) => setBatchNo(e.target.value)}/>
            </div>}
            {stockStructure.batch_buy_price && <div className="col mb-3">
                <label className="form-label mx-3">Batch Buy Price</label>
                <input placeholder="Enter batch buy price" name="batch_buy_price" type="NUMBER" className="form-control" aria-describedby="emailHelp" value={batch_buy_price} onChange={(e) => handleBuyPrice(e.target.value, "BATCHBUYPRICE")}/>
            </div>}
            {stockStructure.batch_sell_price && <div className="col mb-3">
                <label className="form-label mx-3">Batch Sell Price</label>
                <input placeholder="Enter batch sell price (Optional)"  name="batch_sell_price" type="NUMBER" className="form-control" aria-describedby="emailHelp" value={batch_sell_price} onChange={(e) => setBatchSellPrice(e.target.value)}/>
            </div>}
        </div>
        <div className="row">  
            {stockStructure.per_peace_buy_price && <div className="col mb-3">
                <label className="form-label mx-3">Per Peace Buy Price <span className="ei-col-red">*</span></label>
                <input required placeholder="Enter item buy price"  name="per_peace_buy_price" type="number" className="form-control" aria-describedby="emailHelp" value={per_peace_buy_price} onChange={(e) => handleBuyPrice(e.target.value, "PERPEACEBUYPRICE")}/>
            </div>}
            {stockStructure.per_peace_sell_price && <div className="col mb-3">
                <label className="form-label mx-3">Per Peace Sell Price </label>
                <input placeholder="Enter item sell price"  name="per_peace_sell_price" type="number" className="form-control" aria-describedby="emailHelp" value={per_peace_sell_price} onChange={(e) => setPerPeaceSellPrice(e.target.value)}/>
            </div>}
            {stockStructure.batch_mfg_date && <div className="col mb-3">
                <label className="form-label mx-3">Batch Mfg Date</label>
                <input name="batch_mfg_date" type="date" className="form-control" aria-describedby="emailHelp" value={batch_mfg_date} onChange={(e) => setBatchMfgDate(e.target.value)}/>
            </div>}
            {stockStructure.batch_exp_date && <div className="col mb-3">
                <label className="form-label mx-3">Batch Exp Date</label>
                <input name="batch_exp_date" type="date" className="form-control" aria-describedby="emailHelp" value={batch_exp_date} onChange={(e) => setBatchExpDate(e.target.value)}/>
            </div>}
        </div>
        <div className="row">
            {stockStructure.batch_warrantee_guarantee && <div className="col mb-3">
              <label className="form-label">Batch Warrantee/Guarente</label>
              <select className="form-select" aria-label="Default select example" name="batch_warrantee_guarantee" value={batch_warrantee_guarantee} onChange={(e) => setBatchWarranteeGuarente(e.target.value)}>
                  <option>--Select if applicable--</option>
                  <option value="WARRANTEE">Warrantee Applicable</option>
                  <option value="GUARENTE">Guarente Applicable</option>
                  <option value="NOTHING">Nothing Applicable</option>
              </select>
            </div>}
            {stockStructure.warrantee_guarantee_duration && (batch_warrantee_guarantee == "WARRANTEE" || batch_warrantee_guarantee == "GUARENTE") && <div className="col mb-3">
              <label className="form-label">Batch Warrantee/Guarente Duration</label>
              <select className="form-select" aria-label="Default select example" name="batch_warrantee_guarantee_duration" value={batch_warrantee_guarantee_duration} onChange={(e) => setBatchWarranteeGuarenteDuration(e.target.value)}>
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
            {stockStructure.item_status && <div className="col mb-3">
              <label className="form-label">Item Status <span className="ei-col-red">*</span></label>
              <select required className="form-select" aria-label="Default select example" name="item_status" value={item_status} onChange={(e) => setItemStatus(e.target.value)}>
                  <option>--Select item status--</option>
                  <option value="RECEIVED">Received</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="RETURNED">Returned</option>
              </select>
            </div>}
        </div>
        <div className="row">
            {stockStructure.return_reason && (item_status == "RETURNED") && <div className="col mb-3">
                <label className="form-label mx-3">Return Reason</label>
                <input placeholder="Describe return reason"  name="return_reason" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={return_reason} onChange={(e) => setReturnReason(e.target.value)}/>
            </div>}
        </div>
        <div className="row">
            {stockStructure.remarks && <div className="col mb-3">
                <label className="form-label mx-3">Remarks (If any)</label>
                <input placeholder="Enter remarks if any"  name="remarks" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={remarks} onChange={(e) => setRemarks(e.target.value)}/>
            </div>}
        </div>
        {(stockStructure.unique_code || stockStructure.mfg_date || stockStructure.exp_date || stockStructure.item_buy_price || stockStructure.item_sell_price || stockStructure.warrantee_guarantee || stockStructure.warrantee_guarantee_duration) && <div>
          <hr />
          <h6>Fill the below form if any specific item has any specific properties. You can specify multiple item with "+Add More" button</h6>
          {lowerPartEntries.map((entry, index) => (
            <div key={index} className="border p-3 mb-3">
              <div className="row">
                  
                  {stockStructure.unique_code && <div className="col mb-3">
                      <label className="form-label mx-3">Unique Code</label>
                      <input placeholder="Enter unique code (if available)" name="unique_code" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={entry.unique_code} onChange={(e) => handleLowerPartChange(index, "unique_code", e.target.value)}/>
                  </div>}
                  {stockStructure.mfg_date && <div className="col mb-3">
                      <label className="form-label mx-3">Item Mfg Date</label>
                      <input name="mfg_date" type="date" maxLength={70} className="form-control" aria-describedby="emailHelp" value={entry.mfg_date} onChange={(e) => handleLowerPartChange(index, "mfg_date", e.target.value)}/>
                  </div>}
                  {stockStructure.exp_date && <div className="col mb-3">
                      <label className="form-label mx-3">Item Exp Date</label>
                      <input name="exp_date" type="date" maxLength={70} className="form-control" aria-describedby="emailHelp" value={entry.exp_date} onChange={(e) => handleLowerPartChange(index, "exp_date", e.target.value)}/>
                  </div>}
              </div>
              <div className="row">
                  {stockStructure.item_buy_price && <div className="col mb-3">
                      <label className="form-label mx-3">Item Buy Price</label>
                      <input placeholder="Enter item buy price (if required)" name="item_buy_price" type="number" maxLength={70} className="form-control" aria-describedby="emailHelp" value={entry.item_buy_price} onChange={(e) => handleLowerPartChange(index, "item_buy_price", e.target.value)}/>
                  </div>}
                  {stockStructure.item_sell_price && <div className="col mb-3">
                      <label className="form-label mx-3">Item Sell Price</label>
                      <input placeholder="Enter item buy price (optional)" name="item_sell_price" type="number" maxLength={70} className="form-control" aria-describedby="emailHelp" value={entry.item_sell_price} onChange={(e) => handleLowerPartChange(index, "item_sell_price", e.target.value)}/>
                  </div>}
                  {stockStructure.warrantee_guarantee && <div className="col mb-3">
                    <label className="form-label">Warrantee/Guarente <span className="ei-col-red">*</span></label>
                    <select className="form-select" aria-label="Default select example" name="warrantee_guarantee" value={entry.warrantee_guarantee} onChange={(e) => handleLowerPartChange(index, "warrantee_guarantee", e.target.value)}>
                        <option>--Select if applicable--</option>
                        <option value="WARRANTEE">Warrantee Applicable</option>
                        <option value="GUARENTE">Guarente Applicable</option>
                        <option value="NOTHING">Nothing Applicable</option>
                    </select>
                  </div>}
                  {stockStructure.warrantee_guarantee_duration && (entry.warrantee_guarantee == "WARRANTEE" || entry.warrantee_guarantee ==  "GUARENTE") && <div className="col mb-3">
                    <label className="form-label">Warrantee/Guarente Duration</label>
                    <select className="form-select" aria-label="Default select example" name="warrantee_guarantee_duration" value={entry.warrantee_guarantee_duration} onChange={(e) => handleLowerPartChange(index, "warrantee_guarantee_duration", e.target.value)}>
                        <option>--Select duration--</option>
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
              {(stockStructure.model || stockStructure.unique_code || stockStructure.mfg_date || stockStructure.exp_date || stockStructure.item_buy_price || stockStructure.item_sell_price || stockStructure.warrantee_guarantee || stockStructure.warrantee_guarantee_duration) && <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-danger mx-2" onClick={() => removeLowerPartEntry(index)}>Remove</button>
                <button type="button" className="btn btn-primary mx-2" onClick={addLowerPartEntry}>+ Add More</button>
              </div>}
            </div>))}
        </div>}
        <button type="submit" className="btn btn-primary">Save</button>
        <button type="button" className="btn btn-primary ms-4" onClick={handleReset}>Reset</button>
        
      </form>}
      {!isStockStructure && <div>
        <h3>No form configuration found !!</h3>  <br />
        <h3>Contact with company director and ask him/her to configure 'add stock form'.</h3> <br /> <br />
        <h5>Follow the below steps to configure 'add stock form'.</h5> <br /> 
        <h5>Company Login {"->"} Customize Add Stock {"->"} Change the necessary {"->"} Update</h5>  
      </div>}
    </div>
  );
}
export default AddStock;
