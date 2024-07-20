"use client";
import React, { useState } from 'react';
import Home from '../Index/page';
import AdminHome from '../AdminHome/page';
import { useAuth } from '../contexts/AuthContext';

const RoleBased: React.FC = () => {
  const { role } = useAuth();
  const [isAdmin, setIsAdmin] = useState(true); // Initialize based on the role

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-tr from-blue-400 via-blue-100 to-blue-400">
      <div className="w-full max-w-6xl bg-white shadow-xl rounded-xl p-10">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-8">Profile</h1>
        <div className="flex justify-between items-center mb-8">
          {role === 'admin' && (
            <div>
              <button
                className={`mx-2 p-2 ${!isAdmin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded transition-colors duration-300`}
                onClick={() => setIsAdmin(false)}
              >
                User Home
              </button>
              <button
                className={`mx-2 p-2 ${isAdmin ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'} rounded transition-colors duration-300`}
                onClick={() => setIsAdmin(true)}
              >
                Admin Home
              </button>
            </div>
          )}
        </div>
        {isAdmin ? <AdminHome /> : <Home />}
      </div>
    </main>
  );
};

export default RoleBased;
