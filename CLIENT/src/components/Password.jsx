import '../App.css'
import ChangePassword from './partials/password/ChangePassword';
import ForgotPassword from './partials/password/ForgotPassword';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import {Route, Routes, Navigate, NavLink} from 'react-router-dom';

export default function Password() {

return (
  <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light inner-navbar">
        <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="change-password">Change Password</NavLink>
        <NavLink className={({ isActive }) => (isActive ? 'active navbar-brand inner-nav-item' : 'navbar-brand inner-nav-item')} to="forgot-password">Forgot Password</NavLink>
      </nav>

      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <Routes>
              <Route path="/" element={<Navigate to="change-password" />} />
              <Route path='change-password' element={<ChangePassword />} />
              <Route path='forgot-password' element={<ForgotPassword />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  )
}