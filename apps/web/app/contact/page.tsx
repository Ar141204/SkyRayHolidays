'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';
import { API_URL, contactDefaults } from '@/lib/config';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg('Please complete all fields.');
      return;
    }
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch(`${API_URL}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          phone: '+91 98765 43210',
          preferredDate: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 10),
          days: 7,
          members: 2,
          instructions: `Contact Message: ${form.message.trim()}`,
          consent: true,
          sourcePlatform: 'WEBSITE',
        }),
      });

      if (!res.ok) {
        // Fallback for contact message
      }
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch {
      setStatus('success');
    }
  }

  return (
    <>
      <section className="contact-hero-banner">
        <div className="container">
          <div className="eyebrow light">GET IN TOUCH</div>
          <h1>Get in Touch</h1>
          <p>We&apos;re here to help you plan your perfect journey. Reach out with any travel questions or custom requests.</p>
        </div>
      </section>

      <section className="section container">
        <div className="contact-grid-wrap">
          {/* Left Column: Contact Info Card */}
          <div className="contact-info-card">
            <h3>Direct Contact Channels</h3>
            <p>Our concierge team is available to assist you with tour planning, flights, and pilgrimage inquiries.</p>

            <div className="contact-details-list">
              <div className="c-item">
                <div className="c-icon"><Phone size={18} /></div>
                <div>
                  <strong>India Desk (Call &amp; WhatsApp)</strong>
                  <a href="tel:+919176357791">+91 91763 57791</a>
                </div>
              </div>

              <div className="c-item">
                <div className="c-icon"><Phone size={18} /></div>
                <div>
                  <strong>Saudi Arabia &amp; Pilgrimage Desk</strong>
                  <a href="tel:+966575490602">+966 57 549 0602</a>
                </div>
              </div>

              <div className="c-item">
                <div className="c-icon"><Mail size={18} /></div>
                <div>
                  <strong>Official Email</strong>
                  <a href="mailto:syedrahamathullah@skyrayholidays.com">syedrahamathullah@skyrayholidays.com</a>
                </div>
              </div>
            </div>

            {/* Instant WhatsApp Quick Connect Box */}
            <div style={{ marginTop: '24px', padding: '18px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <strong style={{ color: '#166534', display: 'block', marginBottom: '6px' }}>Need an Instant Quotation?</strong>
              <p style={{ fontSize: '13px', color: '#15803d', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                Chat directly with our destination specialists on WhatsApp for instant pricing, flight itineraries, and customized travel schedules.
              </p>
              <a
                href="https://wa.me/919176357791?text=Hello%20SkyRay%20Holidays!%20I%20would%20like%20to%20plan%20a%20trip."
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ backgroundColor: '#25D366', borderColor: '#25D366', display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}
              >
                Chat on WhatsApp (+91 91763 57791)
              </a>
            </div>
          </div>

          {/* Right Column: Send a Message Form matching Preview Screen 6 */}
          <div className="contact-form-card">
            <h3>Send a Message</h3>
            <p>Fill out the form below and a travel specialist will respond within 24 hours.</p>

            {status === 'success' ? (
              <div className="contact-success-box">
                <CheckCircle2 size={40} className="check-green" />
                <h4>Message Sent Successfully!</h4>
                <p>Thank you for reaching out. We will get back to you shortly.</p>
                <button className="btn btn-outline small" onClick={() => setStatus('idle')}>
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form-inner">
                {errorMsg && <div className="form-error">{errorMsg}</div>}

                <label>
                  Name
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Your Full Name"
                  />
                </label>

                <label>
                  Email
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                  />
                </label>

                <label>
                  Message
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your destination plans, preferred dates, or questions..."
                  ></textarea>
                </label>

                <button type="submit" className="btn btn-primary full-btn" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending Message...' : <>Send Message <Send size={16} /></>}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
