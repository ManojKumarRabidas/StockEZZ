import './App.css';
import Login from "./components/Login";
import Error404 from "./components/Error404";
import Unauthorized from "./components/Unauthorized";
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './components/Home';
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
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
// import './assets/lib/font-awesome-all-min.css'
import '../src/assets/lib/font-awesome-all.min.css'
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT

let user_type_globle;
export default function App() {
  const [userType, setUserType] = useState("");
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
      const response = await fetch(`${HOST}:${PORT}/server/auth/user`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response){
        const result = await response.json();
        if (response.ok){
          setUserType(result.doc.user_type);
          user_type_globle = result.doc.user_type;
        } else{
          setUserType("ERROR");
          user_type_globle = "ERROR";
          toastr.error(result.msg);
        }
      } else{
        toastr.error("We are unable to process now. Please try again later.")
      }
    }
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const checkSession = () => {
    const session = sessionStorage.getItem('token');
    if (session){getUserType(session)}
    setIsAuthenticated(session);
  };

  useEffect(() => {
    checkSession();
    window.addEventListener('storage', checkSession);
    return () => window.removeEventListener('storage', checkSession);
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <AppContent isAuthenticated={(isAuthenticated, userType)} />
      </BrowserRouter>
    </div>
  );
}

function AppContent({ isAuthenticated, userType }) {
  const user_type = user_type_globle;
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const error404Page = location.pathname === '/error-404';
  if (!isAuthenticated && !isLoginPage ) {
    return <Navigate to='/login' replace />;
  }

  if (isAuthenticated && (isLoginPage)) {
    if (user_type != "ERROR") {
      return <Navigate to='/home' replace />;
    } else{
      return <Navigate to='/error-404' replace />
    }
  }
  return (
    <>
      {isAuthenticated && !isLoginPage && !error404Page && <Navbar />}
      <div className="container-fluid">
        <div className={`${ isLoginPage || error404Page ? 'row ei-row-unrestricted' : 'row ei-row'}`}>
          {isAuthenticated && !isLoginPage && !error404Page && <Sidebar />}
          <main className={`${ error404Page ? 'col-12 main-section-registration': (isLoginPage ? 'col-12 main-section-log-in': 'col-12 main-section')}`}>
            <Routes>
              <Route path='/' element={<Navigate to={isAuthenticated ? '/home' : '/login'} replace />} />
              <Route path='/login' element={<Login />} />
              <Route path='/error-404' element={<Error404 />} />
              <Route path='/home' element={<Home />} />
              <Route path='/support-admins/*' element={user_type === 'ADMIN' ? <SupportAdmins /> : <Unauthorized />} />
              <Route path='/companies/*' element={((user_type ==='ADMIN') || (user_type ==='SUPPORTADMIN')) ? <Company /> : <Unauthorized />} />
              <Route path='/categories/*' element={((user_type ==='ADMIN') || (user_type ==='SUPPORTADMIN')) ? <Category /> : <Unauthorized />} />
              <Route path='/items/*' element={((user_type ==='ADMIN') || (user_type ==='SUPPORTADMIN') || (user_type ==='COMPANY')  || (user_type ==='OPERATOR')) ? <Item /> : <Unauthorized />} />
              <Route path='/operators/*' element={((user_type ==='ADMIN') || (user_type ==='SUPPORTADMIN') || (user_type ==='COMPANY')) ? <Operator /> : <Unauthorized />} />
              <Route path='/customize-add-stock/*' element={((user_type ==='OPERATOR') || (user_type ==='COMPANY')) ? <CustomizeAddStock /> : <Unauthorized />} />
              <Route path='/add-stock/*' element={((user_type ==='OPERATOR') || (user_type ==='COMPANY'))  ? <AddStock /> : <Unauthorized />} />
              <Route path='/buyers/*' element={((user_type ==='OPERATOR') || (user_type ==='COMPANY'))  ? <Buyer /> : <Unauthorized />} />
              <Route path='/sellers/*' element={((user_type ==='OPERATOR') || (user_type ==='COMPANY'))  ? <Seller /> : <Unauthorized />} />
              <Route path='/stocks/*' element={((user_type ==='OPERATOR') || (user_type ==='COMPANY'))  ? <Stocks /> : <Unauthorized />} />
              <Route path='/manage-stocks/*' element={(user_type ==='OPERATOR')  ? <ManageStock /> : <Unauthorized />} />
            </Routes>
          </main>
        </div>
      </div>
    </>
  );
}
