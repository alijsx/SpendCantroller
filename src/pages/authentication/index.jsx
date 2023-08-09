import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ForgetPassword from './ForgetPassword/ForgetPassword'
import Login from './Login/Login'
import Register from './Register/Register'
import  NewPassword from "./NewPassword/NewPassword"
export default function index() {
  return (
   <Routes>
    <Route path='/'>
    <Route path='login' element={<Login />} />
    <Route path='register' element={<Register />} />
    <Route path='forget-password' element={<ForgetPassword />} />
    <Route path='reset-password' element={<NewPassword/>} />
    </Route>
   </Routes>
  )
}
