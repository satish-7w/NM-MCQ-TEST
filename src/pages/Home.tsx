import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Medium, StudentInfo } from '../types';
import { motion } from 'motion/react';

export default function Home() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<StudentInfo>({
    fullName: '',
    registerNumber: '',
    collegeName: '',
    medium: Medium.ENGLISH,
    email: '',
    mobile: '',
    testId: '',
    duration: 30 // Default duration
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // VERY IMPORTANT

    if (!formData.fullName || !formData.registerNumber || !formData.testId) {
      return;
    }

    localStorage.setItem("studentData", JSON.stringify(formData));
    navigate("/exam"); // React Router navigation
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center font-sans text-slate-900">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          {/* Placeholder for L&T Logo */}
          <div className="h-10 w-32 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-500 font-bold border border-slate-200">L&T EduTech</div>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-blue-900 text-center">
          PIPE DESIGNING MCQ EXAMINATION
        </h1>
        <div className="flex items-center gap-2">
          {/* Placeholder for Naan Mudhalvan Logo */}
          <div className="h-10 w-32 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-500 font-bold border border-slate-200">Naan Mudhalvan</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-3xl border border-slate-100"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-blue-900">Student Registration</h2>
            <p className="text-slate-500 mt-2 font-medium">Course: PIPE DESIGNING</p>
            <p className="text-slate-500 mt-1 text-sm">Please fill in your details to begin the examination.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Full Name *</label>
                <input
                  required
                  name="fullName"
                  type="text"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50 focus:bg-white"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Register Number *</label>
                <input
                  required
                  name="registerNumber"
                  type="text"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50 focus:bg-white"
                  placeholder="e.g. REG123456"
                  value={formData.registerNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">College Name *</label>
              <input
                required
                name="collegeName"
                type="text"
                className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50 focus:bg-white"
                placeholder="Enter your college name"
                value={formData.collegeName}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Email Address</label>
                <input
                  name="email"
                  type="email"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50 focus:bg-white"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Mobile Number</label>
                <input
                  name="mobile"
                  type="tel"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50 focus:bg-white"
                  placeholder="+91 9876543210"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Medium *</label>
                <select
                  name="medium"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50 focus:bg-white"
                  value={formData.medium}
                  onChange={handleChange}
                >
                  <option value={Medium.ENGLISH}>English</option>
                  <option value={Medium.TAMIL}>Tamil</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Select MCQ Test *</label>
                <select
                  name="testId"
                  className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-slate-50 focus:bg-white"
                  value={formData.testId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Test --</option>
                  <option value="MCQ1">MCQ Test 1 – Basics of Pipe Designing</option>
                  <option value="MCQ2">MCQ Test 2 – Pipe Stress Analysis</option>
                  <option value="MCQ3">MCQ Test 3 – Advanced Pipe Designing</option>
                </select>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-4 rounded-xl shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
              >
                Start Examination
              </button>
            </div>
          </form>
        </motion.div>
      </main>
      
      <footer className="w-full py-6 text-center text-slate-500 text-sm">
        © {new Date().getFullYear()} L&T EduTech & Naan Mudhalvan. All rights reserved.
      </footer>
    </div>
  );
}
