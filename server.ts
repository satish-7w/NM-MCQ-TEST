import express from 'express';
import { createServer as createViteServer } from 'vite';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database('exam_system.db');

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS results (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    name TEXT,
    registerNumber TEXT,
    college TEXT,
    medium TEXT,
    testTitle TEXT,
    totalQuestions INTEGER,
    attempted INTEGER,
    correct INTEGER,
    wrong INTEGER,
    score INTEGER,
    percentage REAL,
    status TEXT
  )
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/results', (req, res) => {
    const {
      date, name, registerNumber, college, medium, testTitle,
      totalQuestions, attempted, correct, wrong, score, percentage, status
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO results (
        date, name, registerNumber, college, medium, testTitle,
        totalQuestions, attempted, correct, wrong, score, percentage, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      date, name, registerNumber, college, medium, testTitle,
      totalQuestions, attempted, correct, wrong, score, percentage, status
    );

    res.json({ id: result.lastInsertRowid });
  });

  app.get('/api/results', (req, res) => {
    const results = db.prepare('SELECT * FROM results ORDER BY id DESC').all();
    res.json(results);
  });

  app.get('/api/results/export', async (req, res) => {
    const results = db.prepare('SELECT * FROM results ORDER BY id DESC').all();
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Results');

    worksheet.columns = [
      { header: 'Date', key: 'date', width: 20 },
      { header: 'Name', key: 'name', width: 25 },
      { header: 'Reg No', key: 'registerNumber', width: 15 },
      { header: 'College', key: 'college', width: 30 },
      { header: 'Medium', key: 'medium', width: 10 },
      { header: 'Test', key: 'testTitle', width: 25 },
      { header: 'Total', key: 'totalQuestions', width: 10 },
      { header: 'Attempted', key: 'attempted', width: 10 },
      { header: 'Correct', key: 'correct', width: 10 },
      { header: 'Wrong', key: 'wrong', width: 10 },
      { header: 'Score', key: 'score', width: 10 },
      { header: 'Percentage', key: 'percentage', width: 15 },
      { header: 'Status', key: 'status', width: 10 },
    ];

    results.forEach(result => worksheet.addRow(result));

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename=' + 'exam_results.xlsx'
    );

    await workbook.xlsx.write(res);
    res.end();
  });

  app.get('/api/analytics', (req, res) => {
    const totalStudents = db.prepare('SELECT COUNT(*) as count FROM results').get() as any;
    const avgScore = db.prepare('SELECT AVG(score) as avg FROM results').get() as any;
    const highestScore = db.prepare('SELECT MAX(score) as max FROM results').get() as any;
    const passCount = db.prepare("SELECT COUNT(*) as count FROM results WHERE status = 'Pass'").get() as any;

    res.json({
      totalStudents: totalStudents.count,
      avgScore: avgScore.avg || 0,
      highestScore: highestScore.max || 0,
      passRate: totalStudents.count > 0 ? (passCount.count / totalStudents.count) * 100 : 0
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
