import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

const TermsOfService = () => {
  const handleEmailClick = () => {
    window.location.href = 'mailto:contact@warzeez.net?subject=Terms of Service Inquiry';
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using Warzeez Training, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. User Accounts</h2>
            <p className="text-gray-600 mb-4">
              To access certain features of the platform, you must register for an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Notify us immediately of any unauthorized use</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Course Access and Usage</h2>
            <p className="text-gray-600 mb-4">
              When you enroll in a course:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>You receive a limited, non-transferable license to access the course content</li>
              <li>You may not share your account or course access with others</li>
              <li>You may not download or distribute course materials</li>
              <li>Course access is for personal, non-commercial use only</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Payment Terms</h2>
            <p className="text-gray-600 mb-4">
              Payment terms and conditions:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>All fees are non-refundable except as required by law</li>
              <li>We may change our fees at any time with notice</li>
              <li>You are responsible for all applicable taxes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
            <p className="text-gray-600 mb-4">
              All content on the platform, including courses, is protected by copyright and other intellectual property rights. You may not:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>Copy or reproduce any content</li>
              <li>Modify or create derivative works</li>
              <li>Distribute or publicly display content</li>
              <li>Use content for commercial purposes</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
            <p className="text-gray-600 mb-4">
              We may terminate or suspend your access to the platform:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mb-4">
              <li>For violations of these terms</li>
              <li>For fraudulent or illegal activity</li>
              <li>At our sole discretion</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact</h2>
            <p className="text-gray-600 mb-4">
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className="space-y-4">
              <p className="text-gray-600">Email: contact@warzeez.net</p>
              <Button 
                onClick={handleEmailClick}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Contact Us via Email
              </Button>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsOfService; 