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
        {(userType == "ADMIN") &&<NavLink to="/support-admins" className={({ isActive }) => (isActive ? 'active' : '')}>Support Admin</NavLink>}
        {((userType == "ADMIN") || (userType == "SUPPORTADMIN")) &&<NavLink to="/companies" className={({ isActive }) => (isActive ? 'active' : '')}>Companies</NavLink>}
        
    </div>
  );
}

export default Sidebar;
