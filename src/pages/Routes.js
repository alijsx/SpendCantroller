import React,{ useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Frontend from './Frontend'
import Authentication from './authentication'
import Dashboard from './Dashboard'
import { AuthContext } from '../context/AuthContext';
import PrivateRoute from '../components/privateRoute';
function Index() {
  const { isAuthenticated } = useContext(AuthContext)
  // console.log(user)
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/*' element={<Frontend />} />
        <Route path='/authentication/*' element={!isAuthenticated ? <Authentication /> : <Navigate to='/dashboard' />} />
        <Route path='/dashboard/*' element={<PrivateRoute Component={Dashboard} />} />
    </Routes>
    </BrowserRouter>
  )
}


export default Index;
