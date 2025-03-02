import React, { useState, useEffect } from "react";
import moment from 'moment';
import toastr from 'toastr';
const token = sessionStorage.getItem('token');
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function StockDetails() {
  const [billListDiv, setBillListDiv] = useState(true);
  const [company_details, setCompanyDetails] = useState({})
  const [searchElement, setSearchElement] = useState("");
  const [listData, setListData] = useState([]);
  const [billingData, setBillingData] = useState([]);
  const [finalBillingData, setFinalBillingData] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({});
  const [buyerDetails, setBuyerDetails] = useState({buyer_phone: "", buyer_name: "", buyer_address: "", buyer_pin: "", buyer_email: "", buyer_aadhar: ""});
  const [buyers, setBuyers] = useState([]);

  const fetchCompanyDetails = async () => {
    try {
        const response = await fetch(`${HOST}:${PORT}/server/get-company-details`, {
            method: "GET",
            headers: { 'authorization': `Bearer ${token}` },
          });
          if (response) {
            const result = await response.json();
            if (response.ok) {
                setCompanyDetails(result.doc)
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

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const searchFilter = async (value) => {
    setSearchElement(value)
    setListData([]);
    if(value){
        try {
            const response = await fetch(`${HOST}:${PORT}/server/stock-list`, {
            method: "GET",
            headers: { 'authorization': `Bearer ${token}`, "value": value },
            });
    
            const result = await response.json();
            if (response.ok) {
                let tempArr = [];
                for(let i=0; i<result.docs.length; i++){
                    const ref = result.docs[i];
                    const matchedItem = billingData.find((item)=>item._id == ref._id);
                    if(!matchedItem){
                        tempArr.push(ref)
                    }
                }
                setListData(tempArr);
            } else {
            toastr.error(result.msg);
            }
        } catch (err) {
            toastr.error("We are unable to process now. Please try again later.");
        }
    }
  }

  const handleSelect = (_id, type) =>{
    if(type == "ITEM"){
        const matchedItem = listData.find((item)=>item._id == _id);
        const tempArr = billingData.slice();
        matchedItem.total_quantity = matchedItem.quantity;
        matchedItem.total_item_sell_price = matchedItem.item_sell_price;
        matchedItem.quantity = 1;
        tempArr.push(matchedItem)
        setBillingData(tempArr)
        setListData([]);
        setSearchElement("");
    } else if (type == "BUYER"){
        const matchedItem = buyers.find((item)=>item._id == _id);
        const tempObj = {...buyerDetails};
            tempObj._id = matchedItem._id;
            tempObj.buyer_phone = matchedItem.phone;
            tempObj.buyer_name = matchedItem.name;
            tempObj.buyer_address = matchedItem.address;
            tempObj.buyer_pin = matchedItem.pin;
            tempObj.buyer_email = matchedItem.email;
            tempObj.buyer_aadhar = matchedItem.aadhar;
        setBuyerDetails(tempObj)
        setBuyers([])
    }
  }

  const removeItem = (_id) =>{
    const tempArr = billingData.slice();
    for(let i=0; i<tempArr.length; i++){
        if(tempArr[i]._id == _id){
            tempArr.splice(i, 1);
            i--;
        }
        setBillingData(tempArr)
    }
  }

  const clearBillingData = () => {
    setBillingData([])
  }

  const changePrice = (value, _id) => {
    value = value ? Number(value) : 0;
    const tempArr = billingData.slice();
    for(let i=0; i<tempArr.length; i++){
        if(tempArr[i]._id == _id){
            tempArr[i].item_sell_price = value;
            tempArr[i].total_item_sell_price = tempArr[i].quantity * tempArr[i].item_sell_price
        }
        setBillingData(tempArr)
    }
  }

  const changeQuantity = (_id, value) => {
    const tempArr = billingData.slice();
    for(let i=0; i<tempArr.length; i++){
        if(tempArr[i]._id == _id){
            if(value == 1 && tempArr[i].quantity<tempArr[i].total_quantity){
                tempArr[i].quantity = Number(tempArr[i].quantity)+1;
                tempArr[i].total_item_sell_price = tempArr[i].quantity * tempArr[i].item_sell_price
            } else if (value == 0 && tempArr[i].quantity>1){
                tempArr[i].quantity = Number(tempArr[i].quantity)-1;
                tempArr[i].total_item_sell_price = tempArr[i].quantity * tempArr[i].item_sell_price
            } 
        }
        setBillingData(tempArr)
    }
  }

  const bill = (type) => {
    if(type == "ALL"){
        setBuyerDetails({buyer_phone: "", buyer_name: "", buyer_address: "", buyer_pin: "", buyer_email: "", buyer_aadhar: ""})
        setBillListDiv(false)
        const tempObj = {}
        tempObj.billingData = billingData;
        tempObj.total = 0
        for(let i=0; i<billingData.length; i++){
            tempObj.total = tempObj.total + billingData[i].total_item_sell_price;
        }
        tempObj.grandTotal = tempObj.total;
        const rightNow = new Date();
        tempObj.date = moment(rightNow).format('DD/MM/YYYY');
        paymentDetails.payment_type = "CASH";
        paymentDetails.paid_amount = tempObj.grandTotal;
        paymentDetails.ramaining_amount = 0;
        paymentDetails.info = "";
        setFinalBillingData(tempObj)
    }
  }

  const changeCharges = (value, type) => {
    const tempObj = {...finalBillingData};
    if(type == "discount"){
        tempObj.discount = value;
        if(value && value > -1){
            if(tempObj.additional_charges && tempObj.additional_charges>0){
                tempObj.grandTotal = (Number(tempObj.total) + Number(tempObj.additional_charges)) - Number(value)
            } else{
                tempObj.grandTotal = Number(tempObj.total) - Number(value)
            }
        }
    } else if (type == "additional_charges"){
        tempObj.additional_charges = value;
        if(value && value > -1){
            if(tempObj.discount && tempObj.discount>0){
                tempObj.grandTotal = (Number(tempObj.total) - Number(tempObj.discount)) + Number(value)
            } else {
                tempObj.grandTotal = Number(tempObj.total) + Number(value)
            }
        }
    }
    paymentDetails.paid_amount = tempObj.grandTotal;
    paymentDetails.total_amount = tempObj.grandTotal;
    changePaymentDetails(tempObj.grandTotal, "paid_amount")
    setFinalBillingData(tempObj)
  }

const changePaymentDetails = (value, type) => {
    const tempObj = {...paymentDetails};
    if(type == "payment_type"){
        tempObj.payment_type = value;
    } else if (type == "paid_amount"){
        tempObj.paid_amount = value;
        tempObj.ramaining_amount = tempObj.total_amount - value;
    } else if (type == "info"){
        tempObj.info = value;
    }else if (type == "pending_installation"){
        tempObj.pending_installation = value;
    }
    setPaymentDetails(tempObj)
  }
  
  const changeBuyerDetails = (value, type)=>{
    const tempObj = {...buyerDetails};
    if(type == "buyer_phone"){
        tempObj.buyer_phone = value;
        searchBuyers(value)
    } else if (type == "buyer_name"){
        tempObj.buyer_name = value;
    } else if (type == "buyer_address"){
        tempObj.buyer_address = value;
    } else if (type == "buyer_pin"){
        tempObj.buyer_pin = value;
    } else if (type == "buyer_email"){
        tempObj.buyer_email = value;
    } else if (type == "buyer_aadhar"){
        tempObj.buyer_aadhar = value;
    }
    setBuyerDetails(tempObj)
  }

  const searchBuyers = async (value) => {
    setBuyers([]);
    if(value){
        try {
            const response = await fetch(`${HOST}:${PORT}/server/buyer-list`, {
            method: "GET",
            headers: { 'authorization': `Bearer ${token}`, "value": value, "company_id": company_details._id, active: true },
            });
    
            const result = await response.json();
            if (response.ok) {
                setBuyers(result.docs);
            } else {
            toastr.error(result.msg);
            }
        } catch (err) {
            toastr.error("We are unable to process now. Please try again later.");
        }
    }
  }

  const submitBill = async () =>{
    const billingItemDetails = [];
    for(let i=0; i<finalBillingData.billingData.length; i++){
        const ref = {
            item_id: finalBillingData.billingData[i]._id,
            sell_price: finalBillingData.billingData[i].item_sell_price,
            quantity: finalBillingData.billingData[i].quantity
        }
        billingItemDetails.push(ref);
    }
    const billData = {company_id: company_details._id , date: finalBillingData.date, items: billingItemDetails, total: finalBillingData.total, additional_charges: finalBillingData.additional_charges, discount: finalBillingData.discount, grandTotal: finalBillingData.grandTotal,
        payment_type: paymentDetails.payment_type, paid_amount:paymentDetails.paid_amount, ramaining_amount: paymentDetails.ramaining_amount, pending_installation: paymentDetails.pending_installation, info: paymentDetails.info,
        buyer_id: buyerDetails._id, buyer_phone: buyerDetails.buyer_phone, buyer_name: buyerDetails.buyer_name, buyer_email: buyerDetails.buyer_email, buyer_address: buyerDetails.buyer_address, buyer_pin: buyerDetails.buyer_pin, buyer_aadhar: buyerDetails.buyer_aadhar };
    if (!billData || !billData.company_id || !billData.date ){
      toastr.error("We are facing some problem in submission. Please try again with fresh entry.");
      return;
    }
    console.log("billData", billData)
    const response = await fetch(`${HOST}:${PORT}/server/bill-create`, {
      method: "POST",
      body: JSON.stringify(billData),
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${token}`,
      }
    });
    if (response){
      const result = await response.json();
      if (response.ok && result.status){
        toastr.success("Bill created successfully.");
      } else{
        toastr.error(result.msg);
      }
    } else{
      toastr.error("We are unable to process now. Please try again later.")
    }
  }


  return (
    <div className="container my-2">
        {billListDiv && <div>
            <div className="row">
                <div className="col-9">
                    <input value={searchElement} name="searchElement" onChange={(e) => searchFilter(e.target.value)} placeholder="Search item..." className="form-control my-3"/>
                </div>
                <div className="col-1">
                    <button disabled className="form-control my-3 disabled-btn">Scan</button>
                </div>
                <div className="col-1">
                    <button disabled={billingData.length === 0} className={`form-control my-3 bc-red-imp ${billingData.length === 0 ? 'disabled-btn' : ''}`} onClick={() =>clearBillingData()}>Clear</button>
                </div>
                <div className="col-1">
                    <button disabled={billingData.length === 0} className={`form-control my-3 bc-green-imp ${billingData.length === 0 ? 'disabled-btn' : ''}`}  onClick={() =>bill("ALL")}>Bill</button>
                </div>
            </div>
            {listData.length > 0 && (
                    <ul style={{ border: "1px solid #ccc", padding: "5px", marginTop: "2px", listStyleType: "none", maxHeight: "250px", overflowY: "auto", position: "absolute", background: "white", width: "79%" }}>
                    {listData.map((item, index) => (
                        <li key={index} onClick={() => handleSelect(item._id, "ITEM")} style={{ padding: "5px", cursor: "pointer", borderBottom: "1px solid #eee"}} className="d-flex justify-content-between"> <span> {item.item} [ Available: {item.quantity}, Price: {item.item_sell_price? item.item_sell_price: "N/A"}, Brand: {item.brand ? item.brand : "N/A"}, Model: {item.model ? item.model : "N/A"} ]</span> <span className="d-flex"> <button className="form-control mx-2">Sell</button> <button className="form-control mx-2 bc-green-imp">Bill</button></span></li>
                    ))}
                </ul>)}
            {(billingData.length == 0) && <div className="text-center my-5">
                No item selected. Please select by searching in the above search box.
            </div>}
            {(billingData.length > 0) && <div>
                <table className="table table-striped shadow-sm p-3 bg-body-tertiary rounded">
                        <tr className="text-center">
                            <th className="p-2">Name</th>
                            <th className="p-2">Brand</th>
                            <th className="p-2">Model</th>
                            <th className="p-2">Quantity</th>
                            <th className="p-2">Price</th>
                            <th className="p-2">Total Price</th>
                            <th className="p-2">Action</th>
                        </tr>
                        {billingData.map((item, index) => (
                        <tr className="text-center">
                            <td className="p-2">{item.item}</td>
                            <td className="p-2">{item.brand ? item.brand : "N/A"}</td> 
                            <td className="p-2">{item.model ? item.model : "N/A"}</td> 
                            <td className="p-2 d-flex justify-content-center align-items-center">
                                <div style={{maxWidth: "100px"}} className="d-flex justify-content-between">
                                    <div className="px-2 cursor-pointer" style={{backgroundColor: "#f2f2f2"}} onClick={() => changeQuantity(item._id, 0)}>-</div>
                                    <div className="px-2">
                                        {item.quantity}
                                    </div>
                                    <div className="px-2 cursor-pointer" style={{backgroundColor: "#f2f2f2"}} onClick={() => changeQuantity(item._id, 1)}>+</div>
                                </div>
                            </td>
                            <td className="p-2 "> <div style={{background: "unset"}} className="d-flex align-items-center justify-content-center"> <input style={{maxWidth: "150px"}} className="form-control" type="text" value={item.item_sell_price} onChange={(e) => changePrice(e.target.value, item._id)}/></div></td>
                            <td className="p-2 ">{item.total_item_sell_price}</td>
                            <td className="p-2"><button className="form-control" onClick={() => removeItem(item._id)} >Remove</button></td>
                        </tr>
                        ))}
                </table>
            </div>}
        </div>}
        {!billListDiv &&<div>
            <div className="d-flex justify-content-end">
                <button className="form-control mb-3" style={{maxWidth: "100px"}} onClick={() => setBillListDiv(true)} >Back</button>
            </div>
            <div className="text-center bg-body-tertiary p-3">
                <h3>{company_details.name}</h3>
                <h6>GST No: {company_details.gstNo}</h6>
                <h6>Contact Number: {company_details.phone}</h6>
                <h6>Address: {company_details.address}</h6>
                {(finalBillingData.billingData.length > 0) && <div className="mt-3">
                    <div className="my-3 d-flex justify-content-end">Date: {finalBillingData.date}</div>
                    <table className="table table-striped p-3 rounded">
                            <tr className="text-center">
                                <th className="p-2 text-start">Product Name</th>
                                <th className="p-2 text-start">Brand</th>
                                <th className="p-2 text-start">Model</th>
                                <th className="p-2">Quantity</th>
                                <th className="p-2 text-end">Price</th>
                                <th className="p-2 text-end">Total Price</th>
                            </tr>
                            {finalBillingData.billingData.map((item, index) => (
                            <tr className="text-center">
                                <td className="p-2 text-start">{item.item}</td>
                                <td className="p-2 text-start">{item.brand ? item.brand : "N/A"}</td> 
                                <td className="p-2 text-start">{item.model ? item.model : "N/A"}</td> 
                                <td className="p-2">{item.quantity}</td>
                                <td className="p-2 text-end"> {item.item_sell_price}</td>
                                <td className="p-2 text-end"> {item.total_item_sell_price}</td>
                            </tr>
                            ))}
                            <tr></tr>
                            <tr >
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <th className="p-2 text-end"> Total : </th>
                                <td className="text-end p-2">{finalBillingData.total}</td>
                            </tr>
                            <tr >
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <th className="p-2 text-end"> GST : </th>
                                <td className="text-end p-2">00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <th className="p-2 text-end">Additional Charges : </th>
                                <td className="p-2"> <div style={{background: "unset"}} className="d-flex align-items-center justify-content-end p-0"> <input style={{maxWidth: "150px"}} placeholder="00" className="form-control text-end" type="text" value={finalBillingData.additional_charges} onChange={(e) => changeCharges(e.target.value, "additional_charges")}/></div></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <th className="p-2 text-end">Discount : </th>
                                <td className="p-2"> <div style={{background: "unset"}} className="d-flex align-items-center justify-content-end p-0"> <input style={{maxWidth: "150px"}} placeholder="00" className="form-control text-end" type="text" value={finalBillingData.discount} onChange={(e) => changeCharges(e.target.value, "discount")}/></div></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <th className="p-2 text-end">Grand Total : </th>
                                <td className="text-end p-2">{finalBillingData.grandTotal}</td>
                            </tr>
                    </table>
                </div>}
                <div className="row">
                    <div className="col d-flex flex-row align-items-center flex-nowrap">
                        <label className="form-label me-2 text-nowrap">Payment type :</label>
                        <select className="form-select" aria-label="Default select example" name="type" value={paymentDetails.payment_type} onChange={(e) => changePaymentDetails(e.target.value, "payment_type")}>
                            <option>-- Payment type --</option>
                            <option defaultValue value="CASH">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="CARD">Card</option>
                            <option value="BANKTRANSFER">Bank Transfer</option>
                        </select>
                    </div>
                    <div className="col d-flex flex-row align-items-center flex-nowrap">
                        <label className="form-label me-2 text-nowrap">Paid amount :</label>
                        <input name="paid_amount" placeholder="Paid amount"  type="text" maxLength={70} className="form-control text-end" aria-describedby="emailHelp" value={paymentDetails.paid_amount} onChange={(e) => changePaymentDetails(e.target.value, "paid_amount")}/>
                    </div>
                    <div className="col d-flex flex-row align-items-center flex-nowrap">
                        <label className="form-label me-2 text-nowrap">Remaining amount :</label>
                        <input disabled name="ramaining_amount" placeholder="Remaining amount"  type="text" maxLength={70} className="form-control text-end " aria-describedby="emailHelp" value={paymentDetails.ramaining_amount}/>
                    </div>
                    <div className="col d-flex flex-row align-items-center flex-nowrap">
                        <label className="form-label me-2 text-nowrap">Installation :</label>
                        <select className="form-select" aria-label="Default select example" name="type" value={paymentDetails.pending_installation} onChange={(e) => changePaymentDetails(e.target.value, "pending_installation")}>
                            <option>Not applicable</option>
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETE">Complete</option>
                        </select>
                    </div>
                </div>
                <input name="info" placeholder="Enter any additional information releted to sell or product or installation."  type="text" maxLength={255} className="form-control mt-4 mb-4" aria-describedby="emailHelp" value={paymentDetails.info} onChange={(e) => changePaymentDetails(e.target.value, "info")}/>
                <hr />
                <div className="row">
                    <div className="col">
                        <input autoComplete="off" name="buyer_phone" placeholder="Enter Buyer phone number"  type="text" maxLength={12} className="form-control" aria-describedby="emailHelp" value={buyerDetails.buyer_phone} onChange={(e) => changeBuyerDetails(e.target.value, "buyer_phone")}/>
                    </div>
                    <div className="col">
                        <input name="buyer_name" placeholder="Enter Buyer name"  type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={buyerDetails.buyer_name} onChange={(e) => changeBuyerDetails(e.target.value, "buyer_name")}/>
                    </div>
                </div>
                {buyers.length > 0 && (
                    <ul style={{ border: "1px solid #ccc", padding: "5px", marginTop: "2px", listStyleType: "none", maxHeight: "250px", overflowY: "auto", position: "absolute", background: "white", width: "38%" }}>
                    {buyers.map((item, index) => (
                        <li key={index} onClick={() => handleSelect(item._id, "BUYER")} style={{ padding: "5px", cursor: "pointer", borderBottom: "1px solid #eee"}} className="d-flex justify-content-between"> {item.phone} - {item.name} - {item.aadhar} </li>
                    ))}
                </ul>)}
                <div className="row my-4">
                    <div className="col">
                        <input name="buyer_address" placeholder="Enter Buyer address"  type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={buyerDetails.buyer_address} onChange={(e) => changeBuyerDetails(e.target.value, "buyer_address")}/>
                    </div>
                    <div className="col">
                        <input name="buyer_pin" placeholder="Enter Buyer PIN code"  type="text" maxLength={6} className="form-control" aria-describedby="emailHelp" value={buyerDetails.buyer_pin} onChange={(e) => changeBuyerDetails(e.target.value, "buyer_pin")}/>
                    </div>
                </div>
                <div className="row my-4">
                    <div className="col">
                        <input name="buyer_email" placeholder="Enter Buyer email address"  type="email" maxLength={70} className="form-control" aria-describedby="emailHelp" value={buyerDetails.buyer_email} onChange={(e) => changeBuyerDetails(e.target.value, "buyer_email")}/>
                    </div>
                    <div className="col">
                        <input name="buyer_aadhar" placeholder="Enter Buyer Aadhar Number"  type="text" maxLength={12} className="form-control" aria-describedby="emailHelp" value={buyerDetails.buyer_aadhar} onChange={(e) => changeBuyerDetails(e.target.value, "buyer_aadhar")}/>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-end mt-3 mb-5">
                <button className="form-control mx-2" style={{maxWidth: "100px"}} onClick={() => submitBill()} >Submit</button>
                <button className="form-control mx-2" style={{maxWidth: "100px"}} onClick={() => setBillListDiv(true)} >Home</button>
                <button className="form-control mx-2" style={{maxWidth: "100px"}} onClick={() => setBillListDiv(true)} >Print</button>
                <button className="form-control mx-2 bc-green-imp" style={{maxWidth: "140px"}} onClick={() => setBillListDiv(true)} >Whatsapp</button>
            </div>
        </div>}
    </div>
  );
}

export default StockDetails;