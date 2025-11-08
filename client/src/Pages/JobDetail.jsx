import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function JobDetail(){
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    api.get(`/jobs/${id}`).then(res => setJob(res.data)).catch(()=>{});
  }, [id]);

  if (!job) return <div className="container mx-auto px-6 py-8">Loading...</div>

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-white p-6 rounded shadow">
        <h1 className="text-2xl font-bold">{job.title}</h1>
        <p className="text-gray-600">{job.company} • {job.location}</p>
        <div className="mt-4">
          <h3 className="font-semibold">Description</h3>
          <p>{job.description}</p>
        </div>
        <div className="mt-4 flex gap-3">
          <Link to={`/apply/${job._id}`} className="px-4 py-2 bg-green-500 text-white rounded">Apply Now</Link>
          <button className="px-4 py-2 border rounded">Save</button>
        </div>
      </div>
    </div>
  );
}
