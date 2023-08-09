import React, { useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { ToastContainer, toast } from "react-toastify";

const initialState = { email: "" };

export default function ForgotPassword() {
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modal, setModal] = useState(false);

  const handleChange = (e) => {
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    const { email } = state;

    setIsProcessing(true);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        toggle();
      })
      .catch((error) => {
        console.error(error);
        toast.error("Something Went Wrong Please Check Your Email Or Try Again Leter !");
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

  const toggle = () => setModal(!modal);

  return (
    <>
      <Container className="fmm text-light bg-transparent">
        <form onSubmit={handleResetPassword}>
          <h3>Forgot Password</h3>
          <div className="mb-3 mt-3">
            <label htmlFor="email">Email</label>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Enter email"
              onChange={handleChange}
            />
          </div>
          <div className="d-grid">
            <button
              type="submit"
              className=" btn btn-warning text-dark "
              disabled={isProcessing}
            >
              {!isProcessing ? (
                "Reset Password"
              ) : (
                <div className="spinner-grow spinner-grow-sm"></div>
              )}
            </button>
          </div>
          <div className="d-grid">
            <Link to="/authentication/login">Back to Login</Link>
          </div>
          <div>
            <Modal
              className="bg-dark text-light"
              isOpen={modal}
              toggle={toggle}
            >
              <ModalHeader className="bg-dark text-light" toggle={toggle}>
                Reset Password
              </ModalHeader>
              <ModalBody className="bg-dark text-light">
                Password reset email has been sent to your email address. Please
                check your inbox.
              </ModalBody>
              <ModalFooter className="bg-dark text-light">
                <Button color="warning" onClick={toggle}>
                  Close
                </Button>
              </ModalFooter>
            </Modal>
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
}
