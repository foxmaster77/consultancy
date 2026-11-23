const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// ── 1. Add Google Fonts: add Playfair Display for maximum editorial luxury
html = html.replace(
  'family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
  'family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,800;1,700&display=swap'
);

// ── 2. Inject a full additional CSS block covering every gap, right before </style>
const luxuryCSS = `

    /* ══════════════════════════════════════════════════════
       LUXURY POLISH LAYER — Chatterjee Corporate Solutions
       ══════════════════════════════════════════════════════ */

    /* ── Scroll-reveal animation ── */
    .reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.7s cubic-bezier(.22,1,.36,1), transform 0.7s cubic-bezier(.22,1,.36,1);
    }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal-delay-1 { transition-delay: 0.1s; }
    .reveal-delay-2 { transition-delay: 0.2s; }
    .reveal-delay-3 { transition-delay: 0.3s; }
    .reveal-delay-4 { transition-delay: 0.4s; }

    /* ── Typography improvements ── */
    h1, h2, h3 { font-family: var(--font-display); letter-spacing: -0.01em; }
    p { line-height: 1.65; }

    /* ── Gold divider ornament ── */
    .gold-ornament {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 12px;
    }
    .gold-ornament::before,
    .gold-ornament::after {
      content: '';
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      max-width: 60px;
    }
    .gold-ornament span {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--gold-dark);
    }

    /* ── Hero subtle improvements ── */
    .hero {
      background: radial-gradient(ellipse at 30% 0%, #1a2840 0%, #0B101B 65%);
      position: relative;
      overflow: hidden;
    }
    .hero::after {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(circle at 80% 60%, rgba(212,175,55,0.07) 0%, transparent 55%),
        radial-gradient(circle at 10% 80%, rgba(29,78,216,0.05) 0%, transparent 45%);
      pointer-events: none;
    }
    .hero .container { position: relative; z-index: 2; }
    .hero-title { font-family: 'Playfair Display', var(--font-display), serif; }
    .hero-title em { font-family: 'Playfair Display', serif; }

    .hero-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1px;
      border: 1px solid rgba(212,175,55,0.22);
      border-radius: 16px;
      overflow: hidden;
      background: rgba(212,175,55,0.12);
      margin-top: 36px;
    }
    .hero-stat-item {
      background: rgba(11,16,27,0.7);
      backdrop-filter: blur(12px);
      padding: 18px 20px;
      text-align: center;
    }

    /* ── Hero spotlight ── */
    .hero-spotlight {
      background: rgba(14,20,34,0.82);
      border: 1px solid rgba(212,175,55,0.28);
      border-radius: 20px;
      padding: 28px;
      backdrop-filter: blur(20px);
      box-shadow:
        0 24px 56px -16px rgba(0,0,0,0.6),
        inset 0 1px 0 rgba(255,255,255,0.08);
      position: relative;
    }
    .hero-spotlight::before {
      content: '';
      position: absolute;
      top: 0; left: 32px; right: 32px; height: 1.5px;
      background: linear-gradient(90deg, transparent, #d4af37, transparent);
    }

    /* ── Section wrappers ── */
    .section-wrap {
      padding: 88px 0;
    }
    .section-head {
      max-width: 680px;
      margin: 0 auto 56px;
      text-align: center;
    }
    .section-kicker {
      display: inline-block;
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--gold-dark);
      border: 1px solid rgba(212,175,55,0.3);
      background: rgba(212,175,55,0.08);
      padding: 4px 14px;
      border-radius: 999px;
      margin-bottom: 14px;
    }
    .section-title {
      font-family: 'Playfair Display', var(--font-display), serif;
      font-size: clamp(28px, 3.2vw, 42px);
      font-weight: 800;
      color: var(--navy);
      line-height: 1.18;
      margin-bottom: 14px;
    }
    .section-sub {
      font-size: 16px;
      line-height: 1.65;
      color: var(--slate-500);
    }

    /* ── Filter bar ── */
    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 28px;
      padding: 16px 20px;
      background: #fff;
      border-radius: 16px;
      border: 1px solid rgba(212,175,55,0.18);
      box-shadow: 0 4px 16px rgba(11,16,27,0.05);
    }
    .stream-tabs {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }
    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      padding: 7px 16px;
      border-radius: 999px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      border: 1.5px solid var(--slate-200);
      background: var(--paper);
      color: var(--slate-500);
      transition: all 0.22s cubic-bezier(.22,1,.36,1);
    }
    .tab-btn:hover { border-color: var(--gold); color: var(--ink); background: #fff; }
    .tab-btn.active {
      background: var(--navy);
      border-color: var(--navy);
      color: #fff;
      box-shadow: 0 4px 14px rgba(11,16,27,0.2);
    }
    .tab-badge {
      font-size: 10.5px;
      font-weight: 700;
      background: rgba(255,255,255,0.18);
      padding: 1px 7px;
      border-radius: 999px;
    }
    .tab-btn:not(.active) .tab-badge {
      background: rgba(11,16,27,0.08);
      color: var(--slate-400);
    }
    .filter-inputs {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }
    .search-box {
      display: flex;
      align-items: center;
      gap: 10px;
      background: var(--paper);
      border: 1.5px solid var(--slate-200);
      border-radius: 999px;
      padding: 7px 16px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .search-box:focus-within {
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(212,175,55,0.14);
    }
    .search-box svg { color: var(--slate-400); flex: 0 0 auto; }
    .search-box input {
      border: none;
      background: none;
      font-size: 14px;
      color: var(--ink);
      outline: none;
      width: 190px;
      font-family: var(--font-body);
    }
    .search-box input::placeholder { color: var(--slate-300); }
    .select-box select {
      border: 1.5px solid var(--slate-200);
      border-radius: 999px;
      padding: 7px 14px;
      font-size: 13px;
      font-family: var(--font-body);
      color: var(--ink);
      background: var(--paper);
      cursor: pointer;
      outline: none;
      transition: border-color 0.2s;
    }
    .select-box select:focus { border-color: var(--gold); }

    /* ── Route banner ── */
    .route-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      background: rgba(212,175,55,0.07);
      border: 1px solid rgba(212,175,55,0.2);
      border-radius: 12px;
      padding: 11px 18px;
      font-size: 13.5px;
      color: var(--slate-700);
      margin-bottom: 28px;
      flex-wrap: wrap;
    }
    .route-banner strong { color: var(--navy); }
    .route-count {
      font-size: 12px;
      font-weight: 700;
      color: var(--gold-dark);
      white-space: nowrap;
      background: rgba(212,175,55,0.14);
      padding: 3px 12px;
      border-radius: 999px;
    }

    /* ── College cards — full luxury ── */
    .colleges-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 24px;
      margin-bottom: 36px;
    }
    @media(max-width:820px){
      .colleges-grid { grid-template-columns: 1fr; }
    }
    .college-card {
      background: #fff;
      border-radius: 20px;
      border: 1px solid rgba(212,175,55,0.16);
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(11,16,27,0.05);
      transition: transform 0.38s cubic-bezier(.22,1,.36,1), box-shadow 0.38s;
      display: flex;
      flex-direction: column;
    }
    .college-card:hover {
      transform: translateY(-7px);
      box-shadow: 0 20px 44px rgba(11,16,27,0.11), 0 0 0 1.5px rgba(212,175,55,0.38);
    }
    .card-media {
      height: 200px;
      position: relative;
      overflow: hidden;
      background: var(--navy);
    }
    .card-media img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(.22,1,.36,1);
    }
    .college-card:hover .card-media img { transform: scale(1.06); }
    .card-media-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.08) 0%, rgba(11,16,27,0.72) 100%);
    }
    .card-badges-top {
      position: absolute;
      top: 12px;
      left: 12px;
      right: 12px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .stream-tag {
      font-size: 10.5px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 4px 11px;
      border-radius: 999px;
      background: rgba(11,16,27,0.82);
      backdrop-filter: blur(6px);
      color: var(--gold-bright);
      border: 1px solid rgba(212,175,55,0.3);
    }
    .naac-tag {
      font-size: 10.5px;
      font-weight: 700;
      padding: 4px 11px;
      border-radius: 999px;
      background: rgba(255,255,255,0.93);
      color: #0b101b;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
    .card-commute-badge {
      position: absolute;
      bottom: 10px;
      left: 10px;
      right: 10px;
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 11.5px;
      color: rgba(255,255,255,0.95);
      background: rgba(0,0,0,0.58);
      backdrop-filter: blur(10px);
      padding: 5px 11px;
      border-radius: 9px;
    }
    .card-commute-badge svg { color: var(--gold); flex: 0 0 auto; }

    .card-body {
      padding: 22px;
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 0;
    }
    .card-location {
      font-size: 11px;
      font-weight: 700;
      color: var(--gold-dark);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .card-title {
      font-family: 'Playfair Display', var(--font-display), serif;
      font-size: 19px;
      font-weight: 700;
      color: var(--navy);
      line-height: 1.25;
      margin-bottom: 4px;
    }
    .card-affiliation {
      font-size: 12px;
      color: var(--slate-400);
      margin-bottom: 14px;
    }

    /* Fee box inside card */
    .card-fee-box {
      background: linear-gradient(135deg, #FDFBF5 0%, #F7F3E8 100%);
      border: 1px solid rgba(212,175,55,0.2);
      border-radius: 12px;
      padding: 13px 15px;
      margin-bottom: 13px;
    }
    .fee-row-dual {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .fee-col { display: flex; flex-direction: column; }
    .fee-label {
      font-size: 10.5px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--slate-400);
      font-weight: 600;
      margin-bottom: 2px;
    }
    .fee-val-total {
      font-family: var(--font-display);
      font-size: 19px;
      font-weight: 700;
      color: var(--navy);
      line-height: 1;
    }
    .fee-val-sem {
      font-size: 13px;
      font-weight: 600;
      color: var(--gold-dark);
    }

    /* Placement pill */
    .placement-pill-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--green-bg);
      border: 1px solid rgba(21,128,61,0.18);
      border-radius: 9px;
      padding: 8px 12px;
      font-size: 12.5px;
      color: #15803D;
      font-weight: 600;
      margin-bottom: 16px;
    }

    /* achievement pills */
    .achievement-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      margin-bottom: 16px;
    }
    .achievement-pill {
      font-size: 11px;
      font-weight: 600;
      padding: 3px 10px;
      border-radius: 999px;
      background: rgba(11,16,27,0.05);
      color: var(--slate-700);
      border: 1px solid var(--slate-100);
    }
    .achievement-pill.green { background: var(--green-bg); color: var(--green); border-color: rgba(21,128,61,0.18); }
    .achievement-pill.blue  { background: var(--blue-bg); color: var(--blue); border-color: rgba(29,78,216,0.18); }
    .achievement-pill.amber { background: var(--amber-bg); color: var(--amber); border-color: rgba(180,83,9,0.18); }

    /* Card buttons */
    .card-acts {
      display: grid;
      grid-template-columns: 1fr 1.15fr;
      gap: 9px;
      margin-top: auto;
    }
    .btn-card-inspect {
      background: var(--paper);
      border: 1.5px solid var(--slate-200);
      color: var(--slate-700);
      border-radius: 999px;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      transition: all 0.2s;
      font-family: var(--font-body);
    }
    .btn-card-inspect:hover { background: var(--slate-100); border-color: var(--slate-300); color: var(--ink); }
    .btn-card-wa {
      background: #15803D;
      color: #fff !important;
      border-radius: 999px;
      padding: 10px 14px;
      font-size: 13px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      cursor: pointer;
      box-shadow: 0 3px 10px rgba(21,128,61,0.28);
      transition: all 0.22s;
      border: none;
      font-family: var(--font-body);
      text-decoration: none;
    }
    .btn-card-wa:hover { background: #16a34a; transform: translateY(-2px); box-shadow: 0 6px 18px rgba(21,128,61,0.38); }

    /* ── Process section ── */
    .process-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
      gap: 24px;
      margin-top: 56px;
      position: relative;
    }
    .process-grid::before {
      content: '';
      position: absolute;
      top: 36px;
      left: calc(12.5% + 24px);
      right: calc(12.5% + 24px);
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(212,175,55,0.3), transparent);
    }
    @media(max-width:800px){ .process-grid::before { display: none; } }
    .process-card {
      background: #fff;
      border: 1px solid rgba(212,175,55,0.18);
      border-radius: 20px;
      padding: 32px 28px;
      text-align: center;
      position: relative;
      box-shadow: 0 4px 20px rgba(11,16,27,0.05);
      transition: transform 0.35s, box-shadow 0.35s;
    }
    .process-card:hover { transform: translateY(-5px); box-shadow: 0 16px 36px rgba(11,16,27,0.08); }
    .process-num {
      font-family: 'Playfair Display', serif;
      font-size: 48px;
      font-weight: 800;
      color: var(--gold);
      line-height: 1;
      margin-bottom: 16px;
      display: block;
    }
    .process-card h3 {
      font-family: var(--font-display);
      font-size: 17px;
      font-weight: 700;
      color: var(--navy);
      margin-bottom: 10px;
    }
    .process-card p {
      font-size: 14px;
      line-height: 1.65;
      color: var(--slate-500);
    }

    /* ── Rules section ── */
    .rules-section {
      background: var(--navy);
      padding: 88px 0;
      border-top: 1px solid var(--gold-border);
      position: relative;
      overflow: hidden;
    }
    .rules-section::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.07) 0%, transparent 60%);
      pointer-events: none;
    }
    .rules-grid {
      display: grid;
      grid-template-columns: 1fr 1.6fr;
      gap: 72px;
      align-items: start;
    }
    @media(max-width:800px){ .rules-grid { grid-template-columns: 1fr; gap: 40px; } }
    .rules-grid .section-title { color: #fff; }
    .rules-grid .hero-kicker { color: var(--gold-bright); border-color: rgba(212,175,55,0.35); background: rgba(212,175,55,0.1); }
    .rule-item {
      padding: 22px 0;
      border-bottom: 1px solid rgba(255,255,255,0.08);
    }
    .rule-item:last-child { border-bottom: none; padding-bottom: 0; }
    .rule-item h3 {
      font-family: var(--font-display);
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .rule-item h3 svg { color: var(--gold); flex: 0 0 auto; }
    .rule-item p {
      font-size: 14px;
      line-height: 1.65;
      color: rgba(255,255,255,0.68);
      margin-left: 32px;
    }

    /* ── FAQ ── */
    .faq-section {
      background: var(--paper);
      padding: 88px 0;
      border-top: 1px solid rgba(212,175,55,0.14);
    }
    .faq-list {
      max-width: 800px;
      margin: 56px auto 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .faq-item {
      border: 1px solid rgba(212,175,55,0.18);
      border-radius: 14px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 2px 10px rgba(11,16,27,0.04);
      transition: box-shadow 0.3s;
    }
    .faq-item:hover { box-shadow: 0 6px 20px rgba(11,16,27,0.07); }
    .faq-item.open {
      border-color: rgba(212,175,55,0.4);
      box-shadow: 0 6px 20px rgba(212,175,55,0.1);
    }
    .faq-q {
      width: 100%;
      text-align: left;
      padding: 20px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 15.5px;
      font-weight: 600;
      color: var(--navy);
      cursor: pointer;
      background: none;
      border: none;
      gap: 12px;
      font-family: var(--font-body);
    }
    .faq-q:hover { color: var(--gold-dark); }
    .faq-item.open .faq-q { color: var(--gold-dark); }
    .faq-q svg { flex: 0 0 auto; color: var(--gold); transition: transform 0.3s; }
    .faq-item.open .faq-q svg { transform: rotate(45deg); }
    .faq-a {
      display: none;
      padding: 0 24px 20px;
      font-size: 14.5px;
      line-height: 1.65;
      color: var(--slate-500);
    }
    .faq-item.open .faq-a { display: block; }

    /* ── Enquiry Section ── */
    .enquiry-section {
      padding: 88px 0;
      background: #fff;
      border-top: 1px solid rgba(212,175,55,0.14);
    }
    .enquiry-box {
      background: var(--navy);
      border-radius: 28px;
      padding: 60px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 52px;
      align-items: start;
      border: 1px solid var(--gold-border);
      box-shadow: 0 24px 60px -18px rgba(11,16,27,0.4);
      position: relative;
      overflow: hidden;
    }
    @media(max-width:800px){ .enquiry-box { grid-template-columns:1fr; padding:36px 24px; gap:36px; } }
    .enquiry-box::before {
      content: '';
      position: absolute;
      top: 0; left: 48px; right: 48px;
      height: 2px;
      background: var(--gold-gradient);
    }
    .enquiry-box::after {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 90% 20%, rgba(212,175,55,0.07) 0%, transparent 50%);
      pointer-events: none;
    }
    .enquiry-left h2 {
      font-family: 'Playfair Display', serif;
      font-size: clamp(26px, 2.8vw, 36px);
      color: #fff;
      margin-bottom: 14px;
      line-height: 1.18;
      font-weight: 800;
    }
    .enquiry-left h2 em { font-style: italic; color: var(--gold); }
    .enquiry-left p {
      font-size: 15.5px;
      line-height: 1.65;
      color: rgba(255,255,255,0.72);
      margin-bottom: 30px;
    }
    .enquiry-contact-row {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .enquiry-link {
      display: inline-flex;
      align-items: center;
      gap: 11px;
      font-size: 15px;
      font-weight: 600;
      color: #fff;
      transition: color 0.2s;
    }
    .enquiry-link:hover { color: var(--gold-bright); }
    .enquiry-link-icon {
      width: 38px; height: 38px;
      border-radius: 10px;
      background: rgba(212,175,55,0.14);
      border: 1px solid rgba(212,175,55,0.3);
      display: grid;
      place-items: center;
      color: var(--gold);
      flex: 0 0 auto;
      transition: background 0.2s;
    }
    .enquiry-link:hover .enquiry-link-icon { background: rgba(212,175,55,0.24); }

    /* ── Footer ── */
    footer {
      background: #060910;
      color: #fff;
      padding: 72px 0 32px;
      border-top: 1px solid var(--gold-border);
    }
    .footer-logo-block {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .footer-logo-img {
      width: 38px; height: 38px;
      border-radius: 9px;
      border: 1.5px solid var(--gold);
      object-fit: cover;
    }
    .footer-brand-name {
      font-family: var(--font-display);
      font-size: 16px;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.04em;
    }
    .footer-brand-name span { color: var(--gold); }
    .footer-grid {
      display: grid;
      grid-template-columns: 1.6fr 1fr 1fr 1.3fr;
      gap: 48px;
      margin-bottom: 52px;
    }
    @media(max-width:900px){ .footer-grid { grid-template-columns: 1fr 1fr; } }
    @media(max-width:580px){ .footer-grid { grid-template-columns: 1fr; } }
    .footer-brand p {
      font-size: 13.5px;
      line-height: 1.65;
      color: rgba(255,255,255,0.6);
      margin-bottom: 20px;
    }
    .footer-col h4 {
      font-size: 11.5px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--gold);
      margin-bottom: 18px;
    }
    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .footer-links a {
      font-size: 14px;
      color: rgba(255,255,255,0.65);
      transition: color 0.2s;
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .footer-links a::before {
      content: '';
      width: 4px; height: 4px;
      border-radius: 50%;
      background: var(--gold);
      opacity: 0.5;
      flex: 0 0 auto;
    }
    .footer-links a:hover { color: var(--gold-bright); }
    .footer-links a:hover::before { opacity: 1; }
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,0.08);
      padding-top: 28px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 12px;
      font-size: 12.5px;
      color: rgba(255,255,255,0.4);
    }
    .footer-bottom a { color: rgba(255,255,255,0.55); transition: color 0.2s; }
    .footer-bottom a:hover { color: var(--gold); }

    /* ── Comparison drawer at bottom ── */
    .compare-bar-wrap {
      position: fixed;
      bottom: 90px;
      left: 50%;
      transform: translateX(-50%) translateY(150%);
      z-index: 400;
      transition: transform 0.4s cubic-bezier(.22,1,.36,1);
    }
    .compare-bar-wrap.show {
      transform: translateX(-50%) translateY(0);
    }

    /* ── Info bar between tools and colleges ── */
    .info-bar {
      background: #fff;
      border-bottom: 1px solid var(--slate-100);
      padding: 14px 0;
    }
    .info-bar-inner {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      font-size: 13.5px;
      color: var(--slate-700);
    }
    .info-bar-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .info-green-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #10B981;
      box-shadow: 0 0 6px rgba(16,185,129,0.5);
      flex: 0 0 auto;
    }
    .info-bar-phone {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .info-bar-phone a {
      font-weight: 700;
      color: var(--navy);
      font-size: 15px;
      transition: color 0.2s;
    }
    .info-bar-phone a:hover { color: var(--gold-dark); }

    /* ── Scroll animations via JS ── */
    @media (prefers-reduced-motion: no-preference) {
      .college-card { transition: transform 0.38s cubic-bezier(.22,1,.36,1), box-shadow 0.38s, opacity 0.4s; }
      .college-card.hidden-card { opacity: 0; transform: translateY(16px); }
    }

    /* ── Bottom enquiry helper bar ── */
    .enquiry-helper-bar {
      background: rgba(212,175,55,0.07);
      border: 1px solid rgba(212,175,55,0.2);
      border-radius: 14px;
      padding: 18px 24px;
      text-align: center;
      color: var(--slate-700);
      font-size: 15px;
      margin-top: 8px;
    }
    .enquiry-helper-bar a {
      color: var(--navy);
      font-weight: 700;
      text-decoration: underline;
      text-underline-offset: 3px;
      margin-left: 6px;
      transition: color 0.2s;
    }
    .enquiry-helper-bar a:hover { color: var(--gold-dark); }

    /* ── Calculator boxes ── */
    .scholarship-summary-box {
      padding: 28px;
      background: var(--paper);
      border: 1px solid rgba(212,175,55,0.22);
      border-radius: 16px;
    }
    .scholarship-summary-box h3 {
      font-family: var(--font-display);
      font-size: 18px;
      color: var(--navy);
      margin-bottom: 16px;
    }
    .calc-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid var(--slate-100);
      font-size: 14px;
      color: var(--slate-700);
    }
    .calc-row:last-of-type { border-bottom: none; }
    .calc-row.total {
      font-weight: 700;
      font-size: 15.5px;
      border-top: 2px solid var(--slate-200);
      border-bottom: none;
      padding-top: 14px;
      margin-top: 4px;
    }
    .calc-row strong { color: var(--navy); font-weight: 700; }

    /* ── Rank result cards ── */
    .results-cards-list {
      max-height: 400px;
      overflow-y: auto;
      scrollbar-width: thin;
      scrollbar-color: var(--gold) var(--paper);
    }
    .results-cards-list::-webkit-scrollbar { width: 5px; }
    .results-cards-list::-webkit-scrollbar-track { background: var(--paper); border-radius: 3px; }
    .results-cards-list::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 3px; }
    .rank-result-card {
      background: #fff;
      border: 1px solid var(--slate-100);
      border-radius: 12px;
      padding: 15px 18px;
      margin-bottom: 10px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .rank-result-card:hover { border-color: rgba(212,175,55,0.3); box-shadow: 0 4px 14px rgba(212,175,55,0.08); }
    .rank-college-name { font-weight: 700; color: var(--navy); font-size: 14px; }
    .rank-branch-name  { font-size: 13px; color: var(--slate-400); margin-top: 3px; }
    .rank-badge { font-size: 11.5px; font-weight: 700; padding: 3px 10px; border-radius: 999px; white-space: nowrap; }
    .rank-badge.safe    { background: var(--green-bg); color: var(--green); }
    .rank-badge.likely  { background: var(--blue-bg);  color: var(--blue); }
    .rank-badge.stretch { background: var(--amber-bg); color: var(--amber); }

    /* ── Modal ── */
    .modal-overlay { position: fixed; inset: 0; z-index: 1000; background: rgba(11,16,27,0.88); backdrop-filter: blur(14px); display: none; place-items: center; padding: 20px; }
    .modal-overlay.open { display: grid; }
    .modal-card {
      background: #fff;
      border-radius: 24px;
      border: 1px solid var(--gold-border);
      box-shadow: 0 24px 64px rgba(0,0,0,0.5);
      max-width: 940px;
      width: 100%;
      max-height: 90vh;
      overflow-y: auto;
      padding: 36px;
      position: relative;
    }
    .modal-close-btn {
      position: absolute;
      top: 20px; right: 20px;
      width: 36px; height: 36px;
      border-radius: 50%;
      border: 1.5px solid var(--slate-200);
      background: #fff;
      cursor: pointer;
      display: grid;
      place-items: center;
      color: var(--slate-500);
      transition: all 0.2s;
    }
    .modal-close-btn:hover { background: var(--paper); color: var(--ink); }

    /* ── Toast ── */
    .toast { position: fixed; bottom: 90px; right: 24px; z-index: 999; background: var(--navy); color: #fff; padding: 13px 20px; border-radius: 12px; font-size: 14px; font-weight: 600; border-left: 3px solid var(--gold); box-shadow: 0 8px 24px rgba(0,0,0,0.3); transform: translateX(140%); transition: transform 0.4s cubic-bezier(.22,1,.36,1); }
    .toast.show { transform: translateX(0); }
`;

html = html.replace('  </style>', luxuryCSS + '\n  </style>');

// ── 3. Add scroll-reveal JS snippet before closing </body>
const revealScript = `
  <script>
    // Scroll-reveal for elements with .reveal class
    (function(){
      const els = document.querySelectorAll('.reveal');
      if (!els.length) return;
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); io.unobserve(e.target); } });
      }, { threshold: 0.12 });
      els.forEach(el => io.observe(el));
    })();

    // FAQ accordion with gold chevron
    document.querySelectorAll('.faq-q').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = btn.closest('.faq-item');
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
        if(!isOpen) item.classList.add('open');
      });
    });
  </script>
`;

html = html.replace('</body>', revealScript + '\n</body>');

// ── 4. Update the info-bar between tools and colleges to use luxury classes
html = html.replace(
  '<div style="background: #FFFFFF; border-bottom: 1px solid var(--slate-200); padding: 16px 0;">',
  '<div class="info-bar">'
);
html = html.replace(
  '<div class="container" style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; gap:16px; font-size:14px; color:var(--slate-700);">',
  '<div class="container info-bar-inner">'
);
html = html.replace(
  '<div style="display:flex; align-items:center; gap:8px;">',
  '<div class="info-bar-left">'
);
html = html.replace(
  '<span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#10B981;"></span>',
  '<span class="info-green-dot"></span>'
);
html = html.replace(
  '<div>\n        <span style="color:var(--slate-500);">Helpline for Kolkata Families:</span>\n        <strong style="color:var(--navy); margin-left:4px;">+91 861 760 7380</strong>\n      </div>',
  `<div class="info-bar-phone">
        <span style="color:var(--slate-500);">Helpline:</span>
        <a href="tel:+918617607380">+91 861 760 7380</a>
      </div>`
);

// ── 5. Upgrade the bottom helper bar in colleges section
html = html.replace(
  '<div style="background:var(--slate-50); border:1px solid var(--slate-200); border-radius:var(--radius-md); padding:20px; text-align:center; color:var(--slate-700); font-size:15px;">',
  '<div class="enquiry-helper-bar">'
);

// ── 6. Update enquiry links with new icon wrapper structure
html = html.replace(
  /<a class="enquiry-link" href="tel:\+918617607380">[\s\S]*?<\/a>/,
  `<a class="enquiry-link" href="tel:+918617607380">
            <div class="enquiry-link-icon">
              <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.19 15.1 19.79 19.79 0 0 1 1.12 6.43 2 2 0 0 1 3.1 4.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 11.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 20.92z"></path></svg>
            </div>
            +91 861 760 7380
          </a>`
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Luxury polish applied! File size:', fs.statSync('index.html').size, 'bytes');
