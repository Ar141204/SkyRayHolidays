'use client';

import React, { useEffect, useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import {
  Plane,
  LayoutDashboard,
  Inbox,
  Package,
  Settings,
  LogOut,
  Search,
  Download,
  Plus,
  RefreshCw,
  Users,
  TrendingUp,
  FileText,
  Edit2,
  CheckCircle,
  X,
  Clock,
  Eye,
  SlidersHorizontal,
  Copy,
  Check,
  Trash2,
  Upload,
  Image as ImageIcon,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  MapPin,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Filter,
  Sparkles,
  ShieldAlert,
  Lock,
  Unlock,
  KeyRound,
} from 'lucide-react';
import { API_URL, contactDefaults } from '@/lib/config';

type Enquiry = {
  id: string;
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  packageNameSnapshot?: string;
  status: string;
  createdAt: string;
  preferredDate: string;
  members: number;
  days?: number;
  instructions?: string;
  sourcePlatform?: string;
  assignedAdmin?: { id: string; name: string } | null;
  notes?: { id: string; note: string; createdAt: string }[];
};

export default function AdminConsole() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('syedrahamathullah@skyrayholidays.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'Dashboard' | 'Enquiries' | 'Packages' | 'Content' | 'Settings'>('Dashboard');

  // Data states
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, new: 0, pending: 0, contacted: 0, quoted: 0, confirmed: 0 });
  const [staff, setStaff] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Lockout & Security states (5 wrong password lock)
  const [isLocked, setIsLocked] = useState(false);
  const [lockRemaining, setLockRemaining] = useState(0);
  const [unlockCodeInput, setUnlockCodeInput] = useState('');
  const [unlockStatus, setUnlockStatus] = useState('');
  const [unlockBusy, setUnlockBusy] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Filtering states
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPkgId, setCopiedPkgId] = useState<string | null>(null);

  // File upload input refs
  const packageFileInputRef = useRef<HTMLInputElement | null>(null);
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);

  function copyPackageQuote(pkg: any) {
    const inclusions = Array.isArray(pkg.inclusions)
      ? pkg.inclusions.join('\n• ')
      : pkg.inclusions || 'Hotel accommodation, private sightseeing, transfers';
    const text =
      `*${pkg.title}* - SkyRay Holidays\n` +
      `📍 Destination: ${pkg.destination || 'Custom'}\n` +
      `⏱ Duration: ${pkg.duration || '5 Days'}\n` +
      `💰 Quotation: ${pkg.priceFrom ? `${pkg.currency || '$'}${pkg.priceFrom} per person` : 'Custom Quote on Enquiry'}\n\n` +
      `*Key Inclusions:*\n• ${inclusions}\n\n` +
      `Itinerary details: https://skyrayholidays.com/packages/${pkg.slug}\n` +
      `Contact our travel specialists for custom dates, hotel upgrades & flight bookings!`;

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedPkgId(pkg.id);
      setTimeout(() => setCopiedPkgId(null), 2500);
    }
  }

  // Modals
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<any | null>(null);
  const [packageFormData, setPackageFormData] = useState({
    title: '',
    slug: '',
    destination: '',
    kind: 'TOUR',
    category: 'International',
    duration: '5 Days / 4 Nights',
    priceFrom: '499',
    currency: '$',
    status: 'PUBLISHED',
    featured: false,
    summary: '',
    description: '',
    image: '/images/destinations/dubai.jpg',
    inclusions: 'Flight Tickets, Hotel Stay, City Tour, Transfers',
    exclusions: 'Personal Expenses, Visa Fees',
  });

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedEnquiryForNote, setSelectedEnquiryForNote] = useState<Enquiry | null>(null);
  const [noteText, setNoteText] = useState('');

  // Enquiry Details Modal
  const [showEnquiryDetailsModal, setShowEnquiryDetailsModal] = useState(false);
  const [activeEnquiry, setActiveEnquiry] = useState<Enquiry | null>(null);

  // Content Management State
  const [contentTab, setContentTab] = useState<'Home' | 'About' | 'Contact' | 'Footer'>('Home');
  const [heroForm, setHeroForm] = useState({
    eyebrow: 'WHERE EVERY TRIP BECOMES A MEMORY',
    title: 'Your Journey Begins with SkyRay Holidays',
    subtitle: 'Discover unforgettable destinations, thoughtfully planned holidays.',
    heroImage: '/images/destinations/dubai.jpg',
  });

  // Settings form
  const [settingsForm, setSettingsForm] = useState({
    companyName: 'SkyRay Holidays',
    phone: contactDefaults.phone,
    phoneSecondary: contactDefaults.phoneSecondary || '+966 57 549 0602',
    whatsapp: contactDefaults.whatsapp,
    whatsappSecondary: contactDefaults.whatsappSecondary || '+966 57 549 0602',
    email: contactDefaults.email,
    address: contactDefaults.address || 'No 3/1, 2nd floor, Appavu street, Ellis road, Mount Road, Chennai - 600002',
    hours: contactDefaults.hours,
    mapUrl: contactDefaults.mapUrl,
    whatsappMessage: contactDefaults.whatsappMessage,
    googleReviewsUrl: '',
  });

  async function request(path: string, init: any = {}) {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(token && token !== 'cookie-session' ? { Authorization: `Bearer ${token}` } : {}),
        ...(init.headers || {}),
      },
    });
    const d = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(d.message || 'Request failed');
    return d;
  }

  // Load live data from Supabase backend
  async function loadData() {
    setBusy(true);
    try {
      // 1. Dashboard stats
      const s = await request('/admin/dashboard').catch(() => ({
        total: 0,
        new: 0,
        pending: 0,
        contacted: 0,
        quoted: 0,
        confirmed: 0,
      }));
      setStats({
        total: s.total ?? 0,
        new: s.new ?? 0,
        pending: s.pending ?? 0,
        contacted: s.contacted ?? 0,
        quoted: s.quoted ?? 0,
        confirmed: s.confirmed ?? 0,
      });

      // 2. Enquiries: Clean empty state if database has no enquiries (NO mock rows!)
      const e = await request('/admin/enquiries').catch(() => ({ items: [] }));
      const fetchedEnquiries = Array.isArray(e.items) ? e.items : Array.isArray(e) ? e : [];
      setEnquiries(fetchedEnquiries);

      // 3. Packages from Supabase
      const p = await request('/admin/packages').catch(() => []);
      if (Array.isArray(p) && p.length > 0) {
        setPackages(p);
      } else {
        // Fallback fetch from public packages endpoint
        const pub = await request('/packages').catch(() => []);
        if (Array.isArray(pub) && pub.length > 0) {
          setPackages(pub);
        }
      }

      // 4. Staff directory
      const st = await request('/admin/staff-directory').catch(() => []);
      setStaff(Array.isArray(st) ? st : []);

      // 5. Site Settings
      const setts = await request('/settings/public').catch(() => null);
      if (setts) {
        setSettingsForm((prev) => ({
          ...prev,
          companyName: setts.companyName || prev.companyName,
          phone: setts.phone || prev.phone,
          whatsapp: setts.whatsapp || prev.whatsapp,
          email: setts.email || prev.email,
          address: setts.address || prev.address,
          hours: setts.hours || prev.hours,
          mapUrl: setts.mapUrl || prev.mapUrl,
          whatsappMessage: setts.whatsappMessage || prev.whatsappMessage,
          googleReviewsUrl: setts.googleReviewsUrl || prev.googleReviewsUrl,
        }));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  // Auto sign-in with cookies & persistent session on mount
  useEffect(() => {
    const cachedToken = typeof window !== 'undefined' ? localStorage.getItem('skyray_admin_token') : null;
    const cachedUser = typeof window !== 'undefined' ? localStorage.getItem('skyray_admin_user') : null;

    if (cachedToken && cachedUser) {
      try {
        setToken(cachedToken);
        setUser(JSON.parse(cachedUser));
      } catch {}
    }

    // Verify session with server using HTTP-only cookie
    request('/auth/me', {
      headers: cachedToken ? { Authorization: `Bearer ${cachedToken}` } : {},
    })
      .then((u) => {
        setUser(u);
        setToken((prev) => prev || 'cookie-session');
        if (typeof window !== 'undefined') {
          localStorage.setItem('skyray_admin_user', JSON.stringify(u));
        }
      })
      .catch(() => {
        if (!cachedToken) {
          setToken('');
          setUser(null);
        }
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, []);

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  // Lockout Countdown Timer
  useEffect(() => {
    if (lockRemaining <= 0) return;
    const interval = setInterval(() => {
      setLockRemaining((prev) => {
        if (prev <= 1) {
          setIsLocked(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockRemaining]);

  // Login handler with persistent cookies & 5-attempt detection
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setUnlockStatus('');
    try {
      const d = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(d.accessToken);
      setUser(d.user);

      // Persist across browser restarts
      if (typeof window !== 'undefined') {
        localStorage.setItem('skyray_admin_token', d.accessToken);
        localStorage.setItem('skyray_admin_user', JSON.stringify(d.user));
      }

      setPassword('');
      setIsLocked(false);
      setLockRemaining(0);
    } catch (err: any) {
      if (err.message?.includes('locked') || err.message?.includes('Locked') || err.status === 423) {
        setIsLocked(true);
        setLockRemaining(15 * 60);
      }
      setError(err.message || 'Invalid credentials. Please verify your email and password.');
    }
  }

  // Emergency Unlock handler using 6-digit code
  async function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    setUnlockStatus('');
    setUnlockBusy(true);
    try {
      const d = await request('/auth/unlock', {
        method: 'POST',
        body: JSON.stringify({ email, code: unlockCodeInput.trim() }),
      });
      setIsLocked(false);
      setLockRemaining(0);
      setUnlockCodeInput('');
      setError('');
      setSavedMsg(d.message || 'Admin panel unlocked successfully! You may now sign in.');
      setTimeout(() => setSavedMsg(''), 5000);
    } catch (err: any) {
      setUnlockStatus(err.message || 'Invalid unlock code.');
    } finally {
      setUnlockBusy(false);
    }
  }

  // Resend Emergency Unlock Code
  async function handleResendUnlock() {
    setUnlockStatus('Sending new emergency code to email...');
    try {
      const d = await request('/auth/resend-unlock', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setUnlockStatus(d.message || 'New 6-digit emergency code sent to email.');
    } catch (err: any) {
      setUnlockStatus(err.message || 'Failed to resend code.');
    }
  }

  async function handleLogout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('skyray_admin_token');
      localStorage.removeItem('skyray_admin_user');
    }
    setToken('');
    setUser(null);
  }

  // Enquiry Status updater
  async function updateStatus(id: string, newStatus: string) {
    try {
      await request(`/admin/enquiries/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
      if (activeEnquiry?.id === id) {
        setActiveEnquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
      }
    } catch (err: any) {
      alert(`Could not update status: ${err.message}`);
    }
  }

  // Delete a single enquiry
  async function deleteEnquiry(id: string, reference?: string) {
    const promptMsg = reference
      ? `Are you sure you want to delete enquiry ${reference}? This will permanently remove it from Supabase.`
      : 'Are you sure you want to delete this enquiry?';
    if (!confirm(promptMsg)) return;

    try {
      await request(`/admin/enquiries/${id}`, { method: 'DELETE' });
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      setStats((prev: any) => ({ ...prev, total: Math.max(0, (prev.total || 1) - 1) }));
      if (activeEnquiry?.id === id) {
        setShowEnquiryDetailsModal(false);
        setActiveEnquiry(null);
      }
      setSavedMsg('Enquiry deleted successfully.');
      setTimeout(() => setSavedMsg(''), 3000);
    } catch (err: any) {
      alert(`Failed to delete enquiry: ${err.message}`);
    }
  }

  // Clear all enquiries
  async function clearAllEnquiries() {
    if (!confirm('Are you sure you want to remove ALL enquiries from the admin panel and Supabase database? This cannot be undone.')) {
      return;
    }
    try {
      await request('/admin/enquiries', { method: 'DELETE' });
      setEnquiries([]);
      setStats({ total: 0, new: 0, pending: 0, contacted: 0, quoted: 0, confirmed: 0 });
      setSavedMsg('All enquiries cleared successfully.');
      setTimeout(() => setSavedMsg(''), 3000);
    } catch (err: any) {
      alert(`Failed to clear enquiries: ${err.message}`);
    }
  }

  // Assign staff
  async function assignStaff(id: string, staffId: string) {
    try {
      await request(`/admin/enquiries/${id}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ assignedAdminId: staffId || null }),
      });
      const assignedUser = staff.find((s) => s.id === staffId);
      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, assignedAdmin: assignedUser ? { id: staffId, name: assignedUser.name } : null } : e,
        ),
      );
    } catch {}
  }

  // Save Note
  async function saveNote() {
    if (!selectedEnquiryForNote || !noteText.trim()) return;
    try {
      await request(`/admin/enquiries/${selectedEnquiryForNote.id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ note: noteText.trim() }),
      });
      setShowNoteModal(false);
      setNoteText('');
      setSelectedEnquiryForNote(null);
      loadData();
    } catch (err: any) {
      alert(`Failed to save note: ${err.message}`);
    }
  }

  // Device File Upload handler (Packages)
  async function handlePackageImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('File size exceeds 8MB limit. Please choose a smaller image.');
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setPackageFormData((prev) => ({ ...prev, image: data.url }));
          setSavedMsg('Image uploaded successfully from device!');
          setTimeout(() => setSavedMsg(''), 3000);
          return;
        }
      }

      // Fallback: Read as Base64 Data URL so upload never fails for the user
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        if (dataUrl) {
          setPackageFormData((prev) => ({ ...prev, image: dataUrl }));
          setSavedMsg('Image loaded from device!');
          setTimeout(() => setSavedMsg(''), 3000);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      // Local fallback
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        if (dataUrl) {
          setPackageFormData((prev) => ({ ...prev, image: dataUrl }));
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  }

  // Device File Upload handler (Hero Section)
  async function handleHeroImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          setHeroForm((prev) => ({ ...prev, heroImage: data.url }));
          setSavedMsg('Hero image uploaded successfully!');
          setTimeout(() => setSavedMsg(''), 3000);
          return;
        }
      }

      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        if (dataUrl) {
          setHeroForm((prev) => ({ ...prev, heroImage: dataUrl }));
          setSavedMsg('Hero image loaded from device!');
          setTimeout(() => setSavedMsg(''), 3000);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        if (dataUrl) setHeroForm((prev) => ({ ...prev, heroImage: dataUrl }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  }

  // Package Save (Add/Edit)
  async function savePackage(e: React.FormEvent) {
    e.preventDefault();
    try {
      const payload = {
        title: packageFormData.title.trim(),
        slug:
          packageFormData.slug.trim() ||
          packageFormData.title.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, ''),
        destination: packageFormData.destination.trim(),
        kind: packageFormData.kind,
        category: packageFormData.category,
        duration: packageFormData.duration.trim(),
        priceFrom: packageFormData.priceFrom === '' ? null : Number(packageFormData.priceFrom),
        currency: packageFormData.currency,
        status: packageFormData.status,
        featured: !!packageFormData.featured,
        summary: packageFormData.summary.trim(),
        description: packageFormData.description.trim(),
        image: packageFormData.image,
        inclusions: typeof packageFormData.inclusions === 'string'
          ? packageFormData.inclusions.split(',').map((s) => s.trim()).filter(Boolean)
          : packageFormData.inclusions,
        exclusions: typeof packageFormData.exclusions === 'string'
          ? packageFormData.exclusions.split(',').map((s) => s.trim()).filter(Boolean)
          : packageFormData.exclusions,
      };

      if (editingPackage) {
        const updated = await request(`/packages/${editingPackage.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setPackages((prev) => prev.map((p) => (p.id === editingPackage.id ? { ...p, ...payload, ...updated } : p)));
        setSavedMsg(`Package "${payload.title}" updated successfully!`);
      } else {
        const created = await request('/packages', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setPackages((prev) => [created, ...prev]);
        setSavedMsg(`Package "${payload.title}" created successfully!`);
      }

      setShowPackageModal(false);
      setEditingPackage(null);
      setError('');
      setTimeout(() => setSavedMsg(''), 4000);
    } catch (err: any) {
      alert(`Could not save package: ${err.message}`);
    }
  }

  // Delete Package
  async function deletePackage(id: string, title?: string) {
    if (!confirm(`Are you sure you want to delete package "${title || 'this package'}"? This will remove it from the catalog.`)) {
      return;
    }
    try {
      await request(`/packages/${id}`, { method: 'DELETE' });
      setPackages((prev) => prev.filter((p) => p.id !== id));
      setSavedMsg('Package deleted successfully.');
      setTimeout(() => setSavedMsg(''), 3000);
    } catch (err: any) {
      alert(`Failed to delete package: ${err.message}`);
    }
  }

  // Export CSV
  async function exportCsv() {
    try {
      const res = await fetch(`${API_URL}/admin/enquiries/export`, {
        credentials: 'include',
        headers: {
          ...(token && token !== 'cookie-session' ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SkyRay_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Unable to download export');
    }
  }

  // Filtered Enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchStatus = enquiryStatusFilter === 'ALL' || e.status === enquiryStatusFilter;
      const matchSearch =
        !searchQuery.trim() ||
        `${e.reference} ${e.fullName} ${e.email} ${e.phone} ${e.packageNameSnapshot || ''}`
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    });
  }, [enquiries, enquiryStatusFilter, searchQuery]);

  // Restoring persistent auto sign-in session
  if (checkingAuth && !token) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <Image
            src="/brand/skyray-logo.png"
            alt="SkyRay Holidays"
            width={140}
            height={65}
            style={{ objectFit: 'contain', margin: '0 auto 16px' }}
            priority
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
            <Loader2 size={16} className="spin" color="#0284c7" />
            <span>Restoring secure session...</span>
          </div>
        </div>
      </div>
    );
  }

  // SCREEN 1: Admin Login Page
  if (!token) {
    return (
      <div className="admin-login-layout">
        {/* Left Side: Form */}
        <div className="admin-login-left">
          <div className="admin-login-brand">
            <Image src="/brand/skyray-logo.png" alt="SkyRay Holidays" width={160} height={70} priority />
          </div>

          <div className="admin-login-card">
            {isLocked ? (
              <div className="login-locked-box" style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#fef2f2',
                    border: '2px solid #fecaca',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 16px',
                    color: '#dc2626',
                  }}
                >
                  <Lock size={32} />
                </div>
                <h2 style={{ color: '#991b1b', fontSize: '24px', margin: '0 0 8px 0' }}>Admin Panel Locked</h2>
                <p style={{ color: '#64748b', fontSize: '13px', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                  5 consecutive incorrect password attempts were detected. Access has been locked for security.
                </p>

                <div
                  style={{
                    backgroundColor: '#fff1f2',
                    border: '1px solid #ffe4e6',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    color: '#be123c',
                    fontSize: '13px',
                    fontWeight: 700,
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  <Clock size={15} />
                  <span>
                    Auto-unlocks in: {Math.floor(lockRemaining / 60)}:{(lockRemaining % 60).toString().padStart(2, '0')}
                  </span>
                </div>

                <div
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '18px',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: '#0f172a', fontWeight: 700, fontSize: '13px' }}>
                    <KeyRound size={16} color="#0284c7" />
                    <span>Owner Emergency Unlock</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 12px 0' }}>
                    A 6-digit emergency unlock code has been sent to your verified email:
                    <br />
                    <strong style={{ color: '#0f172a' }}>{email}</strong>
                  </p>

                  {unlockStatus && (
                    <div
                      style={{
                        padding: '8px 12px',
                        backgroundColor: unlockStatus.includes('unlocked') ? '#ecfdf5' : '#fef2f2',
                        color: unlockStatus.includes('unlocked') ? '#065f46' : '#991b1b',
                        borderRadius: '6px',
                        fontSize: '12px',
                        marginBottom: '10px',
                        fontWeight: 600,
                      }}
                    >
                      {unlockStatus}
                    </div>
                  )}

                  <form onSubmit={handleUnlock} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      value={unlockCodeInput}
                      onChange={(e) => setUnlockCodeInput(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="Enter 6-digit code (e.g. 481920)"
                      style={{
                        textAlign: 'center',
                        fontSize: '18px',
                        fontWeight: 800,
                        letterSpacing: '4px',
                        padding: '10px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                      }}
                    />

                    <button type="submit" className="btn btn-primary full-btn" disabled={unlockBusy}>
                      {unlockBusy ? 'Verifying...' : 'Unlock Panel'}
                    </button>
                  </form>

                  <div style={{ textAlign: 'center', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={handleResendUnlock}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0284c7',
                        fontSize: '12px',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                      }}
                    >
                      Resend code to email
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h2>Admin Login</h2>
                <p className="login-sub">Sign in to continue to SkyRay Management Portal</p>

                {error && <div className="form-error">{error}</div>}

                <form onSubmit={handleLogin} className="login-form-inner">
                  <label>
                    Email Address
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="syedrahamathullah@skyrayholidays.com"
                    />
                  </label>

                  <label>
                    Password
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                    />
                  </label>

                  <button type="submit" className="btn btn-primary full-btn">
                    Login
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        {/* Right Side: Destination Art */}
        <div className="admin-login-right">
          <div className="login-art-content">
            <span className="art-eyebrow">OPERATIONS &amp; CONTROL</span>
            <h3>Manage Your Travel Platform with Complete Ease</h3>
            <p>Enquiry workflows, live bookings, package publishing and content management in one centralized hub.</p>
          </div>
          <Image
            src="/images/destinations/dubai.jpg"
            alt="SkyRay Travel Operations"
            fill
            style={{ objectFit: 'cover', opacity: 0.85 }}
            priority
          />
        </div>
      </div>
    );
  }

  // Main Dashboard View
  return (
    <div className="admin-console-app">
      {/* Sidebar Navigation */}
      <aside className="admin-app-sidebar">
        <div className="sidebar-brand">
          <Image src="/brand/skyray-logo.png" alt="SkyRay Holidays" width={140} height={55} style={{ objectFit: 'contain' }} />
          <span>MANAGEMENT</span>
        </div>

        <nav className="sidebar-nav">
          <button className={tab === 'Dashboard' ? 'active' : ''} onClick={() => setTab('Dashboard')}>
            <LayoutDashboard size={17} /> Dashboard
          </button>
          <button className={tab === 'Enquiries' ? 'active' : ''} onClick={() => setTab('Enquiries')}>
            <Inbox size={17} /> Enquiries
          </button>
          <button className={tab === 'Packages' ? 'active' : ''} onClick={() => setTab('Packages')}>
            <Package size={17} /> Packages
          </button>
          <button className={tab === 'Content' ? 'active' : ''} onClick={() => setTab('Content')}>
            <FileText size={17} /> Website Content
          </button>
          <button className={tab === 'Settings' ? 'active' : ''} onClick={() => setTab('Settings')}>
            <Settings size={17} /> Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <div className="staff-info">
            <span className="staff-name">{user?.name || 'Syed Rahamathullah'}</span>
            <small>{user?.role || 'SUPER_ADMIN'}</small>
          </div>
          <button onClick={handleLogout} className="logout-btn" title="Sign out">
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="admin-app-main">
        {/* Top bar */}
        <header className="admin-main-header">
          <div>
            <span className="header-crumb">SKYRAY ADMIN / {tab.toUpperCase()}</span>
            <h1>{tab}</h1>
          </div>

          <div className="header-actions">
            <button className="icon-action-btn" onClick={loadData} title="Refresh data">
              <RefreshCw size={16} className={busy ? 'spin' : ''} />
            </button>
            <div className="live-status-pill">
              <span className="dot-green"></span> Live Supabase Connected
            </div>
          </div>
        </header>

        {error && <div className="form-error">{error}</div>}
        {savedMsg && (
          <div
            style={{
              padding: '12px 18px',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              borderRadius: '8px',
              color: '#065f46',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={16} color="#10b981" />
            {savedMsg}
          </div>
        )}

        {/* =========================================================================
            SCREEN 2: DASHBOARD VIEW
           ========================================================================= */}
        {tab === 'Dashboard' && (
          <div className="dashboard-content-screen">
            {/* 4 Top Metric Cards */}
            <div className="dashboard-stats-row">
              <div className="stat-card blue-card">
                <span className="s-label">Total Enquiries</span>
                <strong className="s-val">{stats.total ?? 0}</strong>
                <span className="s-growth">All-time customer requests</span>
              </div>

              <div className="stat-card sky-card">
                <span className="s-label">New</span>
                <strong className="s-val">{stats.new ?? 0}</strong>
                <span className="s-growth">Awaiting initial review</span>
              </div>

              <div className="stat-card orange-card">
                <span className="s-label">Pending</span>
                <strong className="s-val">{stats.pending ?? 0}</strong>
                <span className="s-growth">In progress follow-ups</span>
              </div>

              <div className="stat-card green-card">
                <span className="s-label">Contacted</span>
                <strong className="s-val">{stats.contacted ?? 0}</strong>
                <span className="s-growth">Customers reached</span>
              </div>
            </div>

            {/* Visual Overview & Distribution Charts */}
            <div className="dashboard-charts-grid">
              <div className="chart-panel">
                <div className="panel-header">
                  <h3>Enquiry Overview</h3>
                  <span className="badge-pill">Live Trends</span>
                </div>
                <div className="mock-chart-container">
                  <div className="mock-line-chart">
                    <div className="chart-bar" style={{ height: enquiries.length ? '45%' : '10%' }}><span>Mon</span></div>
                    <div className="chart-bar" style={{ height: enquiries.length ? '65%' : '15%' }}><span>Tue</span></div>
                    <div className="chart-bar" style={{ height: enquiries.length ? '55%' : '12%' }}><span>Wed</span></div>
                    <div className="chart-bar" style={{ height: enquiries.length ? '85%' : '18%' }}><span>Thu</span></div>
                    <div className="chart-bar" style={{ height: enquiries.length ? '70%' : '10%' }}><span>Fri</span></div>
                    <div className="chart-bar active" style={{ height: enquiries.length ? '95%' : '20%' }}><span>Sat</span></div>
                    <div className="chart-bar" style={{ height: enquiries.length ? '80%' : '14%' }}><span>Sun</span></div>
                  </div>
                </div>
              </div>

              <div className="chart-panel">
                <div className="panel-header">
                  <h3>Status Distribution</h3>
                  <span className="badge-pill">Breakdown</span>
                </div>
                <div className="donut-summary-wrap">
                  <div className="donut-graphic">
                    <div className="donut-center">
                      <strong>{stats.total ?? 0}</strong>
                      <small>Total</small>
                    </div>
                  </div>
                  <div className="donut-legend">
                    <div><span className="dot dot-blue"></span> Contacted: <strong>{stats.contacted ?? 0}</strong></div>
                    <div><span className="dot dot-sky"></span> Quoted: <strong>{stats.quoted ?? 0}</strong></div>
                    <div><span className="dot dot-orange"></span> Pending: <strong>{stats.pending ?? 0}</strong></div>
                    <div><span className="dot dot-green"></span> Confirmed: <strong>{stats.confirmed ?? 0}</strong></div>
                    <div><span className="dot dot-yellow"></span> New: <strong>{stats.new ?? 0}</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Enquiries Quick Table */}
            <div className="admin-card-panel">
              <div className="panel-header">
                <div>
                  <h3>Recent Customer Requests</h3>
                  <p>Latest inbound travel queries</p>
                </div>
                <button className="btn btn-outline small" onClick={() => setTab('Enquiries')}>
                  View All Enquiries →
                </button>
              </div>

              <div className="table-responsive">
                <table className="admin-clean-table">
                  <thead>
                    <tr>
                      <th>Ref</th>
                      <th>Customer Name</th>
                      <th>Package</th>
                      <th>Travel Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.slice(0, 5).map((row) => (
                      <tr key={row.id}>
                        <td><strong>{row.reference}</strong></td>
                        <td>{row.fullName}</td>
                        <td>{row.packageNameSnapshot || 'Custom Enquiry'}</td>
                        <td>{row.preferredDate ? row.preferredDate.slice(0, 10) : '—'}</td>
                        <td>
                          <span className={`status-pill pill-${row.status.toLowerCase()}`}>
                            {row.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-ghost small"
                            onClick={() => {
                              setActiveEnquiry(row);
                              setShowEnquiryDetailsModal(true);
                            }}
                          >
                            <Eye size={13} style={{ marginRight: 4 }} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {enquiries.length === 0 && (
                      <tr>
                        <td colSpan={6} style={{ textAlign: 'center', padding: '36px 18px', color: '#64748b' }}>
                          No enquiries received yet. Submissions from the website or mobile app will appear here.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 3: ENQUIRY MANAGEMENT
           ========================================================================= */}
        {tab === 'Enquiries' && (
          <div className="enquiries-management-screen">
            {/* Filter Tabs */}
            <div className="enquiry-filter-tabs">
              {['ALL', 'NEW', 'PENDING', 'CONTACTED', 'QUOTED', 'CONFIRMED'].map((st) => (
                <button
                  key={st}
                  className={`sub-tab-btn ${enquiryStatusFilter === st ? 'active' : ''}`}
                  onClick={() => setEnquiryStatusFilter(st)}
                >
                  {st.charAt(0) + st.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            {/* Search Bar & Actions */}
            <div className="table-toolbar">
              <div className="search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search enquiries by name, ref, email, phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {enquiries.length > 0 && (
                  <button
                    className="btn btn-outline small"
                    onClick={clearAllEnquiries}
                    style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                    title="Remove all test enquiries from database"
                  >
                    <Trash2 size={13} /> Clear All Test Enquiries
                  </button>
                )}
                <button className="btn btn-outline small" onClick={exportCsv}>
                  <Download size={14} /> Export CSV
                </button>
              </div>
            </div>

            {/* Enquiries Table */}
            <div className="admin-card-panel no-padding">
              <div className="table-responsive">
                <table className="admin-clean-table">
                  <thead>
                    <tr>
                      <th>Ref &amp; Date</th>
                      <th>Customer Name</th>
                      <th>Contact Details</th>
                      <th>Package</th>
                      <th>Travel Date</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEnquiries.map((enq) => (
                      <tr key={enq.id}>
                        <td>
                          <strong>{enq.reference}</strong>
                          <small>{new Date(enq.createdAt).toLocaleDateString()}</small>
                        </td>
                        <td>
                          <button
                            onClick={() => {
                              setActiveEnquiry(enq);
                              setShowEnquiryDetailsModal(true);
                            }}
                            style={{
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              color: '#0284c7',
                              fontWeight: 700,
                              cursor: 'pointer',
                              textAlign: 'left',
                              textDecoration: 'underline',
                            }}
                          >
                            {enq.fullName}
                          </button>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span>{enq.phone}</span>
                            <a
                              href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              title="Chat on WhatsApp"
                              style={{ color: '#16a34a' }}
                            >
                              <MessageSquare size={13} />
                            </a>
                          </div>
                          <small>{enq.email}</small>
                        </td>
                        <td>{enq.packageNameSnapshot || 'Custom Tour'}</td>
                        <td>{enq.preferredDate ? enq.preferredDate.slice(0, 10) : '—'}</td>
                        <td>
                          <select
                            className={`status-dropdown pill-${enq.status.toLowerCase()}`}
                            value={enq.status}
                            onChange={(e) => updateStatus(enq.id, e.target.value)}
                          >
                            {['NEW', 'PENDING', 'CONTACTED', 'QUOTED', 'CONFIRMED', 'CLOSED', 'NOT_INTERESTED'].map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            className="staff-select"
                            value={enq.assignedAdmin?.id || ''}
                            onChange={(e) => assignStaff(enq.id, e.target.value)}
                          >
                            <option value="">Unassigned</option>
                            {staff.map((s) => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button
                              className="action-icon-btn"
                              title="View Full Details"
                              onClick={() => {
                                setActiveEnquiry(enq);
                                setShowEnquiryDetailsModal(true);
                              }}
                            >
                              <Eye size={14} />
                            </button>
                            <button
                              className="action-icon-btn"
                              title="Add Note"
                              onClick={() => {
                                setSelectedEnquiryForNote(enq);
                                setShowNoteModal(true);
                              }}
                            >
                              <FileText size={14} />
                            </button>
                            <button
                              className="action-icon-btn"
                              title="Delete Enquiry"
                              onClick={() => deleteEnquiry(enq.id, enq.reference)}
                              style={{ color: '#dc2626' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredEnquiries.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '60px 24px' }}>
                          <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <Inbox size={46} color="#94a6b2" />
                            <h4 style={{ margin: 0, color: '#17496b', fontSize: '17px' }}>No enquiries found</h4>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '13px', maxWidth: '380px' }}>
                              Customer enquiries submitted through the website or mobile app will appear here automatically.
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="table-pagination">
                <span>Showing {filteredEnquiries.length} enquiries</span>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 4: PACKAGE MANAGEMENT
           ========================================================================= */}
        {tab === 'Packages' && (
          <div className="packages-management-screen">
            <div className="table-toolbar">
              <div>
                <h2>Tour Packages Catalogue</h2>
                <p>Manage destinations, pricing, inclusions, device image uploads, and publication status.</p>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingPackage(null);
                  setPackageFormData({
                    title: '',
                    slug: '',
                    destination: '',
                    kind: 'TOUR',
                    category: 'International',
                    duration: '5 Days / 4 Nights',
                    priceFrom: '499',
                    currency: '$',
                    status: 'PUBLISHED',
                    featured: false,
                    summary: '',
                    description: '',
                    image: '/images/destinations/dubai.jpg',
                    inclusions: 'Flight Tickets, Hotel Stay, City Tour, Transfers',
                    exclusions: 'Personal Expenses, Visa Fees',
                  });
                  setShowPackageModal(true);
                }}
              >
                <Plus size={16} /> Add Package
              </button>
            </div>

            <div className="admin-card-panel no-padding">
              <div className="table-responsive">
                <table className="admin-clean-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Image</th>
                      <th>Package Title</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Duration</th>
                      <th>Featured</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg) => (
                      <tr key={pkg.id}>
                        <td>
                          <div
                            style={{
                              width: '48px',
                              height: '34px',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              position: 'relative',
                              backgroundColor: '#e2e8f0',
                            }}
                          >
                            {pkg.image ? (
                              <Image
                                src={pkg.image}
                                alt={pkg.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                unoptimized={pkg.image.startsWith('data:') || pkg.image.startsWith('/uploads')}
                              />
                            ) : (
                              <div style={{ display: 'grid', placeItems: 'center', height: '100%' }}>
                                <ImageIcon size={14} color="#94a6b2" />
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <strong>{pkg.title}</strong>
                          <small>/{pkg.slug}</small>
                        </td>
                        <td>{pkg.category || pkg.kind}</td>
                        <td><strong>{pkg.priceFrom ? `${pkg.currency || '$'}${pkg.priceFrom}` : 'On Enquiry'}</strong></td>
                        <td>{pkg.duration || '5 Days'}</td>
                        <td>
                          {pkg.featured ? (
                            <span style={{ color: '#f59e0b', fontSize: '11px', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 3 }}>
                              <Sparkles size={12} /> Yes
                            </span>
                          ) : (
                            <span style={{ color: '#94a6b2', fontSize: '11px' }}>No</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`status-pill ${
                              pkg.status === 'PUBLISHED'
                                ? 'pill-confirmed'
                                : pkg.status === 'DRAFT'
                                ? 'pill-pending'
                                : 'pill-closed'
                            }`}
                          >
                            {pkg.status || 'PUBLISHED'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button
                              className="btn btn-outline small"
                              title="Copy formatted quotation for WhatsApp or Email"
                              onClick={() => copyPackageQuote(pkg)}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              {copiedPkgId === pkg.id ? (
                                <>
                                  <Check size={13} color="#10b981" />
                                  <span style={{ color: '#10b981' }}>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy size={13} />
                                  <span>Quote</span>
                                </>
                              )}
                            </button>
                            <button
                              className="btn btn-outline small"
                              onClick={() => {
                                setEditingPackage(pkg);
                                setPackageFormData({
                                  title: pkg.title || '',
                                  slug: pkg.slug || '',
                                  destination: pkg.destination || '',
                                  kind: pkg.kind || 'TOUR',
                                  category: pkg.category || 'International',
                                  duration: pkg.duration || '5 Days',
                                  priceFrom: pkg.priceFrom ? String(pkg.priceFrom) : '',
                                  currency: pkg.currency || '$',
                                  status: pkg.status || 'PUBLISHED',
                                  featured: !!pkg.featured,
                                  summary: pkg.summary || '',
                                  description: pkg.description || '',
                                  image: pkg.image || '/images/destinations/dubai.jpg',
                                  inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join(', ') : pkg.inclusions || '',
                                  exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions.join(', ') : pkg.exclusions || '',
                                });
                                setShowPackageModal(true);
                              }}
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                            <button
                              className="action-icon-btn"
                              title="Delete package"
                              onClick={() => deletePackage(pkg.id, pkg.title)}
                              style={{ color: '#dc2626' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 5: CONTENT MANAGEMENT
           ========================================================================= */}
        {tab === 'Content' && (
          <div className="content-management-screen">
            <div className="enquiry-filter-tabs">
              {(['Home', 'About', 'Contact', 'Footer'] as const).map((cTab) => (
                <button
                  key={cTab}
                  className={`sub-tab-btn ${contentTab === cTab ? 'active' : ''}`}
                  onClick={() => setContentTab(cTab)}
                >
                  {cTab}
                </button>
              ))}
            </div>

            {/* Hero Section Editor */}
            <div className="admin-card-panel">
              <div className="panel-header">
                <h3>Hero Section</h3>
                <p>Customize banner headlines, hero image, and primary call-to-actions.</p>
              </div>

              <div className="content-hero-preview-box">
                <div className="hero-img-col">
                  <div className="img-frame">
                    <Image
                      src={heroForm.heroImage || '/images/destinations/dubai.jpg'}
                      alt="Hero Banner Preview"
                      fill
                      style={{ objectFit: 'cover' }}
                      unoptimized={heroForm.heroImage?.startsWith('data:') || heroForm.heroImage?.startsWith('/uploads')}
                    />
                  </div>

                  {/* Hidden file input for Hero image */}
                  <input
                    type="file"
                    ref={heroFileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleHeroImageUpload}
                  />

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                    <button
                      type="button"
                      className="btn btn-primary small full-btn"
                      disabled={uploadingImage}
                      onClick={() => heroFileInputRef.current?.click()}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                    >
                      {uploadingImage ? <Loader2 size={14} className="spin" /> : <Upload size={14} />}
                      {uploadingImage ? 'Uploading...' : 'Upload Image from Device'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline small full-btn"
                      onClick={() => {
                        const url = prompt('Or enter image URL:', heroForm.heroImage);
                        if (url) setHeroForm({ ...heroForm, heroImage: url });
                      }}
                    >
                      Enter Image URL
                    </button>
                  </div>
                </div>

                <div className="hero-inputs-col">
                  <label>
                    Eyebrow Text
                    <input
                      type="text"
                      value={heroForm.eyebrow}
                      onChange={(e) => setHeroForm({ ...heroForm, eyebrow: e.target.value })}
                    />
                  </label>

                  <label>
                    Main Headline
                    <input
                      type="text"
                      value={heroForm.title}
                      onChange={(e) => setHeroForm({ ...heroForm, title: e.target.value })}
                    />
                  </label>

                  <label>
                    Subtitle Description
                    <textarea
                      rows={3}
                      value={heroForm.subtitle}
                      onChange={(e) => setHeroForm({ ...heroForm, subtitle: e.target.value })}
                    />
                  </label>

                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setSavedMsg('Hero Section changes saved successfully!');
                      setTimeout(() => setSavedMsg(''), 3000);
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SETTINGS VIEW: Full Business Contacts & Address Management
           ========================================================================= */}
        {tab === 'Settings' && (
          <div className="settings-management-screen">
            <div className="admin-card-panel">
              <div className="panel-header">
                <div>
                  <h3>Business Contacts &amp; Operations Settings</h3>
                  <p>
                    Manage official contact numbers, Saudi branch, WhatsApp channels, and office address. All changes
                    sync live to Supabase.
                  </p>
                </div>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await request('/settings', { method: 'PATCH', body: JSON.stringify(settingsForm) });
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('skyray_custom_settings', JSON.stringify(settingsForm));
                    }
                    setSavedMsg('Business settings updated and saved to Supabase successfully!');
                    setError('');
                    setTimeout(() => setSavedMsg(''), 4000);
                  } catch (err: any) {
                    alert(`Failed to save settings: ${err.message}`);
                  }
                }}
                className="settings-form-grid"
              >
                <label>
                  Company Name
                  <input
                    value={settingsForm.companyName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, companyName: e.target.value })}
                  />
                </label>

                <label>
                  Primary Phone Number (India Office)
                  <input
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    placeholder="+91 91763 57791"
                  />
                </label>

                <label>
                  Primary WhatsApp Number
                  <input
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                    placeholder="+91 91763 57791"
                  />
                </label>

                <label>
                  Secondary Phone (Saudi Arabia / Branch)
                  <input
                    value={settingsForm.phoneSecondary}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phoneSecondary: e.target.value })}
                    placeholder="+966 57 549 0602"
                  />
                </label>

                <label>
                  Business Support Email
                  <input
                    type="email"
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                    placeholder="syedrahamathullah@skyrayholidays.com"
                  />
                </label>

                <label>
                  Support &amp; Concierge Working Hours
                  <input
                    value={settingsForm.hours}
                    onChange={(e) => setSettingsForm({ ...settingsForm, hours: e.target.value })}
                    placeholder="24/7 Dedicated Concierge Support"
                  />
                </label>

                <label className="span-full">
                  Official Office Address (Chennai Headquarters)
                  <input
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    placeholder="No 3/1, 2nd floor, Appavu street, Ellis road, Mount Road, Chennai - 600002"
                  />
                </label>

                <label className="span-full">
                  WhatsApp Default Welcome Greeting
                  <input
                    value={settingsForm.whatsappMessage}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappMessage: e.target.value })}
                    placeholder="Hello SkyRay Holidays! I would like to know more about your tour packages."
                  />
                </label>

                <label className="span-full">
                  Google Maps Location / Embed URL
                  <input
                    value={settingsForm.mapUrl}
                    onChange={(e) => setSettingsForm({ ...settingsForm, mapUrl: e.target.value })}
                    placeholder="https://maps.google.com/..."
                  />
                </label>

                <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                  <button type="submit" className="btn btn-primary">
                    Save Business Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODALS
         ========================================================================= */}
      {/* 1. Add / Edit Package Modal with Device Image Upload & Full Content Editing */}
      {showPackageModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog wide" style={{ maxHeight: '92vh', overflowY: 'auto' }}>
            <div className="modal-header">
              <h3>{editingPackage ? `Edit Package: ${editingPackage.title}` : 'Add New Package'}</h3>
              <button className="modal-close" onClick={() => setShowPackageModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={savePackage}>
              <div className="modal-body">
                {/* Title and Destination */}
                <div className="form-row">
                  <label>
                    Package Title *
                    <input
                      required
                      value={packageFormData.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPackageFormData({
                          ...packageFormData,
                          title: val,
                          slug: editingPackage
                            ? packageFormData.slug
                            : val.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, ''),
                        });
                      }}
                      placeholder="e.g. Dubai Holiday Package"
                    />
                  </label>
                  <label>
                    Slug (URL identifier) *
                    <input
                      required
                      value={packageFormData.slug}
                      onChange={(e) => setPackageFormData({ ...packageFormData, slug: e.target.value })}
                      placeholder="dubai-holiday-package"
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    Destination *
                    <input
                      required
                      value={packageFormData.destination}
                      onChange={(e) => setPackageFormData({ ...packageFormData, destination: e.target.value })}
                      placeholder="e.g. Dubai, UAE"
                    />
                  </label>
                  <label>
                    Duration *
                    <input
                      required
                      value={packageFormData.duration}
                      onChange={(e) => setPackageFormData({ ...packageFormData, duration: e.target.value })}
                      placeholder="e.g. 5 Days / 4 Nights"
                    />
                  </label>
                </div>

                {/* Kind, Category, Pricing */}
                <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <label>
                    Package Type
                    <select
                      value={packageFormData.kind}
                      onChange={(e) => setPackageFormData({ ...packageFormData, kind: e.target.value })}
                    >
                      <option value="TOUR">TOUR (Holiday &amp; Leisure)</option>
                      <option value="HAJJ">HAJJ (Sacred Pilgrimage)</option>
                      <option value="UMRAH">UMRAH (Year-Round Pilgrimage)</option>
                    </select>
                  </label>

                  <label>
                    Category
                    <input
                      value={packageFormData.category}
                      onChange={(e) => setPackageFormData({ ...packageFormData, category: e.target.value })}
                      placeholder="International / Domestic / Luxury"
                    />
                  </label>

                  <label>
                    Publication Status
                    <select
                      value={packageFormData.status}
                      onChange={(e) => setPackageFormData({ ...packageFormData, status: e.target.value })}
                    >
                      <option value="PUBLISHED">PUBLISHED (Visible to Public)</option>
                      <option value="DRAFT">DRAFT (Staff Only)</option>
                      <option value="ARCHIVED">ARCHIVED</option>
                    </select>
                  </label>
                </div>

                <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr 1fr' }}>
                  <label>
                    Starting Price
                    <input
                      type="number"
                      value={packageFormData.priceFrom}
                      onChange={(e) => setPackageFormData({ ...packageFormData, priceFrom: e.target.value })}
                      placeholder="e.g. 499 (leave blank for Quote on Request)"
                    />
                  </label>

                  <label>
                    Currency
                    <select
                      value={packageFormData.currency}
                      onChange={(e) => setPackageFormData({ ...packageFormData, currency: e.target.value })}
                    >
                      <option value="₹">₹ INR (Indian Rupee)</option>
                      <option value="$">$ USD (US Dollar)</option>
                      <option value="SR">SR SAR (Saudi Riyal)</option>
                      <option value="€">€ EUR (Euro)</option>
                      <option value="AED">AED (Emirati Dirham)</option>
                    </select>
                  </label>

                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '18px' }}>
                      <input
                        type="checkbox"
                        checked={packageFormData.featured}
                        onChange={(e) => setPackageFormData({ ...packageFormData, featured: e.target.checked })}
                      />
                      <span>Featured on Homepage</span>
                    </label>
                  </div>
                </div>

                {/* DEVICE IMAGE UPLOAD SECTION */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Package Cover Image *
                  </label>

                  {/* Hidden native file input */}
                  <input
                    type="file"
                    ref={packageFileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handlePackageImageUpload}
                  />

                  <div
                    style={{
                      border: '2px dashed #cbd5e1',
                      borderRadius: '8px',
                      padding: '16px',
                      backgroundColor: '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                    }}
                  >
                    {/* Image Preview Box */}
                    <div
                      style={{
                        width: '120px',
                        height: '80px',
                        borderRadius: '6px',
                        overflow: 'hidden',
                        position: 'relative',
                        backgroundColor: '#e2e8f0',
                        flexShrink: 0,
                      }}
                    >
                      {packageFormData.image ? (
                        <Image
                          src={packageFormData.image}
                          alt="Cover Preview"
                          fill
                          style={{ objectFit: 'cover' }}
                          unoptimized={packageFormData.image.startsWith('data:') || packageFormData.image.startsWith('/uploads')}
                        />
                      ) : (
                        <div style={{ display: 'grid', placeItems: 'center', height: '100%', color: '#94a6b2' }}>
                          <ImageIcon size={24} />
                        </div>
                      )}
                    </div>

                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#334155', fontWeight: 600 }}>
                        Upload photo directly from your device (phone/computer)
                      </p>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="btn btn-primary small"
                          disabled={uploadingImage}
                          onClick={() => packageFileInputRef.current?.click()}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          {uploadingImage ? <Loader2 size={14} className="spin" /> : <Upload size={14} />}
                          {uploadingImage ? 'Uploading Image...' : 'Choose File from Device'}
                        </button>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Supports JPG, PNG, WEBP (Max 8MB)</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    <small style={{ color: '#64748b' }}>Or enter image URL manually:</small>
                    <input
                      style={{ marginTop: '4px' }}
                      value={packageFormData.image}
                      onChange={(e) => setPackageFormData({ ...packageFormData, image: e.target.value })}
                      placeholder="/images/destinations/dubai.jpg or https://..."
                    />
                  </div>
                </div>

                {/* Short Summary */}
                <label>
                  Short Summary (Card Preview) *
                  <textarea
                    rows={2}
                    required
                    value={packageFormData.summary}
                    onChange={(e) => setPackageFormData({ ...packageFormData, summary: e.target.value })}
                    placeholder="Short attractive summary for package list cards..."
                  />
                </label>

                {/* Full Description */}
                <label>
                  Full Package Description &amp; Highlights
                  <textarea
                    rows={4}
                    value={packageFormData.description}
                    onChange={(e) => setPackageFormData({ ...packageFormData, description: e.target.value })}
                    placeholder="Comprehensive description of the tour itinerary, experience, and destination highlights..."
                  />
                </label>

                {/* Inclusions */}
                <label>
                  Inclusions (comma-separated)
                  <input
                    value={packageFormData.inclusions}
                    onChange={(e) => setPackageFormData({ ...packageFormData, inclusions: e.target.value })}
                    placeholder="Flight Tickets, 4-Star Hotel Stay, Daily Breakfast, City Tour, Airport Transfers"
                  />
                </label>

                {/* Exclusions */}
                <label>
                  Exclusions (comma-separated)
                  <input
                    value={packageFormData.exclusions}
                    onChange={(e) => setPackageFormData({ ...packageFormData, exclusions: e.target.value })}
                    placeholder="Personal Expenses, Visa Fees, Travel Insurance"
                  />
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowPackageModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPackage ? 'Update Package' : 'Create Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Full Enquiry Details Modal */}
      {showEnquiryDetailsModal && activeEnquiry && (
        <div className="modal-backdrop">
          <div className="modal-dialog wide">
            <div className="modal-header">
              <div>
                <h3 style={{ margin: 0 }}>Enquiry Details</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Reference: <strong>{activeEnquiry.reference}</strong></span>
              </div>
              <button className="modal-close" onClick={() => setShowEnquiryDetailsModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>Customer Information</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                  <div><strong>Full Name:</strong> {activeEnquiry.fullName}</div>
                  <div>
                    <strong>Phone:</strong> {activeEnquiry.phone}{' '}
                    <a
                      href={`https://wa.me/${activeEnquiry.phone.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: '#16a34a', textDecoration: 'none', marginLeft: 8 }}
                    >
                      <MessageSquare size={13} style={{ verticalAlign: 'middle' }} /> WhatsApp
                    </a>
                    <a
                      href={`tel:${activeEnquiry.phone}`}
                      style={{ color: '#0284c7', textDecoration: 'none', marginLeft: 8 }}
                    >
                      <Phone size={13} style={{ verticalAlign: 'middle' }} /> Call
                    </a>
                  </div>
                  <div>
                    <strong>Email:</strong> {activeEnquiry.email}{' '}
                    <a
                      href={`mailto:${activeEnquiry.email}`}
                      style={{ color: '#0284c7', textDecoration: 'none', marginLeft: 8 }}
                    >
                      <Mail size={13} style={{ verticalAlign: 'middle' }} /> Send Mail
                    </a>
                  </div>
                  <div><strong>Platform:</strong> {activeEnquiry.sourcePlatform || 'Website'}</div>
                  <div><strong>Submitted:</strong> {new Date(activeEnquiry.createdAt).toLocaleString()}</div>
                </div>
              </div>

              <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>Travel Request Details</h4>
                <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                  <div><strong>Package:</strong> {activeEnquiry.packageNameSnapshot || 'Custom Enquiry'}</div>
                  <div><strong>Preferred Date:</strong> {activeEnquiry.preferredDate ? activeEnquiry.preferredDate.slice(0, 10) : '—'}</div>
                  <div><strong>Travelers / Members:</strong> {activeEnquiry.members || 1} people</div>
                  <div><strong>Duration:</strong> {activeEnquiry.days || 1} Days</div>
                  <div>
                    <strong>Status:</strong>{' '}
                    <select
                      className={`status-dropdown pill-${activeEnquiry.status.toLowerCase()}`}
                      value={activeEnquiry.status}
                      onChange={(e) => updateStatus(activeEnquiry.id, e.target.value)}
                    >
                      {['NEW', 'PENDING', 'CONTACTED', 'QUOTED', 'CONFIRMED', 'CLOSED', 'NOT_INTERESTED'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ gridColumn: 'span 2', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Special Instructions / Customer Notes</h4>
                <p style={{ margin: 0, fontSize: '13px', color: '#334155', whiteSpace: 'pre-wrap' }}>
                  {activeEnquiry.instructions || 'No special instructions provided by customer.'}
                </p>
              </div>
            </div>
            <div className="modal-footer" style={{ justifyContent: 'space-between' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{ color: '#dc2626', borderColor: '#fca5a5' }}
                onClick={() => deleteEnquiry(activeEnquiry.id, activeEnquiry.reference)}
              >
                <Trash2 size={14} style={{ marginRight: 6 }} /> Delete Enquiry
              </button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setSelectedEnquiryForNote(activeEnquiry);
                    setShowNoteModal(true);
                  }}
                >
                  <FileText size={14} style={{ marginRight: 6 }} /> Add Staff Note
                </button>
                <button type="button" className="btn btn-primary" onClick={() => setShowEnquiryDetailsModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Add Note Modal */}
      {showNoteModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog">
            <div className="modal-header">
              <h3>Internal Staff Note</h3>
              <button className="modal-close" onClick={() => setShowNoteModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <p>Adding operational note for enquiry <strong>{selectedEnquiryForNote?.reference}</strong> ({selectedEnquiryForNote?.fullName})</p>
              <textarea
                rows={4}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Enter private staff note (e.g. called customer on WhatsApp, quoted $1,200 for 4 people, waiting for visa copy)..."
              />
            </div>
            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowNoteModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={saveNote}>Save Note</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
