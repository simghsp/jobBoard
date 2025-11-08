import React, { useEffect, useState } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';
import { Link } from 'react-router-dom';

export default function Home(){
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get('/jobs?q=&limit=4').then(res => {
      // pick featured or the first 4
      setFeatured(res.data.slice(0,4));
    }).catch(()=>{});
  }, []);

  return (
    <div>
      <header className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h2 className="text-sm uppercase">4536+ Jobs listed</h2>
            <h1 className="text-4xl md:text-5xl font-bold mt-4">Find your Dream Job</h1>
            <p className="mt-4 text-lg opacity-90">We provide instant matches for your dream job across many categories.</p>
            <div className="mt-6 flex gap-3">
              <Link className="px-5 py-3 bg-green-500 rounded text-white" to="/register">Upload Your Resume</Link>
              <Link className="px-5 py-3 border rounded" to="/browse">Browse Jobs</Link>
            </div>
            <div className="mt-6">
              <SearchBar />
            </div>
          </div>
          <div className="w-full md:w-1/2">
            <img src="https://cdn.dribbble.com/users/256/screenshots/14893333/media/1b2a3f6e0f9d1e8c1c2f8b8f5f7d4bdb.png" alt="hero" className="w-full" />
          </div>
        </div>
      </header>

      <section className="container mx-auto px-6 py-10">
        <h3 className="text-2xl font-semibold mb-6">Featured Jobs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(job => <JobCard key={job._id} job={job} />)}
        </div>
      </section>
    </div>
  );
}
