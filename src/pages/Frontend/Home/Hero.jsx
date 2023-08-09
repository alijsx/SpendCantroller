import React, { useState, useContext } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { doc, setDoc, serverTimestamp } from "firebase/firestore/lite";

import "./home.css";
import { firestore } from "../../../config/firebase";

const initialState = {
  title: "",
  date: "",
  money: "",
};

function Hero() {
  window.getRandomId = () => Math.random().toString(36).slice(2);

  const { user } = useContext(AuthContext);

  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChange = (e) => {
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let { title, date, money } = state;

    title = title.trim();
    date = date.trim();
    money = money.trim();

    if (title.length < 3) {
      toast.error("Please enter the title correctly ");
      return;
    }

    if (date.length < 3) {
      toast.error("Please enter the date correctly ");
      return;
    }

    if (!/^\d+(\.\d{1,2})?$/.test(money)) {
      toast.error("Please enter a valid amount You spend ");
      return;
    }

    let formData = { title, date, money };

    formData.dateCreated = serverTimestamp();
    formData.id = window.getRandomId();
    formData.status = "active";
    formData.createdBy = {
      email: user.email,
      uid: user.uid,
    };

    createDocument(formData);
  };

  const createDocument = async (formData) => {
    setIsProcessing(true);
    try {
      await setDoc(doc(firestore, "todos", formData.id), formData);
      toast.success("Fund Added");
    } catch (err) {
      console.error(err);
      toast.danger("Something Went Wrong");
    }
    setIsProcessing(false);
  };

  return (
    <>
      <div className="home py-5 d-flex justify-content-center align-items-center">
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="card p-3 p-md-4 p-lg-5 bg-transparent text-light cardd">
                <form  onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col">
                      <h2 className="text-center mb-4">Add Spending</h2>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 col-md-6 mb-3">
                      <label htmlFor="">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        name="title"
                        placeholder="Enter Title"
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 col-md-6 mb-3">
                      <label htmlFor="">Date</label>
                      <input
                        type="date"
                        className="form-control"
                        name="date"
                        placeholder="Enter Date"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col">
                      <label htmlFor="">Spending Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        name="money"
                        placeholder="Enter Spend Amount"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col">
                      <button
                        type="submit"
                        className="btn3 btn btn-warning text-dark w-100"
                        disabled={isProcessing}
                      >
                        {!isProcessing ? (
                          "Add Spending"
                        ) : (
                          <div className="spinner-grow spinner-grow-sm"></div>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
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
      </div>
    </>
  );
}

export default Hero;
