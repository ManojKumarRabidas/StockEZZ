import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";

import toastr from 'toastr';
const token = sessionStorage.getItem('token');
const userType = sessionStorage.getItem('seUserType');
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

function StockDetails() {
  const [data, setData] = useState([]);
  const [editableTable, setEditableTable] = useState(false);
  const [filters, setFilters] = useState({sold_status: "UNSOLD"});
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState([]); // State to manage sorting

   const getData = async()=>{
    try {
      const response = await fetch(`${HOST}:${PORT}/server/stock-list`, {
        method: "GET",
        headers: { 'authorization': `Bearer ${token}`, "sold_status": filters.sold_status},
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
    changeFilter("UNSOLD", "sold_status")
  }, []);

  const changeTableValue = (_id, value, type) => {
    for(let i=0; i<data.length; i++){
      const ref = data[i];
      if(ref._id == _id){
        data[i].edited = true;
        if(type == "SELLPRICE"){
          data[i].item_sell_price = value;
        } else if(type == "DESCRIPTION"){
          data[i].description = value;
        } else if(type == "REMARKS"){
          data[i].remarks = value;
        }
      }
    }
  }

  const editableStatus = async (status)=>{
    setEditableTable(status)
    if(!status){
      const newBody = []
      for(let i=0; i<data.length; i++){
        if(data[i].edited){
          const ref = {
            _id: data[i]._id,
            item_sell_price: data[i].item_sell_price,
            description: data[i].description,
          }
          newBody.push(ref);
        }
      }
      if(newBody.length == 0){
        toastr.info("No stock details has updated.");
        return;
      }
      try {
        const response = await fetch(`${HOST}:${PORT}/server/stock-bulk-update`, {
          method: "PATCH",
          body: JSON.stringify(newBody),
          headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`,
          },
        });
  
        if (response) {
          const result = await response.json();
          if (response.ok) {
            toastr.success("Stock details updated successfully.");
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
  }

  const changeFilter = (value, type) => {
    if(type == "sold_status"){
      filters.sold_status = value;
      getData();
    }
  }

  // Define table columns with proper accessorKeys
  const columns = useMemo(() => {
    const baseColumns = [
      {
        header: "Sl No",
        accessorFn: (row, i) => i + 1 + pageIndex * pageSize,
        id: "slNo",
        enableSorting: false,
      },
      {
        header: "Challan No",
        accessorKey: "challan_no",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Description",
        id: "description",
        accessorKey: "description",
        sortingFn: "alphanumeric",
        enableSorting: true,
        headerClassName: "ei-text-center-imp",
        cell: ({ row }) => {
          const value = row.getValue("description");
          const handleChange = (e) => {
            const newValue = e.target.value;
            // setValue(newValue);
            changeTableValue(row.original._id, newValue, "DESCRIPTION");
            row.original.description = newValue;
            setData((prev) =>
              prev.map((item) =>
                item._id === row.original._id ? { ...item, description: newValue } : item
              )
            );
          };
      
          return (
            <div style={{ textAlign: "center" }}>
              {!editableTable? <label>{value}</label>:
              <div> <input name="description" defaultValue={value} onChange={handleChange} /></div>}
            </div>
          );
        },
      },
      {
        header: "Total",
        accessorKey: "total_quantity",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Available",
        accessorKey: "quantity",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Buy Price",
        accessorKey: "item_buy_price",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
    ];

      // Inject extra column conditionally
    if (filters.sold_status === "RETURNED" || filters.sold_status === "DAMAGED" || filters.sold_status === "CLEARED") {
      baseColumns.push({
        header: filters.sold_status === "RETURNED" ? "Return Reason" : (filters.sold_status == "CLEARED" ? "Clear Reason" : "Damage Reason"),
        accessorKey: "reason",
        sortingFn: "alphanumeric",
        enableSorting: false,
      });
    }
    if (!(filters.sold_status === "RETURNED" || filters.sold_status === "DAMAGED" || filters.sold_status === "CLEARED")) {
      baseColumns.push(
        {
          header: "Sell Price",
          id: "item_sell_price",
          accessorKey: "item_sell_price",
          sortingFn: "alphanumeric",
          enableSorting: true,
          headerClassName: "ei-text-center-imp",
          cell: ({ row }) => {
            const value = row.getValue("item_sell_price");
            const handleChange = (e) => {
              const newValue = e.target.value;
              // setValue(newValue);
              changeTableValue(row.original._id, newValue, "SELLPRICE");
              row.original.item_sell_price = newValue;
              setData((prev) =>
                prev.map((item) =>
                  item._id === row.original._id ? { ...item, item_sell_price: newValue } : item
                )
              );
            };
        
            return (
              <div style={{ textAlign: "center" }}>
                {!editableTable? <label>{value}</label>:
                <div> <input name="item_sell_price" defaultValue={value} onChange={handleChange} /></div>}
              </div>
            );
          },
        },
      )
    }
    baseColumns.push(
     
      {
        header: "Item Status",
        id: "item_status",
        accessorKey: "item_status",
        sortingFn: "alphanumeric",
        enableSorting: true,
        cell: ({ row }) => {
          const showStatus =
              filters.sold_status === "RETURNED"
              ? "RETURNED"
              : filters.sold_status === "DAMAGED"
              ? "DAMAGED"
              : filters.sold_status === "CLEARED"
              ? "CLEARED"
              : filters.sold_status === "SOLD"
              ? "SOLD"
              : "RECEIVED";
      
          return (
            <div style={{ textAlign: "center" }}>
              <label>{showStatus}</label>
            </div>
          );
        },
      },
      {
        header: "Remarks",
        id: "remarks",
        accessorKey: "remarks",
        sortingFn: "alphanumeric",
        enableSorting: true,
        headerClassName: "ei-text-center-imp",
        cell: ({ row }) => {
          const value = row.getValue("remarks");
          const handleChange = (e) => {
            const newValue = e.target.value;
            // setValue(newValue);
            changeTableValue(row.original._id, newValue, "REMARKS");
            row.original.remarks = newValue;
            setData((prev) =>
              prev.map((item) =>
                item._id === row.original._id ? { ...item, remarks: newValue } : item
              )
            );
          };
      
          return (
            <div style={{ textAlign: "center" }}>
              {!editableTable? <label>{value}</label>:
              <div> <input name="remarks" defaultValue={value} onChange={handleChange} /></div>}
            </div>
          );
        },
      },
      {
        header: "Location",
        accessorKey: "location",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Seller",
        accessorKey: "seller_name",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header:
        filters.sold_status === "RETURNED"
            ? "Returned Date"
            : filters.sold_status === "DAMAGED"
            ? "Damaged Date"
            : filters.sold_status === "CLEARED"
            ? "Clearance Date"
            : "Entry Date",
        accessorKey: "date",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Batch Id",
        accessorKey: "batch_id",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Sub Category",
        accessorKey: "sub_category",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Item Sl No",
        accessorKey: "sl_no",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Item Name",
        accessorKey: "item",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Brand",
        accessorKey: "brand_name",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Model",
        accessorKey: "model",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Color",
        accessorKey: "color",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Capacity",
        accessorKey: "capacity",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Height",
        accessorKey: "height",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Power",
        accessorKey: "power",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Watt",
        accessorKey: "watt",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Form",
        accessorKey: "form",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Mfg date",
        accessorKey: "mfg_date",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Exp Date",
        accessorKey: "exp_date",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Warrantee/Guarantee",
        accessorKey: "warrantee_guarantee",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Warrantee/Guarantee Duration",
        accessorKey: "warrantee_guarantee_duration",
        sortingFn: "alphanumeric",
        enableSorting: true,
      })
    return baseColumns;
  }, [pageIndex, pageSize, editableTable, filters.sold_status]);

  // Apply global filtering before pagination
  const filteredData = useMemo(() => {
    if (!globalFilter) return data;
    return data.filter((row) => {
      const lowercasedFilter = globalFilter.toLowerCase();
      return (
        row.challan_no.toString().toLowerCase().includes(lowercasedFilter) ||
        row.description.toString().toLowerCase().includes(lowercasedFilter) ||
        row.remarks.toString().toLowerCase().includes(lowercasedFilter) ||
        row.item.toString().toLowerCase().includes(lowercasedFilter) ||
        row.brand_name.toLowerCase().includes(lowercasedFilter) ||
        row.model.toString().toLowerCase().includes(lowercasedFilter) ||
        row.color.toString().toLowerCase().includes(lowercasedFilter) ||
        row.capacity.toString().toLowerCase().includes(lowercasedFilter) ||
        row.height.toString().toLowerCase().includes(lowercasedFilter) ||
        row.power.toString().toLowerCase().includes(lowercasedFilter) ||
        row.item_status.toString().toLowerCase().includes(lowercasedFilter) ||
        row.seller.toString().toLowerCase().includes(lowercasedFilter) ||
        row.sl_no.toString().toLowerCase().includes(lowercasedFilter) ||
        row.batch_id.toString().toLowerCase().includes(lowercasedFilter)
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
      <div className="row">
        <div className={userType == "COMPANY"?"col-7":"col-9"}>
          <input value={globalFilter || ""} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search by any field of table..." className="form-control my-3"/>
        </div>
        <div className="col-3 d-flex align-items-center justify-content-end">
          <label className="form-label me-2 text-nowrap">Status :</label>
          <select className="form-select" aria-label="Default select example" name="sold_status" value={filters.sold_status} onChange={(e) => changeFilter(e.target.value, "sold_status")}>
              <option value="UNSOLD">Unsold</option>
              <option value="SOLD">Sold</option>
              <option value="ALL">All Sold & Unsold</option>
              <option value="DAMAGED">Damaged</option>
              <option value="RETURNED">Returned</option>
              <option value="CLEARED">Cleared</option>
          </select> 
        </div>
        {userType == "COMPANY" && <div className="col-2 d-flex align-items-center justify-content-end">
          {!editableTable && <button className="btn btn-secondary" disabled={data.length<=0} onClick={() => editableStatus(true)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
              <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
            </svg> Edit 
          </button>}
          {editableTable && <button className="btn btn-secondary" onClick={() => editableStatus(false)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-floppy" viewBox="0 0 16 16">
              <path d="M11 2H9v3h2z"/>
              <path d="M1.5 0h11.586a1.5 1.5 0 0 1 1.06.44l1.415 1.414A1.5 1.5 0 0 1 16 2.914V14.5a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 14.5v-13A1.5 1.5 0 0 1 1.5 0M1 1.5v13a.5.5 0 0 0 .5.5H2v-4.5A1.5 1.5 0 0 1 3.5 9h9a1.5 1.5 0 0 1 1.5 1.5V15h.5a.5.5 0 0 0 .5-.5V2.914a.5.5 0 0 0-.146-.353l-1.415-1.415A.5.5 0 0 0 13.086 1H13v4.5A1.5 1.5 0 0 1 11.5 7h-7A1.5 1.5 0 0 1 3 5.5V1H1.5a.5.5 0 0 0-.5.5m3 4a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5V1H4zM3 15h10v-4.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5z"/>
            </svg> Save
          </button>}
        </div>}
      </div>
      {data.length>0 && <div>
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
                    <td className="p-3" key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))}
              {table.getRowModel().rows.length === 0 && (
                <tr>
                  <td colSpan="22" className="text-center">No data available </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between my-3">
          <select className="form-select mx-2" style={{maxWidth: "fit-content"}}  value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} >
            {[5, 10, 15 , 20, 25].map((size) => (
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
      </div>}
      {data.length<=0 && <div className="text-center mt-5">No stock available.</div>}
    </div>
  );
}

export default StockDetails;
