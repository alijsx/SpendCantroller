import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { confirmPasswordReset } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { Button } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const initialState = { newPassword: "", confirmPassword: "" };

const ResetPassword = () => {
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = state;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsProcessing(true);

    const queryParams = new URLSearchParams(window.location.search);
    const resetCode = queryParams.get("oobCode");

    confirmPasswordReset(auth, resetCode, newPassword)
      .then(() => {
        toast.success("Password reset successful");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Failed to reset password");
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  return (
    <>
      <Container className="fmm text-light bg-transparent">
        <form onSubmit={handleResetPassword}>
          <h3>Reset Password</h3>
          <div className="mb-3 mt-3">
            <label htmlFor="newPassword">New Password</label>
            <input
              name="newPassword"
              type="password"
              className="form-control"
              placeholder="Enter new password"
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              className="form-control"
              placeholder="Confirm new password"
              onChange={handleChange}
            />
          </div>
          <div className="d-grid">
            <Button type="submit" color="warning" disabled={isProcessing}>
              {!isProcessing ? (
                "Reset Password"
              ) : (
                <div className="spinner-grow spinner-grow-sm"></div>
              )}
            </Button>
          </div>
          <div className="d-grid">
            <Link to="/authentication/login">Back to Login</Link>
          </div>
        </form>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </Container>
    </>
  );
};

export default ResetPassword;
