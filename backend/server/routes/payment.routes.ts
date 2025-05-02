import { Router } from 'express';
import { PaymentService } from '../services/payment.service';
import { InvoiceService } from '../services/invoice.service';
import { CourseService } from '../services/course.service';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';
import { PrismaClient, PaymentStatus } from '@prisma/client';
import Stripe from 'stripe';

const router = Router();
const paymentService = PaymentService.getInstance();
const invoiceService = InvoiceService.getInstance();
const courseService = CourseService.getInstance();
const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-03-31.basil'
});

// Create a payment intent for course enrollment
router.post('/create-intent/:courseId', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.id;

    // Check if user is already enrolled
    const isEnrolled = await courseService.isUserEnrolled(userId, courseId);
    if (isEnrolled) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    const paymentIntent = await paymentService.createPaymentIntent(courseId, userId);
    res.json(paymentIntent);
  } catch (error: any) {
    console.error('Error creating payment intent:', error);
    res.status(400).json({ message: error.message });
  }
});

// Confirm payment and create enrollment
router.post('/confirm/:paymentIntentId', authMiddleware, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.id;

    console.log('Confirming payment for user:', userId, 'paymentIntentId:', paymentIntentId);

    // Get the payment intent from database first
    const dbPaymentIntent = await prisma.paymentIntent.findUnique({
      where: { id: paymentIntentId },
      include: {
        course: true
      }
    });

    if (!dbPaymentIntent) {
      console.error('Payment intent not found:', paymentIntentId);
      return res.status(404).json({ message: 'Payment intent not found' });
    }

    console.log('Found payment intent:', {
      id: dbPaymentIntent.id,
      courseId: dbPaymentIntent.courseId,
      status: dbPaymentIntent.status,
      course: dbPaymentIntent.course
    });

    // Confirm payment with Stripe
    const stripePaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    console.log('Stripe payment intent status:', stripePaymentIntent.status);

    if (stripePaymentIntent.status !== 'succeeded') {
      console.error('Payment not successful. Status:', stripePaymentIntent.status);
      return res.status(400).json({ message: 'Payment not successful' });
    }

    // Start a transaction to ensure all operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Update payment intent status in database
      const updatedPayment = await tx.paymentIntent.update({
        where: { id: paymentIntentId },
        data: { 
          status: 'COMPLETED',
          updatedAt: new Date()
        }
      });

      console.log('Updated payment status to COMPLETED');

      // Check if enrollment already exists
      const existingEnrollment = await tx.enrollment.findFirst({
        where: {
          userId,
          courseId: dbPaymentIntent.courseId,
          status: 'ACTIVE'
        }
      });

      if (existingEnrollment) {
        console.log('Enrollment already exists:', existingEnrollment.id);
        return { payment: updatedPayment, enrollment: existingEnrollment };
      }

      // Create enrollment
      console.log('Creating new enrollment for course:', dbPaymentIntent.courseId);
      const enrollment = await tx.enrollment.create({
        data: {
          userId,
          courseId: dbPaymentIntent.courseId,
          status: 'ACTIVE',
          enrolledAt: new Date()
        }
      });
      console.log('Created enrollment:', enrollment.id);
      
      // Update payment intent with enrollment ID
      await tx.paymentIntent.update({
        where: { id: paymentIntentId },
        data: { enrollmentId: enrollment.id }
      });
      
      // Initialize or get existing course progress
      console.log('Initializing course progress');
      const courseProgress = await tx.courseProgress.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId: dbPaymentIntent.courseId
          }
        },
        update: {
          // Keep existing progress if it exists
          updatedAt: new Date()
        },
        create: {
          userId,
          courseId: dbPaymentIntent.courseId,
          progress: 0,
          completed: false
        }
      });
      console.log('Course progress initialized:', courseProgress.id);

      return { payment: updatedPayment, enrollment, courseProgress };
    });

    // Verify enrollment was created
    const verifyEnrollment = await prisma.enrollment.findUnique({
      where: { id: result.enrollment.id },
      include: {
        course: true
      }
    });
    console.log('Verified enrollment:', verifyEnrollment);

    res.json({ 
      ...result,
      message: 'Payment confirmed and enrollment created successfully'
    });
  } catch (error: any) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// Get payment status
router.get('/status/:paymentIntentId', authMiddleware, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const status = await paymentService.getPaymentStatus(paymentIntentId);
    res.json(status);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get all payment transactions (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const payments = await paymentService.getAllPayments();
    res.json(payments);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get user's payment transactions
router.get('/my-transactions', authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.id;
    const payments = await paymentService.getUserPayments(userId);
    res.json(payments);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Download invoice
router.get('/invoice/:paymentIntentId', authMiddleware, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Generate invoice
    const pdfBuffer = await invoiceService.generateInvoice(paymentIntentId);

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${paymentIntentId}.pdf`);

    // Send PDF
    res.send(pdfBuffer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get successful payments statistics (admin only)
router.get('/statistics/successful', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const statistics = await paymentService.getSuccessfulPaymentsStats();
    res.json(statistics);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get monthly revenue statistics (admin only)
router.get('/statistics/monthly-revenue', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const statistics = await paymentService.getMonthlyRevenueStats();
    res.json(statistics);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export default router; 