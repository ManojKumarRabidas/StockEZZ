// App.jsx
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
import BillingArea from './components/BillingArea';
import ManageStock from './components/ManageStock';
import ManageBills from './components/ManageBills';
import ManageInstallation from './components/ManageInstallation';
import HomePage from './components/HomePage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
// import '../src/assets/lib/css/font-awesome-all.min.css';
import './assets/lib/css/font-awesome-all.min.css';
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
  const [loading, setLoading] = useState(true);

  toastr.options = {
    closeButton: true,
    progressBar: true,
    positionClass: "toast-top-right",
    preventDuplicates: true,
    timeOut: "5000",
  };

  const getUserType = async (token) => {
    try {
      const response = await fetch(`${HOST}:${PORT}/server/auth/user`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const result = await response.json();
        toastr.error(result.msg || "Authentication failed");
        setUserType("ERROR");
        user_type_globle = "ERROR";
      } else {
        const result = await response.json();
        setUserType(result.doc.user_type);
        user_type_globle = result.doc.user_type;
      }
    } catch (error) {
      toastr.error("An error occurred while fetching user type.");
      setUserType("ERROR");
      user_type_globle = "ERROR";
    }
  };

  const checkSession = async () => {
    setLoading(true);
    const expiry = parseInt(localStorage.getItem('tokenExpiry'), 10);
    const now = Date.now();

    if (expiry && now < expiry) {
      setTimeout(() => {
        localStorage.clear();
        window.location.href = '/';
      }, expiry - now);
    } else if (expiry && now >= expiry) {
      localStorage.clear();
      window.location.href = '/';
    }
    const session = localStorage.getItem('token');
    if (session) {
      await getUserType(session);
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkSession();
    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, []);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="App">
      <BrowserRouter>
        <AppContent isAuthenticated={isAuthenticated} userType={userType} />
      </BrowserRouter>
    </div>
  );
}

function AppContent({ isAuthenticated, userType }) {
  const location = useLocation();
  const path = location.pathname;

  if (!isAuthenticated && path !== '/' && path !== '/login') {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated) {
    if (userType === 'ERROR') {
      return <Navigate to="/error-404" replace />;
    }
    if (path === '/' || path === '/login') {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return (
    <>
      {isAuthenticated && path !== '/' && path !== '/login' && path !== '/error-404' && <Navbar />}
      <div className="container-fluid">
        <div className={`${path === '/' || path === '/login' || path === '/error-404' ? 'row ei-row-unrestricted' : 'row ei-row'}`}>
          {isAuthenticated && path !== '/' && path !== '/login' && path !== '/error-404' && <Sidebar />}
          <main className={`${path === '/error-404' ? 'col-12' : (path === '/' ? 'main-section-home': (path === '/login' ? 'col-12 main-section-log-in' : 'col-12 main-section'))}`}>
            <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/login' element={<Login />} />
              <Route path='/error-404' element={<Error404 />} />
              <Route path='/profile' element={userType !== 'ADMIN' ? <Profile /> : <Unauthorized />} />
              <Route path='/user-manual' element={<UserManual />} />
              <Route path='/updates' element={<Updates />} />
              <Route path='/password/*' element={<Password />} />
              <Route path='/home' element={<Home />} />
              <Route path='/dashboard' element={<Dashboard />} />
              <Route path='/support-admins/*' element={userType === 'ADMIN' ? <SupportAdmins /> : <Unauthorized />} />
              <Route path='/companies/*' element={(userType === 'ADMIN' || userType === 'SUPPORTADMIN') ? <Company /> : <Unauthorized />} />
              <Route path='/categories/*' element={(userType === 'ADMIN' || userType === 'SUPPORTADMIN') ? <Category /> : <Unauthorized />} />
              <Route path='/items/*' element={(userType === 'ADMIN' || userType === 'SUPPORTADMIN' || userType === 'COMPANY' || userType === 'OPERATOR') ? <Item /> : <Unauthorized />} />
              <Route path='/operators/*' element={(userType === 'ADMIN' || userType === 'SUPPORTADMIN' || userType === 'COMPANY') ? <Operator /> : <Unauthorized />} />
              <Route path='/customize-add-stock/*' element={(userType === 'OPERATOR' || userType === 'COMPANY') ? <CustomizeAddStock /> : <Unauthorized />} />
              <Route path='/add-stock/*' element={(userType === 'OPERATOR' || userType === 'COMPANY') ? <AddStock /> : <Unauthorized />} />
              <Route path='/buyers/*' element={(userType === 'OPERATOR' || userType === 'COMPANY') ? <Buyer /> : <Unauthorized />} />
              <Route path='/sellers/*' element={(userType === 'OPERATOR' || userType === 'COMPANY') ? <Seller /> : <Unauthorized />} />
              <Route path='/stocks/*' element={(userType === 'OPERATOR' || userType === 'COMPANY') ? <Stocks /> : <Unauthorized />} />
              <Route path='/billing-area/*' element={userType === 'OPERATOR' ? <BillingArea /> : <Unauthorized />} />
              <Route path='/manage-stock/*' element={(userType === 'OPERATOR' || userType === 'COMPANY') ? <ManageStock /> : <Unauthorized />} />
              <Route path='/manage-bills/*' element={(userType === 'OPERATOR' || userType === 'COMPANY') ? <ManageBills /> : <Unauthorized />} />
              <Route path='/manage-installation/*' element={userType === 'OPERATOR' ? <ManageInstallation /> : <Unauthorized />} />
              <Route path='*' element={<Navigate to='/error-404' />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}
