import './App.css';
import Login from "./components/Login";
import Error404 from "./components/Error404";
import Unauthorized from "./components/Unauthorized";
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Profile from './components/Profile';
import UserManual from './components/UserManual';
import Updates from './components/Updates';
import Password from './components/Password';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import SupportAdmins from './components/SupportAdmin';
import Company from './components/Company';
import Category from './components/Category';
import Item from './components/Item';
import Operator from './components/Operator';
import CustomizeAddStock from './components/CustomizeAddStock';
import AddStock from './components/AddStock';
import Buyer from './components/Buyers';
import Seller from './components/Sellers';
import Stocks from './components/StockDetails';
import ManageStock from './components/ManageStock';
import ManageBills from './components/ManageBills';
import ManageInstallation from './components/ManageInstallation';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../src/assets/lib/font-awesome-all.min.css';
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';

const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

let user_type_globle;

export default function App() {
  const [userType, setUserType] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state

  toastr.options = {
    "closeButton": true,
    "debug": false,
    "newestOnTop": false,
    "progressBar": true,
    "positionClass": "toast-top-right",
    "preventDuplicates": true,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
  };

  const getUserType = async (token) => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/auth/user`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response) {
        const result = await response.json();
        if (response.ok) {
          setUserType(result.doc.user_type);
          user_type_globle = result.doc.user_type;
        } else {
          setUserType("ERROR");
          user_type_globle = "ERROR";
          toastr.error(result.msg);
        }
      } else {
        toastr.error("We are unable to process now. Please try again later.");
      }
    } catch (error) {
      toastr.error("An error occurred while fetching user type.");
    }
  };

  const checkSession = async () => {
    setLoading(true); // Start loading
    const session = sessionStorage.getItem('token');
    if (session) {
      await getUserType(session); // Fetch user type
    }
    setIsAuthenticated(!!session);
    setLoading(false); // End loading
  };

  useEffect(() => {
    checkSession();
    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, []);

  // Shimmer effect while loading
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
              animation: shimmer 1.5s infinite linear;
            }

            @keyframes shimmer {
              0% { background-position: -800px 0; }
              100% { background-position: 800px 0; }
            }

            .shimmer-container {
              background: #e0e0e0;
              border-radius: 8px;
              overflow: hidden;
              height: 150px;
              margin-bottom: 15px;
              animation: inherit;
            }

            .shimmer-header {
              height: 60px;
              margin-bottom: 15px;
              animation: inherit;
            }

            .shimmer-table {
              height: 200px;
              animation: inherit;
            }

            .shimmer-table-row {
              height: 40px;
              background: #e0e0e0;
              margin-bottom: 10px;
              border-radius: 4px;
              animation: inherit;
            }

            .shimmer-sidebar {
              background: #e0e0e0;
              height: 100vh;
              width: 250px;
              border-radius: 8px;
              animation: inherit;
            }
            .shimmer-navbar {
              background: #e0e0e0;
              height: 8vh;
              width: 97vw;
              border-radius: 8px;
              animation: inherit;
            }
          `}
        </style>
        <div className="">
          <div>
            <div className="mb-2 shimmer shimmer-navbar"></div>
          </div>
          <div className="row ei-row">
            <div className="col-12 col-md-2">
              <div className="shimmer shimmer-sidebar"></div>
            </div>
            <div className="col-12 col-md-10" style={{ width: '81.8%'}}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="shimmer shimmer-container shimmer-header" style={{ width: '100%', flex: '1' }}></div>
                <div className="d-flex" style={{ width: '240px' }}>
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
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <AppContent isAuthenticated={isAuthenticated} userType={userType} />
      </BrowserRouter>
    </div>
  );
}

function AppContent({ isAuthenticated, userType }) {
  const user_type = user_type_globle;
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const error404Page = location.pathname === '/error-404';

  if (!isAuthenticated && !isLoginPage) {
    return <Navigate to='/login' replace />;
  }

  if (isAuthenticated && isLoginPage) {
    if (user_type !== "ERROR") {
      return <Navigate to='/dashboard' replace />;
    } else {
      return <Navigate to='/error-404' replace />;
    }
  }

  return (
    <>
      {isAuthenticated && !isLoginPage && !error404Page && <Navbar />}
      <div className="container-fluid">
        <div className={`${isLoginPage || error404Page ? 'row ei-row-unrestricted' : 'row ei-row'}`}>
          {isAuthenticated && !isLoginPage && !error404Page && <Sidebar />}
          <main className={`${error404Page ? 'col-12 main-section-registration' : (isLoginPage ? 'col-12 main-section-log-in' : 'col-12 main-section')}`}>
            <Routes>
              <Route path='/' element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
              <Route path='/login' element={<Login />} />
              <Route path='/error-404' element={<Error404 />} />
              <Route path='/profile' element={user_type !== 'ADMIN' ? <Profile /> : <Unauthorized />} />
              <Route path='/user-manual' element={<UserManual />} />
              <Route path='/updates' element={<Updates />} />
              <Route path='/password/*' element={<Password />} />
              <Route path='/home' element={<Home />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/support-admins/*' element={user_type === 'ADMIN' ? <SupportAdmins /> : <Unauthorized />} />
              <Route path='/companies/*' element={(user_type === 'ADMIN' || user_type === 'SUPPORTADMIN') ? <Company /> : <Unauthorized />} />
              <Route path='/categories/*' element={(user_type === 'ADMIN' || user_type === 'SUPPORTADMIN') ? <Category /> : <Unauthorized />} />
              <Route path='/items/*' element={(user_type === 'ADMIN' || user_type === 'SUPPORTADMIN' || user_type === 'COMPANY' || user_type === 'OPERATOR') ? <Item /> : <Unauthorized />} />
              <Route path='/operators/*' element={(user_type === 'ADMIN' || user_type === 'SUPPORTADMIN' || user_type === 'COMPANY') ? <Operator /> : <Unauthorized />} />
              <Route path='/customize-add-stock/*' element={(user_type === 'OPERATOR' || user_type === 'COMPANY') ? <CustomizeAddStock /> : <Unauthorized />} />
              <Route path='/add-stock/*' element={(user_type === 'OPERATOR' || user_type === 'COMPANY') ? <AddStock /> : <Unauthorized />} />
              <Route path='/buyers/*' element={(user_type === 'OPERATOR' || user_type === 'COMPANY') ? <Buyer /> : <Unauthorized />} />
              <Route path='/sellers/*' element={(user_type === 'OPERATOR' || user_type === 'COMPANY') ? <Seller /> : <Unauthorized />} />
              <Route path='/stocks/*' element={(user_type === 'OPERATOR' || user_type === 'COMPANY') ? <Stocks /> : <Unauthorized />} />
              <Route path='/manage-stocks/*' element={user_type === 'OPERATOR' ? <ManageStock /> : <Unauthorized />} />
              <Route path='/manage-bills/*' element={(user_type === 'OPERATOR' || user_type === 'COMPANY') ? <ManageBills /> : <Unauthorized />} />
              <Route path='/manage-installation/*' element={user_type === 'OPERATOR' ? <ManageInstallation /> : <Unauthorized />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}