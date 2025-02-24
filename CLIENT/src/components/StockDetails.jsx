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

function List() {
  const [data, setData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(6);
  const [sorting, setSorting] = useState([]); // State to manage sorting

  async function getData() {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/stock-list`, {
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

//   const handleDelete = async (id) => {
//     try {
//       const response = await fetch(`${HOST}:${PORT}/server/stock-remove/${id}`, {
//         method: "DELETE",
//         headers: { 'authorization': `Bearer ${token}` },
//       });

//       const result = await response.json();
//       if (response.ok) {
//         toastr.success("Buyer deleted successfully");
//         getData();
//       } else {
//         toastr.error(result.error);
//       }
//     } catch (err) {
//       toastr.error("We are unable to process now. Please try again later.");
//     }
//   };

  const handleAvilibilityChange = async (id, isActive) => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/stock-update-avilibility/${id}`, {
        method: "PUT",
        body: JSON.stringify({ active: isActive }),
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        toastr.success("Stock status updated successfully");
        getData();
      } else {
        toastr.error(result.error);
      }
    } catch (err) {
      toastr.error("We are unable to process now. Please try again later.");
    }
  };

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
        header: "Item Name",
        accessorKey: "item",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Brand",
        accessorKey: "brand",
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
        header: "Quantity",
        accessorKey: "quantity",
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
        accessorKey: "batchId",
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
        accessorKey: "item_sell_price",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Description",
        accessorKey: "description",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Item Status",
        accessorKey: "item_status",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Remarks",
        accessorKey: "remarks",
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
      {
        header: "Action",
        id: "action",
        enableSorting: false,
        headerClassName: "ei-text-center-imp",
        cell: ({ row }) => (
          <div style={{ textAlign: "center" }}>
            <button type="button" className="btn btn-outline-light m-1" style={{ backgroundColor: "ghostwhite" }}>
              <Link to={`/buyers/buyer-update/${row.original._id}`} className="card-link m-2" >Edit</Link>
            </button>
            <button type="button" className="btn btn-outline-light m-1" style={{ color: "blue", backgroundColor: "ghostwhite" }} onClick={() => handleAvilibilityChange(row.original._id)} >Delete </button>
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
        row.code.toString().toLowerCase().includes(lowercasedFilter) ||
        row.name.toLowerCase().includes(lowercasedFilter) ||
        row.phone.toString().toLowerCase().includes(lowercasedFilter) ||
        row.pin.toString().toLowerCase().includes(lowercasedFilter)
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
      <input value={globalFilter || ""} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Search by any field of table..." className="form-control my-3"/>
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
                <td colSpan="7" className="text-center">No data available </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between mb-3">
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
    </div>
  );
}

export default List;
