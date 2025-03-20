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
  const [item_status, setItemStatus] = useState("");
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
    setItemStatus("")
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
    const data = {sl_no, date, time, sub_category, item, item_id, seller, seller_id, total_quantity, batch_no, item_status, return_reason, remarks, stock_details: lowerPartEntries};
    const additionalData = {batch_brand, batch_brand_id, batch_color, batch_capacity, batch_height, batch_power, batch_description, batch_model, batch_buy_price, batch_sell_price, per_piece_buy_price, per_piece_sell_price, batch_mfg_date, batch_exp_date, batch_warrantee_guarantee, batch_warrantee_guarantee_duration}
    if(!data.date || !data.item || !data.total_quantity || !additionalData.batch_buy_price || !data.item_status){
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
            placeholder="Enter Sl no"
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
          <label className="form-label mx-3">Description</label>
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
            <option value="">--Select item status--</option>
            <option value="RECEIVED">Received</option>
            <option value="ACCEPTED">Accepted</option>
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
          <input
            placeholder="Enter model number (if available)"
            name="model"
            type="text"
            maxLength={70}
            className="form-control"
            aria-describedby="emailHelp"
            value={entry.model}
            onChange={(e) => handleLowerPartChange(index, "model", e.target.value)}
          />
        </div>
      );
    }

    if (stockStructure.description) {
      fields.push(
        <div className="col mb-3" key={`description_${index}`}>
          <label className="form-label mx-3">Description</label>
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
              <h6>Fill the below form if any specific item has any specific properties. You can specify multiple items with "+Add More" button</h6>
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
                    <button type="button" className="btn btn-danger mx-2" onClick={() => removeLowerPartEntry(index)}>Remove</button>
                    <button type="button" className="btn btn-primary mx-2" onClick={addLowerPartEntry}>+ Add More</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button type="submit" className="btn btn-primary">Save</button>
          <button type="button" className="btn btn-primary ms-4" onClick={handleReset}>Reset</button>
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
