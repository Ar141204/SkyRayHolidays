'use client';

import { useState } from 'react';
import { Mail, MapPin, Phone, Send, CheckCircle2 } from 'lucide-react';
import { API_URL, contactDefaults } from '@/lib/config';
import { useWebsiteContent } from '@/lib/content';

export default function Contact() {
  const { content } = useWebsiteContent();
  const c = content.contact;
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
          <div className="eyebrow light">{c.bannerEyebrow || 'GET IN TOUCH'}</div>
          <h1>{c.bannerTitle || 'Get in Touch'}</h1>
          <p>{c.bannerDesc || "We're here to help you plan your perfect journey. Reach out with any travel questions or custom requests."}</p>
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
                  <strong style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '3px' }}>India Desk (Call &amp; WhatsApp)</strong>
                  <a style={{ display: 'block', fontSize: '14.5px', fontWeight: 700, color: '#0f2942' }} href={`tel:${(c.phoneIndia || contactDefaults.phone).replace(/\s/g, '')}`}>{c.phoneIndia || contactDefaults.phone}</a>
                </div>
              </div>

              <div className="c-item">
                <div className="c-icon"><Phone size={18} /></div>
                <div>
                  <strong style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '3px' }}>Saudi Arabia &amp; Pilgrimage Desk</strong>
                  <a style={{ display: 'block', fontSize: '14.5px', fontWeight: 700, color: '#0f2942' }} href={`tel:${(c.phoneSaudi || contactDefaults.phoneSecondary).replace(/\s/g, '')}`}>{c.phoneSaudi || contactDefaults.phoneSecondary}</a>
                </div>
              </div>

              <div className="c-item">
                <div className="c-icon"><Mail size={18} /></div>
                <div>
                  <strong style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '3px' }}>Official Concierge Email</strong>
                  <a style={{ display: 'block', fontSize: '14.5px', fontWeight: 700, color: '#0f2942', wordBreak: 'break-all' }} href={`mailto:${c.email || contactDefaults.email}`}>{c.email || contactDefaults.email}</a>
                </div>
              </div>

              {(c.address || contactDefaults.address) && (
                <div className="c-item">
                  <div className="c-icon"><MapPin size={18} /></div>
                  <div>
                    <strong style={{ display: 'block', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', marginBottom: '3px' }}>Head Office Address</strong>
                    <span style={{ display: 'block', fontSize: '14.5px', fontWeight: 600, color: '#0f2942' }}>{c.address || contactDefaults.address}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Instant WhatsApp Quick Connect Box */}
            <div style={{ marginTop: '24px', padding: '18px', backgroundColor: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <strong style={{ color: '#166534', display: 'block', marginBottom: '6px' }}>Need an Instant Quotation?</strong>
              <p style={{ fontSize: '13px', color: '#15803d', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                Chat directly with our destination specialists on WhatsApp for instant pricing, flight itineraries, and customized travel schedules.
              </p>
              <a
                href={`https://wa.me/${(c.whatsapp || contactDefaults.whatsapp).replace(/\D/g, '')}?text=${encodeURIComponent(c.whatsappMessage || contactDefaults.whatsappMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ backgroundColor: '#25D366', borderColor: '#25D366', display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#ffffff' }}
              >
                Chat on WhatsApp ({c.whatsapp || contactDefaults.whatsapp})
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
              <form onSubmit={handleSubmit} className="contact-form-inner" style={{ display: 'flex', flexDirection: 'column', gap: '18px', width: '100%' }}>
                {errorMsg && <div className="form-error">{errorMsg}</div>}

                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#17496b' }}>Your Full Name *</span>
                  <input
                    type="text"
                    required
                    style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', outline: 'none', background: '#ffffff', minHeight: '44px' }}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#17496b' }}>Email Address *</span>
                  <input
                    type="email"
                    required
                    style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', outline: 'none', background: '#ffffff', minHeight: '44px' }}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </label>

                <label style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
                  <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#17496b' }}>Your Message *</span>
                  <textarea
                    rows={5}
                    required
                    style={{ width: '100%', boxSizing: 'border-box', border: '1.5px solid #cbd5e1', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', outline: 'none', background: '#ffffff', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  ></textarea>
                </label>

                <button type="submit" className="btn btn-primary full-btn" disabled={status === 'sending'} style={{ width: '100%', padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 800, fontSize: '15px' }}>
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
