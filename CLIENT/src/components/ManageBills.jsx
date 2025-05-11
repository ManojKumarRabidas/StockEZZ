import React, {useRef, useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { useCallback } from 'react';
import { saveAs } from 'file-saver';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import toastr from 'toastr';
const token = sessionStorage.getItem('token');
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function ManageBills() {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([]);
  const [userType, setUserType] = useState("");
  const [globalFilter, setGlobalFilter] = useState("");
  const [filters, setFilters] = useState({bill_type: "FRESH-AND-RE-CREATED"});
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState([]); // State to manage sorting
  const [detailsBillDiv, setDetailsBillDiv] = useState(false);
  const [billEditingStatus, setBillEditingStatus] = useState(false);
  const [detailsBill, setDetailsBill] = useState({});
  const [returnModal, setReturnModal] = useState(false);
  const [paymentModal, setPaymentModal] = useState(false);
  const [selectedData, setSelectedData] = useState({});
  const [returnStep1, setReturnStep1] = useState(true);
  const [newPaymentEntries, setNewPaymentEntries] = useState(
    {
      remaining_amount: "",
      payment_mode: "CASH",
      paid_amount: "",
      installation_status: "",
      info: "",
      prev_paid_amount: ""
    });
  const [newItem, setNewItem] = useState("");
  const [newItemList, setNewItemList] = useState([]);
  const [newSelectedItemList, setNewSelectedItemList] = useState([]);

  async function getData() {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/bill-list`, {
        method: "GET",
        headers: { 'authorization': `Bearer ${token}`, "bill_type": filters.bill_type },
      });

      const result = await response.json();
      if (response.ok) {
        console.log("result.doc", result.doc)
        setData(result.doc.bills);
        setUserType(result.doc.user_type);
      } else {
        toastr.error(result.msg);
      }
    } catch (err) {
      toastr.error("We are unable to process now. Please try again later.");
    }
  }

  useEffect(() => {
    changeFilter("FRESH-AND-RE-CREATED", "bill_type")
  }, []);

  const changeFilter = async (value, type) => {
    setLoading(true);
    if(type == "bill_type"){
      filters.bill_type = value;
      await getData();
    }
     setLoading(false);
  }

  const details = async (id) => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/bill-details/${id}`, {
        method: "GET",
        headers: { 'authorization': `Bearer ${token}`},
      });

      const result = await response.json();
      if (response.ok) {
        setDetailsBill(result.doc)
        setDetailsBillDiv(true)
        setBillEditingStatus(false)
      } else {
        toastr.error(result.msg);
      }
    } catch (err) {
      toastr.error("We are unable to process now. Please try again later.");
    }
  }

  const backToBillList = () => {
    getData();
    setDetailsBillDiv(false);
  }

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
  
  const managePaymentAndReturn = async(data, type) => {
    if (data) {
      setSelectedData({});
      if(type == "PAYMENT"){
        setPaymentModal(true);
      } else if (type == "RETURN"){
        setReturnStep1(true);
        data.all_items_checked = false;
        for(let i=0; i<data.items.length; i++){
          data.items[i].max_quantity = data.items[i].quantity;
          data.items[i].return_type = data.items[i].return_type? data.items[i].return_type: "RETURN";
        }
        setReturnModal(true)
      } else {
        toastr.error("Please select at least one item to proceed with payment.");
      }
      setSelectedData(data);
    } else {
      toastr.error("Please select at least one item to proceed with payment.");
    }
  }

  const handleInputChange = (e) => {
    setNewPaymentEntries((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  
  const handlePaymentSubmit = async () => {
    if (newPaymentEntries.paid_amount == "" ){
      toastr.error("There must be some 'Paying amount'");
      return;
    }
    newPaymentEntries.remaining_amount = selectedData.remaining_amount - newPaymentEntries.paid_amount;
    newPaymentEntries.expected_profit = selectedData.expected_profit;
    newPaymentEntries.prev_paid_amount = selectedData.paid_amount;
    if (selectedData._id == "" ){
      toastr.error("Missing id. Please try again later.");
      return;
    }
    try {
      const response = await fetch(`${HOST}:${PORT}/server/bill-update/${selectedData._id}`, {
        method: "PATCH",
        body: JSON.stringify(newPaymentEntries),
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          toastr.success("Bill details updated successfully.");
          getData()
          setPaymentModal(false);
        } else {
          toastr.error(result.msg);
        }
      } else {
        toastr.error("We are unable to process now. Please try again later.");
      }
    } catch (error) {
      toastr.error("We are unable to process now. Please try again later.");
    }
  }

  const handleSelect = (stock_id, type) => {
    const temp = {...selectedData}
    if(type && type=="ALL"){
      if(temp.all_items_checked){temp.all_items_checked=false}else{temp.all_items_checked=true}
    }
    for(let i=0; i<temp.items.length; i++){
      const ref = temp.items[i];
      if(type && type=="ALL"){
        if(!temp.all_items_checked){ref.checked=false}else{ref.checked=true}
      } else {
        if(ref.item.stock_id == stock_id){
          if(ref.checked){ref.checked=false}else{ref.checked=true}
          break;
        }
      }
    }
    setSelectedData(temp);
  }

  const changeQuantity = (index, type, value) => {
    const tempArr = {...selectedData};
    const ref = tempArr.items[index]
    if(type == 1 && ref.quantity<ref.max_quantity){
      tempArr.items[index].quantity = Number(tempArr.items[index].quantity)+1;
    } else if (type == -1 && tempArr.items[index].quantity>1){
      tempArr.items[index].quantity = Number(tempArr.items[index].quantity)-1;
    } else if (type == 0 && value>=1 && value<=tempArr.items[index].max_quantity){
      tempArr.items[index].quantity = Number(value);
    } else{
        toastr.info("Reached maximum/minimum quantity.");
    }
    setSelectedData(tempArr)
  }

  const changeReturnType = (index, value, step) => {
    const temp = {...selectedData};
    temp.items[index].return_type = value;
    setSelectedData(temp);
  };

  const searchItemsForExchange = async (value) => {
      if(value){
          try {
              const response = await fetch(`${HOST}:${PORT}/server/stock-list`, {
              method: "GET",
              headers: { 'authorization': `Bearer ${token}`, "value": value, "exchange": true, "filter": "description_key"},
              });
              const result = await response.json();
              if (response.ok) {
                  let itemQuantity = 0;
                  for(let i=0; i<result.docs.length; i++){
                      const ref = result.docs[i];
                      itemQuantity = itemQuantity+ref.quantity;
                  }
                  return itemQuantity;
              } else {
              toastr.error(result.msg);
              }
          } catch (err) {
              toastr.error("We are unable to process now. Please try again later.");
          }
      }
  }

  const handleReturnSubmit = async (step) => {
    if(step == "STEP1"){
      const temp = {...selectedData};
      for(let i=0; i<temp.items.length; i++){
        const ref = temp.items[i]
        if(ref.checked && ref.return_type == "EXCHANGE"){
          const avilibileQuantity = await searchItemsForExchange(temp.items[i].item.description_key)
          if (avilibileQuantity == 0){
            temp.items[i].avilibility_msg = "Exate same item is not available";
            temp.items[i].avilibility_status = false;
          } else if (avilibileQuantity >= temp.items[i].quantity){
            temp.items[i].avilibility_msg = `Available quantity: ${avilibileQuantity}`;
            temp.items[i].avilibility_status = true;
          } else {
            temp.items[i].avilibility_msg = `Available quantity: ${avilibileQuantity}`;
            temp.items[i].avilibility_status = false;
          }
        }
      }
      setSelectedData(temp)
      setReturnStep1(false);
      setNewSelectedItemList([]);
    } else if (step == "STEP2"){
      const returnItems = [];
      const newAddedItems = [];
      for(let i=0; i<selectedData.items.length; i++){
        const ref = selectedData.items[i];
        if (ref.checked == true){
          if(ref.return_type == "EXCHANGE" && ref.avilibility_status == false){
            toastr.error("Please select the item which is available in stock for exchange.");
            return;
          }
          returnItems.push({item_id: ref.item.stock_id, description_key: ref.item.description_key, quantity: ref.quantity, return_type: ref.return_type})
        }
      }
      for(let i=0; i<newSelectedItemList.length; i++){
        const ref = newSelectedItemList[i];
        newAddedItems.push({item_id: ref._id, quantity: ref.quantity, buy_price: ref.item_buy_price, sell_price: ref.item_sell_price})
      }
      if(selectedData._id && (returnItems.length>0 || newAddedItems.length>0)){
        const finalDoc = {
          bill_id: selectedData._id,
          returnItems: returnItems,
          newAddedItems: newAddedItems,
        }
        try {
          const response = await fetch(`${HOST}:${PORT}/server/bill-recreate`, {
            method: "POST",
            body: JSON.stringify(finalDoc),
            headers: {
              'Content-Type': 'application/json',
              'authorization': `Bearer ${token}`,
            },
          });
    
          if (response) {
            const result = await response.json();
            if (response.ok) {
              toastr.success("Bill details updated successfully.");
              setReturnModal(false);
              getData();
            } else {
              toastr.error(result.msg);
            }
          } else {
            toastr.error("We are unable to process now. Please try again later.");
          }
        } catch (error) {
          toastr.error("We are unable to process now. Please try again later.");
        }
      } else{
        toastr.error("We are unable to process now. Please try again later.");
      }
    }
  }

  const searchNewItems = async (value) => {
    setNewItem(value)
    setNewItemList([]);
    if(value && value.trim().length > 0){
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
                    const matchedItem = newSelectedItemList.find((item)=>item._id == ref._id);
                    if(!matchedItem){
                        tempArr.push(ref)
                    }
                }
                setNewItemList(tempArr);
            } else {
            toastr.error(result.msg);
            }
        } catch (err) {
            toastr.error("We are unable to process now. Please try again later.");
        }
    }
  }

  const addNewItem = (_id, index) => {
    const matchedItem = newItemList[index];
    if(matchedItem){
      matchedItem.total_quantity = matchedItem.quantity;
      matchedItem.total_item_sell_price = matchedItem.item_sell_price;
      matchedItem.quantity = 1;
      const ref = [...newSelectedItemList]
      ref.push(matchedItem);
      setNewSelectedItemList(ref)
      setNewItemList([]);
      setNewItem("")
      inputRef.current.focus();
    }
  }

  const removeItem = (index) =>{
    const tempArr = [...newSelectedItemList]
    tempArr.splice(index, 1);
    setNewSelectedItemList(tempArr)
  }
  
  const changeNewItemQuantity = (index, type, value) => {
    const tempArr = [...newSelectedItemList];
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
    tempArr[index].total_item_sell_price = Number(tempArr[index].quantity)*Number(tempArr[index].item_sell_price);
    setNewSelectedItemList(tempArr)
  }
  // Define table columns with proper accessorKeys
  const columns = useMemo(
    () => [
      {
        header: "Sl No",
        accessorFn: (row, i) => i + 1 + pageIndex * pageSize,
        id: "slNo",
        enableSorting: false,
      },
      {
        header: "Bill Type",
        accessorKey: "bill_type",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Date",
        accessorKey: "date",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Bill No",
        accessorKey: "bill_no",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Buyer Name",
        accessorKey: "buyer_name",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Paid Amount",
        accessorKey: "paid_amount",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Remaining Amount",
        accessorKey: "remaining_amount",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Installation",
        accessorKey: "installation_status",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
    
      {
        header: "Info",
        accessorKey: "info",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
    
      {
        header: "Actions",
        id: "action",
        enableSorting: false,
        headerClassName: "ei-text-center-imp",
        cell: ({ row }) => (
          <div className="text-center py-2">
            {(row.original.bill_type)!="CANCELLED" && (userType == "OPERATOR") && <span onClick={() => managePaymentAndReturn(row.original, "PAYMENT")} className="p-2 mx-1 cursor-pointer rounded" style={{background: "white", border: "2px solid #f2f2f2"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cash" viewBox="0 0 16 16">
                <path d="M8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
                <path d="M0 4a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1zm3 0a2 2 0 0 1-2 2v4a2 2 0 0 1 2 2h10a2 2 0 0 1 2-2V6a2 2 0 0 1-2-2z"/>
              </svg>
            </span> }
            {(row.original.bill_type)!="CANCELLED" && (userType == "OPERATOR") && <span onClick={() => managePaymentAndReturn(row.original, "RETURN")} className="p-2 mx-1 cursor-pointer rounded" style={{background: "white", border: "2px solid #f2f2f2"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-return-left" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5"/>
              </svg>
            </span>}
            <span onClick={() => details(row.original._id)} className="p-2 mx-1 cursor-pointer rounded" style={{background: "white", border: "2px solid #f2f2f2"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
              </svg>
            </span>
            {(userType == "OPERATOR") && <span onClick={() => generateBillPdf(row.original._id)} className="p-2 mx-1 cursor-pointer rounded" style={{background: "white", border: "2px solid #f2f2f2"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-file-earmark-arrow-down" viewBox="0 0 16 16">
                <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z"/>
                <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z"/>
              </svg>
            </span>}
            {/* <button type="button" className="btn btn-outline-light" style={{ color: "blue", backgroundColor: "ghostwhite" }} onClick={() => details(row.original._id)} >Details </button> */}
          </div>
        ),
      },
    ],
    [ pageIndex, pageSize, userType] // Include pageIndex and pageSize as dependencies
  );

  // Apply global filtering before pagination
  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    return data.filter((row) => {
      const lowercasedFilter = globalFilter.toLowerCase();
      return (
        row.bill_no?.toString().toLowerCase().includes(lowercasedFilter) ||
        row.buyer_name?.toString().toLowerCase().includes(lowercasedFilter) ||
        row.payment_mode?.toLowerCase().includes(lowercasedFilter) ||
        row.info?.toString().toLowerCase().includes(lowercasedFilter) ||
        row.installation_status?.toString().toLowerCase().includes(lowercasedFilter)
      );
    });
  }, [data, globalFilter]);

  // Apply sorting before pagination
  const sortedData = useMemo(() => {
    if (!sorting.length) return filteredData;
    const [{ id, desc }] = sorting;
    return [...filteredData].sort((a, b) => {
      const aValue = a[id];
      const bValue = b[id];
      if (aValue === bValue) return 0;
      if (desc) {
        return aValue > bValue ? -1 : 1;
      } else {
        return aValue > bValue ? 1 : -1;
      }
    });
  }, [filteredData, sorting]);

  // Apply pagination after sorting
  const paginatedData = useMemo(() => {
    const startRow = pageIndex * pageSize;
    const endRow = startRow + pageSize;
    return sortedData.slice(startRow, endRow);
  }, [sortedData, pageIndex, pageSize]);

  const table = useReactTable({
    data: paginatedData,
    columns,
    pageCount: Math.ceil(filteredData.length / pageSize),
    state: {
      globalFilter,
      pagination: {
        pageIndex,
        pageSize,
      },
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: (updater) => {
      const newState =
        typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
      setPageIndex(newState.pageIndex);
      setPageSize(newState.pageSize);
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
  });

  return (
    <div className="container my-2">
      {!detailsBillDiv && <div>
        <div className="row">
          <div className="col-9">
            <input value={globalFilter || ""} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search by any field of table..." className="form-control my-3"/>
          </div>
          <div className="col-3 d-flex align-items-center">
            <label className="form-label me-2 text-nowrap">Bill Type :</label>
            <select className="form-select" aria-label="Default select example" name="bill_type" value={filters.bill_type} onChange={(e) => changeFilter(e.target.value, "bill_type")}>
                <option value="FRESH-AND-RE-CREATED">Fresh & Re-Created</option>
                <option value="FRESH">Only Fresh</option>
                <option value="RE-CREATED">Only Re-Created</option>
                <option value="CANCELLED">Only Cancelled</option>
                <option value="ALL">All Bills</option>
            </select> 
          </div>
        </div>
        {loading && 
        <div className="container my-2 d-flex justify-content-center align-items-center" style={{height: "100%"}}>
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
        }
        {!loading && data && data.length>0 && <>   
          <div className="scroll-hidden">
            <table className="table table-striped shadow-sm p-3 bg-body-tertiary rounded" style={{ fontSize: "smaller", margin: "0" }}>
              <thead style={{textWrap: "nowrap"}}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id} className="text-center">
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} onClick={header.column.getToggleSortingHandler()} className={header.column.columnDef.headerClassName} >
                        {flexRender(header.column.columnDef.header,header.getContext())}{{asc: " 🔼", desc: " 🔽", }[header.column.getIsSorted()] ?? null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="text-center">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                    ))}
                  </tr>
                ))}
                {table.getRowModel().rows.length === 0 && (
                  <tr>
                    <td colSpan="11" className="text-center">No data available </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="d-flex justify-content-between my-3">
            <select className="form-select mx-2" style={{maxWidth: "fit-content"}}  value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} >
              {[5, 10, 15, 20, 25, 30].map((size) => (
                <option key={size} value={size}> Show {size} </option>
              ))}
            </select>
            <span className="text-nowrap mx-2 text-center">
              Page{" "}
              <strong> {pageIndex + 1} of {table.getPageCount()} </strong>
            </span>
            <div className="btn-group mx-2">
              <span className="btn btn-secondary " onClick={() => table.previousPage()}disabled={!table.getCanPreviousPage()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                  <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                </svg>
              </span>
              <span className="btn btn-secondary" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708"/>
                  <path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708"/>
                </svg>
              </span>
              </div>
          </div>
        </>}
      </div>}
      {!loading && data.length<=0 && <div className="d-flex flex-column justify-content-center align-items-center text-center"  style={{minHeight: "87vh"}}> <div> No bills available. <br /> Generate bill from 'Billing Area' to see bills here.</div></div> }
      {detailsBillDiv &&<div>
            <div className="text-center bg-body-tertiary p-3">
                {(detailsBill.items.length > 0) && <div className="mt-3">
                    <table className="table table-striped p-3 rounded">
                            <tr className="text-center">
                                <th className="p-2 text-start">Description</th>
                                <th className="p-2">Quantity</th>
                                <th className="p-2 text-end">Price</th>
                                <th className="p-2 text-end">Total Price</th>
                            </tr>
                            {detailsBill.items.map((item, index) => (
                            <tr className="text-center">
                                <td className="p-2 text-start">{item.item.description}</td>
                                <td className="p-2">{item.quantity}</td>
                                <td className="p-2 text-end"> {item.sell_price}</td>
                                <td className="p-2 text-end"> {item.sell_price * item.quantity}</td>
                            </tr>
                            ))}
                            <tr className="border"></tr>
                            <tr >
                                <td></td>
                                <td></td>
                                <th className="p-1 text-end"> Total : </th>
                                <td className="text-end p-1">{detailsBill.total}</td>
                            </tr>
                            <tr >
                                <td></td>
                                <td></td>
                                <th className="p-1 text-end"> GST : </th>
                                <td className="text-end p-1">00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <th className="p-1 text-end">Ad. Charges : </th>
                                <td className="text-end p-1">{detailsBill.additional_charges}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <th className="p-1 text-end">Discount : </th>
                                <td className="text-end p-1">{detailsBill.discount}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <th className="p-1 text-end">Grand Total : </th>
                                <td className="text-end p-1">{detailsBill.grand_total}</td>
                            </tr>
                    </table>
                </div>}
                <div className="row my-2">
                    <div className="col d-flex flex-row align-items-center flex-nowrap">
                        <label className="form-label me-2 text-nowrap">Paid amount : {detailsBill.paid_amount}</label>
                    </div>
                    <div className="col d-flex flex-row align-items-center flex-nowrap">
                        <label className="form-label me-2 text-nowrap">Remaining amount : {detailsBill.remaining_amount}</label>
                    </div>
                    <div className="col d-flex flex-row align-items-center flex-nowrap">
                      <label className="form-label me-2 text-nowrap">Installation : {detailsBill.installation_status}</label>
                    </div>
                </div>
                <div className="p-3 mb-3" style={{background: "white"}}>
                  <h5>Installment details</h5>
                  <hr />
                  {detailsBill.payments.map((item)=>(
                    <div className="row my-2">
                      <div className="col d-flex flex-row align-items-center flex-nowrap">
                      <label className="form-label me-2 text-nowrap">Date: {item.billed_at}</label>
                      </div>
                      <div className="col d-flex flex-row align-items-center flex-nowrap">
                          <label className="form-label me-2 text-nowrap">Payment Mode : {item.payment_mode}</label>
                      </div>
                      <div className="col d-flex flex-row align-items-center flex-nowrap">
                          <label className="form-label me-2 text-nowrap">Paid Amount : {item.paid_amount}</label>
                      </div>
                      <div className="col d-flex flex-row align-items-center flex-nowrap">
                          <label className="form-label me-2 text-nowrap">Info : {item.info}</label>
                      </div>
                    </div>
                  ))}
                </div>
                <h5>Buyer Details</h5>
                <hr />
                {detailsBill.buyer!=null? 
                <div>
                  <div className="row text-start my-2">
                      <div className="col">
                        <label className="form-label me-2 text-nowrap"> Phone : {detailsBill.buyer.phone}</label>
                      </div>
                      <div className="col">
                        <label className="form-label me-2 text-nowrap"> Name : {detailsBill.buyer.name}</label>
                      </div>
                      <div className="col">
                        <label className="form-label me-2 text-nowrap"> Aadhar : {detailsBill.buyer.aadhar}</label>
                      </div>
                  </div>
                  <div className="row my-2 text-start">
                      <div className="col">
                        <label className="form-label me-2 text-nowrap"> Email : {detailsBill.buyer.email}</label>
                      </div>
                      <div className="col">
                        <label className="form-label me-2 text-nowrap"> Pin : {detailsBill.buyer.pin}</label>
                      </div>
                      <div className="col">
                        <label className="form-label me-2 text-nowrap"> Address : {detailsBill.buyer.address}</label>
                      </div>
                  </div>
                </div> : "Not Available"}
            </div>
            <div className="d-flex justify-content-end mt-3 mb-5">
                <button className="form-control mx-2 bg-primary border-0" style={{maxWidth: "100px"}} onClick={() => backToBillList()} >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-skip-backward-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    <path d="M11.729 5.055a.5.5 0 0 0-.52.038L8.5 7.028V5.5a.5.5 0 0 0-.79-.407L5 7.028V5.5a.5.5 0 0 0-1 0v5a.5.5 0 0 0 1 0V8.972l2.71 1.935a.5.5 0 0 0 .79-.407V8.972l2.71 1.935A.5.5 0 0 0 12 10.5v-5a.5.5 0 0 0-.271-.445"/>
                  </svg> Back
                </button>
                { (detailsBill.userType == "OPERATOR") && <button className="form-control mx-2 bg-info border-0" style={{maxWidth: "140px"}} onClick={() => generateBillPdf(detailsBill._id)} >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-filetype-pdf" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5zM1.6 11.85H0v3.999h.791v-1.342h.803q.43 0 .732-.173.305-.175.463-.474a1.4 1.4 0 0 0 .161-.677q0-.375-.158-.677a1.2 1.2 0 0 0-.46-.477q-.3-.18-.732-.179m.545 1.333a.8.8 0 0 1-.085.38.57.57 0 0 1-.238.241.8.8 0 0 1-.375.082H.788V12.48h.66q.327 0 .512.181.185.183.185.522m1.217-1.333v3.999h1.46q.602 0 .998-.237a1.45 1.45 0 0 0 .595-.689q.196-.45.196-1.084 0-.63-.196-1.075a1.43 1.43 0 0 0-.589-.68q-.396-.234-1.005-.234zm.791.645h.563q.371 0 .609.152a.9.9 0 0 1 .354.454q.118.302.118.753a2.3 2.3 0 0 1-.068.592 1.1 1.1 0 0 1-.196.422.8.8 0 0 1-.334.252 1.3 1.3 0 0 1-.483.082h-.563zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638z"/>
                  </svg> Save as Pdf
                </button>}
                {(detailsBill.userType == "OPERATOR") && <button className="form-control mx-2 bg-secondary border-0" style={{maxWidth: "130px"}} onClick={() => generateBillPdf(detailsBill._id)} >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">
                    <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"/>
                    <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1"/>
                  </svg> Print
                </button>}
                {(detailsBill.userType == "OPERATOR") && <button className="form-control mx-2 bg-success border-0" style={{maxWidth: "130px"}} onClick={() => whatsappBill(true)} >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-whatsapp" viewBox="0 0 16 16">
                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232"/>
                  </svg> Whatsapp
                </button>}
            </div>
      </div>}
      {returnModal && (
        <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            {returnStep1 && <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Manage returns for bill number : {selectedData.bill_no}</h5>
                <button type="button" className="btn-close" onClick={() => setReturnModal(false)}></button>
              </div>
              <div className="modal-body">
              {selectedData && <div>
                  <table className="table table-striped">
                    <tbody>
                      <tr>
                        <th className="px-4">Date: </th>
                        <td className="px-4">{selectedData.date}</td>
                        <th className="px-4">Buyer Name: </th>
                        <td className="px-4">{selectedData.buyer_name}</td>
                      </tr>
                      <tr>
                        <th className="px-4">Bill No: </th>
                        <td className="px-4">{selectedData.bill_no}</td>
                        <th className="px-4">Info: </th>
                        <td className="px-4">{selectedData.info}</td>
                      </tr>
                      <tr>
                        <th className="px-4">Total: </th>
                        <td className="px-4">{selectedData.total}</td>
                        <th className="px-4">Grand Total: </th>
                        <td className="px-4">{selectedData.grand_total}</td>
                      </tr>
                      <tr>
                        <th className="px-4">Paid Amount: </th>
                        <td className="px-4">{selectedData.paid_amount}</td>
                        <th className="px-4">Remaining Amount: </th>
                        <td className="px-4">{selectedData.remaining_amount}</td>
                      </tr>
                    </tbody>
                  </table>
                  <hr />
                   Select the items and set the quantity you want to return/excgange.
                  <table className="mt-2 table table-striped">
                    <tbody>
                        <tr>
                          <th>
                            <input style={{minHeight: "1.1rem", minWidth: "1.1rem"}} type="checkbox" checked={selectedData.all_items_checked || false} onChange={() => handleSelect("", "ALL")}/>
                          </th>
                          <th className="px-4">Item Description</th>
                          <th className="px-4 text-center">Quantity </th>
                          <th className="px-4 text-end">Price </th>
                          <th className="px-4 text-end">Total </th>
                          <th className="px-4 text-center">Return Quantity </th>
                          <th className="px-4">Return Type </th>
                        </tr>
                      {selectedData.items.map((item, index)=>(
                        <tr>
                          <td>
                          <input style={{minHeight: "1.1rem", minWidth: "1.1rem"}} type="checkbox" checked={item.checked || false} onChange={() => handleSelect(item.item.stock_id, "SINGLE")}/>
                          </td>
                          <td className="px-4">{item.item.description}</td>
                          <td className="px-4 text-center">{item.max_quantity}</td>
                          <td className="px-4 text-end">{item.sell_price}</td>
                          <td className="px-4 text-end">{item.sell_price*item.max_quantity}</td>
                          <td className="px-4 d-flex justify-content-center align-items-center">
                                <div style={{maxWidth: "150px"}} className="d-flex align-items-center justify-content-between">
                                    <button className="btn btn-light px-2 cursor-pointer border d-flex align-items-center justify-content-center" style={{minHeight: "2.37rem", background: " rgb(242, 242, 242) !important", color:"black !important", borderRadius: "10px 0px 0px 10px"}} onClick={() => changeQuantity(index, -1)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle-dotted" viewBox="0 0 16 16">
                                        <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/>
                                      </svg>
                                    </button>
                                    <input style={{minWidth: "70px", borderRadius: "0"}} placeholder="Enter amount" defaultValue={item.max_quantity} value={item.quantity} name="updated_quantity" type="number" className="form-control text-center" aria-describedby="emailHelp" onChange={(e) => changeQuantity(index, 0, e.target.value)} />
                                    <button className="btn btn-light px-2 cursor-pointer border d-flex align-items-center justify-content-center" style={{minHeight: "2.37rem", background: " rgb(242, 242, 242) !important", color:"black !important", borderRadius: "0px 10px 10px 0px"}} onClick={() => changeQuantity(index, 1)}>
                                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-dotted" viewBox="0 0 16 16">
                                        <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                      </svg>
                                    </button>
                                </div>
                          </td>
                          <td className="text-center">
                            {item.checked ?
                            <select className="form-select" aria-label="Default select example" value={item.return_type ? item.return_type: "RETURN"} name="return_type"  onChange={(e)=>changeReturnType(index, e.target.value, "STEP1")} >
                              <option value="RETURN">Return</option>
                              {/* <option value="EXCHANGE">Exchange</option> */}
                            </select> : 
                            <span>Not Applicable</span>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                </div> }
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary border-0 bg-danger" onClick={() => setReturnModal(false)}>Cancel</button>
                <button type="button" className="btn btn-secondary border-0 bg-success" onClick={() => handleReturnSubmit("STEP1")}>Next</button>
              </div>
            </div>}
            {!returnStep1 && <div className="modal-content">
              <div className="modal-header">
              <h5 className="modal-title">Manage returns for bill number : {selectedData.bill_no}</h5>
                <button type="button" className="btn-close" onClick={() => setReturnModal(false)}></button>
              </div>
              <div className="modal-body">
              {selectedData && <div>
                  <table className="mt-2 table table-striped">
                    <tbody>
                        <tr>
                          <th className="px-4">Item Description</th>
                          <th className="px-4 text-center">Price X Quantity </th>
                          {/* <th className="px-4 text-end">Price </th> */}
                          {/* <th className="px-4 text-end">Total </th> */}
                          <th className="px-4 text-center">Return Type </th>
                          {/* <th className="px-4">Exchange Item </th> */}
                        </tr>
                      {selectedData.items.filter(item => item.checked).map((item, index) => (
                        
                        <tr key={index}>
                          <td className="px-4" style={{background: ((item.avilibility_status==false && item.return_type=="EXCHANGE")?"#ff000026":"white")}}>
                            <div className="d-flex flex-column">
                              <span>{item.item.description}</span>
                              {/* {item.return_type == "EXCHANGE" && <span className="ei-col-red bold" style={{fontSize: "small", fontWeight: "bold"}}>{item.avilibility_msg}</span>} */}
                              {item.return_type == "EXCHANGE" && <span className={"bold " + (item.avilibility_status ? "text-success": "text-danger")} style={{fontSize: "small", fontWeight: "bold"}}>
                                {item.avilibility_msg } {item.avilibility_status?
                                  <span className="title-class" data-tooltip="The selected quantity will be returned in the stock record.">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                    </svg>
                                  </span>: 
                                  <span className="title-class title-class-wrap" data-tooltip="As enough quantity is not available in stock, please set the return type as 'Return' and add new items from the below item adding input box, Or click on 'Back' and change the quantity.">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-info-circle" viewBox="0 0 16 16">
                                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                      <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/>
                                    </svg>
                                  </span>} 
                            </span>}
                            </div>
                          </td>
                          <td style={{background: ((item.avilibility_status==false && item.return_type=="EXCHANGE")?"#ff000026":"white")}} className="px-4 text-center">{item.sell_price} X {item.quantity} = {item.sell_price*item.quantity}</td>
                          {/* <td className="px-4 text-center">{item.quantity}</td> */}
                          {/* <td className="px-4 text-end">{item.sell_price}</td> */}
                          {/* <td className="px-4 text-end">{item.sell_price*item.quantity}</td> */}
                          {/* <td className="text-center">
                            {item.return_type}
                          </td> */}
                          <td style={{background: ((item.avilibility_status==false && item.return_type=="EXCHANGE")?"#ff000026":"white")}} className="text-center">
                            {item.return_type == "EXCHANGE"? 
                            <select className="form-select" value={item.return_type} aria-label="Default select example" name="return_type"  onChange={(e)=>changeReturnType(index, e.target.value, "STEP2")} >
                              <option value="RETURN">Return</option>
                              <option value="EXCHANGE">Exchange</option>
                            </select> :
                            <span>{item.return_type}</span>}
                          </td>
                          {/* <td>
                          {item.return_type == "EXCHANGE"? 
                            <input style={{minWidth: "500px"}} placeholder="Search replacement item if required" value={item.new_item} name="new_item" type="number" className="form-control" aria-describedby="emailHelp" onChange={(e) => changeQuantity(index, 0, e.target.value)} />
                          :
                          <span>Not applicable for return</span>}
                            </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="border">
                    <div className="p-2 my-2">
                      <input ref={inputRef} autoComplete="off" style={{minWidth: "500px"}} placeholder="Search and add new item if required." value={newItem} name="newItem" type="text" className="form-control my-2" aria-describedby="emailHelp" onChange={(e) => searchNewItems(e.target.value)} />
                      {/* <datalist id="new_item_list">
                        {newItemList.map((item, index)=>(
                          <option value={item.description_key} label={item.description}>{item.description}</option>
                        ))}
                      </datalist> */}
                      {newItemList.length > 0 && (
                          <table className="text-center" style={{ border: "1px solid #ccc", padding: "5px", marginTop: "2px", maxHeight: "250px", overflowY: "auto", position: "absolute", background: "white", width: "120%", marginLeft: "-80px" }}>
                              <tr>
                                  <th className="p-2 text-start">Description</th>
                                  <th className="p-2">Batch Id</th>
                                  <th className="p-2">Batch no</th>
                                  <th className="p-2">Available</th>
                                  <th className="p-2">Price</th>
                              </tr>
                          {newItemList.map((item, index) => (
                              <tr title="Click to add into bill" onClick={() => addNewItem(item._id, index)} style={{ cursor: "pointer", borderTop: "1px solid #eee"}} className="" key={index}>
                                  <td className="p-2 text-start">{item.description} </td>
                                  <td className="p-2">{item.batch_id}</td>
                                  <td className="p-2">{item.batch_no}</td>
                                  <td className="p-2">{item.quantity}</td>
                                  <td className="p-2">{item.item_sell_price}</td> 
                              </tr>
                          ))}
                      </table>)}
                    </div>
                    {newSelectedItemList.length>0 && <table className="table table-striped text-center">
                      <thead>
                        <tr>
                          <th className="px-4 text-start">Description</th>
                          <th className="px-4">Price</th>
                          <th className="px-4">Quantity</th>
                          <th className="px-4">Total</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newSelectedItemList.map((item, index)=>(
                          <tr>
                            <td className="px-4 text-start">{item.description}</td>
                            <td className="px-4">{item.item_sell_price}</td>
                            {/* <td className="px-4">{item.quantity}</td> */}

                            <td className="px-4 d-flex justify-content-center align-items-center">
                                  <div style={{maxWidth: "150px"}} className="d-flex align-items-center justify-content-between">
                                      <button className="btn btn-light px-2 cursor-pointer border d-flex align-items-center justify-content-center" style={{minHeight: "2.37rem", background: " rgb(242, 242, 242) !important", color:"black !important", borderRadius: "10px 0px 0px 10px"}} onClick={() => changeNewItemQuantity(index, -1)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-circle-dotted" viewBox="0 0 16 16">
                                          <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1z"/>
                                        </svg>
                                      </button>
                                      <input style={{minWidth: "70px", borderRadius: "0"}} placeholder="Enter amount" defaultValue={item.quantity} value={item.quantity} name="updated_quantity" type="number" className="form-control text-center" aria-describedby="emailHelp" onChange={(e) => changeNewItemQuantity(index, 0, e.target.value)} />
                                      <button className="btn btn-light px-2 cursor-pointer border d-flex align-items-center justify-content-center" style={{minHeight: "2.37rem", background: " rgb(242, 242, 242) !important", color:"black !important", borderRadius: "0px 10px 10px 0px"}} onClick={() => changeNewItemQuantity(index, 1)}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-dotted" viewBox="0 0 16 16">
                                          <path d="M8 0q-.264 0-.523.017l.064.998a7 7 0 0 1 .918 0l.064-.998A8 8 0 0 0 8 0M6.44.152q-.52.104-1.012.27l.321.948q.43-.147.884-.237L6.44.153zm4.132.271a8 8 0 0 0-1.011-.27l-.194.98q.453.09.884.237zm1.873.925a8 8 0 0 0-.906-.524l-.443.896q.413.205.793.459zM4.46.824q-.471.233-.905.524l.556.83a7 7 0 0 1 .793-.458zM2.725 1.985q-.394.346-.74.74l.752.66q.303-.345.648-.648zm11.29.74a8 8 0 0 0-.74-.74l-.66.752q.346.303.648.648zm1.161 1.735a8 8 0 0 0-.524-.905l-.83.556q.254.38.458.793l.896-.443zM1.348 3.555q-.292.433-.524.906l.896.443q.205-.413.459-.793zM.423 5.428a8 8 0 0 0-.27 1.011l.98.194q.09-.453.237-.884zM15.848 6.44a8 8 0 0 0-.27-1.012l-.948.321q.147.43.237.884zM.017 7.477a8 8 0 0 0 0 1.046l.998-.064a7 7 0 0 1 0-.918zM16 8a8 8 0 0 0-.017-.523l-.998.064a7 7 0 0 1 0 .918l.998.064A8 8 0 0 0 16 8M.152 9.56q.104.52.27 1.012l.948-.321a7 7 0 0 1-.237-.884l-.98.194zm15.425 1.012q.168-.493.27-1.011l-.98-.194q-.09.453-.237.884zM.824 11.54a8 8 0 0 0 .524.905l.83-.556a7 7 0 0 1-.458-.793zm13.828.905q.292-.434.524-.906l-.896-.443q-.205.413-.459.793zm-12.667.83q.346.394.74.74l.66-.752a7 7 0 0 1-.648-.648zm11.29.74q.394-.346.74-.74l-.752-.66q-.302.346-.648.648zm-1.735 1.161q.471-.233.905-.524l-.556-.83a7 7 0 0 1-.793.458zm-7.985-.524q.434.292.906.524l.443-.896a7 7 0 0 1-.793-.459zm1.873.925q.493.168 1.011.27l.194-.98a7 7 0 0 1-.884-.237zm4.132.271a8 8 0 0 0 1.012-.27l-.321-.948a7 7 0 0 1-.884.237l.194.98zm-2.083.135a8 8 0 0 0 1.046 0l-.064-.998a7 7 0 0 1-.918 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z"/>
                                        </svg>
                                      </button>
                                  </div>
                            </td>

                            <td className="px-4">{item.total_item_sell_price}</td>
                                  <td>
                                    <span className="cursor-pointer" onClick={() => removeItem(index)} >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                        </svg>
                                    </span> 
                                  </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>}
                  </div>
                </div> }
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary bg-info border-0" onClick={() => setReturnStep1(true)}>Back</button>
                <button type="button" className="btn btn-secondary bg-danger border-0" onClick={() => setReturnModal(false)}>Cancel</button>
                <button type="button" className="btn btn-secondary bg-success border-0" onClick={() => handleReturnSubmit("STEP2")}>Save</button>
              </div>
            </div>}
          </div>
        </div>
      )}
      {paymentModal && (
        <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Payment details.</h5>
                <button type="button" className="btn-close" onClick={() => setPaymentModal(false)}></button>
              </div>
              <div className="modal-body">
                {selectedData && 
                <div>
                  <table className="border table table-striped">
                    <tbody>
                      <tr>
                        <th className="px-4">Date: </th>
                        <td className="px-4">{selectedData.date}</td>
                        <th className="px-4">Buyer Name: </th>
                        <td className="px-4">{selectedData.buyer_name}</td>
                        <th className="px-4">Buyer Phone: </th>
                        <td className="px-4">{selectedData.buyer_phone}</td>
                      </tr>
                      <tr>
                        <th className="px-4">Bill No: </th>
                        <td className="px-4">{selectedData.bill_no}</td>
                        <th className="px-4">Info: </th>
                        <td className="px-4">{selectedData.info}</td>
                        <th className="px-4">Total: </th>
                        <td className="px-4">{selectedData.total}</td>
                      </tr>
                      <tr>
                        <th className="px-4">GST: </th>
                        <td className="px-4">00</td>
                        <th className="px-4">Discount: </th>
                        <td className="px-4">{selectedData.discount}</td>
                        <th className="px-4">Additional Charges: </th>
                        <td className="px-4">{selectedData.additional_charges}</td>
                      </tr>
                      <tr>
                        <th className="px-4">Grand Total: </th>
                        <td className="px-4">{selectedData.grand_total}</td>
                        <th className="px-4">Paid Amount: </th>
                        <td className="px-4">{selectedData.paid_amount}</td>
                        <th className="px-4">Remaining Amount: </th>
                        <td className="px-4">{selectedData.remaining_amount}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="border">
                    <div className="text-center"><strong>Installment details</strong></div> 
                    <table className="mt-1 mb-0 table table-striped">
                      <tbody>
                        <tr>
                          <th>Date</th>
                          <th>Paid Amount</th>
                          <th>Payment Mode</th>
                          <th>Info</th>
                        </tr>
                      {selectedData.payments.map((item)=>(
                        <tr>
                          <td>{item.billed_at}</td>
                          <td>{item.paid_amount}</td>
                          <td>{item.payment_mode}</td>
                          <td>{item.info}</td>
                        </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
                  {selectedData.remaining_amount!=0 && 
                  <div className="border mt-3">
                    <div className="text-center"><strong>New Payments</strong></div>
                    <form action="#">
                      <div className="row my-3">
                        <div className="col d-flex align-items-center text-nowrap">
                          <label className="form-label mx-3">Payment Type: </label>
                          <select className="form-select" aria-label="Default select example" name="payment_mode" onChange={handleInputChange}>
                            <option value="CASH">Cash</option>
                            <option value="UPI">UPI</option>
                            <option value="BANKTRANSFER">Bank Transfer</option>
                          </select>
                        </div>
                        <div className="col d-flex align-items-center text-nowrap">
                          <label className="form-label mx-3">Paying Amount: </label>
                          <input placeholder="Enter amount" name="paid_amount" type="number" className="form-control" aria-describedby="emailHelp"  onChange={handleInputChange}/>
                        </div>
                      </div>
                      <div className="row my-3">
                        <div className="col d-flex align-items-center text-nowrap">
                          <label className="form-label mx-3">Installation Status: </label>
                          <select className="form-select" aria-label="Default select example" name="installation_status"  onChange={handleInputChange}>
                            <option value="">--Select--</option>
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETE">Complete</option>
                            <option value="NOTAPPLICABLE">Not Applicable</option>
                          </select>
                        </div>
                        <div className="col d-flex align-items-center text-nowrap">
                          <label className="form-label mx-3">Info: </label>
                          <input placeholder="Enter if applicable" name="info" type="text" className="form-control" aria-describedby="emailHelp"  onChange={handleInputChange}/>
                          {/* <input placeholder="Enter model number (if available)" name="model" type="text" maxLength={70} className="form-control" aria-describedby="emailHelp" value={model} onChange={(e) => handleLowerPartChange(index, "model", e.target.value)}/> */}
                        </div>
                      </div>
                    </form>
                  </div>}
                </div> }
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary bg-danger border-0" onClick={() => setPaymentModal(false)}>Cancel</button>
              {selectedData.remaining_amount!=0 && <button type="button" className="btn btn-secondary bg-success border-0" onClick={() => handlePaymentSubmit()}>Save</button>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageBills;