import React, { useState } from "react";

import toastr from 'toastr';
const token = sessionStorage.getItem('token');
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function StockDetails() {
  const [billListDiv, setBillListDiv] = useState(true);
  const [discount, setDiscount] = useState(0);
  const [searchElement, setSearchElement] = useState("");
  const [listData, setListData] = useState([]);
  const [billingData, setBillingData] = useState([]);

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

  const handleSelect = (_id) =>{
    const matchedItem = listData.find((item)=>item._id == _id);
    const tempArr = billingData.slice();
    matchedItem.total_quantity = matchedItem.quantity;
    matchedItem.quantity = 1;
    tempArr.push(matchedItem)
    setBillingData(tempArr)
    setListData([]);
    setSearchElement("");
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
            } else if (value == 0 && tempArr[i].quantity>1){
                tempArr[i].quantity = Number(tempArr[i].quantity)-1;
            } 
        }
        setBillingData(tempArr)
    }
  }

  const bill = (type) => {
    if(type == "ALL"){
        setBillListDiv(false)
        console.log("abc", billingData)
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
                    <button   disabled={billingData.length === 0} className={`form-control my-3 bc-red-imp ${billingData.length === 0 ? 'disabled-btn' : ''}`} onClick={() =>clearBillingData()}>Clear</button>
                </div>
                <div className="col-1">
                    <button disabled={billingData.length === 0} className={`form-control my-3 bc-green-imp ${billingData.length === 0 ? 'disabled-btn' : ''}`}  onClick={() =>bill("ALL")}>Bill</button>
                </div>
            </div>
            {listData.length > 0 && (
                    <ul style={{ border: "1px solid #ccc", padding: "5px", marginTop: "2px", listStyleType: "none", maxHeight: "250px", overflowY: "auto", position: "absolute", background: "white", width: "79%" }}>
                    {listData.map((item, index) => (
                        <li key={index} onClick={() => handleSelect(item._id)} style={{ padding: "5px", cursor: "pointer", borderBottom: "1px solid #eee"}} className="d-flex justify-content-between"> <span> {item.item} [ Available: {item.quantity}, Price: {item.item_sell_price? item.item_sell_price: "N/A"}, Brand: {item.brand ? item.brand : "N/A"}, Model: {item.model ? item.model : "N/A"} ]</span> <span className="d-flex"> <button className="form-control mx-2">Sell</button> <button className="form-control mx-2 bc-green-imp">Bill</button></span></li>
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
                            <th className="p-2">Action</th>
                        </tr>
                        {billingData.map((item, index) => (
                        <tr className="text-center">
                            <td className="p-2">{item.item}</td>
                            <td className="p-2">{item.brand ? item.brand : "N/A"}</td> 
                            <td className="p-2">{item.model ? item.model : "N/A"}</td> 
                            <td className="p-2 d-flex justify-content-center align-items-center">
                                <div style={{maxWidth: "100px"}} className="d-flex justify-content-between">
                                    <div className="px-2 cursor-pointer" style={{backgroundColor: "#f2f2f2"}} onClick={() => changeQuantity(item._id, 1)}>+</div>
                                    <div className="px-2">
                                        {item.quantity}
                                    </div>
                                    <div className="px-2 cursor-pointer" style={{backgroundColor: "#f2f2f2"}} onClick={() => changeQuantity(item._id, 0)}>-</div>
                                </div>
                            </td>
                            <td className="p-2 "> <div style={{background: "unset"}} className="d-flex align-items-center justify-content-center"> <input style={{maxWidth: "150px"}} className="form-control" type="text" value={item.item_sell_price} onChange={(e) => changePrice(e.target.value, item._id)}/></div></td>
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
                <h3>ABCD Compnay</h3>
                <h5>GST No: 5644654654646</h5>
                <h5>Address: Porsha, itahar, uttar dinajpur, west bengal, india</h5>
                {(billingData.length > 0) && <div className="mt-3">
                    <div className="my-3 d-flex justify-content-between"><span className="ms-5">List of items: </span><span>Date: 01/02/2025</span></div>
                    <table className="table table-striped p-3 rounded">
                            <tr className="text-center">
                                <th className="p-2">Product Name</th>
                                <th className="p-2">Brand</th>
                                <th className="p-2">Model</th>
                                <th className="p-2">Quantity</th>
                                <th className="p-2">Price</th>
                                <th className="p-2">Total Price</th>
                            </tr>
                            {billingData.map((item, index) => (
                            <tr className="text-center">
                                <td className="p-2">{item.item}</td>
                                <td className="p-2">{item.brand ? item.brand : "N/A"}</td> 
                                <td className="p-2">{item.model ? item.model : "N/A"}</td> 
                                <td className="p-2">{item.quantity}</td>
                                <td className="p-2 "> {item.item_sell_price}</td>
                                <td className="p-2 "> {item.item_sell_price}</td>
                            </tr>
                            ))}
                            <tr></tr>
                            <tr  className="p-2" >
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <th className="p-2"> Total : </th>
                                <td>1454</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <th className="p-2">Discount : </th>
                                <td> <div style={{background: "unset"}} className="d-flex align-items-center justify-content-center"> <input style={{maxWidth: "150px"}} className="form-control" name="discount" type="number" value={discount} onChange={(e) => setDiscount(e.target.value)}/></div></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <th className="p-2">Grand Total : </th>
                                <td>1454</td>
                            </tr>
                    </table>
                </div>}
                <input name="name" placeholder="Any additional information releted to sell or product or installation."  type="text" maxLength={70} className="form-control my-5" aria-describedby="emailHelp" value={name} onChange={(e) => setName(e.target.value)}/>
                <h5>Buyer Details</h5>
                <div className="row my-4">
                    <div className="col">
                        <input name="name" placeholder="Enter Buyer phone number"  type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="col">
                        <input name="name" placeholder="Enter Buyer name"  type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                </div>
                <div className="row my-4">
                    <div className="col">
                        <input name="name" placeholder="Enter Buyer address"  type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                    <div className="col">
                        <input name="name" placeholder="Enter Buyer PIN code"  type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={name} onChange={(e) => setName(e.target.value)}/>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-end mt-3 mb-5">
                <button className="form-control mx-2" style={{maxWidth: "100px"}} onClick={() => setBillListDiv(true)} >Submit</button>
                <button className="form-control mx-2" style={{maxWidth: "100px"}} onClick={() => setBillListDiv(true)} >Print</button>
                <button className="form-control mx-2 bc-green-imp" style={{maxWidth: "140px"}} onClick={() => setBillListDiv(true)} >Whatsapp</button>
            </div>
        </div>}
    </div>
  );
}

export default StockDetails;