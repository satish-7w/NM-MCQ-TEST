import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS } from '../constants';
import { QuestionStatus, StudentInfo, ExamResult } from '../types';
import { Clock, ChevronLeft, ChevronRight, Flag, CheckCircle2, AlertCircle, Maximize2, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../utils';

export default function Exam() {
  const navigate = useNavigate();
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Record<string, QuestionStatus>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const activeTest = QUESTIONS.find(q => q.id === studentInfo?.testId) || QUESTIONS[0];
  const currentQuestion = activeTest.questions[currentQuestionIndex];

  useEffect(() => {
    const info = localStorage.getItem('studentData');
    if (!info) {
      navigate('/');
      return;
    }
    const parsed = JSON.parse(info);
    setStudentInfo(parsed);
    setTimeLeft(parsed.duration * 60);

    // Initialize status
    const initialStatus: Record<string, QuestionStatus> = {};
    activeTest.questions.forEach(q => {
      initialStatus[q.id] = QuestionStatus.NOT_VISITED;
    });
    setStatus(initialStatus);
  }, [navigate]);

  const sendToGoogleSheets = async (resultData: any) => {
    try {
      await fetch("https://script.google.com/macros/s/AKfycbyGuPFZNESGhzo1-w0Syv82B1BFRgh7JpSss-7_bXf5yImtTVley5KL2RujfVQZJhSA/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(resultData)
      });
    } catch (error) {
      console.error("Google Sheets Error:", error);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!studentInfo || isSubmitting) return;

    setIsSubmitting(true);

    let correctCount = 0;
    activeTest.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });

    const total = activeTest.questions.length;
    const attempted = Object.keys(answers).length;
    const wrong = attempted - correctCount;
    const score = correctCount;
    const percentage = (score / total) * 100;
    const passStatus = percentage >= 50 ? 'Pass' : 'Fail';

    const result: ExamResult = {
      date: new Date().toLocaleString(),
      name: studentInfo.fullName,
      registerNumber: studentInfo.registerNumber,
      college: studentInfo.collegeName,
      medium: studentInfo.medium,
      testTitle: activeTest.title,
      totalQuestions: total,
      attempted,
      correct: correctCount,
      wrong,
      score,
      percentage,
      status: passStatus,
      email: studentInfo.email,
      mobile: studentInfo.mobile,
      questions: activeTest.questions,
      userAnswers: answers
    };

    // Send to Google Sheets ONCE
    await sendToGoogleSheets({
      name: result.name,
      registerNumber: result.registerNumber,
      college: result.college,
      medium: result.medium,
      test: result.testTitle,
      total: result.totalQuestions,
      attempted: result.attempted,
      correct: result.correct,
      wrong: result.wrong,
      score: result.score,
      percentage: result.percentage,
      status: result.status,
      email: result.email,
      mobile: result.mobile
    });

    try {
      const response = await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result)
      });
      const data = await response.json();
      localStorage.setItem('lastResult', JSON.stringify({ ...result, id: data.id }));
      localStorage.setItem('resultData', JSON.stringify({ ...result, id: data.id }));
      localStorage.setItem('userAnswers', JSON.stringify(answers));
      navigate('/result');
    } catch (error) {
      console.error('Failed to save result:', error);
      localStorage.setItem('lastResult', JSON.stringify(result));
      localStorage.setItem('resultData', JSON.stringify(result));
      localStorage.setItem('userAnswers', JSON.stringify(answers));
      navigate('/result');
    }
  }, [studentInfo, activeTest, answers, navigate, isSubmitting]);

  useEffect(() => {
    if (timeLeft <= 0 && studentInfo) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, studentInfo, handleSubmit]);

  // Anti-cheating: Tab switch detection (Removed alert for sandbox compatibility)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.warn('Warning: Tab switching is detected.');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionId: string) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: optionId }));
    setStatus(prev => ({ ...prev, [currentQuestion.id]: QuestionStatus.ATTEMPTED }));
  };

  const toggleReview = () => {
    setStatus(prev => ({
      ...prev,
      [currentQuestion.id]: prev[currentQuestion.id] === QuestionStatus.MARKED_FOR_REVIEW 
        ? (answers[currentQuestion.id] ? QuestionStatus.ATTEMPTED : QuestionStatus.NOT_ATTEMPTED)
        : QuestionStatus.MARKED_FOR_REVIEW
    }));
  };

  const enterFullScreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
      setIsFullScreen(true);
    }
  };

  if (!studentInfo) return null;

  const attemptedCount = Object.keys(answers).length;
  const progress = (attemptedCount / activeTest.questions.length) * 100;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="w-full bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <div className="h-10 w-32 bg-slate-100 rounded flex items-center justify-center text-xs text-slate-500 font-bold hidden md:flex border border-slate-200">L&T EduTech</div>
          <div>
            <h1 className="font-bold text-blue-900 text-lg md:text-xl">PIPE DESIGNING</h1>
            <p className="text-sm font-semibold text-slate-700">{activeTest.title}</p>
            <p className="text-xs text-slate-500 mt-0.5">{studentInfo.fullName} | {studentInfo.registerNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg font-mono font-bold text-lg transition-colors shadow-sm",
            timeLeft < 300 ? "bg-red-50 text-red-600 border border-red-200 animate-pulse" : "bg-white text-slate-700 border border-slate-200"
          )}>
            <Clock className="w-5 h-5" />
            {formatTime(timeLeft)}
          </div>
          
          {!isFullScreen && (
            <button 
              onClick={enterFullScreen}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
              title="Enter Fullscreen"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 max-w-[1600px] mx-auto w-full">
        {/* Left Panel - Question Palette */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 flex-1">
            <h3 className="font-bold text-slate-800 mb-4 text-lg border-b border-slate-100 pb-2">
              Question Palette
            </h3>
            
            <div className="grid grid-cols-5 gap-2 mb-6">
              {activeTest.questions.map((q, idx) => {
                const qStatus = status[q.id];
                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={cn(
                      "w-10 h-10 rounded-lg font-medium text-sm flex items-center justify-center transition-all",
                      currentQuestionIndex === idx && "ring-2 ring-blue-500 ring-offset-2",
                      qStatus === QuestionStatus.ATTEMPTED && "bg-teal-500 text-white shadow-sm",
                      qStatus === QuestionStatus.MARKED_FOR_REVIEW && "bg-amber-400 text-white shadow-sm",
                      qStatus === QuestionStatus.NOT_ATTEMPTED && "bg-slate-200 text-slate-600",
                      qStatus === QuestionStatus.NOT_VISITED && "bg-slate-50 text-slate-400 border border-slate-200"
                    )}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-4 h-4 rounded bg-teal-500 shadow-sm"></div> Answered
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-4 h-4 rounded bg-slate-200"></div> Not Answered
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-4 h-4 rounded bg-amber-400 shadow-sm"></div> Marked for Review
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className="w-4 h-4 rounded bg-slate-50 border border-slate-200"></div> Not Visited
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Question */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <motion.div 
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-md p-8 border border-slate-100 flex-1 flex flex-col"
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-lg text-sm font-bold tracking-wide">
                Question {currentQuestionIndex + 1} of {activeTest.questions.length}
              </span>
              <button
                onClick={toggleReview}
                className={cn(
                  "flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium transition-all",
                  status[currentQuestion.id] === QuestionStatus.MARKED_FOR_REVIEW
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                )}
              >
                <Flag className="w-4 h-4" /> 
                {status[currentQuestion.id] === QuestionStatus.MARKED_FOR_REVIEW ? "Marked" : "Mark for Review"}
              </button>
            </div>

            <h2 className="text-xl font-semibold text-slate-800 mb-8 leading-relaxed">
              {currentQuestion.text}
            </h2>

            <div className="space-y-3 mt-auto">
              {currentQuestion.options.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all group",
                    answers[currentQuestion.id] === option.id
                      ? "border-blue-500 bg-blue-50/50"
                      : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <input
                    type="radio"
                    name="question-option"
                    className="hidden"
                    checked={answers[currentQuestion.id] === option.id}
                    onChange={() => handleOptionSelect(option.id)}
                  />
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs transition-all shrink-0",
                    answers[currentQuestion.id] === option.id
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-slate-300 text-slate-400 group-hover:border-slate-400"
                  )}>
                    {option.id}
                  </div>
                  <span className={cn(
                    "text-base font-medium transition-all",
                    answers[currentQuestion.id] === option.id ? "text-blue-900" : "text-slate-700"
                  )}>
                    {option.text}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>

          <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-md border border-slate-100">
            <button
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              className="px-6 py-2.5 rounded-xl font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5" /> Previous
            </button>
            <button
              onClick={() => {
                if (currentQuestionIndex < activeTest.questions.length - 1) {
                  setCurrentQuestionIndex(prev => prev + 1);
                } else {
                  handleSubmit();
                }
              }}
              disabled={isSubmitting}
              className={cn(
                "px-8 py-2.5 rounded-xl font-medium text-white flex items-center gap-2 transition-all shadow-md",
                currentQuestionIndex === activeTest.questions.length - 1 
                  ? "bg-teal-600 hover:bg-teal-700 shadow-teal-600/20" 
                  : "bg-blue-600 hover:bg-blue-700 shadow-blue-600/20",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              {currentQuestionIndex === activeTest.questions.length - 1 ? 'Finish Exam' : 'Next Question'} 
              {currentQuestionIndex !== activeTest.questions.length - 1 && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Right Panel - Summary */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 text-lg border-b border-slate-100 pb-2">Exam Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Total Questions</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg">{activeTest.questions.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Attempted</span>
                <span className="font-bold text-teal-600 bg-teal-50 px-3 py-1 rounded-lg">{attemptedCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 font-medium">Remaining</span>
                <span className="font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">{activeTest.questions.length - attemptedCount}</span>
              </div>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden mb-3">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="bg-teal-500 h-full rounded-full"
              />
            </div>
            <p className="text-right text-sm font-bold text-teal-600 mb-8">{Math.round(progress)}% Completed</p>

            <button
              onClick={() => {
                handleSubmit();
              }}
              disabled={isSubmitting}
              className={cn(
                "w-full bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20",
                isSubmitting && "opacity-50 cursor-not-allowed"
              )}
            >
              <CheckCircle2 className="w-5 h-5" /> Submit Examination
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
