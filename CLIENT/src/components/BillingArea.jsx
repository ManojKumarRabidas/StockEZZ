import React, { useState, useEffect , useCallback} from "react";
import moment from 'moment';
import toastr from 'toastr';
const token = localStorage.getItem('token');
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function billingArea() {
  const [billListDiv, setBillListDiv] = useState(true);
  const [billCreationStatus, setBillCreationStatus] = useState(false);
  const [company_details, setCompanyDetails] = useState({})
  const [searchElement, setSearchElement] = useState("");
  const [listData, setListData] = useState([]);
  const [billingData, setBillingData] = useState([]);
  const [finalBillingData, setFinalBillingData] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({});
  const [buyerDetails, setBuyerDetails] = useState({buyer_phone: "", buyer_name: "", buyer_address: "", buyer_pin: "", buyer_email: "", buyer_aadhar: ""});
  const [buyers, setBuyers] = useState([]);
  const [billId, setBillId] = useState("");

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
            headers: { 'authorization': `Bearer ${token}`, "value": value, "available": true },
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


    const changeQuantity = (index, type, value) => {
      const tempArr = [...billingData];
      const ref = tempArr[index]
      if(type == 1 && ref.quantity<ref.total_quantity){
        tempArr[index].quantity = Number(tempArr[index].quantity)+1;
      } else if (type == -1 && tempArr[index].quantity>1){
        tempArr[index].quantity = Number(tempArr[index].quantity)-1;
      } else if (type == 0 && value>=1 && value<=tempArr[index].total_quantity){
        tempArr[index].quantity = Number(value);
      } else{
          toastr.info("Reached maximum/minimum quantity.");
      }
      tempArr[index].total_item_sell_price = tempArr[index].quantity * tempArr[index].item_sell_price
      setBillingData(tempArr)
    }

  const bill = (type) => {
    if(type == "ALL"){
        const billObj = {}
        billObj.billingData = billingData;
        billObj.total = 0
        for(let i=0; i<billingData.length; i++){
            if(isNaN(billingData[i].total_item_sell_price) || (billingData[i].total_item_sell_price == 0)){return toastr.error("Invalid price !")}
            billObj.total = billObj.total + billingData[i].total_item_sell_price;
        }
        billObj.grand_total = billObj.total;
        const rightNow = new Date();
        billObj.date = moment(rightNow).format('DD/MM/YYYY');
        const paymentObj = {}
        paymentObj.grand_total = billObj.grand_total;
        paymentObj.payment_mode = "CASH";
        paymentObj.paid_amount = billObj.grand_total;
        paymentObj.remaining_amount = 0;
        paymentObj.info = "";
        setBillListDiv(false)
        setFinalBillingData(billObj)
        setPaymentDetails(paymentObj)
        setBuyerDetails({buyer_phone: "", buyer_name: "", buyer_address: "", buyer_pin: "", buyer_email: "", buyer_aadhar: ""})
    }
  }

  const changeCharges = (value, type) => {
    const tempObj = {...finalBillingData};
    if(type == "discount"){
        tempObj.discount = value;
        if(value && value > -1){
            if(tempObj.additional_charges && tempObj.additional_charges>0){
                tempObj.grand_total = (Number(tempObj.total) + Number(tempObj.additional_charges)) - Number(value)
            } else{
                tempObj.grand_total = Number(tempObj.total) - Number(value)
            }
        }
    } else if (type == "additional_charges"){
        tempObj.additional_charges = value;
        if(value && value > -1){
            if(tempObj.discount && tempObj.discount>0){
                tempObj.grand_total = (Number(tempObj.total) - Number(tempObj.discount)) + Number(value)
            } else {
                tempObj.grand_total = Number(tempObj.total) + Number(value)
            }
        }
    }
    const paymentpObj = {...paymentDetails};
    // paymentpObj.paid_amount = (tempObj.grand_total - paymentpObj.remaining_amount);
    paymentpObj.grand_total = tempObj.grand_total;
    paymentpObj.remaining_amount = (tempObj.grand_total - paymentpObj.paid_amount);
    setPaymentDetails(paymentpObj)
    setFinalBillingData(tempObj)
  }

const changePaymentDetails = (value, type) => {
    const tempObj = {...paymentDetails};
    if(type == "payment_mode"){
        tempObj.payment_mode = value;
    } else if (type == "paid_amount"){
        tempObj.paid_amount = Number(value);
        tempObj.remaining_amount = tempObj.grand_total - value;
    } else if (type == "info"){
        tempObj.info = value;
    }else if (type == "installation_status"){
        tempObj.installation_status = value;
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
            buy_price: finalBillingData.billingData[i].item_buy_price,
            quantity: finalBillingData.billingData[i].quantity
        }
        billingItemDetails.push(ref);
    }
    const billData = {company_id: company_details._id , items: billingItemDetails, total: finalBillingData.total, additional_charges: finalBillingData.additional_charges, discount: finalBillingData.discount, grand_total: finalBillingData.grand_total,
        payment_mode: paymentDetails.payment_mode, paid_amount:paymentDetails.paid_amount, remaining_amount: paymentDetails.remaining_amount, installation_status: paymentDetails.installation_status, info: paymentDetails.info,
        buyer_id: buyerDetails._id, buyer_phone: buyerDetails.buyer_phone, buyer_name: buyerDetails.buyer_name, buyer_email: buyerDetails.buyer_email, buyer_address: buyerDetails.buyer_address, buyer_pin: buyerDetails.buyer_pin, buyer_aadhar: buyerDetails.buyer_aadhar };
    if (!billData || !billData.company_id ){
      toastr.error("We are facing some problem in submission. Please try again with fresh entry.");
      return;
    }
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
        setBillCreationStatus(true)
        setBillId(result.doc._id)
        toastr.success("Bill created successfully.");
      } else{
        toastr.error(result.msg);
      }
    } else{
      toastr.error("We are unable to process now. Please try again later.")
    }
  }

  const home = () => {
    setBillListDiv(true)
    setListData([])
    setBillingData([])
    setFinalBillingData({})
    setPaymentDetails({})
    setBuyerDetails({buyer_phone: "", buyer_name: "", buyer_address: "", buyer_pin: "", buyer_email: "", buyer_aadhar: ""})
    setBillCreationStatus(false)
  };

  const generateBillPdf = useCallback(async (id) => {
      try {
        const response = await fetch(`${HOST}:${PORT}/server/generate-bill-pdf/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Add authorization header if needed
            'Authorization': `Bearer ${token}`,
          },
          // body: JSON.stringify(payload),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          toastr.error(errorData.msg || 'Failed to generate bill');
          return;
        }
  
        // Get the PDF blob
        const pdfBlob = await response.blob();
        
        // Check if we got a valid PDF
        if (pdfBlob.size > 100) {
          saveAs(pdfBlob, `bill_${id}.pdf`);
        } else {
          throw new Error('Received empty or invalid PDF');
        }
  
      } catch (error) {
        toastr.error(error.message || 'Failed to download bill PDF');
      }
    }, []);

  return (
    <div className="container my-2">
        {billListDiv && <div>
            <div className="row">
                <div className="col-10">
                    <input autoComplete="off" value={searchElement} name="searchElement" onChange={(e) => searchFilter(e.target.value)} placeholder="Search item..." className="form-control my-3"/>
                </div>
                <div className="col-2 d-flex">
                    <div className="ms-3 cursor-pointer">
                        <span disabled className="form-control my-3 disabled-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upc-scan" viewBox="0 0 16 16">
                                <path d="M1.5 1a.5.5 0 0 0-.5.5v3a.5.5 0 0 1-1 0v-3A1.5 1.5 0 0 1 1.5 0h3a.5.5 0 0 1 0 1zM11 .5a.5.5 0 0 1 .5-.5h3A1.5 1.5 0 0 1 16 1.5v3a.5.5 0 0 1-1 0v-3a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 1-.5-.5M.5 11a.5.5 0 0 1 .5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 1 0 1h-3A1.5 1.5 0 0 1 0 14.5v-3a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a.5.5 0 0 1 0-1h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 1 .5-.5M3 4.5a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0zm2 0a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5zm3 0a.5.5 0 0 1 1 0v7a.5.5 0 0 1-1 0z"/>
                            </svg>
                        </span>
                    </div>
                    <div className="ms-3 cursor-pointer">
                        <span disabled={billingData.length === 0} className={`form-control my-3 bc-red-imp ${billingData.length === 0 ? 'disabled-btn' : ''}`} onClick={() =>clearBillingData()}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                            </svg>
                        </span>
                    </div>
                    <div className="ms-3 cursor-pointer">
                        <span disabled={billingData.length === 0} className={`form-control my-3 bc-green-imp ${billingData.length === 0 ? 'disabled-btn' : ''}`}  onClick={() =>bill("ALL")}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right-circle" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5z"/>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
            {listData.length > 0 && (
                <table className="text-center" style={{ border: "1px solid #ccc", padding: "5px", marginTop: "2px", maxHeight: "250px", overflowY: "auto", position: "absolute", background: "white", width: "79%" }}>
                    <tr>
                        <th className="p-2 text-start">Description</th>
                        <th className="p-2">Batch Id</th>
                        <th className="p-2">Batch no</th>
                        <th className="p-2">Available</th>
                        <th className="p-2">Price</th>
                    </tr>
                {listData.map((item, index) => (
                    <tr title="Click to add into bill" onClick={() => handleSelect(item._id, "ITEM")} style={{ cursor: "pointer", borderTop: "1px solid #eee"}} className="" key={index}>
                        <td className="p-2 text-start">{item.description} </td>
                        <td className="p-2">{item.batch_id}</td>
                        <td className="p-2">{item.batch_no}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">{item.item_sell_price}</td> 
                    </tr>
                 ))}
            </table>)}
            {(billingData.length == 0) && <div className="text-center my-5">
                No item selected. Please select by searching in the above search box.
            </div>}
            {(billingData.length > 0) && <div>
                <table className="table table-striped shadow-sm p-3 bg-body-tertiary rounded">
                        <tr className="text-center">
                            <th className="text-start p-2">Description</th>
                            <th className="p-2">Quantity</th>
                            <th className="p-2">Price</th>
                            <th className="p-2">Total Price</th>
                            <th className="p-2">Action</th>
                        </tr>
                        {billingData.map((item, index) => (
                        <tr className="text-center">
                            <td className="px-2 text-start">{item.description}</td>
                            <td className=" d-flex justify-content-center align-items-center">
                                <div style={{maxWidth: "150px", background: "none"}} className="d-flex align-items-center justify-content-between">
                                    <button className="btn btn-light px-2 cursor-pointer border d-flex align-items-center justify-content-center" style={{minHeight: "2.37rem", background: " rgb(242, 242, 242) !important", color:"black !important", borderRadius: "10px 0px 0px 10px"}} onClick={() => changeQuantity(index, -1)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle-dotted" viewBox="0 0 16 16">
                                        <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/>
                                      </svg>
                                    </button>
                                    <input style={{minWidth: "70px", borderRadius: "0"}} placeholder="Enter amount" value={item.quantity} name="updated_quantity" type="number" className="form-control text-center" aria-describedby="emailHelp" onChange={(e) => changeQuantity(index, 0, e.target.value)} />
                                    <button className="btn btn-light px-2 cursor-pointer border d-flex align-items-center justify-content-center" style={{minHeight: "2.37rem", background: " rgb(242, 242, 242) !important", color:"black !important", borderRadius: "0px 10px 10px 0px"}} onClick={() => changeQuantity(index, 1)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-dotted" viewBox="0 0 16 16">
                                        <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                      </svg>
                                    </button>
                                </div>
                            </td>
                            <td className=" ">{item.item_sell_price}</td>
                            <td className=" ">{item.total_item_sell_price}</td>
                            <td className="">
                                <span className="cursor-pointer" onClick={() => removeItem(item._id)} >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                    </svg>
                                </span> 
                            </td>
                        </tr>
                        ))}
                </table>
            </div>}
        </div>}
        {!billListDiv &&<div>
            <div className="text-center bg-body-tertiary p-3">
                <h3>{company_details.name}</h3>
                <h6>GST No: {company_details.gstNo}</h6>
                <h6>Contact Number: {company_details.phone}</h6>
                <h6>Address: {company_details.address}</h6>
                {(finalBillingData.billingData.length > 0) && <div className="mt-3">
                    <div className="my-3 d-flex justify-content-end">Date: {finalBillingData.date}</div>
                    <table className="table table-striped p-3 rounded">
                            <tr className="text-center">
                                <th className="p-2 text-start">Description</th>
                                <th className="p-2">Quantity</th>
                                <th className="p-2 text-end">Price</th>
                                <th className="p-2 text-end">Total Price</th>
                            </tr>
                            {finalBillingData.billingData.map((item, index) => (
                            <tr className="text-center">
                                <td className="p-2 text-start">{item.description}</td>
                                <td className="p-2">{item.quantity}</td>
                                <td className="p-2 text-end"> {item.item_sell_price}</td>
                                <td className="p-2 text-end"> {item.total_item_sell_price}</td>
                            </tr>
                            ))}
                            <tr></tr>
                            <tr >
                                <td></td>
                                <td></td>
                                <th className="p-2 text-end"> Total : </th>
                                <td className="text-end p-2">{finalBillingData.total}</td>
                            </tr>
                            <tr >
                                <td></td>
                                <td></td>
                                <th className="p-2 text-end"> GST : </th>
                                <td className="text-end p-2">00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <th className="p-2 text-end">Additional Charges : </th>
                                <td className="p-2"> <div style={{background: "unset"}} className="d-flex align-items-center justify-content-end p-0"> <input disabled={billCreationStatus} style={{maxWidth: "150px"}} placeholder="00" className="form-control text-end" type="text" value={finalBillingData.additional_charges} onChange={(e) => changeCharges(e.target.value, "additional_charges")}/></div></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <th className="p-2 text-end">Discount : </th>
                                <td className="p-2"> <div style={{background: "unset"}} className="d-flex align-items-center justify-content-end p-0"> <input disabled={billCreationStatus} style={{maxWidth: "150px"}} placeholder="00" className="form-control text-end" type="text" value={finalBillingData.discount} onChange={(e) => changeCharges(e.target.value, "discount")}/></div></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <th className="p-2 text-end">Grand Total : </th>
                                <td className="text-end p-2">{finalBillingData.grand_total}</td>
                            </tr>
                    </table>
                </div>}
                <div className="row">
                    <div className="col d-flex flex-row align-items-center flex-nowrap">
                        <label className="form-label me-2 text-nowrap">Payment type :</label>
                        <select disabled={billCreationStatus} className="form-select" aria-label="Default select example" name="type" value={paymentDetails.payment_mode} onChange={(e) => changePaymentDetails(e.target.value, "payment_mode")}>
                            <option>-- Payment type --</option>
                            <option defaultValue value="CASH">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="CARD">Card</option>
                            <option value="BANKTRANSFER">Bank Transfer</option>
                        </select>
                    </div>
                    <div className="col d-flex flex-row align-items-center flex-nowrap">
                        <label className="form-label me-2 text-nowrap">Paid amount :</label>
                        <input disabled={billCreationStatus} name="paid_amount" placeholder="Paid amount"  type="text" maxLength={70} className="form-control text-end" aria-describedby="emailHelp" value={paymentDetails.paid_amount} onChange={(e) => changePaymentDetails(e.target.value, "paid_amount")}/>
                    </div>
                    <div className="col d-flex flex-row align-items-center flex-nowrap">
                        <label className="form-label me-2 text-nowrap">Remaining amount :</label>
                        <input disabled name="remaining_amount" placeholder="Remaining amount"  type="text" maxLength={70} className="form-control text-end " aria-describedby="emailHelp" value={paymentDetails.remaining_amount}/>
                    </div>
                    <div className="col d-flex flex-row align-items-center flex-nowrap">
                        <label className="form-label me-2 text-nowrap">Installation :</label>
                        <select disabled={billCreationStatus} className="form-select" aria-label="Default select example" name="type" value={paymentDetails.installation_status} onChange={(e) => changePaymentDetails(e.target.value, "installation_status")}>
                            <option>Not applicable</option>
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETE">Complete</option>
                        </select>
                    </div>
                </div>
                <input disabled={billCreationStatus} name="info" placeholder="Enter any additional information releted to sell or product or installation."  type="text" maxLength={255} className="form-control mt-4 mb-4" aria-describedby="emailHelp" value={paymentDetails.info} onChange={(e) => changePaymentDetails(e.target.value, "info")}/>
                <hr />
                <div className="row">
                    <div className="col">
                        <input disabled={billCreationStatus} autoComplete="off" name="buyer_phone" placeholder="Enter Buyer phone number"  type="text" maxLength={12} className="form-control" aria-describedby="emailHelp" value={buyerDetails.buyer_phone} onChange={(e) => changeBuyerDetails(e.target.value, "buyer_phone")}/>
                    </div>
                    <div className="col">
                        <input disabled={billCreationStatus} name="buyer_name" placeholder="Enter Buyer name"  type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={buyerDetails.buyer_name} onChange={(e) => changeBuyerDetails(e.target.value, "buyer_name")}/>
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
                        <input disabled={billCreationStatus} name="buyer_address" placeholder="Enter Buyer address"  type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={buyerDetails.buyer_address} onChange={(e) => changeBuyerDetails(e.target.value, "buyer_address")}/>
                    </div>
                    <div className="col">
                        <input disabled={billCreationStatus} name="buyer_pin" placeholder="Enter Buyer PIN code"  type="text" maxLength={6} className="form-control" aria-describedby="emailHelp" value={buyerDetails.buyer_pin} onChange={(e) => changeBuyerDetails(e.target.value, "buyer_pin")}/>
                    </div>
                </div>
                <div className="row my-4">
                    <div className="col">
                        <input disabled={billCreationStatus} name="buyer_email" placeholder="Enter Buyer email address"  type="email" maxLength={70} className="form-control" aria-describedby="emailHelp" value={buyerDetails.buyer_email} onChange={(e) => changeBuyerDetails(e.target.value, "buyer_email")}/>
                    </div>
                    <div className="col">
                        <input disabled={billCreationStatus} name="buyer_aadhar" placeholder="Enter Buyer Aadhar Number"  type="text" maxLength={12} className="form-control" aria-describedby="emailHelp" value={buyerDetails.buyer_aadhar} onChange={(e) => changeBuyerDetails(e.target.value, "buyer_aadhar")}/>
                    </div>
                </div>
            </div>
            <div className="d-flex justify-content-end mt-3 mb-5">
                
                {!billCreationStatus && <button className="border-0 form-control mx-2 bg-primary" style={{maxWidth: "100px"}} onClick={() => setBillListDiv(true)} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-skip-backward-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                        <path d="M11.729 5.055a.5.5 0 0 0-.52.038L8.5 7.028V5.5a.5.5 0 0 0-.79-.407L5 7.028V5.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0V8.972l2.71 1.935a.5.5 0 0 0 .79-.407V8.972l2.71 1.935A.5.5 0 0 0 12 10.5v-5a.5.5 0 0 0-.271-.445"/>
                    </svg> Back
                </button>}
                {!billCreationStatus && <button className="border-0 form-control mx-2 bg-success" style={{maxWidth: "100px"}} onClick={() => submitBill()} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy" viewBox="0 0 16 16">
                        <path d="M11 2H9v3h2z"/>
                        <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
                    </svg> Save  
                </button>}
                {billCreationStatus && <button className="border-0 form-control mx-2 bg-primary" style={{maxWidth: "100px"}} onClick={() => home()} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-house" viewBox="0 0 16 16">
                        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z"/>
                    </svg> Home
                </button>}
                {billCreationStatus && <button className="border-0 form-control mx-2 bg-secondary" style={{maxWidth: "100px"}} onClick={() => generateBillPdf(billId)} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">
                        <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                        <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1"/>
                    </svg> Print
                </button>}
                {billCreationStatus && <button className="border-0 form-control mx-2 bg-info" style={{maxWidth: "140px"}} onClick={() => generateBillPdf(billId)} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-pdf" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.6 11.85H0v3.999h.791v-1.342h.803q.43 0 .732-.173.305-.175.463-.474a1.4 1.4 0 0 0 .161-.677q0-.375-.158-.677a1.2 1.2 0 0 0-.46-.477q-.3-.18-.732-.179m.545 1.333a.8.8 0 0 1-.085.38.57.57 0 0 1-.238.241.8.8 0 0 1-.375.082H.788V12.48h.66q.327 0 .512.181.185.183.185.522m1.217-1.333v3.999h1.46q.602 0 .998-.237a1.45 1.45 0 0 0 .595-.689q.196-.45.196-1.084 0-.63-.196-1.075a1.43 1.43 0 0 0-.589-.68q-.396-.234-1.005-.234zm.791.645h.563q.371 0 .609.152a.9.9 0 0 1 .354.454q.118.302.118.753a2.3 2.3 0 0 1-.068.592 1.1 1.1 0 0 1-.196.422.8.8 0 0 1-.334.252 1.3 1.3 0 0 1-.483.082h-.563zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638z"/>
                    </svg> Save as Pdf
                </button>}
                {billCreationStatus && <button className="border-0 form-control mx-2 bg-success" style={{maxWidth: "140px"}} onClick={() => whatsappBill(true)} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                    </svg> Whatsapp
                </button>}
            </div>
        </div>}
    </div>
  );
}

export default billingArea;