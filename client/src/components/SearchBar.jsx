import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    navigate(`/browse?q=${encodeURIComponent(q)}`);
  };

  return (
    <form onSubmit={submit} className="flex gap-2 items-center">
      <input className="px-4 py-2 rounded border flex-1" value={q} onChange={e=>setQ(e.target.value)} placeholder="Search keyword, company, location..." />
      <button className="px-4 py-2 bg-green-500 text-white rounded">Find Job</button>
    </form>
  );
}
