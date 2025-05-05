import { PrismaClient } from '@prisma/client';
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';

const prisma = new PrismaClient();

export class InvoiceService {
  private static instance: InvoiceService;

  private constructor() {}

  public static getInstance(): InvoiceService {
    if (!InvoiceService.instance) {
      InvoiceService.instance = new InvoiceService();
    }
    return InvoiceService.instance;
  }

  async generateInvoice(paymentIntentId: string) {
    try {
      const payment = await prisma.paymentIntent.findUnique({
        where: { id: paymentIntentId },
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          },
          course: {
            select: {
              name: true,
              price: true
            }
          }
        }
      });

      if (!payment) {
        throw new Error('Payment not found');
      }

      // Create PDF document with high quality settings
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        bufferPages: true,
        info: {
          Title: 'Warzeez Training Invoice',
          Author: 'Warzeez Training',
          Subject: 'Course Payment Invoice',
          Keywords: 'invoice, payment, course',
          CreationDate: new Date()
        }
      });
      const chunks: Buffer[] = [];

      // Collect PDF chunks
      doc.on('data', (chunk) => chunks.push(chunk));

      // Add decorative header
      doc.rect(0, 0, 595.28, 100)
         .fill('#1a56db');

      // Company Logo and Name
      doc.rect(50, 30, 120, 50)
         .fill('#ffffff')
         .fontSize(28)
         .fillColor('#1a56db')
         .text('Warzeez', 60, 45);

      // Header Text
      doc.fontSize(32)
         .fillColor('#ffffff')
         .text('INVOICE', 400, 40, { align: 'right' })
         .fontSize(12)
         .text('Warzeez Training', 400, 90, { align: 'right' })
         .text('123 Education Street', 400, 105, { align: 'right' })
         .text('Tunis, Tunisia', 400, 120, { align: 'right' })
         .moveDown(2);

      // Invoice Details with modern styling
      doc.fontSize(12)
         .fillColor('#374151')
         .text(`Invoice Number: ${payment.id}`, 400, 130, { align: 'right' })
         .text(`Date: ${format(payment.createdAt, 'dd/MM/yyyy')}`, 400, 175, { align: 'right' })
         .moveDown(2);

      // Customer Information with card design
      doc.rect(50, 200, 495, 100)
         .fill('#f8fafc')
         .stroke('#e2e8f0');

      doc.fontSize(14)
         .fillColor('#1a56db')
         .text('Bill To:', 70, 220)
         .fontSize(12)
         .fillColor('#374151')
         .text(`Name: ${payment.user.name}`, 70, 250)
         .text(`Email: ${payment.user.email}`, 70, 270)
         .moveDown(2);

      // Course Details Table with modern design
      const tableTop = 320;
      const tableLeft = 50;
      const tableWidth = 495;

      // Table Header with gradient background
      doc.rect(tableLeft, tableTop, tableWidth, 40)
         .fill('#1a56db');

      doc.fillColor('#ffffff')
         .fontSize(12)
         .text('Description', tableLeft + 20, tableTop + 15)
         .text('Amount', tableLeft + tableWidth - 100, tableTop + 15, { align: 'right' });

      // Table Content with alternating row colors
      doc.rect(tableLeft, tableTop + 40, tableWidth, 50)
         .fill('#f8fafc')
         .stroke('#e2e8f0');

      doc.fillColor('#374151')
         .fontSize(12)
         .text(payment.course.name, tableLeft + 20, tableTop + 60)
         .text(`TND ${payment.amount.toFixed(2)}`, tableLeft + tableWidth - 100, tableTop + 60, { align: 'right' });

      // Total with emphasis
      doc.rect(tableLeft, tableTop + 100, tableWidth, 60)
         .fill('#f1f5f9')
         .stroke('#e2e8f0');

      doc.fontSize(14)
         .fillColor('#1a56db')
         .text('Total', tableLeft + 20, tableTop + 125)
         .text(`TND ${payment.amount.toFixed(2)}`, tableLeft + tableWidth - 100, tableTop + 125, { align: 'right' });

      // Payment Status with badge design
      const statusColor = payment.status === 'COMPLETED' ? '#059669' : '#dc2626';
      doc.rect(50, tableTop + 180, 200, 40)
         .fill(statusColor)
         .stroke(statusColor);

      doc.fillColor('#ffffff')
         .fontSize(12)
         .text(`Payment Status: ${payment.status.toUpperCase()}`, 70, tableTop + 195);

      // Footer with modern design
      doc.rect(0, 700, 595.28, 100)
         .fill('#f8fafc');

      doc.fontSize(10)
         .fillColor('#6b7280')
         .text('Thank you for choosing Warzeez Training!', 50, 720, { align: 'center' })
         .text('This is a computer-generated invoice, no signature required.', 50, 735, { align: 'center' })
         .text('For any questions, please contact support@warzeez.com', 50, 750, { align: 'center' });

      // Add page numbers
      const pages = doc.bufferedPageRange();
      for (let i = 0; i < pages.count; i++) {
        doc.switchToPage(i);
        doc.fontSize(10)
           .fillColor('#6b7280')
           .text(`Page ${i + 1} of ${pages.count}`, 50, 780, { align: 'center' });
      }

      // Finalize PDF
      doc.end();

      // Return PDF buffer
      return new Promise<Buffer>((resolve, reject) => {
        doc.on('end', () => {
          resolve(Buffer.concat(chunks));
        });
        doc.on('error', reject);
      });
    } catch (error) {
      console.error('Error generating invoice:', error);
      throw new Error('Failed to generate invoice');
    }
  }
} 