import type { Metadata } from 'next';
import { Suspense } from 'react';
import EnquiryForm from '@/components/EnquiryForm';
import { ShieldCheck, Clock, CheckCircle2, Phone, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Enquire Now | Holiday Tours, Umrah & Visa Services',
  description:
    'Send an enquiry for customized international tour packages, Hajj & Umrah pilgrimages, or US, UK, Schengen and E-Visa services with SkyRay Holidays.',
};

export default function Enquire() {
  return (
    <>
      <section className="page-hero short">
        <div className="container">
          <div className="eyebrow light">LET&apos;S PLAN TOGETHER</div>
          <h1>
            Tell us about your <em>journey.</em>
          </h1>
          <p>
            Share your travel dates and requirements. Our concierge team assists you with customized holiday itineraries, Umrah packages, and international visa processing.
          </p>
        </div>
      </section>

      <section className="section container form-layout">
        <div>
          <div className="eyebrow">SPECIALIZED SERVICE ENQUIRY</div>
          <h2>
            Start with the <em>details.</em>
          </h2>
          <p>
            Choose your dedicated enquiry form above: <strong>General Holiday Tours</strong>, <strong>Hajj &amp; Umrah</strong>, <strong>USA Visa</strong>, <strong>UK Visa</strong>, <strong>Schengen Visa</strong>, <strong>Canada Visa</strong>, <strong>GCC Visas</strong>, or <strong>Global E-Visa</strong>. Each form is tailored with exact dropdown options and visa rules for rapid quotation.
          </p>

          <div className="form-side-note">
            <strong style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#17496b' }}>
              <ShieldCheck size={16} color="#0284c7" /> What happens next?
            </strong>
            <p>
              Your enquiry is assigned to our travel &amp; visa specialists. We review your passport readiness or itinerary and contact you directly via WhatsApp or phone.
            </p>
          </div>

          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e2edf3',
              borderRadius: '10px',
              padding: '18px',
              marginTop: '18px',
              display: 'grid',
              gap: '12px',
              fontSize: '12.5px',
            }}
          >
            <div style={{ fontWeight: 800, color: '#17496b', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.05em' }}>
              Direct Office Support
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
              <Phone size={15} color="#0284c7" />
              <span>+91 91763 57791 (India Desk)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
              <Phone size={15} color="#0284c7" />
              <span>+966 57 549 0602 (Saudi Desk)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
              <Mail size={15} color="#0284c7" />
              <span>syedrahamathullah@skyrayholidays.com</span>
            </div>
          </div>
        </div>

        <div className="form-card">
          <Suspense fallback={<div>Loading enquiry form…</div>}>
            <EnquiryForm />
          </Suspense>
        </div>
      </section>
    </>
  );
}
