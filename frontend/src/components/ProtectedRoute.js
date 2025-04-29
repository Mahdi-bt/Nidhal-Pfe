"use client"

import { useContext } from "react"
import { Navigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loading } = useContext(AuthContext)

  if (loading) {
    return <div>Loading...</div>
  }

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" />
  }

  return children
}

export default ProtectedRoute
