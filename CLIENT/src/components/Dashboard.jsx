import "../App.css";
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toastr from 'toastr';

const token = sessionStorage.getItem('token');
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    lowStockItems: [],
    pendingBills: [],
    stockInOutData: null,
    monthlyRevenue: null,
    metricsData: null,
    loading: true
  });
  const [stockFilter, setStockFilter] = useState(10);
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    return {
      start: startOfMonth,
      end: today,
    };
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [reorderQuantity, setReorderQuantity] = useState(0);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Function to fetch financial data (Revenue, Profit, Stock Movement)
  const fetchFinancialData = async () => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/financials?start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`,
        {headers: { 'Authorization': `Bearer ${token}`}}
      );
      const data = await response.json();
      console.log("data", data)
      setDashboardData(prev => ({
        ...prev,
        stockInOutData: {
          labels: data.labels || [],
          stockIn: data.stockIn || [],
          stockOut: data.stockOut || [],
          totalValue: data.totalStockValue || 0
        },
        monthlyRevenue: {
          labels: data.labels || [],
          values: data.revenue || [],
          profit: data.profit || [],
          currentMonth: data.currentMonthRevenue || 0,
          currentMonthProfit: data.currentMonthProfit || 0
        }
      }));
    } catch (error) {
      console.error('Error fetching financial data:', error);
      toastr.error('Failed to fetch financial data');
    }
  };

  // Function to fetch metrics data (called only on page load)
  const fetchMetricsData = async () => {
    try {
      const response = await fetch(
        `${HOST}:${PORT}/server/metrics`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const data = await response.json();
      setDashboardData(prev => ({
        ...prev,
        metricsData: {
          totalStockValue: data.totalStockValue || 0,
          totalPendingBills: data.totalPendingBills || 0,
          totalPendingInstall: data.totalPendingInstall || 0,
          pendingBillDetails: data.pendingBillDetails || []
        }
      }));
    } catch (error) {
      console.error('Error fetching metrics data:', error);
      toastr.error('Failed to fetch metrics data');
    }
  };

  // Function to fetch low stock items
  const fetchLowStockItems = async () => {
    try {
      const response = await fetch(
        `${HOST}:${PORT}/server/stock/low?threshold=${stockFilter}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const data = await response.json();
      setDashboardData(prev => ({
        ...prev,
        lowStockItems: data.filter(item => item.quantity > 0 && item.quantity < stockFilter)
      }));
    } catch (error) {
      console.error('Error fetching low stock items:', error);
      toastr.error('Failed to fetch low stock items');
    }
  };

  // Initial page load effect
  useEffect(() => {
    const fetchInitialData = async () => {
      setDashboardData(prev => ({ ...prev, loading: true }));
      await Promise.all([
        fetchFinancialData(),
        fetchMetricsData(),
        fetchLowStockItems()
      ]);
      setDashboardData(prev => ({ ...prev, loading: false }));
    };
    fetchInitialData();
  }, []);

  // Effect for date range and stock filter changes
  useEffect(() => {
    fetchFinancialData();
    fetchLowStockItems();
  }, [dateRange, stockFilter]);

  const handleReorder = async (item) => {
    try {
      await fetch(`${HOST}:${PORT}/server/stock/reorder`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ itemId: item._id, quantity: reorderQuantity })
      });
      await fetchLowStockItems();
      setSelectedItem(null);
      setReorderQuantity(0);
      toastr.success('Item reordered successfully');
    } catch (error) {
      console.error('Error reordering:', error);
      toastr.error('Failed to reorder item');
    }
  };

  const handleSearch = () => {
    fetchFinancialData();
  };

  // Stock In/Out Graph Data
  const stockGraphData = {
    labels: dashboardData.stockInOutData?.labels || [],
    datasets: [
      {
        label: 'Stock In',
        data: dashboardData.stockInOutData?.stockIn || [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Stock Out',
        data: dashboardData.stockInOutData?.stockOut || [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  };

  // Revenue & Profit Graph Data
  const revenueGraphData = {
    labels: dashboardData.monthlyRevenue?.labels || [],
    datasets: [
      {
        label: 'Revenue',
        data: dashboardData.monthlyRevenue?.values || [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Profit',
        data: dashboardData.monthlyRevenue?.profit || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ]
  };

  // CSV Export Data
  const lowStockCSVData = dashboardData.lowStockItems?.map(item => ({
    name: item.name,
    quantity: item.quantity,
    status: item.quantity === 0 ? 'Out of Stock' : 'Low Stock'
  }));

  const pendingBillsCSVData = dashboardData.metricsData?.pendingBillDetails?.map(bill => ({
    billNumber: bill.billNumber,
    customerName: bill.customerName,
    amount: bill.amount,
    dueDate: new Date(bill.dueDate).toLocaleDateString()
  })) || [];

  if (dashboardData.loading) {
    return (
      <div className="container-fluid p-3" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        <style>
          {`
            .shimmer {
              position: relative;
              background: #e0e0e0;
              background: linear-gradient(to right, #e0e0e0 8%, #d3d3d3 18%, #e0e0e0 33%);
              background-size: 800px 104px;
              animation: shimmer 1.5s infinite;
            }
  
            @keyframes shimmer {
              0% { background-position: -468px 0; }
              100% { background-position: 468px 0; }
            }
  
            .shimmer-container {
              border-radius: 8px;
              overflow: hidden;
              height: 150px;
              margin-bottom: 15px;
            }
  
            .shimmer-header {
              height: 60px;
              margin-bottom: 15px;
            }
  
            .shimmer-table {
              height: 200px;
            }
  
            .shimmer-table-row {
              height: 40px;
              margin-bottom: 10px;
              border-radius: 4px;
            }
          `}
        </style>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="shimmer shimmer-container shimmer-header me-2" style={{ width: '100%', flex: '1' }}></div>
          <div className="d-flex" style={{ width: '250px' }}>
            <div className="shimmer shimmer-container shimmer-header" style={{ width: '120px', marginRight: '10px' }}></div>
            <div className="shimmer shimmer-container shimmer-header" style={{ width: '120px' }}></div>
          </div>
        </div>
        <div className="row g-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="col-12 col-md-3">
              <div className="shimmer shimmer-container"></div>
            </div>
          ))}
        </div>
        <div className="row g-3 mt-3">
          {[1, 2].map((i) => (
            <div key={i} className="col-12 col-md-6">
              <div className="shimmer shimmer-container"></div>
            </div>
          ))}
        </div>
        <div className="row g-3 mt-3">
          {[1, 2].map((i) => (
            <div key={i} className="col-12 col-md-6">
              <div className="shimmer shimmer-container shimmer-table">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="shimmer-table-row"></div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-3" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="mb-0">StockEZZ</h2>
          <p className="text-muted mb-0">You focus on managing your life. Let us manage your stock. 😊</p>
        </div>
        <div className="d-flex align-items-center">
          <div className="mx-2">
            <DatePicker 
              dateFormat="dd/MM/yyyy" 
              required 
              name="startDate" 
              selected={dateRange.start} 
              className="form-control" 
              onChange={(date) => setDateRange({ ...dateRange, start: date })}
            />
          </div>
          <div>
            <DatePicker 
              dateFormat="dd/MM/yyyy" 
              required 
              name="endDate" 
              selected={dateRange.end} 
              className="form-control" 
              onChange={(date) => setDateRange({ ...dateRange, end: date })}
            />
          </div>
          <button 
            className="btn btn-primary ms-2"
            onClick={handleSearch}
          >
            Search
          </button>
        </div>
      </div>

      <div className="row g-3">
        {/* Row 1: Key Metrics */}
        <div className="col">
          <div className="card p-3">
            <h5 className="card-title mb-2">Total Stock Value</h5>
            <p className="card-text display-6 text-primary mb-0">
              ₹{dashboardData.metricsData?.totalStockValue?.toLocaleString() || 6851020}
            </p>
          </div>
        </div>
        <div className="col">
          <div className="card p-3">
            <h5 className="card-title mb-2">Total Pending Bills</h5>
            <p className="card-text display-6 text-danger mb-0">
              ₹{dashboardData.metricsData?.totalPendingBills?.toLocaleString() || 95803}
            </p>
          </div>
        </div>
        <div className="col">
          <div className="card p-3">
            <h5 className="card-title mb-2 d-flex align-items-center">Total Install <p style={{fontSize:"0.9rem", margin: "0", padding: "0"}}> (Pending)</p></h5>
            <p className="card-text display-6 text-warning mb-0">
              {dashboardData.metricsData?.totalPendingInstall || 13}
            </p>
          </div>
        </div>
        <div className="col">
          <div className="card p-3">
            <h5 className="card-title mb-2">Revenue</h5>
            <p className="card-text display-6 text-info mb-0">
              {/* ₹{dashboardData.monthlyRevenue?.currentMonth?.toLocaleString() || 784521} */}
              ₹784521
            </p>
          </div>
        </div>
        <div className="col">
          <div className="card p-3">
            <h5 className="card-title mb-2">Profit</h5>
            <p className="card-text display-6 text-success mb-0">
              {/* ₹{dashboardData.monthlyRevenue?.currentMonthProfit?.toLocaleString() || 65302} */}
              ₹65302
            </p>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-3">
        {/* Row 2: Graphs */}
        <div className="col-12 col-md-6">
          <div className="card p-3">
             <div className="d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-2">Stock Movement</h5>
              <select style={{maxWidth: "15rem"}} className="form-select" aria-label="Default select example" name="warrantee_guarantee_duration" onChange={(e) => handleLowerPartChange(index, "warrantee_guarantee_duration", e.target.value)}>
                  <option>--Select item--</option>
                  <option value="1">1 Month</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">1 Year</option>
                  <option value="24">2 Years</option>
                  <option value="36">3 Years</option>
                  <option value="48">4 Years</option>
                  <option value="60">5 Years</option>
                  <option value="72">6 Years</option>
                  <option value="84">7 Years</option>
                  <option value="96">8 Years</option>
                  <option value="108">9 Years</option>
                  <option value="120">10 Years</option>
                  <option value="180">15 Years</option>
                  <option value="240">20 Years</option>
                  <option value="300">25 Years</option>
              </select>
            </div> 
            <Bar 
              data={stockGraphData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom' },
                }
              }}
            />
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card p-3">
            <h5 className="card-title mb-2">Revenue & Profit</h5>
            <Line 
              data={revenueGraphData}
              options={{
                responsive: true,
                plugins: {
                  legend: { position: 'bottom' },
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="row g-3 mt-3">
        {/* Row 3: Tables */}
        <div className="col-12 col-md-6">
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="card-title mb-0">Low Stock Items</h5>
              <div className="d-flex">
                <input
                  placeholder="Threshold"
                  type="number"
                  value={stockFilter}
                  onChange={(e) => setStockFilter(parseInt(e.target.value) || 10)}
                  className="form-control form-control-sm me-2"
                  style={{ width: '100px' }}
                />
                <button className="btn btn-dark btn-sm">
                  <CSVLink data={lowStockCSVData} filename="low-stock-items.csv" className="text-white text-decoration-none">
                    Export
                  </CSVLink>
                </button>
              </div>
            </div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.lowStockItems?.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>
                      <span className={`badge ${item.quantity === 0 ? 'bg-danger' : 'bg-warning'}`}>
                        {item.quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setSelectedItem(item)}
                      >
                        <svg width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707v2.828l2.828-2.828L11.793 6.5z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="col-12 col-md-6">
          <div className="card p-3">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="card-title mb-0">Pending Bills</h5>
              <button className="btn btn-dark btn-sm">
                <CSVLink data={pendingBillsCSVData} filename="pending-bills.csv" className="text-white text-decoration-none">
                  Export
                </CSVLink>
              </button>
            </div>
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Bill No</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.metricsData?.pendingBillDetails?.map((bill) => (
                  <tr key={bill._id}>
                    <td>{bill.billNumber}</td>
                    <td>{bill.customerName}</td>
                    <td>₹{bill.amount.toLocaleString()}</td>
                    <td>
                      <span className={new Date(bill.dueDate) < new Date() ? 'badge bg-danger' : 'badge bg-secondary'}>
                        {new Date(bill.dueDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() => setSelectedBill(bill)}
                      >
                        <svg width="16" height="16" fill="currentColor" className="bi bi-eye" viewBox="0 0 16 16">
                          <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                          <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reorder Dialog */}
      {selectedItem && (
        <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reorder {selectedItem.name}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedItem(null)}></button>
              </div>
              <div className="modal-body">
                <input
                  type="number"
                  value={reorderQuantity}
                  onChange={(e) => setReorderQuantity(parseInt(e.target.value))}
                  className="form-control mb-2"
                  placeholder="Reorder Quantity"
                />
                <p className="mb-1">Current Stock: {selectedItem.quantity}</p>
                <p className="mb-0">Minimum Stock Level: {selectedItem.minStockLevel || 'Not set'}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedItem(null)}>Cancel</button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleReorder(selectedItem)}
                  disabled={reorderQuantity <= 0}
                >
                  Reorder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bill Details Dialog */}
      {selectedBill && (
        <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Bill Details - {selectedBill.billNumber}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedBill(null)}></button>
              </div>
              <div className="modal-body">
                <p className="mb-1">Customer: {selectedBill.customerName}</p>
                <p className="mb-1">Amount: ₹{selectedBill.amount?.toLocaleString()}</p>
                <p className="mb-1">Due Date: {selectedBill.dueDate && new Date(selectedBill.dueDate).toLocaleDateString()}</p>
                <p className="mb-0">Status: {selectedBill.status}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setSelectedBill(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;