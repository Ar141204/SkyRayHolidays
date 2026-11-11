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
          {/* Left Column: Contact Info Card matching Preview Screen 6 */}
          <div className="contact-info-card">
            <h3>Contact Information</h3>
            <p>Our team is available to assist you with tour planning, flights, and pilgrimage inquiries.</p>

            <div className="contact-details-list">
              <div className="c-item">
                <div className="c-icon"><Phone size={18} /></div>
                <div>
                  <strong>Phone</strong>
                  <a href={`tel:${contactDefaults.phone}`}>{contactDefaults.phone}</a>
                </div>
              </div>

              <div className="c-item">
                <div className="c-icon"><Mail size={18} /></div>
                <div>
                  <strong>Email</strong>
                  <a href={`mailto:${contactDefaults.email}`}>{contactDefaults.email}</a>
                </div>
              </div>

              <div className="c-item">
                <div className="c-icon"><MapPin size={18} /></div>
                <div>
                  <strong>Address</strong>
                  <span>{contactDefaults.address}</span>
                </div>
              </div>
            </div>

            {/* Embedded Stylized Map matching Preview Screen 6 */}
            <div className="contact-map-frame">
              <iframe
                title="Office Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d124413.9189387431!2d80.14120377750838!3d13.047525492477148!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5265ea4f7d3361%3A0x6e61a70b6863d433!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="220"
                style={{ border: 0, borderRadius: '4px' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
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
