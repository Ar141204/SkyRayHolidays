import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Notice | SkyRay Holidays',
  description:
    'SkyRay Holidays Privacy Policy — Learn how we collect, process, protect and store your personal travel enquiry data in accordance with DPDP Act 2023.',
};

export default function Privacy() {
  return (
    <div className="legal-page-wrap">
      <section className="page-hero short">
        <div className="container">
          <div className="eyebrow light">LEGAL &amp; COMPLIANCE</div>
          <h1>Privacy Policy</h1>
          <p>Last updated: November 2026</p>
        </div>
      </section>

      <section className="section container legal-page">
        <h2>1. Overview &amp; Data Fiduciary Details</h2>
        <p>
          SkyRay Holidays (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) is committed to protecting the privacy
          and personal data of our customers, website visitors, and pilgrimage participants. This Privacy Notice outlines our
          policies regarding the collection, use, disclosure, and safeguarding of personal data when you use our website, mobile applications,
          and travel enquiry services.
        </p>

        <h2>2. Information We Collect</h2>
        <p>We only collect personal information that is necessary to process your travel requests, including:</p>
        <ul>
          <li><strong>Identity &amp; Contact Details:</strong> Full name, phone/WhatsApp number, email address, and residential city.</li>
          <li><strong>Travel Preferences:</strong> Destination choices, preferred dates of departure, duration, group size, and custom instructions.</li>
          <li><strong>Pilgrimage Specific Information:</strong> Required documentation for Hajj and Umrah permits, passport validity details, and special accessibility requirements.</li>
          <li><strong>Technical &amp; Usage Data:</strong> IP addresses, browser types, device identifiers, and session timestamps collected to maintain operational security and prevent spam.</li>
        </ul>

        <h2>3. Purpose and Legal Basis for Processing</h2>
        <p>Your data is processed strictly for legitimate travel business purposes under your explicit consent, including:</p>
        <ul>
          <li>Reviewing, answering, and providing quotes for tour packages and pilgrimage services.</li>
          <li>Communicating via phone, WhatsApp, or email regarding itinerary revisions and confirmed bookings.</li>
          <li>Fulfilling statutory compliance requirements and preventing fraudulent or abusive enquiries.</li>
        </ul>

        <h2>4. Data Sharing &amp; Third-Party Disclosures</h2>
        <p>
          We do not sell, rent, or trade your personal data. We disclose personal information only to trusted third-party service providers
          strictly required to execute your travel arrangements (e.g., licensed airlines, certified hotel partners, authorized visa processing
          consulates, and cloud infrastructure hosts).
        </p>

        <h2>5. Data Retention &amp; Security Measures</h2>
        <p>
          Personal enquiry data is retained only for as long as necessary to fulfill the requested travel booking and meet legal retention
          obligations. We implement industry-standard encryption (AES-256 and TLS/HTTPS) to secure your data in transit and at rest.
        </p>

        <h2>6. Your Rights &amp; Grievance Redressal</h2>
        <p>
          Under applicable data protection laws, including the Digital Personal Data Protection Act (DPDP Act 2023), you have the right to
          request access to, correction of, or erasure of your personal data. To exercise these rights, please contact our Data Protection
          Officer at:
        </p>
        <div className="contact-box-legal">
          <strong>Data Protection &amp; Grievance Officer</strong>
          <br />
          SkyRay Holidays
          <br />
          Email: <a href="mailto:privacy@skyrayholidays.com">privacy@skyrayholidays.com</a>
          <br />
          Address: 123 Travel Street, Chennai, TN 600001, India
        </div>
      </section>
    </div>
  );
}
