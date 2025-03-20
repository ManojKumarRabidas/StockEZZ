import React, { useState } from "react";
import { useNavigate , Link} from "react-router-dom";
const HOST = import.meta.env.VITE_HOST
const PORT = import.meta.env.VITE_PORT

function Login() {
  const [stage, setStage] = useState(0);
  const [user_id, setUserId] = useState("");
  const [login_id, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [user_code, setUserCode] = useState("");
  const [user_email, setUserEmail] = useState("");
  const [user_type, setUserType] = useState("");
  const [otp, setOtp] = useState("");
  const [new_password, setNewPassword] = useState("");
  const [confirm_password, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (event) => {
    try{
      setTimeout(() => {
        setResponse("");
        setError("");
      }, 3000);
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
          sessionStorage.setItem('seUserType', result.userType);
          sessionStorage.setItem('seUserName', result.userName);
          sessionStorage.setItem('seCode', result.code);
          window.dispatchEvent(new Event('storage'));
          // navigate("/home");
          location.reload()
        } else{
          setError(result.msg);
        }
      } else{
        setError("We are unable to process now. Please try again later.")
      }
    } catch(err){
      setError("We are unable to process now. Please try again later.")
    }
  };
  const sendOtp = async()=>{
    try{
        setTimeout(() => {
            setResponse("");
            setError("");
        }, 3000);
        if(!user_type || !user_code || !user_email){
            setError("Enter user type, code and email");
            return;
        }
    const response = await fetch(`${HOST}:${PORT}/server/outer-forgot-password-send-otp`, {
        method: "POST",
        body: JSON.stringify({user_type, user_code, user_email}),
        headers: { 
        "Content-Type": "application/json",
        },
    });
    if (response){
        const result = await response.json();
        if (response.ok){
            if(result.doc){
              setUserId(result.doc._id);
              setResponse("OTP send to your registered email.")
              setStage(3)
            } else{
              setError("We are unable to process now. Please try again later.")
            }
        } else{
            setError(result.msg);
        }
    } else{
        setError("We are unable to process now. Please try again later.")
    }
    } catch(err){
        setError("We are unable to process now. Please try again later.")
    }
    
  }
  const checkOtp = async()=>{
        setTimeout(() => {
          setResponse("");
          setError("");
      }, 3000);
      if(!otp){
        return setError("Please enter OTP to continue.");
      }
      try{
      const response = await fetch(`${HOST}:${PORT}/server/outer-forgot-password-check-otp`, {
          method: "POST",
          body: JSON.stringify({otp, user_id}),
          headers: { 
          "Content-Type": "application/json",
          },
      });
      if (response){
          const result = await response.json();
          if (response.ok && result.status){
            setStage(5)
          } else{
            setError(result.msg);
          }
      } else{
        setError("We are unable to process now. Please try again later.")
      }
      }catch(err){
        setError("We are unable to process now. Please try again later.")
      }
  }
  const changePassword = async()=>{
      setTimeout(() => {
        setResponse("");
        setError("");
      }, 3000);
      if(!new_password || !confirm_password){
        setError("Please enter both password and confirm password.")
        return;
      }
      if(new_password != confirm_password){
        setError("Password and confirm password must be same.")
        return;
      }
      try{
      const response = await fetch(`${HOST}:${PORT}/server/outer-forgot-password-change-password`, {
          method: "POST",
          body: JSON.stringify({password: new_password, user_id: user_id}),
          headers: { 
          "Content-Type": "application/json",
          },
      });
      if (response){
          const result = await response.json();
          if (response.ok && result.status){
            // setResponse("Password reset successfull. Please wait a moment, we are redirecting you to the log in page.")
            setStage(6)
          } else{
            setError(result.msg);
          }
      } else{
        setError("We are unable to process now. Please try again later.")
      }
      }catch(err){
        console.log(err)
        setError("We are unable to process now. Please try again later.")
      }
  }

  return (
    <>
    <style>{`
        a{
            text-decoration: underline !important;
            cursor: pointer;
        }
        // container {
        //   position: relative;
        //   z-index: 1;
        //   background-color: rgba(0, 0, 0, 0.8) !important;
        //   color: #000; 
        // }
        // container > * {
        //     opacity: 1 !important; /* Full opacity for all direct child elements */
        //     color: #333; /* Dark color for content (slightly lighter than pure black) */
        // }
      `}</style>
    
    <div className="container my-2 shadow-sm p-5 mb-5 bg-body-tertiary rounded">
      <div className="d-flex align-items-center justify-content-center mb-2">
        {/* <img style={{maxWidth: "12rem", margin: "0rem -0.5rem 0rem 0rem"}} src="../src/assets/images/stockEZZ-removebg-2.png" alt="" /> */}
        {stage == 0 && <img style={{maxWidth: "12rem", margin: "0rem -0.5rem 2rem 0rem"}} src="../src/assets/images/stockEZZ.jpg" alt="" />}
      </div>
      {/* <h3 className="text-center mb-5">StockEZZ</h3> */}
      {error && (<div className="alert alert-danger" role="alert">{error}</div>)}
      {response && (<div className="alert alert-success" role="alert">{response}</div>)}
      {stage == 0 && <div>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Login Id <span className="ei-col-red">*</span></label>
            <input name="login_id" type="text" className="form-control" aria-describedby="emailHelp" value={login_id} onChange={(e) => setLoginId(e.target.value)}/>
          </div>
          <div className="mb-3">
            <label className="form-label">Password <span className="ei-col-red">*</span></label>
            <input name="password" type="password" className="form-control" aria-describedby="emailHelp" value={password} onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className="log-in-buttons d-flex flex-column justify-content-center align-items-center">
            <button type="submit" className="btn btn-primary my-3">Log In</button>
            <a className="my-2" onClick={() =>setStage(2)}>Forgot Password</a>
            <a className="my-2" onClick={() =>setStage(1)}>Forgot Login Id</a>
          </div>
        </form>
      </div>}
      {stage == 1 && <div>
          <img style={{maxWidth: "-webkit-fill-available"}} src="https://i.ytimg.com/vi/DYuXf0QeO78/hq720.jpg?sqp=-oaymwE7CK4FEIIDSFryq4qpAy0IARUAAAAAGAElAADIQj0AgKJD8AEB-AH-CYAC0AWKAgwIABABGGUgUyhXMA8=&rs=AOn4CLBpXZJ3tuFMEMwLXIvND9gbJZWHTg" alt="err" srcset="" />
          <h5 className="mt-3">Id vul geya to aa geya Id mangne, Bandwidth ka paisa tera bap varega !!</h5>
          <a className="mx-2"  onClick={() =>setStage(0)}>Click kar k vag yeha se</a>
      </div>}
      {stage == 2 && <div>
          <div className=" mb-3">
            <label className="form-label">Select User Type <span className="ei-col-red">*</span></label>
            <select className="form-select" aria-label="Default select example" name="user_type" value={user_type} onChange={(e) => setUserType(e.target.value)}>
              <option value="">-- Select user type --</option>
              <option value="SUPPORTADMIN">SUPPORT ADMIN</option>
              <option value="COMPANY">COMPANY</option>
              <option value="OPERATOR">OPERATOR</option>
            </select>
          </div>
          <div className=" mb-3">
              <label className="form-label">Enter User Code <span className="ei-col-red">*</span></label>
              <input required placeholder="Ex: CP0045102" name="user_code" type="text" className="form-control" aria-describedby="emailHelp" value={user_code} onChange={(e) => setUserCode(e.target.value)}/>
          </div>
          <div className=" mb-3">
              <label className="form-label">Enter Email Id <span className="ei-col-red">*</span></label>
              <input required placeholder="Ex: abc@mail.com" name="user_email" type="email" className="form-control" aria-describedby="emailHelp" value={user_email} onChange={(e) => setUserEmail(e.target.value)}/>
          </div>
          <div className="d-flex justify-content-center align-items-center">
              <button type="button" onClick={() =>sendOtp()} className="btn btn-primary mx-2 ">Send OTP</button>
          </div>
          <span className="d-flex justify-content-center align-items-center m-2">Or</span>
          <div className="d-flex justify-content-center align-items-center flex-column mt-2">
              <a onClick={() =>setStage(0)} className="my-1">Back to Log In</a>
              <a onClick={() =>setStage(4)} className="my-1">Forgot User Code/Login Id</a>
          </div>
      </div>}
      {stage == 3 && <div>
          <div className=" mb-3">
              <label className="form-label">Enter OTP <span className="ei-col-red">*</span></label>
              <input placeholder="Ex: 012345" name="otp" type="text" className="form-control" aria-describedby="emailHelp" value={otp} onChange={(e) => setOtp(e.target.value)}/>
          </div>
          <div className="d-flex justify-content-center align-items-center">
              <button type="button" onClick={() =>sendOtp()} className="btn btn-primary mx-2 ">Resend OTP</button>
              <button type="button" onClick={() =>checkOtp()} className="btn btn-primary mx-2 ">Submit</button>
          </div>
          <div className="d-flex justify-content-center align-items-center mt-3">
            <a onClick={() =>setStage(0)} className="mx-2">Back to Log In</a>
          </div>
      </div>}
      {stage == 4 && <div>
          <h5 className="p-1 mb-5">In case you have forgot your Code/Login id please contact with Admin.</h5>  
          <div className="d-flex justify-content-center align-items-center mt-2">
              <a onClick={() =>setStage(2)} className="mx-2">Back to Previous Page</a>
              <a className="mx-2" onClick={() =>setStage(0)}>Back to Log In</a>
          </div> 
      </div>}
      {stage == 5 && <div>
        <div className="d-flex align-items-center justify-content-center flex-column text-success">
          <h6 className="">Validation successfull.</h6>
          <h6 className="mb-5">Enter new password.</h6>
        </div>
          <div className="mb-3">
              <label className="form-label">New Password <span className="ei-col-red">*</span></label>
              <input name="new_password" type="password" className="form-control" aria-describedby="emailHelp" value={new_password} onChange={(e) => setNewPassword(e.target.value)}/>
          </div>
          <div className="mb-3">
              <label className="form-label">Confirm Password <span className="ei-col-red">*</span></label>
              <input name="confirm_password" type="text" className="form-control" aria-describedby="emailHelp" value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)}/>
          </div>
          <button type="button" onClick={() =>changePassword()} className="btn btn-primary mx-2">Change</button>
      </div>}
      {stage == 6 && <div className="d-flex align-items-center justify-content-center flex-column">
        <div className="mb-5 text-success d-flex align-items-center justify-content-center flex-column">
          <h5>Your password has updated.</h5>  
          <h6>Log in with your updated password.</h6>  
        </div>
          <a className="mx-2" onClick={() =>setStage(0)}>Back to Log In</a>  
      </div>}
    </div>
    </>
  );
}
export default Login;