import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <h3 className="text-lg font-semibold"><Link to={`/jobs/${job._id}`}>{job.title}</Link></h3>
      <p className="text-sm text-gray-600">{job.company} • {job.location || 'Remote'}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs px-2 py-1 border rounded">{job.type || 'Full-time'}</span>
        <Link to={`/jobs/${job._id}`} className="text-sm text-blue-600">View</Link>
      </div>
    </div>
  );
}
