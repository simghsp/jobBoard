import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login(){
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [err,setErr]=useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (err) {
      setErr(err.response?.data?.message || 'Login failed');
    }
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-md">
      <h2 className="text-xl font-semibold">Login</h2>
      <form onSubmit={submit} className="bg-white p-6 mt-4 rounded shadow">
        {err && <div className="text-red-600 mb-2">{err}</div>}
        <input className="w-full border p-2 mb-3" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input type="password" className="w-full border p-2 mb-3" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
      </form>
    </div>
  );
}
