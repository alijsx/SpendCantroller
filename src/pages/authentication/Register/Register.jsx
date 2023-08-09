import React, { useState, useContext } from "react";
import { Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./register.css";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, firestore } from "../../../config/firebase";
import { doc, setDoc } from "firebase/firestore/lite";
import { AuthContext } from "../../../context/AuthContext";
import { toast } from "react-toastify";

const initialState = {
  firstName: "",
  lastName: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  phoneNumber: ""
};

export default function Register() {
  const { dispatch } = useContext(AuthContext);

  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      confirmPassword,
      phoneNumber
    } = state;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsProcessing(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        addDocument(user, { firstName, lastName, username, phoneNumber });
        console.log("user created");
      })
      .catch((err) => {
        console.error(err);
        setIsProcessing(false);
      });
  };

  const addDocument = async (user, userData) => {
    try {
      await setDoc(doc(firestore, "users", user.uid), {
        ...userData,
        uid: user.uid
      });
      console.log("user document created at firestore");

      toast.success("User Registered", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored"
      });

      dispatch({ type: "LOGIN", payload: { user } });
    } catch (err) {
      console.error(err);
    }
    setIsProcessing(false);
  };

  return (
    <Container className="fmm bg-transparent">
      <form onSubmit={handleRegister}>
        <h3>Register</h3>
        <div className="input-group mb-3">
          <span className="input-group-text">First Name</span>
          <input
            name="firstName"
            type="text"
            className="form-control"
            placeholder="Enter your first name"
            onChange={handleChange}
            value={state.firstName}
            required
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">Last Name</span>
          <input
            name="lastName"
            type="text"
            className="form-control"
            placeholder="Enter your last name"
            onChange={handleChange}
            value={state.lastName}
            required
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">Username</span>
          <input
            name="username"
            type="text"
            className="form-control"
            placeholder="Enter your username"
            onChange={handleChange}
            value={state.username}
            required
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">Email</span>
          <input
            name="email"
            type="email"
            className="form-control"
            placeholder="Enter your email"
            onChange={handleChange}
            value={state.email}
            required
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">Password</span>
          <input
            name="password"
            type="password"
            className="form-control"
            placeholder="Enter your password"
            onChange={handleChange}
            value={state.password}
            required
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">Confirm Password</span>
          <input
            name="confirmPassword"
            type="password"
            className="form-control"
            placeholder="Confirm your password"
            onChange={handleChange}
            value={state.confirmPassword}
            required
          />
        </div>
        <div className="input-group mb-3">
          <span className="input-group-text">Phone Number</span>
          <input
            name="phoneNumber"
            type="text"
            className="form-control"
            placeholder="Enter your phone number"
            onChange={handleChange}
            value={state.phoneNumber}
            required
          />
        </div>
        <div className="d-grid">
          <button
            type="submit"
            className="btn btn-warning text-dark"
            disabled={isProcessing}
          >
            {!isProcessing ? (
              "Register"
            ) : (
              <div className="spinner-grow spinner-grow-sm"></div>
            )}
          </button>
        </div>
        <p className="forgot-password text-right">
          Already have an account? <Link to="/authentication/login">Login</Link>
        </p>
      </form>
    </Container>
  );
}
