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

      // Create PDF document
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      // Collect PDF chunks
      doc.on('data', (chunk) => chunks.push(chunk));

      // Add content to PDF
      doc.fontSize(25).text('Invoice', { align: 'center' });
      doc.moveDown();

      // Company Information
      doc.fontSize(12).text('Training Center', { align: 'right' });
      doc.text('123 Education Street', { align: 'right' });
      doc.text('City, Country', { align: 'right' });
      doc.moveDown();

      // Invoice Details
      doc.fontSize(12).text(`Invoice Number: ${payment.id}`);
      doc.text(`Date: ${format(payment.createdAt, 'dd/MM/yyyy')}`);
      doc.moveDown();

      // Customer Information
      doc.fontSize(12).text('Bill To:');
      doc.text(`Name: ${payment.user.name}`);
      doc.text(`Email: ${payment.user.email}`);
      doc.moveDown();

      // Course Details
      doc.fontSize(12).text('Course Details:');
      doc.text(`Course: ${payment.course.name}`);
      doc.text(`Amount: $${payment.amount.toFixed(2)}`);
      doc.moveDown();

      // Payment Status
      doc.fontSize(12).text(`Payment Status: ${payment.status}`);
      doc.moveDown();

      // Footer
      doc.fontSize(10).text('Thank you for your business!', { align: 'center' });
      doc.text('This is a computer-generated invoice, no signature required.', { align: 'center' });

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