import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import {
  LayoutDashboard, ClipboardList, BookOpen, LogOut, Menu, X,
  Search, ChevronDown, ChevronUp, FileText, CheckCircle2,
  RotateCcw, Calendar, ClipboardCheck, Download,
  Clock, RefreshCw, Filter, Users, UserX, UserCheck, ArrowRightLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const API = 'http://localhost:3000/api';
const tok = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' });

// ── Application status config (enrollment pipeline) ──────────────────────────
const STATUS_CFG = {
  draft:             { label: 'Draft',             color: 'bg-gray-100 text-gray-700' },
  submitted:         { label: 'Submitted',          color: 'bg-blue-100 text-blue-700' },
  pending_exam:      { label: 'Pending Exam',       color: 'bg-yellow-100 text-yellow-700' },
  verified:          { label: 'Verified',           color: 'bg-purple-100 text-purple-700' },
  returned:          { label: 'Returned',           color: 'bg-orange-100 text-orange-700' },
  approved:          { label: 'Approved',           color: 'bg-green-100 text-green-700' },
  enrolled:          { label: 'Enrolled',           color: 'bg-emerald-100 text-emerald-700' },
  active:            { label: 'Active',             color: 'bg-cyan-100 text-cyan-700' },
  completed:         { label: 'Completed',          color: 'bg-slate-100 text-slate-700' },
  rejected:          { label: 'Rejected',           color: 'bg-red-100 text-red-700' },
};

// ── Life status config (what happened to the student after enrollment) ────────
const LIFE_STATUS_CFG = {
  enrolled:         { label: 'Enrolled',          color: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  dropped:          { label: 'Dropped',            color: 'bg-red-100 text-red-700',         dot: 'bg-red-500' },
  transferred_out:  { label: 'Transferred Out',    color: 'bg-orange-100 text-orange-700',   dot: 'bg-orange-500' },
  transferred_in:   { label: 'Transferred In',     color: 'bg-blue-100 text-blue-700',       dot: 'bg-blue-500' },
  retained:         { label: 'Retained',           color: 'bg-yellow-100 text-yellow-700',   dot: 'bg-yellow-500' },
  completed:        { label: 'Completed',          color: 'bg-slate-100 text-slate-600',     dot: 'bg-slate-400' },
};

function StatusBadge({ status }) {
  const c = STATUS_CFG[status] || { label: status, color: 'bg-gray-100 text-gray-600' };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${c.color}`}>{c.label}</span>;
}

function LifeStatusBadge({ status }) {
  if (!status) return null;
  const c = LIFE_STATUS_CFG[status] || { label: status, color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${c.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

// ── Modal wrapper ─────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md z-10">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-[#001840]">{title}</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

// ── Approve Modal (replaces Verify — registrar now verifies AND approves) ──────
function ApproveModal({ enrollment, onClose, onSuccess }) {
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/registrar/enrollments/${enrollment.id}/approve`, {
        method: 'POST', headers: tok(), body: JSON.stringify({ remarks }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Failed');
      toast.success('Enrollment verified and approved');
      onSuccess();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }
  return (
    <Modal title="Verify & Approve Enrollment" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-gray-600">Documents reviewed and complete for <span className="font-medium text-[#001840]">{enrollment.firstName} {enrollment.familyName}</span>. This will approve the enrollment directly.</p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (optional)</label>
          <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={3}
            maxLength={1000}
            placeholder="Add notes..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 resize-none" />
          <p className="text-xs text-gray-400 text-right mt-0.5">{remarks.length}/1000</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-60">
            {loading ? 'Approving...' : 'Verify & Approve'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Return Modal ──────────────────────────────────────────────────────────────
function ReturnModal({ enrollment, onClose, onSuccess }) {
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    if (!remarks.trim()) { toast.error('Remarks are required'); return; }
    if (remarks.trim().length > 1000) { toast.error('Remarks must be 1000 characters or less'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API}/registrar/enrollments/${enrollment.id}/return`, {
        method: 'POST', headers: tok(), body: JSON.stringify({ remarks }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Failed');
      toast.success('Enrollment returned to student');
      onSuccess();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }
  return (
    <Modal title="Return Enrollment" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-gray-600">Return to <span className="font-medium text-[#001840]">{enrollment.firstName} {enrollment.familyName}</span> with correction notes.</p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks <span className="text-red-500">*</span></label>
          <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={4} required
            maxLength={1000}
            placeholder="Explain what needs to be corrected or resubmitted..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none" />
          <p className="text-xs text-gray-400 text-right mt-0.5">{remarks.length}/1000</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 transition-colors disabled:opacity-60">
            {loading ? 'Returning...' : 'Return to Student'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── SSC Schedule Modal ────────────────────────────────────────────────────────
function SSCScheduleModal({ enrollment, onClose, onSuccess }) {
  const [examDate, setExamDate] = useState('');
  const [passingScore, setPassingScore] = useState('75');
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/registrar/enrollments/${enrollment.id}/ssc-schedule`, {
        method: 'PUT', headers: tok(), body: JSON.stringify({ examDate, passingScore: Number(passingScore) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Failed');
      toast.success('SSC exam scheduled');
      onSuccess();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }
  return (
    <Modal title="Schedule SSC Entrance Exam" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-gray-600">Schedule entrance exam for <span className="font-medium text-[#001840]">{enrollment.firstName || enrollment.user_name || 'this student'} {enrollment.familyName || ''}</span>.</p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exam Date <span className="text-red-500">*</span></label>
          <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} required
            min={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 focus:border-[#001840]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Passing Score</label>
          <input type="number" value={passingScore} onChange={e => setPassingScore(e.target.value)} min="0" max="100"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 focus:border-[#001840]" />
          <p className="text-xs text-gray-400 mt-1">Students scoring at or above this pass into SSC class</p>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-yellow-500 text-white rounded-lg text-sm font-medium hover:bg-yellow-600 transition-colors disabled:opacity-60">
            {loading ? 'Scheduling...' : 'Schedule Exam'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── SSC Result Modal ──────────────────────────────────────────────────────────
function SSCResultModal({ enrollment, onClose, onSuccess }) {
  const [examScore, setExamScore] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/registrar/enrollments/${enrollment.id}/ssc-result`, {
        method: 'PUT', headers: tok(), body: JSON.stringify({ examScore: Number(examScore) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Failed');
      toast.success(data.message || 'SSC result recorded');
      onSuccess();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }
  return (
    <Modal title="Record SSC Exam Result" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-gray-600">Record exam score for <span className="font-medium text-[#001840]">{enrollment.firstName || enrollment.user_name || 'this student'} {enrollment.familyName || ''}</span>.</p>
        {enrollment.sscPassingScore && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2 text-sm text-yellow-800">
            Passing score: <span className="font-semibold">{enrollment.sscPassingScore}</span>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Exam Score (0–100) <span className="text-red-500">*</span></label>
          <input type="number" value={examScore} onChange={e => setExamScore(e.target.value)} min="0" max="100" required
            placeholder="e.g. 82"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 focus:border-[#001840]" />
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" disabled={loading} className="flex-1 px-4 py-2 bg-[#F5C400] text-[#001840] rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-60">
            {loading ? 'Saving...' : 'Record Result'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Life Status Modal ─────────────────────────────────────────────────────────
function LifeStatusModal({ enrollment, onClose, onSuccess }) {
  const [lifeStatus, setLifeStatus] = useState('');
  const [reason, setReason] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [destinationSchool, setDestinationSchool] = useState('');
  const [loading, setLoading] = useState(false);

  const displayName = (enrollment.firstName || enrollment.familyName)
    ? `${enrollment.firstName || ''} ${enrollment.familyName || ''}`.trim()
    : (enrollment.user_name || `Student #${enrollment.id}`);

  const options = [
    { value: 'dropped',         label: 'Dropped',          desc: 'Student stopped attending mid-year' },
    { value: 'transferred_out', label: 'Transferred Out',  desc: 'Student left for another school' },
    { value: 'retained',        label: 'Retained',         desc: 'Student did not advance to next grade' },
    { value: 'completed',       label: 'Completed',        desc: 'Student finished the school year' },
  ];

  async function submit(e) {
    e.preventDefault();
    if (!lifeStatus) { toast.error('Please select a status'); return; }
    if (!reason.trim()) { toast.error('Reason is required'); return; }
    if (lifeStatus === 'transferred_out' && !destinationSchool.trim()) {
      toast.error('Destination school is required for Transfer Out'); return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/registrar/enrollments/${enrollment.id}/life-status`, {
        method: 'PUT', headers: tok(),
        body: JSON.stringify({ lifeStatus, reason, date, destinationSchool: destinationSchool || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || data.message || 'Failed');
      toast.success(`Student marked as ${LIFE_STATUS_CFG[lifeStatus]?.label}`);
      onSuccess();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  }

  return (
    <Modal title="Update Student Status" onClose={onClose}>
      <form onSubmit={submit} className="space-y-4">
        <p className="text-sm text-gray-600">
          Update life status for <span className="font-semibold text-[#001840]">{displayName}</span>.
          {enrollment.lifeStatus && (
            <span className="ml-1 text-gray-400">Current: <LifeStatusBadge status={enrollment.lifeStatus} /></span>
          )}
        </p>

        {/* Status selector */}
        <div className="grid grid-cols-2 gap-2">
          {options.map(opt => (
            <button key={opt.value} type="button"
              onClick={() => setLifeStatus(opt.value)}
              className={`text-left p-3 rounded-xl border-2 transition-all ${
                lifeStatus === opt.value
                  ? `border-current ${LIFE_STATUS_CFG[opt.value].color} font-semibold`
                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
              }`}>
              <p className="text-xs font-semibold">{opt.label}</p>
              <p className="text-[10px] mt-0.5 opacity-70 leading-tight">{opt.desc}</p>
            </button>
          ))}
        </div>

        {/* Destination school — only for transferred out */}
        {lifeStatus === 'transferred_out' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination School <span className="text-red-500">*</span>
            </label>
            <input type="text" value={destinationSchool}
              onChange={e => setDestinationSchool(e.target.value)}
              placeholder="Name of school the student transferred to"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 focus:border-[#001840]" />
          </div>
        )}

        {/* Effective date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 focus:border-[#001840]" />
        </div>

        {/* Reason */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reason / Notes <span className="text-red-500">*</span>
          </label>
          <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} required
            maxLength={500}
            placeholder="Provide a reason for this status change..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 focus:border-[#001840] resize-none" />
          <p className="text-xs text-gray-400 text-right mt-0.5">{reason.length}/500</p>
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={loading || !lifeStatus}
            className="flex-1 px-4 py-2 bg-[#001840] text-white rounded-lg text-sm font-medium hover:bg-[#102A71] transition-colors disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Status'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ── Enrollment Detail Panel ───────────────────────────────────────────────────
const BACKEND = 'http://localhost:3000';

function EnrollmentDetail({ enrollmentId, enrollment: rowData, onClose, onActionSuccess }) {
  const [detail, setDetail] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [uploadedDocs, setUploadedDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    try {
      const [detailRes, subjectsRes, docsRes] = await Promise.all([
        fetch(`${API}/enrollments/${enrollmentId}`, { headers: tok() }),
        fetch(`${API}/enrollments/${enrollmentId}/subjects`, { headers: tok() }).catch(() => null),
        fetch(`${API}/enrollments/${enrollmentId}/documents`, { headers: tok() }).catch(() => null),
      ]);
      if (detailRes.ok) {
        const d = await detailRes.json();
        setDetail(d.enrollment || d);
      }
      if (subjectsRes && subjectsRes.ok) {
        const s = await subjectsRes.json();
        setSubjects(Array.isArray(s) ? s : s.subjects || []);
      }
      if (docsRes && docsRes.ok) {
        const docs = await docsRes.json();
        setUploadedDocs(Array.isArray(docs) ? docs : []);
      }
    } catch (err) {
      toast.error('Failed to load details');
    } finally {
      setLoading(false);
    }
  }, [enrollmentId]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  function handleModalSuccess() {
    setActiveModal(null);
    fetchDetail();
    onActionSuccess();
  }

  async function handleDownloadPDF() {
    try {
      const res = await fetch(`${API}/enrollments/${enrollmentId}/pdf`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      if (!res.ok) throw new Error('Failed to download PDF');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `enrollment-${enrollmentId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) { toast.error(err.message); }
  }

  const e = detail || rowData;
  if (loading && !e) {
    return (
      <div className="border-t border-gray-100 bg-gray-50 px-6 py-8 flex items-center justify-center gap-2 text-gray-400 text-sm">
        <RefreshCw size={15} className="animate-spin" /> Loading details...
      </div>
    );
  }
  if (!e) return null;

  const status = e.status;
  const level = (e.educationLevel || '').toUpperCase();
  const isJHS = level === 'JHS';
  const isTransferee = e.enrollmentType === 'transferee';

  const canApprove = ['submitted', 'returned'].includes(status);
  const canReturn = ['submitted', 'verified'].includes(status);
  const canScheduleSSC = isJHS && e.sscApplied && status === 'pending_exam' && !e.sscExamDate;
  const canRecordSSC = isJHS && status === 'pending_exam' && !!e.sscExamDate && !e.sscExamScore;

  // Display name: use enrollment name fields if filled, otherwise fall back to user account name
  const displayName = (e.firstName || e.familyName)
    ? `${e.firstName || ''} ${e.familyName || ''}`.trim()
    : (e.user_name || e.userEmail || `Student #${e.userId || e.id}`);

  return (
    <div className="border-t border-gray-100 bg-slate-50/70">
      <div className="px-6 py-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="font-semibold text-[#001840]">{displayName}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {e.educationLevel} &bull; {e.course || e.gradeLevel || '—'} &bull; {e.academicYear || e.semester || '—'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
            <X size={15} className="text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student Info */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Student Info</p>
            <dl className="space-y-2 text-sm">
              {[
                ['Name', displayName !== `Student #${e.userId || e.id}` ? displayName : null],
                ['Email', e.email || e.user_email || e.userEmail],
                ['Mobile', e.mobileNumber],
                ['Enrollment Type', e.enrollmentType],
                ['Student Status', e.studentStatus],
                ['Date of Birth', e.dateOfBirth],
                ['SSC Applied', e.sscApplied ? 'Yes' : null],
              ].filter(([, v]) => v).map(([label, value]) => (
                <div key={label} className="flex justify-between gap-2">
                  <dt className="text-gray-400 flex-shrink-0">{label}</dt>
                  <dd className="font-medium text-gray-700 text-right truncate">{value}</dd>
                </div>
              ))}
              {/* Life status row — shown separately so we can use the badge */}
              {e.lifeStatus && (
                <div className="flex justify-between gap-2 pt-1 border-t border-gray-50">
                  <dt className="text-gray-400 flex-shrink-0">Life Status</dt>
                  <dd><LifeStatusBadge status={e.lifeStatus} /></dd>
                </div>
              )}
              {e.lifeStatusReason && (
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-400 flex-shrink-0">Reason</dt>
                  <dd className="text-gray-600 text-right text-xs max-w-[180px]">{e.lifeStatusReason}</dd>
                </div>
              )}
              {e.destinationSchool && (
                <div className="flex justify-between gap-2">
                  <dt className="text-gray-400 flex-shrink-0">Transferred To</dt>
                  <dd className="font-medium text-gray-700 text-right truncate">{e.destinationSchool}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Documents */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Submitted Documents</p>

            {/* Checked credential list */}
            {Array.isArray(e.admissionCredentials) && e.admissionCredentials.length > 0 ? (
              <ul className="space-y-2">
                {e.admissionCredentials.map((doc, i) => {
                  const docKey = typeof doc === 'string' ? doc : (doc.key || doc.type || '');
                  const docLabel = typeof doc === 'string' ? doc : (doc.name || doc.label || doc.type || doc);
                  const uploaded = uploadedDocs.find(d => d.documentType === docKey);
                  return (
                    <li key={i} className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={13} className={uploaded ? 'text-green-500' : 'text-gray-300'} />
                        <span className="text-gray-700">{docLabel}</span>
                      </div>
                      {uploaded ? (
                        <a href={`${BACKEND}${uploaded.filePath}`} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors">
                          <FileText size={11} /> View
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400 italic">No file</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : uploadedDocs.length > 0 ? (
              // SSC applications: no admissionCredentials but have uploaded docs
              <ul className="space-y-2">
                {uploadedDocs.map(doc => (
                  <li key={doc.id} className="flex items-center justify-between gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-green-500" />
                      <span className="text-gray-700">{doc.documentLabel || doc.documentType}</span>
                    </div>
                    <a href={`${BACKEND}${doc.filePath}`} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors">
                      <FileText size={11} /> View
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-400 italic">No documents on record</p>
            )}

            {/* Standalone uploaded docs not tied to a credential checkbox — only show when admissionCredentials has items */}
            {Array.isArray(e.admissionCredentials) && e.admissionCredentials.length > 0 && uploadedDocs.filter(d => {
              const creds = Array.isArray(e.admissionCredentials) ? e.admissionCredentials : [];
              return !creds.some(c => (typeof c === 'string' ? c : c.key || c.type) === d.documentType);
            }).map(doc => (
              <div key={doc.id} className="flex items-center justify-between gap-2 text-sm mt-2">
                <div className="flex items-center gap-2">
                  <FileText size={13} className="text-blue-500" />
                  <span className="text-gray-700">{doc.documentLabel || doc.documentType}</span>
                </div>
                <a
                  href={`${BACKEND}${doc.filePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-medium transition-colors"
                >
                  <FileText size={11} /> View
                </a>
              </div>
            ))}

          </div>
        </div>

        {e.registrar_remarks && (
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-1">Registrar Remarks</p>
            <p className="text-sm text-orange-800">{e.registrar_remarks}</p>
          </div>
        )}

        {/* SSC Not Qualified Notice */}
        {e.sscApplied == 1 && e.sscQualified == 0 && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-1">SSC — Not Qualified</p>
            <p className="text-sm text-red-700">
              Student applied for Special Science Class but does not meet the requirement.
              Grade 6 average is <span className="font-semibold">{e.grade6Average}</span> (minimum 85 required).
              Student will be enrolled in the <span className="font-semibold">Regular class</span>.
            </p>
          </div>
        )}

        {/* SSC Info */}
        {e.sscExamDate && (
          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-yellow-700 uppercase tracking-wider mb-2">SSC Exam</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-gray-400">Date: </span><span className="font-medium">{new Date(e.sscExamDate).toLocaleDateString()}</span></div>
              <div><span className="text-gray-400">Passing: </span><span className="font-medium">{e.sscPassingScore || 75}</span></div>
              {e.sscExamScore && <div><span className="text-gray-400">Score: </span><span className="font-semibold text-[#001840]">{e.sscExamScore}</span></div>}
              {e.sscResult && <div><span className="text-gray-400">Result: </span><span className={`font-semibold ${e.sscResult === 'passed' ? 'text-green-600' : 'text-red-500'}`}>{e.sscResult}</span></div>}
              {e.sscClass && <div><span className="text-gray-400">Class: </span><span className="font-medium">{e.sscClass}</span></div>}
            </div>
          </div>
        )}

        {/* Enrolled Subjects */}
        {subjects.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Enrolled Subjects ({subjects.length})</p>
            <div className="space-y-1 max-h-36 overflow-y-auto">
              {subjects.map((s, i) => (
                <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-50 last:border-0">
                  <span className="text-gray-700">{s.subjectName || s.name || s.code}</span>
                  <span className="text-gray-400 text-xs">{s.units} units</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-1">
          {canApprove && (
            <button onClick={() => setActiveModal('approve')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">
              <CheckCircle2 size={13} /> Verify & Approve
            </button>
          )}
          {canReturn && (
            <button onClick={() => setActiveModal('return')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-medium hover:bg-orange-600 transition-colors">
              <RotateCcw size={13} /> Return
            </button>
          )}
          {canScheduleSSC && (
            <button onClick={() => setActiveModal('ssc-schedule')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-xs font-medium hover:bg-yellow-600 transition-colors">
              <Calendar size={13} /> Schedule SSC Exam
            </button>
          )}
          {canRecordSSC && (
            <button onClick={() => setActiveModal('ssc-result')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#F5C400] text-[#001840] rounded-lg text-xs font-semibold hover:bg-yellow-400 transition-colors">
              <ClipboardCheck size={13} /> Record SSC Result
            </button>
          )}
          {/* Life status — only for enrolled students not already dropped/transferred */}
          {['enrolled', 'active', 'approved', 'subjects_enrolled'].includes(status) &&
           !['dropped', 'transferred_out'].includes(e.lifeStatus) && (
            <button onClick={() => setActiveModal('life-status')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#001840] text-white rounded-lg text-xs font-medium hover:bg-[#102A71] transition-colors">
              <UserX size={13} /> Update Student Status
            </button>
          )}
          <button onClick={handleDownloadPDF}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors ml-auto">
            <Download size={13} /> PDF
          </button>
        </div>
      </div>

      {activeModal === 'approve' && <ApproveModal enrollment={e} onClose={() => setActiveModal(null)} onSuccess={handleModalSuccess} />}
      {activeModal === 'return' && <ReturnModal enrollment={e} onClose={() => setActiveModal(null)} onSuccess={handleModalSuccess} />}
      {activeModal === 'ssc-schedule' && <SSCScheduleModal enrollment={e} onClose={() => setActiveModal(null)} onSuccess={handleModalSuccess} />}
      {activeModal === 'ssc-result' && <SSCResultModal enrollment={e} onClose={() => setActiveModal(null)} onSuccess={handleModalSuccess} />}
      {activeModal === 'life-status' && <LifeStatusModal enrollment={e} onClose={() => setActiveModal(null)} onSuccess={handleModalSuccess} />}
    </div>
  );
}

// ── Students Tab (life status management) ────────────────────────────────────
const LIFE_STATUS_OPTIONS = [
  { value: 'all',           label: 'All Students' },
  { value: 'enrolled',      label: 'Enrolled' },
  { value: 'dropped',       label: 'Dropped' },
  { value: 'transferred_out', label: 'Transferred Out' },
  { value: 'transferred_in',  label: 'Transferred In' },
  { value: 'retained',      label: 'Retained' },
  { value: 'completed',     label: 'Completed' },
];

function StudentsTab() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lifeStatusFilter, setLifeStatusFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [schoolYears, setSchoolYears] = useState([]);
  const [activeYear, setActiveYear] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [page, setPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const PAGE_SIZE = 10;

  function exportToExcel() {
    if (students.length === 0) { toast.error('No students to export'); return; }
    setExporting(true);
    try {
      import('xlsx').then(XLSX => {
        const rows = students.map((s, i) => ({
          '#': i + 1,
          'Last Name':        s.familyName || '',
          'First Name':       s.firstName  || '',
          'Middle Name':      s.middleName  || '',
          'Student No.':      s.studentNumber || '',
          'LRN':              s.lrn || '',
          'Sex':              s.sex || '',
          'Date of Birth':    s.dateOfBirth || '',
          'Education Level':  s.educationLevel || '',
          'Grade Level':      s.gradeLevel || '',
          'Strand':           s.strand || '',
          'Section':          s.sectionName || '',
          'Enrollment Type':  s.enrollmentType || '',
          'Student Type':     s.studentType || '',
          'School Year':      s.academicYear || '',
          'App. Status':      s.status || '',
          'Life Status':      s.lifeStatus
                                ? (LIFE_STATUS_CFG[s.lifeStatus]?.label || s.lifeStatus)
                                : 'Active',
          'Status Date':      s.lifeStatusDate || '',
          'Status Reason':    s.lifeStatusReason || '',
          'Destination School': s.destinationSchool || '',
          'Email':            s.user_email || '',
          'Date Enrolled':    s.createdAt ? new Date(s.createdAt).toLocaleDateString('en-PH') : '',
        }));

        const ws = XLSX.utils.json_to_sheet(rows);

        // Column widths
        ws['!cols'] = [
          {wch:4},{wch:16},{wch:16},{wch:16},{wch:13},{wch:14},
          {wch:7},{wch:13},{wch:13},{wch:12},{wch:10},{wch:14},
          {wch:14},{wch:12},{wch:12},{wch:13},{wch:14},
          {wch:12},{wch:30},{wch:22},{wch:26},{wch:13},
        ];

        const wb = XLSX.utils.book_new();
        const sheetName = `Students ${yearFilter || activeYear || 'All'}`;
        XLSX.utils.book_append_sheet(wb, ws, sheetName.slice(0, 31));

        const filename = `EMC_Students_${yearFilter || activeYear || 'All'}_${
          lifeStatusFilter !== 'all' ? lifeStatusFilter + '_' : ''
        }${levelFilter || 'AllLevels'}_${new Date().toISOString().slice(0,10)}.xlsx`;

        XLSX.writeFile(wb, filename);
        toast.success(`Exported ${students.length} student${students.length !== 1 ? 's' : ''} to ${filename}`);
      });
    } catch (err) {
      toast.error('Export failed: ' + err.message);
    } finally {
      setExporting(false);
    }
  }

  useEffect(() => {
    fetch(`${API}/academic/school-years`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (Array.isArray(data)) {
          setSchoolYears(data);
          const active = data.find(sy => sy.isActive);
          if (active) setActiveYear(active.year);
        }
      }).catch(() => {});
  }, []);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (lifeStatusFilter && lifeStatusFilter !== 'all') params.set('lifeStatus', lifeStatusFilter);
      if (levelFilter) params.set('educationLevel', levelFilter);
      if (search) params.set('search', search);
      if (yearFilter) params.set('academicYear', yearFilter);
      const res = await fetch(`${API}/registrar/students?${params}`, { headers: tok() });
      if (!res.ok) throw new Error('Failed to fetch students');
      const data = await res.json();
      setStudents(Array.isArray(data) ? data : []);
      setPage(1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [lifeStatusFilter, levelFilter, search, yearFilter]);

  useEffect(() => {
    const t = setTimeout(fetchStudents, 300);
    return () => clearTimeout(t);
  }, [fetchStudents]);

  // Summary counts
  const counts = LIFE_STATUS_OPTIONS.slice(1).reduce((acc, opt) => {
    acc[opt.value] = students.filter(s => s.lifeStatus === opt.value).length;
    return acc;
  }, {});
  const noStatus = students.filter(s => !s.lifeStatus).length;

  const totalPages = Math.ceil(students.length / PAGE_SIZE);
  const paginated = students.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        {noStatus > 0 && (
          <button onClick={() => setLifeStatusFilter('all')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold hover:bg-gray-200 transition-colors">
            <span className="w-2 h-2 rounded-full bg-gray-400" /> No Status: {noStatus}
          </button>
        )}
        {Object.entries(LIFE_STATUS_CFG).map(([key, cfg]) => {
          const count = students.filter(s => s.lifeStatus === key).length;
          if (count === 0) return null;
          return (
            <button key={key} onClick={() => setLifeStatusFilter(lifeStatusFilter === key ? 'all' : key)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                lifeStatusFilter === key ? `${cfg.color} ring-2 ring-offset-1 ring-current` : `${cfg.color} hover:opacity-80`
              }`}>
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} /> {cfg.label}: {count}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, LRN, or student number..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 focus:border-[#001840]" />
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none appearance-none bg-white">
              <option value="">Current Year</option>
              <option value="all">All Years</option>
              {schoolYears.map(sy => <option key={sy.id} value={sy.year}>{sy.year}</option>)}
            </select>
            <select value={lifeStatusFilter} onChange={e => setLifeStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none appearance-none bg-white">
              {LIFE_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none appearance-none bg-white">
              <option value="">All Levels</option>
              <option value="JHS">JHS</option>
              <option value="SHS">SHS</option>
            </select>
            <button onClick={fetchStudents}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw size={14} className="text-gray-500" />
            </button>
            <button onClick={exportToExcel} disabled={exporting || students.length === 0}
              title="Export to Excel"
              className="flex items-center gap-1.5 px-3 py-2 border border-green-200 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              <Download size={14} />
              {exporting ? 'Exporting...' : 'Excel'}
            </button>
          </div>
        </div>
        {activeYear && (
          <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Showing: <span className="font-semibold text-[#001840]">{yearFilter === 'all' ? 'All School Years' : yearFilter || activeYear}</span>
            {!yearFilter && <span>(active year)</span>}
          </p>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm">
            <RefreshCw size={15} className="animate-spin" /> Loading students...
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Users size={36} className="mb-3 opacity-40" />
            <p className="text-sm">No students found</p>
            <p className="text-xs mt-1 text-gray-300">Students appear here once their enrollment is approved</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/60">
                    {['Student', 'Level / Grade', 'Section', 'Enrollment Type', 'Life Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map(s => {
                    const name = (s.firstName || s.familyName)
                      ? `${s.firstName || ''} ${s.familyName || ''}`.trim()
                      : (s.user_name || `Student #${s.id}`);
                    const canUpdate = !['dropped', 'transferred_out'].includes(s.lifeStatus);
                    return (
                      <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-800">{name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {s.studentNumber || s.lrn ? `${s.studentNumber || ''} ${s.lrn ? `· LRN: ${s.lrn}` : ''}`.trim() : s.user_email || ''}
                          </p>
                        </td>
                        <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                          {s.educationLevel} {s.gradeLevel ? `· ${s.gradeLevel}` : ''}
                          {s.strand ? <span className="ml-1 text-xs text-gray-400">({s.strand})</span> : null}
                        </td>
                        <td className="px-5 py-3 text-gray-500">{s.sectionName || '—'}</td>
                        <td className="px-5 py-3 capitalize text-gray-500">{s.enrollmentType || '—'}</td>
                        <td className="px-5 py-3">
                          {s.lifeStatus
                            ? <LifeStatusBadge status={s.lifeStatus} />
                            : <span className="text-xs text-gray-300 italic">not set</span>}
                          {s.lifeStatusDate && (
                            <p className="text-[10px] text-gray-400 mt-0.5">{new Date(s.lifeStatusDate).toLocaleDateString('en-PH')}</p>
                          )}
                          {s.destinationSchool && (
                            <p className="text-[10px] text-gray-500 mt-0.5">→ {s.destinationSchool}</p>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-col gap-1.5">
                            {canUpdate ? (
                              <button onClick={() => setSelectedStudent(s)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#001840] text-white rounded-lg text-xs font-medium hover:bg-[#102A71] transition-colors">
                                <UserX size={11} /> Update Status
                              </button>
                            ) : (
                              <span className="text-xs text-gray-300 italic">finalized</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-50 bg-gray-50/50">
                <p className="text-xs text-gray-400">
                  {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, students.length)} of {students.length}
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition-colors">Prev</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 text-xs rounded-lg transition-colors ${p === page ? 'bg-[#001840] text-white font-semibold' : 'border border-gray-200 hover:bg-white text-gray-600'}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 transition-colors">Next</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Life Status Modal */}
      {selectedStudent && (
        <LifeStatusModal
          enrollment={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onSuccess={() => { setSelectedStudent(null); fetchStudents(); }}
        />
      )}
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
function OverviewTab({ stats, recentEnrollments, onRefresh }) {
  const s = stats || {};
  const cards = [
    { label: 'Pending Verification', value: s.submitted ?? 0, icon: Clock, bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100' },
    { label: 'Pending SSC Exam',     value: s.pending_exam ?? 0, icon: Calendar, bg: 'bg-yellow-50', text: 'text-yellow-600', border: 'border-yellow-100' },
    { label: 'Approved / Enrolled',  value: (s.approved ?? 0) + (s.enrolled ?? 0), icon: CheckCircle2, bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-100' },
    { label: 'Returned to Student',  value: s.returned ?? 0, icon: RotateCcw, bg: 'bg-orange-50', text: 'text-orange-600', border: 'border-orange-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(card => (
          <div key={card.label} className={`bg-white rounded-2xl border ${card.border} p-5 flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${card.bg} ${card.text}`}>
              <card.icon size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#001840]">{card.value}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
          <h3 className="font-semibold text-[#001840] text-sm">Recent Enrollments</h3>
          <button onClick={onRefresh} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <RefreshCw size={14} className="text-gray-400" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-50">
                {['Student', 'Level', 'Program / Grade', 'Status', 'Submitted'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentEnrollments.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-10 text-center text-gray-400 text-sm">No recent enrollments</td></tr>
              ) : recentEnrollments.slice(0, 10).map(e => (
                <tr key={e.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3 font-medium text-gray-800">
                    {(e.firstName || e.familyName)
                      ? `${e.firstName || ''} ${e.familyName || ''}`.trim()
                      : (e.user_name || `Student #${e.userId || e.id}`)}
                  </td>
                  <td className="px-6 py-3 text-gray-500">{e.educationLevel}</td>
                  <td className="px-6 py-3 text-gray-500 max-w-[160px] truncate">{e.course || e.gradeLevel || '—'}</td>
                  <td className="px-6 py-3"><StatusBadge status={e.status} /></td>
                  <td className="px-6 py-3 text-gray-400 text-xs">{e.createdAt ? new Date(e.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Enrollments Tab ───────────────────────────────────────────────────────────
const PAGE_SIZE = 8;

function EnrollmentsTab({ onActionSuccess }) {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [yearFilter, setYearFilter] = useState(''); // '' = active year (default)
  const [schoolYears, setSchoolYears] = useState([]);
  const [activeYear, setActiveYear] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [page, setPage] = useState(1);

  // Load school years for the dropdown
  useEffect(() => {
    fetch(`${API}/academic/school-years`)
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

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (levelFilter) params.set('educationLevel', levelFilter);
      if (search) params.set('search', search);
      // yearFilter '' = use active year (backend default), 'all' = bypass
      if (yearFilter) params.set('academicYear', yearFilter);
      const res = await fetch(`${API}/registrar/enrollments?${params}`, { headers: tok() });
      if (!res.ok) throw new Error('Failed to fetch enrollments');
      const data = await res.json();
      setEnrollments(Array.isArray(data) ? data : data.enrollments || []);
      setPage(1);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, levelFilter, search, yearFilter]);

  useEffect(() => {
    const t = setTimeout(fetchEnrollments, 300);
    return () => clearTimeout(t);
  }, [fetchEnrollments]);

  function handleActionSuccess() {
    fetchEnrollments();
    onActionSuccess();
  }

  const totalPages = Math.ceil(enrollments.length / PAGE_SIZE);
  const paginated = enrollments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-4">
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
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 focus:border-[#001840]" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {/* School Year filter */}
            <select value={yearFilter} onChange={e => setYearFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 appearance-none bg-white">
              <option value="">Current Year</option>
              <option value="all">All Years</option>
              {schoolYears.map(sy => (
                <option key={sy.id} value={sy.year}>{sy.year}</option>
              ))}
            </select>
            <div className="relative">
              <Filter size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                className="pl-7 pr-8 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 focus:border-[#001840] appearance-none bg-white">
                <option value="">All Statuses</option>
                {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <select value={levelFilter} onChange={e => setLevelFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#001840]/20 focus:border-[#001840] appearance-none bg-white">
              <option value="">All Levels</option>
              <option value="JHS">JHS</option>
              <option value="SHS">SHS</option>
            </select>
            <button onClick={fetchEnrollments} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <RefreshCw size={14} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm">
            <RefreshCw size={15} className="animate-spin" /> Loading...
          </div>
        ) : enrollments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <ClipboardList size={36} className="mb-3 opacity-40" />
            <p className="text-sm">No enrollments found</p>
          </div>
        ) : (
          <>
          <div className="divide-y divide-gray-50">
            {paginated.map(enrollment => (
              <div key={enrollment.id}>
                <button
                  onClick={() => setExpandedId(prev => prev === enrollment.id ? null : enrollment.id)}
                  className="w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50/60 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-medium text-gray-800 text-sm">
                        {(enrollment.firstName || enrollment.familyName)
                          ? `${enrollment.firstName || ''} ${enrollment.familyName || ''}`.trim()
                          : (enrollment.user_name || `Student #${enrollment.userId || enrollment.id}`)}
                      </span>
                      <StatusBadge status={enrollment.status} />
                      {enrollment.lifeStatus && <LifeStatusBadge status={enrollment.lifeStatus} />}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-400 flex-wrap">
                      <span>{enrollment.educationLevel}</span>
                      {(enrollment.course || enrollment.gradeLevel) && (
                        <><span>&bull;</span><span className="truncate max-w-[180px]">{enrollment.course || enrollment.gradeLevel}</span></>
                      )}
                      {enrollment.createdAt && (
                        <><span>&bull;</span><span>{new Date(enrollment.createdAt).toLocaleDateString()}</span></>
                      )}
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-gray-400">
                    {expandedId === enrollment.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </div>
                </button>
                {expandedId === enrollment.id && (
                  <EnrollmentDetail
                    enrollmentId={enrollment.id}
                    enrollment={enrollment}
                    onClose={() => setExpandedId(null)}
                    onActionSuccess={handleActionSuccess}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-50 bg-gray-50/50">
              <p className="text-xs text-gray-400">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, enrollments.length)} of {enrollments.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-xs rounded-lg transition-colors ${
                      p === page
                        ? 'bg-[#001840] text-white font-semibold'
                        : 'border border-gray-200 hover:bg-white text-gray-600'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next
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

// ── SSC Bulk Scheduling Tab ───────────────────────────────────────────────────
function SSCBulkTab() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [examDate, setExamDate] = useState('');
  const [passingScore, setPassingScore] = useState('75');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => { loadStudents(); }, []);

  async function loadStudents() {
    setLoading(true);
    try {
      const res = await fetch(
        `${API}/registrar/enrollments?status=pending_exam`,
        { headers: tok() }
      );
      const data = await res.json();
      // Only JHS SSC applicants that haven't been scheduled yet
      const sscPending = (Array.isArray(data) ? data : []).filter(
        e => e.educationLevel === 'JHS' && e.sscApplied && !e.sscExamDate
      );
      setStudents(sscPending);
    } catch {
      toast.error('Failed to load SSC applicants');
    } finally {
      setLoading(false);
    }
  }

  function toggleAll(checked) {
    if (checked) setSelected(new Set(students.map(s => s.id)));
    else setSelected(new Set());
  }

  function toggleOne(id) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleBulkSchedule(e) {
    e.preventDefault();
    if (selected.size === 0) { toast.error('Select at least one student'); return; }
    if (!examDate) { toast.error('Exam date is required'); return; }
    const ps = parseFloat(passingScore);
    if (isNaN(ps) || ps < 0 || ps > 100) { toast.error('Passing score must be 0–100'); return; }

    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch(`${API}/registrar/enrollments/bulk-ssc-schedule`, {
        method: 'POST',
        headers: tok(),
        body: JSON.stringify({ ids: [...selected], examDate, passingScore: ps }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      setResult(data);
      toast.success(data.message);
      // Refresh list — remove scheduled students
      await loadStudents();
      setSelected(new Set());
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  // Tomorrow as the minimum selectable date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#001840]">SSC Bulk Scheduling</h2>
        <p className="text-sm text-gray-500 mt-1">
          Select multiple Grade 7 SSC applicants and schedule them for the entrance exam in one action.
        </p>
      </div>

      {/* Schedule Form */}
      <form onSubmit={handleBulkSchedule}
        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-sm font-bold text-[#001840] uppercase tracking-wider mb-4">
          Exam Settings
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={examDate}
              min={minDate}
              onChange={e => setExamDate(e.target.value)}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#102A71]/20 focus:border-[#102A71]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Passing Score (out of 100)
            </label>
            <input
              type="number"
              value={passingScore}
              min="0"
              max="100"
              onChange={e => setPassingScore(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#102A71]/20 focus:border-[#102A71]"
            />
            <p className="text-xs text-gray-400 mt-1">
              Students scoring at or above this pass into SSC class
            </p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {selected.size} student{selected.size !== 1 ? 's' : ''} selected
          </span>
          <button
            type="submit"
            disabled={submitting || selected.size === 0}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#F5C400] text-[#001840] rounded-xl text-sm font-bold hover:bg-[#FFDC5F] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {submitting ? (
              <><span className="w-4 h-4 border-2 border-[#001840]/30 border-t-[#001840] rounded-full animate-spin" /> Scheduling...</>
            ) : (
              <><Calendar size={15} /> Schedule {selected.size > 0 ? selected.size : ''} Student{selected.size !== 1 ? 's' : ''}</>
            )}
          </button>
        </div>
      </form>

      {/* Result Summary */}
      {result && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex flex-wrap gap-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-700">{result.scheduled}</p>
            <p className="text-xs text-green-600 font-medium">Scheduled</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{result.skipped}</p>
            <p className="text-xs text-yellow-600 font-medium">Skipped</p>
          </div>
          {result.failed > 0 && (
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{result.failed}</p>
              <p className="text-xs text-red-600 font-medium">Failed</p>
            </div>
          )}
          {result.details?.skipped?.length > 0 && (
            <div className="w-full text-xs text-gray-500">
              <p className="font-medium mb-1">Skipped reasons:</p>
              {result.details.skipped.map((s, i) => (
                <p key={i}>• ID {s.id}: {s.reason}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Student List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={students.length > 0 && selected.size === students.length}
              onChange={e => toggleAll(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#102A71] focus:ring-[#102A71]"
            />
            <span className="text-sm font-semibold text-[#001840]">
              SSC Applicants Awaiting Schedule
            </span>
            <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5 rounded-full">
              {students.length}
            </span>
          </div>
          <button
            onClick={loadStudents}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm">
            <RefreshCw size={14} className="animate-spin" /> Loading...
          </div>
        ) : students.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 size={22} className="text-green-600" />
            </div>
            <p className="text-sm font-medium text-gray-600">All SSC applicants have been scheduled</p>
            <p className="text-xs text-gray-400 mt-1">No pending SSC exam scheduling</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {students.map(s => (
              <div
                key={s.id}
                onClick={() => toggleOne(s.id)}
                className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-colors ${
                  selected.has(s.id) ? 'bg-[#EEF2FF]' : 'hover:bg-gray-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selected.has(s.id)}
                  onChange={() => toggleOne(s.id)}
                  onClick={e => e.stopPropagation()}
                  className="w-4 h-4 rounded border-gray-300 text-[#102A71] focus:ring-[#102A71] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#001840] truncate">
                    {s.firstName} {s.middleName ? s.middleName[0] + '. ' : ''}{s.familyName}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {s.gradeLevel} · LRN: {s.lrn || '—'} · Applied: {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '—'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  {s.grade6Average && (
                    <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                      G6 Avg: {s.grade6Average}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sections Tab ──────────────────────────────────────────────────────────────
function SectionsTab() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);       // which section is expanded
  const [sectionStudents, setSectionStudents] = useState({});
  const [studentsLoading, setStudentsLoading] = useState({});
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/admin/sections`, { headers: tok() })
      .then(r => r.ok ? r.json() : Promise.reject('Failed'))
      .then(d => setSections(Array.isArray(d) ? d : d.sections || []))
      .catch(err => toast.error(typeof err === 'string' ? err : 'Failed to load sections'))
      .finally(() => setLoading(false));
  }, [refreshKey]);

  async function toggleSection(sectionId) {
    if (expandedId === sectionId) { setExpandedId(null); return; }
    setExpandedId(sectionId);
    if (sectionStudents[sectionId]) return; // already loaded
    setStudentsLoading(prev => ({ ...prev, [sectionId]: true }));
    try {
      const res = await fetch(`${API}/admin/sections/${sectionId}/students`, { headers: tok() });
      if (!res.ok) throw new Error('Failed');
      const data = await res.json();
      setSectionStudents(prev => ({ ...prev, [sectionId]: Array.isArray(data) ? data : (data.students || []) }));
    } catch {
      toast.error('Failed to load students for this section');
    } finally {
      setStudentsLoading(prev => ({ ...prev, [sectionId]: false }));
    }
  }

  function handleTransferSuccess() {
    setSectionStudents({});
    setRefreshKey(k => k + 1);
  }

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">Click a section to view enrolled students and transfer them.</p>
        <button onClick={() => setRefreshKey(k => k + 1)}
          className="p-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw size={13} className="text-gray-400" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 gap-2 text-gray-400 text-sm bg-white rounded-2xl border border-gray-100">
          <RefreshCw size={15} className="animate-spin" /> Loading sections...
        </div>
      ) : sections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 bg-white rounded-2xl border border-gray-100">
          <BookOpen size={36} className="mb-3 opacity-40" />
          <p className="text-sm">No sections available</p>
        </div>
      ) : (
        sections.map(s => {
          const full = (s.currentEnrollment || 0) >= (s.capacity || 0);
          const pct = s.capacity ? Math.round((s.currentEnrollment / s.capacity) * 100) : 0;
          const isExpanded = expandedId === s.id;
          const students = sectionStudents[s.id] || [];
          const loadingStudents = studentsLoading[s.id];

          return (
            <div key={s.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {/* Section header row — clickable to expand */}
              <button type="button" onClick={() => toggleSection(s.id)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors text-left">
                <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-1 text-sm">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Section</p>
                    <p className="font-bold text-[#001840]">{s.code}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Level</p>
                    <p className="text-gray-700">{s.course} · G{s.yearLevel}{s.strand ? ` · ${s.strand}` : ''}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Adviser</p>
                    <p className="text-gray-600 truncate">{s.instructor || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Schedule</p>
                    <p className="text-gray-500 text-xs truncate">{s.schedule || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Room</p>
                    <p className="text-gray-500 text-xs">{s.room || '—'}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Enrolled</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`text-sm font-semibold ${full ? 'text-red-500' : 'text-gray-700'}`}>
                        {s.currentEnrollment ?? 0}/{s.capacity ?? '—'}
                      </span>
                      <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${pct >= 100 ? 'bg-red-400' : pct >= 75 ? 'bg-yellow-400' : 'bg-green-400'}`}
                          style={{ width: `${Math.min(pct, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
                <ChevronRight size={16} className={`text-gray-300 shrink-0 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>

              {/* Expanded student list */}
              {isExpanded && (
                <div className="border-t border-gray-50">
                  {loadingStudents ? (
                    <div className="flex items-center justify-center py-8 gap-2 text-gray-400 text-sm">
                      <RefreshCw size={13} className="animate-spin" /> Loading students...
                    </div>
                  ) : students.length === 0 ? (
                    <div className="flex items-center justify-center py-8 text-gray-400 text-sm">
                      No students enrolled in this section yet
                    </div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-gray-50/60 border-b border-gray-50">
                          {['Section', 'Level / Grade', 'LRN / Student No.', 'Enrollment Type', 'Status'].map(h => (
                            <th key={h} className="text-left px-5 py-2.5 text-xs font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {students.map(st => {
                          const name = (st.firstName || st.familyName)
                            ? `${st.firstName || ''} ${st.familyName || ''}`.trim()
                            : (st.name || `Student #${st.id}`);
                          return (
                            <tr key={st.id} className="hover:bg-gray-50/40 transition-colors">
                              <td className="px-5 py-3">
                                <p className="font-medium text-gray-800">{name}</p>
                                <p className="text-xs text-gray-400">{st.email || ''}</p>
                              </td>
                              <td className="px-5 py-3 text-gray-500 text-xs">
                                {st.lrn && <p>LRN: {st.lrn}</p>}
                                {st.studentNumber && <p>ID: {st.studentNumber}</p>}
                                {!st.lrn && !st.studentNumber && '—'}
                              </td>
                              <td className="px-5 py-3 capitalize text-gray-500 text-xs">{st.enrollmentType || '—'}</td>
                              <td className="px-5 py-3">
                                <LifeStatusBadge status={st.lifeStatus} />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function RegistrarDashboard() {
  const { user, isLoggedIn, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  // Auth guard
  useEffect(() => {
    if (authLoading) return;
    if (!isLoggedIn) { navigate('/login'); return; }
    if (user?.role !== 'registrar') { navigate('/'); return; }
  }, [authLoading, isLoggedIn, user, navigate]);

  // Fetch overview data
  useEffect(() => {
    if (authLoading || !isLoggedIn || user?.role !== 'registrar') return;
    setDataLoading(true);
    Promise.all([
      fetch(`${API}/registrar/stats`, { headers: tok() }),
      fetch(`${API}/registrar/enrollments`, { headers: tok() }),
    ]).then(async ([statsRes, listRes]) => {
      if (statsRes.status === 401 || statsRes.status === 403) { navigate('/login'); return; }
      if (statsRes.ok) {
        const d = await statsRes.json();
        setStats(d.summary || d.stats || d);
      }
      if (listRes.ok) {
        const d = await listRes.json();
        setRecentEnrollments(Array.isArray(d) ? d : d.enrollments || []);
      }
    }).catch(console.error).finally(() => setDataLoading(false));
  }, [authLoading, isLoggedIn, user, navigate, refreshKey]);

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const navItems = [
    { id: 'overview',    label: 'Overview',        icon: LayoutDashboard },
    { id: 'enrollments', label: 'Enrollments',     icon: ClipboardList },
    { id: 'students',    label: 'Students',        icon: Users },
    { id: 'ssc',         label: 'SSC Scheduling',  icon: Calendar },
    { id: 'sections',    label: 'Sections',        icon: BookOpen },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-400">
          <RefreshCw size={20} className="animate-spin" />
          <span className="text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn || user?.role !== 'registrar') return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 bg-[#001840] flex flex-col transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-60' : 'w-16'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
          <div className="w-8 h-8 bg-[#F5C400] rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen size={17} className="text-[#001840]" />
          </div>
          {sidebarOpen && (
            <div className="overflow-hidden">
              <p className="text-white font-bold text-sm leading-tight">Registrar</p>
              <p className="text-white/40 text-xs">Management Portal</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left ${
                activeTab === item.id
                  ? 'bg-[#F5C400] text-[#001840] font-semibold'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}>
              <item.icon size={17} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-sm truncate">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div className="px-2 py-4 border-t border-white/10 space-y-1">
          {sidebarOpen && (
            <div className="px-3 py-2 mb-1">
              <p className="text-white text-sm font-medium truncate">{user?.name || user?.email}</p>
              <p className="text-white/40 text-xs capitalize">{user?.role}</p>
            </div>
          )}
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:bg-white/10 hover:text-white transition-all duration-150">
            <LogOut size={17} className="flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'ml-60' : 'ml-16'}`}>
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
          <button onClick={() => setSidebarOpen(o => !o)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Menu size={17} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-semibold text-[#001840]">
              {navItems.find(n => n.id === activeTab)?.label}
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date().toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button onClick={() => setRefreshKey(k => k + 1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Refresh">
            <RefreshCw size={15} className="text-gray-500" />
          </button>
          <div className="w-8 h-8 bg-[#001840] rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {(user?.name || user?.email || 'R')[0].toUpperCase()}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6">
          {activeTab === 'overview' && (
            dataLoading ? (
              <div className="flex items-center justify-center py-20 gap-2 text-gray-400 text-sm">
                <RefreshCw size={15} className="animate-spin" /> Loading dashboard...
              </div>
            ) : (
              <OverviewTab
                stats={stats}
                recentEnrollments={recentEnrollments}
                onRefresh={() => setRefreshKey(k => k + 1)}
              />
            )
          )}
          {activeTab === 'enrollments' && (
            <EnrollmentsTab onActionSuccess={() => setRefreshKey(k => k + 1)} />
          )}
          {activeTab === 'students' && <StudentsTab />}
          {activeTab === 'ssc' && <SSCBulkTab />}
          {activeTab === 'sections' && <SectionsTab />}
        </main>
      </div>
    </div>
  );
}

export default RegistrarDashboard;
