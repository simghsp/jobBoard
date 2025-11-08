import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function PostJob(){
  const [form,setForm] = useState({ title:'', company:'', location:'', type:'Full-time', description:'', requirements:'', salary:''});
  const [err,setErr]=useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = { ...form, requirements: form.requirements.split(',').map(s=>s.trim()) };
      await api.post('/jobs', data);
      navigate('/employer');
    } catch (err) {
      setErr(err.response?.data?.message || 'Error creating job');
    }
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      <h2 className="text-xl font-semibold">Post a Job</h2>
      <form onSubmit={submit} className="bg-white p-6 mt-4 rounded shadow space-y-3">
        {err && <div className="text-red-600">{err}</div>}
        <input value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="w-full border p-2" placeholder="Job title" />
        <input value={form.company} onChange={e=>setForm({...form, company:e.target.value})} className="w-full border p-2" placeholder="Company" />
        <input value={form.location} onChange={e=>setForm({...form, location:e.target.value})} className="w-full border p-2" placeholder="Location" />
        <input value={form.type} onChange={e=>setForm({...form, type:e.target.value})} className="w-full border p-2" placeholder="Type" />
        <textarea value={form.description} onChange={e=>setForm({...form, description:e.target.value})} className="w-full border p-2" placeholder="Description"></textarea>
        <input value={form.requirements} onChange={e=>setForm({...form, requirements:e.target.value})} className="w-full border p-2" placeholder="Requirements (comma separated)" />
        <input value={form.salary} onChange={e=>setForm({...form, salary:e.target.value})} className="w-full border p-2" placeholder="Salary" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Post Job</button>
      </form>
    </div>
  );
}
