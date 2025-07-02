import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
const HOST = import.meta.env.VITE_HOST;
const PORT = import.meta.env.VITE_PORT;

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

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingOtp, setLoadingOtp] = useState(false);
  const [loadingCheckOtp, setLoadingCheckOtp] = useState(false);
  const [loadingChangePassword, setLoadingChangePassword] = useState(false);

  const navigate = useNavigate();

  const clearMessages = () => {
    setTimeout(() => {
      setResponse("");
      setError("");
    }, 3000);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    clearMessages();
    if (!login_id || !password) {
      setError("Please enter login id and password.");
      return;
    }
    setLoadingLogin(true);
    try {
      const response = await fetch(`${HOST}:${PORT}/server/login`, {
        method: "POST",
        body: JSON.stringify({ login_id, password }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (response.ok) {
        const expiry = Date.now() + 12 * 60 * 60 * 1000;
        localStorage.setItem("token", result.token);
        localStorage.setItem("tokenExpiry", expiry);
        localStorage.setItem("seUserType", result.userType);
        localStorage.setItem("seUserName", result.userName);
        localStorage.setItem("seCode", result.code);
        setTimeout(() => {
          localStorage.clear();
          window.location.href = "/login";
        }, 12 * 60 * 60 * 1000);
        window.dispatchEvent(new Event("storage"));
        location.reload();
      } else {
        setError(result.msg);
      }
    } catch {
      setError("We are unable to process now. Please try again later.");
    } finally {
      setLoadingLogin(false);
    }
  };

  const sendOtp = async () => {
    clearMessages();
    if (!user_type || !user_code || !user_email) {
      setError("Enter user type, code and email");
      return;
    }
    setLoadingOtp(true);
    try {
      const response = await fetch(`${HOST}:${PORT}/server/outer-forgot-password-send-otp`, {
        method: "POST",
        body: JSON.stringify({ user_type, user_code, user_email }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (response.ok) {
        if (result.doc) {
          setUserId(result.doc._id);
          setResponse("OTP sent to your registered email.");
          setStage(3);
        } else {
          setError("We are unable to process now. Please try again later.");
        }
      } else {
        setError(result.msg);
      }
    } catch {
      setError("We are unable to process now. Please try again later.");
    } finally {
      setLoadingOtp(false);
    }
  };

  const checkOtp = async () => {
    clearMessages();
    if (!otp) {
      return setError("Please enter OTP to continue.");
    }
    setLoadingCheckOtp(true);
    try {
      const response = await fetch(`${HOST}:${PORT}/server/outer-forgot-password-check-otp`, {
        method: "POST",
        body: JSON.stringify({ otp, user_id }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (response.ok && result.status) {
        setStage(5);
      } else {
        setError(result.msg);
      }
    } catch {
      setError("We are unable to process now. Please try again later.");
    } finally {
      setLoadingCheckOtp(false);
    }
  };

  const changePassword = async () => {
    clearMessages();
    if (!new_password || !confirm_password) {
      setError("Please enter both password and confirm password.");
      return;
    }
    if (new_password !== confirm_password) {
      setError("Password and confirm password must be same.");
      return;
    }
    setLoadingChangePassword(true);
    try {
      const response = await fetch(`${HOST}:${PORT}/server/outer-forgot-password-change-password`, {
        method: "POST",
        body: JSON.stringify({ password: new_password, user_id }),
        headers: { "Content-Type": "application/json" },
      });
      const result = await response.json();
      if (response.ok && result.status) {
        setStage(6);
      } else {
        setError(result.msg);
      }
    } catch {
      setError("We are unable to process now. Please try again later.");
    } finally {
      setLoadingChangePassword(false);
    }
  };

  return (
    <>
      <style>{`a{ text-decoration: underline !important; cursor: pointer; }`}</style>
      <div className="container my-2 shadow-sm p-5 mb-5 bg-body-tertiary rounded">
        <div className="d-flex align-items-center justify-content-center mb-2">
          {stage === 0 && (
            <img style={{ maxWidth: "12rem", margin: "0rem -0.5rem 2rem 0rem" }} src="../src/assets/images/stockEZZ.jpg" alt="" />
          )}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {response && <div className="alert alert-success">{response}</div>}

        {stage === 0 && (
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Login Id <span className="ei-col-red">*</span></label>
              <input type="text" className="form-control" value={login_id} onChange={(e) => setLoginId(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Password <span className="ei-col-red">*</span></label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="log-in-buttons d-flex flex-column justify-content-center align-items-center">
              <button type="submit" className="btn btn-primary my-3" disabled={loadingLogin}>
                {loadingLogin ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                Log In
              </button>
              <a className="my-2" onClick={() => setStage(2)}>Forgot Password</a>
              <a className="my-2" onClick={() => setStage(1)}>Forgot Login Id</a>
              <a className="my-2" href="/">Back to home</a>
            </div>
          </form>
        )}

        {stage === 2 && (
          <>
            <div className="mb-3">
              <label className="form-label">Select User Type <span className="ei-col-red">*</span></label>
              <select className="form-select" value={user_type} onChange={(e) => setUserType(e.target.value)}>
                <option value="">-- Select user type --</option>
                <option value="SUPPORTADMIN">SUPPORT ADMIN</option>
                <option value="COMPANY">COMPANY</option>
                <option value="OPERATOR">OPERATOR</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Enter User Code <span className="ei-col-red">*</span></label>
              <input type="text" className="form-control" placeholder="Ex: CP0045102" value={user_code} onChange={(e) => setUserCode(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Enter Email Id <span className="ei-col-red">*</span></label>
              <input type="email" className="form-control" placeholder="Ex: abc@mail.com" value={user_email} onChange={(e) => setUserEmail(e.target.value)} />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <button type="button" onClick={sendOtp} className="btn btn-primary mx-2" disabled={loadingOtp}>
                {loadingOtp ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                Send OTP
              </button>
            </div>
            <span className="d-flex justify-content-center m-2">Or</span>
            <div className="d-flex justify-content-center flex-column mt-2">
              <a onClick={() => setStage(0)} className="my-1">Back to Log In</a>
              <a onClick={() => setStage(4)} className="my-1">Forgot User Code/Login Id</a>
            </div>
          </>
        )}

        {stage === 3 && (
          <>
            <div className="mb-3">
              <label className="form-label">Enter OTP <span className="ei-col-red">*</span></label>
              <input type="text" className="form-control" placeholder="Ex: 012345" value={otp} onChange={(e) => setOtp(e.target.value)} />
            </div>
            <div className="d-flex justify-content-center align-items-center">
              <button type="button" onClick={sendOtp} className="btn btn-primary mx-2" disabled={loadingOtp}>
                {loadingOtp ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                Resend OTP
              </button>
              <button type="button" onClick={checkOtp} className="btn btn-primary mx-2" disabled={loadingCheckOtp}>
                {loadingCheckOtp ? <span className="spinner-border spinner-border-sm me-2" /> : null}
                Submit
              </button>
            </div>
            <div className="d-flex justify-content-center mt-3">
              <a onClick={() => setStage(0)} className="mx-2">Back to Log In</a>
            </div>
          </>
        )}

        {stage === 5 && (
          <>
            <div className="text-success text-center mb-4">
              <h6>Validation successful. Enter new password.</h6>
            </div>
            <div className="mb-3">
              <label className="form-label">New Password <span className="ei-col-red">*</span></label>
              <input type="password" className="form-control" value={new_password} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm Password <span className="ei-col-red">*</span></label>
              <input type="text" className="form-control" value={confirm_password} onChange={(e) => setConfirmPassword(e.target.value)} />
            </div>
            <button type="button" onClick={changePassword} className="btn btn-primary" disabled={loadingChangePassword}>
              {loadingChangePassword ? <span className="spinner-border spinner-border-sm me-2" /> : null}
              Change
            </button>
          </>
        )}

        {stage === 6 && (
          <div className="text-success text-center">
            <h5>Your password has been updated.</h5>
            <h6>Log in with your updated password.</h6>
            <a className="mx-2" onClick={() => setStage(0)}>Back to Log In</a>
          </div>
        )}
      </div>
    </>
  );
}

export default Login;
