import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExamResult } from '../types';
import { CheckCircle2, XCircle, Download, FileText, Home, RotateCcw, Award, BarChart3 } from 'lucide-react';
import { motion } from 'motion/react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { cn } from '../utils';

export default function Result() {
  const navigate = useNavigate();
  const [result, setResult] = useState<ExamResult | null>(null);

  useEffect(() => {
    const lastResult = localStorage.getItem('resultData');
    if (!lastResult) {
      navigate('/');
      return;
    }
    setResult(JSON.parse(lastResult));
  }, [navigate]);

  const downloadPDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 0;

    // ===== HEADER BAND =====
    doc.setFillColor(30, 58, 138); // Deep Navy (#1E3A8A)
    doc.rect(0, 0, pageWidth, 40, 'F');

    // ===== LOGOS =====
    // Note: Replace these with your actual base64 strings
    const ltLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const naanLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

    try {
      doc.addImage(ltLogo, "PNG", 10, 10, 35, 15);
      doc.addImage(naanLogo, "PNG", pageWidth - 45, 10, 35, 15);
    } catch (e) {
      console.warn("Logo base64 invalid or missing.");
    }

    // ===== TITLE =====
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PIPE DESIGNING MCQ EXAMINATION REPORT", pageWidth / 2, 25, { align: "center" });

    y = 50;

    // ===== STUDENT DETAILS SECTION =====
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Student Details", 14, y);
    
    autoTable(doc, {
      startY: y + 5,
      body: [
        ['Student Name', result.name, 'Register No', result.registerNumber],
        ['College Name', result.college, 'Medium', result.medium],
        ['Test Name', result.testTitle, 'Date & Time', result.date]
      ],
      theme: 'grid',
      headStyles: { fillColor: [240, 249, 255], textColor: [15, 23, 42] }, // Light blue header
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: { 
        0: { fontStyle: 'bold', fillColor: [248, 250, 252], cellWidth: 35 }, 
        2: { fontStyle: 'bold', fillColor: [248, 250, 252], cellWidth: 35 } 
      }
    });

    y = (doc as any).lastAutoTable.finalY + 15;

    // ===== SCORE SUMMARY SECTION =====
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Score Summary", 14, y);

    autoTable(doc, {
      startY: y + 5,
      head: [['Metric', 'Value']],
      body: [
        ['Total Questions', result.totalQuestions.toString()],
        ['Attempted', result.attempted.toString()],
        ['Correct Answers', result.correct.toString()],
        ['Wrong Answers', result.wrong.toString()],
        ['Final Score', `${result.score} / ${result.totalQuestions}`],
        ['Percentage', `${result.percentage.toFixed(2)}%`],
        ['Status', result.status]
      ],
      theme: 'grid',
      headStyles: { fillColor: [14, 165, 164], textColor: [255, 255, 255] }, // Teal header
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index === 1) {
          if (data.row.index === 2) data.cell.styles.textColor = [22, 163, 74]; // Correct -> Green
          if (data.row.index === 3) data.cell.styles.textColor = [220, 38, 38]; // Wrong -> Red
          if (data.row.index === 6) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.textColor = result.status === 'Pass' ? [22, 163, 74] : [220, 38, 38];
          }
        }
      }
    });

    y = (doc as any).lastAutoTable.finalY + 20;

    // ===== DETAILED QUESTION ANALYSIS =====
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Detailed Question Analysis", 14, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    if (result.questions && result.userAnswers) {
      result.questions.forEach((q: any, index: number) => {
        const qNo = index + 1;
        const userAnswerId = result.userAnswers![q.id];
        const correctAnswerId = q.correctAnswer;
        const isCorrect = userAnswerId === correctAnswerId;
        const statusText = isCorrect ? "Correct" : "Wrong";

        // Handle long question text
        const splitQuestion = doc.splitTextToSize(`${qNo}. ${q.text}`, 180);
        
        // Check page break before printing question block (approx 40 units needed)
        if (y + (splitQuestion.length * 5) + 30 > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          y = 20;
        }

        doc.setTextColor(15, 23, 42); // slate-900
        doc.setFont("helvetica", "bold");
        doc.text(splitQuestion, 14, y);
        y += (splitQuestion.length * 5) + 2;

        const userOptText = q.options.find((o: any) => o.id === userAnswerId)?.text || 'Not Answered';
        const correctOptText = q.options.find((o: any) => o.id === correctAnswerId)?.text || '';

        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 116, 139); // slate-500
        doc.text(`Your Answer:`, 20, y);
        doc.setTextColor(isCorrect ? 22 : 220, isCorrect ? 163 : 38, isCorrect ? 74 : 38); // Green or Red
        doc.text(`${userAnswerId ? userAnswerId + ') ' + userOptText : 'Not Answered'}`, 45, y);
        y += 6;

        doc.setTextColor(100, 116, 139);
        doc.text(`Correct Answer:`, 20, y);
        doc.setTextColor(22, 163, 74); // Green
        doc.text(`${correctAnswerId}) ${correctOptText}`, 48, y);
        y += 6;

        doc.setTextColor(100, 116, 139);
        doc.text(`Result:`, 20, y);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(isCorrect ? 22 : 220, isCorrect ? 163 : 38, isCorrect ? 74 : 38);
        doc.text(`${statusText}`, 35, y);
        y += 12; // Spacing between questions
      });
    }

    // ===== FOOTER =====
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      const footerY = doc.internal.pageSize.getHeight() - 15;
      
      doc.setDrawColor(226, 232, 240); // slate-200
      doc.line(14, footerY - 5, pageWidth - 14, footerY - 5);
      
      doc.setFontSize(8);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(148, 163, 184); // slate-400
      doc.text('This is a computer-generated report.', 14, footerY);
      
      if (i === pageCount) {
        doc.setTextColor(15, 23, 42); // slate-900
        doc.text('Signature of Instructor', pageWidth - 50, footerY);
        doc.setDrawColor(15, 23, 42);
        doc.line(pageWidth - 60, footerY - 4, pageWidth - 14, footerY - 4);
      }
    }

    // ===== FILE NAME FORMAT =====
    const safeName = result.name.replace(/\s+/g, "_");
    const testIdMatch = result.testTitle.match(/MCQ\s*\d+/i);
    const testIdStr = testIdMatch ? testIdMatch[0].replace(/\s+/g, '') : 'MCQ';
    const fileName = `${safeName}_${result.registerNumber}_${testIdStr}.pdf`;

    doc.save(fileName);
  };

  if (!result) return null;

  const isPass = result.status === 'Pass';

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans text-slate-900 flex flex-col items-center">
      
      {/* Header Logos */}
      <div className="w-full max-w-4xl flex justify-between items-center mb-8 px-4">
        <div className="h-12 w-36 bg-white shadow-sm rounded-lg flex items-center justify-center text-sm text-slate-500 font-bold border border-slate-100">L&T EduTech</div>
        <div className="h-12 w-36 bg-white shadow-sm rounded-lg flex items-center justify-center text-sm text-slate-500 font-bold border border-slate-100">Naan Mudhalvan</div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100"
      >
        {/* Result Header */}
        <div className="p-10 text-center bg-white border-b border-slate-100 relative overflow-hidden">
          {/* Decorative background element */}
          <div className={cn(
            "absolute top-0 left-0 w-full h-2",
            isPass ? "bg-teal-500" : "bg-red-500"
          )} />
          
          <h1 className="text-3xl font-bold text-blue-900 mb-2">PIPE DESIGNING</h1>
          <h2 className="text-xl font-semibold text-slate-600 mb-8">MCQ EXAMINATION RESULT</h2>
          
          <div className="flex flex-col items-center justify-center">
            <div className="relative mb-6">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                <motion.circle 
                  initial={{ strokeDasharray: "0 440" }}
                  animate={{ strokeDasharray: `${(result.percentage / 100) * 440} 440` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" 
                  className={isPass ? "text-teal-500" : "text-red-500"}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-slate-800">{result.percentage.toFixed(0)}%</span>
              </div>
            </div>
            
            <span className={cn(
              "px-8 py-2.5 rounded-full text-lg font-bold tracking-widest uppercase shadow-sm",
              isPass ? "bg-teal-100 text-teal-700 border border-teal-200" : "bg-red-100 text-red-700 border border-red-200"
            )}>
              {isPass ? 'PASS' : 'FAIL'}
            </span>
          </div>
        </div>

        {/* Details Section */}
        <div className="p-10 bg-slate-50/50">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Candidate Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-6 text-lg">
                <FileText className="w-5 h-5 text-blue-500" /> Candidate Details
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex flex-col gap-1 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 font-medium">Full Name</span>
                  <span className="font-bold text-slate-800 text-base">{result.name}</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 font-medium">Register Number</span>
                  <span className="font-bold text-slate-800 text-base">{result.registerNumber}</span>
                </div>
                <div className="flex flex-col gap-1 border-b border-slate-50 pb-3">
                  <span className="text-slate-500 font-medium">College</span>
                  <span className="font-bold text-slate-800 text-base">{result.college}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 font-medium">Test Name</span>
                  <span className="font-bold text-slate-800 text-base">{result.testTitle}</span>
                </div>
              </div>
            </div>

            {/* Performance Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="font-bold text-blue-900 flex items-center gap-2 mb-6 text-lg">
                <BarChart3 className="w-5 h-5 text-blue-500" /> Performance Summary
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total</p>
                  <p className="text-2xl font-black text-slate-800">{result.totalQuestions}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Attempted</p>
                  <p className="text-2xl font-black text-blue-600">{result.attempted}</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 text-center">
                  <p className="text-xs font-bold text-teal-600/70 uppercase tracking-wider mb-1">Correct</p>
                  <p className="text-2xl font-black text-teal-600">{result.correct}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-center">
                  <p className="text-xs font-bold text-red-500/70 uppercase tracking-wider mb-1">Wrong</p>
                  <p className="text-2xl font-black text-red-500">{result.wrong}</p>
                </div>
              </div>
              
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                <span className="font-bold text-blue-900">Final Score</span>
                <span className="text-xl font-black text-blue-700">{result.score} <span className="text-sm text-blue-500 font-medium">/ {result.totalQuestions}</span></span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-10 mt-4">
            <button
              onClick={downloadPDF}
              className="flex-1 bg-blue-900 hover:bg-blue-800 text-white px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
            >
              <Download className="w-5 h-5" /> Download PDF Report
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <Home className="w-5 h-5" /> Back to Home
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <RotateCcw className="w-5 h-5" /> Retake Test
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
