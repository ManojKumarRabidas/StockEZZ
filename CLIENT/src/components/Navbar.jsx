import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT

function Navbar() {
  const [userName, setUserName] = useState('');
  const [userType, setUserType] = useState('');
  const navigate = useNavigate();
  const getUserType = async (token) => {
    const response = await fetch(`${HOST}:${PORT}/server/auth/user`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response){
      const result = await response.json();
      if (response.ok){
        setUserType(result.doc.user_type)
        setUserName(result.doc.name);
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

  const handleLogout = async () => {
    sessionStorage.removeItem('eiUserName');
    sessionStorage.removeItem('token');
    window.dispatchEvent(new Event('storage'));
    await fetch(`${HOST}:${PORT}/server/logout`, {
      method: 'POST'
    });
    location.reload()
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg fixed-top">
      <div className="container-fluid">
        <div className="navbar-brand" style={{padding: "0"}}>
          {/* <Link className="nav-link active" to="/"> <img style={{maxWidth: "3rem", margin: "0rem -0.5rem 0rem 0rem"}} src="../src/assets/images/eduInsights-logo-2.png" alt="" /> StockEZZ</Link> */}
          <Link className="nav-link active" to="/" style={{color: "white"}}> StockEZZ</Link>
        </div>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item dropdown" >
              <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">{userName || 'User'}</a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                <li><hr className="dropdown-divider" /></li>
                <li><Link className="dropdown-item" to="/profile">Profile</Link></li>
                <li><Link className="dropdown-item" to="/password">Password</Link></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#" onClick={handleLogout}>Sign Out</a></li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
