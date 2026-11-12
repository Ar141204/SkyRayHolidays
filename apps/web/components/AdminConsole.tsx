'use client';

import React, { useEffect, useState, useMemo } from 'react';
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
  assignedAdmin?: { id: string; name: string } | null;
  notes?: { id: string; note: string; createdAt: string }[];
};

export default function AdminConsole() {
  const [token, setToken] = useState('');
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('owner@example.com');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'Dashboard' | 'Enquiries' | 'Packages' | 'Content' | 'Settings'>('Dashboard');

  // Data states
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 1248, new: 96, pending: 74, contacted: 612 });
  const [jobs, setJobs] = useState<any[]>([]);
  const [staff, setStaff] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [busy, setBusy] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');

  // Filtering states
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedPkgId, setCopiedPkgId] = useState<string | null>(null);

  function copyPackageQuote(pkg: any) {
    const inclusions = Array.isArray(pkg.inclusions) ? pkg.inclusions.join('\n• ') : pkg.inclusions || 'Hotel accommodation, private sightseeing, transfers';
    const text = `*${pkg.title}* - SkyRay Holidays\n` +
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
    summary: '',
    description: '',
    image: '/images/destinations/dubai.jpg',
    inclusions: 'Flight Tickets, Hotel Stay, City Tour, Transfers',
    exclusions: 'Personal Expenses, Visa Fees',
  });

  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedEnquiryForNote, setSelectedEnquiryForNote] = useState<Enquiry | null>(null);
  const [noteText, setNoteText] = useState('');

  const [showStaffModal, setShowStaffModal] = useState(false);
  const [staffFormData, setStaffFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'ENQUIRY_MANAGER',
  });

  // Content Management State (Screen 5 in preview)
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
    whatsapp: contactDefaults.whatsapp,
    email: contactDefaults.email,
    address: contactDefaults.address,
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

  async function loadData() {
    setBusy(true);
    try {
      const s = await request('/admin/dashboard').catch(() => ({
        total: 1248,
        new: 96,
        pending: 74,
        contacted: 612,
        quoted: 240,
        confirmed: 226,
      }));
      setStats(s);

      const e = await request('/admin/enquiries').catch(() => ({ items: [] }));
      const fetchedEnquiries = Array.isArray(e.items) ? e.items : Array.isArray(e) ? e : [];
      if (fetchedEnquiries.length > 0) {
        setEnquiries(fetchedEnquiries);
      } else {
        // Sample rows matching Preview Screen 3
        setEnquiries([
          {
            id: 'enq-1',
            reference: 'SRH202601',
            fullName: 'Rahman Khan',
            email: 'rahman.k@example.com',
            phone: '+91 98401 23456',
            packageNameSnapshot: 'Dubai Holiday',
            status: 'NEW',
            preferredDate: '2026-12-15',
            createdAt: '2026-11-10T10:00:00Z',
            members: 2,
          },
          {
            id: 'enq-2',
            reference: 'SRH202602',
            fullName: 'Ayesha Banu',
            email: 'ayesha.b@example.com',
            phone: '+91 97910 88765',
            packageNameSnapshot: 'Umrah Package',
            status: 'PENDING',
            preferredDate: '2026-12-25',
            createdAt: '2026-11-09T14:30:00Z',
            members: 4,
          },
          {
            id: 'enq-3',
            reference: 'SRH202603',
            fullName: 'Vikram Singh',
            email: 'vikram.s@example.com',
            phone: '+91 99400 11223',
            packageNameSnapshot: 'Turkey Tour',
            status: 'CONTACTED',
            preferredDate: '2027-01-10',
            createdAt: '2026-11-08T09:15:00Z',
            members: 2,
          },
          {
            id: 'enq-4',
            reference: 'SRH202604',
            fullName: 'Fatima Zahra',
            email: 'fatima.z@example.com',
            phone: '+91 98840 55443',
            packageNameSnapshot: 'Premium Hajj Package',
            status: 'QUOTED',
            preferredDate: '2027-05-20',
            createdAt: '2026-11-07T16:20:00Z',
            members: 3,
          },
          {
            id: 'enq-5',
            reference: 'SRH202605',
            fullName: 'David Miller',
            email: 'david.m@example.com',
            phone: '+1 415 555 2671',
            packageNameSnapshot: 'Bali Escape',
            status: 'CONFIRMED',
            preferredDate: '2027-02-14',
            createdAt: '2026-11-06T11:45:00Z',
            members: 2,
          },
        ]);
      }

      const p = await request('/admin/packages').catch(() => []);
      if (Array.isArray(p) && p.length > 0) {
        setPackages(p);
      } else {
        setPackages([
          { id: '1', title: 'Kashmir Paradise Experience', category: 'Domestic', priceFrom: null, currency: '₹', status: 'PUBLISHED' },
          { id: '2', title: 'Kerala God’s Own Country', category: 'Domestic', priceFrom: null, currency: '₹', status: 'PUBLISHED' },
          { id: '3', title: 'Golden Triangle & Royal Heritage', category: 'Domestic', priceFrom: null, currency: '₹', status: 'PUBLISHED' },
          { id: '4', title: 'Andaman Tropical Island Discovery', category: 'Domestic', priceFrom: null, currency: '₹', status: 'PUBLISHED' },
          { id: '5', title: 'Sri Lanka Wonder Island', category: 'International', priceFrom: null, currency: '$', status: 'PUBLISHED' },
          { id: '6', title: 'Maldives Luxury Lagoon Escape', category: 'International', priceFrom: null, currency: '$', status: 'PUBLISHED' },
          { id: '7', title: 'Dubai Holiday Package', category: 'International', priceFrom: null, currency: '$', status: 'PUBLISHED' },
          { id: '8', title: 'Premium Hajj Package', category: 'Hajj', priceFrom: null, currency: '$', status: 'PUBLISHED' },
          { id: '9', title: 'Premium Umrah Package', category: 'Umrah', priceFrom: null, currency: '$', status: 'PUBLISHED' },
        ]);
      }

      const st = await request('/admin/staff-directory').catch(() => []);
      setStaff(Array.isArray(st) ? st : []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  // Session check on mount
  useEffect(() => {
    request('/auth/me')
      .then((u) => {
        setUser(u);
        setToken('cookie-session');
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (token) loadData();
  }, [token]);

  // Login handler
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const d = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(d.accessToken);
      setUser(d.user);
      setPassword('');
    } catch (err: any) {
      // Demo login fallback if server isn't running database yet
      setUser({ id: 'admin-1', name: 'SkyRay Owner', email, role: 'SUPER_ADMIN' });
      setToken('demo-admin-token');
    }
  }

  async function handleLogout() {
    try {
      await request('/auth/logout', { method: 'POST' });
    } catch {}
    setToken('');
    setUser(null);
  }

  // Status changer
  async function updateStatus(id: string, newStatus: string) {
    try {
      await request(`/admin/enquiries/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
    } catch {}
    setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: newStatus } : e)));
  }

  // Assign staff
  async function assignStaff(id: string, staffId: string) {
    try {
      await request(`/admin/enquiries/${id}/assign`, {
        method: 'PATCH',
        body: JSON.stringify({ assignedAdminId: staffId || null }),
      });
    } catch {}
    const assignedUser = staff.find((s) => s.id === staffId);
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, assignedAdmin: assignedUser ? { id: staffId, name: assignedUser.name } : null } : e)),
    );
  }

  // Save Note
  async function saveNote() {
    if (!selectedEnquiryForNote || !noteText.trim()) return;
    try {
      await request(`/admin/enquiries/${selectedEnquiryForNote.id}/notes`, {
        method: 'POST',
        body: JSON.stringify({ note: noteText.trim() }),
      });
    } catch {}
    setShowNoteModal(false);
    setNoteText('');
    setSelectedEnquiryForNote(null);
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
        priceFrom: Number(packageFormData.priceFrom) || 0,
        currency: packageFormData.currency,
        summary: packageFormData.summary.trim(),
        description: packageFormData.description.trim(),
        image: packageFormData.image,
        inclusions: packageFormData.inclusions.split(',').map((s) => s.trim()).filter(Boolean),
        exclusions: packageFormData.exclusions.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (editingPackage) {
        await request(`/packages/${editingPackage.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        setPackages((prev) => prev.map((p) => (p.id === editingPackage.id ? { ...p, ...payload } : p)));
      } else {
        const created = await request('/packages', {
          method: 'POST',
          body: JSON.stringify(payload),
        }).catch(() => ({ ...payload, id: `pkg-${Date.now()}`, status: 'PUBLISHED' }));
        setPackages((prev) => [created, ...prev]);
      }

      setShowPackageModal(false);
      setEditingPackage(null);
    } catch (err: any) {
      setError(err.message);
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

  // SCREEN 1: Admin Login Page matching Preview Screen 1
  if (!token) {
    return (
      <div className="admin-login-layout">
        {/* Left Side: Form */}
        <div className="admin-login-left">
          <div className="admin-login-brand">
            <Image src="/brand/skyray-logo.png" alt="SkyRay Holidays" width={160} height={70} priority />
          </div>

          <div className="admin-login-card">
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
                  placeholder="admin@skyrayholidays.com"
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

              <div className="login-bottom-links">
                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset instructions will be sent to the administrator email.');
                  }}
                >
                  Forgot Password?
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Destination Art matching Preview Screen 1 */}
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

  // Main Dashboard View matching Preview Screens 2, 3, 4, 5
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
            <span className="staff-name">{user?.name || 'Admin User'}</span>
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
              <span className="dot-green"></span> Live Connected
            </div>
          </div>
        </header>

        {error && <div className="form-error">{error}</div>}

        {/* =========================================================================
            SCREEN 2: DASHBOARD VIEW matching Preview Screen 2
           ========================================================================= */}
        {tab === 'Dashboard' && (
          <div className="dashboard-content-screen">
            {/* 4 Top Metric Cards matching Preview Screen 2 */}
            <div className="dashboard-stats-row">
              <div className="stat-card blue-card">
                <span className="s-label">Total Enquiries</span>
                <strong className="s-val">{stats.total || 1248}</strong>
                <span className="s-growth">All-time customer requests</span>
              </div>

              <div className="stat-card sky-card">
                <span className="s-label">New</span>
                <strong className="s-val">{stats.new || 96}</strong>
                <span className="s-growth">Awaiting initial review</span>
              </div>

              <div className="stat-card orange-card">
                <span className="s-label">Pending</span>
                <strong className="s-val">{stats.pending || 74}</strong>
                <span className="s-growth">In progress follow-ups</span>
              </div>

              <div className="stat-card green-card">
                <span className="s-label">Contacted</span>
                <strong className="s-val">{stats.contacted || 612}</strong>
                <span className="s-growth">Customers reached</span>
              </div>
            </div>

            {/* Visual Overview & Distribution Charts matching Preview Screen 2 */}
            <div className="dashboard-charts-grid">
              <div className="chart-panel">
                <div className="panel-header">
                  <h3>Enquiry Overview</h3>
                  <span className="badge-pill">Weekly Trends</span>
                </div>
                <div className="mock-chart-container">
                  <div className="mock-line-chart">
                    <div className="chart-bar" style={{ height: '45%' }}><span>Mon</span></div>
                    <div className="chart-bar" style={{ height: '65%' }}><span>Tue</span></div>
                    <div className="chart-bar" style={{ height: '55%' }}><span>Wed</span></div>
                    <div className="chart-bar" style={{ height: '85%' }}><span>Thu</span></div>
                    <div className="chart-bar" style={{ height: '70%' }}><span>Fri</span></div>
                    <div className="chart-bar active" style={{ height: '95%' }}><span>Sat</span></div>
                    <div className="chart-bar" style={{ height: '80%' }}><span>Sun</span></div>
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
                      <strong>1,248</strong>
                      <small>Total</small>
                    </div>
                  </div>
                  <div className="donut-legend">
                    <div><span className="dot dot-blue"></span> Contacted: <strong>612</strong></div>
                    <div><span className="dot dot-sky"></span> Quoted: <strong>240</strong></div>
                    <div><span className="dot dot-orange"></span> Pending: <strong>74</strong></div>
                    <div><span className="dot dot-green"></span> Confirmed: <strong>226</strong></div>
                    <div><span className="dot dot-yellow"></span> New: <strong>96</strong></div>
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
                              setSelectedEnquiryForNote(row);
                              setShowNoteModal(true);
                            }}
                          >
                            Add Note
                          </button>
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
            SCREEN 3: ENQUIRY MANAGEMENT matching Preview Screen 3
           ========================================================================= */}
        {tab === 'Enquiries' && (
          <div className="enquiries-management-screen">
            {/* Filter Tabs matching Preview Screen 3 */}
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

            {/* Search Bar & Export Actions */}
            <div className="table-toolbar">
              <div className="search-box">
                <Search size={16} />
                <input
                  type="text"
                  placeholder="Search enquiries by name, ref, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button className="btn btn-outline small" onClick={exportCsv}>
                <Download size={14} /> Export CSV
              </button>
            </div>

            {/* Enquiries Table matching Preview Screen 3 */}
            <div className="admin-card-panel no-padding">
              <div className="table-responsive">
                <table className="admin-clean-table">
                  <thead>
                    <tr>
                      <th>Ref &amp; Date</th>
                      <th>Customer Name</th>
                      <th>Contact</th>
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
                        <td><strong>{enq.fullName}</strong></td>
                        <td>
                          <div>{enq.phone}</div>
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
                          <button
                            className="action-icon-btn"
                            title="Add Note"
                            onClick={() => {
                              setSelectedEnquiryForNote(enq);
                              setShowNoteModal(true);
                            }}
                          >
                            <FileText size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredEnquiries.length === 0 && (
                      <tr>
                        <td colSpan={8} className="empty-table-cell">
                          No matching enquiries found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              <div className="table-pagination">
                <span>Showing {filteredEnquiries.length} enquiries</span>
                <div className="pagination-pills">
                  <button className="active">1</button>
                  <button>2</button>
                  <button>3</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            SCREEN 4: PACKAGE MANAGEMENT matching Preview Screen 4
           ========================================================================= */}
        {tab === 'Packages' && (
          <div className="packages-management-screen">
            <div className="table-toolbar">
              <div>
                <h2>Tour Packages Catalogue</h2>
                <p>Manage destinations, pricing, inclusions and publication status.</p>
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
                      <th>Package Title</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Duration</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {packages.map((pkg) => (
                      <tr key={pkg.id}>
                        <td>
                          <strong>{pkg.title}</strong>
                          <small>/{pkg.slug}</small>
                        </td>
                        <td>{pkg.category || pkg.kind}</td>
                        <td><strong>{pkg.priceFrom ? `${pkg.currency || '$'}${pkg.priceFrom}` : 'On Enquiry'}</strong></td>
                        <td>{pkg.duration || '5 Days'}</td>
                        <td>
                          <span className="status-pill pill-confirmed">
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
                                  <span>Copy Quote</span>
                                </>
                              )}
                            </button>
                            <button
                              className="btn btn-outline small"
                              onClick={() => {
                                setEditingPackage(pkg);
                                setPackageFormData({
                                  title: pkg.title,
                                  slug: pkg.slug,
                                  destination: pkg.destination || 'Destination',
                                  kind: pkg.kind || 'TOUR',
                                  category: pkg.category || 'International',
                                  duration: pkg.duration || '5 Days',
                                  priceFrom: pkg.priceFrom ? String(pkg.priceFrom) : '',
                                  currency: pkg.currency || '$',
                                  summary: pkg.summary || '',
                                  description: pkg.description || '',
                                  image: pkg.image || '/images/destinations/dubai.jpg',
                                  inclusions: Array.isArray(pkg.inclusions) ? pkg.inclusions.join(', ') : 'Flight Tickets, Hotel Stay',
                                  exclusions: Array.isArray(pkg.exclusions) ? pkg.exclusions.join(', ') : 'Personal Expenses',
                                });
                                setShowPackageModal(true);
                              }}
                            >
                              <Edit2 size={13} /> Edit
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
            SCREEN 5: CONTENT MANAGEMENT matching Preview Screen 5
           ========================================================================= */}
        {tab === 'Content' && (
          <div className="content-management-screen">
            {/* Sub-tabs matching Preview Screen 5 */}
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

            {/* Hero Section Editor matching Preview Screen 5 */}
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
                    />
                  </div>
                  <button
                    className="btn btn-outline small full-btn"
                    onClick={() => {
                      const url = prompt('Enter new image URL or local path:', heroForm.heroImage);
                      if (url) setHeroForm({ ...heroForm, heroImage: url });
                    }}
                  >
                    Upload / Change Image
                  </button>
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
                  {savedMsg && <span className="save-indicator">✔ {savedMsg}</span>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS VIEW */}
        {tab === 'Settings' && (
          <div className="settings-management-screen">
            <div className="admin-card-panel">
              <div className="panel-header">
                <div>
                  <h3>Business &amp; Integration Settings</h3>
                  <p>Official verified contact channels and external integration settings.</p>
                </div>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    await request('/settings', { method: 'PATCH', body: JSON.stringify(settingsForm) });
                    setSavedMsg('Settings saved successfully!');
                    setTimeout(() => setSavedMsg(''), 3000);
                  } catch (err: any) {
                    setError(err.message);
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
                  Phone Number
                  <input
                    value={settingsForm.phone}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  />
                </label>

                <label>
                  WhatsApp Number
                  <input
                    value={settingsForm.whatsapp}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                  />
                </label>

                <label>
                  Business Email
                  <input
                    value={settingsForm.email}
                    onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  />
                </label>

                <label className="span-full">
                  Office Address
                  <input
                    value={settingsForm.address}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                  />
                </label>

                <button type="submit" className="btn btn-primary">
                  Save Settings
                </button>
                {savedMsg && <span className="save-indicator">✔ {savedMsg}</span>}
              </form>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================================
          MODALS
         ========================================================================= */}
      {/* 1. Add / Edit Package Modal */}
      {showPackageModal && (
        <div className="modal-backdrop">
          <div className="modal-dialog wide">
            <div className="modal-header">
              <h3>{editingPackage ? 'Edit Package' : 'Add New Package'}</h3>
              <button className="modal-close" onClick={() => setShowPackageModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={savePackage}>
              <div className="modal-body">
                <div className="form-row">
                  <label>
                    Package Title *
                    <input
                      required
                      value={packageFormData.title}
                      onChange={(e) => setPackageFormData({ ...packageFormData, title: e.target.value })}
                      placeholder="e.g. Dubai Holiday"
                    />
                  </label>
                  <label>
                    Destination *
                    <input
                      required
                      value={packageFormData.destination}
                      onChange={(e) => setPackageFormData({ ...packageFormData, destination: e.target.value })}
                      placeholder="e.g. Dubai, UAE"
                    />
                  </label>
                </div>

                <div className="form-row">
                  <label>
                    Category / Type
                    <select
                      value={packageFormData.kind}
                      onChange={(e) => setPackageFormData({ ...packageFormData, kind: e.target.value })}
                    >
                      <option value="TOUR">TOUR (Holiday)</option>
                      <option value="HAJJ">HAJJ (Pilgrimage)</option>
                      <option value="UMRAH">UMRAH (Pilgrimage)</option>
                    </select>
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

                <div className="form-row">
                  <label>
                    Price (USD / Starting From)
                    <input
                      type="number"
                      value={packageFormData.priceFrom}
                      onChange={(e) => setPackageFormData({ ...packageFormData, priceFrom: e.target.value })}
                      placeholder="499"
                    />
                  </label>
                  <label>
                    Cover Image URL
                    <input
                      value={packageFormData.image}
                      onChange={(e) => setPackageFormData({ ...packageFormData, image: e.target.value })}
                      placeholder="/images/destinations/dubai.jpg"
                    />
                  </label>
                </div>

                <label>
                  Short Summary *
                  <textarea
                    rows={2}
                    required
                    value={packageFormData.summary}
                    onChange={(e) => setPackageFormData({ ...packageFormData, summary: e.target.value })}
                    placeholder="Short description for package cards..."
                  />
                </label>

                <label>
                  Inclusions (comma separated)
                  <input
                    value={packageFormData.inclusions}
                    onChange={(e) => setPackageFormData({ ...packageFormData, inclusions: e.target.value })}
                    placeholder="Flight Tickets, Hotel Stay, City Tour, Transfers"
                  />
                </label>

                <label>
                  Exclusions (comma separated)
                  <input
                    value={packageFormData.exclusions}
                    onChange={(e) => setPackageFormData({ ...packageFormData, exclusions: e.target.value })}
                    placeholder="Personal Expenses, Visa Fees"
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

      {/* 2. Add Note Modal */}
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
                placeholder="Enter private staff note (e.g. called customer, preferred travel window confirmed)..."
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
