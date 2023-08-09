import React, { useContext } from "react";
import "./navbar.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../../../config/firebase";
import { toast } from "react-toastify";

function Navbar() {
  const { isAuthenticated, dispatch } = useContext(AuthContext);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        dispatch({ type: "LOGOUT" });
        toast.danger('User Logged Out', 
        
          );
      })
      .catch((err) => {
        console.error(err);
      });
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-warning">
      <div className="container">
        <Link to="/home" className="navbar-brand text-dark">
          Spend x
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/home" className="nav-link active text-dark">
              <i class="ri-add-line"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/todos" className="nav-link text-dark">
              <i class="ri-currency-fill"></i> Spendings
              </Link>
            </li>
            {/* <li className="nav-item">
              <Link to="/about" className="nav-link">
                About
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/contact" className="nav-link active">
                Contact
              </Link>
            </li> */}
          </ul>
          <div className="d-flex">
            {!isAuthenticated ? (
              <Link
                to="/authentication/login"
                className="btn btn-light"
                type="submit"
              >
                Login
              </Link>
            ) : (
              <>
                {/* <Link
                  to="/dashboard"
                  className="btn btn-light me-2"
                  type="submit"
                >
                  Dashboard
                </Link> */}
                <button
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
