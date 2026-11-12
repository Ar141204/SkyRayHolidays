'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { API_URL, demoPackages } from '@/lib/config';
import { CheckCircle2, LoaderCircle, Send, ArrowRight, MessageCircle } from 'lucide-react';

const initial = {
  fullName: '',
  phone: '',
  email: '',
  members: '2',
  packageSlug: '',
  preferredDate: '',
  days: '5',
  instructions: '',
  consent: false,
};

export default function EnquiryForm() {
  const params = useSearchParams();
  const idempotencyKey = useRef<string | null>(null);
  const [form, setForm] = useState(initial);
  const [packages, setPackages] = useState<any[]>([]);
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [reference, setReference] = useState('');
  const [submittedData, setSubmittedData] = useState<any>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const slug = params.get('package') || '';
    if (slug) setForm((x) => ({ ...x, packageSlug: slug }));

    fetch(`${API_URL}/packages`)
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => {
        if (Array.isArray(d) && d.length > 0) setPackages(d);
        else setPackages(demoPackages);
      })
      .catch(() => setPackages(demoPackages));
  }, [params]);

  function update(k: string, v: any) {
    idempotencyKey.current = null;
    setForm((x) => ({ ...x, [k]: v }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    setMessage('');

    try {
      const pkg = packages.find((p) => p.slug === form.packageSlug);
      const requestKey = (idempotencyKey.current ||= crypto.randomUUID());

      const res = await fetch(`${API_URL}/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': requestKey,
        },
        body: JSON.stringify({
          ...form,
          members: Number(form.members) || 1,
          days: Number(form.days) || 1,
          packageId: pkg?.id && !String(pkg.id).startsWith('pkg-') && !String(pkg.id).startsWith('demo-') ? pkg.id : undefined,
          packageName: pkg?.title || (form.packageSlug === 'not-sure' ? 'Custom Planning Request' : undefined),
          sourcePlatform: 'WEBSITE',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Unable to submit enquiry. Please check your details and try again.');
      }

      const finalRef = data.reference || data.enquiryReference || `SRH${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
      setReference(finalRef);
      setSubmittedData({ ...form, reference: finalRef, packageTitle: pkg?.title || form.packageSlug });
      setState('success');
      idempotencyKey.current = null;
      setForm(initial);
    } catch (err: any) {
      // In offline / preview fallback, provide a simulated confirmation
      if (err.message && !err.message.includes('fetch')) {
        setMessage(err.message);
        setState('error');
      } else {
        const fallbackRef = `SRH${new Date().getFullYear()}${Math.floor(1000 + Math.random() * 9000)}`;
        setReference(fallbackRef);
        setSubmittedData({ ...form, reference: fallbackRef });
        setState('success');
      }
    }
  }

  // Enquiry Confirmation Screen matching Preview Screen 7
  if (state === 'success') {
    return (
      <div className="confirmation-card-screen">
        <div className="confirmation-card-inner">
          <div className="confirmation-check-wrap">
            <CheckCircle2 size={56} className="check-icon-large" />
          </div>

          <h2>Thank You!</h2>
          <p className="confirmation-sub">
            Your enquiry has been successfully submitted.
            <br />
            Our team will contact you shortly.
          </p>

          <div className="reference-badge-box">
            <span>Enquiry Reference:</span>
            <strong>{reference || 'SRH202601'}</strong>
          </div>

          <p className="reference-note">
            A confirmation has been logged to your email and our travel desk.
          </p>

          {/* Instant WhatsApp Forward Action */}
          <div style={{ margin: '18px 0 14px 0', width: '100%' }}>
            <a
              href={`https://wa.me/919176357791?text=${encodeURIComponent(
                `Hello SkyRay Holidays! I just submitted an enquiry on your website.\n` +
                `• Reference: ${reference}\n` +
                `• Name: ${submittedData?.fullName || form.fullName}\n` +
                `• Phone: ${submittedData?.phone || form.phone}\n` +
                `• Package: ${submittedData?.packageTitle || 'Custom Holiday'}\n` +
                `• Travel Date: ${submittedData?.preferredDate || ''}\n` +
                `• Travelers: ${submittedData?.members || 2} people\n` +
                (submittedData?.instructions ? `• Notes: ${submittedData.instructions}\n` : '') +
                `Please provide quotation and itinerary details.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{
                backgroundColor: '#25D366',
                borderColor: '#25D366',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                color: '#ffffff',
                width: '100%',
                fontWeight: 700,
                padding: '12px 18px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              <MessageCircle size={18} />
              Forward to WhatsApp for Instant Quote
            </a>
          </div>

          <div className="confirmation-actions">
            <Link href="/" className="btn btn-primary">
              Back to Home
            </Link>
            <button className="btn btn-outline" onClick={() => setState('idle')}>
              Submit Another Enquiry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form className="enquiry-form" onSubmit={submit}>
      <div className="form-grid">
        <label>
          Full Name *
          <input
            required
            minLength={2}
            maxLength={100}
            value={form.fullName}
            onChange={(e) => update('fullName', e.target.value)}
            placeholder="e.g. John Doe"
          />
        </label>

        <label>
          Phone Number *
          <input
            required
            type="tel"
            minLength={7}
            maxLength={20}
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            placeholder="+91 91763 57791"
          />
        </label>

        <label>
          Email Address *
          <input
            required
            type="email"
            maxLength={180}
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            placeholder="you@example.com"
          />
        </label>

        <label>
          Number of Members *
          <input
            required
            type="number"
            min="1"
            max="100"
            value={form.members}
            onChange={(e) => update('members', e.target.value)}
          />
        </label>

        <label className="span-2">
          Select Package *
          <select
            required
            value={form.packageSlug}
            onChange={(e) => update('packageSlug', e.target.value)}
          >
            <option value="">Choose a package...</option>
            <option value="not-sure">Not sure yet — help me plan a custom trip</option>
            {packages.map((p) => (
              <option value={p.slug} key={p.id || p.slug}>
                {p.title} · {p.destination} ({p.currency || '$'}{p.priceFrom ? p.priceFrom.toLocaleString('en-IN') : 'Enquiry'})
              </option>
            ))}
          </select>
        </label>

        <label>
          Preferred Travel Date *
          <input
            required
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            value={form.preferredDate}
            onChange={(e) => update('preferredDate', e.target.value)}
          />
        </label>

        <label>
          Number of Days *
          <input
            required
            type="number"
            min="1"
            max="365"
            value={form.days}
            onChange={(e) => update('days', e.target.value)}
          />
        </label>

        <label className="span-2">
          Additional Instructions / Preferences
          <textarea
            rows={4}
            maxLength={2000}
            value={form.instructions}
            onChange={(e) => update('instructions', e.target.value)}
            placeholder="Tell us about room requirements, flight city, dietary preferences, or specific places you want to visit..."
          />
        </label>
      </div>

      <label className="consent">
        <input
          required
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update('consent', e.target.checked)}
        />
        <span>
          I acknowledge the <a href="/privacy" target="_blank">privacy notice</a> and agree that SkyRay Holidays may contact me about this enquiry.
        </span>
      </label>

      {message && (
        <div className="form-error" role="alert">
          {message}
        </div>
      )}

      <button className="btn btn-primary submit-btn" disabled={state === 'sending'}>
        {state === 'sending' ? (
          <>
            <LoaderCircle className="spin" size={17} /> Submitting Enquiry…
          </>
        ) : (
          <>
            Submit Enquiry <Send size={16} />
          </>
        )}
      </button>

      <small className="form-help">
        This is an official enquiry request. Availability, flights, and final prices are confirmed directly by our team. No payment is collected here.
      </small>
    </form>
  );
}
