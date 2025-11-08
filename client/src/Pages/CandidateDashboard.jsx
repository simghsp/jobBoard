import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function CandidateDashboard(){
  const [apps, setApps] = useState([]);
  useEffect(()=> {
    api.get('/applications').then(res => setApps(res.data)).catch(()=>{});
  }, []);
  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold">Candidate Dashboard</h2>
      <div className="mt-6">
        {apps.map(a => (
          <div key={a._id} className="bg-white p-4 rounded shadow mb-3">
            <div className="flex justify-between">
              <div>
                <div className="font-semibold">{a.job?.title}</div>
                <div className="text-sm text-gray-600">{a.job?.company}</div>
              </div>
              <div className="text-sm">{a.status}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
