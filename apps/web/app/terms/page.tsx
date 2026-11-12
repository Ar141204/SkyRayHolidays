import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Use & Booking Policy | SkyRay Holidays',
  description:
    'SkyRay Holidays Terms of Service — Booking conditions, cancellation policy, pilgrimage package guidelines, and liability disclaimer.',
};

export default function Terms() {
  return (
    <div className="legal-page-wrap">
      <section className="page-hero short">
        <div className="container">
          <div className="eyebrow light">TERMS &amp; CONDITIONS</div>
          <h1>Terms of Service</h1>
          <p>Last updated: November 2026</p>
        </div>
      </section>

      <section className="section container legal-page">
        <h2>1. Scope of Service &amp; Enquiries</h2>
        <p>
          Submitting an enquiry through this platform constitutes a request for travel consultation and quotation.
          An enquiry does not create a binding booking, confirmed airline ticket, or payment obligation until a formal
          invoice is issued and accepted with the agreed advance payment.
        </p>

        <h2>2. Pricing, Availability &amp; Itineraries</h2>
        <p>
          Package prices, hotel accommodations, departure dates, and flight schedules displayed on the website or mobile application
          are subject to seasonal fluctuations and provider availability. SkyRay Holidays reserves the right to modify itinerary sequences
          in the event of flight rescheduling, weather disruptions, or local regulatory directives, ensuring equivalent standards are upheld.
        </p>

        <h2>3. Hajj &amp; Umrah Pilgrimage Conditions</h2>
        <p>
          Pilgrimage packages are operated in strict compliance with the Ministry of Hajj &amp; Umrah regulations of the Kingdom of Saudi Arabia.
          Visa issuance, Nusuk platform permits, and border controls remain under the sovereign authority of the Saudi government. While SkyRay
          Holidays provides comprehensive documentation support, visa approval or specific flight timings cannot be legally guaranteed.
        </p>

        <h2>4. Cancellation &amp; Refund Policy</h2>
        <ul>
          <li><strong>Cancellations made 30+ days prior to departure:</strong> Refundable subject to non-refundable airline and hotel lock-in deposits.</li>
          <li><strong>Cancellations made 15–29 days prior to departure:</strong> 50% package cancellation fee applies.</li>
          <li><strong>Cancellations within 14 days of departure:</strong> Non-refundable due to pre-committed accommodation and airline ticketing.</li>
        </ul>

        <h2>5. Travel Insurance &amp; Health Requirements</h2>
        <p>
          Travellers are strongly advised to obtain comprehensive international travel and medical insurance. Passengers are responsible for
          ensuring valid passports (minimum 6 months validity from date of travel) and necessary vaccinations or health declarations.
        </p>

        <h2>6. Limitation of Liability &amp; Force Majeure</h2>
        <p>
          SkyRay Holidays acts solely as a travel coordinator and shall not be held liable for losses, delays, personal injuries, or property damage
          resulting from acts of God, civil unrest, flight cancellations, quarantine measures, or airline strikes.
        </p>

        <h2>7. Governing Law &amp; Jurisdiction</h2>
        <p>
          These terms and any disputes arising out of travel arrangements shall be governed by and construed in accordance with the laws
          of India, with exclusive jurisdiction in the competent courts of law.
        </p>
      </section>
    </div>
  );
}
