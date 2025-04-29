import { PrismaClient } from '@prisma/client';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-03-31.basil'
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
      // Get course details
      const course = await prisma.course.findUnique({
        where: { id: courseId }
      });

      if (!course) {
        throw new Error('Course not found');
      }

      // Create payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(course.price * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          courseId,
          userId
        }
      });

      // Store payment intent in database
      const dbPaymentIntent = await prisma.paymentIntent.create({
        data: {
          id: paymentIntent.id,
          amount: course.price,
          status: 'pending',
          courseId,
          userId
        }
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: dbPaymentIntent.id
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  async confirmPayment(paymentIntentId: string) {
    try {
      // Get payment intent from Stripe
      const stripePaymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (stripePaymentIntent.status !== 'succeeded') {
        throw new Error('Payment not successful');
      }

      // Update payment intent status in database
      const paymentIntent = await prisma.paymentIntent.update({
        where: { id: paymentIntentId },
        data: { status: 'completed' }
      });

      // Create enrollment
      await prisma.enrollment.create({
        data: {
          userId: paymentIntent.userId,
          courseId: paymentIntent.courseId,
          status: 'active'
        }
      });

      return paymentIntent;
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  async getPaymentStatus(paymentIntentId: string) {
    try {
      const paymentIntent = await prisma.paymentIntent.findUnique({
        where: { id: paymentIntentId }
      });

      if (!paymentIntent) {
        throw new Error('Payment intent not found');
      }

      return paymentIntent;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw new Error('Failed to get payment status');
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
      throw new Error('Failed to get all payments');
    }
  }

  async getUserPayments(userId: string) {
    try {
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
      throw new Error('Failed to get user payments');
    }
  }
} 