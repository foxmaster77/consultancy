import assert from "node:assert/strict";
import { rateLimited, validateEnquiry } from "../lib/enquiry.ts";

const badPhone = validateEnquiry({ name: "Riya Sen", phone: "12345", company_website: "" });
assert.equal(badPhone.ok, false);

const good = validateEnquiry({
  name: "Riya Sen",
  phone: "+91 98300 11122",
  stream: "eng",
  board: "CBSE",
  college: "Heritage Institute of Technology",
  message: "Please share the written fee schedule.",
  company_website: ""
});
assert.equal(good.ok, true);
if (good.ok && !good.spam) assert.equal(good.row.phone, "9830011122");

const spam = validateEnquiry({ name: "Bot", phone: "9830011122", company_website: "http://spam.test" });
assert.equal(spam.ok && spam.spam, true);

const store = new Map<string, number[]>();
const start = 1_700_000_000_000;
for (let i = 0; i < 5; i++) assert.equal(rateLimited("1.1.1.1", start + i, store), false);
assert.equal(rateLimited("1.1.1.1", start + 6, store), true);
assert.equal(rateLimited("1.1.1.1", start + 11 * 60 * 1000, store), false);

console.log("enquiry checks passed");
