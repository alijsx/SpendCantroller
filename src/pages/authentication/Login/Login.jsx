import React, { useContext, useState } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import "./login.css";
import { auth } from "../../../config/firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

const initialState = { email: "", password: "" };

export default function Login() {
  const { dispatch } = useContext(AuthContext);

  const navigate = useNavigate();
  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    let { email, password } = state;

    setIsProcessing(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        let user = userCredential.user;

        dispatch({ type: "LOGIN", payload: { user } });
        navigate("/home");
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };

 
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);


  return (
    <>
      <Container className="fmm text-light bg-transparent">
        <form onSubmit={handleLogin}>
          <h3>Log In</h3>
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
          <div className="mb-3">
            <label htmlFor="password">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Enter password"
              onChange={handleChange}
            />
          </div>
          <div className=" mb-3">
            <div className="custom-control custom-checkbox">
              <p>
                Need An Account ?{" "}
                <Link to="/authentication/register">Register</Link>
              </p>
            </div>
          </div>
          <div className="d-grid">
            <button
              type="submit"
              className=" btn btn-warning text-dark "
              I
              disabled={isProcessing}
            >
              {!isProcessing ? (
                "Login"
              ) : (
                <div className="spinner-grow spinner-grow-sm  "></div>
              )}
            </button>
          </div>
          <button
            type="button"
            className=" btn btn text-right bg-transparent text-light fbtn"
            onClick={toggle}
          >
            Forget Password
          </button>
          <div
            className="modal fade"
            id="exampleModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          ></div>
        </form>
        <div >
          <Modal className="bg-dark text-light"  isOpen={modal} toggle={toggle} {...arguments}>
            <ModalHeader className="bg-dark text-light" toggle={toggle}>404</ModalHeader>
            <ModalBody className="bg-dark text-light">
             Cool Down Use You Brain And Think Your Password 🤔
            </ModalBody>
            <ModalFooter className="bg-dark text-light">
              <Button  color="warning text-dark cbtn" onClick={toggle}>
               <Link to='/authentication/forget-password' >Close</Link>
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </Container>
    </>
  );
}
