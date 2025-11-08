import React, { createContext, useState, useEffect } from 'react'
import api from '../services/api'
import { useNavigate } from 'react-router-dom'


export const AuthContext = createContext()


export const AuthProvider = ({ children }) => {
const [user, setUser] = useState(null)
const navigate = useNavigate()


useEffect(() => {
const raw = localStorage.getItem('user')
if (raw) setUser(JSON.parse(raw))
}, [])


const login = async (email, password) => {
const res = await api.post('/auth/login', { email, password })
const { token, user } = res.data
localStorage.setItem('token', token)
localStorage.setItem('user', JSON.stringify(user))
setUser(user)
return user
}


const signup = async (payload) => {
const res = await api.post('/auth/signup', payload)
return res.data
}


const logout = () => {
localStorage.removeItem('token')
localStorage.removeItem('user')
setUser(null)
navigate('/login')
}


return (
<AuthContext.Provider value={{ user, login, signup, logout, setUser }}>
{children}
</AuthContext.Provider>
)
}