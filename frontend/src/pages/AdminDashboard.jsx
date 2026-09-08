import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import {
  MapPin, Users, MessageSquare, FileText, BarChart3, Settings, LogOut,
  Bell, Search, TrendingUp, AlertCircle, CheckCircle2, Clock, Menu, X,
  Plus, Edit, Trash2, Eye, Building2, Home, Target, BookOpen,
  CheckCircle, XCircle, Download, Calendar, Filter, ChevronLeft, ChevronRight,
  UserPlus, Archive
} from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { AcademicSetup } from "../components/admin/AcademicSetup";
import { SectionManagement } from "./SectionManagement";
import { useAuth } from "../contexts/AuthContext";

export function AdminDashboard() {
  const { user, isLoggedIn, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [faqs, setFAQs] = useState([]);
  const [users, setUsers] = useState([]);
  const [buildings, setBuildings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [showFAQForm, setShowFAQForm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // Auth guard — wait for auth to finish loading first
  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn || user?.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchDashboardData();
  }, [authLoading, isLoggedIn, user, navigate]);

  async function fetchDashboardData() {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const [statsRes, faqsRes, usersRes, buildingsRes] = await Promise.all([
        fetch("http://localhost:3000/api/admin/stats", { headers }),
        fetch("http://localhost:3000/api/admin/faqs", { headers }),
        fetch("http://localhost:3000/api/admin/users", { headers }),
        fetch("http://localhost:3000/api/buildings", { headers })
      ]);

      if (statsRes.status === 401 || statsRes.status === 403) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const [statsData, faqsData, usersData, buildingsData] = await Promise.all([
        statsRes.json(),
        faqsRes.json(),
        usersRes.json(),
        buildingsRes.json()
      ]);

      setStats(statsData.stats);
      setFAQs(faqsData);
      setUsers(usersData);
      setBuildings(buildingsData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateFAQ(faqData) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/admin/faqs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(faqData)
      });

      if (response.ok) {
        fetchDashboardData();
        setShowFAQForm(false);
      }
    } catch (error) {
      console.error("Error creating FAQ:", error);
    }
  }

  async function handleUpdateFAQ(id, faqData) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/admin/faqs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(faqData)
      });

      if (response.ok) {
        fetchDashboardData();
        setEditingFAQ(null);
      }
    } catch (error) {
      console.error("Error updating FAQ:", error);
    }
  }

  async function handleDeleteFAQ(id) {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:3000/api/admin/faqs/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchDashboardData();
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  }

  const menuItems = [
    { id: "dashboard",  label: "Dashboard",          icon: BarChart3  },
    { id: "enrollments",label: "Enrollments",         icon: FileText   },
    { id: "sections",   label: "Section Management",  icon: Users      },
    { id: "academic",   label: "Academic Setup",      icon: BookOpen   },
    { id: "archives",   label: "Archives",            icon: Archive    },
    { id: "faqs",       label: "Manage FAQs",         icon: MessageSquare },
    { id: "users",      label: "Manage Users",        icon: Users      },
    { id: "buildings",  label: "Manage Buildings",    icon: Building2  },
    { id: "settings",   label: "Settings",            icon: Settings   },
  ];

  // Wait for auth context to initialize before rendering
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF0] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#F5C400] border-t-transparent rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF0] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F5C400] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF0] flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#001840] text-white transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="p-6 border-b border-[#102A71]">
            <div className="flex items-center gap-3">
              <div className="bg-[#F5C400] w-10 h-10 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-[#001840]" />
              </div>
              <div>
                <h1 className="font-bold text-lg">GabAI Admin</h1>
                <p className="text-xs text-[#FFDC5F]">Eastern Mindoro College</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? "bg-[#F5C400] text-[#001840]"
                      : "text-[#FFFDF0] hover:bg-[#102A71]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[#102A71]">
            <Link
              to="/"
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#FFFDF0] hover:bg-[#102A71] transition-colors"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Back to Site</span>
            </Link>
            <button
              onClick={async () => {
                try {
                  await fetch("http://localhost:3000/api/auth/logout", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                } catch (error) {
                  console.error("Logout error:", error);
                }
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-900/20 transition-colors mt-1"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <h2 className="text-xl font-bold text-gray-900">
                {menuItems.find((m) => m.id === activeTab)?.label}
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 bg-[#001840] rounded-full flex items-center justify-center text-white font-semibold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8">
          {activeTab === "dashboard" && <DashboardView stats={stats} />}
          {activeTab === "faqs" && (
            <FAQsView
              faqs={faqs}
              onDelete={handleDeleteFAQ}
              onEdit={setEditingFAQ}
              onAdd={() => setShowFAQForm(true)}
              editingFAQ={editingFAQ}
              showForm={showFAQForm}
              onSave={editingFAQ ? handleUpdateFAQ : handleCreateFAQ}
              onCancel={() => {
                setEditingFAQ(null);
                setShowFAQForm(false);
              }}
            />
          )}
          {activeTab === "users" && <UsersView users={users} />}
          {activeTab === "enrollments" && <EnrollmentsView />}
          {activeTab === "sections" && <SectionManagement />}
          {activeTab === "buildings" && <BuildingsView buildings={buildings} onRefresh={fetchDashboardData} />}
          {activeTab === "academic" && <AcademicSetup />}
          {activeTab === "archives" && <ArchivesView />}
          {activeTab === "settings" && <SettingsView />}
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

// ── Status config ─────────────────────────────────────────────────────────────
const ADMIN_STATUS_CFG = {
  draft:             { label: 'Draft',             color: 'bg-gray-100 text-gray-700' },
  submitted:         { label: 'Submitted',          color: 'bg-blue-100 text-blue-700' },
  pending_exam:      { label: 'Pending Exam',       color: 'bg-yellow-100 text-yellow-700' },
  returned:          { label: 'Returned',           color: 'bg-orange-100 text-orange-700' },
  approved:          { label: 'Enrolled',           color: 'bg-emerald-100 text-emerald-700' },
  subjects_enrolled: { label: 'Enrolled',           color: 'bg-emerald-100 text-emerald-700' },
  enrolled:          { label: 'Enrolled',           color: 'bg-emerald-100 text-emerald-700' },
  rejected:          { label: 'Rejected',           color: 'bg-red-100 text-red-700' },
};

function AdminStatusBadge({ status }) {
  const c = ADMIN_STATUS_CFG[status] || { label: status, color: 'bg-gray-100 text-gray-600' };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>;
}

// ── Enrollments View ──────────────────────────────────────────────────────────
const ENROLL_PAGE_SIZE = 10;

function EnrollmentsView() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState(''); // '' = active year
  const [schoolYears, setSchoolYears] = useState([]);
  const [activeYear, setActiveYear] = useState('');
  const [page, setPage] = useState(1);

  const tok = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });

  // Load school years once
  useEffect(() => {
    fetch('http://localhost:3000/api/academic/school-years')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setSchoolYears(data);
          const active = data.find(sy => sy.isActive);
          if (active) setActiveYear(active.year);
        }
      })
      .catch(() => {});
  }, []);

  async function loadEnrollments() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (yearFilter) params.set('academicYear', yearFilter);
      const res = await fetch(`http://localhost:3000/api/admin/enrollments?${params}`, { headers: tok() });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setEnrollments(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadEnrollments(); }, [yearFilter]);

  const filtered = enrollments.filter(e => {
    const matchSearch = !search ||
      `${e.firstName} ${e.familyName}`.toLowerCase().includes(search.toLowerCase()) ||
      (e.studentNumber || '').includes(search) ||
      (e.course || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || 
      (statusFilter === 'enrolled' 
        ? ['approved','subjects_enrolled','enrolled'].includes(e.status)
        : e.status === statusFilter);
    const matchLevel = levelFilter === 'all' || e.educationLevel === levelFilter;
    return matchSearch && matchStatus && matchLevel;
  });

  const totalPages = Math.ceil(filtered.length / ENROLL_PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * ENROLL_PAGE_SIZE, page * ENROLL_PAGE_SIZE);

  const counts = {
    total: enrollments.length,
    enrolled: enrollments.filter(e => ['approved','subjects_enrolled','enrolled'].includes(e.status)).length,
    submitted: enrollments.filter(e => e.status === 'submitted').length,
    rejected: enrollments.filter(e => e.status === 'rejected').length,
  };

  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: counts.total, color: 'bg-[#001840] text-white' },
          { label: 'Enrolled', value: counts.enrolled, color: 'bg-green-600 text-white' },
          { label: 'Submitted', value: counts.submitted, color: 'bg-blue-600 text-white' },
          { label: 'Rejected', value: counts.rejected, color: 'bg-red-600 text-white' },
        ].map(c => (
          <div key={c.label} className={`${c.color} rounded-xl p-4`}>
            <p className="text-2xl font-bold">{c.value}</p>
            <p className="text-xs opacity-80 mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      {/* Active year indicator */}
      {activeYear && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
          Showing: <span className="font-semibold text-[#001840]">
            {yearFilter === 'all' ? 'All School Years' : yearFilter || activeYear}
          </span>
          {!yearFilter && <span className="text-gray-400">(active year)</span>}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, student #..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 focus:border-[#001840]" />
        </div>
        {/* School Year filter */}
        <select value={yearFilter} onChange={e => { setYearFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 appearance-none bg-white">
          <option value="">Current Year</option>
          <option value="all">All Years</option>
          {schoolYears.map(sy => (
            <option key={sy.id} value={sy.year}>{sy.year}</option>
          ))}
        </select>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 appearance-none bg-white">
          <option value="all">All Statuses</option>
          <option value="submitted">Submitted</option>
          <option value="pending_exam">Pending Exam</option>
          <option value="enrolled">Enrolled</option>
          <option value="returned">Returned</option>
          <option value="rejected">Rejected</option>
        </select>
        <select value={levelFilter} onChange={e => { setLevelFilter(e.target.value); setPage(1); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 appearance-none bg-white">
          <option value="all">All Levels</option>
          <option value="JHS">JHS</option>
          <option value="SHS">SHS</option>
        </select>
        <button onClick={loadEnrollments} className="px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors text-gray-600">
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-[#001840] rounded-full animate-spin" />
            Loading enrollments...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <FileText size={36} className="mb-3 opacity-40" />
            <p className="text-sm">No enrollments found</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Student</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Level / Course</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map(e => (
                    <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-800">{e.firstName} {e.familyName}</p>
                        <p className="text-xs text-gray-400">{e.studentNumber || `#${e.id}`}</p>
                        {e.sscApplied == 1 && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded-full mt-0.5 inline-block">SSC Applicant</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-gray-700">
                          {`${e.educationLevel} ${e.gradeLevel || ''}`}
                        </p>
                        {e.strand && <p className="text-xs text-gray-400">{e.strand}</p>}
                      </td>
                      <td className="px-5 py-3">
                        {e.enrollmentType ? (
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            e.enrollmentType === 'new' ? 'bg-blue-100 text-blue-700' :
                            e.enrollmentType === 'old' ? 'bg-green-100 text-green-700' :
                            'bg-purple-100 text-purple-700'
                          }`}>{e.enrollmentType}</span>
                        ) : <span className="text-xs text-gray-400">—</span>}
                      </td>
                      <td className="px-5 py-3"><AdminStatusBadge status={e.status} /></td>
                      <td className="px-5 py-3 text-xs text-gray-400">
                        {e.createdAt ? new Date(e.createdAt).toLocaleDateString() : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <button onClick={() => navigate(`/enrollment/${e.id}`, { state: { fromAdmin: true } })}
                          className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors" title="View">
                          <Eye size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50 bg-gray-50/30">
                <p className="text-xs text-gray-400">
                  Showing {(page - 1) * ENROLL_PAGE_SIZE + 1}–{Math.min(page * ENROLL_PAGE_SIZE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="p-1.5 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition-colors">
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 text-xs rounded-lg transition-colors ${p === page ? 'bg-[#001840] text-white font-semibold' : 'border border-gray-200 hover:bg-white text-gray-600'}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="p-1.5 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition-colors">
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function DashboardView({ stats }) {
  const [enrollStats, setEnrollStats] = useState(null);
  const [recentEnrollments, setRecentEnrollments] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:3000/api/admin/enrollments/stats", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (d) {
          setEnrollStats(d.summary);
          setRecentEnrollments(d.recentEnrollments || []);
        }
      })
      .catch(() => {});
  }, []);

  const topCards = [
    { label: "Total Enrollments", value: enrollStats?.total ?? 0, color: "bg-[#001840]", icon: FileText },
    { label: "Pending Review", value: (enrollStats?.submitted ?? 0) + (enrollStats?.pending_exam ?? 0), color: "bg-blue-600", icon: Clock },
    { label: "Enrolled", value: enrollStats?.enrolled ?? 0, color: "bg-emerald-600", icon: CheckCircle2 },
    { label: "Rejected", value: enrollStats?.rejected ?? 0, color: "bg-red-500", icon: AlertCircle },
  ];

  const statusData = enrollStats ? [
    { label: "Submitted", value: enrollStats.submitted ?? 0, color: "bg-blue-500" },
    { label: "Pending Exam", value: enrollStats.pending_exam ?? 0, color: "bg-yellow-500" },
    { label: "Enrolled", value: enrollStats.enrolled ?? 0, color: "bg-emerald-600" },
    { label: "Rejected", value: enrollStats.rejected ?? 0, color: "bg-red-500" },
  ] : [];

  const levelData = enrollStats ? [
    { label: "JHS", value: enrollStats.jhs ?? 0, color: "bg-indigo-500" },
    { label: "SHS", value: enrollStats.shs ?? 0, color: "bg-purple-500" },
  ] : [];

  const maxStatus = Math.max(...statusData.map(d => d.value), 1);
  const maxLevel = Math.max(...levelData.map(d => d.value), 1);

  const systemCards = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "bg-blue-500" },
    { label: "Active FAQs", value: stats?.totalFAQs ?? 0, icon: MessageSquare, color: "bg-green-500" },
    { label: "Buildings", value: stats?.totalBuildings ?? 0, icon: Building2, color: "bg-purple-500" },
    { label: "Total Chats", value: stats?.totalChats ?? 0, icon: BarChart3, color: "bg-orange-500" },
  ];

  return (
    <div className="space-y-6">
      {/* Enrollment Stats Cards */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Enrollment Overview</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topCards.map(card => {
            const Icon = card.icon;
            return (
              <div key={card.label} className={`${card.color} rounded-2xl p-5 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium opacity-80 mb-1">{card.label}</p>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </div>
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Enrollment by Status */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Enrollments by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {statusData.map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="font-bold text-gray-900">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div
                      className={`${item.color} h-2.5 rounded-full transition-all duration-700`}
                      style={{ width: `${Math.round((item.value / maxStatus) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
              {statusData.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No enrollment data yet</p>}
            </div>
          </CardContent>
        </Card>

        {/* Enrollment by Level */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Enrollments by Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {levelData.map(item => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-600 font-medium">{item.label}</span>
                    <span className="font-bold text-gray-900">{item.value}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-4">
                    <div
                      className={`${item.color} h-4 rounded-full transition-all duration-700 flex items-center justify-end pr-2`}
                      style={{ width: `${Math.max(Math.round((item.value / maxLevel) * 100), item.value > 0 ? 8 : 0)}%` }}
                    >
                      {item.value > 0 && <span className="text-white text-xs font-bold">{Math.round((item.value / maxLevel) * 100)}%</span>}
                    </div>
                  </div>
                </div>
              ))}
              {levelData.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No enrollment data yet</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Stats */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">System Overview</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemCards.map(card => {
            const Icon = card.icon;
            return (
              <Card key={card.label}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    </div>
                    <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader><CardTitle className="text-base">System Status</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: "Database Connection", status: "Active" },
              { label: "API Services", status: "Running" },
              { label: "Email Service", status: "Active" },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">{item.label}</span>
                </div>
                <Badge className="bg-green-600 text-xs">{item.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FAQsView({ faqs, onDelete, onEdit, onAdd, editingFAQ, showForm, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "Requirements",
    keywords: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    if (editingFAQ) {
      setFormData({
        question: editingFAQ.question,
        answer: editingFAQ.answer,
        category: editingFAQ.category,
        keywords: JSON.parse(editingFAQ.keywords || '[]').join(', ')
      });
    } else {
      setFormData({ question: "", answer: "", category: "Requirements", keywords: "" });
    }
  }, [editingFAQ]);

  // Filter FAQs based on search query
  const filteredFAQs = faqs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFAQs = filteredFAQs.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      ...formData,
      keywords: JSON.stringify(formData.keywords.split(',').map(k => k.trim()).filter(k => k))
    };
    
    if (editingFAQ) {
      onSave(editingFAQ.id, data);
    } else {
      onSave(data);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div></div>
        <Button onClick={onAdd} className="bg-[#001840] hover:bg-[#102A71]">
          <Plus className="w-4 h-4 mr-2" />
          Add New FAQ
        </Button>
      </div>

      {/* Search Bar */}
      {!showForm && !editingFAQ && (
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search FAQs by question, answer, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          <div className="text-sm text-gray-600 whitespace-nowrap">
            {filteredFAQs.length} of {faqs.length} FAQs
          </div>
        </div>
      )}

      {(showForm || editingFAQ) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingFAQ ? "Edit FAQ" : "Create New FAQ"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Question</label>
                <Input
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="What are the admission requirements?"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
                <textarea
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  placeholder="Provide a detailed answer..."
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5C400] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5C400] focus:border-transparent"
                >
                  <option>Requirements</option>
                  <option>Deadlines</option>
                  <option>Programs</option>
                  <option>Enrollment</option>
                  <option>Location</option>
                  <option>Fees</option>
                  <option>Financial Aid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keywords (comma-separated)
                </label>
                <Input
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  placeholder="admission, requirements, documents"
                  required
                />
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="bg-[#001840] hover:bg-[#102A71]">
                  {editingFAQ ? "Update FAQ" : "Create FAQ"}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {currentFAQs.length > 0 ? (
        <>
          <div className="grid gap-4">
            {currentFAQs.map((faq) => (
              <Card key={faq.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>{faq.category}</Badge>
                        <span className="text-xs text-gray-500">
                          {faq.views} views • {faq.helpful} helpful
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mb-2">{faq.question}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{faq.answer}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(faq)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit FAQ"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() => onDelete(faq.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 pt-6">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredFAQs.length)} of {filteredFAQs.length} FAQs
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                            currentPage === page
                              ? "bg-[#001840] text-white"
                              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchQuery ? "No FAQs found" : "No FAQs yet"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery
                ? "Try adjusting your search query"
                : "Get started by creating your first FAQ"}
            </p>
            {!searchQuery && (
              <Button onClick={onAdd} className="bg-[#001840] hover:bg-[#102A71]">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First FAQ
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ── Archives View ─────────────────────────────────────────────────────────────
function ArchivesView() {
  const [schoolYears, setSchoolYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [archiveData, setArchiveData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const tok = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });

  useEffect(() => {
    fetch('http://localhost:3000/api/academic/school-years')
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          // Only show past (non-active) school years
          const past = data.filter(sy => !sy.isActive);
          setSchoolYears(past);
          if (past.length > 0) setSelectedYear(past[0].year);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedYear) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch(`http://localhost:3000/api/admin/archive/${encodeURIComponent(selectedYear)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => setArchiveData(data))
      .catch(() => setArchiveData(null))
      .finally(() => setLoading(false));
  }, [selectedYear]);

  const filtered = (archiveData?.enrollments || []).filter(e =>
    !search ||
    `${e.firstName} ${e.familyName}`.toLowerCase().includes(search.toLowerCase()) ||
    (e.studentNumber || '').includes(search) ||
    (e.gradeLevel || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#001840]">Enrollment Archives</h2>
          <p className="text-sm text-gray-500 mt-0.5">Read-only view of past school year enrollment data</p>
        </div>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#001840]/20 bg-white text-[#001840]">
          {schoolYears.length === 0 && <option value="">No past school years</option>}
          {schoolYears.map(sy => (
            <option key={sy.id} value={sy.year}>{sy.year}</option>
          ))}
        </select>
      </div>

      {schoolYears.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">
          <Archive size={40} className="mx-auto mb-4 text-gray-300" />
          <p className="text-sm font-medium text-gray-500">No archived school years yet</p>
          <p className="text-xs text-gray-400 mt-1">Archives appear here after a school year is closed and a new one is set as active.</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-20 gap-2 text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-gray-300 border-t-[#001840] rounded-full animate-spin" />
          Loading archive...
        </div>
      ) : archiveData ? (
        <>
          {/* Summary cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { label: 'Total', value: archiveData.summary.total, color: 'bg-[#001840] text-white' },
              { label: 'Enrolled', value: archiveData.summary.enrolled, color: 'bg-emerald-600 text-white' },
              { label: 'Completed', value: archiveData.summary.completed, color: 'bg-green-500 text-white' },
              { label: 'Rejected', value: archiveData.summary.rejected, color: 'bg-red-500 text-white' },
              { label: 'JHS', value: archiveData.summary.jhs, color: 'bg-indigo-500 text-white' },
              { label: 'SHS', value: archiveData.summary.shs, color: 'bg-purple-500 text-white' },
            ].map(c => (
              <div key={c.label} className={`${c.color} rounded-xl p-4`}>
                <p className="text-2xl font-bold">{c.value}</p>
                <p className="text-xs opacity-80 mt-0.5">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by name, student ID, grade level..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 focus:border-[#001840]" />
            </div>
          </div>

          {/* Enrollment Table — read only */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-16 text-center">
                <FileText size={32} className="mx-auto mb-3 text-gray-300" />
                <p className="text-sm text-gray-400">No records found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Student', 'Student ID', 'Level / Grade', 'Strand', 'Section', 'Status', 'Enrolled Date'].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(e => (
                      <tr key={e.id} className="hover:bg-gray-50/50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#001840]">{e.firstName} {e.familyName}</p>
                          <p className="text-xs text-gray-400">{e.user_email}</p>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-gray-600">{e.studentNumber || '—'}</td>
                        <td className="px-4 py-3 text-gray-700">{e.educationLevel} {e.gradeLevel ? `· ${e.gradeLevel}` : ''}</td>
                        <td className="px-4 py-3">
                          {e.strand
                            ? <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{e.strand}</span>
                            : <span className="text-gray-300">—</span>}
                        </td>
                        <td className="px-4 py-3 text-gray-600">{e.sectionName || '—'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                            e.status === 'completed' ? 'bg-green-100 text-green-700' :
                            e.status === 'enrolled'  ? 'bg-emerald-100 text-emerald-700' :
                            e.status === 'rejected'  ? 'bg-red-100 text-red-600' :
                            'bg-gray-100 text-gray-600'
                          }`}>{e.status}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-400">
                          {e.approved_at ? new Date(e.approved_at).toLocaleDateString() : e.createdAt ? new Date(e.createdAt).toLocaleDateString() : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-4 py-3 border-t border-gray-50 bg-gray-50/30 text-xs text-gray-400">
                  {filtered.length} record{filtered.length !== 1 ? 's' : ''} · School Year {selectedYear} · Read-only archive
                </div>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}

// ── Create Staff User Modal ───────────────────────────────────────────────────
function CreateUserModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'teacher', department: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/admin/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create user');
      toast.success(`${form.role.charAt(0).toUpperCase() + form.role.slice(1)} account created successfully`);
      onCreated(data.user);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-[#001840]">Create Staff Account</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Role */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Role</label>
            <div className="flex gap-3">
              {['teacher', 'registrar'].map(r => (
                <button key={r} type="button" onClick={() => set('role', r)}
                  className={`flex-1 py-2 rounded-xl border-2 text-sm font-semibold capitalize transition-all ${
                    form.role === r ? 'border-[#001840] bg-[#EEF2FF] text-[#001840]' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}>
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Full Name <span className="text-red-500">*</span></label>
            <input value={form.name} onChange={e => set('name', e.target.value)}
              placeholder="e.g. Maria Santos"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.name ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#001840]/20 focus:border-[#001840]'}`} />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Email <span className="text-red-500">*</span></label>
            <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
              placeholder="teacher@emc.edu.ph"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.email ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#001840]/20 focus:border-[#001840]'}`} />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
          </div>

          {/* Department (optional) */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Department <span className="text-gray-400 font-normal">(optional)</span></label>
            <input value={form.department} onChange={e => set('department', e.target.value)}
              placeholder="e.g. JHS Department"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 focus:border-[#001840]" />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Password <span className="text-red-500">*</span></label>
            <input type="password" value={form.password} onChange={e => set('password', e.target.value)}
              placeholder="Min. 8 characters"
              className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 ${errors.password ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-[#001840]/20 focus:border-[#001840]'}`} />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            <p className="text-xs text-gray-400 mt-1">Share this password with the staff member. They can change it after logging in.</p>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex-1 px-4 py-2.5 bg-[#001840] text-white rounded-xl text-sm font-semibold hover:bg-[#102A71] transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
              {loading ? 'Creating...' : <><UserPlus className="w-4 h-4" /> Create Account</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UsersView({ users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const PAGE_SIZE = 10;

  async function handleDeleteUser(userId, userName) {
    setDeleting(userId);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete user');
      setUsers(prev => prev.filter(u => u.id !== userId));
      toast.success(`User "${userName}" removed successfully`);
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setDeleting(null);
      setConfirmDelete(null);
    }
  }

  async function handleUserCreated(newUser) {
    setUsers(prev => [newUser, ...prev]);
    setShowCreateModal(false);
  }

  const filtered = users.filter(u =>
    !search ||
    (u.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (u.role || '').toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#001840] text-white rounded-lg text-sm font-semibold hover:bg-[#102A71] transition-colors"
        >
          <UserPlus className="w-4 h-4" /> Create Staff Account
        </button>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users..."
            className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 focus:border-[#001840]" />
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleUserCreated}
        />
      )}

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginated.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">No users found</td></tr>
                ) : paginated.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <Badge className={
                        user.role === 'admin' ? 'bg-purple-600' :
                        user.role === 'registrar' ? 'bg-blue-600' :
                        user.role === 'teacher' ? 'bg-green-600' : 'bg-gray-600'
                      }>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Badge className={user.isActive !== false ? 'bg-green-600' : 'bg-red-600'}>
                        {user.isActive !== false ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {(user.role === 'student' || user.role === 'user' || user.role === 'teacher') ? (
                        <button
                          onClick={() => setConfirmDelete(user)}
                          disabled={deleting === user.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 bg-gray-50/30">
              <p className="text-xs text-gray-400">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition-colors">
                  <ChevronLeft size={14} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs rounded-lg transition-colors ${p === page ? 'bg-[#001840] text-white font-semibold' : 'border border-gray-200 hover:bg-white text-gray-600'}`}>
                    {p}
                  </button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="p-1.5 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition-colors">
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confirm Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Remove User?</h3>
            <p className="text-sm text-gray-600 mb-1">You are about to remove:</p>
            <p className="font-semibold text-[#001840]">{confirmDelete.name}</p>
            <p className="text-xs text-gray-400 mb-4">{confirmDelete.email}</p>
            <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2 mb-5">
              This will also delete all their enrollments and documents. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteUser(confirmDelete.id, confirmDelete.name)}
                disabled={deleting === confirmDelete.id}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 disabled:opacity-60"
              >
                {deleting === confirmDelete.id ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Aerial Photo Pin Picker ───────────────────────────────────────────────────
function AerialPinPicker({ position, onPositionChange, onClose }) {
  const [localPos, setLocalPos] = useState(position || null);
  const imgRef = useRef(null);

  function handleImageClick(e) {
    e.stopPropagation();
    const rect = imgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLocalPos({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });
  }

  function handleConfirm(e) {
    e.stopPropagation();
    if (localPos) { onPositionChange(localPos); onClose(); }
  }

  function handleCancel(e) {
    e.stopPropagation();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70">
      {/* Modal — fixed height so buttons are always visible */}
      <div
        className="bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        style={{ width: '100%', maxWidth: '780px', maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header — always visible */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0 bg-[#FFFDF0]">
          <div>
            <h3 className="font-bold text-[#001840] text-sm">Pin Building Location</h3>
            <p className="text-xs text-gray-400 mt-0.5">Click on the photo to place a pin · Click again to move it</p>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Image area — scrollable if needed */}
        <div className="flex-1 overflow-auto relative cursor-crosshair select-none bg-gray-100">
          <div className="relative inline-block w-full" onClick={handleImageClick}>
            <img
              ref={imgRef}
              src="/emc_aerial.jpg"
              alt="EMC Campus"
              className="w-full h-auto block"
              draggable={false}
            />
            {/* Pin */}
            {localPos && (
              <div
                style={{ left: `${localPos.x}%`, top: `${localPos.y}%`, position: 'absolute', transform: 'translate(-50%, -50%)', pointerEvents: 'none' }}
              >
                <div className="w-9 h-9 bg-[#F5C400] border-2 border-white rounded-full shadow-xl flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-[#001840]" />
                </div>
                {/* Ripple */}
                <div className="absolute inset-0 rounded-full bg-[#F5C400] opacity-30 animate-ping" />
              </div>
            )}
          </div>
        </div>

        {/* Footer — always visible */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-white flex-shrink-0">
          <p className="text-xs text-gray-500">
            {localPos
              ? <span className="text-green-600 font-medium">✅ Pin placed — x: {localPos.x}%, y: {localPos.y}%</span>
              : <span className="text-gray-400">Click anywhere on the photo to place a pin</span>}
          </p>
          <div className="flex gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!localPos}
              className="px-4 py-2 bg-[#001840] text-white rounded-lg text-sm font-medium hover:bg-[#102A71] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5"
            >
              <Target className="w-4 h-4" /> Confirm Pin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BuildingsView({ buildings, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState(null);
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: "", shortName: "", category: "Academic",
    description: "", offices: "", hours: "",
    pinX: "50", pinY: "50", imageUrl: "", color: "#102A71"
  });

  useEffect(() => {
    if (editingBuilding) {
      const coords = JSON.parse(editingBuilding.coordinates || '{"x":50,"y":50}');
      setFormData({
        name: editingBuilding.name || "",
        shortName: editingBuilding.shortName || "",
        category: editingBuilding.category || "Academic",
        description: editingBuilding.description || "",
        offices: Array.isArray(editingBuilding.offices)
          ? editingBuilding.offices.join(", ")
          : JSON.parse(editingBuilding.offices || '[]').join(", "),
        hours: editingBuilding.hours || "",
        pinX: String(coords.x ?? coords.pinX ?? 50),
        pinY: String(coords.y ?? coords.pinY ?? 50),
        imageUrl: editingBuilding.imageUrl || "",
        color: editingBuilding.color || "#102A71"
      });
      setPreviewUrl(editingBuilding.imageUrl ? `http://localhost:3000${editingBuilding.imageUrl}` : null);
      setSelectedFile(null);
    } else {
      setFormData({
        name: "", shortName: "", category: "Academic",
        description: "", offices: "", hours: "",
        pinX: "50", pinY: "50", imageUrl: "", color: "#102A71"
      });
      setPreviewUrl(null);
      setSelectedFile(null);
    }
  }, [editingBuilding]);

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    // Use FormData for file upload
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("shortName", formData.shortName);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("offices", JSON.stringify(formData.offices.split(',').map(o => o.trim()).filter(o => o)));
    formDataToSend.append("hours", formData.hours);
    formDataToSend.append("coordinates", JSON.stringify({ 
      x: parseFloat(formData.pinX), 
      y: parseFloat(formData.pinY) 
    }));
    formDataToSend.append("color", formData.color);
    
    // Add file if selected
    if (selectedFile) {
      formDataToSend.append("photo360", selectedFile);
    } else if (formData.imageUrl) {
      // Keep existing URL if no new file
      formDataToSend.append("imageUrl", formData.imageUrl);
    }

    try {
      const url = editingBuilding 
        ? `http://localhost:3000/api/admin/buildings/${editingBuilding.id}`
        : "http://localhost:3000/api/admin/buildings";
      
      const response = await fetch(url, {
        method: editingBuilding ? "PUT" : "POST",
        headers: {
          "Authorization": `Bearer ${token}`
          // Don't set Content-Type, let browser set it with boundary for FormData
        },
        body: formDataToSend
      });

      if (response.ok) {
        setShowForm(false);
        setEditingBuilding(null);
        setSelectedFile(null);
        setPreviewUrl(null);
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error("Error saving building:", error);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this building?")) return;
    
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/api/admin/buildings/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });

      if (response.ok && onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting building:", error);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div></div>
        <Button 
          onClick={() => {
            setShowForm(true);
            setEditingBuilding(null);
          }} 
          className="bg-[#001840] hover:bg-[#102A71]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Building
        </Button>
      </div>

      {/* Building Form */}
      {(showForm || editingBuilding) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingBuilding ? "Edit Building" : "Add New Building"}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Aerial Pin Picker Modal */}
            {showMapPicker && (
              <AerialPinPicker
                position={formData.pinX ? { x: parseFloat(formData.pinX), y: parseFloat(formData.pinY) } : null}
                onPositionChange={(pos) => {
                  setFormData({ ...formData, pinX: pos.x.toString(), pinY: pos.y.toString() });
                }}
                onClose={() => setShowMapPicker(false)}
              />
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Administration Building"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Name</label>
                  <Input
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    placeholder="Admin Hall"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the building..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5C400] focus:border-transparent"
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F5C400] focus:border-transparent"
                  >
                    <option>Administration</option>
                    <option>Academic</option>
                    <option>Services</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Color (Hex)</label>
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Offices/Rooms (comma-separated)
                </label>
                <Input
                  value={formData.offices}
                  onChange={(e) => setFormData({ ...formData, offices: e.target.value })}
                  placeholder="Registrar's Office, Cashier, Guidance Office"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Operating Hours</label>
                <Input
                  value={formData.hours}
                  onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                  placeholder="Mon-Fri: 8:00 AM - 5:00 PM"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Building Location on Campus Map
                </label>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setShowMapPicker(true)}
                    className="w-full px-4 py-3 bg-[#001840] hover:bg-[#102A71] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <MapPin className="w-5 h-5" />
                    {formData.pinX ? 'Reposition Pin on Aerial Photo' : 'Click to Pin Location on Aerial Photo'}
                  </button>
                  <div className="bg-[#FFFDF0] border border-[#F5C400]/30 rounded-lg p-3">
                    {formData.pinX && formData.pinY ? (
                      <p className="text-xs text-gray-600">
                        ✅ Pin placed at <span className="font-mono font-semibold text-[#001840]">x: {formData.pinX}%, y: {formData.pinY}%</span>
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400">No pin placed yet — click the button above to set location on the aerial photo</p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  360° Panoramic Photo
                </label>
                
                {/* File Upload */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-[#F5C400] transition-colors text-center">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-2">
                          <Plus className="w-8 h-8 text-gray-400" />
                          <p className="text-sm font-medium text-gray-700">
                            {selectedFile ? selectedFile.name : "Click to upload 360° photo"}
                          </p>
                          <p className="text-xs text-gray-500">
                            JPG, PNG up to 50MB
                          </p>
                        </div>
                      </div>
                    </label>
                  </div>

                  {/* Preview */}
                  {previewUrl && (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl(null);
                          setFormData({ ...formData, imageUrl: "" });
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <p className="text-xs text-gray-500">
                    Upload an equirectangular 360° panoramic photo for interactive viewing
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="bg-[#001840] hover:bg-[#102A71]">
                  {editingBuilding ? "Update Building" : "Create Building"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setShowForm(false);
                    setEditingBuilding(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Buildings Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {buildings.map((building) => (
          <Card key={building.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: building.color || "#001840" }}
                  >
                    <Building2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{building.shortName}</h4>
                    <Badge className="mt-1">{building.category}</Badge>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{building.description}</p>
              {building.imageUrl && (
                <div className="mb-3 text-xs text-green-600 flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  360° Photo Available
                </div>
              )}
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    setEditingBuilding(building);
                    setShowForm(false);
                  }}
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  <Edit className="w-4 h-4 inline mr-1" />
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(building.id)}
                  className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function SettingsView() {
  return (
    <div className="space-y-6">
      <div></div>

      <Card>
        <CardHeader>
          <CardTitle>System Configuration</CardTitle>
          <CardDescription>Manage system-wide settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Chatbot Auto-Response</p>
              <p className="text-sm text-gray-600">Enable automatic responses for common questions</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Email Notifications</p>
              <p className="text-sm text-gray-600">Send email alerts for new user registrations</p>
            </div>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Maintenance Mode</p>
              <p className="text-sm text-gray-600">Temporarily disable public access</p>
            </div>
            <input type="checkbox" className="w-5 h-5" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
