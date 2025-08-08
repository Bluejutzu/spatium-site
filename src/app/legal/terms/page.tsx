import { Metadata } from 'next';

import { AnimatedHeader } from '@/components/app/header';

export const metadata: Metadata = {
  title: 'Terms of Service',
};

export default function TermsOfServicePage() {
  return (
    <div>
      <AnimatedHeader />
      <div className='container mx-auto pt-30 px-4 py-8'>
        <h1 className='text-3xl font-bold mb-4'>Terms of Service</h1>
        <p className='mb-4'>Last updated: August 08, 2025</p>

        <h2 className='text-2xl font-bold mt-6 mb-2'>1. Acceptance of Terms</h2>
        <p>
          By accessing or using the Spatium service (&quot;Service&quot;), you
          agree to be bound by these Terms of Service (&quot;Terms&quot;). If
          you disagree with any part of the terms, then you may not access the
          Service.
        </p>

        <h2 className='text-2xl font-bold mt-6 mb-2'>
          2. Description of Service
        </h2>
        <p>
          Spatium provides a platform for managing Discord servers, including
          features for moderation, custom commands, and server analytics.
        </p>

        <h2 className='text-2xl font-bold mt-6 mb-2'>3. User Accounts</h2>
        <p>
          To use many features of the Service, you must register for an account
          using your Discord account. You are responsible for safeguarding your
          account and for all activities that occur under your account. You
          agree to notify us immediately of any unauthorized use of your
          account.
        </p>

        <h2 className='text-2xl font-bold mt-6 mb-2'>4. User Conduct</h2>
        <p>You agree not to use the Service to:</p>
        <ul className='list-disc list-inside ml-4'>
          <li>Violate any laws or regulations.</li>
          <li>
            Infringe the rights of any third party, including intellectual
            property rights.
          </li>
          <li>Transmit any viruses or other malicious code.</li>
          <li>Interfere with or disrupt the Service.</li>
        </ul>

        <h2 className='text-2xl font-bold mt-6 mb-2'>
          5. Data Collection and Use
        </h2>
        <p>
          By using the Service, you agree to the collection and use of your data
          as described in our Privacy Policy. This includes, but is not limited
          to, your Discord user information, server data, and command usage.
        </p>

        <h2 className='text-2xl font-bold mt-6 mb-2'>6. Payment and Billing</h2>
        <p>
          Some features of the Service may be available for a fee. All payments
          are handled by our third-party payment processor, Clerk. We do not
          store your payment information.
        </p>

        <h2 className='text-2xl font-bold mt-6 mb-2'>7. Termination</h2>
        <p>
          We may terminate or suspend your access to the Service at any time,
          without prior notice or liability, for any reason, including if you
          breach these Terms.
        </p>

        <h2 className='text-2xl font-bold mt-6 mb-2'>
          8. Disclaimer of Warranties
        </h2>
        <p>
          The Service is provided &quot;as is&quot; and &quot;as available&quot;
          without any warranties of any kind, either express or implied.
        </p>

        <h2 className='text-2xl font-bold mt-6 mb-2'>
          9. Limitation of Liability
        </h2>
        <p>
          In no event shall Spatium, nor its directors, employees, partners,
          agents, suppliers, or affiliates, be liable for any indirect,
          incidental, special, consequential or punitive damages, including
          without limitation, loss of profits, data, use, goodwill, or other
          intangible losses, resulting from your access to or use of or
          inability to access or use the Service.
        </p>

        <h2 className='text-2xl font-bold mt-6 mb-2'>10. Changes to Terms</h2>
        <p>
          We reserve the right, at our sole discretion, to modify or replace
          these Terms at any time. We will provide notice of any changes by
          posting the new Terms on this page.
        </p>

        <h2 className='text-2xl font-bold mt-6 mb-2'>11. Contact Us</h2>
        <p>If you have any questions about these Terms, please contact us.</p>
      </div>
    </div>
  );
}
