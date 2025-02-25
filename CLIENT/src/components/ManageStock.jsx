import React, { useState } from "react";

import toastr from 'toastr';
const token = sessionStorage.getItem('token');
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function StockDetails() {
  const [searchElement, setsearchElement] = useState("");
  const [listData, setListData] = useState([]);
  const [billingData, setBillingData] = useState([]);

  const searchFilter = async (value) => {
    setsearchElement(value)
    setListData([]);
    if(value){
        try {
            const response = await fetch(`${HOST}:${PORT}/server/stock-list`, {
            method: "GET",
            headers: { 'authorization': `Bearer ${token}`, "value": value },
            });
    
            const result = await response.json();
            if (response.ok) {
                setListData(result.docs);
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
    billingData.push(matchedItem)
    setBillingData(billingData)
    setListData([]);
    setsearchElement("");
  }

  const removeItem = (_id) =>{
    console.log(_id)
    console.log(billingData)
    for(let i=0; i<billingData.length; i++){
        if(billingData[i]._id == _id){
            billingData.splice(i, 1);
            i--;
        }
        setBillingData(billingData)
    }
  }

  return (
    <div className="container my-2">
        <div className="row">
            <div className="col-9">
                <input value={searchElement} name="searchElement" onChange={(e) => searchFilter(e.target.value)} placeholder="Search item..." className="form-control my-3"/>
            </div>
            <div className="col-1">
                <button  className="form-control my-3">Scan</button>
            </div>
            <div className="col-1">
                <button  className="form-control my-3">Clear</button>
            </div>
            <div className="col-1">
                <button  className="form-control my-3">Bill</button>
            </div>
        </div>
        {listData.length > 0 && (
                <ul style={{ border: "1px solid #ccc", padding: "5px", marginTop: "2px", listStyleType: "none", maxHeight: "250px", overflowY: "auto", position: "absolute", background: "white", width: "79%" }}>
                {listData.map((item, index) => (
                    <li key={index} onClick={() => handleSelect(item._id)} style={{ padding: "5px", cursor: "pointer", borderBottom: "1px solid #eee"}} className="d-flex justify-content-between"> <span> {item.item} [ <strong>Quantity:</strong> {item.quantity}, Price: {item.item_sell_price}, Brand: {item.brand}, Model: {item.model} ]</span> <span className="d-flex"> <button className="form-control mx-2">Sell</button> <button className="form-control mx-2">Bill</button></span></li>
                ))}
            </ul>)}
      {(billingData.length == 0) && <div className="text-center">
        No item selected
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
                    <td className="p-2">{item.brand}</td> 
                    <td className="p-2">{item.Model}</td> 
                    <td className="p-2 d-flex justify-content-center align-items-center">
                        <div style={{maxWidth: "100px"}} className="d-flex justify-content-between">
                            <div className="px-2" style={{backgroundColor: "#f2f2f2"}}>+</div>
                            <div className="px-3">
                                {item.quantity}
                            </div>
                            <div className="px-2" style={{backgroundColor: "#f2f2f2"}}>-</div>
                        </div>
                    </td>
                    <td className="p-2 "> <input style={{maxWidth: "150px"}} className="form-control" type="text" value={item.item_sell_price}/></td>
                    <td className="p-2"><button className="form-control" onClick={() => removeItem(item._id)} >Remove</button></td>
                </tr>
                ))}
        </table>
      </div>}
    </div>
  );
}

export default StockDetails;