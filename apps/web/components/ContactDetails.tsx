'use client';

import { useEffect, useState } from 'react';
import { Mail, MapPin, Phone, Clock3, MessageCircle } from 'lucide-react';
import { API_URL, contactDefaults } from '@/lib/config';

export type PublicSettings = {
  companyName?: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  hours?: string;
  mapUrl?: string;
  whatsappMessage?: string;
  googleReviewsUrl?: string;
};

export function usePublicSettings() {
  const [settings, setSettings] = useState<PublicSettings>(contactDefaults);

  useEffect(() => {
    fetch(`${API_URL}/settings/public`)
      .then((r) => (r.ok ? r.json() : {}))
      .then((data: any) => {
        if (data && (data.phone || data.email || data.whatsapp)) {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      })
      .catch(() => {});
  }, []);

  return settings;
}

export function ContactDetails() {
  const s = usePublicSettings();
  const phone = s.phone || contactDefaults.phone;
  const whatsapp = s.whatsapp || contactDefaults.whatsapp;
  const email = s.email || contactDefaults.email;
  const address = s.address || contactDefaults.address;
  const hours = s.hours || contactDefaults.hours;
  const mapUrl = s.mapUrl || contactDefaults.mapUrl;

  const rows = [
    { icon: Phone, label: 'India Desk', value: '+91 91763 57791', href: 'tel:+919176357791' },
    { icon: Phone, label: 'Saudi Arabia Desk', value: '+966 57 549 0602', href: 'tel:+966575490602' },
    {
      icon: MessageCircle,
      label: 'WhatsApp',
      value: '+91 91763 57791',
      href: 'https://wa.me/919176357791?text=Hello%20SkyRay%20Holidays!',
    },
    { icon: Mail, label: 'Official Email', value: email || 'syedrahamathullah@skyrayholidays.com', href: `mailto:${email || 'syedrahamathullah@skyrayholidays.com'}` },
    ...(address ? [{ icon: MapPin, label: 'Office', value: address, href: mapUrl }] : []),
    { icon: Clock3, label: 'Concierge hours', value: hours || '24/7 Dedicated Support', href: undefined },
  ];

  return (
    <div className="contact-list">
      {rows.map(({ icon: Icon, label, value, href }) => (
        <div key={label}>
          <Icon />
          <span>
            <b>{label}</b>
            {href ? (
              <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
                <small>{value}</small>
              </a>
            ) : (
              <small>{value}</small>
            )}
          </span>
        </div>
      ))}
    </div>
  );
}

export function WhatsAppFloat() {
  const s = usePublicSettings();
  const whatsapp = s.whatsapp || contactDefaults.whatsapp;
  if (!whatsapp) return null;

  const msg = encodeURIComponent(
    s.whatsappMessage || contactDefaults.whatsappMessage || 'Hello SkyRay Holidays! I would like to know more about your tour packages.',
  );

  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${msg}`}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle />
    </a>
  );
}
