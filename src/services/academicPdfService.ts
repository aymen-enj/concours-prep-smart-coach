
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PdfExamResult {
  examTitle: string;
  examYear: number;
  examDate: string;
  studentName?: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  duration: string;
  timeTaken?: string;
  subjectBreakdown: Array<{
    subject: string;
    score: number;
    total: number;
    percentage: number;
  }>;
  detailedAnswers: Array<{
    questionNumber: number;
    subject: string;
    isCorrect: boolean;
    selectedAnswer: string;
    correctAnswer: string;
    timeSpent?: number;
  }>;
}

export class AcademicPdfService {
  private pdf: jsPDF;
  private currentY: number = 0;
  private pageHeight: number = 297; // A4 height in mm
  private pageWidth: number = 210; // A4 width in mm
  private margin: number = 20;
  private contentWidth: number;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.contentWidth = this.pageWidth - (2 * this.margin);
  }

  private addHeader() {
    // Logo placeholder area
    this.pdf.setFillColor(41, 128, 185);
    this.pdf.rect(this.margin, 15, this.contentWidth, 25, 'F');
    
    // Main title
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('RAPPORT DE RÉSULTATS D\'EXAMEN', this.pageWidth / 2, 30, { align: 'center' });
    
    // Subtitle
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('Analyse détaillée des performances', this.pageWidth / 2, 36, { align: 'center' });
    
    this.currentY = 50;
  }

  private addExamInfo(data: PdfExamResult) {
    // Section title
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('INFORMATIONS GÉNÉRALES', this.margin, this.currentY);
    
    this.currentY += 10;
    
    // Info box
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.setFillColor(248, 248, 248);
    this.pdf.rect(this.margin, this.currentY, this.contentWidth, 35, 'FD');
    
    // Info content
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    
    const infoY = this.currentY + 8;
    const leftColX = this.margin + 5;
    const rightColX = this.margin + (this.contentWidth / 2) + 5;
    
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('Examen:', leftColX, infoY);
    this.pdf.text('Date:', leftColX, infoY + 6);
    this.pdf.text('Durée prévue:', leftColX, infoY + 12);
    this.pdf.text('Questions totales:', rightColX, infoY);
    this.pdf.text('Score obtenu:', rightColX, infoY + 6);
    this.pdf.text('Pourcentage:', rightColX, infoY + 12);
    
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`${data.examTitle} ${data.examYear}`, leftColX + 25, infoY);
    this.pdf.text(data.examDate, leftColX + 15, infoY + 6);
    this.pdf.text(data.duration, leftColX + 30, infoY + 12);
    this.pdf.text(data.totalQuestions.toString(), rightColX + 35, infoY);
    this.pdf.text(`${data.correctAnswers}/${data.totalQuestions}`, rightColX + 28, infoY + 6);
    this.pdf.text(`${data.score.toFixed(1)}%`, rightColX + 28, infoY + 12);
    
    this.currentY += 45;
  }

  private addPerformanceChart(data: PdfExamResult) {
    // Section title
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('ANALYSE DE PERFORMANCE', this.margin, this.currentY);
    
    this.currentY += 15;
    
    // Performance bar
    const barWidth = this.contentWidth - 40;
    const barHeight = 15;
    const barX = this.margin + 20;
    
    // Background bar
    this.pdf.setFillColor(230, 230, 230);
    this.pdf.rect(barX, this.currentY, barWidth, barHeight, 'F');
    
    // Score bar
    const scoreWidth = (barWidth * data.score) / 100;
    let barColor;
    if (data.score >= 80) barColor = [46, 204, 113]; // Green
    else if (data.score >= 60) barColor = [241, 196, 15]; // Yellow
    else barColor = [231, 76, 60]; // Red
    
    this.pdf.setFillColor(barColor[0], barColor[1], barColor[2]);
    this.pdf.rect(barX, this.currentY, scoreWidth, barHeight, 'F');
    
    // Score text
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`${data.score.toFixed(1)}%`, barX + barWidth + 5, this.currentY + 10);
    
    // Scale markers
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('0%', barX - 5, this.currentY + 25);
    this.pdf.text('50%', barX + (barWidth/2) - 5, this.currentY + 25);
    this.pdf.text('100%', barX + barWidth - 8, this.currentY + 25);
    
    this.currentY += 35;
  }

  private addSubjectBreakdown(data: PdfExamResult) {
    if (data.subjectBreakdown.length === 0) return;
    
    // Section title
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('RÉPARTITION PAR MATIÈRE', this.margin, this.currentY);
    
    this.currentY += 15;
    
    // Table header
    const colWidths = [60, 30, 30, 40];
    const headerY = this.currentY;
    
    this.pdf.setFillColor(52, 73, 94);
    this.pdf.rect(this.margin, headerY, this.contentWidth, 8, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'bold');
    
    let currentX = this.margin + 2;
    this.pdf.text('MATIÈRE', currentX, headerY + 6);
    currentX += colWidths[0];
    this.pdf.text('SCORE', currentX, headerY + 6);
    currentX += colWidths[1];
    this.pdf.text('TOTAL', currentX, headerY + 6);
    currentX += colWidths[2];
    this.pdf.text('POURCENTAGE', currentX, headerY + 6);
    
    this.currentY += 8;
    
    // Table rows
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFont('helvetica', 'normal');
    
    data.subjectBreakdown.forEach((subject, index) => {
      const rowY = this.currentY + (index * 8);
      
      // Alternating row colors
      if (index % 2 === 0) {
        this.pdf.setFillColor(248, 248, 248);
        this.pdf.rect(this.margin, rowY, this.contentWidth, 8, 'F');
      }
      
      currentX = this.margin + 2;
      this.pdf.text(subject.subject, currentX, rowY + 6);
      currentX += colWidths[0];
      this.pdf.text(subject.score.toString(), currentX, rowY + 6);
      currentX += colWidths[1];
      this.pdf.text(subject.total.toString(), currentX, rowY + 6);
      currentX += colWidths[2];
      this.pdf.text(`${subject.percentage.toFixed(1)}%`, currentX, rowY + 6);
    });
    
    this.currentY += (data.subjectBreakdown.length * 8) + 15;
  }

  private addRecommendations(data: PdfExamResult) {
    // Section title
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('RECOMMANDATIONS', this.margin, this.currentY);
    
    this.currentY += 10;
    
    let recommendations: string[] = [];
    
    if (data.score >= 80) {
      recommendations = [
        '• Excellente performance globale. Continuez sur cette lancée.',
        '• Concentrez-vous sur les domaines où vous avez eu le moins de bonnes réponses.',
        '• Pratiquez régulièrement pour maintenir ce niveau.'
      ];
    } else if (data.score >= 60) {
      recommendations = [
        '• Performance satisfaisante avec des points d\'amélioration identifiés.',
        '• Renforcez vos connaissances dans les matières les plus faibles.',
        '• Travaillez la gestion du temps lors des examens.'
      ];
    } else {
      recommendations = [
        '• Des efforts supplémentaires sont nécessaires pour améliorer vos résultats.',
        '• Révisez attentivement les concepts fondamentaux.',
        '• Envisagez un accompagnement personnalisé ou des cours de soutien.'
      ];
    }
    
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    
    recommendations.forEach((rec, index) => {
      this.pdf.text(rec, this.margin + 5, this.currentY + (index * 6) + 5);
    });
    
    this.currentY += (recommendations.length * 6) + 15;
  }

  private addFooter(pageNum: number, totalPages: number) {
    const footerY = this.pageHeight - 15;
    
    // Line
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.line(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5);
    
    // Footer text
    this.pdf.setFontSize(8);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(128, 128, 128);
    
    const date = new Date().toLocaleDateString('fr-FR');
    this.pdf.text(`Généré le ${date}`, this.margin, footerY);
    this.pdf.text(`Page ${pageNum}/${totalPages}`, this.pageWidth - this.margin, footerY, { align: 'right' });
  }

  private checkPageBreak() {
    if (this.currentY > this.pageHeight - 40) {
      this.pdf.addPage();
      this.currentY = 30;
      return true;
    }
    return false;
  }

  public generatePDF(data: PdfExamResult): jsPDF {
    // Page 1: Summary
    this.addHeader();
    this.addExamInfo(data);
    this.addPerformanceChart(data);
    this.addSubjectBreakdown(data);
    this.addRecommendations(data);
    this.addFooter(1, 2);
    
    // Page 2: Detailed answers (if space allows)
    if (data.detailedAnswers.length > 0) {
      this.pdf.addPage();
      this.currentY = 30;
      
      this.pdf.setFontSize(14);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text('DÉTAIL DES RÉPONSES', this.margin, this.currentY);
      this.currentY += 15;
      
      // Group by subject for better organization
      const answersBySubject = data.detailedAnswers.reduce((acc, answer) => {
        if (!acc[answer.subject]) acc[answer.subject] = [];
        acc[answer.subject].push(answer);
        return acc;
      }, {} as Record<string, typeof data.detailedAnswers>);
      
      Object.entries(answersBySubject).forEach(([subject, answers]) => {
        if (this.checkPageBreak()) {
          // Add header to new page if needed
        }
        
        this.pdf.setFontSize(12);
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text(subject.toUpperCase(), this.margin, this.currentY);
        this.currentY += 8;
        
        answers.forEach((answer) => {
          if (this.checkPageBreak()) return;
          
          const icon = answer.isCorrect ? '✓' : '✗';
          const color = answer.isCorrect ? [46, 204, 113] : [231, 76, 60];
          
          this.pdf.setTextColor(color[0], color[1], color[2]);
          this.pdf.setFontSize(10);
          this.pdf.setFont('helvetica', 'bold');
          this.pdf.text(`${icon} Q${answer.questionNumber}`, this.margin + 5, this.currentY);
          
          this.pdf.setTextColor(0, 0, 0);
          this.pdf.setFont('helvetica', 'normal');
          this.pdf.text(`Votre réponse: ${answer.selectedAnswer}`, this.margin + 25, this.currentY);
          
          if (!answer.isCorrect) {
            this.pdf.setTextColor(128, 128, 128);
            this.pdf.text(`Bonne réponse: ${answer.correctAnswer}`, this.margin + 25, this.currentY + 4);
            this.currentY += 4;
          }
          
          this.currentY += 6;
        });
        
        this.currentY += 5;
      });
      
      this.addFooter(2, 2);
    }
    
    return this.pdf;
  }
}

export const generateAcademicExamPDF = (data: PdfExamResult): jsPDF => {
  const service = new AcademicPdfService();
  return service.generatePDF(data);
};
