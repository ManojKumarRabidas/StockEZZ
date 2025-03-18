import React, { useState, useEffect, useMemo } from "react";
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
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState([]); // State to manage sorting
  const [detailsBillDiv, setDetailsBillDiv] = useState(false);
  const [billEditingStatus, setBillEditingStatus] = useState(false);
  const [detailsBill, setDetailsBill] = useState({});

  async function getData() {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/bill-list`, {
        method: "GET",
        headers: { 'authorization': `Bearer ${token}` },
      });

      const result = await response.json();
      if (response.ok) {
        setData(result.docs);
      } else {
        toastr.error(result.msg);
      }
    } catch (err) {
      toastr.error("We are unable to process now. Please try again later.");
    }
  }

  useEffect(() => {
    getData();
  }, []);

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

  const changeDetails = (value, type) => {
    const tempObj = {...detailsBill};
    if (type == "paid_amount"){
        tempObj.paid_amount = value;
        tempObj.remaining_amount = Number(tempObj.grandTotal) - value;
    } else if (type == "info"){
        tempObj.info = value;
    }else if (type == "pending_installation"){
        tempObj.pending_installation = value;
    }
    setDetailsBill(tempObj)
  }

  const updateBillDetails = async(id)=>{
    const updatedBillDetails  = {paid_amount: detailsBill.paid_amount, remaining_amount: detailsBill.remaining_amount, info: detailsBill.info, pending_installation: detailsBill.pending_installation };
    if (updatedBillDetails.paid_amount == "" ){
      toastr.error("There must be some 'Paid amount'");
      return;
    }
    try {
      const response = await fetch(`${HOST}:${PORT}/server/bill-update/${id}`, {
        method: "PATCH",
        body: JSON.stringify(updatedBillDetails),
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        },
      });

      if (response) {
        const result = await response.json();
        if (response.ok) {
          toastr.success("Bill details updated successfully.");
          setBillEditingStatus(false);
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
      console.error('Error printing bill:', error);
      toastr.error(error.message || 'Failed to download bill PDF');
    }
  }, []);
  
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
        header: "Date",
        accessorKey: "date",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Bill No",
        accessorKey: "billNo",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Buyer Name",
        accessorKey: "buyer_name",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      // {
      //   header: "Buyer Phone",
      //   accessorKey: "buyer_phone",
      //   sortingFn: "alphanumeric",
      //   enableSorting: true,
      // },
      // {
      //   header: "Total",
      //   accessorKey: "total",
      //   sortingFn: "alphanumeric",
      //   enableSorting: true,
      // },
      // {
      //   header: "Additional Charges",
      //   accessorKey: "additional_charges",
      //   sortingFn: "alphanumeric",
      //   enableSorting: true,
      // },
      // {
      //   header: "Discount",
      //   accessorKey: "discount",
      //   sortingFn: "alphanumeric",
      //   enableSorting: true,
      // },
      {
        header: "Grand Total",
        accessorKey: "grandTotal",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Payment Mode",
        accessorKey: "payment_type",
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
        accessorKey: "pending_installation",
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
        header: "Action",
        id: "action",
        enableSorting: false,
        headerClassName: "ei-text-center-imp",
        cell: ({ row }) => (
          <div style={{ textAlign: "center" }}>
            
            <button type="button" className="btn btn-outline-light" style={{ color: "blue", backgroundColor: "ghostwhite" }} onClick={() => details(row.original._id)} >Details </button>
          </div>
        ),
      },
    ],
    [ pageIndex, pageSize] // Include pageIndex and pageSize as dependencies
  );

  // Apply global filtering before pagination
  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    return data.filter((row) => {
      const lowercasedFilter = globalFilter.toLowerCase();
      return (
        row.billNo.toString().toLowerCase().includes(lowercasedFilter) ||
        row.buyer_name.toString().toLowerCase().includes(lowercasedFilter) ||
        row.payment_type.toLowerCase().includes(lowercasedFilter) ||
        row.info.toString().toLowerCase().includes(lowercasedFilter) ||
        row.pending_installation.toString().toLowerCase().includes(lowercasedFilter)
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
        <input value={globalFilter || ""} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search by any field of table..." className="form-control my-3"/>
        {data.length>0 && <>   
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
              <button className="btn btn-secondary" onClick={() => table.previousPage()}disabled={!table.getCanPreviousPage()} >Previous</button>
              <button className="btn btn-secondary" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}> Next </button>
            </div>
          </div>
        </>}
      </div>}
      {data.length<=0 && <div className="d-flex flex-column justify-content-center align-items-center text-center"  style={{minHeight: "87vh"}}> <div> No bills available. <br /> Generate bill from 'Manage Stock' to see bills here.</div></div> }
      {detailsBillDiv &&<div>
            <div className="text-center bg-body-tertiary p-3">
                {(detailsBill.items.length > 0) && <div className="mt-3">
                    <table className="table table-striped p-3 rounded">
                            <tr className="text-center">
                                <th className="p-2 text-start">Product Name</th>
                                <th className="p-2 text-start">Brand</th>
                                <th className="p-2 text-start">Model</th>
                                <th className="p-2 text-start">Color</th>
                                <th className="p-2 text-start">Capacity</th>
                                <th className="p-2 text-start">Height</th>
                                <th className="p-2 text-start">Power</th>
                                <th className="p-2">Quantity</th>
                                <th className="p-2 text-end">Price</th>
                                <th className="p-2 text-end">Total Price</th>
                            </tr>
                            {detailsBill.items.map((item, index) => (
                            <tr className="text-center">
                                <td className="p-2 text-start">{item.item.item_name}</td>
                                <td className="p-2 text-start">{item.item.brand_name ? item.item.brand_name : "N/A"}</td> 
                                <td className="p-2 text-start">{item.item.model ? item.item.model : "N/A"}</td> 
                                <td className="p-2 text-start">{item.item.color ? item.item.color : "N/A"}</td> 
                                <td className="p-2 text-start">{item.item.capacity ? item.item.capacity : "N/A"}</td> 
                                <td className="p-2 text-start">{item.item.height ? item.item.height : "N/A"}</td> 
                                <td className="p-2 text-start">{item.item.power ? item.item.power : "N/A"}</td> 
                                <td className="p-2">{item.quantity}</td>
                                <td className="p-2 text-end"> {item.sell_price}</td>
                                <td className="p-2 text-end"> {item.sell_price * item.quantity}</td>
                            </tr>
                            ))}
                            <tr></tr>
                            <tr >
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <th className="p-1 text-end"> Total : </th>
                                <td className="text-end p-1">{detailsBill.total}</td>
                            </tr>
                            <tr >
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <th className="p-1 text-end"> GST : </th>
                                <td className="text-end p-1">00</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <th className="p-1 text-end">Ad. Charges : </th>
                                <td className="text-end p-1">{detailsBill.additional_charges}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <th className="p-1 text-end">Discount : </th>
                                <td className="text-end p-1">{detailsBill.discount}</td>
                            </tr>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <th className="p-1 text-end">Grand Total : </th>
                                <td className="text-end p-1">{detailsBill.grandTotal}</td>
                            </tr>
                    </table>
                </div>}
                <div className="row my-2">
                    <div className="col d-flex flex-row align-items-center flex-nowrap">
                        <label className="form-label me-2 text-nowrap">Date: {detailsBill.date}</label>
                    </div>
                    <div className="col d-flex flex-row align-items-center flex-nowrap">
                        <label className="form-label me-2 text-nowrap">Payment type : {detailsBill.payment_type}</label>
                    </div>
                    <div className="col d-flex flex-row align-items-center flex-nowrap">
                        {!billEditingStatus &&<label className="form-label me-2 text-nowrap">Paid amount : {detailsBill.paid_amount}</label>}
                        {billEditingStatus && <label className="form-label me-2 text-nowrap d-flex align-items-center">Paid amount : <input name="paid_amount" placeholder="Paid amount"  type="text" maxLength={70} className="form-control text-end ms-2" aria-describedby="emailHelp" value={detailsBill.paid_amount} onChange={(e) => changeDetails(e.target.value, "paid_amount")}/></label>}
                    </div>
                    <div className="col d-flex flex-row align-items-center flex-nowrap">
                        <label className="form-label me-2 text-nowrap">Remaining amount : {detailsBill.remaining_amount}</label>
                    </div>
                    <div className="col d-flex flex-row align-items-center flex-nowrap">
                      {!billEditingStatus && <label className="form-label me-2 text-nowrap">Installation : {detailsBill.pending_installation}</label>}
                      {billEditingStatus && <div className="d-flex align-items-center"><label className="form-label me-2 text-nowrap">Installation :</label>
                        <select className="form-select" aria-label="Default select example" name="pending_installation" value={detailsBill.pending_installation} onChange={(e) => changeDetails(e.target.value, "pending_installation")}>
                            <option>Not applicable</option>
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETE">Complete</option>
                        </select> </div>}
                    </div>
                </div>
                <div className="row my-2">
                  {!billEditingStatus && <label className="form-label me-2 text-nowrap d-flex flex-start">Info : {detailsBill.info}</label>}
                  {billEditingStatus && <div className="d-flex align-items-center">Info: <input name="info" placeholder="Enter any additional information releted to sell or product or installation."  type="text" maxLength={255} className="form-control ms-2" aria-describedby="emailHelp" value={detailsBill.info} onChange={(e) => changeDetails(e.target.value, "info")}/></div>}
                </div>
                <h5>Buyer Details</h5>
                <hr />
                <div className="row text-start my-2">
                    <div className="col">
                      <label className="form-label me-2 text-nowrap"> Phone : {detailsBill.buyer.phone}</label></div>
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
            </div>
            <div className="d-flex justify-content-end mt-3 mb-5">
                <button className="form-control mx-2" style={{maxWidth: "100px"}} onClick={() => backToBillList()} >Back</button>
                {!billEditingStatus && (detailsBill.userType == "OPERATOR") && <button className="form-control mx-2" style={{maxWidth: "100px"}} onClick={() => setBillEditingStatus(true)} >Edit</button>}
                {billEditingStatus && <button className="form-control mx-2" style={{maxWidth: "100px"}} onClick={() => updateBillDetails(detailsBill._id)} >Submit</button>}
                {!billEditingStatus && (detailsBill.userType == "OPERATOR") && <button className="form-control mx-2" style={{maxWidth: "130px"}} onClick={() => generateBillPdf(detailsBill._id)} >Save as Pdf</button>}
                {!billEditingStatus && (detailsBill.userType == "OPERATOR") && <button className="form-control mx-2" style={{maxWidth: "130px"}} onClick={() => generateBillPdf(detailsBill._id)} >Print</button>}
                {!billEditingStatus && (detailsBill.userType == "OPERATOR") && <button className="form-control mx-2 bc-green-imp" style={{maxWidth: "130px"}} onClick={() => whatsappBill(true)} >Whatsapp</button>}
            </div>
        </div>}
    </div>
  );
}

export default ManageBills;