import "../App.css";

// export default function Dashboard(){
//     return(
//         <div className="d-flex flex-column justify-content-between" style={{minHeight: "90vh"}}>
//             <div>   
//                 <div className="text-center">
//                     Coming soon...
//                 </div>
//             </div>
//         </div>
//     )
// }
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    lowStockItems: [],
    pendingBills: [],
    stockInOutData: null,
    monthlyRevenue: null,
    loading: true
  });
  const [stockFilter, setStockFilter] = useState(10);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getMonth() - 1),
    end: new Date()
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [reorderQuantity, setReorderQuantity] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [lowStockRes, pendingBillsRes, stockStatsRes, revenueRes] = await Promise.all([
          fetch(`/api/stock/low?threshold=${stockFilter}`),
          fetch(`/api/bills/pending?start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`),
          fetch(`/api/stock/stats?start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`),
          fetch(`/api/revenue/monthly?start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`)
        ]);

        const lowStockData = await lowStockRes.json();
        const pendingBillsData = await pendingBillsRes.json();
        const stockStatsData = await stockStatsRes.json();
        const revenueData = await revenueRes.json();

        setDashboardData({
          lowStockItems: lowStockData,
          pendingBills: pendingBillsData,
          stockInOutData: stockStatsData,
          monthlyRevenue: revenueData,
          loading: false
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setDashboardData({ ...dashboardData, loading: false });
      }
    };

    fetchDashboardData();
  }, [stockFilter, dateRange]);

  const handleReorder = async (item) => {
    try {
      await fetch('/api/stock/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item._id, quantity: reorderQuantity })
      });
      const lowStockRes = await fetch(`/api/stock/low?threshold=${stockFilter}`);
      const lowStockData = await lowStockRes.json();
      setDashboardData({ ...dashboardData, lowStockItems: lowStockData });
      setSelectedItem(null);
      setReorderQuantity(0);
    } catch (error) {
      console.error('Error reordering:', error);
    }
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

  // Revenue Graph Data
  const revenueGraphData = {
    labels: dashboardData.monthlyRevenue?.labels || [],
    datasets: [
      {
        label: 'Revenue',
        data: dashboardData.monthlyRevenue?.values || [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ]
  };

  // CSV Export Data
  const lowStockCSVData = dashboardData.lowStockItems?.map(item => ({
    name: item.name,
    quantity: item.quantity,
    status: item.quantity === 0 ? 'Out of Stock' : 'Low Stock'
  }));

  const pendingBillsCSVData = dashboardData.pendingBills?.map(bill => ({
    billNumber: bill.billNumber,
    customerName: bill.customerName,
    amount: bill.amount,
    dueDate: new Date(bill.dueDate).toLocaleDateString()
  }));

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
            //   background: #e0e0e0;
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
            //   background: #e0e0e0;
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
          {/* <input
            type="date"
            value={dateRange.start.toISOString().split('T')[0]}
            onChange={(e) => setDateRange({ ...dateRange, start: new Date(e.target.value) })}
            className="form-control form-control-sm me-2"
          />
          <input
            type="date"
            value={dateRange.end.toISOString().split('T')[0]}
            onChange={(e) => setDateRange({ ...dateRange, end: new Date(e.target.value) })}
            className="form-control form-control-sm"
          /> */}
          Date Range: 
          <div className="mx-2" >
            <DatePicker dateFormat="yyyy/MM/dd" required name="date" selected={dateRange.start.toISOString().split('T')[0]} className="form-control" aria-describedby="emailHelp" value={dateRange.start.toISOString().split('T')[0]}  onChange={(e) => setDateRange({ ...dateRange, start: new Date(e.target.value) })}/>
          </div>
          <div>
            <DatePicker dateFormat="yyyy/MM/dd" required name="date" selected={dateRange.end.toISOString().split('T')[0]} className="form-control" aria-describedby="emailHelp" value={dateRange.end.toISOString().split('T')[0]} onChange={(e) => setDateRange({ ...dateRange, end: new Date(e.target.value) })}/>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Row 1: Key Metrics */}
        <div className="col-12 col-md-3">
          <div className="card p-3">
            <h5 className="card-title mb-2">Total Stock Value</h5>
            <p className="card-text display-6 text-primary mb-0">
              ${dashboardData.stockInOutData?.totalValue?.toLocaleString() || 0}
            </p>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card p-3">
            <h5 className="card-title mb-2">Pending Bills</h5>
            <p className="card-text display-6 text-danger mb-0">
              ${dashboardData.pendingBills?.reduce((sum, bill) => sum + bill.amount, 0)?.toLocaleString() || 0}
            </p>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card p-3">
            <h5 className="card-title mb-2">Low Stock Items</h5>
            <p className="card-text display-6 text-warning mb-0">
              {dashboardData.lowStockItems?.length || 0}
            </p>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card p-3">
            <h5 className="card-title mb-2">Monthly Revenue</h5>
            <p className="card-text display-6 text-success mb-0">
              ${dashboardData.monthlyRevenue?.currentMonth?.toLocaleString() || 0}
            </p>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-3">
        {/* Row 2: Graphs */}
        <div className="col-12 col-md-6">
          <div className="card p-3">
            <h5 className="card-title mb-2">Stock Movement</h5>
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
            <h5 className="card-title mb-2">Revenue Trend</h5>
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
                  type="number"
                  value={stockFilter}
                  onChange={(e) => setStockFilter(parseInt(e.target.value))}
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
                {dashboardData.pendingBills?.map((bill) => (
                  <tr key={bill._id}>
                    <td>{bill.billNumber}</td>
                    <td>{bill.customerName}</td>
                    <td>${bill.amount.toLocaleString()}</td>
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
                <p className="mb-1">Amount: ${selectedBill.amount?.toLocaleString()}</p>
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