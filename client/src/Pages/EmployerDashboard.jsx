import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function EmployerDashboard(){
  const [jobs,setJobs] = useState([]);

  useEffect(()=> {
    // fetch employer jobs (we'll fetch all and filter by postedBy on server)
    api.get('/jobs').then(res=>{
      const user = JSON.parse(localStorage.getItem('user'));
      const mine = res.data.filter(j => j.postedBy === user?.id || (j.postedBy && j.postedBy._id === user?.id));
      setJobs(mine);
    }).catch(()=>{});
  },[]);

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold">Employer Dashboard</h2>
      <div className="mt-4">
        <Link to="/post-job" className="px-3 py-2 bg-green-500 text-white rounded">Create Job</Link>
      </div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map(j => (
          <div key={j._id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{j.title}</h3>
            <p className="text-sm text-gray-600">{j.company} • {j.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
