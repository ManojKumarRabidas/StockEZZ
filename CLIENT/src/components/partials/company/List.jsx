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
      const response = await fetch(`${HOST}:${PORT}/server/company-list`, {
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

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/company-delete/${id}`, {
        method: "DELETE",
        headers: { 'authorization': `Bearer ${token}` },
      });

      const result = await response.json();
      if (response.ok) {
        toastr.success("Company deleted successfully");
        getData();
      } else {
        toastr.error(result.error);
      }
    } catch (err) {
      toastr.error("We are unable to process now. Please try again later.");
    }
  };

  const handleActiveChange = async (id, isActive) => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/company-update-active/${id}`, {
        method: "PUT",
        body: JSON.stringify({ active: isActive }),
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${token}`,
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        toastr.success("Company activation status updated successfully");
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
        header: "Code",
        accessorKey: "code",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Name",
        accessorKey: "name",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Phone",
        accessorKey: "phone",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Email Id",
        accessorKey: "email",
        sortingFn: "alphanumeric",
        enableSorting: true,
      },
      {
        header: "Active",
        accessorKey: "active",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="form-switch">
            <input
              className="form-check-input cursor-pointer"
              type="checkbox"
              role="switch"
              id={`activeSwitch-${row.id}`}
              checked={row.original.active}
              onChange={(e) =>
                handleActiveChange(row.original._id, e.target.checked)
              }
            />
          </div>
        ),
      },
      {
        header: "Action",
        id: "action",
        enableSorting: false,
        headerClassName: "ei-text-center-imp",
        cell: ({ row }) => (
          <div className="d-flex" style={{ textAlign: "center" }}>
            <span type="button" className="btn btn-outline-light">
              <Link to={`/companies/company-update/${row.original._id}`} className="card-link" >
                <svg style={{ color: "#4A4A4A" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                  <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                  <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                </svg>
              </Link>
            </span>
            <span type="button" className="btn btn-outline-light" onClick={() => handleDelete(row.original._id)} >
              <svg style={{ color: "#4A4A4A" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
              </svg>  
            </span>
          </div>
        ),
      },
    ],
    [handleDelete, pageIndex, pageSize] // Include pageIndex and pageSize as dependencies
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
        row.email.toLowerCase().includes(lowercasedFilter)
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
      <table className="table table-striped shadow-sm p-3 mb-5 bg-body-tertiary rounded">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
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
            <tr key={row.id}>
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
