import React, { useEffect, useState } from 'react';
import { ExamResult } from '../types';
import { 
  Users, Award, BarChart3, Download, Search, 
  Filter, Calendar, ChevronRight, GraduationCap, 
  TrendingUp, TrendingDown 
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../utils';

interface Analytics {
  totalStudents: number;
  avgScore: number;
  highestScore: number;
  passRate: number;
}

export default function Admin() {
  const [results, setResults] = useState<ExamResult[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resultsRes, analyticsRes] = await Promise.all([
        fetch('/api/results'),
        fetch('/api/analytics')
      ]);
      const resultsData = await resultsRes.json();
      const analyticsData = await analyticsRes.json();
      setResults(resultsData);
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportExcel = () => {
    window.location.href = '/api/results/export';
  };

  const filteredResults = results.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.registerNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.college.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-primary" /> Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-1">Manage examination results and view analytics</p>
          </div>
          <button
            onClick={exportExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-emerald-600/20"
          >
            <Download className="w-5 h-5" /> Export All to Excel
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-slate-500">Total Students</p>
            <p className="text-2xl font-black text-slate-800">{analytics?.totalStudents || 0}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                <Award className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-slate-500">Highest Score</p>
            <p className="text-2xl font-black text-slate-800">{analytics?.highestScore || 0}</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <TrendingUp className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <p className="text-sm font-medium text-slate-500">Pass Rate</p>
            <p className="text-2xl font-black text-slate-800">{analytics?.passRate.toFixed(1) || 0}%</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
                <GraduationCap className="w-6 h-6" />
              </div>
              <TrendingDown className="w-4 h-4 text-red-500" />
            </div>
            <p className="text-sm font-medium text-slate-500">Average Score</p>
            <p className="text-2xl font-black text-slate-800">{analytics?.avgScore.toFixed(1) || 0}</p>
          </motion.div>
        </div>

        {/* Results Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-bold text-slate-800">Recent Examinations</h3>
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, reg no..."
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-full md:w-80 transition-all"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Test Details</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4">Percentage</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResults.map((result) => (
                  <tr key={result.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold">
                          {result.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{result.name}</p>
                          <p className="text-xs text-slate-500">{result.registerNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-slate-700">{result.testTitle}</p>
                      <p className="text-xs text-slate-500">{result.college}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-slate-800">{result.score}</span>
                      <span className="text-slate-400 text-xs"> / {result.totalQuestions}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full",
                              result.percentage >= 50 ? "bg-emerald-500" : "bg-red-500"
                            )}
                            style={{ width: `${result.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{result.percentage.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold uppercase",
                        result.status === 'Pass' 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "bg-red-100 text-red-700"
                      )}>
                        {result.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar className="w-4 h-4" />
                        {result.date.split(',')[0]}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white rounded-lg transition-colors text-slate-400 group-hover:text-primary">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredResults.length === 0 && (
            <div className="p-12 text-center">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h4 className="font-bold text-slate-800">No results found</h4>
              <p className="text-slate-500 text-sm">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
