import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './Pages/Home';
import Browse from './Pages/Browse';
import JobDetail from './Pages/JobDetail';
import Login from './Pages/Login';
import Register from './Pages/Register';
import EmployerDashboard from './Pages/EmployerDashboard.jsx';
import CandidateDashboard from './Pages/CandidateDashboard';
import PostJob from './Pages/PostJob';
import Apply from './Pages/Apply';
import ProtectedRoute from './components/ProtectedRoute';

export default function App(){
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post-job" element={
            <ProtectedRoute role="employer"><PostJob/></ProtectedRoute>
          }/>
          <Route path="/employer" element={<ProtectedRoute role="employer"><EmployerDashboard/></ProtectedRoute>} />
          <Route path="/candidate" element={<ProtectedRoute role="candidate"><CandidateDashboard/></ProtectedRoute>} />
          <Route path="/apply/:jobId" element={<ProtectedRoute role="candidate"><Apply/></ProtectedRoute>} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
