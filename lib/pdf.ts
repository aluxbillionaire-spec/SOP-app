import PDFDocument from 'pdfkit';
import { PassThrough } from 'stream';

export interface SOPData {
  title: string;
  purpose: string;
  tools: string;
  steps: string[];
  notes: string;
  checklist: string[];
}

export async function generateSOPPDF(sopData: SOPData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const stream = new PassThrough();
      
      const buffers: Buffer[] = [];
      stream.on('data', (chunk) => buffers.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(buffers)));
      stream.on('error', reject);
      
      doc.pipe(stream);
      
      // Title
      (doc as any).fontSize(20).text(sopData.title, { align: 'center' });
      (doc as any).moveDown();
      
      // Purpose
      (doc as any).fontSize(14).text('Purpose:', { underline: true });
      (doc as any).fontSize(12).text(sopData.purpose);
      (doc as any).moveDown();
      
      // Tools
      (doc as any).fontSize(14).text('Tools/Apps Used:', { underline: true });
      (doc as any).fontSize(12).text(sopData.tools);
      (doc as any).moveDown();
      
      // Steps
      (doc as any).fontSize(14).text('Step-by-Step Instructions:', { underline: true });
      sopData.steps.forEach((step, index) => {
        (doc as any).fontSize(12).text(`${index + 1}. ${step}`);
      });
      (doc as any).moveDown();
      
      // Notes
      (doc as any).fontSize(14).text('Notes & Best Practices:', { underline: true });
      (doc as any).fontSize(12).text(sopData.notes);
      (doc as any).moveDown();
      
      // Checklist
      (doc as any).fontSize(14).text('Checklist:', { underline: true });
      sopData.checklist.forEach((item, index) => {
        (doc as any).fontSize(12).text(`□ ${item}`);
      });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}