import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Apply() {
  const { jobId } = useParams();
  const [cover, setCover] = useState('');
  const [resume, setResume] = useState(null);
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    const form = new FormData();
    form.append('coverLetter', cover);
    if (resume) form.append('resume', resume);

    try {
      await api.post(`/applications/${jobId}`, form, { headers: { 'Content-Type': 'multipart/form-data' }});
      setMsg('Application submitted!');
      setTimeout(()=> navigate('/candidate'), 1500);
    } catch (err) {
      setMsg('Error applying');
      console.error(err);
    }
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-2xl">
      <h2 className="text-xl font-semibold">Apply to Job</h2>
      <form onSubmit={submit} className="bg-white p-6 mt-4 rounded shadow space-y-3">
        {msg && <div className="text-green-600">{msg}</div>}
        <textarea value={cover} onChange={e=>setCover(e.target.value)} placeholder="Cover letter" className="w-full border p-2" />
        <input type="file" accept=".pdf,.doc,.docx" onChange={e=>setResume(e.target.files[0])} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Submit Application</button>
      </form>
    </div>
  );
}
