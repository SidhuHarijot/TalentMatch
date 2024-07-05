"use client";
import React, { useState } from 'react';
import Link from 'next/link';

const ErrorModal: React.FC<{ errors: string[], onClose: () => void }> = ({ errors, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-black bg-opacity-50 absolute inset-0" onClick={onClose}></div>
      <div className="bg-white p-6 rounded shadow-lg z-10 w-3/4 max-w-lg">
        <h2 className="text-xl font-bold mb-4">Error</h2>
        <ul className="list-disc list-inside text-red-700 mb-4">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const PostJob: React.FC = () => {
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [applicationDeadline, setApplicationDeadline] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [jobType, setJobType] = useState('FULL');
  const [active, setActive] = useState(true);
  const [errors, setErrors] = useState<string[]>([]);
  const [jobId, setJobId] = useState<number | null>(null);

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!title) newErrors.push('Job title is required');
    if (!company) newErrors.push('Company is required');
    if (!description) newErrors.push('Description is required');
    if (!requiredSkills) newErrors.push('Required skills are required');
    if (!applicationDeadline) newErrors.push('Application deadline is required');
    if (!location) newErrors.push('Location is required');
    if (!salary) newErrors.push('Salary is required');
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formErrors = validateForm();
    if (formErrors.length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors([]);

    // Create a job with an empty description to get a job ID
    try {
      const postResponse = await fetch('https://resumegraderapi.onrender.com/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job_description_text: ""
        })
      });

      const postData = await postResponse.json();

      if (postResponse.ok) {
        const jobId = postData.job_id;
        setJobId(jobId);

        // Format the application deadline to "DDMMYYYY"
        const deadlineParts = applicationDeadline.split('-');
        const applicationDeadlineFormatted = `${deadlineParts[2]}${deadlineParts[1]}${deadlineParts[0]}`;

        const updatedJobData = {
          title: title || "",
          company: company || "",
          description: description || "",
          required_skills: requiredSkills ? requiredSkills.split(',').map(skill => skill.trim()) : [],
          application_deadline: applicationDeadlineFormatted,
          location: location || "",
          salary: salary ? parseFloat(salary) : 0,
          job_type: jobType,
          active
        };

        // PUT request to update the job with full details
        const putResponse = await fetch(`https://resumegraderapi.onrender.com/jobs/${jobId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedJobData)
        });

        if (putResponse.ok) {
          alert('Job posted and updated successfully');
          // Redirect to the previous page
          window.location.href = '/Jobs';
        } else {
          const putErrorData = await putResponse.json();
          console.error('Update Job Response:', putErrorData);
          alert(`Failed to update job: ${putErrorData.detail || putErrorData}`);
        }
      } else {
        console.error('Create Job Response:', postData);
        alert(`Failed to create job: ${postData.detail || postData}`);
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('An error occurred while posting the job.');
    }
  };

  return (
    <main className="flex flex-col items-center p-6 bg-gradient-to-r from-indigo-300 via-purple-200 to-pink-300 min-h-screen">
      {errors.length > 0 && <ErrorModal errors={errors} onClose={() => setErrors([])} />}
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800">Post a New Job</h1>
          <Link href="/Jobs">
            <span className="bg-indigo-500 text-white rounded px-4 py-2 cursor-pointer hover:bg-indigo-600 transition-colors">
              Back to Jobs
            </span>
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Job Title</label>
            <input
              type="text"
              className="border border-gray-300 rounded p-3 w-full text-gray-800"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Company</label>
            <input
              type="text"
              className="border border-gray-300 rounded p-3 w-full text-gray-800"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              className="border border-gray-300 rounded p-3 w-full text-gray-800"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
            ></textarea>
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Required Skills (comma separated)</label>
            <input
              type="text"
              className="border border-gray-300 rounded p-3 w-full text-gray-800"
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Application Deadline</label>
            <input
              type="date"
              className="border border-gray-300 rounded p-3 w-full text-gray-800"
              value={applicationDeadline}
              onChange={(e) => setApplicationDeadline(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Location</label>
            <input
              type="text"
              className="border border-gray-300 rounded p-3 w-full text-gray-800"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Salary</label>
            <input
              type="number"
              className="border border-gray-300 rounded p-3 w-full text-gray-800"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              min="0"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Job Type</label>
            <select
              className="border border-gray-300 rounded p-3 w-full text-gray-800"
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
            >
              <option value="FULL">Full-time</option>
              <option value="PART">Part-time</option>
              <option value="CONT">Contract</option>
              <option value="UNKN">Unknown</option>
            </select>
          </div>
          <div className="mb-6 flex items-center">
            <label className="block text-gray-700 font-semibold mb-2 mr-4">Active</label>
            <input
              type="checkbox"
              className="border border-gray-300 rounded p-3"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white rounded p-4 text-xl font-bold hover:bg-green-700 transition-colors"
          >
            Post Job
          </button>
        </form>
      </div>
    </main>
  );
};

export default PostJob;
