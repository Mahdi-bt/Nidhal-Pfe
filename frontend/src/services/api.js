import axios from "axios"

const API_URL =  "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, logout the user
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    return Promise.reject(error)
  },
)

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getCurrentUser: () => api.get("/auth/me"),
}

// Formations API
export const formationsAPI = {
  getAll: (params) => api.get("/formations", { params }),
  getById: (id) => api.get(`/formations/${id}`),
  create: (formationData) => api.post("/formations", formationData),
  update: (id, formationData) => api.put(`/formations/${id}`, formationData),
  delete: (id) => api.delete(`/formations/${id}`),
  enroll: (id) => api.post(`/formations/${id}/enroll`),
}

// Sessions API
export const sessionsAPI = {
  getAll: (params) => api.get("/sessions", { params }),
  getById: (id) => api.get(`/sessions/${id}`),
  create: (sessionData) => api.post("/sessions", sessionData),
  update: (id, sessionData) => api.put(`/sessions/${id}`, sessionData),
  delete: (id) => api.delete(`/sessions/${id}`),
  getAttendees: (id) => api.get(`/sessions/${id}/attendees`),
  markAttendance: (id, attendanceData) => api.post(`/sessions/${id}/attendance`, attendanceData),
}

// Users API
export const usersAPI = {
  getAll: (params) => api.get("/users", { params }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getEnrollments: (id) => api.get(`/users/${id}/enrollments`),
}

// Payment API
export const paymentsAPI = {
  create: (paymentData) => api.post("/payments", paymentData),
  getAll: (params) => api.get("/payments", { params }),
  getById: (id) => api.get(`/payments/${id}`),
  getUserPayments: (userId) => api.get(`/users/${userId}/payments`),
}

// Invoice API
export const invoicesAPI = {
  getAll: (params) => api.get("/invoices", { params }),
  getById: (id) => api.get(`/invoices/${id}`),
  create: (invoiceData) => api.post("/invoices", invoiceData),
  getUserInvoices: (userId) => api.get(`/users/${userId}/invoices`),
}

// Message API
export const messagesAPI = {
  create: (messageData) => api.post("/messages", messageData),
  getAll: (params) => api.get("/messages", { params }),
  getById: (id) => api.get(`/messages/${id}`),
  reply: (id, replyData) => api.post(`/messages/${id}/reply`, replyData),
}

export default api
