import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

const HelpCenter = () => {
  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer: "To enroll in a course, simply browse our course catalog, select the course you're interested in, and click the 'Enroll Now' button. You'll need to be logged in to complete the enrollment process."
    },
    {
      question: "How do I track my progress?",
      answer: "You can track your progress in the 'My Courses' section. Each course shows your completion percentage and which sections you've completed."
    },
    {
      question: "What if I need technical support?",
      answer: "For technical support, please contact our support team at support@warzeeztraining.com or use the contact form below."
    },
    {
      question: "Can I get a refund?",
      answer: "We offer a 30-day money-back guarantee for all courses. If you're not satisfied, please contact our support team within 30 days of purchase."
    }
  ];

  const handleEmailClick = () => {
    window.location.href = 'mailto:contact@warzeez.net?subject=Support Request';
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Help Center</h1>
        
        <div className="grid gap-6 mb-8">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{faq.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{faq.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Contact Support</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Need additional help? Our support team is here to assist you.
            </p>
            <div className="space-y-4">
              <div className="space-y-2">
                <p><strong>Email:</strong> contact@warzeez.net</p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
              </div>
              <Button 
                onClick={handleEmailClick}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Contact Support via Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default HelpCenter; 