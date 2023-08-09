import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { collection, deleteDoc, doc, getDocs, serverTimestamp, setDoc, where, query } from "firebase/firestore/lite";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import { Pagination } from 'react-bootstrap';
import "./todo.css";
import { firestore } from "../../../config/firebase";

function Todos() {
  window.getRandomId = () => Math.random().toString(36).slice(2);
  const { user } = useContext(AuthContext);
  const [documents, setDocuments] = useState([]);
  const [todo, setTodo] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isProcessingDelete, setIsProcessingDelete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [spendingPerPage] = useState(10);

  const handleChange = (e) => {
    setTodo((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const fetchDocuments = async () => {
    if (!user) {
      
      return;
    }
  
    const q = query(
      collection(firestore, "todos"),
      where("createdBy.uid", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);
  
    let array = [];
    querySnapshot.forEach((doc) => {
      let data = doc.data();
      array.push(data);
    });
  
    setDocuments(array);
    setIsLoading(false);
  };
  

  useEffect(() => {
    fetchDocuments();
  }, [user]);

  const handleUpdate = async () => {
    let formData = { ...todo };
    formData.dateCreated = formData.dateCreated;
    formData.dateModified = serverTimestamp();
    formData.modifiedBy = {
      email: user.email,
      uid: user.uid,
    };
    setIsProcessing(true);

    try {
      await setDoc(doc(firestore, "todos", todo.id), formData, { merge: true });
      toast.success("Fund Successfully updated ");

      let newDocuments = documents.map((doc) => {
        if (doc.id === todo.id) return todo;
        return doc;
      });

      setDocuments(newDocuments);
    } catch (err) {
      console.error(err);
      toast.error("Something went Wrong ");
    }

    setIsProcessing(false);
  };

  const handleDelete = async (todo) => {
    setIsProcessingDelete(true);

    try {
      await deleteDoc(doc(firestore, "todos", todo.id));
      let newDocuments = documents.filter((doc) => {
        return doc.id !== todo.id;
      });
      setDocuments(newDocuments);
      toast.success("Fund Deleted ");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }

    setIsProcessingDelete(false);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastSpending = currentPage * spendingPerPage;
  const indexOfFirstSpending = indexOfLastSpending - spendingPerPage;
  const currentSpending = documents.slice(indexOfFirstSpending, indexOfLastSpending);

  const handleDeleteAll = async () => {
    setIsProcessingDelete(true);
  
    try {
      for (const doc of documents) {
        await deleteDoc(doc(firestore, "todos", doc.id));
      }
  
      setDocuments([]);
      toast.success("All Todos Deleted 😃");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong 😫");
    }
  
    setIsProcessingDelete(false);
  };
  

  return (
    <>
      <div className="home py-5 d-flex justify-content-center align-items-centert">
        <div className="container">
          <div className="row">
            <div className="col">
              <h2 className="text-center mb-4">My Spending</h2>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="card p-3 p-md-4 p-lg-5 cad  text-light bg-transparen">
                {!isLoading ? (
                  <>
                    <Table>
                      <Thead>
                        <Tr>
                          <Th>s. No</Th>
                          <Th>Title</Th>
                          <Th>Date</Th>
                          <Th>Amount (PKR)</Th>
                          <Th>Action</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {currentSpending.map((todo, index) => (
                          <Tr key={index}>
                            <Td>{index + 1}</Td>
                            <Td>{todo.title}</Td>
                            <Td>{new Date(todo.date).toLocaleDateString()}</Td>
                            <Td>{todo.money.toLocaleString("en-PK")}</Td>
                            <Td>
                              <button
                                className="btn btn-info btn-sm me-1 mt-1"
                                data-bs-toggle="modal"
                                data-bs-target="#editModal"
                                onClick={() => setTodo(todo)}
                                disabled={isProcessing}
                              >
                                {!isProcessing ? (
                                  <i className="ri-pencil-fill"></i>
                                ) : (
                                  <div className="spinner-grow spinner-grow-sm"></div>
                                )}
                              </button>
                              <button
                                className="btn btn-danger btn-sm me-1 mt-1"
                                disabled={isProcessingDelete}
                                onClick={() => handleDelete(todo)}
                              >
                                {!isProcessingDelete ? (
                                  <i className="ri-delete-bin-6-fill"></i>
                                ) : (
                                  <div className="spinner-grow spinner-grow-sm"></div>
                                )}
                              </button>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                    <Pagination className="mt-3">
                      <Pagination.Prev
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      />
                      {Array.from({ length: Math.ceil(documents.length / spendingPerPage) }, (_, i) => (
                        <Pagination.Item
                          key={i}
                          active={i + 1 === currentPage}
                          onClick={() => handlePageChange(i + 1)}
                        >
                          {i + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === Math.ceil(documents.length / spendingPerPage)}
                      />
                    </Pagination>
                    <div className="mt-3">
                      <strong>Total Spending:</strong> {documents.reduce((total, spending) => total + parseFloat(spending.money), 0).toLocaleString("en-PK")}
                    </div>
                    <div className="text-center mt-3">
                      {/* <button
                        className="btn btn-danger"
                        onClick={handleDeleteAll}
                        disabled={isProcessingDelete}
                      >
                        {!isProcessingDelete ? (
                          <span>Delete All</span>
                        ) : (
                          <div className="spinner-grow spinner-grow-sm"></div>
                        )}
                      </button> */}
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="spinner-grow"></div>
                  </div>
                )}
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
      <div className="modal fade bg-dark text-light" id="editModal">
        <div className="modal-dialog modal-dialog-centered bg-dark text-light">
          <div className="modal-content bg-dark text-light">
            <div className="modal-header bg-dark text-light">
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body bg-dark text-light">
              <div className="row">
                <div className="col">
                  <h2 className="text-center mb-4">Edit Spending</h2>
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
                    value={todo.title}
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
                    value={todo.date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row ">
                <div className="col">
                  <label htmlFor="">Spending Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    name="money"
                    placeholder="Enter Amount (PKR)"
                    value={todo.money}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" className="btn btn-info" data-bs-dismiss="modal" onClick={handleUpdate}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Todos;
