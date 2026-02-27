export enum Medium {
  ENGLISH = 'English',
  TAMIL = 'Tamil'
}

export enum QuestionStatus {
  NOT_VISITED = 'not_visited',
  NOT_ATTEMPTED = 'not_attempted',
  ATTEMPTED = 'attempted',
  MARKED_FOR_REVIEW = 'marked_for_review'
}

export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;
}

export interface TestSet {
  id: string;
  title: string;
  questions: Question[];
}

export interface StudentInfo {
  fullName: string;
  registerNumber: string;
  collegeName: string;
  medium: Medium;
  email?: string;
  mobile?: string;
  testId: string;
  duration: number;
}

export interface ExamResult {
  id?: number;
  date: string;
  name: string;
  registerNumber: string;
  college: string;
  medium: string;
  testTitle: string;
  totalQuestions: number;
  attempted: number;
  correct: number;
  wrong: number;
  score: number;
  percentage: number;
  status: 'Pass' | 'Fail';
  email?: string;
  mobile?: string;
  questions?: any[];
  userAnswers?: Record<string, string>;
}
