import { Metadata } from 'next';

import { AnimatedHeader } from '@/components/app/header';

export const metadata: Metadata = {
  title: 'Privacy Policy',
};

export default function PrivacyPolicyPage() {
  return (
    <div>
      <AnimatedHeader />
      <div className='container mx-auto pt-30 px-4 py-8'>
        <h1 className='text-3xl font-bold mb-4'>Privacy Policy</h1>
        <p className='mb-4'>Last updated: August 08, 2025</p>

        <h2 className='text-2xl font-bold mt-6 mb-2'>1. Introduction</h2>
        <p>
          This Privacy Policy describes how Spatium (&quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;) collects, uses, and discloses your
          information when you use our Service. By using the Service, you agree
          to the collection and use of information in accordance with this
          policy.
        </p>

        <h2 className='text-2xl font-bold mt-6 mb-2'>
          2. Information We Collect
        </h2>
        <p>We may collect the following types of information:</p>
        <ul className='list-disc list-inside ml-4'>
          <li>
            <strong>Personal Information:</strong> When you register for an
            account, we collect your Discord user ID, username, email address,
            and avatar URL.
          </li>
          <li>
            <strong>Server Information:</strong> We collect information about
            the Discord servers you connect to our Service, including server ID,
            name, icon, owner ID, member count, and online count.
          </li>
          <li>
            <strong>Usage Data:</strong> We collect data on how you use the
            Service, such as commands you run, moderation actions you perform,
            and your activity on the dashboard.
          </li>
          <li>
            <strong>Payment Information:</strong> We use a third-party payment
            processor (Clerk) to handle payments. We do not store your payment
            information.
          </li>
        </ul>

        <h2 className='text-2xl font-bold mt-6 mb-2'>
          3. How We Use Your Information
        </h2>
        <p>We use the information we collect to:</p>
        <ul className='list-disc list-inside ml-4'>
          <li>Provide, operate, and maintain our Service.</li>
          <li>Improve, personalize, and expand our Service.</li>
          <li>Understand and analyze how you use our Service.</li>
          <li>Develop new products, services, features, and functionality.</li>
          <li>
            Communicate with you, either directly or through one of our
            partners, including for customer service, to provide you with
            updates and other information relating to the Service, and for
            marketing and promotional purposes.
          </li>
          <li>Process your transactions.</li>
          <li>Find and prevent fraud.</li>
        </ul>

        <h2 className='text-2xl font-bold mt-6 mb-2'>
          4. How We Share Your Information
        </h2>
        <p>We may share your information in the following situations:</p>
        <ul className='list-disc list-inside ml-4'>
          <li>
            <strong>With Your Consent:</strong> We may disclose your personal
            information for any other purpose with your consent.
          </li>
          <li>
            <strong>To Comply with Laws:</strong> We may disclose your
            information where we are legally required to do so in order to
            comply with applicable law, governmental requests, a judicial
            proceeding, court order, or legal process.
          </li>
        </ul>

        <h2 className='text-2xl font-bold mt-6 mb-2'>5. Data Security</h2>
        <p>
          The security of your data is important to us. We use commercially
          acceptable means to protect your Personal Information, but remember
          that no method of transmission over the Internet, or method of
          electronic storage is 100% secure and reliable, and we cannot
          guarantee its absolute security.
        </p>

        <h2 className='text-2xl font-bold mt-6 mb-2'>6. Your Data Rights</h2>
        <p>
          You have the right to access, update, or delete your personal
          information. You can do this by contacting us.
        </p>

        <h2 className='text-2xl font-bold mt-6 mb-2'>7. Children's Privacy</h2>
        <p>
          Our Service does not address anyone under the age of 13. We do not
          knowingly collect personally identifiable information from children
          under 13. If you are a parent or guardian and you are aware that your
          child has provided us with Personal Information, please contact us.
        </p>

        <h2 className='text-2xl font-bold mt-6 mb-2'>
          8. Changes to This Privacy Policy
        </h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you
          of any changes by posting the new Privacy Policy on this page.
        </p>

        <h2 className='text-2xl font-bold mt-6 mb-2'>9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact
          us.
        </p>
      </div>
    </div>
  );
}
