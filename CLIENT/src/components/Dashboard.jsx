import "../App.css";
import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { CSVLink } from 'react-csv';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toastr from 'toastr';

const token = localStorage.getItem('token');
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const userType = localStorage.getItem('seUserType');

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const [dashboardContent, setDashboardContent] = useState(true);
  const [loading, setLoading] = useState(true)
  const [stockFilter, setStockFilter] = useState(10);
  const [itemName, setItemName] = useState("");
  const [chartType, setChartType] = useState("BAR");
  const [dateRange, setDateRange] = useState(() => {
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    // Adjust the date to match today's date exactly
    sixMonthsAgo.setDate(today.getDate());

    return {
      start: sixMonthsAgo,
      end: today,
    };
  });
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedBill, setSelectedBill] = useState(null);
  const [reorderQuantity, setReorderQuantity] = useState(0);

  const [matricsData, setMatricsData] = useState({});
  const [financialData, setFinancialData] = useState({stockMovement: []});
  const [stockMovementData, setStockMovementData] = useState({});
  const [lowStockData, setlowStockData] = useState([]);

  const handleStockMovement = (item, data) => {
    let temp;
    if(data){
      temp = data.find((elem)=> elem.item == item)
    } else{
      temp = financialData.stockMovement.find((elem)=> elem.item == item)
    }
    setItemName(item);
    setStockMovementData(temp);
  }
  // Function to fetch financial data (Revenue, Profit, Stock Movement)
  const fetchFinancialData = async () => {
    try {
      const response = await fetch(`${VITE_API_BASE_URL}/server/financials?start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`,
        {headers: { 'Authorization': `Bearer ${token}`}}
      );
      const result = await response.json();
      if (response.ok) {
        setFinancialData(result.doc);
        handleStockMovement(result.doc.stockMovement[0] ? result.doc.stockMovement[0].item: "", result.doc.stockMovement) 
      } else {
        toastr.error(result.msg);
      }
    } catch (err) {
      toastr.error('Failed to fetch financial data ');
    }
  };

  // Function to fetch metrics data (called only on page load)
  const fetchMetricsData = async () => {
    try {
      const response = await fetch(
        `${VITE_API_BASE_URL}/server/metrics`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const result = await response.json();
      if (response.ok) {
        setMatricsData(result.doc);
      } else {
        toastr.error(result.msg);
      }
    } catch (err) {
      toastr.error('Failed to fetch metrics data');
    }
  };

  // Function to fetch low stock items
  const fetchLowStockItems = async () => {
    try {
      if(!stockFilter){
        return;
      // } else if(typeof(stockFilter) == "NaN"){
      //   return;
      } else if(typeof(stockFilter) != "number"){
        toastr.error("Invalid number to filter.")
        return;
      }
      const response = await fetch(
        `${VITE_API_BASE_URL}/server/stock/low?threshold=${stockFilter}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      const result = await response.json();
      if (response.ok) {
        setlowStockData(result.docs)
      } else {
        toastr.error(result.msg);
      }
    } catch (err) {
      toastr.error('Failed to fetch low stock items');
    }
  };

  // Initial page load effect
  const fetchInitialData = async () => {
    setLoading(true)
    await Promise.all([
      fetchFinancialData(),
      fetchMetricsData(),
      fetchLowStockItems()
    ]);
    setLoading(false)
  };
  useEffect(() => {
    if(userType == "ADMIN" || userType == "SUPPORTADMIN"){
      setDashboardContent(false)
    setLoading(false)
    } else {
      setDashboardContent(true)
      fetchInitialData();
    }
  }, []);

  // Effect for date range and stock filter changes
  useEffect(() => {
    if(!(userType == "ADMIN" || userType == "SUPPORTADMIN")){fetchFinancialData();}
    
  }, [dateRange]);

  useEffect(() => {
    if(!(userType == "ADMIN" || userType == "SUPPORTADMIN")){fetchLowStockItems();}
  }, [stockFilter]);



  // Stock In/Out Graph Data
  const stockGraphData = {
    labels: (stockMovementData?.stockInOut ? stockMovementData?.stockInOut.map(item => item.month): []) || [],
    datasets: [
      {
        label: 'Stock In',
        data: (stockMovementData?.stockInOut ? stockMovementData?.stockInOut.map(item => item.stockIn): []) || [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Stock Out',
        data: (stockMovementData?.stockInOut ? stockMovementData?.stockInOut.map(item => item.stockOut): []) || [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }
    ]
  };

  // Revenue & Profit Graph Data
  const profitRevenueGraphData = {
    labels: (financialData?.profitRevenue ? financialData?.profitRevenue.map(item => item.month): []) || [],
    datasets: [
      {
        label: 'Revenue',
        data: (financialData?.profitRevenue? financialData?.profitRevenue.map(item => item.Revenue): []) || [],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Profit',
        data: (financialData?.profitRevenue? financialData?.profitRevenue.map(item => item.Profit): []) || [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ]
  };

  // CSV Export Data
  const lowStockCSVData = lowStockData?.flatMap(item => 
    item.lowStockDescriptions.length > 0 
        ? item.lowStockDescriptions.map(stock => ({
            "Item Code": item.code,
            "Item Name": item.name,
            "Quantity": stock.available_quantity,
            "Description": stock.description,
            "Status": stock.quantity === 0 ? 'Out of Stock' : 'Low Stock'
        }))
        : [{
            "Item Code": item.code,
            "Item Name": item.name,
            "Quantity": 0,
            "Description": "N/A",
            "Status": 'Out of Stock'
        }]
);

  const pendingBillsCSVData = matricsData?.bills?.map(bill => ({
    "Date": bill.date,
    "Bill Number": bill.bill_no,
    "Total Amount": bill.grand_total,
    "Pending Amount": bill.remaining_amount,
    "Installation": bill.installation_status,
    "Customer Name": bill.buyer_name,
    "Customer Phone": bill.buyer_phone,
    "Customer Email Id": bill.buyer_email,
    "Customer Address": bill.buyer_address,
    "Customer PIN Code": bill.buyer_pin,
  })) || [];

  if (loading) {
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

  if(!dashboardContent){
    return (
      <div className="container-fluid p-3" style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
        Welcome Admin / Support Admin
        </div>
    )
  }
  if(dashboardContent){
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
          </div>
        </div>

        <div className="row g-3">
          {/* Row 1: Key Metrics */}
          <div className="col">
            <div className="card p-3">
              <h5 className="card-title mb-2">Total Stock Value</h5>
              <p className="card-text display-6 text-primary mb-0">
                ₹{matricsData?.totalStockValue?.toLocaleString() || 0}
              </p>
            </div>
          </div>
          <div className="col">
            <div className="card p-3">
              <h5 className="card-title mb-2">Total Pending Bills</h5>
              <p className="card-text display-6 text-danger mb-0">
                ₹{matricsData?.totalPendingBills?.toLocaleString() || 0}
              </p>
            </div>
          </div>
          <div className="col">
            <div className="card p-3">
              <h5 className="card-title mb-2 d-flex align-items-center">Total Install <p style={{fontSize:"0.9rem", margin: "0", padding: "0"}}> (Pending)</p></h5>
              <p className="card-text display-6 text-warning mb-0">
                {matricsData?.totalPendingInstallation || 0}
              </p>
            </div>
          </div>
          <div className="col">
            <div className="card p-3">
              <h5 className="card-title mb-2">Revenue</h5>
              <p className="card-text display-6 text-info mb-0">
                ₹{financialData?.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
          </div>
          <div className="col">
            <div className="card p-3">
              <h5 className="card-title mb-2">Profit</h5>
              <p className="card-text display-6 text-success mb-0">
              ₹{financialData?.totalProfit?.toLocaleString() || 0}
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
                <select style={{maxWidth: "15rem"}} className="form-select" aria-label="Default select example" value={itemName} name="itemName" onChange={(e) => handleStockMovement(e.target.value)}>
                    {financialData?.stockMovement.map((item)=>(
                      <option key={item.item} value={item.item}>{item.item}</option>
                    ))}
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
            <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-2">Revenue & Profit</h5>
                <select style={{maxWidth: "15rem"}} className="form-select" aria-label="Default select example" value={chartType} name="chartType" onChange={(e) => setChartType(e.target.value)}>
                    <option value="BAR">BAR Chart</option>
                    <option value="LINE">LINE Chart</option>
                </select>
              </div> 
              {chartType == "BAR" && 
              <Bar 
                data={profitRevenueGraphData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' },
                  }
                }}
              />
              }
              {chartType == "LINE" && 
              <Line 
                data={profitRevenueGraphData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { position: 'bottom' },
                  }
                }}
              />
              }
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
              <div className="overflow-scroll" style={{maxHeight: "25rem", minHeight: "25rem", overflowY: "auto",scrollbarWidth: "none", "msOverflowStyle": "none"}}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th>Total Available</th>
                      <th>Status</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockData?.map((item) => (
                      <tr key={item._id}>
                        <td>{item.name}</td>
                        <td>{item.total_quantity}</td>
                        <td>
                          <span className={`badge ${item.total_quantity === 0 ? 'bg-danger' : 'bg-warning'}`}>
                            {item.total_quantity === 0 ? 'Out of Stock' : 'Low Stock'}
                          </span>
                        </td>
                        <td className="d-flex align-items-center justify-content-center">
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => setSelectedItem(item)}>
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
              <div className="overflow-scroll" style={{maxHeight: "25rem", minHeight: "25rem", overflowY: "auto",scrollbarWidth: "none", "msOverflowStyle": "none"}}>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Bill No</th>
                      <th>Amount</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matricsData?.bills?.map((bill) => (
                      <tr key={bill._id}>
                        <td>{bill.bill_no}</td>
                        <td>₹{bill.remaining_amount.toLocaleString()}</td>
                        <td style={{textWrap: "nowrap"}}>{bill.buyer_name}</td>
                        <td>{bill.date}</td>
                        {/* <td>
                          <span className={new Date(bill.date) < new Date() ? 'badge bg-danger' : 'badge bg-secondary'}>
                            {bill.date}
                          </span>
                        </td> */}
                        <td className="d-flex align-items-center justify-content-center">
                          <button className="btn btn-outline-secondary btn-sm" onClick={() => setSelectedBill(bill)}>
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
        </div>

        {/* Reorder Dialog */}
        {selectedItem && (
          <div className="modal" tabIndex="-1" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Stock Details of {selectedItem.name}</h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedItem(null)}></button>
                </div>
                <div className="modal-body">
                  <table className="table table-striped">
                    <tbody>
                      <tr>
                        <td>Item</td>
                        <td>: {selectedItem.name}</td>
                      </tr>
                      <tr>
                        <td>Current Stock</td>
                        <td>: {selectedItem.total_quantity}</td>
                      </tr>
                      <tr>
                        <td>Minimum Stock Level</td>
                        <td>: {selectedItem.minStockLevel || 'Not set'}</td>
                      </tr>
                    </tbody>
                  </table>
                  <hr />
                  {selectedItem.lowStockDescriptions.length>0 && <div className="scroll-hidden-2" style={{maxHeight: "46vh"}}>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Description</th>
                          <th>Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedItem.lowStockDescriptions.map((item)=>(
                        <tr>
                          <td className={item.available_quantity === 0 ? "bg-danger text-light": ""}>{item.description}</td>
                          <td className={item.available_quantity === 0 ? "bg-danger text-light": ""}>{item.available_quantity}</td>
                        </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>}
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setSelectedItem(null)}>Cancel</button>
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
                  <h5 className="modal-title"> <strong>Bill Details of - {selectedBill.bill_no}</strong></h5>
                  <button type="button" className="btn-close" onClick={() => setSelectedBill(null)}></button>
                </div>
                <div className="modal-body">
                  <table className="table table-striped">
                    <tbody>
                      <tr>
                        <td>Billing Date</td>
                        <td>: {selectedBill.date}</td>
                      </tr>
                      <tr>
                        <td>Customer Name</td>
                        <td>: {selectedBill.buyer_name}</td>
                      </tr>
                      <tr>
                        <td>Customer Phone</td>
                        <td>: {selectedBill.buyer_phone}</td>
                      </tr>
                      <tr>
                        <td>Customer Email</td>
                        <td>: {selectedBill.buyer_email}</td>
                      </tr>
                      <tr>
                        <td>Customer PIN</td>
                        <td>: {selectedBill.buyer_pin}</td>
                      </tr>
                      <tr>
                        <td>Customer Address</td>
                        <td>: {selectedBill.buyer_address}</td>
                      </tr>
                      <tr>
                        <td>Total Amount</td>
                        <td>: ₹{selectedBill.grand_total?.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td>Pending Amount</td>
                        <td>: ₹{selectedBill.remaining_amount?.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td>Installation</td>
                        <td>: {selectedBill.installation_status}</td>
                      </tr>
                    </tbody>
                  </table>
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
  }
};

export default Dashboard;