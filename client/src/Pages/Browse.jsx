import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';

export default function Browse(){
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [params] = useSearchParams();
  const q = params.get('q') || '';

  useEffect(() => {
    setLoading(true);
    api.get(`/jobs?q=${encodeURIComponent(q)}&limit=50`).then(res => {
      setJobs(res.data);
    }).catch(err=>console.error(err)).finally(()=>setLoading(false));
  }, [q]);

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-2xl font-semibold">Browse Jobs</h2>
      <div className="mt-4"><SearchBar /></div>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <p>Loading...</p> : (jobs.length ? jobs.map(j => <JobCard job={j} key={j._id} />) : <p>No jobs found</p>)}
      </div>
    </div>
  );
}
