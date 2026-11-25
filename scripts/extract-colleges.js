const fs = require('fs');
const vm = require('vm');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const start = html.indexOf('const COLLEGES_DATA = [');
const end = html.indexOf('// State Variables');
if (start < 0 || end < 0) {
  console.error('Could not find COLLEGES_DATA');
  process.exit(1);
}
let src = html.slice(start, end);
src = src.replace(/\/\*[\s\S]*?\*\//g, '');
src = src.replace('const COLLEGES_DATA', 'var COLLEGES_DATA');
const sandbox = { out: null };
vm.createContext(sandbox);
vm.runInContext(src + '\nout = COLLEGES_DATA;', sandbox);

function keepHighlight(h) {
  return !(/[₹]|INR|\bLPA\b|placement|%|offer|crore|stipend|\bseats?\b|ranked|NIRF|#\d|\d/i.test(h));
}

function cleanRoute(s) {
  return String(s || '')
    .replace(/\([^)]*\d[^)]*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+·\s+$/g, '')
    .trim();
}

function cleanProgram(name) {
  return String(name || '')
    .replace(/\s*[–-]\s*\d+\s*seats?\b.*/i, '')
    .replace(/\s*\(\s*\d+\s*seats?\s*\)/i, '')
    .trim();
}

const colleges = sandbox.out.map((c) => ({
  id: c.id,
  name: c.name,
  shortName: c.shortName,
  area: c.area,
  stream: c.stream,
  streamLabel: c.streamLabel,
  accreditation: c.naac || '',
  affiliation: c.affiliation || '',
  examRoute: cleanRoute(c.examRoute),
  estYear: c.estYear || '',
  commute: c.commute || '',
  photo: c.photo || '',
  programs: (c.branches || []).map((b) => ({ name: cleanProgram(b.name) })).filter((p) => p.name),
  highlights: (c.achievements && c.achievements.highlights ? c.achievements.highlights : []).filter(keepHighlight),
  recruiters: (c.achievements && c.achievements.recruiters) || [],
  fees: {
    total4yr: null,
    perSemester: null,
    admissionFee: null,
    hostel: null,
    mess: null,
    source_url: null,
    last_verified: null
  },
  placement: {
    highest: null,
    average: null,
    source_url: null,
    last_verified: null
  }
}));

const outPath = path.join(__dirname, '..', 'data', 'colleges.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(colleges, null, 2) + '\n');
console.log('Wrote', colleges.length, 'colleges');
