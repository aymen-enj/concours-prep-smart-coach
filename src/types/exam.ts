export interface ExamOption {
  label: string;
  text: string;
  programmatic_figure?: ProgrammaticFigure;
}

export interface ProgrammaticFigure {
  type: 'plot' | 'diagram' | 'raw_svg' | 'svg_file' | 'image';
  library: string;
  image_url?: string;
  alt_text?: string;
  title?: string;
  width?: string;
  [key: string]: any;
}

export interface ExamQuestion {
  question_number: string;
  text: string;
  options?: ExamOption[];
  programmatic_figure?: ProgrammaticFigure;
  programmatic_figures?: ProgrammaticFigure[];
  stimulus?: string | string[];
  follow_up_question?: string;
  difficulty?: string;
  hint?: string;
  correctAnswer?: string;
  subject?: string;
  subtopic?: string;
}

export interface ExamComponent {
  component_name: string;
  coefficient: number;
  questions: ExamQuestion[];
}

export interface ExamData {
  exam_title: string;
  components: ExamComponent[];
} 