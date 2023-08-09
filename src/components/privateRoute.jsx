import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import Login from '../pages/authentication/Login/Login'

export default function PrivateRoute(props) {

const {isAuthenticated} = useContext(AuthContext)


    const {Component} = props


    if(!isAuthenticated)
    return <Login />
  return (
    <Component />
  )
}
