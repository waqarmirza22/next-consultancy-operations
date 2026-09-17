// Next Consultancy Operations Plan - Vanilla JS
const $ = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];

// Mobile nav
const navToggle = $('#navToggle');
const navLinks = $('#navLinks');
navToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  navToggle.classList.toggle('open');
});
$$('.nav-link').forEach(a=> a.addEventListener('click', ()=> navLinks.classList.remove('open')));

// Scroll progress + active nav + back to top + nav shadow
const progress = $('#scrollProgress');
const nav = $('#nav');
const backToTop = $('#backToTop');
const sections = $$('section[id], header[id]');
const navLinkMap = {};
$$('.nav-link').forEach(l=> { const href=l.getAttribute('href'); if(href?.startsWith('#')) navLinkMap[href.slice(1)] = l; });

function onScroll(){
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max>0 ? (scrolled/max)*100 : 0;
  if(progress) progress.style.width = pct + '%';
  if(nav) nav.style.boxShadow = scrolled>10 ? '0 4px 24px rgba(18,30,47,0.06)' : 'none';
  if(backToTop) backToTop.classList.toggle('show', scrolled>400);

  // active nav
  let current = '';
  sections.forEach(sec=>{
    const top = sec.offsetTop - 120;
    if(scrolled >= top) current = sec.id;
  });
  $$('.nav-link').forEach(l=> l.classList.remove('active'));
  if(current && navLinkMap[current]) navLinkMap[current].classList.add('active');
}
window.addEventListener('scroll', onScroll, {passive:true});
onScroll();

backToTop?.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

// Smooth scroll for all internal links (fallback)
$$('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if(target){
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({top, behavior:'smooth'});
    }
  });
});

// Presentation mode
$('#presentationBtn')?.addEventListener('click', ()=>{
  document.body.classList.toggle('presentation');
  const isPres = document.body.classList.contains('presentation');
  $('#presentationBtn').textContent = isPres ? 'Exit Presentation' : 'Presentation';
});

// Reveal on scroll
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting) entry.target.classList.add('in');
  });
},{threshold:0.15});
$$('.reveal').forEach(el=> revealObserver.observe(el));

// Student journey data
const journeyData = {
  inquiry: {
    title: 'INQUIRY',
    owner: 'Admissions / Counselor',
    checks: ['Contact details captured','Study destination identified','Academic background recorded','Initial eligibility understood','Source: WhatsApp / Call / Walk-in / Social / Website (potential channels may include)'],
    next: 'Schedule / complete counseling',
    risk: 'Lead goes cold without timely follow-up',
    control: 'Record inquiry and next follow-up date, assign owner. Central record prevents info trapped in individual phones.'
  },
  counseling: {
    title: 'COUNSELING',
    owner: 'Counselor',
    checks: ['Academic profile','Financial planning discussed','Destination / intake / course discussion','Student expectations clarified','Parent involvement where applicable'],
    next: 'Create document checklist',
    risk: 'Student unclear about next steps, repeats asking for updates',
    control: 'Clear next step communicated, follow-up date set.'
  },
  documents: {
    title: 'DOCUMENT COLLECTION',
    owner: 'Assigned counselor / case officer',
    checks: ['Passport / CNIC','Academic documents','English-language evidence where applicable','Financial documents where required','Institution-specific requirements','Verification status'],
    next: 'Identify missing documents, set reminder',
    risk: 'Incomplete file delays application',
    control: 'Central checklist + follow-up date + version control. Naming: StudentName_DocType_Date_Version'
  },
  shortlist: {
    title: 'UNIVERSITY SHORTLISTING',
    owner: 'Application team + Counselor',
    checks: ['Course alignment','University requirements verified','Intake availability','Application deadlines captured','Deposit requirements noted'],
    next: 'Finalize shortlist with student/parent',
    risk: 'Applying to misaligned universities or missing deadline',
    control: 'Verified deadline register, not generic dates. I would review current process.'
  },
  application: {
    title: 'APPLICATION SUBMISSION',
    owner: 'Assigned case officer',
    checks: ['Correct university/program','Application requirements met','Documents uploaded','Application fee if applicable','Submission confirmation saved','Application reference recorded'],
    next: 'Track application status',
    risk: 'Deadline missed or application incomplete',
    control: 'Application tracker + deadline visibility + status check based on university timeline.'
  },
  offer: {
    title: 'OFFER / CONDITIONS',
    owner: 'Case officer / Counselor',
    checks: ['Offer received','Conditions recorded','Deadline captured','Responsible person assigned','Student informed','Conditions checklist'],
    next: 'Clear conditions before deadline',
    risk: 'Conditions misunderstood or deadline missed',
    control: 'Offer conditions follow-up, deadline hierarchy (RED/AMBER/GREEN).'
  },
  fee: {
    title: 'FEE / DEPOSIT',
    owner: 'Counselor / Assigned owner',
    checks: ['Deposit amount','Deadline','Payment status','Receipt/record','University confirmation'],
    next: 'Confirm payment and next stage',
    risk: 'Deposit deadline missed, CAS delayed',
    control: 'Student reminder before university deadline, owner + date visible.'
  },
  cas: {
    title: 'CAS STAGE — Critical Controlled Milestone',
    owner: 'Application / Visa team',
    checks: ['Outstanding university requirements visible','Deposit/payment confirmed where applicable','CAS request/eligibility status tracked','CAS issue deadline recorded (university-specific)','CAS details checked when received','Passport and personal details verified'],
    next: 'Verify requirements, track CAS issuance',
    risk: 'CAS delayed due to missing requirements or deadline confusion',
    control: 'CAS deadlines can differ by university, intake, programme and applicant country. Maintain university-specific deadline register. Verify current university guidance. Do not use generic CAS date.'
  },
  visa: {
    title: 'VISA STAGE',
    owner: 'Visa team',
    checks: ['Passport / CAS','Financial evidence (verify current UKVI rules: currently £1,529 London / £1,171 outside London up to 9 months where applicable)','TB test where applicable','ATAS where applicable','Other required docs per case','Biometric appointment/status','Decision + pre-departure'],
    next: 'Prepare handover, verify current official guidance',
    risk: 'Using old checklists instead of current official requirements',
    control: 'Verify current UKVI requirements, escalate complex cases to qualified/authorized person. Operational focus is case control, not immigration advice.'
  },
  departure: {
    title: 'DEPARTURE',
    owner: 'Pre-departure support',
    checks: ['Visa outcome','Travel preparation','Accommodation','Arrival planning','University onboarding','Final student communication','Document pack'],
    next: 'Pre-departure briefing',
    risk: 'Student unprepared for arrival',
    control: 'Checklist + communication record.'
  },
  referral: {
    title: 'POST-DEPARTURE / REFERRAL',
    owner: 'Counselor / Management',
    checks: ['Student arrived','Feedback collected','Referral opportunity (if service was organized, honest and responsive)','Lessons learned for process'],
    next: 'Document lessons, improve process',
    risk: 'Missing referral opportunity due to poor closing experience',
    control: 'Organized, honest and responsive service is more likely to be recommended. Track referral activity as proposed metric.'
  }
};

function renderJourney(stage){
  const d = journeyData[stage];
  const el = $('#journeyDetail');
  if(!d || !el) return;
  el.innerHTML = `
    <div class="jd-grid">
      <div class="jd-block">
        <h4>Stage</h4>
        <div style="font-weight:800;font-size:18px;margin-bottom:8px">${d.title}</div>
        <h4>Owner</h4><p style="font-size:13px;font-weight:600">${d.owner}</p>
        <div class="jd-meta">
          <span><strong>Next:</strong> ${d.next}</span>
        </div>
      </div>
      <div class="jd-block">
        <h4>Checks</h4>
        <ul>${d.checks.map(c=>`<li>${c}</li>`).join('')}</ul>
      </div>
      <div class="jd-block">
        <h4>Risk</h4><p style="font-size:13px;color:#991B1B;background:#FEF2F2;padding:8px;border-radius:8px;border:1px solid #FECACA">${d.risk}</p>
        <h4 style="margin-top:12px">Control</h4><p style="font-size:13px;background:#F5F6F8;padding:8px;border-radius:8px;border:1px solid #E5E7EB">${d.control}</p>
      </div>
    </div>
  `;
}

// init journey
renderJourney('inquiry');
$$('.tl-item').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    $$('.tl-item').forEach(b=> b.classList.remove('active'));
    btn.classList.add('active');
    renderJourney(btn.dataset.stage);
    // scroll into view on mobile
    if(window.innerWidth<1024){
      $('#journeyDetail').scrollIntoView({behavior:'smooth', block:'nearest'});
    }
  });
});

// SOP Modal
const sopDetails = {
  "01": {title:"SOP 01 — New Inquiry", who:"Admissions / Counselor", what:"Capture inquiry: source, contact, destination interest, academic background, next follow-up date. Create lead record.", when:"Same day as inquiry (proposed internal service standard)", how:"Lead record in central tracker, owner assigned, next action + date", check:"Record exists with owner + next date?", escalate:"If lead source unclear or contact invalid"},
  "02": {title:"SOP 02 — Counseling Handover", who:"Counselor", what:"Conduct initial counseling, record academic + financial profile, destination/intake discussion, document checklist shared.", when:"Per defined follow-up date", how:"Counseling notes + checklist in case file", check:"Checklist shared and next action set?", escalate:"If student expectations misaligned or eligibility unclear"},
  "03": {title:"SOP 03 — Document Collection", who:"Assigned case officer", what:"Collect, name (StudentName_DocType_Date_Version), verify, track missing", when:"Before application deadline, with reminders", how:"Master file with 7 folders (Personal/Academic/English/Financial/University/Visa/Comms)", check:"Checklist complete? Verification done?", escalate:"If critical doc missing near deadline"},
  "04": {title:"SOP 04 — University Shortlisting", who:"Application team", what:"Verify university requirements, intakes, deadlines, deposit, shortlist with student", when:"After document-ready where possible", how:"Shortlist sheet + deadline register", check:"Requirements verified against current university guidance?", escalate:"If requirements unclear or deadline approaching"},
  "05": {title:"SOP 05 — Application Submission", who:"Case officer", what:"Submit application, save confirmation, record reference, track status", when:"Based on university timeline", how:"Application tracker", check:"Confirmation saved? Status field updated?", escalate:"If portal error or requirement change"},
  "06": {title:"SOP 06 — Offer & Conditions", who:"Case officer / Counselor", what:"Record offer, conditions, deadline, inform student, track clearance", when:"Upon offer receipt", how:"Offer tracker", check:"Conditions recorded with deadline?", escalate:"If conditions unclear or deadline tight"},
  "07": {title:"SOP 07 — Fee / Deposit Follow-Up", who:"Counselor / owner", what:"Track deposit amount, deadline, payment, receipt, confirmation", when:"Before university deadline", how:"Fee tracker + reminder", check:"Payment confirmed by university?", escalate:"If payment delayed or confirmation pending"},
  "08": {title:"SOP 08 — CAS Tracking", who:"Application / visa team", what:"Track outstanding requirements, deposit status, CAS request, deadline, details check", when:"Before provider deadline", how:"CAS register (university-specific deadlines)", check:"CAS details checked when received?", escalate:"If CAS deadline approaching or requirements pending. CAS deadlines can differ by university/intake/programme/country."},
  "09": {title:"SOP 09 — Visa Handover", who:"Visa team", what:"Verify current UKVI requirements, prepare handover, track appointment, decision", when:"Before planned filing", how:"Visa checklist (verify official sources)", check:"Requirements verified against current official guidance?", escalate:"Complex cases to qualified/authorized person"},
  "10": {title:"SOP 10 — Complaint / Escalation", who:"Operations / Management", what:"Listen, understand, verify, act, communicate, follow up, document root cause", when:"Upon issue identification", how:"Issue log", check:"Student informed? Root cause identified?", escalate:"Per escalation framework: Normal/Attention/Urgent/Escalate"},
  "11": {title:"SOP 11 — Pre-Departure", who:"Pre-departure support", what:"Travel, accommodation, arrival, onboarding, final communication, document pack", when:"After visa decision", how:"Pre-departure checklist", check:"Student briefed?", escalate:"If travel/accommodation issue"},
  "12": {title:"SOP 12 — Data Backup & File Control", who:"Operations", what:"Controlled access, structured folders, backups, version control, ownership, handover when staff leave", when:"Weekly backup + on role change", how:"Folder structure + backup log", check:"Backup completed? Access controlled?", escalate:"If sensitive data shared unnecessarily or stored only on personal devices"}
};

const sopModal = $('#sopModal');
const sopBody = $('#sopModalBody');
function openSop(id){
  const d = sopDetails[id];
  if(!d) return;
  sopBody.innerHTML = `
    <h3>${d.title}</h3>
    <p><span class="badge-demo">PROPOSED SOP</span> I would propose this after reviewing existing process.</p>
    <div style="display:grid;gap:10px;margin-top:14px">
      <div><strong>WHO</strong><br>${d.who}</div>
      <div><strong>WHAT</strong><br>${d.what}</div>
      <div><strong>WHEN</strong><br>${d.when}</div>
      <div><strong>HOW</strong><br>${d.how}</div>
      <div><strong>CHECK</strong><br>${d.check}</div>
      <div><strong>ESCALATE</strong><br>${d.escalate}</div>
    </div>
    <div class="callout" style="margin-top:14px">Each SOP should answer: WHO → WHAT → WHEN → HOW → CHECK → ESCALATE</div>
  `;
  sopModal.classList.add('open');
  sopModal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
}
$$('.sop-card').forEach(c=> c.addEventListener('click', ()=> openSop(c.dataset.sop)));

// Case modal
const caseModal = $('#caseModal');
$('#openCaseLogic')?.addEventListener('click', ()=>{
  caseModal.classList.add('open');
  caseModal.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
});

function closeModals(){
  $$('.modal').forEach(m=> { m.classList.remove('open'); m.setAttribute('aria-hidden','true'); });
  document.body.style.overflow='';
}
$$('.modal-backdrop, .modal-close').forEach(el=> el.addEventListener('click', closeModals));
document.addEventListener('keydown', e=> { if(e.key==='Escape') closeModals(); });

// Roadmap tabs
$$('.tab').forEach(tab=>{
  tab.addEventListener('click', ()=>{
    const target = tab.dataset.tab;
    $$('.tab').forEach(t=> t.classList.remove('active'));
    tab.classList.add('active');
    $$('.panel').forEach(p=> p.classList.remove('active'));
    const panel = document.getElementById('panel-'+target);
    if(panel) panel.classList.add('active');
  });
});

// Scenario toggle
$$('.toggle-scenario').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const target = document.getElementById(btn.dataset.target);
    if(!target) return;
    target.classList.toggle('open');
    btn.textContent = target.classList.contains('open') ? 'Hide Approach' : 'Show My Approach';
  });
});

// Prefers reduced motion: disable reveal if needed
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  $$('.reveal').forEach(el=> el.classList.add('in'));
}

console.log('Next Consultancy Operations Plan — loaded. All demo data is illustrative. No real company data used.');
