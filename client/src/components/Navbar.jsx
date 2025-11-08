import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  }

  return (
    <nav className="bg-white shadow">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-2xl font-bold text-blue-600">Job Board</Link>
          <Link to="/browse" className="hidden md:inline">Browse Job</Link>
          <div className="hidden md:inline relative group">
            <button className="px-2">Pages ▾</button>
            <div className="absolute left-0 mt-2 bg-white border shadow-lg rounded hidden group-hover:block">
              <Link to="/blog" className="block px-4 py-2">Blog</Link>
              <Link to="/contact" className="block px-4 py-2">Contact</Link>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {!token ? (
            <>
              <Link to="/login" className="px-3 py-1">Log in</Link>
              <Link to="/register" className="px-3 py-1 border rounded bg-green-500 text-white">Sign up</Link>
            </>
          ) : (
            <>
              {user?.role === 'employer' ? <Link to="/employer" className="px-3">Dashboard</Link> : <Link to="/candidate" className="px-3">Dashboard</Link>}
              <button onClick={logout} className="px-3 py-1 border rounded">Log out</button>
            </>
          )}
          <Link to="/post-job" className="ml-2 px-3 py-1 bg-green-500 text-white rounded">Post A Job</Link>
        </div>
      </div>
    </nav>
  );
}
