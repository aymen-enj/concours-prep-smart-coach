import * as pdfjs from 'pdfjs-dist';

// Set worker source path for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export interface ExtractionResult {
  text: string;
  pages: number;
  metadata: any;
  error?: string;
}

export class PDFExtractionService {
  /**
   * Extracts text content from a PDF file
   * @param file PDF file to process
   * @returns Extracted text and metadata
   */
  public static async extractPDF(file: File): Promise<ExtractionResult> {
    try {
      // Convert File to ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      
      // Load the PDF document
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      
      // Extract text from all pages
      let fullText = '';
      const numPages = pdfDoc.numPages;
      
      for (let pageNum = 1; pageNum <= numPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum);
        const content = await page.getTextContent();
        const text = content.items.map((item: any) => item.str).join(' ');
        fullText += text + '\n';
      }

      // Get document metadata
      const metadata = await pdfDoc.getMetadata().catch(() => ({}));
      
      return {
        text: fullText,
        pages: numPages,
        metadata: metadata
      };
    } catch (error) {
      console.error('Error extracting PDF:', error);
      return {
        text: '',
        pages: 0,
        metadata: {},
        error: error instanceof Error ? error.message : 'Failed to extract PDF content'
      };
    }
  }

  /**
   * Process extracted text to identify questions and answers
   * @param text Extracted text from PDF
   * @returns Structured question data
   */
  public static processExtractedText(text: string) {
    // Split text into lines and clean up
    const lines = text
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line);
    
    const questions = [];
    let currentQuestion: any = null;
    
    for (const line of lines) {
      // Enhanced question pattern matching
      const questionMatch = line.match(/^(?:Q(?:uestion)?\.?\s*)?(\d+)[:.]\s*(.+)/i);
      
      if (questionMatch) {
        if (currentQuestion) {
          questions.push(currentQuestion);
        }
        currentQuestion = {
          question_number: questionMatch[1],
          text: questionMatch[2],
          options: [],
          explanation: ''
        };
      } else if (currentQuestion) {
        // Match multiple choice options (A, B, C, D)
        const optionMatch = line.match(/^([A-D])[).]\s*(.+)/i);
        if (optionMatch) {
          currentQuestion.options.push({
            label: optionMatch[1].toUpperCase(),
            text: optionMatch[2].trim()
          });
        } else if (line.toLowerCase().startsWith('explication') || line.toLowerCase().startsWith('solution')) {
          // Start capturing explanation
          currentQuestion.explanation = line;
        } else if (currentQuestion.explanation) {
          // Continue capturing explanation if we're in explanation mode
          currentQuestion.explanation += ' ' + line;
        } else if (currentQuestion.options.length === 0) {
          // If no options have been found yet, this might be a continuation of the question
          currentQuestion.text += ' ' + line;
        }
      }
    }
    
    // Don't forget to add the last question
    if (currentQuestion) {
      questions.push(currentQuestion);
    }
    
    return questions;
  }
}
