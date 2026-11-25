import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

type Fee = {
  total4yr: number | null;
  perSemester: number | null;
  admissionFee: number | null;
  hostel: number | null;
  mess: number | null;
  source_url: string | null;
  last_verified: string | null;
};

type Placement = {
  highest: number | string | null;
  average: number | string | null;
  source_url: string | null;
  last_verified: string | null;
};

type College = {
  id: string;
  name: string;
  fees: Fee;
  placement: Placement;
};

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const colleges = JSON.parse(readFileSync(join(root, "data", "colleges.json"), "utf8")) as College[];

const feeKeys = ["total4yr", "perSemester", "admissionFee", "hostel", "mess"] as const;
const placeKeys = ["highest", "average"] as const;

function missingFees(c: College) {
  return feeKeys.filter((key) => c.fees?.[key] == null);
}
function missingPlacement(c: College) {
  return placeKeys.filter((key) => c.placement?.[key] == null);
}

const feeGaps = colleges.filter((c) => missingFees(c).length || !c.fees?.last_verified || !c.fees?.source_url);
const placeGaps = colleges.filter((c) => missingPlacement(c).length || !c.placement?.last_verified || !c.placement?.source_url);
const verifiedTotals = colleges.filter((c) => c.fees?.total4yr != null && c.fees?.last_verified).length;
const ratio = colleges.length ? verifiedTotals / colleges.length : 0;

console.log(`Colleges: ${colleges.length}`);
console.log(`Verified total-fee coverage: ${verifiedTotals}/${colleges.length} (${Math.round(ratio * 100)}%). Budget filter needs 60%.`);
console.log("");
console.log(`Fees still incomplete: ${feeGaps.length}`);
for (const c of feeGaps) {
  const gaps = missingFees(c);
  const meta = [
    !c.fees?.last_verified ? "last_verified" : "",
    !c.fees?.source_url ? "source_url" : ""
  ].filter(Boolean);
  console.log(`- ${c.id} · ${c.name} · ${[...gaps, ...meta].join(", ") || "check record"}`);
}
console.log("");
console.log(`Placement still incomplete: ${placeGaps.length}`);
for (const c of placeGaps) {
  const gaps = missingPlacement(c);
  const meta = [
    !c.placement?.last_verified ? "last_verified" : "",
    !c.placement?.source_url ? "source_url" : ""
  ].filter(Boolean);
  console.log(`- ${c.id} · ${c.name} · ${[...gaps, ...meta].join(", ") || "check record"}`);
}

if (feeGaps.length || placeGaps.length) process.exitCode = 0;
