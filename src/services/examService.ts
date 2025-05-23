import medecine2023Data from '../../concours/medecine/medecine2023/epreuve_2023.json';

// Types for the exam data structure
export interface ExamOption {
  label: string;
  text: string;
}

export interface ExamQuestion {
  question_number: string;
  text: string;
  options: ExamOption[];
  // Additional fields that might be available
  difficulty?: string;
  hint?: string;
  correctAnswer?: string;
  subject?: string;
  subtopic?: string;
}

export interface ExamSection {
  title: string;
  questions: ExamQuestion[];
}

export interface Exam {
  title: string;
  year: number;
  duration: string;
  sections: ExamSection[];
}

// Map of available exams by ID
const examMap: Record<string, any> = {
  'medecine2023': medecine2023Data
};

/**
 * Get an exam by its identifier
 */
export const getExamById = (examId: string): Exam | null => {
  const examData = examMap[examId];
  
  if (!examData) return null;
  
  // Transform the data if needed to match our expected format
  return {
    title: examData.title || 'Examen',
    year: examData.year || new Date().getFullYear(),
    duration: examData.duration || '3 heures',
    sections: examData.sections || []
  };
};

/**
 * Get all available exams
 */
export const getAllExams = (): {id: string, title: string, year: number}[] => {
  return Object.entries(examMap).map(([id, data]) => ({
    id,
    title: data.title || 'Examen',
    year: data.year || new Date().getFullYear()
  }));
};

/**
 * Get a flattened list of all questions from an exam
 */
export const getAllQuestionsForExam = (examId: string): ExamQuestion[] => {
  const exam = getExamById(examId);
  if (!exam) return [];
  
  // Flatten all questions from all sections
  return exam.sections.flatMap(section => section.questions);
};

/**
 * Convert a question to the format expected by the ExamView component
 */
export const convertToExamViewQuestion = (question: ExamQuestion) => {
  return {
    id: question.question_number,
    type: 'qcm', // Assuming all questions are QCM
    text: question.text,
    options: question.options.map(opt => opt.text),
    optionLabels: question.options.map(opt => opt.label),
    correctAnswer: question.correctAnswer || '',
    hint: question.hint || "Pas d'indice disponible pour cette question.",
    difficulty: question.difficulty || 'medium',
  };
};
