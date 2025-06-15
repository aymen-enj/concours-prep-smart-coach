
import medecine2023Data from '../../concours/medecine/medecine2023/epreuve_2023.json';
import { ExamData, ExamQuestion } from '../types/exam';
import { adaptENSAMExam, isENSAMFormat } from '../utils/examAdapters';

// Types for the exam data structure
export interface ExamOption {
  label: string;
  text: string;
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
 * Get a flattened list of all questions from an exam by ID
 */
export const getAllQuestionsForExamById = (examId: string): ExamQuestion[] => {
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

export async function loadExam(id: string, subject?: string): Promise<ExamData> {
  try {
    let path;
    
    // Handle different exam types
    if (id.startsWith('ensam-')) {
      const [_, year] = id.split('-');
      path = `concours/ensam/ensam${year}/epreuve_${year}.json`;
      if (subject) {
        path = `concours/ensam/ensam${year}/${subject}/epreuve_${year}.json`;
      }
    } else if (id.startsWith('ensa-') && subject) {
      const [_, year] = id.split('-');
      path = `concours/ensa/ensa${year}/${subject}/epreuve_${year}.json`;
    } else if (id.startsWith('medecine-')) {
      const [_, year] = id.split('-');
      path = `concours/medecine/medecine${year}/epreuve_${year}.json`;
    } else {
      throw new Error(`Unsupported exam type: ${id}`);
    }

    // Essayer plusieurs chemins d'accès
    const possiblePaths = [
      `/${path}`,               // Chemin direct sans 'public'
      `/public/${path}`,        // Avec 'public/' préfixe
      `/${path.replace('concours/', '')}`,  // Sans 'concours/'
      `/public/${path.replace('concours/', '')}`,  // Public sans 'concours/'
    ];
    
    console.log("Trying multiple paths to load exam:", possiblePaths);
    
    let response = null;
    let rawData = null;
    
    // Essayer chaque chemin jusqu'à ce qu'un fonctionne
    for (const attemptPath of possiblePaths) {
      try {
        console.log("Attempting path:", attemptPath);
        response = await fetch(attemptPath);
        if (response.ok) {
          console.log("Successfully loaded from:", attemptPath);
          rawData = await response.json();
          break;
        }
      } catch (pathError) {
        console.log("Failed to load from path:", attemptPath);
      }
    }
    
    // Si aucun chemin n'a fonctionné
    if (!rawData) {
      throw new Error(`Failed to load exam: Could not access file from any path for ${id}`);
    }

    // Détecter et adapter le format ENSAM si nécessaire
    if (isENSAMFormat(rawData)) {
      return adaptENSAMExam(rawData);
    }

    // Format ENSA, médecine ou autre format standard
    return rawData;
  } catch (error) {
    console.error('Error loading exam:', error);
    throw error;
  }
}

export function getAllQuestionsForExam(examData: ExamData): ExamQuestion[] {
  return examData.components.flatMap(component => component.questions);
}
