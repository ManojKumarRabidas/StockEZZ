import React, { useState } from "react";
import { useNavigate , Link} from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT

function Login() {
  const [login_id, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (event) => {
    event.preventDefault();
    if ( !login_id || !password ){
        setError("Please enter login id and password.");
        return;
    }
    const loginData = { login_id, password};
    const response = await fetch(`${HOST}:${PORT}/server/login`, {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: {"Content-Type": "application/json"},
    });
    if (response){
      const result = await response.json();
      if (response.ok){
        sessionStorage.setItem('token', result.token);
        sessionStorage.setItem('eiUserName', result.userName);
        window.dispatchEvent(new Event('storage'));
        navigate("/home");
        location.reload()
      } else{
        setError(result.msg);
      }
    } else{
      setError("We are unable to process now. Please try again later.")
    }
    setTimeout(() => {
      setResponse("");
      setError("");
    }, 6000);
  };

  return (
    <div className="container my-2 shadow-sm p-5 mb-5 bg-body-tertiary rounded">
      <h3 className="text-center mb-5">StockEZZ</h3>
      {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
      {response && (<div className="alert alert-success" role="alert">{response}</div>)}

      <form onSubmit={handleSubmit}>
        
        <div className="mb-3">
          <label className="form-label">Login Id <span className="ei-col-red">*</span></label>
          <input name="login_id" type="text" className="form-control" aria-describedby="emailHelp" value={login_id} onChange={(e) => setLoginId(e.target.value)}/>
        </div>
        <div className="mb-3">
          <label className="form-label">Password <span className="ei-col-red">*</span></label>
          <input name="password" type="password" className="form-control" aria-describedby="emailHelp" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <div className="log-in-buttons">
          <button type="submit" className="btn btn-primary my-2">Log In</button>
          <Link to="/"><button className="btn btn-primary my-2">Forgot Login Id</button></Link>
          <Link to="/"><button className="btn btn-primary my-2">Forgot Password</button></Link>
        </div>
      </form>
    </div>
  );
}
export default Login;