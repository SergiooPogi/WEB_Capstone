import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, BookOpen, Check, Clock, Calendar } from 'lucide-react';

const API = 'http://localhost:3000/api';
const token = () => localStorage.getItem('token');
const headers = () => ({ 'Authorization': `Bearer ${token()}`, 'Content-Type': 'application/json' });

const PROGRAMS = ['JHS', 'SHS'];
const SHS_STRANDS = ['STEM', 'ABM', 'HUMSS', 'TVL', 'Sports', 'Arts and Design'];
const JHS_GRADE_LEVELS = [7, 8, 9, 10];
const SHS_GRADE_LEVELS = [11, 12];
const SEMESTERS = ['1st Semester', '2nd Semester'];

// ── Close School Year Button ──────────────────────────────────────────────────
function CloseSchoolYearButton() {
  const [closing, setClosing] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [result, setResult] = useState(null);

  async function handleClose() {
    setClosing(true);
    try {
      const res = await fetch(`${API}/admin/academic/close-school-year`, {
        method: 'POST', headers: headers(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed');
      setResult(data.message);
      toast.success(data.message);
      setConfirm(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setClosing(false);
    }
  }

  if (result) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-3 text-sm text-green-800 font-medium">
        ✅ {result}
      </div>
    );
  }

  if (confirm) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-red-800 mb-2">Are you sure?</p>
        <p className="text-xs text-red-700 mb-3">
          All students with status <strong>Enrolled</strong> will be moved to <strong>Completed</strong>. 
          Students will then be able to re-enroll for the next school year.
        </p>
        <div className="flex gap-2">
          <button onClick={() => setConfirm(false)}
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={handleClose} disabled={closing}
            className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 disabled:opacity-60">
            {closing ? 'Processing...' : 'Yes, Close School Year'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="flex items-center gap-2 px-4 py-2 border-2 border-red-300 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition-colors">
      🎓 Close School Year &amp; Complete All Enrollments
    </button>
  );
}

// ── Grading Periods Panel ─────────────────────────────────────────────────────
function GradingPeriodsPanel() {
  const [periods, setPeriods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [schoolYears, setSchoolYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');

  const QUARTER_CFG = {
    Q1: { label: 'Quarter 1', color: 'blue' },
    Q2: { label: 'Quarter 2', color: 'purple' },
    Q3: { label: 'Quarter 3', color: 'orange' },
    Q4: { label: 'Quarter 4', color: 'green' },
  };

  async function loadYears() {
    try {
      const res = await fetch(`${API}/academic/school-years`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSchoolYears(data);
        const active = data.find(sy => sy.isActive);
        if (active) setSelectedYear(active.year);
      }
    } catch (_) {}
  }

  async function loadPeriods(year) {
    if (!year) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/grading-periods?schoolYear=${encodeURIComponent(year)}`, { headers: headers() });
      const data = await res.json();
      setPeriods(Array.isArray(data) ? data : []);
    } catch (_) { setPeriods([]); }
    finally { setLoading(false); }
  }

  async function setupPeriods() {
    setActionLoading('setup');
    try {
      const res = await fetch(`${API}/admin/grading-periods/setup`, {
        method: 'POST', headers: headers(),
        body: JSON.stringify({ schoolYear: selectedYear || undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      toast.success(data.message);
      loadPeriods(selectedYear);
    } catch (err) { toast.error(err.message); }
    finally { setActionLoading(null); }
  }

  async function togglePeriod(period) {
    setActionLoading(period.id);
    const action = period.isOpen ? 'close' : 'open';
    try {
      const res = await fetch(`${API}/admin/grading-periods/${period.id}/${action}`, {
        method: 'PUT', headers: headers(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      toast.success(data.message);
      loadPeriods(selectedYear);
    } catch (err) { toast.error(err.message); }
    finally { setActionLoading(null); }
  }

  useEffect(() => { loadYears(); }, []);
  useEffect(() => { if (selectedYear) loadPeriods(selectedYear); }, [selectedYear]);

  const colorMap = {
    blue:   { bg: 'bg-blue-50',   openBorder: 'border-blue-400',   closedBorder: 'border-blue-200',   badge: 'bg-blue-500',   text: 'text-blue-700',   btn: 'bg-blue-600 hover:bg-blue-700'   },
    purple: { bg: 'bg-purple-50', openBorder: 'border-purple-400', closedBorder: 'border-purple-200', badge: 'bg-purple-500', text: 'text-purple-700', btn: 'bg-purple-600 hover:bg-purple-700' },
    orange: { bg: 'bg-orange-50', openBorder: 'border-orange-400', closedBorder: 'border-orange-200', badge: 'bg-orange-500', text: 'text-orange-700', btn: 'bg-orange-600 hover:bg-orange-700' },
    green:  { bg: 'bg-green-50',  openBorder: 'border-green-400',  closedBorder: 'border-green-200',  badge: 'bg-green-500',  text: 'text-green-700',  btn: 'bg-green-600 hover:bg-green-700'  },
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-bold text-[#001840]">Grading Periods</h3>
          <p className="text-xs text-gray-500 mt-0.5">Open or close quarters to control when teachers can enter grades</p>
        </div>
        <div className="flex gap-2 items-center">
          <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white">
            <option value="">Select school year</option>
            {schoolYears.map(sy => <option key={sy.id} value={sy.year}>{sy.year}{sy.isActive ? ' (Active)' : ''}</option>)}
          </select>
          {selectedYear && (
            <button onClick={setupPeriods} disabled={actionLoading === 'setup'}
              className="px-4 py-2 bg-[#102A71] text-white rounded-lg text-sm font-semibold hover:bg-[#001840] disabled:opacity-50 transition-colors">
              {actionLoading === 'setup' ? 'Setting up...' : 'Setup Q1–Q4'}
            </button>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-xs text-blue-700 leading-relaxed">
        <strong>How it works:</strong> Click <em>Setup Q1–Q4</em> to create the four quarters for the selected school year.
        Then <strong>Open</strong> a quarter when ready for grade entry, and <strong>Close</strong> it to lock grades when the period ends.
      </div>

      {!selectedYear ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">Select a school year above</div>
      ) : loading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-400 text-sm">Loading...</div>
      ) : periods.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500 text-sm mb-3">No grading periods for {selectedYear} yet.</p>
          <button onClick={setupPeriods} disabled={actionLoading === 'setup'}
            className="px-4 py-2 bg-[#F5C400] text-[#001840] rounded-lg text-sm font-semibold hover:bg-[#FFDC5F] disabled:opacity-50">
            {actionLoading === 'setup' ? 'Setting up...' : 'Setup Q1–Q4 Now'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {periods.map(period => {
            const cfg = QUARTER_CFG[period.quarter] || { label: period.quarter, color: 'blue' };
            const c = colorMap[cfg.color] || colorMap.blue;
            const isActioning = actionLoading === period.id;
            return (
              <div key={period.id}
                className={`rounded-2xl border-2 p-5 transition-all ${c.bg} ${period.isOpen ? c.openBorder : c.closedBorder}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-[#001840]">{period.quarter}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full text-white ${period.isOpen ? c.badge : 'bg-gray-300'}`}>
                    {period.isOpen ? 'Open' : 'Closed'}
                  </span>
                </div>
                <p className={`text-xs font-medium mb-1 ${c.text}`}>{cfg.label}</p>
                <p className="text-[10px] text-gray-400 mb-4">
                  {period.isOpen && period.openedAt ? `Opened ${new Date(period.openedAt).toLocaleDateString('en-PH')}` :
                   period.closedAt ? `Closed ${new Date(period.closedAt).toLocaleDateString('en-PH')}` : 'Not yet opened'}
                </p>
                <button onClick={() => togglePeriod(period)} disabled={isActioning}
                  className={`w-full py-2 rounded-xl text-white text-xs font-bold transition-colors disabled:opacity-50 ${period.isOpen ? 'bg-red-500 hover:bg-red-600' : c.btn}`}>
                  {isActioning ? '...' : period.isOpen ? 'Close Quarter' : 'Open Quarter'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── AcademicSetup ─────────────────────────────────────────────────────────────
export function AcademicSetup() {
  const [tab, setTab] = useState('subjects');
  const [subjects, setSubjects] = useState([]);
  const [schoolYears, setSchoolYears] = useState([]);
  const [filterProgram, setFilterProgram] = useState('JHS');
  const [filterYear, setFilterYear] = useState('');
  const [filterSem, setFilterSem] = useState('');
  const [showSubjectForm, setShowSubjectForm] = useState(false);
  const [showSYForm, setShowSYForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [subjectForm, setSubjectForm] = useState({
    code: '', description: '', units: 1,
    programCode: 'JHS', gradeLevel: 7, semester: '1st Semester', strand: ''
  });
  const [syForm, setSyForm] = useState({ year: '' });

  useEffect(() => { loadAll(); }, []);
  useEffect(() => { loadSubjects(); }, [filterProgram, filterYear, filterSem]);

  async function loadAll() {
    loadSubjects();
    loadSchoolYears();
  }

  async function loadSubjects() {
    try {
      const params = new URLSearchParams({ programCode: filterProgram });
      if (filterYear) params.append('yearLevel', filterYear);
      if (filterSem) params.append('semester', filterSem);
      const res = await fetch(`${API}/academic/subjects?${params}`);
      const data = await res.json();
      setSubjects(Array.isArray(data) ? data : []);
    } catch { setSubjects([]); }
  }

  async function loadSchoolYears() {
    try {
      const res = await fetch(`${API}/academic/school-years`);
      const data = await res.json();
      setSchoolYears(Array.isArray(data) ? data : []);
    } catch { setSchoolYears([]); }
  }

  function resetSubjectForm(programCode = filterProgram) {
    setSubjectForm({
      code: '', description: '', units: 1,
      programCode,
      gradeLevel: programCode === 'JHS' ? 7 : 11,
      semester: '1st Semester',
      strand: ''
    });
  }

  async function saveSubject() {
    if (!subjectForm.code.trim() || !subjectForm.description.trim()) {
      toast.error('Subject code and description are required');
      return;
    }
    const url = editingSubject
      ? `${API}/admin/academic/subjects/${editingSubject.id}`
      : `${API}/admin/academic/subjects`;
    const method = editingSubject ? 'PUT' : 'POST';
    const res = await fetch(url, { method, headers: headers(), body: JSON.stringify(subjectForm) });
    if (res.ok) {
      toast.success(editingSubject ? 'Subject updated' : 'Subject added');
      setShowSubjectForm(false);
      setEditingSubject(null);
      resetSubjectForm();
      loadSubjects();
    } else {
      const err = await res.json().catch(() => ({}));
      toast.error(err.message || 'Failed to save subject');
    }
  }

  async function deleteSubject(id) {
    if (!confirm('Delete this subject?')) return;
    await fetch(`${API}/admin/academic/subjects/${id}`, { method: 'DELETE', headers: headers() });
    toast.success('Subject deleted');
    loadSubjects();
  }

  async function addSchoolYear() {
    if (!syForm.year.trim()) { toast.error('Enter a school year'); return; }
    const res = await fetch(`${API}/admin/academic/school-years`, {
      method: 'POST', headers: headers(), body: JSON.stringify(syForm)
    });
    if (res.ok) {
      toast.success('School year added');
      setShowSYForm(false);
      setSyForm({ year: '' });
      loadSchoolYears();
    } else toast.error('Failed to add school year');
  }

  async function activateSchoolYear(id) {
    await fetch(`${API}/admin/academic/school-years/${id}/activate`, { method: 'PUT', headers: headers() });
    toast.success('Active school year updated');
    loadSchoolYears();
  }

  const isSHS = subjectForm.programCode === 'SHS';
  const gradeLevels = subjectForm.programCode === 'JHS' ? JHS_GRADE_LEVELS : SHS_GRADE_LEVELS;

  const tabs = [
    { id: 'subjects',    label: 'Subjects',        icon: BookOpen },
    { id: 'schoolyears', label: 'School Years',    icon: Calendar },
    { id: 'grading',     label: 'Grading Periods', icon: Clock    },
  ];

  return (
    <div>
      <div className="mb-6">
        <p className="text-gray-500 text-sm">Manage subjects and school years for Junior and Senior High School</p>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                tab === t.id ? 'border-[#102A71] text-[#102A71]' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              <Icon className="w-4 h-4" />{t.label}
            </button>
          );
        })}
      </div>

      {/* ── SUBJECTS TAB ─────────────────────────────────────────────────── */}
      {tab === 'subjects' && (
        <div>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <select value={filterProgram} onChange={e => { setFilterProgram(e.target.value); setFilterYear(''); }}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              {PROGRAMS.map(p => <option key={p}>{p}</option>)}
            </select>
            <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">All Grade Levels</option>
              {(filterProgram === 'JHS' ? JHS_GRADE_LEVELS : SHS_GRADE_LEVELS).map(y => (
                <option key={y} value={y}>Grade {y}</option>
              ))}
            </select>
            <select value={filterSem} onChange={e => setFilterSem(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">All Semesters</option>
              {SEMESTERS.map(s => <option key={s}>{s}</option>)}
            </select>
            <button
              onClick={() => { setEditingSubject(null); resetSubjectForm(); setShowSubjectForm(true); }}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-[#102A71] text-white rounded-lg text-sm font-medium hover:bg-[#001840]">
              <Plus className="w-4 h-4" /> Add Subject
            </button>
          </div>

          {/* Subject Form */}
          {showSubjectForm && (
            <div className="bg-[#FFFDF0] border border-[#F5C400] rounded-xl p-4 mb-4">
              <h3 className="font-semibold text-[#001840] mb-3">
                {editingSubject ? 'Edit Subject' : 'New Subject'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <input placeholder="Subject Code *" value={subjectForm.code}
                  onChange={e => setSubjectForm(p => ({ ...p, code: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                <input placeholder="Description *" value={subjectForm.description}
                  onChange={e => setSubjectForm(p => ({ ...p, description: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm col-span-2" />
                <input type="number" min="0.5" step="0.5" placeholder="Units" value={subjectForm.units}
                  onChange={e => setSubjectForm(p => ({ ...p, units: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                <select value={subjectForm.programCode}
                  onChange={e => {
                    const v = e.target.value;
                    setSubjectForm(p => ({ ...p, programCode: v, gradeLevel: v === 'JHS' ? 7 : 11, strand: '' }));
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  {PROGRAMS.map(p => <option key={p}>{p}</option>)}
                </select>
                <select value={subjectForm.gradeLevel}
                  onChange={e => setSubjectForm(p => ({ ...p, gradeLevel: parseInt(e.target.value) }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  {gradeLevels.map(y => <option key={y} value={y}>Grade {y}</option>)}
                </select>
                <select value={subjectForm.semester}
                  onChange={e => setSubjectForm(p => ({ ...p, semester: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  {SEMESTERS.map(s => <option key={s}>{s}</option>)}
                </select>
                {isSHS && (
                  <select value={subjectForm.strand}
                    onChange={e => setSubjectForm(p => ({ ...p, strand: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option value="">All Strands (Core)</option>
                    {SHS_STRANDS.map(s => <option key={s}>{s}</option>)}
                  </select>
                )}
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={saveSubject}
                  className="px-4 py-2 bg-[#F5C400] text-[#001840] rounded-lg text-sm font-semibold hover:bg-[#FFDC5F]">
                  Save
                </button>
                <button onClick={() => { setShowSubjectForm(false); setEditingSubject(null); }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Subjects Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Code</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Description</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Units</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Grade</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Strand</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Semester</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subjects.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                      No subjects found
                    </td>
                  </tr>
                ) : subjects.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-semibold text-[#102A71]">{s.code}</td>
                    <td className="px-4 py-3">{s.description}</td>
                    <td className="px-4 py-3">{s.units}</td>
                    <td className="px-4 py-3">Grade {s.gradeLevel}</td>
                    <td className="px-4 py-3">
                      {s.strand
                        ? <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs">{s.strand}</span>
                        : <span className="text-gray-400 text-xs">Core</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs">{s.semester}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => {
                          setEditingSubject(s);
                          setSubjectForm({
                            code: s.code, description: s.description, units: s.units,
                            programCode: s.programCode, gradeLevel: s.gradeLevel,
                            semester: s.semester, strand: s.strand || ''
                          });
                          setShowSubjectForm(true);
                        }} className="p-1.5 text-[#102A71] hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteSubject(s.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SCHOOL YEARS TAB ─────────────────────────────────────────────── */}
      {tab === 'schoolyears' && (
        <div className="space-y-6">
          {/* Close School Year */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-[#001840]">End of School Year</h3>
                <p className="text-xs text-gray-500">Mark all enrolled students as Completed so they can re-enroll next year</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-3">
              This marks all currently enrolled students as <span className="font-semibold text-gray-600">Completed</span>.
              This action cannot be undone.
            </p>
            <CloseSchoolYearButton />
          </div>

          {/* School Years */}
          <div>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowSYForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#102A71] text-white rounded-lg text-sm font-medium hover:bg-[#001840]">
                <Plus className="w-4 h-4" /> Add School Year
              </button>
            </div>

            {showSYForm && (
              <div className="bg-[#FFFDF0] border border-[#F5C400] rounded-xl p-4 mb-4">
                <h3 className="font-semibold text-[#001840] mb-3">New School Year</h3>
                <input placeholder="e.g. 2026-2027" value={syForm.year}
                  onChange={e => setSyForm({ year: e.target.value })}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm mr-3" />
                <button onClick={addSchoolYear}
                  className="px-4 py-2 bg-[#F5C400] text-[#001840] rounded-lg text-sm font-semibold mr-2 hover:bg-[#FFDC5F]">
                  Save
                </button>
                <button onClick={() => setShowSYForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {schoolYears.map(sy => (
                <div key={sy.id}
                  className={`p-4 rounded-xl border-2 ${sy.isActive ? 'border-[#F5C400] bg-[#FFFDF0]' : 'border-gray-200 bg-white'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#001840] text-lg">{sy.year}</p>
                      {sy.isActive && (
                        <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      )}
                    </div>
                    {!sy.isActive && (
                      <button onClick={() => activateSchoolYear(sy.id)}
                        className="px-3 py-1.5 text-xs font-semibold bg-[#102A71] text-white rounded-lg hover:bg-[#001840]">
                        Set Active
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── GRADING PERIODS TAB ──────────────────────────────────────────── */}
      {tab === 'grading' && <GradingPeriodsPanel />}
    </div>
  );
}
