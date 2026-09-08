import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { toast } from "sonner";
import { CheckCircle2, Upload, X, Loader2, FileText, ArrowLeft } from "lucide-react";
import { uploadEnrollmentDocuments, getEnrollmentById } from "../services/enrollmentApi";
const JHS_GRADES = ["Grade 7","Grade 8","Grade 9","Grade 10"];
const SHS_GRADES = ["Grade 11","Grade 12"];
const SHS_STRANDS = ["STEM","ABM","HUMSS","TVL","Sports","Arts and Design"];

// Documents for regular (new / old) students
const HS_CREDS = [
  { key:"f138",  label:"F-138 (Report Card)",               required: true  },
  { key:"f137a", label:"F-137-A (Permanent Record)",         required: false },
  { key:"cert",  label:"Certificate of Good Moral Character",required: true  },
  { key:"f137e", label:"F-137-E (Elementary Record)",        required: false },
];

// Additional / different documents required for transferees
const TRANSFEREE_CREDS = [
  { key:"f138",  label:"F-138 (Report Card from previous school)", required: true  },
  { key:"f137a", label:"F-137-A (Permanent Record / TOR)",         required: true  },
  { key:"cert",  label:"GMRC / Certificate of Good Moral Character", required: true  },
  { key:"f137e", label:"Honorable Dismissal / Transfer Credential", required: true  },
];
const API = "http://localhost:3000/api";
const onlyDigits = (e) => { if (!/[0-9]/.test(e.key) && !["Backspace","Tab","ArrowLeft","ArrowRight","Delete"].includes(e.key)) e.preventDefault(); };
const onlyLetters = (e) => { if (!/[a-zA-Z\s\-']/.test(e.key) && !["Backspace","Tab","ArrowLeft","ArrowRight","Delete"].includes(e.key)) e.preventDefault(); };
function F({label,required,error,children}){return(<div className="flex flex-col gap-1"><label className="text-sm font-semibold text-[#001840]">{label}{required&&<span className="text-red-500 ml-1">*</span>}</label>{children}{error&&<p className="text-xs text-red-500 mt-0.5">{error}</p>}</div>);}
function I({error,...p}){return(<input {...p} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${error?"border-red-400 focus:ring-red-200":"border-gray-200 focus:ring-[#102A71]/20 focus:border-[#102A71]"} bg-white text-[#001840]`}/>);}
function S({error,children,...p}){return(<select {...p} className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all bg-white text-[#001840] ${error?"border-red-400 focus:ring-red-200":"border-gray-200 focus:ring-[#102A71]/20 focus:border-[#102A71]"}`}>{children}</select>);}
const SAVE_KEY = "hs_enrollment_draft";

export function HSEnrollmentForm({enrollmentId:propId,readOnly=false}){
  const { id: paramId } = useParams();
  const location = useLocation();
  // sscEnrollmentId comes from MyEnrollments when student needs to complete SSC placeholder
  const sscEnrollmentId = location.state?.sscEnrollmentId || null;
  const prefill = location.state?.prefill || null; // carry-over pre-fill data
  const isCarryOver = !!location.state?.carryOver;
  const id = propId || paramId || sscEnrollmentId || null;
  const isEditMode = !!id;
  const navigate=useNavigate();
  const [step,setStep]=useState(()=>{
    // In edit mode, always start at step 1 — ignore any draft step
    if (isEditMode) return 1;
    try { const s=localStorage.getItem(SAVE_KEY+"_step"); return s?parseInt(s):1; } catch(_){return 1;}
  });
  const [errors,setErrors]=useState({});
  const [submitting,setSubmitting]=useState(false);
  const [showBackDialog,setShowBackDialog]=useState(false);

  // educationLevel passed from LevelSelection — lock it for the entire session
  const initialLevel = location.state?.educationLevel || 'JHS';

  const defaultForm = {educationLevel:initialLevel,gradeLevel:"",strand:"",studentType:"New",academicYear:"2025-2026",dateEnrolled:"",studentNumber:"",lrn:"",familyName:"",firstName:"",middleName:"",sex:"",dateOfBirth:"",placeOfBirth:"",fatherName:"",fatherOccupation:"",motherName:"",motherOccupation:"",parentsAddress:"",guardianName:"",guardianOccupation:"",guardianAddress:"",guardianTelephone:"",grade6School:"",grade6SchoolAddress:"",grade6Section:"",grade6SYStart:"",grade6SYEnd:"",grade6Average:"",grade6Remarks:"",lastHSSchool:"",lastHSCurriculumYear:"",lastHSSection:"",lastHSSYStart:"",lastHSSYEnd:"",sscApplied:false,studentSignature:"",parentGuardianSignature:"",credentials:{},docFiles:{}};

  // Load saved draft on mount — skipped in edit mode or carry-over
  const [form,setF]=useState(()=>{
    if (isEditMode) return defaultForm;
    // Carry-over: pre-fill from previous enrollment
    if (isCarryOver && prefill) {
      return { ...defaultForm, ...prefill, docFiles: {}, credentials: {} };
    }
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) { const parsed = JSON.parse(saved); return {...defaultForm,...parsed, educationLevel: initialLevel, docFiles:{}}; }
    } catch(_) {}
    return defaultForm;
  });

  // Detect if this is an SSC placeholder being completed (edit mode, sscApplied, no firstName loaded yet)
  const [isSSCCompletion, setIsSSCCompletion] = useState(false);
  const [sscChosenClass, setSscChosenClass] = useState(null); // 'SSC' | 'Regular'

  // Load existing enrollment when editing
  useEffect(()=>{
    if (!isEditMode) return;
    getEnrollmentById(id).then(data => {
      const e = data.enrollment || data;
      // Detect SSC placeholder that has actually passed the exam (sscApplied, no firstName yet, and sscResult='passed')
      // NOTE: sscApplied+!firstName alone is NOT enough — the student may have only applied and not yet taken/passed the exam
      const sscPlaceholder = !!e.sscApplied && !e.firstName && e.sscResult === 'passed';
      setIsSSCCompletion(sscPlaceholder);
      if (sscPlaceholder) setSscChosenClass(e.sscClass || 'SSC'); // default SSC if somehow null
      setF(prev => ({
        ...prev,
        educationLevel: e.educationLevel || 'JHS',
        // SSC placeholder: grade level is Grade 7, keep it locked
        gradeLevel: e.gradeLevel || (sscPlaceholder ? 'Grade 7' : ''),
        strand: e.strand || '',
        enrollmentType: e.enrollmentType || 'new',
        studentType: e.studentType || 'New',
        academicYear: e.academicYear || '2025-2026',
        dateEnrolled: e.dateEnrolled || '',
        studentNumber: e.studentNumber || '',
        lrn: e.lrn || '',
        familyName: e.familyName || '',
        firstName: e.firstName || '',
        middleName: e.middleName || '',
        sex: e.sex || '',
        dateOfBirth: e.dateOfBirth || '',
        placeOfBirth: e.placeOfBirth || '',
        fatherName: e.fatherName || '',
        fatherOccupation: e.fatherOccupation || '',
        motherName: e.motherName || '',
        motherOccupation: e.motherOccupation || '',
        parentsAddress: e.parentsAddress || '',
        guardianName: e.guardianName || '',
        guardianOccupation: e.guardianOccupation || '',
        guardianAddress: e.guardianAddress || '',
        guardianTelephone: e.guardianTelephone || '',
        grade6School: e.grade6School || '',
        grade6SchoolAddress: e.grade6SchoolAddress || '',
        grade6Section: e.grade6Section || '',
        grade6SYStart: e.grade6SYStart || '',
        grade6SYEnd: e.grade6SYEnd || '',
        grade6Average: e.grade6Average || '',
        grade6Remarks: e.grade6Remarks || '',
        lastHSSchool: e.lastHSSchool || '',
        lastHSCurriculumYear: e.lastHSCurriculumYear || '',
        lastHSSection: e.lastHSSection || '',
        lastHSSYStart: e.lastHSSYStart || '',
        lastHSSYEnd: e.lastHSSYEnd || '',
        sscApplied: !!e.sscApplied,
        studentSignature: e.studentSignature || '',
        parentGuardianSignature: e.parentGuardianSignature || '',
        credentials: Array.isArray(e.admissionCredentials)
          ? Object.fromEntries(e.admissionCredentials.map(k => [k, true]))
          : {},
        docFiles: {},
      }));
      setStep(1);
    }).catch(() => toast.error('Failed to load enrollment data'));
  }, [id]);

  // Auto-save form to localStorage on every change — skip in edit mode or carry-over
  useEffect(()=>{
    if (isEditMode || isCarryOver) return;
    try {
      const {docFiles,...saveable}=form;
      localStorage.setItem(SAVE_KEY, JSON.stringify(saveable));
    } catch(_){}
  },[form]);
  useEffect(()=>{ localStorage.setItem(SAVE_KEY+"_step", step); },[step]);
  const set=(k,v)=>setF(p=>({...p,[k]:v}));
  const [previewModal, setPreviewModal] = useState(null); // { url, name, isPdf }
  const [lrnTaken, setLrnTaken] = useState(false);
  const lrnTimer = useRef(null);
  const checkLrn = (val) => {
    clearTimeout(lrnTimer.current);
    if (val.length < 12) { setLrnTaken(false); return; }
    lrnTimer.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API}/enrollments/check-lrn?lrn=${val}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setLrnTaken(data.taken);
      } catch { setLrnTaken(false); }
    }, 500);
  };
  const isG7=form.gradeLevel==="Grade 7";
  const isSHS=form.educationLevel==="SHS";
  const isTransferee = form.enrollmentType === 'transferee';
  const grades=isSHS?SHS_GRADES:JHS_GRADES;
  const total=5;
  const docStep=5;
  const labels=["Grade & Type","Personal Info","Family","Education","Documents"];
  // Active credential list depends on enrollment type
  const activeCreds = isTransferee ? TRANSFEREE_CREDS : HS_CREDS;
  function validate(s){
    const e={};
    if(s===1){
      if(!form.gradeLevel)e.gradeLevel="Grade level is required";
      if(isSHS&&!form.strand)e.strand="Strand is required";
      // SSC completion: enrollmentType defaults to 'new', no need to force selection
      if(!isSSCCompletion && !form.enrollmentType)e.enrollmentType="Please select an enrollment type";
      // Validate student ID only if filled (optional for new students)
      if(form.studentNumber && form.studentNumber.trim()){
        const idPattern = /^\d{4}-\d{5}$/;
        if(!idPattern.test(form.studentNumber.trim())){
          e.studentNumber="Invalid format. Use YYYY-NNNNN (e.g. 2025-00123)";
        }
      }
    }
    if(s===2){if(!form.familyName.trim())e.familyName="Required";else if(/\d/.test(form.familyName))e.familyName="No numbers";if(!form.firstName.trim())e.firstName="Required";else if(/\d/.test(form.firstName))e.firstName="No numbers";if(!form.sex)e.sex="Required";if(!form.dateOfBirth)e.dateOfBirth="Required";}
    if(s===4){
      // Transferees must fill in their last HS school info
      if(isTransferee){
        if(!form.lastHSSchool?.trim()) e.lastHSSchool="Required for transferees";
        if(!form.lastHSCurriculumYear?.trim()) e.lastHSCurriculumYear="Required for transferees";
        if(!form.lastHSSYStart?.trim()) e.lastHSSYStart="Required for transferees";
        if(!form.lastHSSYEnd?.trim()) e.lastHSSYEnd="Required for transferees";
      }
    }
    if(s===docStep){
      const requiredCreds = activeCreds.filter(c => c.required);
      const missingRequired = requiredCreds.filter(c => !form.docFiles[c.key]);
      // For SSC completion, docs are optional — student can add them on the resubmit page
      if(!isEditMode){
        if(isTransferee && missingRequired.length > 0){
          e.credentials=`Please upload all required documents: ${missingRequired.map(c=>c.label).join(', ')}.`;
        } else if(!isTransferee && activeCreds.filter(c=>form.docFiles[c.key]).length === 0){
          e.credentials="Please upload at least one document before submitting.";
        }
      }
    }
    return e;
  }
  function stepFill(s){
    if(s===1){const fields=[form.gradeLevel,isSHS?form.strand:null].filter(f=>f!==null);const filled=fields.filter(Boolean).length;return Math.round((filled/fields.length)*100);}
    if(s===2){const fields=[form.familyName,form.firstName,form.sex,form.dateOfBirth];const filled=fields.filter(Boolean).length;return Math.round((filled/fields.length)*100);}
    if(s===3){const fields=[form.fatherName,form.motherName,form.parentsAddress];const filled=fields.filter(Boolean).length;return Math.round((filled/fields.length)*100);}
    if(s===4){const fields=[form.grade6School,form.grade6Average];const filled=fields.filter(Boolean).length;return Math.round((filled/fields.length)*100);}
    if(s===docStep){const uploaded=activeCreds.filter(c=>form.docFiles[c.key]).length;return Math.round((uploaded/activeCreds.length)*100);}
    return 0;
  }

  function goToStep(target){
    if(target===step)return;
    setErrors({});setStep(target);window.scrollTo({top:0,behavior:"smooth"});
  }
  function handleBack(){ setShowBackDialog(true); }
  function clearDraft(){ localStorage.removeItem(SAVE_KEY); localStorage.removeItem(SAVE_KEY+"_step"); }
  async function submit(){
    const e=validate(docStep);if(Object.keys(e).length>0){setErrors(e);return;}
    setSubmitting(true);
    try{
      const payload={
        educationLevel:form.educationLevel,
        gradeLevel:form.gradeLevel,
        strand:form.strand||null,
        enrollmentType:form.enrollmentType||'new',
        studentType:form.studentType,
        studentNumber:form.studentNumber||null,
        academicYear:form.academicYear,
        dateEnrolled:form.dateEnrolled||null,
        lrn:form.lrn,
        familyName:form.familyName,
        firstName:form.firstName,
        middleName:form.middleName,
        sex:form.sex,
        dateOfBirth:form.dateOfBirth,
        placeOfBirth:form.placeOfBirth,
        fatherName:form.fatherName,
        fatherOccupation:form.fatherOccupation,
        motherName:form.motherName,
        motherOccupation:form.motherOccupation,
        parentsAddress:form.parentsAddress,
        guardianName:form.guardianName,
        guardianOccupation:form.guardianOccupation,
        guardianAddress:form.guardianAddress,
        guardianTelephone:form.guardianTelephone,
        grade6School:form.grade6School,
        grade6SchoolAddress:form.grade6SchoolAddress,
        grade6Section:form.grade6Section,
        grade6SYStart:form.grade6SYStart,
        grade6SYEnd:form.grade6SYEnd,
        grade6Average:form.grade6Average,
        grade6Remarks:form.grade6Remarks,
        lastHSSchool:form.lastHSSchool,
        lastHSCurriculumYear:form.lastHSCurriculumYear,
        lastHSSection:form.lastHSSection,
        lastHSSYStart:form.lastHSSYStart,
        lastHSSYEnd:form.lastHSSYEnd,
        sscApplied:form.sscApplied,
        studentSignature:form.studentSignature,
        parentGuardianSignature:form.parentGuardianSignature,
        admissionCredentials:activeCreds.filter(c=>form.docFiles[c.key]).map(c=>c.key),
        status:"submitted",
      };
      const token=localStorage.getItem("token");

      let eid;
      if (isEditMode) {
        // Update existing enrollment
        const res=await fetch(`${API}/enrollments/${id}`,{
          method:"PUT",
          headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},
          body:JSON.stringify(payload)
        });
        const data=await res.json();
        if(!res.ok)throw new Error(data.message||"Failed to update enrollment");
        eid = id;
        toast.success(
          isSSCCompletion
            ? "Enrollment form completed! The registrar will review your application."
            : "Enrollment updated successfully!"
        );
      } else {
        // Create new enrollment
        const res=await fetch(`${API}/enrollments`,{
          method:"POST",
          headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},
          body:JSON.stringify(payload)
        });
        const data=await res.json();
        if(!res.ok)throw new Error(data.message||"Failed");
        eid=data.enrollment?.id;
        if(!eid) throw new Error("No enrollment ID returned from server");
        toast.success("Enrollment submitted successfully!",{description:`Enrollment ID: ${eid}`});
      }

      // Upload any new documents
      const files={};
      Object.entries(form.docFiles).forEach(([k,f])=>{if(f)files[k]=f;});
      if(Object.keys(files).length>0){
        try{
          await uploadEnrollmentDocuments(eid,files);
        }catch(uploadErr){
          if (!isEditMode) {
            // Rollback only on new enrollment
            try{
              await fetch(`${API}/enrollments/${eid}`,{method:"DELETE",headers:{Authorization:`Bearer ${token}`}});
            }catch(_){}
          }
          throw new Error("Document upload failed: "+uploadErr.message+". Please try again.");
        }
      }
      if (!isEditMode) clearDraft();
      navigate("/my-enrollments");
    }catch(err){toast.error(err.message||"Failed to submit enrollment");}
    finally{setSubmitting(false);}
  }
  const pct=Math.round(((step-1)/(total-1))*100);
  return(
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF0] via-[#FFF9E6] to-[#FFFDF0]">

      {/* File preview modal */}
      {previewModal&&(
        <div className="fixed inset-0 bg-black/70 z-50 flex flex-col">
          <div className="flex items-center justify-between bg-[#001840] px-4 py-3 shrink-0">
            <span className="text-white text-sm font-medium truncate max-w-xs">{previewModal.name}</span>
            <button
              onClick={()=>setPreviewModal(null)}
              className="flex items-center gap-1.5 text-white bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all"
            >
              <X size={14}/> Close
            </button>
          </div>
          <div className="flex-1 overflow-hidden">
            {previewModal.isPdf?(
              <iframe src={previewModal.url} className="w-full h-full border-0" title={previewModal.name}/>
            ):(
              <div className="w-full h-full flex items-center justify-center p-4">
                <img src={previewModal.url} alt={previewModal.name} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"/>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save progress dialog */}
      {showBackDialog&&(
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-[#001840] mb-2">Save your progress?</h3>
            <p className="text-sm text-gray-600 mb-5">Your form data is automatically saved. When you come back, you can continue where you left off.</p>
            <div className="flex gap-3">
              <button onClick={()=>{clearDraft();navigate("/enroll");}} className="flex-1 py-2.5 border-2 border-red-300 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-all">Discard & Leave</button>
              <button onClick={()=>{setShowBackDialog(false);navigate("/enroll");}} className="flex-1 py-2.5 bg-[#102A71] text-white rounded-xl text-sm font-semibold hover:bg-[#001840] transition-all">Save & Leave</button>
            </div>
            <button onClick={()=>setShowBackDialog(false)} className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-gray-600">Stay on form</button>
          </div>
        </div>
      )}

      <div className="bg-white border-b border-gray-100 shadow-sm sticky top-16 lg:top-20 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Back button */}
          <button onClick={handleBack} className="flex items-center gap-1.5 text-sm text-[#102A71] hover:text-[#001840] font-medium mb-3 transition-colors">
            <ArrowLeft size={15}/> Back to Level Selection
          </button>
          <div className="flex items-center justify-between mb-3 relative">
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0"/>
            <div className="absolute top-4 left-0 h-0.5 bg-[#102A71] z-0 transition-all duration-500" style={{width:`${pct}%`}}/>
            {labels.map((lbl,i)=>{
              const sid=i+1;
              const active=sid===step;
              const fill=stepFill(sid);
              const complete=fill===100&&sid!==step;
              // Circle style: active=yellow, complete=solid blue, partial=conic-gradient, empty=outline only
              const circleStyle = complete
                ? {background:"#102A71",border:"2px solid #102A71",color:"#fff"}
                : active
                  ? {background:"#F5C400",border:"2px solid #F5C400",color:"#001840"}
                  : fill>0
                    ? {background:`conic-gradient(#102A71 ${fill*3.6}deg, #e5e7eb ${fill*3.6}deg)`,border:"2px solid #102A71",color:"#102A71"}
                    : {background:"#fff",border:"2px solid #d1d5db",color:"#9ca3af"};
              return(
                <div key={sid} onClick={()=>goToStep(sid)} className="flex flex-col items-center z-10 gap-1 cursor-pointer group">
                  <div style={circleStyle} className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
                    {/* Inner white circle for partial fill to show number */}
                    {fill>0&&!complete&&!active?(
                      <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-[#102A71]">{sid}</div>
                    ):complete?<CheckCircle2 size={14}/>:sid}
                  </div>
                  <span className={`text-[9px] font-medium hidden sm:block text-center leading-tight max-w-[60px] transition-colors ${active?"text-[#001840]":complete?"text-[#102A71]":fill>0?"text-[#102A71]":"text-gray-400 group-hover:text-[#102A71]"}`}>{lbl}</span>
                </div>
              );
            })}          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5"><div className="bg-gradient-to-r from-[#102A71] to-[#F5C400] h-1.5 rounded-full transition-all duration-500" style={{width:`${pct}%`}}/></div>
          <p className="text-xs text-gray-400 mt-1 text-right">Step {step} of {total}</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 pt-4 pb-8">

        {/* SSC Completion Banner */}
        {isSSCCompletion && (
          <div className={`mb-5 border-2 rounded-2xl p-4 flex items-start gap-3 ${
            sscChosenClass === 'Regular'
              ? 'bg-blue-50 border-blue-200'
              : 'bg-green-50 border-green-200'
          }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
              sscChosenClass === 'Regular' ? 'bg-blue-500' : 'bg-green-500'
            }`}>
              <CheckCircle2 size={16} className="text-white" />
            </div>
            <div>
              <p className={`font-bold text-sm ${sscChosenClass === 'Regular' ? 'text-blue-800' : 'text-green-800'}`}>
                {sscChosenClass === 'Regular'
                  ? 'SSC Exam Passed — Enrolling in Regular Class'
                  : 'SSC Application Approved — Complete Your Enrollment'}
              </p>
              <p className={`text-xs mt-0.5 ${sscChosenClass === 'Regular' ? 'text-blue-700' : 'text-green-700'}`}>
                {sscChosenClass === 'Regular'
                  ? 'You passed the SSC exam but chose the Regular class. Please fill out the enrollment form below. Your grade level is locked to Grade 7.'
                  : 'You passed the SSC entrance exam and chose the Special Science Class. Please fill out the full enrollment form below. Your grade level is locked to Grade 7 (SSC).'}
              </p>
            </div>
          </div>
        )}

        {/* Carry-over Banner */}
        {isCarryOver && !isSSCCompletion && (
          <div className="mb-5 bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 size={16} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-blue-800 text-sm">Returning Student — Info Pre-filled</p>
              <p className="text-xs text-blue-700 mt-0.5">
                Your personal information from last year has been copied over. Please review each step, update anything that has changed, and upload your documents for this school year.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#001840]">{labels[step-1]}</h2>
          <p className="text-sm text-gray-500 mt-1">Step {step} of {total}</p>
        </div>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sm:p-8">
          {step===1&&(<div className="space-y-5">
            {/* Lock education level and grade level for SSC completion */}
            {isSSCCompletion ? (
              <div className={`flex gap-3 p-3 rounded-xl border ${
                sscChosenClass === 'Regular'
                  ? 'bg-blue-50 border-blue-200'
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div>
                  <p className={`text-xs font-semibold ${sscChosenClass === 'Regular' ? 'text-blue-800' : 'text-yellow-800'}`}>Education Level</p>
                  <p className="text-sm font-bold text-[#001840]">
                    Junior High School — Grade 7 {sscChosenClass === 'SSC' ? '(SSC)' : '(Regular)'}
                  </p>
                  <p className={`text-xs mt-0.5 ${sscChosenClass === 'Regular' ? 'text-blue-700' : 'text-yellow-700'}`}>
                    Locked — you chose the {sscChosenClass === 'Regular' ? 'Regular' : 'Special Science'} class after passing the SSC exam
                  </p>
                </div>
              </div>
            ) : isEditMode || isCarryOver ? (
              /* Edit mode — lock level and grade, show as read-only */
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                <p className="text-xs font-semibold text-gray-500 mb-1">Education Level & Grade</p>
                <p className="text-sm font-bold text-[#001840]">
                  {form.educationLevel} — {form.gradeLevel || '—'}
                  {form.strand ? ` (${form.strand})` : ''}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">Locked — education level cannot be changed after submission</p>
              </div>
            ) : (
              <>
                {/* Education level is locked to whatever was chosen on the Level Selection page */}
                <div className="flex gap-3 mb-2">
                  {["JHS","SHS"].map(lvl=>(
                    <button key={lvl} type="button" disabled={lvl !== form.educationLevel}
                      className={`px-6 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all ${
                        form.educationLevel===lvl
                          ? "border-[#102A71] bg-[#EEF2FF] text-[#001840]"
                          : "border-gray-100 text-gray-300 cursor-not-allowed"
                      }`}>
                      {lvl}
                    </button>
                  ))}
                </div>
                <F label="Grade Level" required error={errors.gradeLevel}><S value={form.gradeLevel} error={errors.gradeLevel} onChange={e=>{set("gradeLevel",e.target.value);set("strand","");}}><option value="">Select grade level</option>{grades.map(g=><option key={g} value={g}>{g}</option>)}</S></F>
                {isSHS&&(<F label="Strand" required error={errors.strand}><S value={form.strand} error={errors.strand} onChange={e=>set("strand",e.target.value)}><option value="">Select strand</option>{SHS_STRANDS.map(s=><option key={s} value={s}>{s}</option>)}</S></F>)}
              </>
            )}
            {/* Enrollment type — hide for SSC or carry-over (always New/Old respectively) */}
            {!isSSCCompletion && !isCarryOver && (
              <F label="Enrollment Type" required error={errors.enrollmentType}>
                <div className="flex gap-3 flex-wrap">
                  {[{value:"new",label:"New"},{value:"old",label:"Old / Continuing"},{value:"transferee",label:"Transferee"}].map(t=>(
                    <button key={t.value} type="button" onClick={()=>set("enrollmentType",t.value)}
                      className={`px-5 py-2.5 rounded-xl border-2 text-sm font-medium transition-all ${form.enrollmentType===t.value?"border-[#102A71] bg-[#EEF2FF] text-[#001840]":"border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
                {errors.enrollmentType&&<p className="text-xs text-red-500 mt-1">{errors.enrollmentType}</p>}
              </F>
            )}
            <div className="grid grid-cols-2 gap-4">
              <F label="School Year"><I value={form.academicYear} placeholder="2025-2026" onChange={e=>set("academicYear",e.target.value)}/></F>
              <F label="Student ID Number" error={errors.studentNumber}>
                <I
                  value={form.studentNumber}
                  error={errors.studentNumber}
                  placeholder="YYYY-NNNNN e.g. 2025-00123"
                  maxLength={10}
                  onChange={e=>{
                    // Allow only digits and one hyphen in position 4
                    const raw = e.target.value;
                    // Auto-insert hyphen after 4 digits
                    let cleaned = raw.replace(/[^0-9-]/g,'');
                    if(cleaned.length===4 && !cleaned.includes('-') && raw.length===5){
                      cleaned = cleaned + '-';
                    }
                    set("studentNumber", cleaned);
                  }}
                />
                <p className="text-[10px] text-gray-400 mt-1">Format: YYYY-NNNNN · e.g. 2025-00123 · Leave blank if not yet assigned</p>
                {errors.studentNumber && <p className="text-xs text-red-500 mt-0.5">{errors.studentNumber}</p>}
              </F>
            </div>
          </div>)}
          {step===2&&(<div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <F label="Family Name" required error={errors.familyName}><I value={form.familyName} error={errors.familyName} placeholder="Family Name" onKeyDown={onlyLetters} onChange={e=>set("familyName",e.target.value)}/></F>
              <F label="First Name" required error={errors.firstName}><I value={form.firstName} error={errors.firstName} placeholder="First Name" onKeyDown={onlyLetters} onChange={e=>set("firstName",e.target.value)}/></F>
              <F label="Middle Name"><I value={form.middleName} placeholder="Middle Name" onKeyDown={onlyLetters} onChange={e=>set("middleName",e.target.value)}/></F>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <F label="LRN" error={lrnTaken ? "This LRN is already registered" : undefined}><I value={form.lrn} placeholder="12-digit LRN" maxLength={12} onKeyDown={onlyDigits} error={lrnTaken} onChange={e=>{set("lrn",e.target.value);checkLrn(e.target.value);}}/></F>
              <F label="Sex" required error={errors.sex}><S value={form.sex} error={errors.sex} onChange={e=>set("sex",e.target.value)}><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option></S></F>
              <F label="Date of Birth" required error={errors.dateOfBirth}><I type="date" value={form.dateOfBirth} error={errors.dateOfBirth} onChange={e=>set("dateOfBirth",e.target.value)}/></F>
            </div>
            <F label="Place of Birth"><I value={form.placeOfBirth} placeholder="Place of birth" onChange={e=>set("placeOfBirth",e.target.value)}/></F>
          </div>)}
          {step===3&&(<div className="space-y-5">
            <div><h3 className="text-sm font-bold text-[#001840] mb-3 pb-2 border-b border-gray-100">Father</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><F label="Full Name"><I value={form.fatherName} placeholder="Father name" onKeyDown={onlyLetters} onChange={e=>set("fatherName",e.target.value)}/></F><F label="Occupation"><I value={form.fatherOccupation} placeholder="Occupation" onChange={e=>set("fatherOccupation",e.target.value)}/></F></div></div>
            <div><h3 className="text-sm font-bold text-[#001840] mb-3 pb-2 border-b border-gray-100">Mother</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><F label="Full Name"><I value={form.motherName} placeholder="Mother name" onKeyDown={onlyLetters} onChange={e=>set("motherName",e.target.value)}/></F><F label="Occupation"><I value={form.motherOccupation} placeholder="Occupation" onChange={e=>set("motherOccupation",e.target.value)}/></F></div></div>
            <F label="Parents Address"><I value={form.parentsAddress} placeholder="Complete address" onChange={e=>set("parentsAddress",e.target.value)}/></F>
            <div><h3 className="text-sm font-bold text-[#001840] mb-3 pb-2 border-b border-gray-100">Guardian (if any)</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><F label="Full Name"><I value={form.guardianName} placeholder="Guardian name" onKeyDown={onlyLetters} onChange={e=>set("guardianName",e.target.value)}/></F><F label="Occupation"><I value={form.guardianOccupation} placeholder="Occupation" onChange={e=>set("guardianOccupation",e.target.value)}/></F><F label="Address"><I value={form.guardianAddress} placeholder="Address" onChange={e=>set("guardianAddress",e.target.value)}/></F><F label="Telephone / Mobile"><I value={form.guardianTelephone} placeholder="09XXXXXXXXX" maxLength={11} onKeyDown={onlyDigits} onChange={e=>set("guardianTelephone",e.target.value)}/></F></div></div>
          </div>)}
          {step===4&&(<div className="space-y-5">
            <div><h3 className="text-sm font-bold text-[#001840] mb-3 pb-2 border-b border-gray-100">Grade VI School</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><F label="School Name"><I value={form.grade6School} placeholder="School name" onChange={e=>set("grade6School",e.target.value)}/></F><F label="School Address"><I value={form.grade6SchoolAddress} placeholder="Address" onChange={e=>set("grade6SchoolAddress",e.target.value)}/></F><F label="Section"><I value={form.grade6Section} placeholder="Section" onChange={e=>set("grade6Section",e.target.value)}/></F><F label="General Average"><I value={form.grade6Average} placeholder="e.g. 88" maxLength={5} onKeyDown={onlyDigits} onChange={e=>set("grade6Average",e.target.value)}/></F><F label="SY Start"><I value={form.grade6SYStart} placeholder="2020" maxLength={4} onKeyDown={onlyDigits} onChange={e=>set("grade6SYStart",e.target.value)}/></F><F label="SY End"><I value={form.grade6SYEnd} placeholder="2021" maxLength={4} onKeyDown={onlyDigits} onChange={e=>set("grade6SYEnd",e.target.value)}/></F></div></div>
            <div>
              <h3 className="text-sm font-bold text-[#001840] mb-1 pb-2 border-b border-gray-100">
                Last High School Attended
                {isTransferee && <span className="ml-2 text-[10px] font-bold uppercase tracking-wide bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full">Required for Transferees</span>}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <F label="School Name" required={isTransferee} error={errors.lastHSSchool}><I value={form.lastHSSchool} placeholder="School name" error={errors.lastHSSchool} onChange={e=>set("lastHSSchool",e.target.value)}/></F>
                <F label="Curriculum Year" required={isTransferee} error={errors.lastHSCurriculumYear}><I value={form.lastHSCurriculumYear} placeholder="e.g. G7" error={errors.lastHSCurriculumYear} onChange={e=>set("lastHSCurriculumYear",e.target.value)}/></F>
                <F label="Section"><I value={form.lastHSSection} placeholder="Section" onChange={e=>set("lastHSSection",e.target.value)}/></F>
                <F label="SY Start" required={isTransferee} error={errors.lastHSSYStart}><I value={form.lastHSSYStart} placeholder="2023" maxLength={4} onKeyDown={onlyDigits} error={errors.lastHSSYStart} onChange={e=>set("lastHSSYStart",e.target.value)}/></F>
                <F label="SY End" required={isTransferee} error={errors.lastHSSYEnd}><I value={form.lastHSSYEnd} placeholder="2024" maxLength={4} onKeyDown={onlyDigits} error={errors.lastHSSYEnd} onChange={e=>set("lastHSSYEnd",e.target.value)}/></F>
              </div>
            </div>
          </div>)}
          {step===docStep&&(<div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-[#001840] mb-1">Upload Required Documents <span className="text-red-500">*</span></p>
              {isTransferee ? (
                <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 mb-4">
                  <p className="text-xs font-bold text-orange-800 mb-1">Transferee Requirements</p>
                  <p className="text-xs text-orange-700 leading-relaxed">
                    As a transferee, all four documents below are <strong>required</strong>. Make sure they are from your previous school with official dry seal.
                  </p>
                </div>
              ) : (
                <p className="text-xs text-gray-500 mb-4">Upload a clear scan or photo of each document. At least one is required.</p>
              )}
            </div>
            {activeCreds.map(cred=>{
              const file=form.docFiles[cred.key];
              const previewUrl=file?URL.createObjectURL(file):null;
              return(
                <div key={cred.key} className={`p-4 rounded-xl border-2 transition-all ${file?"border-green-400 bg-green-50":cred.required?"border-red-200 bg-red-50/30":"border-gray-200 bg-gray-50"}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#001840]">{cred.label}</span>
                      {cred.required && !file && (
                        <span className="text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Required</span>
                      )}
                    </div>
                    {file&&<span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Uploaded ✓</span>}
                  </div>
                  {file?(
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 bg-white rounded-lg px-3 py-2 border border-green-200">
                        <FileText size={14} className="text-green-600 shrink-0"/>
                        <span className="text-xs text-green-700 truncate flex-1">{file.name}</span>
                        <button
                          type="button"
                          onClick={()=>setPreviewModal({url:previewUrl,name:file.name,isPdf:file.type==="application/pdf"})}
                          className="text-xs text-[#102A71] hover:text-[#001840] font-semibold shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg border border-[#102A71]/30 hover:bg-[#EEF2FF] transition-all"
                        >
                          View
                        </button>
                        <button type="button" onClick={()=>set("docFiles",{...form.docFiles,[cred.key]:null})} className="text-red-400 hover:text-red-600 shrink-0"><X size={14}/></button>
                      </div>
                    </div>
                  ):(
                    <label className="flex items-center justify-between gap-2 cursor-pointer border border-gray-200 rounded-lg px-3 py-2.5 bg-white hover:bg-gray-50 transition-all">
                      <span className="text-sm text-gray-500">Drag and Drop or Upload File</span>
                      <Upload size={16} className="text-gray-400 shrink-0"/>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e=>{
                        const f=e.target.files[0];
                        if(!f)return;
                        const allowed=['application/pdf','image/jpeg','image/jpg','image/png'];
                        const allowedExt=['.pdf','.jpg','.jpeg','.png'];
                        const ext='.'+f.name.split('.').pop().toLowerCase();
                        if(!allowed.includes(f.type)||!allowedExt.includes(ext)){
                          alert(`Invalid file type "${f.name}".\nOnly PDF, JPG, JPEG, and PNG files are allowed.`);
                          e.target.value='';return;
                        }
                        if(f.size>10*1024*1024){alert("File exceeds 10MB limit. Please choose a smaller file.");e.target.value='';return;}
                        set("docFiles",{...form.docFiles,[cred.key]:f});
                      }}/>
                    </label>
                  )}
                  <p className="text-[10px] text-gray-400 mt-2 italic">Formats: PDF, JPG, JPEG, PNG · Max file size: 3.0MB</p>
                </div>
              );
            })}
            {errors.credentials&&<p className="text-xs text-red-500">{errors.credentials}</p>}
            {errors.docFiles&&<p className="text-xs text-red-500">{errors.docFiles}</p>}
          </div>)}
        </div>
        {step===total&&(
          <div className="flex justify-end mt-6">
            <button onClick={submit} disabled={submitting} className="flex items-center gap-2 px-8 py-3 bg-[#F5C400] text-[#001840] rounded-xl font-bold hover:bg-[#FFDC5F] transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting
                ? <><Loader2 size={18} className="animate-spin"/> {isEditMode ? 'Saving...' : 'Submitting...'}</>
                : <><CheckCircle2 size={18}/> {isEditMode ? 'Save Changes' : 'Submit Enrollment'}</>
              }
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
