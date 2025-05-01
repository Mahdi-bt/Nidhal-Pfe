import { Router } from 'express';
import { PaymentService } from '../services/payment.service';
import { InvoiceService } from '../services/invoice.service';
import { authMiddleware, adminMiddleware } from '../middleware/auth.middleware';

const router = Router();
const paymentService = PaymentService.getInstance();
const invoiceService = InvoiceService.getInstance();

// Create a payment intent for course enrollment
router.post('/create-intent/:courseId', authMiddleware, async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    const userId = req.user.id;

    const paymentIntent = await paymentService.createPaymentIntent(courseId, userId);
    res.json(paymentIntent);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Confirm payment and create enrollment
router.post('/confirm/:paymentIntentId', authMiddleware, async (req, res) => {
  try {
    const { paymentIntentId } = req.params;
    const payment = await paymentService.confirmPayment(paymentIntentId);
    res.json(payment);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
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