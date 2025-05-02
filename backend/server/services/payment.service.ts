import { PrismaClient, PaymentStatus, EnrollmentStatus } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-03-31.basil',
  typescript: true
});

export class PaymentService {
  private static instance: PaymentService;

  private constructor() {}

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async createPaymentIntent(courseId: string, userId: string) {
    try {
      // Validate inputs
      if (!courseId || !userId) {
        throw new Error('Course ID and User ID are required');
      }

      // Get course details
      const course = await prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!course) {
        throw new Error('Course not found');
      }

      // Check if user already has an active enrollment
      const existingEnrollment = await prisma.enrollment.findFirst({
        where: {
          userId,
          courseId,
          status: EnrollmentStatus.ACTIVE
        }
      });

      if (existingEnrollment) {
        throw new Error('User is already enrolled in this course');
      }

      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(course.price * 100), // Convert to cents
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: {
          courseId,
          userId
        },
        // Add test mode specific options
        confirm: false,
        capture_method: 'automatic',
        setup_future_usage: 'off_session',
        description: `Enrollment for course: ${course.name}`
      });

      if (!paymentIntent.client_secret) {
        throw new Error('Failed to create payment intent: No client secret');
      }

      // Store payment intent in database
      const dbPaymentIntent = await prisma.paymentIntent.create({
        data: {
          id: paymentIntent.id,
          amount: course.price,
          status: PaymentStatus.PENDING,
          courseId,
          userId
        }
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: dbPaymentIntent.id,
        amount: course.price
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to create payment intent');
    }
  }

  async confirmPayment(paymentIntentId: string) {
    try {
      if (!paymentIntentId) {
        throw new Error('Payment Intent ID is required');
      }

      // Get payment intent from Stripe
      const stripePaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (stripePaymentIntent.status !== 'succeeded') {
        throw new Error('Payment not successful');
      }

      // Update payment intent status in database
      const paymentIntent = await prisma.paymentIntent.update({
        where: { id: paymentIntentId },
        data: { status: PaymentStatus.COMPLETED }
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to confirm payment');
    }
  }

  async getPaymentStatus(paymentIntentId: string) {
    try {
      if (!paymentIntentId) {
        throw new Error('Payment Intent ID is required');
      }

      const paymentIntent = await prisma.paymentIntent.findUnique({
        where: { id: paymentIntentId }
      });

      if (!paymentIntent) {
        throw new Error('Payment intent not found');
      }

      return paymentIntent;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get payment status');
    }
  }

  async getAllPayments() {
    try {
      const payments = await prisma.paymentIntent.findMany({
        include: {
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          },
          course: {
            select: {
              id: true,
              name: true,
              price: true
            }
          },
          enrollment: {
            select: {
              id: true,
              status: true,
              enrolledAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return payments;
    } catch (error) {
      console.error('Error getting all payments:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get all payments');
    }
  }

  async getUserPayments(userId: string) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const payments = await prisma.paymentIntent.findMany({
        where: {
          userId
        },
        include: {
          course: {
            select: {
              id: true,
              name: true,
              price: true
            }
          },
          enrollment: {
            select: {
              id: true,
              status: true,
              enrolledAt: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return payments;
    } catch (error) {
      console.error('Error getting user payments:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get user payments');
    }
  }

  async getSuccessfulPaymentsStats() {
    try {
      const stats = await prisma.paymentIntent.groupBy({
        by: ['status'],
        _count: {
          id: true
        }
      });

      return stats.reduce((acc, curr) => {
        acc[curr.status.toLowerCase()] = curr._count.id;
        return acc;
      }, {} as Record<string, number>);
    } catch (error) {
      console.error('Error getting successful payments stats:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get successful payments stats');
    }
  }

  async getMonthlyRevenueStats() {
    try {
      const payments = await prisma.paymentIntent.findMany({
        where: {
          status: 'COMPLETED'
        },
        select: {
          amount: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      });

      const monthlyRevenue = payments.reduce((acc, payment) => {
        const month = new Date(payment.createdAt).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + payment.amount;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(monthlyRevenue).map(([month, revenue]) => ({
        month,
        revenue
      }));
    } catch (error) {
      console.error('Error getting monthly revenue stats:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to get monthly revenue stats');
    }
  }
} 