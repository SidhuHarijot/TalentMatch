"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

interface AppliedJob {
  match_id: number;
  title: string;
  company: string;
  status: string;
  description: string;
}

interface Feedback {
  feedback_id: number;
  match_id: number;
  feedback_text: string;
}

const YourApplications: React.FC = () => {
  const [appliedJobs, setAppliedJobs] = useState<AppliedJob[]>([]);
  const [selectedJob, setSelectedJob] = useState<null | AppliedJob>(null);
  const [filter, setFilter] = useState<string>('All');
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [showFeedback, setShowFeedback] = useState<number | null>(null);

  const { uid } = useAuth();

  useEffect(() => {
    if (uid) {
      const fetchAppliedJobs = async () => {
        try {
          const response = await fetch(`https://resumegraderapi.onrender.com/matches/?uid=${uid}`);
          const data = await response.json();

          const jobs = data.map((job: any) => ({
            match_id: job.match_id,
            title: job.job.title,
            company: job.job.company,
            status: job.status,
            description: job.job.description,
          }));

          setAppliedJobs(jobs);
        } catch (error) {
          console.error('Error fetching applied jobs:', error);
        }
      };

      fetchAppliedJobs();
    }
  }, [uid]);

  const handleWithdraw = async (match_id: number, index: number) => {
    if (confirm('Are you sure you want to withdraw your application?')) {
      try {
        const response = await fetch(`https://resumegraderapi.onrender.com/matches/${match_id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const updatedJobs = appliedJobs.filter((_, i) => i !== index);
          setAppliedJobs(updatedJobs);
          alert('Application withdrawn successfully.');
        } else {
          alert('Failed to withdraw application.');
        }
      } catch (error) {
        console.error('Error withdrawing application:', error);
        alert('An error occurred while withdrawing the application.');
      }
    }
  };

  const handleJobClick = (job: AppliedJob) => {
    setSelectedJob(job);
    setShowFeedback(null);
  };

  const handleViewFeedback = async (match_id: number) => {
    try {
      const response = await fetch(`https://resumegraderapi.onrender.com/feedback/?match_id=${match_id}&all_feedback=false`);
      const data = await response.json();
      console.log('Feedback fetched:', data);

      if (data.length === 0) {
        setFeedback([]);
      } else {
        setFeedback(data);
      }
      
      setShowFeedback(match_id);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  const filteredJobs = filter === 'All' ? appliedJobs : appliedJobs.filter(job => job.status === filter);

  return (
    <main className="flex flex-col items-center p-6 bg-gradient-to-r from-blue-200 via-blue-100 to-blue-400 min-h-screen">
      <div className="w-full max-w-4xl bg-white shadow-md rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Your Applications</h1>
          <Link href="/Profile">
            <span className="bg-gray-500 text-white rounded px-4 py-2 cursor-pointer hover:bg-gray-600 transition-colors">
              Back to Profile
            </span>
          </Link>
        </div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="mr-2 text-black">Filter by status:</label>
            <select className="border border-gray-300 rounded p-2 text-black" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option className="text-black" value="All">All</option>
              <option className="text-black" value="Applied">Applied</option>
              <option className="text-black" value="Interview Scheduled">Interview Scheduled</option>
              <option className="text-black" value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job, index) => (
            <div key={index} className="border border-gray-300 rounded p-4 bg-white shadow-sm">
              <h2 className="text-xl font-bold text-black">{job.title}</h2>
              <p className="text-gray-700">{job.company}</p>
              <p className={`text-${job.status === 'Rejected' ? 'red' : 'green'}-500 font-semibold`}>{job.status}</p>
              <div className="flex mt-2">
                <button
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                  onClick={() => handleJobClick(job)}
                >
                  View Details
                </button>
                <button
                  className="bg-green-500 text-white py-1 px-3 rounded hover:bg-green-600 ml-2"
                  onClick={() => handleViewFeedback(job.match_id)}
                >
                  View Feedback
                </button>
                <button
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600 ml-2"
                  onClick={() => handleWithdraw(job.match_id, index)}
                >
                  Withdraw
                </button>
              </div>
              {selectedJob && selectedJob.match_id === job.match_id && (
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Details</h2>
                  <p className="text-black"><strong>Title:</strong> {selectedJob.title}</p>
                  <p className="text-black"><strong>Company:</strong> {selectedJob.company}</p>
                  <p className="text-black"><strong>Status:</strong> {selectedJob.status}</p>
                  <p className="text-black"><strong>Description:</strong> {selectedJob.description}</p>
                  <button
                    className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 mt-4"
                    onClick={() => setSelectedJob(null)}
                  >
                    Close
                  </button>
                </div>
              )}
              {showFeedback === job.match_id && (
                <div className="mt-4 p-4 bg-gray-200 rounded-lg">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Feedback</h2>
                  {feedback.length === 0 ? (
                    <p className="text-gray-700">No feedback found.</p>
                  ) : (
                    feedback.map(fb => (
                      <div key={fb.feedback_id} className="border border-gray-300 rounded p-3 mb-2 bg-white shadow-sm">
                        <p className="text-black">{fb.feedback_text}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default YourApplications;
