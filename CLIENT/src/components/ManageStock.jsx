import React, { useState, useEffect , useCallback} from "react";
import moment from 'moment';
import { saveAs } from 'file-saver';
import toastr from 'toastr';
const token = sessionStorage.getItem('token');
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function ManageStock() {
    const [searchFilterType, setSearchFilterType] = useState("description");
    const [searchElement, setSearchElement] = useState("");
    const [listData, setListData] = useState([]);
    const [selectedData, setSelectedData] = useState([]);
    const [selectedItems, setSelectedItems] = useState({});
    const [modal, setModal] = useState(false);
    const [actionType, setActionType] = useState("");

    const searchFilter = async (value) => {
        setSearchElement(value)
        setListData([]);
        if(value){
            try {
                const response = await fetch(`${HOST}:${PORT}/server/stock-list`, {
                method: "GET",
                headers: { 'authorization': `Bearer ${token}`, "value": value, "manage": true, "filter": searchFilterType},
                });
        
                const result = await response.json();
                if (response.ok) {
                    let tempArr = [];
                    for(let i=0; i<result.docs.length; i++){
                        const ref = result.docs[i];
                        const matchedItem = selectedData.find((item)=>item._id == ref._id);
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

    const clearSearch = () => {
    setSearchElement("");
    setListData([]);
    };

    const handleSelect = (_id) => {
        setSelectedData((prevSelectedData) => {
            const isAlreadySelected = prevSelectedData.some((item) => item._id === _id);
            if (isAlreadySelected) {
                return prevSelectedData.filter((item) => item._id !== _id);
            } else {
                const matchedItem = listData.find((item) => item._id === _id);
                if (matchedItem) {
                    matchedItem.selected_quantity = matchedItem.quantity;
                    return [...prevSelectedData, matchedItem];
                }
            }
            return prevSelectedData;
        });

        setSelectedItems((prevSelectedItems) => ({
            ...prevSelectedItems,
            [_id]: !prevSelectedItems[_id]
        }));
    };

    const removeItem = (_id) => {
        setSelectedData((prevSelectedData) => prevSelectedData.filter(item => item._id !== _id));
        setSelectedItems((prevSelectedItems) => {
            const updatedItems = { ...prevSelectedItems };
            delete updatedItems[_id];
            return updatedItems;
        });
    };

    const clearSelectedData = () => {
        setSearchElement("");
        setSelectedData([]);
        setSelectedItems({});
        setListData([]);
    }

    const changeQuantity = (_id, value) => {
        const tempArr = selectedData.slice();
        for(let i=0; i<tempArr.length; i++){
            if(tempArr[i]._id == _id){
                if(value == 1 && tempArr[i].selected_quantity<tempArr[i].quantity){
                    tempArr[i].selected_quantity = Number(tempArr[i].selected_quantity)+1;
                } else if (value == -1 && tempArr[i].selected_quantity>1){
                    tempArr[i].selected_quantity = Number(tempArr[i].selected_quantity)-1;
                } else if (value == 0 && tempArr[i].selected_quantity>1 && tempArr[i].selected_quantity<tempArr[i].quantity){
                    tempArr[i].selected_quantity = Number(tempArr[i].selected_quantity);
                } else{
                    toastr.info("Please enter valid quantity.");
                }
            }
            setSelectedData(tempArr)
        }
    }

    const handleSubmit = (type) =>{
        if(type == "FINAL"){
            save()
        } else{
            setActionType(type)
            setModal(true);
        }
    }

    const setReason = (value, index)=>{
        selectedData[index].reason = value;
    }

    const save = async () =>{
        const finalData = {type: actionType, docs: []};
        for(let i=0; i<selectedData.length; i++){
            finalData.docs.push({_id: selectedData[i]._id, quantity: selectedData[i].selected_quantity, reason: selectedData[i].reason})
        }
        if (finalData.length<0){
            toastr.error("We are facing some problem in submission. Please try again with fresh entry.");
            return;
        }
        const response = await fetch(`${HOST}:${PORT}/server/manage-stock`, {
            method: "POST",
            body: JSON.stringify(finalData),
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`,
        }
        });
        if (response){
        const result = await response.json();
        if (response.ok && result.status){
            setModal(false)
            clearSelectedData()
            toastr.success("Stock updated successfully.");
        } else{
            toastr.error(result.msg);
        }
        } else{
        toastr.error("We are unable to process now. Please try again later.")
        }
    }

    const generateSellerInvoicePdf = useCallback(async () => {
      try {
        const finalData = [];
        for(let i=0; i<selectedData.length; i++){
            finalData.push({_id: selectedData[i]._id, quantity: selectedData[i].selected_quantity})
        }
        if (finalData.length<=0){
            toastr.error("We are facing some problem in submission. Please try again with fresh entry.");
            return;
        }
        // ids = JSON.stringify(ids);
        const response = await fetch(`${HOST}:${PORT}/server/generate-seller-invoice-pdf`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(finalData),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          toastr.error(errorData.msg || 'Failed to generate seller invoice');
          return;
        }
        const pdfBlob = await response.blob();
        if (pdfBlob.size > 100) {
          saveAs(pdfBlob, `seller_invoice.pdf`);
        } else {
          throw new Error('Received empty or invalid PDF');
        }
  
      } catch (error) {
        toastr.error(error.message || 'Failed to generate seller invoice PDF');
      }
    }, [selectedData, token, HOST, PORT]);

  return (
    <div className="container my-2">
        <div>
            <div className="row">
                <div className="col-2 my-3">
                    <select className="form-select" aria-label="Default select example" name="searchFilterType" value={searchFilterType} onChange={(e) => setSearchFilterType(e.target.value)}>
                        <option value="description">Description</option>
                        <option value="challan_no">Challan Number</option>
                        <option value="batch_no">Batch Number</option>
                        <option value="batch_id">Batch Id</option>
                    </select>
                </div>
                <div className="col-7 d-flex align-items-center justify-content-center">
                    <input autoComplete="off" value={searchElement} name="searchElement" onChange={(e) => searchFilter(e.target.value)} placeholder={"Search using item's " + searchFilterType} className="form-control my-3"/>
                    {searchElement && (
                        <span style={{cursor: "pointer", padding: "3px", background:"#ffffff", marginLeft: "-28px"}} onClick={clearSearch}> &#10006;</span>
                    )}
                </div>
                <div className="col-3 d-flex justify-content-center align-items-center">
                    <span data-tooltip="Clear selection." disabled={selectedData.length === 0} className={`title-class cursor-pointer text-center form-control m-2 bc-red-imp ${selectedData.length === 0 ? 'disabled-btn' : ''}`} onClick={() => clearSelectedData()} >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                            </span>
                    <span data-tooltip="Generate seller invoice." disabled={selectedData.length === 0} className={`title-class cursor-pointer text-center form-control m-2 bc-red-imp ${selectedData.length === 0 ? 'disabled-btn' : ''}`} onClick={() =>generateSellerInvoicePdf()}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-printer" viewBox="0 0 16 16">
                            <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                            <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1"/>
                        </svg>
                    </span>
                    <span data-tooltip="Remove the items from the stock." disabled={selectedData.length === 0} className={`title-class cursor-pointer text-center form-control m-2 bc-red-imp ${selectedData.length === 0 ? 'disabled-btn' : ''}`} onClick={() =>handleSubmit("CLEAR")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-octagon" viewBox="0 0 16 16">
                            <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1z"/>
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </span>
                    <span data-tooltip="Return the items." disabled={selectedData.length === 0} className={`title-class cursor-pointer text-center form-control m-2 bc-red-imp ${selectedData.length === 0 ? 'disabled-btn' : ''}`} onClick={() =>handleSubmit("RETURN")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5"/>
                        </svg>
                    </span>
                    <span data-tooltip="Mark as damage." disabled={selectedData.length === 0} className={`title-class cursor-pointer text-center form-control m-2 bc-red-imp ${selectedData.length === 0 ? 'disabled-btn' : ''}`}  onClick={() =>handleSubmit("DAMAGE")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-exclamation-triangle" viewBox="0 0 16 16">
                            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z"/>
                            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
                        </svg>
                    </span>
                </div>
            </div>
            {listData.length > 0 && (
            <div  style={{ border: "1px solid #ccc", padding: "5px", marginTop: "2px", maxHeight: "280px", overflowY: "auto", position: "absolute", background: "white", width: "79%" }}>
                <table className="text-center" style={{ width: "100%" , maxHeight: "250px"}}>
                    <tr>
                        <th>Select</th>
                        <th className="p-2 text-start">Entry Date</th>
                        <th className="p-2 text-start">Description</th>
                        <th className="p-2">Challan No</th>
                        <th className="p-2">Batch No</th>
                        <th className="p-2">Batch Id</th>
                        <th className="p-2">Seller</th>
                        <th className="p-2">Available</th>
                        <th className="p-2">Buy Price</th>
                    </tr>
                {listData.map((item, index) => (
                    // <tr title="Click to add into bill" onClick={() => handleSelect(item._id, "ITEM")} style={{ cursor: "pointer", borderTop: "1px solid #eee"}} className="" key={index}>
                    <tr key={index} style={{ cursor: "pointer", borderTop: "1px solid #eee" }}>
                        <td>
                            <input type="checkbox" checked={selectedItems[item._id] || false} onChange={() => handleSelect(item._id)}/>
                        </td>
                        <td className="p-2 text-start">{item.date} </td>
                        <td className="p-2 text-start">{item.description} </td>
                        <td className="p-2">{item.challan_no}</td>
                        <td className="p-2">{item.batch_no}</td>
                        <td className="p-2">{item.batch_id}</td>
                        <td className="p-2">{item.seller_name}</td>
                        <td className="p-2">{item.quantity}</td>
                        <td className="p-2">{item.item_buy_price}</td> 
                    </tr>
                    // <li key={index} onClick={() => handleSelect(item._id, "ITEM")} style={{ padding: "10px", cursor: "pointer", borderBottom: "1px solid #eee"}} className="d-flex justify-content-between"> <span> {item.description} [ Available: <span className="text-success bold">{item.quantity}</span>, Price: <span className="text-primary">{item.item_sell_price}</span>, Mfg date: {item.mfg_date}, Exp Date: {item.exp_date}, Warrantee/Guarantee Duration: {item.warrantee_guarantee_duration}]</span> <span className="d-flex"> </span></li>
                ))}
                </table>
                <div className="d-flex justify-content-end">
                    <button className="btn m-2" onClick={clearSearch}>Save</button>
                </div>
            </div>)}
            {(selectedData.length == 0) && <div className="text-center my-5">
                No item selected. Please select by searching in the above search box.
            </div>}
            {(selectedData.length > 0) && <div>
                <table className="table table-striped shadow-sm p-3 bg-body-tertiary rounded">
                        <tr className="text-center">
                            <th className="p-2 text-start">Entry Date</th>
                            <th className="p-2 text-start">Description</th>
                            <th className="p-2">Challan No</th>
                            <th className="p-2">Batch No</th>
                            <th className="p-2">Batch Id</th>
                            <th className="p-2">Buy Price</th>
                            <th className="p-2">Available</th>
                            <th className="p-2">Quantity</th>
                            <th className="p-2">Action</th>
                        </tr>
                        {selectedData.map((item, index) => (
                        <tr className="text-center">
                            <td className="p-2 text-start">{item.date} </td>
                            <td className="p-2 text-start">{item.description} </td>
                            <td className="p-2">{item.challan_no}</td>
                            <td className="p-2">{item.batch_no}</td>
                            <td className="p-2">{item.batch_id}</td>
                            <td className="p-2">{item.item_buy_price}</td> 
                            <td className="p-2">{item.quantity}</td>
                            <td className="p-2 d-flex justify-content-center align-items-center">
                                {/* <div style={{maxWidth: "100px"}} className="d-flex align-items-center justify-content-between">
                                    <div className="px-2 cursor-pointer" style={{backgroundColor: "#f2f2f2"}} onClick={() => changeQuantity(item._id, 0)}>-</div>
                                    <div className="px-2">
                                        {item.selected_quantity}
                                    </div>
                                    <div className="px-2 cursor-pointer" style={{backgroundColor: "#f2f2f2"}} onClick={() => changeQuantity(item._id, 1)}>+</div>
                                </div> */}
                                <div style={{maxWidth: "150px"}} className="d-flex align-items-center justify-content-between">
                                    <div className="px-2 cursor-pointer border d-flex align-items-center justify-content-center" style={{minHeight: "2.37rem", backgroundColor:" rgb(242, 242, 242)", borderRadius: "10px 0px 0px 10px"}} onClick={() => changeQuantity(item._id, -1)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle-dotted" viewBox="0 0 16 16">
                                        <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/>
                                      </svg>
                                    </div>
                                    <input style={{minWidth: "70px", borderRadius: "0"}} placeholder="Enter amount" value={item.selected_quantity} name="selected_quantity" type="number" className="form-control text-center" aria-describedby="emailHelp" onClick={() => changeQuantity(item._id, 0)}/>
                                    <div className="px-2 cursor-pointer border d-flex align-items-center justify-content-center" style={{minHeight: "2.37rem", backgroundColor:" rgb(242, 242, 242)", borderRadius: "0px 10px 10px 0px"}} onClick={() => changeQuantity(item._id, 1)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-dotted" viewBox="0 0 16 16">
                                        <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                      </svg>
                                    </div>
                                </div>
                            </td>
                            <td className="p-2"><span className="cursor-pointer" onClick={() => removeItem(item._id)} >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                </svg>
                            </span></td>
                        </tr>
                        ))}
                </table>
            </div>}
        </div>
        {modal && (
          <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Enter the reason/remark and save.</h5>
                  <button type="button" className="btn-close" onClick={() => setModal(false)}></button>
                </div>
                <div className="modal-body">
                  {selectedData.length>0 && <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Batch Id</th>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Reason/Remarks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedData.map((item, index)=>(
                      <tr>
                        <td>{item.batch_id}</td>
                        <td>{item.description}</td>
                        <td className="text-center">{item.selected_quantity}</td>
                        <td><input style={{minWidth: "40vw"}} className="form-control" type="text" autoComplete="off" name="reason" onChange={(e) => setReason(e.target.value, index)}/></td>
                      </tr>
                      ))}
                    </tbody>
                  </table>}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => handleSubmit("FINAL")}>Save</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
}

export default ManageStock;