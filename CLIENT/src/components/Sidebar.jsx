import { React, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT

function Sidebar() {
  const [userType, setUserType] = useState('');
  const getUserType = async (token) => {
    const response = await fetch(`${HOST}:${PORT}/server/auth/user`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response){
      const result = await response.json();
      if (response.ok){
        setUserType(result.doc.user_type)
      } else{
        setError(result.msg);
      }
    } else{
      setError("We are unable to process now. Please try again later.")
    }
  }
  useEffect(() => {
    const token = sessionStorage.getItem('token');
    getUserType(token)
  }, []);
  return (
    <div className="sidebar">
        <NavLink to="/home" className={({ isActive }) => (isActive ? 'active' : '')} end>Home</NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>Dashboard</NavLink>
        {(userType == "ADMIN") &&<NavLink to="/support-admins" className={({ isActive }) => (isActive ? 'active' : '')}>Support Admin</NavLink>}
        {((userType == "ADMIN") || (userType == "SUPPORTADMIN")) &&<NavLink to="/companies" className={({ isActive }) => (isActive ? 'active' : '')}>Companies</NavLink>}
        {((userType == "ADMIN") || (userType == "SUPPORTADMIN") || (userType == "COMPANY")) &&<NavLink to="/operators" className={({ isActive }) => (isActive ? 'active' : '')}>Operators</NavLink>}
        {((userType == "ADMIN") || (userType == "SUPPORTADMIN")) &&<NavLink to="/categories" className={({ isActive }) => (isActive ? 'active' : '')}>Categories</NavLink>}
        {((userType == "OPERATOR")) &&<NavLink to="/add-stock" className={({ isActive }) => (isActive ? 'active' : '')}>Add Stock</NavLink>}
        {((userType == "COMPANY") || (userType == "OPERATOR")) &&<NavLink to="/stocks" className={({ isActive }) => (isActive ? 'active' : '')}>Stock Details</NavLink>}
        {((userType == "OPERATOR")) &&<NavLink to="/manage-stock" className={({ isActive }) => (isActive ? 'active' : '')}>Manage Stock</NavLink>}
        {((userType == "COMPANY") || (userType == "OPERATOR")) &&<NavLink to="/manage-installation" className={({ isActive }) => (isActive ? 'active' : '')}>Manage Installation</NavLink>}
        {((userType == "COMPANY")) &&<NavLink to="/customize-bill" className={({ isActive }) => (isActive ? 'active' : '')}>Customize Bill</NavLink>}
        {((userType == "COMPANY") || (userType == "OPERATOR")) &&<NavLink to="/customize-add-stock" className={({ isActive }) => (isActive ? 'active' : '')}>Customize Add Stock</NavLink>}
        {((userType == "COMPANY")) &&<NavLink to="/installation-teams" className={({ isActive }) => (isActive ? 'active' : '')}>Installation Teams</NavLink>}
        {((userType == "ADMIN") || (userType == "SUPPORTADMIN") || (userType == "COMPANY") || (userType == "OPERATOR")) &&<NavLink to="/items" className={({ isActive }) => (isActive ? 'active' : '')}>Items</NavLink>}
        {((userType == "COMPANY") || (userType == "OPERATOR")) &&<NavLink to="/sellers" className={({ isActive }) => (isActive ? 'active' : '')}>Sellers</NavLink>}
        {((userType == "COMPANY") || (userType == "OPERATOR")) &&<NavLink to="/buyers" className={({ isActive }) => (isActive ? 'active' : '')}>Buyers</NavLink>}
        
    </div>
  );
}

export default Sidebar;
