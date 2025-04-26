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
  const [challan_no, setChallanNo] = useState("");
  const [item, setItem] = useState("");
  const [item_id, setItemId] = useState("");
  const [batch_brand, setBatchBrand] = useState("");
  const [batch_brand_id, setBatchBrandId] = useState("");
  const [batch_color, setBatchColor] = useState("");
  const [batch_capacity, setBatchCapacity] = useState("");
  const [batch_height, setBatchHeight] = useState("");
  const [batch_power, setBatchPower] = useState("");
  const [batch_description, setBatchDescription] = useState("");
  const [batch_model, setBatchModel] = useState("");
  const [seller, setSeller] = useState("");
  const [seller_id, setSellerId] = useState("");
  const [total_quantity, setTotalQuantity] = useState("");
  const [batch_no, setBatchNo] = useState("");
  const [batch_buy_price, setBatchBuyPrice] = useState("");
  const [batch_sell_price, setBatchSellPrice] = useState("");
  const [per_piece_buy_price, setPerPeaceBuyPrice] = useState("");
  const [per_piece_sell_price, setPerPeaceSellPrice] = useState("");
  const [batch_mfg_date, setBatchMfgDate] = useState("");
  const [batch_exp_date, setBatchExpDate] = useState("");
  const [batch_warrantee_guarantee, setBatchWarranteeGuarente] = useState("")
  const [batch_warrantee_guarantee_duration, setBatchWarranteeGuarenteDuration] = useState("")
  const [item_status, setItemStatus] = useState("RECEIVED");
  const [return_reason, setReturnReason] = useState("");
  const [remarks, setRemarks] = useState("");
  const [lowerPartEntries, setLowerPartEntries] = useState([
    {
      unique_code: "",
      model: "",
      brand: "",
      brand_id: "",
      color: "",
      capacity: "",
      height: "",
      power: "",
      description: "",
      quantity: "",
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
  const [brandIndex, setBrandIndex] = useState(-1);

  const addLowerPartEntry = () => {
    setLowerPartEntries([
      ...lowerPartEntries,
      {
        unique_code: "",
        model: "",
        brand: "",
        brand_id: "",
        color: "",
        capacity: "",
        height: "",
        power: "",
        description: "",
        quantity: "",
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
            headers: {  'Content-Type': 'application/json','authorization': `Bearer ${token}`},
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

  const handleDropValueChange = (value, type, index) => {
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
    } else if(type == "BATCHBRAND"){
      setBrandIndex(-1)
      setBatchBrand(value);
      setBrands([])
      if(value != ""){fetchBrands(value)};
    } else if(type == "brand"){
      handleLowerPartChange(index, type, value)
      setBrandIndex(index)
      setBrands([])
      if(value != ""){fetchBrands(value)};
    }
  };
  const handleSelect = (name, type, id, index) => {
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
    } else if(type == "BATCHBRAND"){
      setBatchBrand(name);
      setBatchBrandId(id);
      setBrands([]);
    } else if(type == "brand"){
      handleLowerPartChange(index, "brand_id", id)
      handleLowerPartChange(index, "brand", name)
      setBrands([]);
    }
  };
  const handleBuyPrice = (value, type) =>{
    let temp
    if(type == "TOTALQUANTITY"){
      setTotalQuantity(value)
      if(batch_buy_price && value != "" && value != 0){
        temp = batch_buy_price/value
        setPerPeaceBuyPrice(temp);
      } else if(per_piece_buy_price && value != "" && value != 0){
        temp = per_piece_buy_price*value
        setBatchBuyPrice(temp);
      }
    } else if(type == "BATCHBUYPRICE"){
      setBatchBuyPrice(value)
      if(total_quantity && value != "" && value != 0){
        temp = value/total_quantity
        setPerPeaceBuyPrice(temp);
      } else if(per_piece_buy_price && value != "" && value != 0){
        temp = value/per_piece_buy_price
        setTotalQuantity(temp);
      }
    } else if(type == "PERPEACEBUYPRICE"){
      setPerPeaceBuyPrice(value)
      if(total_quantity && value != "" && value != 0){
        temp = value*total_quantity
        setBatchBuyPrice(temp);
      } else if(batch_buy_price && value != "" && value != 0){
        temp = batch_buy_price/value
        setTotalQuantity(temp);
      }
    }
  };
  const handleReset = () => {
    setSlNo("");
    setDate(new Date());
    setTime(new Date());
    setSubCategory("")
    setChallanNo("")
    setItem("")
    setItemId("")
    setBatchBrand("")
    setBatchBrandId("")
    setBatchColor("")
    setBatchCapacity("")
    setBatchHeight("")
    setBatchPower("")
    setBatchDescription("")
    setBatchModel("")
    setSeller("")
    setSellerId("")
    setTotalQuantity("")
    setBatchNo("")
    setBatchBuyPrice("")
    setBatchSellPrice("")
    setPerPeaceBuyPrice("")
    setPerPeaceSellPrice("")
    setBatchMfgDate("")
    setBatchExpDate("")
    setBatchWarranteeGuarente("")
    setBatchWarranteeGuarenteDuration("")
    setItemStatus("RECEIVED")
    setReturnReason("")
    setRemarks("")
    setLowerPartEntries([
      {
        unique_code: "",
        model: "",
        brand: "",
        brand_id: "",
        color: "",
        capacity: "",
        height: "",
        power: "",
        description: "",
        quantity: "",
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
    const data = {sl_no, date, time, sub_category, challan_no, item, item_id, seller, seller_id, total_quantity, batch_no, item_status, return_reason, remarks, stock_details: lowerPartEntries};
    const additionalData = {batch_brand, batch_brand_id, batch_color, batch_capacity, batch_height, batch_power, batch_description, batch_model, batch_buy_price, batch_sell_price, per_piece_buy_price, per_piece_sell_price, batch_mfg_date, batch_exp_date, batch_warrantee_guarantee, batch_warrantee_guarantee_duration}
    if(!data.date || !data.item || !data.total_quantity || !additionalData.batch_buy_price || !data.item_status){
      toastr.error("Please enter all required field.");
      return;
    }
    const confirmed = window.confirm("Are you sure you want to submit?");
    if (!confirmed) return;
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

  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  const getUpperPartVisibleFields = () => {
    const fields = [];

    if (stockStructure.date) {
      fields.push(
        <div className="col mb-3 d-flex flex-column" key="date">
          <label className="form-label mx-3">Received Date <span className="ei-col-red">*</span></label>
          <DatePicker
            required
            name="date"
            selected={date}
            className="form-control"
            aria-describedby="emailHelp"
            value={date}
            onChange={(date) => setDate(date)}
          />
        </div>
      );
    }

    if (stockStructure.time) {
      fields.push(
        <div className="col mb-3 d-flex flex-column" key="time">
          <label className="form-label mx-3">Time </label>
          <DatePicker
            name="time"
            selected={time}
            className="form-control"
            aria-describedby="emailHelp"
            value={time}
            onChange={(time) => setTime(time)}
            showTimeSelect
            showTimeSelectOnly
            timeCaption="Select Time"
            timeIntervals={10}
            dateFormat="HH:mm aa"
          />
        </div>
      );
    }

    if (stockStructure.sub_category) {
      fields.push(
        <div className="col mb-3" key="sub_category">
          <label className="form-label mx-3">Sub Category </label>
          <input
            autoComplete="off"
            placeholder="Enter sub category (optional)"
            name="sub_category"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={sub_category}
            onChange={(e) => handleDropValueChange(e.target.value, "SUBCATEGORY")}
            onBlur={() => setTimeout(() => setSubCategories([]), 100)}
          />
          {sub_categories.length > 0 && (
            <ul style={{ border: "1px solid #ccc", padding: "5px", marginTop: "2px", listStyleType: "none", maxHeight: "150px", overflowY: "auto", position: "absolute", background: "white", width: "25%" }}>
              {sub_categories.map((item, index) => (
                <li key={index} onClick={() => handleSelect(item, "SUBCATEGORY")} style={{ padding: "5px", cursor: "pointer", borderBottom: "1px solid #eee" }}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    if (stockStructure.sl_no) {
      fields.push(
        <div className="col mb-3" key="sl_no">
          <label className="form-label mx-3">Sl No</label>
          <input
            placeholder="Enter sl number"
            name="sl_no"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={sl_no}
            onChange={(e) => setSlNo(e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.challan_no) {
      fields.push(
        <div className="col mb-3" key="challan_no">
          <label className="form-label mx-3">Challan No</label>
          <input
            placeholder="Enter challan number"
            name="challan_no"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={challan_no}
            onChange={(e) => setChallanNo(e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.item) {
      fields.push(
        <div className="col mb-3" key="item">
          <label className="form-label mx-3">Item Name <span className="ei-col-red">*</span></label>
          <input
            required
            placeholder="Enter item name"
            autoComplete="off"
            name="item"
            type="text"
            maxLength={244}
            className="form-control"
            aria-describedby="emailHelp"
            value={item}
            onChange={(e) => handleDropValueChange(e.target.value, "ITEM")}
            onBlur={() => setTimeout(() => setItems([]), 100)}
          />
          <input hidden name="item_id" type="text" maxLength={244} className="form-control" aria-describedby="emailHelp" value={item_id} />
          {items.length > 0 && (
            <ul style={{ border: "1px solid #ccc", padding: "5px", marginTop: "2px", listStyleType: "none", maxHeight: "150px", overflowY: "auto", position: "absolute", background: "white", width: "25%" }}>
              {items.map((item, index) => (
                <li key={index} onClick={() => handleSelect(item.name, "ITEM", item._id)} style={{ padding: "5px", cursor: "pointer", borderBottom: "1px solid #eee" }}>
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    if (stockStructure.batch_brand) {
      fields.push(
        <div className="col mb-3" key="batch_brand">
          <label className="form-label mx-3">Brand</label>
          <input
            placeholder="Enter brand name"
            autoComplete="off"
            name="batch_brand"
            type="text"
            maxLength={244}
            className="form-control"
            aria-describedby="emailHelp"
            value={batch_brand}
            onChange={(e) => handleDropValueChange(e.target.value, "BATCHBRAND")}
            onBlur={() => setTimeout(() => setBrands([]), 100)}
          />
          <input hidden name="batch_brand_id" type="text" maxLength={244} className="form-control" aria-describedby="emailHelp" value={batch_brand_id} />
          {brandIndex === -1 && brands.length > 0 && (
            <ul style={{ border: "1px solid #ccc", padding: "5px", marginTop: "2px", listStyleType: "none", maxHeight: "150px", overflowY: "auto", position: "absolute", background: "white", width: "25%" }}>
              {brands.map((item, index) => (
                <li key={index} onClick={() => handleSelect(item.name, "BATCHBRAND", item._id)} style={{ padding: "5px", cursor: "pointer", borderBottom: "1px solid #eee" }}>
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    if (stockStructure.batch_color) {
      fields.push(
        <div className="col mb-3" key="batch_color">
          <label className="form-label mx-3">Color </label>
          <input
            placeholder="Enter color (if required)"
            name="batch_color"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={batch_color}
            onChange={(e) => setBatchColor(e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.batch_capacity) {
      fields.push(
        <div className="col mb-3" key="batch_capacity">
          <label className="form-label mx-3">Capacity</label>
          <input
            placeholder="Enter capacity (if required)"
            name="batch_capacity"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={batch_capacity}
            onChange={(e) => setBatchCapacity(e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.batch_height) {
      fields.push(
        <div className="col mb-3" key="batch_height">
          <label className="form-label mx-3">Height/Width</label>
          <input
            placeholder="Enter height/width (if required)"
            name="batch_height"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={batch_height}
            onChange={(e) => setBatchHeight(e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.batch_power) {
      fields.push(
        <div className="col mb-3" key="batch_power">
          <label className="form-label mx-3">Power/Watt</label>
          <input
            placeholder="Enter power/watt (if required)"
            name="batch_power"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={batch_power}
            onChange={(e) => setBatchPower(e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.batch_model) {
      fields.push(
        <div className="col mb-3" key="batch_model">
          <label className="form-label mx-3">Model</label>
          <input
            placeholder="Enter model number (if available)"
            name="batch_model"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={batch_model}
            onChange={(e) => setBatchModel(e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.batch_description) {
      fields.push(
        <div className="col mb-3" key="batch_description">
          <label className="form-label mx-3">Description <span className="title-class" data-tooltip="If you left the field empty, our system will autometically generate a description for the item."><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
              </svg>
            </span>
          </label>
          <input
            placeholder="Enter description (it will help to find the item)"
            name="batch_description"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={batch_description}
            onChange={(e) => setBatchDescription(e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.seller) {
      fields.push(
        <div className="col mb-3" key="seller">
          <label className="form-label mx-3">Seller</label>
          <input
            placeholder="Enter seller name (optional)"
            autoComplete="off"
            name="seller"
            type="text"
            maxLength={244}
            className="form-control"
            aria-describedby="emailHelp"
            value={seller}
            onChange={(e) => handleDropValueChange(e.target.value, "SELLER")}
            onBlur={() => setTimeout(() => setSellers([]), 100)}
          />
          <input hidden name="seller_id" type="text" maxLength={244} className="form-control" aria-describedby="emailHelp" value={seller_id} />
          {sellers.length > 0 && (
            <ul style={{ border: "1px solid #ccc", padding: "5px", marginTop: "2px", listStyleType: "none", maxHeight: "150px", overflowY: "auto", position: "absolute", background: "white", width: "25%" }}>
              {sellers.map((item, index) => (
                <li key={index} onClick={() => handleSelect(item.name, "SELLER", item._id)} style={{ padding: "5px", cursor: "pointer", borderBottom: "1px solid #eee" }}>
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    if (stockStructure.total_quantity) {
      fields.push(
        <div className="col mb-3" key="total_quantity">
          <label className="form-label mx-3">Total Quantity <span className="ei-col-red">*</span></label>
          <input
            required
            placeholder="Enter total quantity"
            name="total_quantity"
            type="number"
            className="form-control"
            aria-describedby="emailHelp"
            value={total_quantity}
            onChange={(e) => handleBuyPrice(e.target.value, "TOTALQUANTITY")}
          />
        </div>
      );
    }

    if (stockStructure.batch_no) {
      fields.push(
        <div className="col mb-3" key="batch_no">
          <label className="form-label mx-3">Batch No </label>
          <input
            placeholder="Enter batch number"
            name="batch_no"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={batch_no}
            onChange={(e) => setBatchNo(e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.batch_buy_price) {
      fields.push(
        <div className="col mb-3" key="batch_buy_price">
          <label className="form-label mx-3">Batch Buy Price <span className="ei-col-red">*</span></label>
          <input
            placeholder="Enter batch buy price"
            name="batch_buy_price"
            type="number"
            className="form-control"
            aria-describedby="emailHelp"
            value={batch_buy_price}
            onChange={(e) => handleBuyPrice(e.target.value, "BATCHBUYPRICE")}
          />
        </div>
      );
    }

    if (stockStructure.batch_sell_price) {
      fields.push(
        <div className="col mb-3" key="batch_sell_price">
          <label className="form-label mx-3">Batch Sell Price</label>
          <input
            placeholder="Enter batch sell price (Optional)"
            name="batch_sell_price"
            type="number"
            className="form-control"
            aria-describedby="emailHelp"
            value={batch_sell_price}
            onChange={(e) => setBatchSellPrice(e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.per_piece_buy_price) {
      fields.push(
        <div className="col mb-3" key="per_piece_buy_price">
          <label className="form-label mx-3">Per Piece Buy Price</label>
          <input
            required
            placeholder="Enter item buy price"
            name="per_piece_buy_price"
            type="number"
            className="form-control"
            aria-describedby="emailHelp"
            value={per_piece_buy_price}
            onChange={(e) => handleBuyPrice(e.target.value, "PERPEACEBUYPRICE")}
          />
        </div>
      );
    }

    if (stockStructure.per_piece_sell_price) {
      fields.push(
        <div className="col mb-3" key="per_piece_sell_price">
          <label className="form-label mx-3">Per Piece Sell Price </label>
          <input
            placeholder="Enter item sell price"
            name="per_piece_sell_price"
            type="number"
            className="form-control"
            aria-describedby="emailHelp"
            value={per_piece_sell_price}
            onChange={(e) => setPerPeaceSellPrice(e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.batch_mfg_date) {
      fields.push(
        <div className="col mb-3" key="batch_mfg_date">
          <label className="form-label mx-3">Batch Mfg Date</label>
          <input
            name="batch_mfg_date"
            type="date"
            className="form-control"
            aria-describedby="emailHelp"
            value={batch_mfg_date}
            onChange={(e) => setBatchMfgDate(e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.batch_exp_date) {
      fields.push(
        <div className="col mb-3" key="batch_exp_date">
          <label className="form-label mx-3">Batch Exp Date</label>
          <input
            name="batch_exp_date"
            type="date"
            className="form-control"
            aria-describedby="emailHelp"
            value={batch_exp_date}
            onChange={(e) => setBatchExpDate(e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.batch_warrantee_guarantee) {
      fields.push(
        <div className="col mb-3" key="batch_warrantee_guarantee">
          <label className="form-label">Batch Warrantee/Guarantee</label>
          <select
            className="form-select"
            aria-label="Default select example"
            name="batch_warrantee_guarantee"
            value={batch_warrantee_guarantee}
            onChange={(e) => setBatchWarranteeGuarente(e.target.value)}
          >
            <option>--Select if applicable--</option>
            <option value="WARRANTEE">Warrantee Applicable</option>
            <option value="GUARENTE">Guarantee Applicable</option>
            <option value="NOTHING">Nothing Applicable</option>
          </select>
        </div>
      );
    }

    if (stockStructure.batch_warrantee_guarantee_duration && (batch_warrantee_guarantee === "WARRANTEE" || batch_warrantee_guarantee === "GUARENTE")) {
      fields.push(
        <div className="col mb-3" key="batch_warrantee_guarantee_duration">
          <label className="form-label">Batch Warrantee/Guarantee Duration</label>
          <select
            className="form-select"
            aria-label="Default select example"
            name="batch_warrantee_guarantee_duration"
            value={batch_warrantee_guarantee_duration}
            onChange={(e) => setBatchWarranteeGuarenteDuration(e.target.value)}
          >
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
        </div>
      );
    }

    if (stockStructure.item_status) {
      fields.push(
        <div className="col mb-3" key="item_status">
          <label className="form-label">Item Status <span className="ei-col-red">*</span></label>
          <select
            required
            className="form-select"
            aria-label="Default select example"
            name="item_status"
            value={item_status}
            onChange={(e) => setItemStatus(e.target.value)}
          >
            <option value="RECEIVED">Received</option>
            <option value="RETURNED">Returned</option>
          </select>
        </div>
      );
    }

    if (stockStructure.return_reason && item_status === "RETURNED") {
      fields.push(
        <div className="col mb-3" key="return_reason">
          <label className="form-label mx-3">Return Reason</label>
          <input
            placeholder="Describe return reason"
            name="return_reason"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={return_reason}
            onChange={(e) => setReturnReason(e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.remarks) {
      fields.push(
        <div className="col mb-3" key="remarks">
          <label className="form-label mx-3">Remarks (If any)</label>
          <input
            placeholder="Enter remarks if any"
            name="remarks"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
          />
        </div>
      );
    }

    return fields;
  };

  // Collect all visible fields for a single lower part entry
  const getLowerPartVisibleFields = (entry, index) => {
    const fields = [];

    if (stockStructure.unique_code) {
      fields.push(
        <div className="col mb-3" key={`unique_code_${index}`}>
          <label className="form-label mx-3">Unique Code</label>
          <input
            placeholder="Enter unique code (if available)"
            name="unique_code"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={entry.unique_code}
            onChange={(e) => handleLowerPartChange(index, "unique_code", e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.brand) {
      fields.push(
        <div className="col mb-3" key={`brand_${index}`}>
          <label className="form-label mx-3">Brand</label>
          <input
            placeholder="Enter brand name"
            autoComplete="off"
            name="brand"
            type="text"
            maxLength={244}
            className="form-control"
            aria-describedby="emailHelp"
            value={entry.brand}
            onChange={(e) => handleDropValueChange(e.target.value, "brand", index)}
            onBlur={() => setTimeout(() => setBrands([]), 100)}
          />
          <input hidden name="brand_id" type="text" maxLength={244} className="form-control" aria-describedby="emailHelp" value={entry.brand_id} />
          {brandIndex === index && brands.length > 0 && (
            <ul style={{ border: "1px solid #ccc", padding: "5px", marginTop: "2px", listStyleType: "none", maxHeight: "150px", overflowY: "auto", position: "absolute", background: "white", width: "25%" }}>
              {brands.map((item, innerIndex) => (
                <li key={innerIndex} onClick={() => handleSelect(item.name, "brand", item._id, index)} style={{ padding: "5px", cursor: "pointer", borderBottom: "1px solid #eee" }}>
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    }

    if (stockStructure.color) {
      fields.push(
        <div className="col mb-3" key={`color_${index}`}>
          <label className="form-label mx-3">Color </label>
          <input
            placeholder="Enter color (if required)"
            name="color"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={entry.color}
            onChange={(e) => handleLowerPartChange(index, "color", e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.capacity) {
      fields.push(
        <div className="col mb-3" key={`capacity_${index}`}>
          <label className="form-label mx-3">Capacity</label>
          <input
            placeholder="Enter capacity (if required)"
            name="capacity"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={entry.capacity}
            onChange={(e) => handleLowerPartChange(index, "capacity", e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.height) {
      fields.push(
        <div className="col mb-3" key={`height_${index}`}>
          <label className="form-label mx-3">Height/Width</label>
          <input
            placeholder="Enter height/width (if required)"
            name="height"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={entry.height}
            onChange={(e) => handleLowerPartChange(index, "height", e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.power) {
      fields.push(
        <div className="col mb-3" key={`power_${index}`}>
          <label className="form-label mx-3">Power/Watt</label>
          <input
            placeholder="Enter power/watt (if required)"
            name="power"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={entry.power}
            onChange={(e) => handleLowerPartChange(index, "power", e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.model) {
      fields.push(
        <div className="col mb-3" key={`model_${index}`}>
          <label className="form-label mx-3">Model</label>
          <input placeholder="Enter model number (if available)" name="model" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={entry.model} onChange={(e) => handleLowerPartChange(index, "model", e.target.value)}/>
        </div>
      );
    }

    if (stockStructure.description) {
      fields.push(
        <div className="col mb-3" key={`description_${index}`}>
          <label className="form-label mx-3">Description <span className="title-class" data-tooltip="If you left the field empty, our system will autometically generate a description for the item."><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
              </svg>
            </span>
          </label>
          <input
            placeholder="Enter description (it will help to find the item)"
            name="description"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={entry.description}
            onChange={(e) => handleLowerPartChange(index, "description", e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.quantity) {
      fields.push(
        <div className="col mb-3" key={`quantity_${index}`}>
          <label className="form-label mx-3">Quantity <span className="ei-col-red">*</span></label>
          <input
            required
            placeholder="Enter quantity"
            name="quantity"
            type="number"
            className="form-control"
            aria-describedby="emailHelp"
            value={entry.quantity}
            onChange={(e) => handleLowerPartChange(index, "quantity", e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.item_buy_price) {
      fields.push(
        <div className="col mb-3" key={`item_buy_price_${index}`}>
          <label className="form-label mx-3">Item Buy Price</label>
          <input
            placeholder="Enter item buy price (if required)"
            name="item_buy_price"
            type="number"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={entry.item_buy_price}
            onChange={(e) => handleLowerPartChange(index, "item_buy_price", e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.item_sell_price) {
      fields.push(
        <div className="col mb-3" key={`item_sell_price_${index}`}>
          <label className="form-label mx-3">Item Sell Price</label>
          <input
            placeholder="Enter item buy price (optional)"
            name="item_sell_price"
            type="number"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={entry.item_sell_price}
            onChange={(e) => handleLowerPartChange(index, "item_sell_price", e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.mfg_date) {
      fields.push(
        <div className="col mb-3" key={`mfg_date_${index}`}>
          <label className="form-label mx-3">Item Mfg Date</label>
          <input
            name="mfg_date"
            type="date"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={entry.mfg_date}
            onChange={(e) => handleLowerPartChange(index, "mfg_date", e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.exp_date) {
      fields.push(
        <div className="col mb-3" key={`exp_date_${index}`}>
          <label className="form-label mx-3">Item Exp Date</label>
          <input
            name="exp_date"
            type="date"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={entry.exp_date}
            onChange={(e) => handleLowerPartChange(index, "exp_date", e.target.value)}
          />
        </div>
      );
    }
    
    if (stockStructure.warrantee_guarantee) {
      fields.push(
        <div className="col mb-3" key={`warrantee_guarantee_${index}`}>
          <label className="form-label">Warrantee/Guarantee</label>
          <select
            className="form-select"
            aria-label="Default select example"
            name="warrantee_guarantee"
            value={entry.warrantee_guarantee}
            onChange={(e) => handleLowerPartChange(index, "warrantee_guarantee", e.target.value)}
          >
            <option>--Select if applicable--</option>
            <option value="WARRANTEE">Warrantee Applicable</option>
            <option value="GUARENTE">Guarantee Applicable</option>
            <option value="NOTHING">Nothing Applicable</option>
          </select>
        </div>
      );
    }

    if (stockStructure.warrantee_guarantee_duration && (entry.warrantee_guarantee === "WARRANTEE" || entry.warrantee_guarantee === "GUARENTE")) {
      fields.push(
        <div className="col mb-3" key={`warrantee_guarantee_duration_${index}`}>
          <label className="form-label">Warrantee/Guarantee Duration</label>
          <select
            className="form-select"
            aria-label="Default select example"
            name="warrantee_guarantee_duration"
            value={entry.warrantee_guarantee_duration}
            onChange={(e) => handleLowerPartChange(index, "warrantee_guarantee_duration", e.target.value)}
          >
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
        </div>
      );
    }

    return fields;
  };

  return (
    <div className="container my-2">
      {isStockStructure && (
        <form onSubmit={handleSubmit}>
          {/* Upper part: Render visible fields in rows of 3 */}
          {chunkArray(getUpperPartVisibleFields(), 3).map((rowFields, rowIndex) => (
            <div className="row" key={`upper_row_${rowIndex}`}>
              {rowFields}
            </div>
          ))}

          {/* Lower part: Render visible fields for each entry in rows of 3 */}
          {(stockStructure.unique_code || stockStructure.mfg_date || stockStructure.exp_date || stockStructure.item_buy_price || stockStructure.item_sell_price || stockStructure.warrantee_guarantee || stockStructure.warrantee_guarantee_duration || stockStructure.brand || stockStructure.color || stockStructure.capacity || stockStructure.height || stockStructure.power || stockStructure.model || stockStructure.description || stockStructure.quantity) && (
            <div>
              <hr />
              <h6>Fill the below form if any specific item has any specific properties. You can specify multiple items with 
                <span className="border-0 bg-success btn btn-primary mx-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-dotted" viewBox="0 0 16 16">
                    <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                  </svg> 
                </span> button</h6>
              {lowerPartEntries.map((entry, index) => (
                <div key={index} className="border p-3 mb-3">
                  {/* Render visible fields for this entry in rows of 3 */}
                  {chunkArray(getLowerPartVisibleFields(entry, index), 3).map((rowFields, rowIndex) => (
                    <div className="row" key={`lower_entry_${index}_row_${rowIndex}`}>
                      {rowFields}
                    </div>
                  ))}
                  {/* Add/Remove buttons */}
                  <div className="d-flex justify-content-end mt-3">
                    <button type="button" className="border-0 bg-success btn btn-primary mx-2" onClick={addLowerPartEntry}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-dotted" viewBox="0 0 16 16">
                        <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                      </svg>
                    </button>
                    <button type="button" className="border-0 btn bg-danger btn-denger mx-2" onClick={() => removeLowerPartEntry(index)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="btn btn-primary border-0 bg-success">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy" viewBox="0 0 16 16">
                <path d="M11 2H9v3h2z"/>
                <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
            </svg> Save
          </button>
          <button type="button" className="border-0 bg-danger btn btn-primary ms-4" onClick={handleReset}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-clockwise" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
              <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
            </svg> Reset
          </button>
        </form>
      )}
      {!isStockStructure && <div>
        <h3>No form configuration found !!</h3>  <br />
        <h3>First configure 'add stock form' to continue.</h3> <br /> <br />
        <h5>Follow the below steps to configure 'add stock form'.</h5> <br /> 
        <h5>Login {"->"} Customize Add Stock {"->"} Change the necessary {"->"} Save/Update</h5>  
      </div>}
    </div>
  );
}
export default AddStock;
