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
        } else if(type == "ITEMSTATUS"){
          data[i].item_status = value;
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
            item_status: data[i].item_status,
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
  const columns = useMemo(
    () => [
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
          const [value, setValue] = useState(row.original.description);
          const handleChange = (e) => {
            const newValue = e.target.value;
            setValue(newValue);
            changeTableValue(row.original._id, newValue, "DESCRIPTION");
          };
      
          return (
            <div style={{ textAlign: "center" }}>
              {!editableTable && <label>{value}</label>}
              {editableTable && <div> <input name="description" value={value} onChange={handleChange} /></div>}
            </div>
          );
        },
      },
      {
        header: "Quantity",
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
      {
        header: "Sell Price",
        id: "sell_price_key",
        accessorKey: "sell_price_key",
        sortingFn: "alphanumeric",
        enableSorting: true,
        headerClassName: "ei-text-center-imp",
        cell: ({ row }) => {
          const [value, setValue] = useState(row.original.item_sell_price);
          const handleChange = (e) => {
            const newValue = e.target.value;
            setValue(newValue);
            changeTableValue(row.original._id, newValue, "SELLPRICE");
          };
      
          return (
            <div style={{ textAlign: "center" }}>
              {!editableTable && <label>{value}</label>}
              {editableTable && <div> <input name="sell_price" value={value} onChange={handleChange} /></div>}
            </div>
          );
        },
      },
      {
        header: "Item Status",
        id: "item_status",
        accessorKey: "item_status",
        sortingFn: "alphanumeric",
        enableSorting: true,
        headerClassName: "ei-text-center-imp",
        cell: ({ row }) => {
          const [value, setValue] = useState(row.original.item_status);
          const handleChange = (e) => {
            const newValue = e.target.value;
            setValue(newValue);
            changeTableValue(row.original._id, newValue, "ITEMSTATUS");
          };
      
          return (
            <div style={{ textAlign: "center" }}>
              {!editableTable && <label>{value}</label>}
              {editableTable && <div>
                <select style={{minWidth:"130px"}} className="form-select" aria-label="Default select example" name="item_status" value={value} onChange={handleChange}>
                  <option value="RECEIVED">Received</option>
                  <option value="ACCEPTED">Accepted</option>
                  <option value="RETURNED">Returned</option>
                </select> 
              </div>}
            </div>
          );
        },
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Seller",
        accessorKey: "seller",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Entry Date",
        accessorKey: "date",
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
        header: "Batch Id",
        accessorKey: "batch_id",
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
      },
    ],
    [ pageIndex, pageSize, editableTable] 
  );

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
        <div className="col-7">
          <input value={globalFilter || ""} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search by any field of table..." className="form-control my-3"/>
        </div>
        <div className="col-3 d-flex align-items-center">
          <label className="form-label me-2 text-nowrap">Sold Status :</label>
          <select className="form-select" aria-label="Default select example" name="sold_status" value={filters.sold_status} onChange={(e) => changeFilter(e.target.value, "sold_status")}>
              <option value="UNSOLD">Unsold</option>
              <option value="SOLD">Sold</option>
              <option value="ALL">All</option>
          </select> 
        </div>
        <div className="col-2 d-flex align-items-center justify-content-end">
          {!editableTable && <button className="btn btn-secondary" disabled={data.length<=0} onClick={() => editableStatus(true)}>Bulk Edit</button>}
          {editableTable && <button className="btn btn-secondary" onClick={() => editableStatus(false)}>Save</button>}
        </div>
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
            <button className="btn btn-secondary" onClick={() => table.previousPage()}disabled={!table.getCanPreviousPage()} >Previous</button>
            <button className="btn btn-secondary" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}> Next </button>
          </div>
        </div>
      </div>}
      {data.length<=0 && <div className="text-center mt-5">Your stock list is empty. Add items from "Add Stock" to see details here.</div>}
    </div>
  );
}

export default StockDetails;
