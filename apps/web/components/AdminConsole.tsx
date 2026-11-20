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
  Globe2,
  Menu,
  Play,
  Pause,
  Film,
  Award,
  ShieldCheck,
} from 'lucide-react';
import { API_URL, contactDefaults } from '@/lib/config';
import {
  VISA_SERVICES,
  getStoredVisaServices,
  saveStoredVisaServices,
  type VisaServiceItem,
} from '@/lib/visas';
import {
  ATTESTATION_SERVICES,
  getStoredAttestationServices,
  saveStoredAttestationServices,
  type AttestationServiceItem,
} from '@/lib/attestation';
import {
  DEFAULT_INSURANCE_SERVICES,
  getStoredInsuranceServices,
  saveStoredInsuranceServices,
  type InsurancePlanItem,
  type InsuranceCategory,
} from '@/lib/insurance';
import {
  type WebsiteContent,
  defaultWebsiteContent,
  getWebsiteContent,
  saveWebsiteContent,
} from '@/lib/content';

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
  const [tab, setTab] = useState<'Dashboard' | 'Enquiries' | 'Packages' | 'Visas' | 'Attestation' | 'Insurance' | 'Content' | 'Settings'>('Dashboard');

  // Data states
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [visas, setVisas] = useState<VisaServiceItem[]>([]);
  const [attestations, setAttestations] = useState<AttestationServiceItem[]>(() => getStoredAttestationServices());
  const [attestationSearchQuery, setAttestationSearchQuery] = useState('');
  const [showAttestationModal, setShowAttestationModal] = useState(false);
  const [editingAttestation, setEditingAttestation] = useState<AttestationServiceItem | null>(null);

  // Insurance States
  const [insurancePlans, setInsurancePlans] = useState<InsurancePlanItem[]>(() => getStoredInsuranceServices());
  const [insuranceSearchQuery, setInsuranceSearchQuery] = useState('');
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [editingInsurancePlan, setEditingInsurancePlan] = useState<InsurancePlanItem | null>(null);
  const [insuranceFormData, setInsuranceFormData] = useState<{
    id: string;
    slug: string;
    title: string;
    category: InsuranceCategory;
    badge: string;
    shortDesc: string;
    medicalCoverage: string;
    targetCountries: string;
    startingPrice: string;
    currency: string;
    status: 'PUBLISHED' | 'DRAFT';
    highlights: string;
    showPrice?: boolean;
  }>({
    id: '',
    slug: '',
    title: '',
    category: 'Europe',
    badge: '100% Embassy Approved',
    shortDesc: '',
    medicalCoverage: '€30,000 – €100,000',
    targetCountries: 'For all Countries',
    startingPrice: '₹750',
    currency: '₹',
    status: 'PUBLISHED',
    highlights: 'Emergency Medical & Hospitalization Cover\nRepatriation of Mortal Remains\nLoss of Checked-in Baggage',
    showPrice: false,
  });
  const [attestationFormData, setAttestationFormData] = useState<{
    id: string;
    slug: string;
    title: string;
    category: 'Gulf Embassy' | 'Apostille' | 'Educational' | 'Personal' | 'Commercial';
    badge: string;
    shortDesc: string;
    processingTime: string;
    validity: string;
    targetCountries: string;
    requirements: string;
    workflow: string;
    startingPrice: string;
    showPrice?: boolean;
    status: string;
    hasOffer?: boolean;
    offerBadge?: string;
    originalPrice?: string;
    offerPrice?: string;
    offerRunningText?: string;
  }>({
    id: '',
    slug: '',
    title: '',
    category: 'Gulf Embassy',
    badge: '',
    shortDesc: '',
    processingTime: '5 – 8 Working Days',
    validity: 'Permanent / Lifetime Authentication',
    targetCountries: 'United Arab Emirates (UAE)',
    requirements: 'Original Certificate\nPassport Copy (First & Last Page)\nAadhaar / National ID',
    workflow: '1. Notary Public Attestation\n2. State HRD / Home Department Authentication\n3. Ministry of External Affairs (MEA India)\n4. Embassy Legalization',
    startingPrice: '₹3,500',
    showPrice: false,
    status: 'Active',
    hasOffer: false,
    offerBadge: '',
    originalPrice: '',
    offerPrice: '',
    offerRunningText: '',
  });
  const [stats, setStats] = useState<any>({ total: 0, new: 0, pending: 0, contacted: 0, quoted: 0, confirmed: 0 });
  const [staff, setStaff] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVisaImage, setUploadingVisaImage] = useState(false);

  // Lockout & Security states (5 wrong password lock)
  const [isLocked, setIsLocked] = useState(false);
  const [lockRemaining, setLockRemaining] = useState(0);
  const [unlockCodeInput, setUnlockCodeInput] = useState('');
  const [unlockStatus, setUnlockStatus] = useState('');
  const [unlockBusy, setUnlockBusy] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(false);

  // Filtering states
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [visaSearchQuery, setVisaSearchQuery] = useState('');
  const [copiedPkgId, setCopiedPkgId] = useState<string | null>(null);

  // File upload input refs
  const packageFileInputRef = useRef<HTMLInputElement | null>(null);
  const packageMultiFileInputRef = useRef<HTMLInputElement | null>(null);
  const packageVideoFileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  const heroFileInputRef = useRef<HTMLInputElement | null>(null);
  const aboutFileInputRef = useRef<HTMLInputElement | null>(null);
  const visaFileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploadingAboutImage, setUploadingAboutImage] = useState(false);

  // Visa Package Modal State
  const [showVisaModal, setShowVisaModal] = useState(false);
  const [editingVisa, setEditingVisa] = useState<VisaServiceItem | null>(null);
  const [visaFormData, setVisaFormData] = useState<{
    id: string;
    slug: string;
    title: string;
    category: string;
    badge: string;
    shortDesc: string;
    processingTime: string;
    validity: string;
    entryType: string;
    defaultCountry: string;
    image: string;
    highlights: string;
    applicableCountries: string;
    status: string;
    hasOffer?: boolean;
    offerBadge?: string;
    originalPrice?: string;
    offerPrice?: string;
    offerRunningText?: string;
  }>({
    id: '',
    slug: '',
    title: '',
    category: 'Standard Embassy Visa',
    badge: 'Embassy Visitor Visa',
    shortDesc: '',
    processingTime: '15 working days',
    validity: 'Up to 10 Years',
    entryType: 'Multiple Entry',
    defaultCountry: '',
    image: '/images/destinations/us-visa.jpg',
    highlights: 'Document Pre-Screening & Verification\nAppointment Scheduling\nPersonal Guidance',
    applicableCountries: '',
    status: 'PUBLISHED',
    hasOffer: false,
    offerBadge: '',
    originalPrice: '',
    offerPrice: '',
    offerRunningText: '',
  });

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
  const [packageFormData, setPackageFormData] = useState<{
    title: string;
    slug: string;
    destination: string;
    kind: string;
    category: string;
    duration: string;
    priceFrom: string;
    currency: string;
    status: string;
    featured: boolean;
    summary: string;
    description: string;
    image: string;
    images: string[];
    videoUrl: string;
    mediaType: 'IMAGES' | 'VIDEO';
    inclusions: string;
    exclusions: string;
  }>({
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
    images: ['/images/destinations/dubai.jpg'],
    videoUrl: '',
    mediaType: 'IMAGES',
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
  const [websiteContent, setWebsiteContent] = useState<WebsiteContent>(defaultWebsiteContent);
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

      // 6. Visa Services
      const vList = await request('/visas').catch(() => null);
      if (Array.isArray(vList) && vList.length > 0) {
        setVisas(vList);
        saveStoredVisaServices(vList);
      } else {
        setVisas(getStoredVisaServices());
      }

      // 7. Dynamic Website Content
      const cData = await request('/content').catch(() => null);
      if (cData && cData.home) {
        setWebsiteContent(cData);
        saveWebsiteContent(cData);
        setHeroForm({
          eyebrow: cData.home.eyebrow,
          title: cData.home.title,
          subtitle: cData.home.subtitle,
          heroImage: cData.home.heroImage,
        });
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

    if (cachedToken) {
      setCheckingAuth(true);

      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
          setToken(cachedToken);
        } catch {}
      }

      // Fast safety timeout: never hang more than 1 second
      const safetyTimer = setTimeout(() => {
        setCheckingAuth(false);
      }, 1000);

      const controller = new AbortController();
      const abortTimer = setTimeout(() => controller.abort(), 1200);

      fetch(`${API_URL}/auth/me`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cachedToken}`,
        },
        signal: controller.signal,
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((u) => {
          clearTimeout(abortTimer);
          clearTimeout(safetyTimer);
          if (u && u.id) {
            setUser(u);
            setToken(cachedToken);
            if (typeof window !== 'undefined') {
              localStorage.setItem('skyray_admin_user', JSON.stringify(u));
            }
          } else {
            // Token is invalid/expired - clear stale storage
            setToken('');
            setUser(null);
            if (typeof window !== 'undefined') {
              localStorage.removeItem('skyray_admin_token');
              localStorage.removeItem('skyray_admin_user');
            }
          }
        })
        .catch(() => {
          // In case of network timeout, keep local session if user was valid
          if (!cachedUser) {
            setToken('');
            setUser(null);
          }
        })
        .finally(() => {
          clearTimeout(abortTimer);
          clearTimeout(safetyTimer);
          setCheckingAuth(false);
        });
    } else {
      setCheckingAuth(false);
      setToken('');
      setUser(null);
    }

    const loaded = getWebsiteContent();
    setWebsiteContent(loaded);
    setHeroForm({
      eyebrow: loaded.home.eyebrow,
      title: loaded.home.title,
      subtitle: loaded.home.subtitle,
      heroImage: loaded.home.heroImage,
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

  // Client-side image compression & Data URL generation
  // Guarantees zero broken images on Vercel serverless, Render, Mobile, and local dev
  async function compressImageToDataUrl(file: File, maxWidth = 1400, quality = 0.84): Promise<string> {
    return new Promise((resolve) => {
      if (!file.type.startsWith('image/') || file.type.includes('svg')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve((e.target?.result as string) || '');
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          let { width, height } = img;
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            return resolve(e.target?.result as string);
          }
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }

  // Device File Upload handler (Packages)
  async function handlePackageImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 12 * 1024 * 1024) {
      alert('File size exceeds 12MB limit. Please choose a smaller image.');
      return;
    }

    setUploadingImage(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      if (dataUrl) {
        setPackageFormData((prev) => ({
          ...prev,
          image: dataUrl,
          images: [dataUrl, ...(prev.images || []).filter((x) => x !== dataUrl)],
        }));
        setSavedMsg('Image loaded from device! Click "Save Package" to publish.');
        setTimeout(() => setSavedMsg(''), 4000);
      }
    } catch {
      alert('Could not read image file. Please try another image.');
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  }

  // Device Multiple Images Upload handler (Packages)
  async function handlePackageMultiImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    try {
      const newImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 12 * 1024 * 1024) continue;
        const dataUrl = await compressImageToDataUrl(file);
        if (dataUrl) newImages.push(dataUrl);
      }
      if (newImages.length > 0) {
        setPackageFormData((prev) => {
          const existing = prev.images && prev.images.length > 0 ? prev.images : (prev.image ? [prev.image] : []);
          const updated = [...existing, ...newImages];
          return {
            ...prev,
            images: updated,
            image: prev.image || updated[0],
            mediaType: 'IMAGES',
          };
        });
        setSavedMsg(`${newImages.length} photo(s) added! Click "Save Package" to publish.`);
        setTimeout(() => setSavedMsg(''), 4000);
      }
    } catch {
      alert('Could not read some image files. Please try again.');
    } finally {
      setUploadingImage(false);
      if (e.target) e.target.value = '';
    }
  }

  // Device Video Upload handler (Packages)
  async function handlePackageVideoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert('Video file size exceeds 50MB limit. For larger videos, please enter a direct video URL.');
      return;
    }

    setUploadingVideo(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        if (dataUrl) {
          setPackageFormData((prev) => ({
            ...prev,
            videoUrl: dataUrl,
            mediaType: 'VIDEO',
          }));
          setSavedMsg('Video loaded from device! Click "Save Package" to publish.');
          setTimeout(() => setSavedMsg(''), 4000);
        }
        setUploadingVideo(false);
      };
      reader.onerror = () => {
        alert('Could not read video file. Please try another video.');
        setUploadingVideo(false);
      };
      reader.readAsDataURL(file);
    } catch {
      alert('Could not read video file. Please try another video.');
      setUploadingVideo(false);
    } finally {
      if (e.target) e.target.value = '';
    }
  }

  // Device File Upload handler (Hero Section)
  async function handleHeroImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      if (dataUrl) {
        setWebsiteContent((prev) => ({
          ...prev,
          home: { ...prev.home, heroImage: dataUrl },
        }));
        setHeroForm((prev) => ({ ...prev, heroImage: dataUrl }));
        setSavedMsg('Hero image loaded! Click "Save Home Section" below to publish.');
        setTimeout(() => setSavedMsg(''), 4000);
      }
    } catch {
      alert('Could not read image file. Please try another image.');
    } finally {
      setUploadingImage(false);
    }
  }

  async function cleanBlackBackgroundToWhite(dataUrl: string): Promise<string> {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(dataUrl);
          ctx.drawImage(img, 0, 0);
          const imgData = ctx.getImageData(0, 0, img.width, img.height);
          const d = imgData.data;
          if (d[0] < 50 && d[1] < 50 && d[2] < 50) {
            for (let i = 0; i < d.length; i += 4) {
              if (d[i] < 45 && d[i + 1] < 45 && d[i + 2] < 45) {
                d[i] = 255;
                d[i + 1] = 255;
                d[i + 2] = 255;
              }
            }
            ctx.putImageData(imgData, 0, 0);
            return resolve(canvas.toDataURL('image/jpeg', 0.92));
          }
        } catch {
          // ignore error
        }
        resolve(dataUrl);
      };
      img.onerror = () => resolve(dataUrl);
      img.src = dataUrl;
    });
  }

  // Device File Upload handler (About Page Cover)
  async function handleAboutImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAboutImage(true);
    try {
      let dataUrl = await compressImageToDataUrl(file);
      if (dataUrl) {
        dataUrl = await cleanBlackBackgroundToWhite(dataUrl);
        setWebsiteContent((prev) => ({
          ...prev,
          about: { ...prev.about, image: dataUrl },
        }));
        setSavedMsg('About photo loaded with clean white background! Click "Save About Changes" below to publish.');
        setTimeout(() => setSavedMsg(''), 4000);
      }
    } catch {
      alert('Could not read image file. Please try another image.');
    } finally {
      setUploadingAboutImage(false);
    }
  }

  // Save Website Content Section Helper
  const handleSaveContentSection = async (section: 'Home' | 'About' | 'Contact' | 'Footer') => {
    saveWebsiteContent(websiteContent);
    try {
      await request('/content', {
        method: 'PATCH',
        body: JSON.stringify(websiteContent),
      });
    } catch (err: any) {
      console.warn('Could not sync content to server:', err);
    }

    if (section === 'Contact') {
      try {
        await request('/settings', {
          method: 'PATCH',
          body: JSON.stringify({
            phone: websiteContent.contact.phoneIndia,
            whatsapp: websiteContent.contact.whatsapp,
            email: websiteContent.contact.email,
            address: websiteContent.contact.address,
            hours: websiteContent.contact.hours,
            whatsappMessage: websiteContent.contact.whatsappMessage,
            googleReviewsUrl: websiteContent.contact.googleReviewsUrl,
          }),
        });
      } catch {}
    }
    setSavedMsg(`${section} section updated and live across website and mobile app!`);
    setTimeout(() => setSavedMsg(''), 4000);
  };

  // Package Save (Add/Edit)
  async function savePackage(e: React.FormEvent) {
    e.preventDefault();
    try {
      const primaryImage =
        (packageFormData.images && packageFormData.images[0]) ||
        packageFormData.image ||
        '/images/destinations/dubai.jpg';

      const imagesList =
        packageFormData.images && packageFormData.images.length > 0
          ? packageFormData.images
          : [primaryImage];

      const existingDetails =
        editingPackage?.details && typeof editingPackage.details === 'object'
          ? editingPackage.details
          : {};

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
        image: primaryImage,
        details: {
          ...existingDetails,
          images: imagesList,
          videoUrl: packageFormData.videoUrl || '',
          mediaType: packageFormData.mediaType || 'IMAGES',
        },
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

  // Visa Image Upload handler
  async function handleVisaImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 12 * 1024 * 1024) {
      alert('File size exceeds 12MB. Please choose a smaller photo.');
      return;
    }

    setUploadingVisaImage(true);
    try {
      const dataUrl = await compressImageToDataUrl(file);
      if (dataUrl) {
        setVisaFormData((prev) => ({ ...prev, image: dataUrl }));
        setSavedMsg('Visa photo loaded! Click "Save Visa Service" below to publish.');
        setTimeout(() => setSavedMsg(''), 4000);
      }
    } catch {
      alert('Could not read image file. Please try another image.');
    } finally {
      setUploadingVisaImage(false);
    }
  }

  // Visa Save (Add/Edit)
  function saveVisaService(e: React.FormEvent) {
    e.preventDefault();
    const highlightsArr = visaFormData.highlights
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);
    const countriesArr = visaFormData.applicableCountries
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const visaItem: VisaServiceItem = {
      id: visaFormData.id || `visa-${Date.now()}`,
      slug:
        visaFormData.slug.trim() ||
        visaFormData.title.toLowerCase().trim().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, ''),
      title: visaFormData.title.trim(),
      category: visaFormData.category,
      badge: visaFormData.badge.trim() || `${visaFormData.title} Service`,
      shortDesc: visaFormData.shortDesc.trim(),
      processingTime: visaFormData.processingTime.trim(),
      validity: visaFormData.validity.trim(),
      entryType: visaFormData.entryType.trim(),
      defaultCountry: visaFormData.defaultCountry.trim() || undefined,
      image: visaFormData.image || '/images/destinations/dubai.jpg',
      highlights:
        highlightsArr.length > 0
          ? highlightsArr
          : ['Document Pre-Screening & Verification', 'Official Application Filing Guidance'],
      applicableCountries: countriesArr.length > 0 ? countriesArr : undefined,
      status: visaFormData.status || 'PUBLISHED',
      hasOffer: visaFormData.hasOffer || false,
      offerBadge: visaFormData.offerBadge?.trim() || undefined,
      originalPrice: visaFormData.originalPrice?.trim() || undefined,
      offerPrice: visaFormData.offerPrice?.trim() || undefined,
      offerRunningText: visaFormData.offerRunningText?.trim() || undefined,
    };

    let updated: VisaServiceItem[];
    if (editingVisa) {
      updated = visas.map((v) => (v.id === editingVisa.id ? visaItem : v));
      setSavedMsg(`Visa package "${visaItem.title}" updated successfully!`);
    } else {
      updated = [visaItem, ...visas];
      setSavedMsg(`New visa package "${visaItem.title}" added to catalogue!`);
    }

    setVisas(updated);
    saveStoredVisaServices(updated);
    try {
      request('/visas', {
        method: 'PATCH',
        body: JSON.stringify(updated),
      }).catch((e) => console.warn('Could not sync visas to server:', e));
    } catch {}
    setShowVisaModal(false);
    setEditingVisa(null);
    setTimeout(() => setSavedMsg(''), 4000);
  }

  // Visa Delete
  function deleteVisaService(id: string, title: string) {
    if (!confirm(`Are you sure you want to remove the visa package "${title}"?`)) return;
    const updated = visas.filter((v) => v.id !== id);
    setVisas(updated);
    saveStoredVisaServices(updated);
    try {
      request('/visas', {
        method: 'PATCH',
        body: JSON.stringify(updated),
      }).catch((e) => console.warn('Could not sync visas deletion to server:', e));
    } catch {}
    setSavedMsg(`Visa package "${title}" deleted.`);
    setTimeout(() => setSavedMsg(''), 3000);
  }

  const filteredVisas = useMemo(() => {
    return visas.filter((v) => {
      if (!visaSearchQuery.trim()) return true;
      const q = visaSearchQuery.toLowerCase();
      return (
        v.title.toLowerCase().includes(q) ||
        v.slug.toLowerCase().includes(q) ||
        v.category.toLowerCase().includes(q) ||
        (v.defaultCountry && v.defaultCountry.toLowerCase().includes(q))
      );
    });
  }, [visas, visaSearchQuery]);

  // Attestation Save Handler
  function handleSaveAttestation(e: React.FormEvent) {
    e.preventDefault();
    if (!attestationFormData.title.trim()) {
      alert('Please enter a service title for the attestation package.');
      return;
    }

    const slug =
      attestationFormData.slug?.trim() ||
      attestationFormData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const targetCountriesArray = attestationFormData.targetCountries
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    const requirementsArray = attestationFormData.requirements
      .split('\n')
      .map((r) => r.trim())
      .filter(Boolean);

    const workflowArray = attestationFormData.workflow
      .split('\n')
      .map((w) => w.trim())
      .filter(Boolean);

    const attestationItem: AttestationServiceItem = {
      id: editingAttestation ? editingAttestation.id : `attest-${Date.now()}`,
      slug,
      title: attestationFormData.title.trim(),
      category: attestationFormData.category,
      badge: attestationFormData.badge.trim() || 'Verified Attestation',
      shortDesc: attestationFormData.shortDesc.trim(),
      processingTime: attestationFormData.processingTime.trim(),
      validity: attestationFormData.validity.trim(),
      targetCountries: targetCountriesArray.length > 0 ? targetCountriesArray : ['International'],
      requirements: requirementsArray.length > 0 ? requirementsArray : ['Original Certificate', 'Passport Copy'],
      workflow: workflowArray.length > 0 ? workflowArray : ['Notary', 'State HRD/Home', 'MEA', 'Embassy'],
      image: '/images/dubai.svg',
      startingPrice: attestationFormData.startingPrice.trim() || '₹2,500',
      showPrice: Boolean(attestationFormData.showPrice),
      status: attestationFormData.status,
      hasOffer: Boolean(attestationFormData.hasOffer),
      offerBadge: attestationFormData.offerBadge?.trim() || undefined,
      originalPrice: attestationFormData.originalPrice?.trim() || undefined,
      offerPrice: attestationFormData.offerPrice?.trim() || undefined,
      offerRunningText: attestationFormData.offerRunningText?.trim() || undefined,
    };

    let updated: AttestationServiceItem[];
    if (editingAttestation) {
      updated = attestations.map((a) => (a.id === editingAttestation.id ? attestationItem : a));
      setSavedMsg(`Attestation package "${attestationItem.title}" updated successfully!`);
    } else {
      updated = [attestationItem, ...attestations];
      setSavedMsg(`New attestation package "${attestationItem.title}" added to catalogue!`);
    }

    setAttestations(updated);
    saveStoredAttestationServices(updated);
    setShowAttestationModal(false);
    setEditingAttestation(null);
    setTimeout(() => setSavedMsg(''), 4000);
  }

  // Attestation Delete Handler
  function deleteAttestationService(id: string, title: string) {
    if (!confirm(`Are you sure you want to remove the attestation service "${title}"?`)) return;
    const updated = attestations.filter((a) => a.id !== id);
    setAttestations(updated);
    saveStoredAttestationServices(updated);
    setSavedMsg(`Attestation service "${title}" deleted.`);
    setTimeout(() => setSavedMsg(''), 3000);
  }

  // Quick toggle price display on website
  function toggleAttestationPrice(id: string) {
    const updated = attestations.map((a) => {
      if (a.id === id) {
        const nextState = !a.showPrice;
        setSavedMsg(`Price display for "${a.title}" is now ${nextState ? 'ENABLED on website' : 'HIDDEN on website (Enquiry Only)'}`);
        return { ...a, showPrice: nextState };
      }
      return a;
    });
    setAttestations(updated);
    saveStoredAttestationServices(updated);
    setTimeout(() => setSavedMsg(''), 4000);
  }

  const filteredAttestations = useMemo(() => {
    return attestations.filter((a) => {
      if (!attestationSearchQuery.trim()) return true;
      const q = attestationSearchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q) ||
        a.targetCountries.some((c) => c.toLowerCase().includes(q))
      );
    });
  }, [attestations, attestationSearchQuery]);

  const filteredInsurancePlans = useMemo(() => {
    return insurancePlans.filter((p) => {
      if (!insuranceSearchQuery.trim()) return true;
      const q = insuranceSearchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.targetCountries.toLowerCase().includes(q) ||
        p.medicalCoverage.toLowerCase().includes(q)
      );
    });
  }, [insurancePlans, insuranceSearchQuery]);

  // Quick toggle insurance price display on website
  function toggleInsurancePrice(id: string) {
    const updated = insurancePlans.map((p) => {
      if (p.id === id) {
        const nextState = !p.showPrice;
        setSavedMsg(`Price display for "${p.title}" is now ${nextState ? 'ENABLED on website' : 'HIDDEN on website (Quote on Request)'}`);
        return { ...p, showPrice: nextState };
      }
      return p;
    });
    setInsurancePlans(updated);
    saveStoredInsuranceServices(updated);
    setTimeout(() => setSavedMsg(''), 4000);
  }

  function saveInsurancePlan(e: React.FormEvent) {
    e.preventDefault();
    const highlightsArr = insuranceFormData.highlights
      ? insuranceFormData.highlights.split('\n').map((s) => s.trim()).filter(Boolean)
      : ['Emergency Medical & Hospitalization Cover', 'Emergency Evacuation & Repatriation'];

    const newPlan: InsurancePlanItem = {
      id: editingInsurancePlan ? editingInsurancePlan.id : `ins-${Date.now()}`,
      slug:
        insuranceFormData.slug.trim() ||
        insuranceFormData.title.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, ''),
      title: insuranceFormData.title.trim(),
      category: insuranceFormData.category,
      badge: insuranceFormData.badge.trim(),
      shortDesc: insuranceFormData.shortDesc.trim(),
      medicalCoverage: insuranceFormData.medicalCoverage.trim(),
      targetCountries: insuranceFormData.targetCountries.trim(),
      startingPrice: insuranceFormData.startingPrice.trim(),
      currency: insuranceFormData.currency || '₹',
      status: insuranceFormData.status,
      showPrice: Boolean(insuranceFormData.showPrice),
      coverageHighlights: highlightsArr,
      popular: editingInsurancePlan ? !!editingInsurancePlan.popular : false,
    };

    let updatedList: InsurancePlanItem[];
    if (editingInsurancePlan) {
      updatedList = insurancePlans.map((p) => (p.id === editingInsurancePlan.id ? newPlan : p));
      setSavedMsg(`Insurance plan "${newPlan.title}" updated successfully!`);
    } else {
      updatedList = [...insurancePlans, newPlan];
      setSavedMsg(`Insurance plan "${newPlan.title}" created successfully!`);
    }

    setInsurancePlans(updatedList);
    saveStoredInsuranceServices(updatedList);
    setShowInsuranceModal(false);
    setEditingInsurancePlan(null);
    setTimeout(() => setSavedMsg(''), 4000);
  }

  function deleteInsurancePlan(id: string, title?: string) {
    if (!confirm(`Are you sure you want to remove insurance plan "${title || 'this plan'}"?`)) return;
    const updated = insurancePlans.filter((p) => p.id !== id);
    setInsurancePlans(updated);
    saveStoredInsuranceServices(updated);
    setSavedMsg('Insurance plan removed.');
    setTimeout(() => setSavedMsg(''), 4000);
  }

  // Restoring persistent auto sign-in session
  if (checkingAuth && !token) {
    return (
      <div style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        <div style={{ textAlign: 'center', padding: '24px' }}>
          <Image
            src="/brand/skyray-logo.png"
            alt="SkyRay Holidays"
            width={140}
            height={65}
            style={{ objectFit: 'contain', margin: '0 auto 16px' }}
            priority
          />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: '#64748b', fontSize: '13px', fontWeight: 600, marginBottom: '16px' }}>
            <Loader2 size={16} className="spin" color="#0284c7" />
            <span>Restoring secure session...</span>
          </div>
          <button
            type="button"
            className="btn btn-outline small"
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('skyray_admin_token');
                localStorage.removeItem('skyray_admin_user');
              }
              setCheckingAuth(false);
              setToken('');
              setUser(null);
            }}
            style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '6px', color: '#0284c7', borderColor: '#cbd5e1' }}
          >
            Go to Admin Sign In →
          </button>
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
            alt="SkyRay Holidays Operations"
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
      {/* Mobile Top Header */}
      <header className="admin-mobile-header">
        <div className="admin-mobile-brand">
          <Image
            src="/brand/skyray-logo.png"
            alt="SkyRay Holidays"
            width={120}
            height={48}
            style={{ width: 'auto', height: '34px', objectFit: 'contain' }}
            priority
          />
          <span className="live-status-pill">
            <span className="dot-green"></span> Live
          </span>
        </div>
        <button
          type="button"
          className="admin-mobile-toggle-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          <span>{isMobileMenuOpen ? 'Close' : 'Menu'}</span>
        </button>
      </header>

      {/* Mobile Backdrop */}
      <div
        className={`admin-mobile-backdrop ${isMobileMenuOpen ? 'mobile-open' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Sidebar Navigation */}
      <aside className={`admin-app-sidebar ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-brand">
          <Image
            src="/brand/skyray-logo.png"
            alt="SkyRay Holidays"
            width={210}
            height={88}
            style={{ width: '100%', maxWidth: '210px', height: 'auto', maxHeight: '88px', objectFit: 'contain', background: 'transparent' }}
            priority
          />
          <span className="sidebar-badge">MANAGEMENT PORTAL</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={tab === 'Dashboard' ? 'active' : ''}
            onClick={() => {
              setTab('Dashboard');
              setIsMobileMenuOpen(false);
            }}
          >
            <LayoutDashboard size={17} /> Dashboard
          </button>
          <button
            className={tab === 'Enquiries' ? 'active' : ''}
            onClick={() => {
              setTab('Enquiries');
              setIsMobileMenuOpen(false);
            }}
          >
            <Inbox size={17} /> Enquiries
          </button>
          <button
            className={tab === 'Packages' ? 'active' : ''}
            onClick={() => {
              setTab('Packages');
              setIsMobileMenuOpen(false);
            }}
          >
            <Package size={17} /> Packages
          </button>
          <button
            className={tab === 'Visas' ? 'active' : ''}
            onClick={() => {
              setTab('Visas');
              setIsMobileMenuOpen(false);
            }}
          >
            <Globe2 size={17} /> Visa Services
          </button>
          <button
            className={tab === 'Attestation' ? 'active' : ''}
            onClick={() => {
              setTab('Attestation');
              setIsMobileMenuOpen(false);
            }}
          >
            <Award size={17} /> Attestation Services
          </button>
          <button
            className={tab === 'Insurance' ? 'active' : ''}
            onClick={() => {
              setTab('Insurance');
              setIsMobileMenuOpen(false);
            }}
          >
            <ShieldCheck size={17} /> Travel Insurance
          </button>
          <button
            className={tab === 'Content' ? 'active' : ''}
            onClick={() => {
              setTab('Content');
              setIsMobileMenuOpen(false);
            }}
          >
            <FileText size={17} /> Website Content
          </button>
          <button
            className={tab === 'Settings' ? 'active' : ''}
            onClick={() => {
              setTab('Settings');
              setIsMobileMenuOpen(false);
            }}
          >
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
                        <td>
                          {enq.packageNameSnapshot?.toLowerCase().includes('insurance') ? (
                            <div>
                              <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#0369a1', background: '#e0f2fe', padding: '2px 6px', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '3px', marginBottom: '2px' }}>
                                <ShieldCheck size={11} /> Insurance
                              </span>
                              <div style={{ fontWeight: 600, fontSize: '12px' }}>{enq.packageNameSnapshot}</div>
                            </div>
                          ) : (
                            enq.packageNameSnapshot || 'Custom Tour'
                          )}
                        </td>
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
                    images: ['/images/destinations/dubai.jpg'],
                    videoUrl: '',
                    mediaType: 'IMAGES',
                    inclusions: 'Flight Tickets, Hotel Stay, City Tour, Transfers',
                    exclusions: 'Personal Expenses, Visa Fees',
                  });
                  setNewImageUrlInput('');
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
                                const pkgDetails = pkg.details && typeof pkg.details === 'object' ? pkg.details : {};
                                const existingImages = Array.isArray(pkgDetails.images) && pkgDetails.images.length > 0
                                  ? pkgDetails.images
                                  : pkg.image ? [pkg.image] : ['/images/destinations/dubai.jpg'];
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
                                  image: existingImages[0] || pkg.image || '/images/destinations/dubai.jpg',
                                  images: existingImages,
                                  videoUrl: pkgDetails.videoUrl || '',
                                  mediaType: pkgDetails.mediaType === 'VIDEO' ? 'VIDEO' : 'IMAGES',
                                  inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join(', ') : pkg.inclusions || '',
                                  exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions.join(', ') : pkg.exclusions || '',
                                });
                                setNewImageUrlInput('');
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
            SCREEN: VISA SERVICES & PACKAGES MANAGEMENT
           ========================================================================= */}
        {tab === 'Visas' && (
          <div className="visas-management-screen">
            <div className="table-toolbar">
              <div>
                <h2>International Visa Services Catalogue</h2>
                <p>Manage embassy visas, global fast-track e-visas, document checklists, and country coverage.</p>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingVisa(null);
                  setVisaFormData({
                    id: '',
                    slug: '',
                    title: '',
                    category: 'Standard Embassy Visa',
                    badge: 'Embassy Visitor Visa',
                    shortDesc: '',
                    processingTime: '15 working days standard',
                    validity: 'Up to 10 Years (Multiple Entry)',
                    entryType: 'Multiple Entry',
                    defaultCountry: '',
                    image: '/images/destinations/us-visa.jpg',
                    highlights: 'Document Pre-Screening & Verification\nOfficial Application Filing Guidance\nAppointment Scheduling Assistance',
                    applicableCountries: '',
                    status: 'PUBLISHED',
                    hasOffer: false,
                    offerBadge: '',
                    originalPrice: '',
                    offerPrice: '',
                    offerRunningText: '',
                  });
                  setShowVisaModal(true);
                }}
              >
                <Plus size={16} /> Add Visa Package
              </button>
            </div>

            {/* Visa Search Toolbar */}
            <div className="table-toolbar" style={{ marginTop: '2px', marginBottom: '14px' }}>
              <div className="search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search visas by country, title, category..."
                  value={visaSearchQuery}
                  onChange={(e) => setVisaSearchQuery(e.target.value)}
                />
              </div>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                Showing {filteredVisas.length} visa packages
              </span>
            </div>

            <div className="admin-card-panel no-padding">
              <div className="table-responsive">
                <table className="admin-clean-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>Image</th>
                      <th>Visa Service</th>
                      <th>Category</th>
                      <th>Processing Time</th>
                      <th>Validity</th>
                      <th>Entry Type</th>
                      <th>Countries</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredVisas.map((v) => (
                      <tr key={v.id}>
                        <td>
                          <div
                            style={{
                              width: '48px',
                              height: '34px',
                              borderRadius: '6px',
                              overflow: 'hidden',
                              position: 'relative',
                              backgroundColor: '#0f172a',
                            }}
                          >
                            <Image
                              src={v.image || '/images/destinations/dubai.jpg'}
                              alt={v.title}
                              fill
                              style={{ objectFit: 'cover' }}
                              unoptimized={v.image?.startsWith('data:') || v.image?.startsWith('/uploads')}
                            />
                          </div>
                        </td>
                        <td>
                          <strong>{v.title}</strong>
                          <small style={{ display: 'block', color: '#64748b' }}>/{v.slug}</small>
                        </td>
                        <td>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f2942' }}>
                            {v.category}
                          </span>
                        </td>
                        <td>{v.processingTime}</td>
                        <td>{v.validity}</td>
                        <td>{v.entryType}</td>
                        <td>
                          {v.applicableCountries && v.applicableCountries.length > 0 ? (
                            <span style={{ color: '#0284c7', fontSize: '11px', fontWeight: 700 }}>
                              {v.applicableCountries.length} Nations
                            </span>
                          ) : (
                            <span>{v.defaultCountry || 'Single Country'}</span>
                          )}
                        </td>
                        <td>
                          <span
                            className={`status-pill ${
                              v.status === 'PUBLISHED' || !v.status
                                ? 'pill-confirmed'
                                : 'pill-pending'
                            }`}
                          >
                            {v.status || 'PUBLISHED'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button
                              className="btn btn-outline small"
                              title="Edit Visa Package"
                              onClick={() => {
                                setEditingVisa(v);
                                setVisaFormData({
                                  id: v.id,
                                  slug: v.slug,
                                  title: v.title,
                                  category: v.category,
                                  badge: v.badge || '',
                                  shortDesc: v.shortDesc || '',
                                  processingTime: v.processingTime || '',
                                  validity: v.validity || '',
                                  entryType: v.entryType || 'Multiple Entry',
                                  defaultCountry: v.defaultCountry || '',
                                  image: v.image || '/images/destinations/dubai.jpg',
                                  highlights: Array.isArray(v.highlights) ? v.highlights.join('\n') : '',
                                  applicableCountries: Array.isArray(v.applicableCountries) ? v.applicableCountries.join(', ') : '',
                                  status: v.status || 'PUBLISHED',
                                  hasOffer: v.hasOffer ?? false,
                                  offerBadge: v.offerBadge || '',
                                  originalPrice: v.originalPrice || '',
                                  offerPrice: v.offerPrice || '',
                                  offerRunningText: v.offerRunningText || '',
                                });
                                setShowVisaModal(true);
                              }}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                            <button
                              className="action-icon-btn"
                              title="Delete Visa Package"
                              onClick={() => deleteVisaService(v.id, v.title)}
                              style={{ color: '#dc2626' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredVisas.length === 0 && (
                      <tr>
                        <td colSpan={9} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                          No visa services found matching your search.
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
            SCREEN: ATTESTATION SERVICES MANAGEMENT
           ========================================================================= */}
        {tab === 'Attestation' && (
          <div className="visas-management-screen">
            <div className="table-toolbar">
              <div>
                <h2>Certificate Attestation &amp; Apostille Catalogue</h2>
                <p>Manage Gulf embassy legalizations (UAE, Saudi, Qatar, Kuwait), MEA Hague Apostille, turnaround times, and pricing.</p>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingAttestation(null);
                  setAttestationFormData({
                    id: '',
                    slug: '',
                    title: '',
                    category: 'Gulf Embassy',
                    badge: 'Verified Attestation',
                    shortDesc: '',
                    processingTime: '5 – 8 Working Days',
                    validity: 'Permanent / Lifetime Authentication',
                    targetCountries: 'United Arab Emirates (UAE)',
                    requirements: 'Original Certificate\nPassport Copy (First & Last Page)\nAadhaar / National ID',
                    workflow: '1. Notary Public Attestation\n2. State HRD / Home Department Authentication\n3. Ministry of External Affairs (MEA India)\n4. Embassy Legalization',
                    startingPrice: '₹3,500',
                    showPrice: false,
                    status: 'Active',
                    hasOffer: false,
                    offerBadge: '',
                    originalPrice: '',
                    offerPrice: '',
                    offerRunningText: '',
                  });
                  setShowAttestationModal(true);
                }}
              >
                <Plus size={16} /> Add Attestation Service
              </button>
            </div>

            {/* Search Toolbar */}
            <div className="table-toolbar" style={{ marginTop: '2px', marginBottom: '14px' }}>
              <div className="search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search attestation by country, certificate, category..."
                  value={attestationSearchQuery}
                  onChange={(e) => setAttestationSearchQuery(e.target.value)}
                />
              </div>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                Showing {filteredAttestations.length} attestation services
              </span>
            </div>

            <div className="admin-card-panel no-padding">
              <div className="table-responsive">
                <table className="admin-clean-table">
                  <thead>
                    <tr>
                      <th>Service Title</th>
                      <th>Category</th>
                      <th>Turnaround Time</th>
                      <th>Target Countries</th>
                      <th>Starting Fee</th>
                      <th>Offer</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttestations.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <div>
                            <strong style={{ color: '#17496b', display: 'block', fontSize: '13.5px' }}>{a.title}</strong>
                            <small style={{ color: '#64748b' }}>{a.badge}</small>
                          </div>
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: '#e0f2fe',
                              color: '#0369a1',
                              fontWeight: 700,
                            }}
                          >
                            {a.category}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '12px', color: '#334155' }}>
                            <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                            {a.processingTime}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '12px', color: '#334155', maxWidth: '180px' }}>
                            {a.targetCountries.slice(0, 2).join(', ')}
                            {a.targetCountries.length > 2 && ` +${a.targetCountries.length - 2} more`}
                          </div>
                        </td>
                        <td>
                          <div>
                            <strong style={{ color: '#17496b', fontSize: '13.5px' }}>
                              {a.offerPrice || a.startingPrice || '₹2,500'}
                            </strong>
                            {a.hasOffer && a.originalPrice && (
                              <span style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '4px' }}>
                                {a.originalPrice}
                              </span>
                            )}
                            <div style={{ marginTop: '4px' }}>
                              {a.showPrice ? (
                                <span
                                  style={{
                                    fontSize: '10px',
                                    background: '#dcfce7',
                                    color: '#15803d',
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 700,
                                    display: 'inline-block',
                                  }}
                                >
                                  👁️ Visible on Site
                                </span>
                              ) : (
                                <span
                                  style={{
                                    fontSize: '10px',
                                    background: '#f1f5f9',
                                    color: '#64748b',
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 700,
                                    display: 'inline-block',
                                  }}
                                >
                                  🙈 Hidden (Enquiry Only)
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleAttestationPrice(a.id)}
                              style={{
                                fontSize: '10.5px',
                                padding: '2px 8px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '4px',
                                background: '#ffffff',
                                color: a.showPrice ? '#b91c1c' : '#0284c7',
                                fontWeight: 700,
                                cursor: 'pointer',
                                marginTop: '4px',
                                display: 'inline-block',
                              }}
                              title={a.showPrice ? 'Click to hide price on website' : 'Click to show price on website'}
                            >
                              {a.showPrice ? 'Hide Price' : 'Turn On Price'}
                            </button>
                          </div>
                        </td>
                        <td>
                          {a.hasOffer ? (
                            <span
                              style={{
                                fontSize: '10.5px',
                                background: '#fef3c7',
                                color: '#b45309',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontWeight: 700,
                              }}
                            >
                              {a.offerBadge || 'Active Offer'}
                            </span>
                          ) : (
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>Standard</span>
                          )}
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: a.status === 'Active' ? '#dcfce7' : '#f1f5f9',
                              color: a.status === 'Active' ? '#15803d' : '#64748b',
                              fontWeight: 700,
                            }}
                          >
                            {a.status || 'Active'}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              className="btn-icon"
                              title="Edit Attestation Service"
                              onClick={() => {
                                setEditingAttestation(a);
                                setAttestationFormData({
                                  id: a.id,
                                  slug: a.slug,
                                  title: a.title,
                                  category: a.category,
                                  badge: a.badge,
                                  shortDesc: a.shortDesc,
                                  processingTime: a.processingTime,
                                  validity: a.validity,
                                  targetCountries: a.targetCountries.join('\n'),
                                  requirements: a.requirements.join('\n'),
                                  workflow: a.workflow.join('\n'),
                                  startingPrice: a.startingPrice || '₹2,500',
                                  showPrice: Boolean(a.showPrice),
                                  status: a.status || 'Active',
                                  hasOffer: Boolean(a.hasOffer),
                                  offerBadge: a.offerBadge || '',
                                  originalPrice: a.originalPrice || '',
                                  offerPrice: a.offerPrice || '',
                                  offerRunningText: a.offerRunningText || '',
                                });
                                setShowAttestationModal(true);
                              }}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              className="btn-icon danger"
                              title="Delete Attestation Service"
                              onClick={() => deleteAttestationService(a.id, a.title)}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredAttestations.length === 0 && (
                      <tr>
                        <td colSpan={8} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                          No attestation services found matching your search.
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
            SCREEN: TRAVEL INSURANCE SERVICES & CATEGORIES MANAGEMENT
           ========================================================================= */}
        {tab === 'Insurance' && (
          <div className="insurance-management-screen">
            <div className="table-toolbar">
              <div>
                <h2>International Travel Insurance Plans</h2>
                <p>Manage coverage categories (Europe, Rest of World, US, UK), medical limits, and policy pricing for all countries.</p>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => {
                  setEditingInsurancePlan(null);
                  setInsuranceFormData({
                    id: '',
                    slug: '',
                    title: '',
                    category: 'Europe',
                    badge: '100% Embassy Approved',
                    shortDesc: '',
                    medicalCoverage: '€30,000 – €100,000',
                    targetCountries: 'For all Countries',
                    startingPrice: '₹750',
                    currency: '₹',
                    status: 'PUBLISHED',
                    highlights: 'Emergency Medical & Hospitalization Cover\nRepatriation of Mortal Remains\nLoss of Checked-in Baggage',
                    showPrice: false,
                  });
                  setShowInsuranceModal(true);
                }}
              >
                <Plus size={16} /> Add Insurance Plan
              </button>
            </div>

            {/* Insurance Search Toolbar */}
            <div className="table-toolbar" style={{ marginTop: '2px', marginBottom: '14px' }}>
              <div className="search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search insurance by title, category, destination..."
                  value={insuranceSearchQuery}
                  onChange={(e) => setInsuranceSearchQuery(e.target.value)}
                />
              </div>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                Showing {filteredInsurancePlans.length} insurance categories &amp; plans
              </span>
            </div>

            <div className="admin-card-panel no-padding">
              <div className="table-responsive">
                <table className="admin-clean-table">
                  <thead>
                    <tr>
                      <th>Plan &amp; Category</th>
                      <th>Coverage Region</th>
                      <th>Medical Cover Limit</th>
                      <th>Starting Rate</th>
                      <th>Compliance / Badge</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInsurancePlans.map((p) => (
                      <tr key={p.id}>
                        <td>
                          <strong>{p.title}</strong>
                          <small style={{ display: 'block', color: '#0284c7', fontWeight: 700 }}>
                            {p.category}
                          </small>
                        </td>
                        <td>
                          <span style={{ fontSize: '12px', color: '#334155' }}>{p.targetCountries}</span>
                        </td>
                        <td>
                          <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
                            {p.medicalCoverage}
                          </span>
                        </td>
                        <td>
                          <div>
                            <strong style={{ color: '#17496b', fontSize: '13.5px' }}>
                              {p.startingPrice}
                            </strong>
                            <div style={{ marginTop: '4px' }}>
                              {p.showPrice ? (
                                <span
                                  style={{
                                    fontSize: '10px',
                                    background: '#dcfce7',
                                    color: '#15803d',
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 700,
                                    display: 'inline-block',
                                  }}
                                >
                                  👁️ Visible on Site
                                </span>
                              ) : (
                                <span
                                  style={{
                                    fontSize: '10px',
                                    background: '#f1f5f9',
                                    color: '#64748b',
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 700,
                                    display: 'inline-block',
                                  }}
                                >
                                  🙈 Hidden (Quote on Request)
                                </span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleInsurancePrice(p.id)}
                              style={{
                                fontSize: '10.5px',
                                padding: '2px 8px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '4px',
                                background: '#ffffff',
                                color: p.showPrice ? '#b91c1c' : '#0284c7',
                                fontWeight: 700,
                                cursor: 'pointer',
                                marginTop: '4px',
                                display: 'inline-block',
                              }}
                              title={p.showPrice ? 'Click to hide price on website' : 'Click to show price on website'}
                            >
                              {p.showPrice ? 'Hide Price' : 'Turn On Price'}
                            </button>
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '11.5px', color: '#475569' }}>{p.badge}</span>
                        </td>
                        <td>
                          <span className={`status-pill ${p.status === 'PUBLISHED' ? 'pill-confirmed' : 'pill-pending'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <button
                              className="btn btn-outline small"
                              title="Edit Plan"
                              onClick={() => {
                                setEditingInsurancePlan(p);
                                setInsuranceFormData({
                                  id: p.id,
                                  slug: p.slug,
                                  title: p.title,
                                  category: p.category,
                                  badge: p.badge,
                                  shortDesc: p.shortDesc,
                                  medicalCoverage: p.medicalCoverage,
                                  targetCountries: p.targetCountries,
                                  startingPrice: p.startingPrice,
                                  currency: p.currency,
                                  status: p.status,
                                  highlights: (p.coverageHighlights || []).join('\n'),
                                  showPrice: Boolean(p.showPrice),
                                });
                                setShowInsuranceModal(true);
                              }}
                            >
                              <Edit2 size={13} /> Edit
                            </button>
                            <button
                              className="action-icon-btn"
                              title="Delete Plan"
                              onClick={() => deleteInsurancePlan(p.id, p.title)}
                              style={{ color: '#dc2626' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredInsurancePlans.length === 0 && (
                      <tr>
                        <td colSpan={7} style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
                          No insurance plans found matching your search.
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

            {/* TAB 1: HOME PAGE CONTENT */}
            {contentTab === 'Home' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* 1. LIVE RUNNING OFFER ADS CONTROL (Marquee Ticker & Banner Promo) */}
                <div
                  className="admin-card-panel"
                  style={{
                    border: '1.5px solid #fde68a',
                    backgroundColor: '#fffdf5',
                  }}
                >
                  <div className="panel-header" style={{ marginBottom: '14px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '20px' }}>🔥</span>
                        <h3 style={{ margin: 0, color: '#92400e' }}>Live Running Offer Ads &amp; Ticker</h3>
                      </div>
                      <p style={{ margin: '4px 0 0', color: '#b45309' }}>
                        Broadcast flash promotions, festival discounts, and special offers on top of the website banner and visa packages.
                      </p>
                    </div>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '8px 14px',
                        background: '#ffffff',
                        border: '1.5px solid #fcd34d',
                        borderRadius: '6px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={websiteContent.home.enableLiveOffers ?? true}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            home: { ...prev.home, enableLiveOffers: e.target.checked },
                          }))
                        }
                      />
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: websiteContent.home.enableLiveOffers ? '#b45309' : '#64748b',
                        }}
                      >
                        {websiteContent.home.enableLiveOffers ? '🔥 LIVE OFFERS ACTIVE (ON)' : 'Offers Disabled (OFF)'}
                      </span>
                    </label>
                  </div>

                  {websiteContent.home.enableLiveOffers && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px' }}>
                        <label>
                          Offer Badge Tag
                          <input
                            type="text"
                            value={websiteContent.home.offerBadge || ''}
                            onChange={(e) =>
                              setWebsiteContent((prev) => ({
                                ...prev,
                                home: { ...prev.home, offerBadge: e.target.value },
                              }))
                            }
                            placeholder="e.g. FLASH OFFER • LIMITED TIME"
                          />
                        </label>
                        <label>
                          Target Link (Clicking Offer Redirects To)
                          <input
                            type="text"
                            value={websiteContent.home.offerLink || '/visa'}
                            onChange={(e) =>
                              setWebsiteContent((prev) => ({
                                ...prev,
                                home: { ...prev.home, offerLink: e.target.value },
                              }))
                            }
                            placeholder="/visa or /packages or /enquire"
                          />
                        </label>
                      </div>

                      <label>
                        Offer Running Headline / Marquee Ad Text
                        <input
                          type="text"
                          value={websiteContent.home.offerHeadline || ''}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              home: { ...prev.home, offerHeadline: e.target.value },
                            }))
                          }
                          placeholder="e.g. Get Flat ₹2,000 OFF on all Tourist Visas & Free Travel Insurance on International Holiday Packages! Book before midnight!"
                        />
                      </label>

                      {/* Live Ticker Preview */}
                      <div
                        style={{
                          padding: '10px 14px',
                          background: 'linear-gradient(90deg, #b45309 0%, #d97706 100%)',
                          color: '#ffffff',
                          borderRadius: '6px',
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          overflow: 'hidden',
                        }}
                      >
                        <span
                          style={{
                            background: '#ffffff',
                            color: '#b45309',
                            fontWeight: 800,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {websiteContent.home.offerBadge || 'LIVE OFFER'}
                        </span>
                        <span style={{ fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {websiteContent.home.offerHeadline || 'Limited Time Deal Active'}
                        </span>
                        <span style={{ marginLeft: 'auto', fontWeight: 700, whiteSpace: 'nowrap', fontSize: '12px' }}>
                          Claim Now →
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. HERO BANNER MEDIA SETTINGS: VIDEO CLIP & MULTI-IMAGE CAROUSEL */}
                <div className="admin-card-panel">
                  <div className="panel-header" style={{ marginBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Film size={20} color="#0284c7" />
                        <h3 style={{ margin: 0 }}>Banner Media Mode: Video vs Multi-Image Carousel</h3>
                      </div>
                      <p style={{ margin: '4px 0 0', color: '#64748b' }}>
                        Switch seamlessly between background video playback and continuous 5 to 8 sliding destination images.
                      </p>
                    </div>

                    {/* VIDEO ON/OFF TOGGLE SWITCH */}
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '8px 14px',
                        background: websiteContent.home.enableVideo ? '#f0fdf4' : '#f8fafc',
                        border: websiteContent.home.enableVideo ? '1.5px solid #22c55e' : '1.5px solid #cbd5e1',
                        borderRadius: '6px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={websiteContent.home.enableVideo ?? false}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            home: { ...prev.home, enableVideo: e.target.checked },
                          }))
                        }
                      />
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 700,
                          color: websiteContent.home.enableVideo ? '#15803d' : '#64748b',
                        }}
                      >
                        {websiteContent.home.enableVideo ? '🎬 VIDEO BANNER (ON)' : '🖼️ IMAGE SLIDESHOW (ON)'}
                      </span>
                    </label>
                  </div>

                  {/* IF VIDEO IS ENABLED */}
                  {websiteContent.home.enableVideo ? (
                    <div
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <strong style={{ fontSize: '14px', color: '#1e293b' }}>
                          🎥 Background Video Clip Player Settings
                        </strong>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          Autoplays muted on loop with visitor sound toggle
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', alignItems: 'start' }}>
                        <div>
                          <label>
                            Video Clip Source URL (MP4 or WebM)
                            <input
                              type="text"
                              value={websiteContent.home.heroVideoUrl || '/videos/travel-hero.webm'}
                              onChange={(e) =>
                                setWebsiteContent((prev) => ({
                                  ...prev,
                                  home: { ...prev.home, heroVideoUrl: e.target.value },
                                }))
                              }
                              placeholder="/videos/travel-hero.webm or https://..."
                            />
                          </label>

                          <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                            <button
                              type="button"
                              className="btn btn-outline small"
                              onClick={() =>
                                setWebsiteContent((prev) => ({
                                  ...prev,
                                  home: { ...prev.home, heroVideoUrl: '/videos/travel-hero.webm' },
                                }))
                              }
                            >
                              Preset 1: Aerial Ocean Drone (Local)
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline small"
                              onClick={() =>
                                setWebsiteContent((prev) => ({
                                  ...prev,
                                  home: {
                                    ...prev.home,
                                    heroVideoUrl:
                                      'https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-waves-crashing-on-a-beach-41484-large.mp4',
                                  },
                                }))
                              }
                            >
                              Preset 2: Beach Waves Drone
                            </button>
                          </div>
                        </div>

                        {/* Video Player Preview */}
                        <div
                          style={{
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '1px solid #cbd5e1',
                            background: '#000000',
                            position: 'relative',
                            aspectRatio: '16/9',
                          }}
                        >
                          <video
                            src={websiteContent.home.heroVideoUrl || '/videos/travel-hero.webm'}
                            autoPlay
                            muted
                            loop
                            playsInline
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '6px',
                              left: '8px',
                              background: 'rgba(0,0,0,0.7)',
                              color: '#ffffff',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '11px',
                            }}
                          >
                            Live Video Preview
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* IF VIDEO IS OFF: CONTINUOUS 5 TO 8 IMAGES SLIDING BANNER */
                    <div
                      style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <strong style={{ fontSize: '14px', color: '#1e293b' }}>
                            Continuous Sliding Images Carousel ({websiteContent.home.heroImages?.length || 8} Active Slides)
                          </strong>
                          <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#64748b' }}>
                            Fresh international destinations sliding smoothly with swipe &amp; arrow controls.
                          </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', color: '#475569', fontWeight: 600 }}>Slide Duration:</span>
                          <select
                            value={websiteContent.home.slideInterval || 5000}
                            onChange={(e) =>
                              setWebsiteContent((prev) => ({
                                ...prev,
                                home: { ...prev.home, slideInterval: Number(e.target.value) },
                              }))
                            }
                            style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '13px', border: '1px solid #cbd5e1' }}
                          >
                            <option value={3000}>3 seconds (Fast)</option>
                            <option value={4000}>4 seconds</option>
                            <option value={5000}>5 seconds (Default)</option>
                            <option value={7000}>7 seconds</option>
                            <option value={10000}>10 seconds</option>
                          </select>
                        </div>
                      </div>

                      {/* SLIDES THUMBNAIL GRID */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                          gap: '14px',
                        }}
                      >
                        {(websiteContent.home.heroImages || []).map((imgUrl, index) => (
                          <div
                            key={index}
                            style={{
                              border: '1px solid #cbd5e1',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              background: '#ffffff',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <div style={{ height: '110px', position: 'relative', background: '#0f172a' }}>
                              <Image
                                src={imgUrl}
                                alt={`Banner Slide ${index + 1}`}
                                fill
                                style={{ objectFit: 'cover' }}
                                unoptimized={imgUrl.startsWith('data:') || imgUrl.startsWith('/uploads')}
                              />
                              <span
                                style={{
                                  position: 'absolute',
                                  top: '6px',
                                  left: '6px',
                                  background: 'rgba(0,0,0,0.7)',
                                  color: '#ffffff',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: 700,
                                }}
                              >
                                Slide #{index + 1}
                              </span>
                            </div>

                            <div style={{ padding: '8px', display: 'flex', gap: '6px' }}>
                              <button
                                type="button"
                                className="btn btn-outline small"
                                style={{ flex: 1, padding: '4px 6px', fontSize: '11px' }}
                                onClick={() => {
                                  const newUrl = prompt(`Enter new image URL for Slide #${index + 1}:`, imgUrl);
                                  if (newUrl) {
                                    const nextImages = [...(websiteContent.home.heroImages || [])];
                                    nextImages[index] = newUrl;
                                    setWebsiteContent((prev) => ({
                                      ...prev,
                                      home: { ...prev.home, heroImages: nextImages, heroImage: nextImages[0] },
                                    }));
                                  }
                                }}
                              >
                                Replace URL
                              </button>
                              {(websiteContent.home.heroImages?.length || 0) > 3 && (
                                <button
                                  type="button"
                                  className="btn btn-outline small"
                                  style={{ color: '#dc2626', borderColor: '#fca5a5', padding: '4px 6px', fontSize: '11px' }}
                                  title="Remove Slide"
                                  onClick={() => {
                                    const nextImages = (websiteContent.home.heroImages || []).filter((_, i) => i !== index);
                                    setWebsiteContent((prev) => ({
                                      ...prev,
                                      home: { ...prev.home, heroImages: nextImages, heroImage: nextImages[0] },
                                    }));
                                  }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* ADD NEW SLIDE BUTTON */}
                      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                        <button
                          type="button"
                          className="btn btn-outline small"
                          onClick={() => {
                            const newUrl = prompt('Enter image URL for new slide:');
                            if (newUrl) {
                              const nextImages = [...(websiteContent.home.heroImages || []), newUrl];
                              setWebsiteContent((prev) => ({
                                ...prev,
                                home: { ...prev.home, heroImages: nextImages },
                              }));
                            }
                          }}
                        >
                          <Plus size={14} /> Add Another Banner Slide
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3. HERO HEADLINES & CALL-TO-ACTIONS */}
                <div className="admin-card-panel">
                  <div className="panel-header">
                    <div>
                      <h3>Hero Headlines &amp; Copy</h3>
                      <p>Customize banner eyebrow, main titles, and subtitle description.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <label>
                      Eyebrow Text
                      <input
                        type="text"
                        value={websiteContent.home.eyebrow}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            home: { ...prev.home, eyebrow: e.target.value },
                          }))
                        }
                      />
                    </label>

                    <label>
                      Main Headline
                      <input
                        type="text"
                        value={websiteContent.home.title}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            home: { ...prev.home, title: e.target.value },
                          }))
                        }
                      />
                    </label>

                    <label>
                      Subtitle Description
                      <textarea
                        rows={3}
                        value={websiteContent.home.subtitle}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            home: { ...prev.home, subtitle: e.target.value },
                          }))
                        }
                      />
                    </label>
                  </div>
                </div>

                {/* Homepage Trust Badges / Value Highlights */}
                <div className="admin-card-panel">
                  <div className="panel-header">
                    <div>
                      <h3>Homepage Value Pillars (4 Highlights)</h3>
                      <p>Showcase why travelers trust SkyRay Holidays for their journeys.</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ border: '1px solid #e2edf3', borderRadius: '8px', padding: '16px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label>
                        <span>Pillar 1 Title</span>
                        <input
                          type="text"
                          value={websiteContent.home.badge1Title}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              home: { ...prev.home, badge1Title: e.target.value },
                            }))
                          }
                        />
                      </label>
                      <label>
                        <span>Description</span>
                        <input
                          type="text"
                          value={websiteContent.home.badge1Desc}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              home: { ...prev.home, badge1Desc: e.target.value },
                            }))
                          }
                        />
                      </label>
                    </div>

                    <div style={{ border: '1px solid #e2edf3', borderRadius: '8px', padding: '16px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label>
                        <span>Pillar 2 Title</span>
                        <input
                          type="text"
                          value={websiteContent.home.badge2Title}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              home: { ...prev.home, badge2Title: e.target.value },
                            }))
                          }
                        />
                      </label>
                      <label>
                        <span>Description</span>
                        <input
                          type="text"
                          value={websiteContent.home.badge2Desc}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              home: { ...prev.home, badge2Desc: e.target.value },
                            }))
                          }
                        />
                      </label>
                    </div>

                    <div style={{ border: '1px solid #e2edf3', borderRadius: '8px', padding: '16px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label>
                        <span>Pillar 3 Title</span>
                        <input
                          type="text"
                          value={websiteContent.home.badge3Title}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              home: { ...prev.home, badge3Title: e.target.value },
                            }))
                          }
                        />
                      </label>
                      <label>
                        <span>Description</span>
                        <input
                          type="text"
                          value={websiteContent.home.badge3Desc}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              home: { ...prev.home, badge3Desc: e.target.value },
                            }))
                          }
                        />
                      </label>
                    </div>

                    <div style={{ border: '1px solid #e2edf3', borderRadius: '8px', padding: '16px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label>
                        <span>Pillar 4 Title</span>
                        <input
                          type="text"
                          value={websiteContent.home.badge4Title}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              home: { ...prev.home, badge4Title: e.target.value },
                            }))
                          }
                        />
                      </label>
                      <label>
                        <span>Description</span>
                        <input
                          type="text"
                          value={websiteContent.home.badge4Desc}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              home: { ...prev.home, badge4Desc: e.target.value },
                            }))
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button className="btn btn-primary" onClick={() => handleSaveContentSection('Home')}>
                      Save Home Page Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ABOUT PAGE CONTENT */}
            {contentTab === 'About' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="admin-card-panel">
                  <div className="panel-header">
                    <div>
                      <h3>About Us Hero &amp; Brand Story</h3>
                      <p>Customize the narrative, cover photograph, and company introduction on /about.</p>
                    </div>
                  </div>

                  <div className="content-hero-preview-box">
                    <div className="hero-img-col">
                      <div className="img-frame">
                        <Image
                          src={websiteContent.about.image || '/images/hero.jpg'}
                          alt="About Page Cover"
                          fill
                          style={{ objectFit: 'cover' }}
                          unoptimized={
                            websiteContent.about.image?.startsWith('data:') ||
                            websiteContent.about.image?.startsWith('/uploads')
                          }
                        />
                      </div>

                      {/* Hidden file input for About image */}
                      <input
                        type="file"
                        ref={aboutFileInputRef}
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAboutImageUpload}
                      />

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
                        <button
                          type="button"
                          className="btn btn-primary small full-btn"
                          disabled={uploadingAboutImage}
                          onClick={() => aboutFileInputRef.current?.click()}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          {uploadingAboutImage ? <Loader2 size={14} className="spin" /> : <Upload size={14} />}
                          {uploadingAboutImage ? 'Uploading...' : 'Upload Photo from Device'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline small full-btn"
                          onClick={() => {
                            const url = prompt('Or enter image URL:', websiteContent.about.image);
                            if (url) {
                              setWebsiteContent((prev) => ({
                                ...prev,
                                about: { ...prev.about, image: url },
                              }));
                            }
                          }}
                        >
                          Enter Image URL
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline small full-btn"
                          onClick={() => {
                            setWebsiteContent((prev) => ({
                              ...prev,
                              about: { ...prev.about, image: '/brand/skyray-about-logo.jpg' },
                            }));
                            setSavedMsg('Official SkyRay Logo (White Background) loaded! Click "Save About Changes" below to publish.');
                            setTimeout(() => setSavedMsg(''), 4000);
                          }}
                          style={{ borderColor: '#38bdf8', color: '#0284c7', background: '#f0f9ff' }}
                        >
                          Use Official Logo (White Background)
                        </button>
                      </div>
                    </div>

                    <div className="hero-inputs-col">
                      <label>
                        Eyebrow Text
                        <input
                          type="text"
                          value={websiteContent.about.eyebrow}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              about: { ...prev.about, eyebrow: e.target.value },
                            }))
                          }
                        />
                      </label>

                      <label>
                        Main Title
                        <input
                          type="text"
                          value={websiteContent.about.title}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              about: { ...prev.about, title: e.target.value },
                            }))
                          }
                        />
                      </label>

                      <label>
                        Lead Introduction
                        <textarea
                          rows={2}
                          value={websiteContent.about.lead}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              about: { ...prev.about, lead: e.target.value },
                            }))
                          }
                        />
                      </label>

                      <label>
                        Detailed Brand Story
                        <textarea
                          rows={3}
                          value={websiteContent.about.story}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              about: { ...prev.about, story: e.target.value },
                            }))
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Core Values (Three Pillars) */}
                <div className="admin-card-panel">
                  <div className="panel-header">
                    <div>
                      <h3>Core Values (The Three Pillars)</h3>
                      <p>Mission, Vision, and Why Choose Us statements.</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                    <div style={{ border: '1px solid #e2edf3', borderRadius: '8px', padding: '16px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label>
                        <span>Mission Title</span>
                        <input
                          type="text"
                          value={websiteContent.about.missionTitle}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              about: { ...prev.about, missionTitle: e.target.value },
                            }))
                          }
                        />
                      </label>
                      <label>
                        <span>Mission Description</span>
                        <textarea
                          rows={3}
                          value={websiteContent.about.missionDesc}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              about: { ...prev.about, missionDesc: e.target.value },
                            }))
                          }
                        />
                      </label>
                    </div>

                    <div style={{ border: '1px solid #e2edf3', borderRadius: '8px', padding: '16px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label>
                        <span>Vision Title</span>
                        <input
                          type="text"
                          value={websiteContent.about.visionTitle}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              about: { ...prev.about, visionTitle: e.target.value },
                            }))
                          }
                        />
                      </label>
                      <label>
                        <span>Vision Description</span>
                        <textarea
                          rows={3}
                          value={websiteContent.about.visionDesc}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              about: { ...prev.about, visionDesc: e.target.value },
                            }))
                          }
                        />
                      </label>
                    </div>

                    <div style={{ border: '1px solid #e2edf3', borderRadius: '8px', padding: '16px', background: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <label>
                        <span>Why Choose Us Title</span>
                        <input
                          type="text"
                          value={websiteContent.about.whyUsTitle}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              about: { ...prev.about, whyUsTitle: e.target.value },
                            }))
                          }
                        />
                      </label>
                      <label>
                        <span>Why Choose Us Description</span>
                        <textarea
                          rows={3}
                          value={websiteContent.about.whyUsDesc}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              about: { ...prev.about, whyUsDesc: e.target.value },
                            }))
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* The SkyRay Promises */}
                <div className="admin-card-panel">
                  <div className="panel-header">
                    <div>
                      <h3>The SkyRay Promises (Assurance Checkpoints)</h3>
                      <p>Key service guarantees highlighted with verified icons on /about.</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <label>
                      <span>Promise 1</span>
                      <input
                        type="text"
                        value={websiteContent.about.promise1}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            about: { ...prev.about, promise1: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span>Promise 2</span>
                      <input
                        type="text"
                        value={websiteContent.about.promise2}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            about: { ...prev.about, promise2: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span>Promise 3</span>
                      <input
                        type="text"
                        value={websiteContent.about.promise3}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            about: { ...prev.about, promise3: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span>Promise 4</span>
                      <input
                        type="text"
                        value={websiteContent.about.promise4}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            about: { ...prev.about, promise4: e.target.value },
                          }))
                        }
                      />
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button className="btn btn-primary" onClick={() => handleSaveContentSection('About')}>
                      Save About Page Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: CONTACT PAGE CONTENT */}
            {contentTab === 'Contact' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="admin-card-panel">
                  <div className="panel-header">
                    <div>
                      <h3>Contact Page Hero Banner</h3>
                      <p>Customize banner headlines and descriptive copy on /contact.</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <label>
                      <span>Eyebrow Text</span>
                      <input
                        type="text"
                        value={websiteContent.contact.bannerEyebrow}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, bannerEyebrow: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <label>
                      <span>Headline Title</span>
                      <input
                        type="text"
                        value={websiteContent.contact.bannerTitle}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, bannerTitle: e.target.value },
                          }))
                        }
                      />
                    </label>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label>
                        <span>Subtitle Description</span>
                        <textarea
                          rows={2}
                          value={websiteContent.contact.bannerDesc}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              contact: { ...prev.contact, bannerDesc: e.target.value },
                            }))
                          }
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="admin-card-panel">
                  <div className="panel-header">
                    <div>
                      <h3>Direct Helpline Channels &amp; Office Information</h3>
                      <p>All changes sync live to the database and across the customer portal.</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <label>
                      <span>India Desk Helpline (Call &amp; WhatsApp)</span>
                      <input
                        type="text"
                        value={websiteContent.contact.phoneIndia}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, phoneIndia: e.target.value },
                          }))
                        }
                      />
                    </label>

                    <label>
                      <span>Saudi Arabia &amp; Pilgrimage Desk</span>
                      <input
                        type="text"
                        value={websiteContent.contact.phoneSaudi}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, phoneSaudi: e.target.value },
                          }))
                        }
                      />
                    </label>

                    <label>
                      <span>Primary WhatsApp Channel</span>
                      <input
                        type="text"
                        value={websiteContent.contact.whatsapp}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, whatsapp: e.target.value },
                          }))
                        }
                      />
                    </label>

                    <label>
                      <span>Official Concierge Email</span>
                      <input
                        type="email"
                        value={websiteContent.contact.email}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, email: e.target.value },
                          }))
                        }
                      />
                    </label>

                    <label>
                      <span>Head Office Address</span>
                      <input
                        type="text"
                        value={websiteContent.contact.address}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, address: e.target.value },
                          }))
                        }
                      />
                    </label>

                    <label>
                      <span>Support Hours / Availability</span>
                      <input
                        type="text"
                        value={websiteContent.contact.hours}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            contact: { ...prev.contact, hours: e.target.value },
                          }))
                        }
                      />
                    </label>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label>
                        <span>Pre-filled WhatsApp Instant Message</span>
                        <input
                          type="text"
                          value={websiteContent.contact.whatsappMessage}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              contact: { ...prev.contact, whatsappMessage: e.target.value },
                            }))
                          }
                        />
                      </label>
                    </div>

                    <div style={{ gridColumn: 'span 2' }}>
                      <label>
                        <span>Google Reviews &amp; Maps Link</span>
                        <input
                          type="url"
                          value={websiteContent.contact.googleReviewsUrl}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              contact: { ...prev.contact, googleReviewsUrl: e.target.value },
                            }))
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button className="btn btn-primary" onClick={() => handleSaveContentSection('Contact')}>
                      Save Contact Channels &amp; Sync to Database
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: FOOTER CONTENT */}
            {contentTab === 'Footer' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="admin-card-panel">
                  <div className="panel-header">
                    <div>
                      <h3>Global Footer Branding &amp; Legal Notices</h3>
                      <p>Customize the bio, review badge, copyright, and official accreditation text.</p>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label>
                        <span>Footer Company Bio / Tagline</span>
                        <textarea
                          rows={3}
                          value={websiteContent.footer.companyBio}
                          onChange={(e) =>
                            setWebsiteContent((prev) => ({
                              ...prev,
                              footer: { ...prev.footer, companyBio: e.target.value },
                            }))
                          }
                        />
                      </label>
                    </div>

                    <label>
                      <span>Google Rating Badge Text</span>
                      <input
                        type="text"
                        value={websiteContent.footer.ratingText}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            footer: { ...prev.footer, ratingText: e.target.value },
                          }))
                        }
                      />
                    </label>

                    <label>
                      <span>Brand Slogan / Tagline</span>
                      <input
                        type="text"
                        value={websiteContent.footer.sloganText}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            footer: { ...prev.footer, sloganText: e.target.value },
                          }))
                        }
                      />
                    </label>

                    <label>
                      <span>Copyright Line</span>
                      <input
                        type="text"
                        value={websiteContent.footer.copyrightText}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            footer: { ...prev.footer, copyrightText: e.target.value },
                          }))
                        }
                      />
                    </label>

                    <label>
                      <span>Pilgrim Operator Official License Notice</span>
                      <input
                        type="text"
                        value={websiteContent.footer.pilgrimNotice}
                        onChange={(e) =>
                          setWebsiteContent((prev) => ({
                            ...prev,
                            footer: { ...prev.footer, pilgrimNotice: e.target.value },
                          }))
                        }
                      />
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                    <button className="btn btn-primary" onClick={() => handleSaveContentSection('Footer')}>
                      Save Footer Changes
                    </button>
                  </div>
                </div>
              </div>
            )}
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
          <div className="modal-dialog wide" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="modal-header" style={{ flexShrink: 0 }}>
              <h3>{editingPackage ? `Edit Package: ${editingPackage.title}` : 'Add New Package'}</h3>
              <button className="modal-close" onClick={() => setShowPackageModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={savePackage} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <div className="modal-body" style={{ overflowY: 'auto', flex: 1, minHeight: 0, padding: '20px' }}>
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

                {/* PACKAGE MEDIA SHOWCASE SECTION (PHOTOS SLIDER & VIDEO SHOWCASE) */}
                <div style={{ marginBottom: '22px', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '16px', backgroundColor: '#f8fafc' }}>
                  {/* Top Bar with Section Title and Toggle Button */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Package Media Showcase</span>
                        <span style={{ fontSize: '11px', fontWeight: 600, padding: '2px 8px', borderRadius: '999px', background: '#e0f2fe', color: '#0369a1' }}>
                          5s Auto Slider &amp; Video
                        </span>
                      </h4>
                      <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#64748b' }}>
                        Choose whether this package presents an interactive 5s image slideshow or a featured video showcase.
                      </p>
                    </div>

                    {/* Toggle Button */}
                    <div style={{ display: 'inline-flex', background: '#e2e8f0', padding: '3px', borderRadius: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setPackageFormData((prev) => ({ ...prev, mediaType: 'IMAGES' }))}
                        style={{
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: 700,
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          background: packageFormData.mediaType !== 'VIDEO' ? '#0284c7' : 'transparent',
                          color: packageFormData.mediaType !== 'VIDEO' ? '#ffffff' : '#475569',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: packageFormData.mediaType !== 'VIDEO' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        <ImageIcon size={14} /> Photo Gallery &amp; Slider (5s)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPackageFormData((prev) => ({ ...prev, mediaType: 'VIDEO' }))}
                        style={{
                          padding: '6px 14px',
                          fontSize: '12px',
                          fontWeight: 700,
                          borderRadius: '6px',
                          border: 'none',
                          cursor: 'pointer',
                          background: packageFormData.mediaType === 'VIDEO' ? '#0284c7' : 'transparent',
                          color: packageFormData.mediaType === 'VIDEO' ? '#ffffff' : '#475569',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          boxShadow: packageFormData.mediaType === 'VIDEO' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                          transition: 'all 0.2s',
                        }}
                      >
                        <Film size={14} /> Video Showcase
                      </button>
                    </div>
                  </div>

                  {/* Hidden File Inputs */}
                  <input
                    type="file"
                    ref={packageMultiFileInputRef}
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    onChange={handlePackageMultiImageUpload}
                  />
                  <input
                    type="file"
                    ref={packageVideoFileInputRef}
                    accept="video/mp4,video/webm,video/ogg"
                    style={{ display: 'none' }}
                    onChange={handlePackageVideoUpload}
                  />

                  {/* TAB 1: PHOTO GALLERY & 5S SLIDER */}
                  {packageFormData.mediaType !== 'VIDEO' && (
                    <div>
                      {/* Upload and Add Controls */}
                      <div
                        style={{
                          border: '2px dashed #cbd5e1',
                          borderRadius: '8px',
                          padding: '14px 16px',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '14px',
                          flexWrap: 'wrap',
                          marginBottom: '14px',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <button
                            type="button"
                            className="btn btn-primary small"
                            disabled={uploadingImage}
                            onClick={() => packageMultiFileInputRef.current?.click()}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
                          >
                            {uploadingImage ? <Loader2 size={14} className="spin" /> : <Upload size={14} />}
                            {uploadingImage ? 'Uploading Photos...' : 'Upload Multiple Photos from Device'}
                          </button>
                          <span style={{ fontSize: '12px', color: '#64748b' }}>
                            Select 1 or more images (JPG, PNG, WEBP). Transitions every 5s automatically.
                          </span>
                        </div>
                      </div>

                      {/* Add Image URL bar */}
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                        <input
                          style={{ flex: 1, margin: 0, fontSize: '13px' }}
                          value={newImageUrlInput}
                          onChange={(e) => setNewImageUrlInput(e.target.value)}
                          placeholder="Or paste an image URL (e.g. /images/destinations/... or https://...) and click Add"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              if (newImageUrlInput.trim()) {
                                const url = newImageUrlInput.trim();
                                setPackageFormData((prev) => {
                                  const current = prev.images || [];
                                  return {
                                    ...prev,
                                    images: [...current, url],
                                    image: prev.image || url,
                                  };
                                });
                                setNewImageUrlInput('');
                              }
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-outline small"
                          onClick={() => {
                            if (newImageUrlInput.trim()) {
                              const url = newImageUrlInput.trim();
                              setPackageFormData((prev) => {
                                const current = prev.images || [];
                                return {
                                  ...prev,
                                  images: [...current, url],
                                  image: prev.image || url,
                                };
                              });
                              setNewImageUrlInput('');
                            }
                          }}
                          style={{ flexShrink: 0, fontWeight: 600 }}
                        >
                          <Plus size={14} /> Add Image
                        </button>
                      </div>

                      {/* Selected Images List / Grid */}
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
                            Selected Photos ({(packageFormData.images || []).length})
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>
                            First image (#1) is the Cover Photo. Reorder by clicking &quot;Make Cover&quot;.
                          </span>
                        </div>

                        {(!packageFormData.images || packageFormData.images.length === 0) ? (
                          <div style={{ padding: '20px', textAlign: 'center', color: '#94a6b2', background: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
                            No images added yet. Click &quot;Upload Multiple Photos&quot; above to select images from your phone or PC.
                          </div>
                        ) : (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                            {packageFormData.images.map((imgUrl, idx) => (
                              <div
                                key={idx}
                                style={{
                                  position: 'relative',
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  border: idx === 0 ? '2px solid #0284c7' : '1px solid #cbd5e1',
                                  background: '#e2e8f0',
                                  aspectRatio: '4 / 3',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  justifyContent: 'space-between',
                                }}
                              >
                                <Image
                                  src={imgUrl}
                                  alt={`Slide ${idx + 1}`}
                                  fill
                                  style={{ objectFit: 'cover' }}
                                  unoptimized={imgUrl.startsWith('data:') || imgUrl.startsWith('/uploads')}
                                />

                                {/* Badge */}
                                <div style={{ position: 'relative', zIndex: 2, padding: '4px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  {idx === 0 ? (
                                    <span style={{ background: '#0284c7', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px' }}>
                                      #1 Cover
                                    </span>
                                  ) : (
                                    <span style={{ background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', fontWeight: 600, padding: '2px 5px', borderRadius: '4px' }}>
                                      Slide #{idx + 1}
                                    </span>
                                  )}

                                  {/* Delete Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPackageFormData((prev) => {
                                        const updated = (prev.images || []).filter((_, i) => i !== idx);
                                        return {
                                          ...prev,
                                          images: updated,
                                          image: updated[0] || '/images/destinations/dubai.jpg',
                                        };
                                      });
                                    }}
                                    style={{
                                      background: 'rgba(220, 38, 38, 0.85)',
                                      border: 'none',
                                      color: '#fff',
                                      borderRadius: '4px',
                                      width: '22px',
                                      height: '22px',
                                      display: 'grid',
                                      placeItems: 'center',
                                      cursor: 'pointer',
                                    }}
                                    title="Delete photo"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>

                                {/* Reorder / Make Cover action if not #1 */}
                                {idx > 0 && (
                                  <div style={{ position: 'relative', zIndex: 2, padding: '4px' }}>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setPackageFormData((prev) => {
                                          const current = [...(prev.images || [])];
                                          const [chosen] = current.splice(idx, 1);
                                          const reordered = [chosen, ...current];
                                          return {
                                            ...prev,
                                            images: reordered,
                                            image: chosen,
                                          };
                                        });
                                      }}
                                      style={{
                                        width: '100%',
                                        background: 'rgba(15, 23, 42, 0.75)',
                                        border: 'none',
                                        color: '#fff',
                                        fontSize: '10px',
                                        fontWeight: 600,
                                        padding: '3px 0',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                      }}
                                    >
                                      Make Cover
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: VIDEO SHOWCASE */}
                  {packageFormData.mediaType === 'VIDEO' && (
                    <div>
                      {/* Video upload row */}
                      <div
                        style={{
                          border: '2px dashed #cbd5e1',
                          borderRadius: '8px',
                          padding: '14px 16px',
                          backgroundColor: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          flexWrap: 'wrap',
                          marginBottom: '14px',
                        }}
                      >
                        <button
                          type="button"
                          className="btn btn-primary small"
                          disabled={uploadingVideo}
                          onClick={() => packageVideoFileInputRef.current?.click()}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}
                        >
                          {uploadingVideo ? <Loader2 size={14} className="spin" /> : <Film size={14} />}
                          {uploadingVideo ? 'Loading Video...' : 'Upload Video File from Device'}
                        </button>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>
                          Supports MP4, WebM (Max 50MB direct). Or provide an external video URL below.
                        </span>
                      </div>

                      {/* Video URL Input */}
                      <div style={{ marginBottom: '14px' }}>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                          Video URL (Direct MP4, Cloudflare, or hosted video):
                        </label>
                        <input
                          value={packageFormData.videoUrl}
                          onChange={(e) => setPackageFormData({ ...packageFormData, videoUrl: e.target.value })}
                          placeholder="https://.../video.mp4 or data:video/mp4;base64,..."
                          style={{ margin: 0, fontSize: '13px' }}
                        />
                      </div>

                      {/* Video Preview */}
                      {packageFormData.videoUrl ? (
                        <div style={{ background: '#0f172a', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                          <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#94a3b8', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>Preview Video Player</span>
                            <button
                              type="button"
                              onClick={() => setPackageFormData({ ...packageFormData, videoUrl: '' })}
                              style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '11px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                            >
                              <Trash2 size={12} /> Remove Video
                            </button>
                          </p>
                          <video
                            src={packageFormData.videoUrl}
                            controls
                            playsInline
                            style={{ maxHeight: '220px', width: '100%', borderRadius: '6px', backgroundColor: '#000' }}
                          />
                        </div>
                      ) : (
                        <div style={{ padding: '24px', textAlign: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#94a6b2', fontSize: '13px' }}>
                          <Film size={28} style={{ margin: '0 auto 8px', display: 'block', opacity: 0.5 }} />
                          No video file or URL provided yet. Upload a video or enter a URL above.
                        </div>
                      )}
                    </div>
                  )}
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

              <div className="modal-footer" style={{ flexShrink: 0 }}>
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

      {/* 1b. Add / Edit Visa Package Modal */}
      {showVisaModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog wide" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="modal-header" style={{ flexShrink: 0 }}>
              <h3>{editingVisa ? 'Edit Visa Service Package' : 'Create New Visa Service Package'}</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowVisaModal(false);
                  setEditingVisa(null);
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveVisaService} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <div className="modal-body" style={{ overflowY: 'auto', flex: 1, minHeight: 0, padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <label>
                    Visa Title *
                    <input
                      required
                      value={visaFormData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setVisaFormData((prev) => ({
                          ...prev,
                          title,
                          slug: editingVisa
                            ? prev.slug
                            : title
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/^-|-$/g, ''),
                        }));
                      }}
                      placeholder="e.g. United States B1/B2 Tourist Visa"
                    />
                  </label>

                  <label>
                    Slug (URL Key) *
                    <input
                      required
                      value={visaFormData.slug}
                      onChange={(e) => setVisaFormData({ ...visaFormData, slug: e.target.value })}
                      placeholder="e.g. us-tourist-visa"
                    />
                  </label>

                  <label>
                    Category
                    <select
                      value={visaFormData.category}
                      onChange={(e) => setVisaFormData({ ...visaFormData, category: e.target.value })}
                    >
                      <option value="Standard Embassy Visa">Standard Embassy Visa</option>
                      <option value="Fast-Track eVisa">Fast-Track eVisa</option>
                      <option value="Pilgrim Visa (Umrah/Hajj)">Pilgrim Visa (Umrah/Hajj)</option>
                      <option value="Business & Investment">Business & Investment</option>
                      <option value="Family & Tourist Visa">Family & Tourist Visa</option>
                      <option value="Transit Visa">Transit Visa</option>
                    </select>
                  </label>

                  <label>
                    Badge Label
                    <input
                      value={visaFormData.badge}
                      onChange={(e) => setVisaFormData({ ...visaFormData, badge: e.target.value })}
                      placeholder="e.g. Embassy Visitor Visa / Fast-Track eVisa"
                    />
                  </label>

                  <label>
                    Default / Target Country
                    <input
                      value={visaFormData.defaultCountry}
                      onChange={(e) => setVisaFormData({ ...visaFormData, defaultCountry: e.target.value })}
                      placeholder="e.g. United States, United Kingdom, Schengen"
                    />
                  </label>

                  <label>
                    Status
                    <select
                      value={visaFormData.status}
                      onChange={(e) => setVisaFormData({ ...visaFormData, status: e.target.value })}
                    >
                      <option value="PUBLISHED">PUBLISHED (Live on Website)</option>
                      <option value="DRAFT">DRAFT (Hidden)</option>
                    </select>
                  </label>

                  <label>
                    Processing Time
                    <input
                      value={visaFormData.processingTime}
                      onChange={(e) => setVisaFormData({ ...visaFormData, processingTime: e.target.value })}
                      placeholder="e.g. 10 - 15 working days"
                    />
                  </label>

                  <label>
                    Visa Validity
                    <input
                      value={visaFormData.validity}
                      onChange={(e) => setVisaFormData({ ...visaFormData, validity: e.target.value })}
                      placeholder="e.g. Up to 10 Years / 30 to 90 Days"
                    />
                  </label>

                  <label>
                    Entry Type
                    <input
                      value={visaFormData.entryType}
                      onChange={(e) => setVisaFormData({ ...visaFormData, entryType: e.target.value })}
                      placeholder="e.g. Multiple Entry / Single Entry"
                    />
                  </label>
                </div>

                {/* DEVICE IMAGE UPLOAD SECTION */}
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
                    Visa Destination / Flag Cover Image
                  </label>

                  {/* Hidden native file input */}
                  <input
                    type="file"
                    ref={visaFileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleVisaImageUpload}
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
                      {visaFormData.image ? (
                        <Image
                          src={visaFormData.image}
                          alt="Visa Preview"
                          fill
                          style={{ objectFit: 'cover' }}
                          unoptimized={visaFormData.image.startsWith('data:') || visaFormData.image.startsWith('/uploads')}
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
                          disabled={uploadingVisaImage}
                          onClick={() => visaFileInputRef.current?.click()}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          {uploadingVisaImage ? <Loader2 size={14} className="spin" /> : <Upload size={14} />}
                          {uploadingVisaImage ? 'Uploading Image...' : 'Choose File from Device'}
                        </button>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>Supports JPG, PNG, WEBP (Max 8MB)</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '8px' }}>
                    <small style={{ color: '#64748b' }}>Or enter image URL manually:</small>
                    <input
                      style={{ marginTop: '4px' }}
                      value={visaFormData.image}
                      onChange={(e) => setVisaFormData({ ...visaFormData, image: e.target.value })}
                      placeholder="/images/destinations/us-visa.jpg or https://..."
                    />
                  </div>
                </div>

                {/* Short Description */}
                <label>
                  Short Summary &amp; Scope *
                  <textarea
                    rows={2}
                    required
                    value={visaFormData.shortDesc}
                    onChange={(e) => setVisaFormData({ ...visaFormData, shortDesc: e.target.value })}
                    placeholder="Brief description of the visa requirements, convenience, and advisory support..."
                  />
                </label>

                {/* Key Inclusions & Highlights */}
                <label>
                  Key Inclusions &amp; Service Highlights (One per line)
                  <textarea
                    rows={3}
                    value={visaFormData.highlights}
                    onChange={(e) => setVisaFormData({ ...visaFormData, highlights: e.target.value })}
                    placeholder="Document Pre-Screening & Verification&#10;Appointment Scheduling&#10;Complete Application Filing Guidance"
                  />
                </label>

                {/* Applicable Countries (for Schengen / grouped visas) */}
                <label>
                  Applicable Countries (comma-separated, optional)
                  <input
                    value={visaFormData.applicableCountries}
                    onChange={(e) => setVisaFormData({ ...visaFormData, applicableCountries: e.target.value })}
                    placeholder="e.g. France, Germany, Italy, Switzerland, Spain, Netherlands"
                  />
                </label>

                {/* LIVE RUNNING OFFER & PROMOTIONAL PRICING FOR THIS VISA */}
                <div
                  style={{
                    border: '1.5px solid #fde68a',
                    backgroundColor: '#fffbeb',
                    borderRadius: '8px',
                    padding: '16px',
                    marginTop: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '20px' }}>🔥</span>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#92400e', display: 'block' }}>
                          Live Running Offer Ad on this Visa
                        </strong>
                        <small style={{ color: '#b45309' }}>
                          Shows dynamic promotional discount badge, strikethrough price, and flash deal ticker.
                        </small>
                      </div>
                    </div>
                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        padding: '6px 12px',
                        background: '#ffffff',
                        border: '1px solid #fcd34d',
                        borderRadius: '6px',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={visaFormData.hasOffer || false}
                        onChange={(e) => setVisaFormData({ ...visaFormData, hasOffer: e.target.checked })}
                      />
                      <span style={{ fontSize: '13px', fontWeight: 700, color: visaFormData.hasOffer ? '#b45309' : '#64748b' }}>
                        {visaFormData.hasOffer ? 'Offer ACTIVE (ON)' : 'Offer Disabled (OFF)'}
                      </span>
                    </label>
                  </div>

                  {visaFormData.hasOffer && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginTop: '10px' }}>
                      <label>
                        Offer Badge (Card Tag)
                        <input
                          value={visaFormData.offerBadge || ''}
                          onChange={(e) => setVisaFormData({ ...visaFormData, offerBadge: e.target.value })}
                          placeholder="e.g. FLAT ₹2,000 OFF or LIMITED TIME DEAL"
                        />
                      </label>
                      <label>
                        Live Offer Ad Ticker
                        <input
                          value={visaFormData.offerRunningText || ''}
                          onChange={(e) => setVisaFormData({ ...visaFormData, offerRunningText: e.target.value })}
                          placeholder="e.g. ⚡ Limited Time: Free document pre-check + Flat ₹2,000 Discount!"
                        />
                      </label>
                      <label>
                        Original Standard Price (Crossed Out)
                        <input
                          value={visaFormData.originalPrice || ''}
                          onChange={(e) => setVisaFormData({ ...visaFormData, originalPrice: e.target.value })}
                          placeholder="e.g. ₹8,500"
                        />
                      </label>
                      <label>
                        Special Offer Discount Price (Highlighted)
                        <input
                          value={visaFormData.offerPrice || ''}
                          onChange={(e) => setVisaFormData({ ...visaFormData, offerPrice: e.target.value })}
                          placeholder="e.g. ₹6,500"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer" style={{ flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowVisaModal(false);
                    setEditingVisa(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingVisa ? 'Update Visa Package' : 'Save Visa Package'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1c. Add / Edit Attestation Service Modal */}
      {showAttestationModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog wide" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="modal-header" style={{ flexShrink: 0 }}>
              <h3>{editingAttestation ? 'Edit Attestation Service' : 'Create New Attestation Service'}</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowAttestationModal(false);
                  setEditingAttestation(null);
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveAttestation} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <div className="modal-body" style={{ overflowY: 'auto', flex: 1, minHeight: 0, padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <label>
                    Attestation Service Title *
                    <input
                      required
                      value={attestationFormData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setAttestationFormData((prev) => ({
                          ...prev,
                          title,
                          slug: editingAttestation
                            ? prev.slug
                            : title
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/^-|-$/g, ''),
                        }));
                      }}
                      placeholder="e.g. UAE Embassy Attestation & MOFA Legalization"
                    />
                  </label>
                  <label>
                    URL Slug *
                    <input
                      required
                      value={attestationFormData.slug}
                      onChange={(e) => setAttestationFormData({ ...attestationFormData, slug: e.target.value })}
                      placeholder="e.g. uae-embassy-attestation"
                    />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <label>
                    Attestation Category *
                    <select
                      value={attestationFormData.category}
                      onChange={(e) =>
                        setAttestationFormData({
                          ...attestationFormData,
                          category: e.target.value as any,
                        })
                      }
                    >
                      <option value="Gulf Embassy">Gulf Embassy (UAE, Saudi, Qatar, Kuwait)</option>
                      <option value="Apostille">Hague Apostille (120+ Countries)</option>
                      <option value="Educational">Educational &amp; Degree</option>
                      <option value="Personal">Personal (Marriage, Birth, PCC)</option>
                      <option value="Commercial">Commercial &amp; Power of Attorney</option>
                    </select>
                  </label>
                  <label>
                    Header Badge
                    <input
                      value={attestationFormData.badge}
                      onChange={(e) => setAttestationFormData({ ...attestationFormData, badge: e.target.value })}
                      placeholder="e.g. High Demand · Dubai & Abu Dhabi"
                    />
                  </label>
                  <label>
                    Publication Status
                    <select
                      value={attestationFormData.status}
                      onChange={(e) => setAttestationFormData({ ...attestationFormData, status: e.target.value })}
                    >
                      <option value="Active">Active (Visible on Website)</option>
                      <option value="Draft">Draft (Hidden)</option>
                    </select>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <label>
                    Processing Turnaround *
                    <input
                      required
                      value={attestationFormData.processingTime}
                      onChange={(e) => setAttestationFormData({ ...attestationFormData, processingTime: e.target.value })}
                      placeholder="e.g. 5 – 8 Working Days"
                    />
                  </label>
                  <label>
                    Validity Scope *
                    <input
                      required
                      value={attestationFormData.validity}
                      onChange={(e) => setAttestationFormData({ ...attestationFormData, validity: e.target.value })}
                      placeholder="e.g. Permanent / Lifetime Authentication"
                    />
                  </label>
                  <label>
                    Starting Price / Fee *
                    <input
                      required
                      value={attestationFormData.startingPrice}
                      onChange={(e) => setAttestationFormData({ ...attestationFormData, startingPrice: e.target.value })}
                      placeholder="e.g. ₹3,500"
                    />
                  </label>
                </div>

                {/* Website Price Display Setting */}
                <div style={{ padding: '12px 14px', background: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd', marginBottom: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 700, color: '#0369a1', margin: 0 }}>
                    <input
                      type="checkbox"
                      checked={Boolean(attestationFormData.showPrice)}
                      onChange={(e) => setAttestationFormData({ ...attestationFormData, showPrice: e.target.checked })}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <div>
                      <div style={{ fontSize: '13.5px' }}>Display Starting Price on Website</div>
                      <small style={{ color: '#475569', fontWeight: 500, display: 'block', marginTop: '2px' }}>
                        When turned OFF (default), the website displays &ldquo;Custom Quote on Enquiry&rdquo; without showing any price amount. Turn this ON if you want the public website to display this service fee.
                      </small>
                    </div>
                  </label>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label>
                    Short Description / Overview *
                    <textarea
                      required
                      rows={2}
                      value={attestationFormData.shortDesc}
                      onChange={(e) => setAttestationFormData({ ...attestationFormData, shortDesc: e.target.value })}
                      placeholder="Overview of documents covered, embassy scope, and purpose..."
                    />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <label>
                    Target Countries (One per line) *
                    <textarea
                      required
                      rows={3}
                      value={attestationFormData.targetCountries}
                      onChange={(e) => setAttestationFormData({ ...attestationFormData, targetCountries: e.target.value })}
                      placeholder="United Arab Emirates (Dubai, Abu Dhabi)&#10;Saudi Arabia&#10;Qatar"
                    />
                  </label>

                  <label>
                    Required Documents (One per line) *
                    <textarea
                      required
                      rows={3}
                      value={attestationFormData.requirements}
                      onChange={(e) => setAttestationFormData({ ...attestationFormData, requirements: e.target.value })}
                      placeholder="Original Certificate&#10;Passport Copy (First & Last Page)&#10;Aadhaar / National ID"
                    />
                  </label>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label>
                    Step-by-Step Legalization Workflow (One step per line) *
                    <textarea
                      required
                      rows={4}
                      value={attestationFormData.workflow}
                      onChange={(e) => setAttestationFormData({ ...attestationFormData, workflow: e.target.value })}
                      placeholder="1. Notary Public Attestation&#10;2. State HRD / Home Department Authentication&#10;3. Ministry of External Affairs (MEA India)&#10;4. Embassy Legalization"
                    />
                  </label>
                </div>

                {/* Promotional Offer Fields */}
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginTop: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '12px', fontWeight: 700 }}>
                    <input
                      type="checkbox"
                      checked={attestationFormData.hasOffer}
                      onChange={(e) => setAttestationFormData({ ...attestationFormData, hasOffer: e.target.checked })}
                    />
                    Enable Running Promotional Offer on this Attestation Service
                  </label>

                  {attestationFormData.hasOffer && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <label>
                        Offer Badge
                        <input
                          value={attestationFormData.offerBadge}
                          onChange={(e) => setAttestationFormData({ ...attestationFormData, offerBadge: e.target.value })}
                          placeholder="e.g. EXPRESS PROMO"
                        />
                      </label>
                      <label>
                        Original Price
                        <input
                          value={attestationFormData.originalPrice}
                          onChange={(e) => setAttestationFormData({ ...attestationFormData, originalPrice: e.target.value })}
                          placeholder="e.g. ₹4,500"
                        />
                      </label>
                      <label>
                        Offer Price
                        <input
                          value={attestationFormData.offerPrice}
                          onChange={(e) => setAttestationFormData({ ...attestationFormData, offerPrice: e.target.value })}
                          placeholder="e.g. ₹3,500"
                        />
                      </label>
                      <label style={{ gridColumn: 'span 3' }}>
                        Running Banner Offer Text
                        <input
                          value={attestationFormData.offerRunningText}
                          onChange={(e) => setAttestationFormData({ ...attestationFormData, offerRunningText: e.target.value })}
                          placeholder="e.g. Flat ₹1,000 Off on all Degree Attestations this month!"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer" style={{ flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowAttestationModal(false);
                    setEditingAttestation(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAttestation ? 'Update Attestation Service' : 'Save Attestation Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1d. Add / Edit Insurance Plan Modal */}
      {showInsuranceModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog wide" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="modal-header" style={{ flexShrink: 0 }}>
              <h3>{editingInsurancePlan ? 'Edit Travel Insurance Plan' : 'Add New Travel Insurance Plan'}</h3>
              <button
                className="modal-close"
                onClick={() => {
                  setShowInsuranceModal(false);
                  setEditingInsurancePlan(null);
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveInsurancePlan} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
              <div className="modal-body" style={{ overflowY: 'auto', flex: 1, minHeight: 0, padding: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <label>
                    Insurance Plan Title *
                    <input
                      required
                      value={insuranceFormData.title}
                      onChange={(e) => {
                        const title = e.target.value;
                        setInsuranceFormData((prev) => ({
                          ...prev,
                          title,
                          slug: editingInsurancePlan
                            ? prev.slug
                            : title
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, '-')
                                .replace(/^-|-$/g, ''),
                        }));
                      }}
                      placeholder="e.g. Europe & Schengen Visa Approved Travel Insurance"
                    />
                  </label>
                  <label>
                    URL Slug *
                    <input
                      required
                      value={insuranceFormData.slug}
                      onChange={(e) => setInsuranceFormData({ ...insuranceFormData, slug: e.target.value })}
                      placeholder="e.g. europe-schengen-travel-insurance"
                    />
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <label>
                    Insurance Category *
                    <select
                      value={insuranceFormData.category}
                      onChange={(e) =>
                        setInsuranceFormData({
                          ...insuranceFormData,
                          category: e.target.value as any,
                        })
                      }
                    >
                      <option value="Europe">Europe (Schengen Compliant)</option>
                      <option value="Rest of World">Rest of World (All Countries)</option>
                      <option value="United States">United States</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </label>
                  <label>
                    Header Badge
                    <input
                      value={insuranceFormData.badge}
                      onChange={(e) => setInsuranceFormData({ ...insuranceFormData, badge: e.target.value })}
                      placeholder="e.g. 100% Embassy & VFS Compliant"
                    />
                  </label>
                  <label>
                    Publication Status
                    <select
                      value={insuranceFormData.status}
                      onChange={(e) => setInsuranceFormData({ ...insuranceFormData, status: e.target.value as any })}
                    >
                      <option value="PUBLISHED">PUBLISHED (Visible to Public)</option>
                      <option value="DRAFT">DRAFT (Staff Only)</option>
                    </select>
                  </label>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  <label>
                    Medical Coverage Limit *
                    <input
                      required
                      value={insuranceFormData.medicalCoverage}
                      onChange={(e) => setInsuranceFormData({ ...insuranceFormData, medicalCoverage: e.target.value })}
                      placeholder="e.g. €30,000 – €100,000 or $500,000 USD"
                    />
                  </label>
                  <label>
                    Starting Price / Rate *
                    <input
                      required
                      value={insuranceFormData.startingPrice}
                      onChange={(e) => setInsuranceFormData({ ...insuranceFormData, startingPrice: e.target.value })}
                      placeholder="e.g. ₹750"
                    />
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '6px', fontSize: '12px', fontWeight: 600 }}>
                      <input
                        type="checkbox"
                        checked={Boolean(insuranceFormData.showPrice)}
                        onChange={(e) => setInsuranceFormData({ ...insuranceFormData, showPrice: e.target.checked })}
                      />
                      <span>Show Starting Price on Website (Currently {insuranceFormData.showPrice ? 'ON' : 'OFF - Quote on Request'})</span>
                    </label>
                  </label>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label>
                    Coverage Region / Target Countries (For all Countries) *
                    <input
                      required
                      value={insuranceFormData.targetCountries}
                      onChange={(e) => setInsuranceFormData({ ...insuranceFormData, targetCountries: e.target.value })}
                      placeholder="e.g. All 29 Schengen Countries or Worldwide (For all Countries)"
                    />
                  </label>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label>
                    Short Description *
                    <textarea
                      required
                      rows={2}
                      value={insuranceFormData.shortDesc}
                      onChange={(e) => setInsuranceFormData({ ...insuranceFormData, shortDesc: e.target.value })}
                      placeholder="Official Schengen-compliant travel medical insurance with minimum €30,000..."
                    />
                  </label>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label>
                    Key Coverage Highlights (One benefit per line) *
                    <textarea
                      required
                      rows={4}
                      value={insuranceFormData.highlights}
                      onChange={(e) => setInsuranceFormData({ ...insuranceFormData, highlights: e.target.value })}
                      placeholder="€30,000+ Emergency Medical & Hospitalization Cover&#10;Emergency Medical Repatriation & Evacuation&#10;Loss of Checked-in Baggage & Passport Protection"
                    />
                  </label>
                </div>
              </div>

              <div className="modal-footer" style={{ flexShrink: 0 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowInsuranceModal(false);
                    setEditingInsurancePlan(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingInsurancePlan ? 'Update Insurance Plan' : 'Save Insurance Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Full Enquiry Details Modal */}
      {showEnquiryDetailsModal && activeEnquiry && (
        <div className="modal-backdrop">
          <div className="modal-dialog wide" style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div className="modal-header" style={{ flexShrink: 0 }}>
              <div>
                <h3 style={{ margin: 0 }}>Enquiry Details</h3>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Reference: <strong>{activeEnquiry.reference}</strong></span>
              </div>
              <button className="modal-close" onClick={() => setShowEnquiryDetailsModal(false)}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{ overflowY: 'auto', flex: 1, minHeight: 0, padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
            <div className="modal-footer" style={{ justifyContent: 'space-between', flexShrink: 0 }}>
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
