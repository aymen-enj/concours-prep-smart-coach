import { ExamData, ExamQuestion } from '../types/exam';

interface ENSAMQuestion {
  question_number: string;
  text_fr: string;
  options?: {
    label: string;
    text: string;
  }[];
}

interface ENSAMPart {
  part_title: string;
  instructions: string;
  questions: ENSAMQuestion[];
}

interface ENSAMExam {
  exam_title: string;
  date: string;
  subject: string;
  duration: string;
  instructions: string[];
  parts: ENSAMPart[];
}

export function adaptENSAMExam(rawData: ENSAMExam): ExamData {
  return {
    exam_title: rawData.exam_title,
    components: rawData.parts.map(part => ({
      component_name: part.part_title,
      coefficient: 1,
      questions: part.questions.map(q => ({
        question_number: q.question_number,
        text: q.text_fr,
        options: q.options ? q.options.map(opt => ({
          label: opt.label,
          text: opt.text
        })) : [],
        // Ajout des instructions de la partie comme stimulus pour chaque question
        stimulus: part.instructions
      }))
    }))
  };
}

// Fonction utilitaire pour détecter si un examen est au format ENSAM
export function isENSAMFormat(data: any): boolean {
  return (
    data &&
    typeof data === 'object' &&
    'exam_title' in data &&
    'parts' in data &&
    Array.isArray(data.parts) &&
    data.parts.every((part: any) =>
      part.part_title &&
      part.instructions &&
      Array.isArray(part.questions)
    )
  );
} 