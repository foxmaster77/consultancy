const fs = require("fs");
const path = require("path");

const files = ["index.html", "privacy.html", "terms.html", "js/app.js", "js/site-config.js", "css/enhancements.css"];
const banned = [/₹/, /\bLPA\b/, /80\s*%/, /10\s*%/, /2\.4\s*Lakh/i, /21\.5/, /72\s*LPA/];
let failed = false;

for (const file of files) {
  const text = fs.readFileSync(path.join(__dirname, "..", file), "utf8");
  for (const pattern of banned) {
    if (pattern.test(text)) {
      console.error(`${file} still contains ${pattern}`);
      failed = true;
    }
  }
}

const colleges = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "data", "colleges.json"), "utf8"));
for (const college of colleges) {
  for (const key of ["total4yr", "perSemester", "admissionFee", "hostel", "mess"]) {
    if (college.fees[key] != null) {
      console.error(`${college.id} fee ${key} is set; this guard only allows null until you fill official figures yourself.`);
      failed = true;
    }
  }
  for (const key of ["highest", "average"]) {
    if (college.placement[key] != null) {
      console.error(`${college.id} placement ${key} is set in the shipped file.`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log("copy guard passed");
