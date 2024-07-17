// src/app/Jobs/page.tsx
"use client";
import React, { useState } from 'react';
import UserJobs from '../UserJobs/page'; 
import AdminJobs from '../AdminJobs/page'; 
import Matches from '../Matches/page';
import { useAuth } from '../contexts/AuthContext';

const Jobs: React.FC = () => {
  const { role } = useAuth();
  const [currentPage, setCurrentPage] = useState('UserJobs');
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-tr from-blue-200 via-indigo-200 to-blue-300">
      <div>
        <div className="flex justify-between items-center mb-8">
          {role === 'admin' && (
            <div>
              <button
                className={`mx-2 p-2 ${currentPage === 'UserJobs' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded transition-colors duration-300`}
                onClick={() => setCurrentPage('UserJobs')}
              >
                User Jobs
              </button>
              <button
                className={`mx-2 p-2 ${currentPage === 'AdminJobs' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded transition-colors duration-300`}
                onClick={() => setCurrentPage('AdminJobs')}
              >
                Admin Jobs
              </button>
              <button
                className={`mx-2 p-2 ${currentPage === 'Matches' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded transition-colors duration-300`}
                onClick={() => setCurrentPage('Matches')}
              >
                Matches
              </button>
            </div>
          )}
        </div>
        {currentPage === 'AdminJobs' && <AdminJobs />}
        {currentPage === 'UserJobs' && <UserJobs />}
        {currentPage === 'Matches' && <Matches />}
      </div>
    </main>
  );
};

export default Jobs;