/* Main application logic for Chatterjee Corporate Solutions Admissions Advisory */
(function () {
  "use strict";

  const SITE = window.SITE || {};
  let COLLEGES = [];
  let currentStream = "all";
  let currentBudget = "all";
  let searchQuery = "";
  let compareList = [];
  let currentLang = localStorage.getItem("ccs_lang") || "en";
  if (!SITE.I18N || !SITE.I18N[currentLang]) currentLang = "en";

  function t(key, vars) {
    const dict = (SITE.I18N && (SITE.I18N[currentLang] || SITE.I18N.en)) || {};
    let str = dict[key] || (SITE.I18N && SITE.I18N.en && SITE.I18N.en[key]) || key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace("{" + k + "}", String(vars[k]));
      });
    }
    return str;
  }

  function trackEvent(name, props) {
    try {
      if (typeof window.va === "function") {
        window.va("event", Object.assign({ name: name }, props || {}));
      }
    } catch (_) {
      /* ignore analytics errors */
    }
  }

  function esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatInr(num) {
    if (num == null || Number.isNaN(Number(num))) return null;
    return "INR " + Number(num).toLocaleString("en-IN");
  }

  function waUrl(customText) {
    const num = SITE.WHATSAPP_NUMBER || "918617607380";
    const text = encodeURIComponent(customText || SITE.WHATSAPP_TEXT || "Hello, I need admission guidance.");
    return "https://wa.me/" + num + "?text=" + text;
  }

  function normalizePhone(raw) {
    const digits = String(raw || "").replace(/[^\d]/g, "");
    const local =
      digits.length === 12 && digits.startsWith("91")
        ? digits.slice(2)
        : digits.length === 11 && digits.startsWith("0")
        ? digits.slice(1)
        : digits;
    return /^[6-9]\d{9}$/.test(local) ? local : null;
  }

  function showToast(msg) {
    const toast = document.getElementById("toast");
    const text = document.getElementById("toastText");
    if (!toast || !text) return;
    text.textContent = msg;
    toast.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 3600);
  }

  function hydrateContacts() {
    const p1d = SITE.PHONE_PRIMARY_DISPLAY || "+91 861 760 7380";
    const p1t = SITE.PHONE_PRIMARY_TEL || "+918617607380";
    const p2d = SITE.PHONE_SECONDARY_DISPLAY || "+91 62940 62517";
    const p2t = SITE.PHONE_SECONDARY_TEL || "+916294062517";

    const phoneLinksHtml =
      '<a href="tel:' + esc(p1t) + '">' + esc(p1d) + '</a> / <a href="tel:' + esc(p2t) + '">' + esc(p2d) + "</a>";

    const helpline = document.getElementById("helplinePhones");
    if (helpline) helpline.innerHTML = phoneLinksHtml;

    const contactPhones = document.getElementById("contactPhones");
    if (contactPhones) contactPhones.innerHTML = phoneLinksHtml;

    const footerPhones = document.getElementById("footerPhones");
    if (footerPhones) {
      footerPhones.innerHTML =
        '<a class="footer-contact-pill" href="tel:' + esc(p1t) + '">Call ' + esc(p1d) + "</a> " +
        '<a class="footer-contact-pill" href="tel:' + esc(p2t) + '">Call ' + esc(p2d) + "</a>";
    }

    const stickyCall = document.getElementById("stickyCallLink");
    if (stickyCall) stickyCall.href = "tel:" + p1t;

    const stickyWa = document.getElementById("stickyWaLink");
    if (stickyWa) stickyWa.href = waUrl();

    const floatWa = document.getElementById("floatingWaLink");
    if (floatWa) floatWa.href = waUrl();

    const addrEl = document.getElementById("officeAddressVal");
    if (addrEl && SITE.OFFICE_ADDRESS) addrEl.textContent = SITE.OFFICE_ADDRESS;

    const hoursEl = document.getElementById("officeHoursVal");
    if (hoursEl && SITE.OFFICE_HOURS) hoursEl.textContent = SITE.OFFICE_HOURS;

    const mapFrame = document.getElementById("officeMapFrame");
    if (mapFrame && SITE.MAPS_QUERY) {
      mapFrame.src = "https://maps.google.com/maps?q=" + encodeURIComponent(SITE.MAPS_QUERY) + "&z=15&output=embed";
    }
  }

  function applyLanguage(lang) {
    if (!SITE.I18N || !SITE.I18N[lang]) return;
    currentLang = lang;
    localStorage.setItem("ccs_lang", lang);
    document.documentElement.lang = lang;

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      const active = btn.getAttribute("data-lang") === lang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = t(key, { n: COLLEGES.length || 19 });
      if (el.getAttribute("data-i18n-html") === "true") {
        el.innerHTML = val;
      } else {
        el.textContent = val;
      }
    });

    if (COLLEGES.length) {
      renderColleges();
    }
    renderCounsellor();
  }

  function setupMobileNav() {
    const btn = document.getElementById("hamburgerBtn");
    const drawer = document.getElementById("mobileDrawer");
    const closeBtn = document.getElementById("drawerCloseBtn");
    if (!btn || !drawer) return;

    function setOpen(open) {
      drawer.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
    }

    btn.addEventListener("click", () => setOpen(true));
    if (closeBtn) closeBtn.addEventListener("click", () => setOpen(false));
    drawer.addEventListener("click", (e) => {
      if (e.target === drawer) setOpen(false);
    });
    drawer.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => setOpen(false));
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("open")) setOpen(false);
    });
  }

  function isFeeVerified(col) {
    return Boolean(col.fees && col.fees.total4yr != null && col.fees.last_verified);
  }

  function isAnyVerified(col) {
    return Boolean(
      (col.fees && col.fees.last_verified) || (col.placement && col.placement.last_verified)
    );
  }

  function renderVerifiedMeta(lastVerified, sourceUrl) {
    if (!lastVerified) return "";
    const src = sourceUrl
      ? ' · <a href="' + esc(sourceUrl) + '" target="_blank" rel="noopener noreferrer">Source</a>'
      : "";
    return '<div class="verified-meta">Verified ' + esc(lastVerified) + src + "</div>";
  }

  function requestCollegeSchedule(collegeId, kind) {
    const col = COLLEGES.find((c) => c.id === collegeId);
    const name = col ? col.name : "";
    const pref = document.getElementById("enq-preferred");
    const msg = document.getElementById("enq-msg");
    if (pref && name) pref.value = name;
    if (msg && name) {
      msg.value = "Please share the official written " + (kind || "fee schedule") + " for " + name + ".";
    }
    const sec = document.getElementById("enquire");
    if (sec) sec.scrollIntoView({ behavior: "smooth" });
    if (pref) pref.focus();
    showToast("Prefilled " + name + " in the enquiry form.");
  }

  function updateBudgetFilterVisibility() {
    const wrap = document.getElementById("budgetFilterWrap");
    if (!wrap) return;
    const minRatio = SITE.BUDGET_MIN_VERIFIED_RATIO != null ? SITE.BUDGET_MIN_VERIFIED_RATIO : 0.6;
    const verified = COLLEGES.filter(isFeeVerified).length;
    const ratio = COLLEGES.length ? verified / COLLEGES.length : 0;
    if (ratio >= minRatio) {
      wrap.style.display = "";
    } else {
      wrap.style.display = "none";
      currentBudget = "all";
    }
  }

  function updateCounts() {
    const counts = { all: COLLEGES.length, eng: 0, med: 0, asc: 0 };
    COLLEGES.forEach((c) => {
      if (counts[c.stream] !== undefined) counts[c.stream]++;
    });
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val);
    };
    set("count-all", counts.all);
    set("count-eng", counts.eng);
    set("count-med", counts.med);
    set("count-asc", counts.asc);
  }

  function renderColleges() {
    const grid = document.getElementById("collegesGrid");
    if (!grid) return;
    grid.innerHTML = "";

    const filtered = COLLEGES.filter((col) => {
      if (currentStream !== "all" && col.stream !== currentStream) return false;
      if (searchQuery) {
        const progs = (col.programs || []).map((p) => p.name).join(" ");
        const recs = (col.recruiters || []).join(" ");
        const hay = [col.name, col.shortName, col.area, col.streamLabel, col.commute, progs, recs]
          .join(" ")
          .toLowerCase();
        if (!hay.includes(searchQuery)) return false;
      }
      if (currentBudget !== "all") {
        if (currentBudget === "mbbs") return col.stream === "med";
        if (!isFeeVerified(col)) return false;
        const total = Number(col.fees.total4yr);
        if (currentBudget === "under45") return total <= 450000;
        if (currentBudget === "45to7") return total > 450000 && total <= 700000;
        if (currentBudget === "above7") return total > 700000;
      }
      return true;
    });

    const vc = document.getElementById("visibleCount");
    if (vc) vc.textContent = String(filtered.length);

    if (filtered.length === 0) {
      grid.innerHTML =
        '<div style="grid-column:1/-1;background:#FFFFFF;border:1px dashed var(--slate-300);border-radius:var(--radius-md);padding:42px 24px;text-align:center;">' +
        '<h3 style="font-family:var(--font-display);font-size:20px;color:var(--navy);margin-bottom:6px;">No colleges match your filter</h3>' +
        '<p style="color:var(--slate-500);font-size:14px;margin-bottom:16px;">Try adjusting your search query or stream tab.</p>' +
        '<button type="button" class="btn-primary" onclick="resetFilters()" style="margin:0 auto;">Reset All Filters</button>' +
        "</div>";
      return;
    }

    filtered.forEach((col) => {
      const isCompared = compareList.some((c) => c.id === col.id);
      const card = document.createElement("article");
      card.className = "college-card";
      card.id = "card-" + col.id;

      const verifiedBadge = isAnyVerified(col)
        ? '<span class="badge-verified">✓ Verified data</span>'
        : "";

      const feeBlock = isFeeVerified(col)
        ? '<div class="fee-box">' +
            '<div class="fee-col">' +
              '<div class="fee-label">Total Tuition</div>' +
              '<div class="fee-val primary">' + esc(formatInr(col.fees.total4yr)) + "</div>" +
              renderVerifiedMeta(col.fees.last_verified, col.fees.source_url) +
            "</div>" +
            '<div class="fee-col">' +
              '<div class="fee-label">Per Semester</div>' +
              '<div class="fee-val">' + esc(col.fees.perSemester != null ? formatInr(col.fees.perSemester) : "On request") + "</div>" +
            "</div>" +
          "</div>"
        : '<div class="on-request-box">' +
            '<div class="on-request-text">' + esc(t("feeOnRequest")) + "</div>" +
            '<button type="button" class="btn-request-schedule" onclick="requestCollegeSchedule(\'' + esc(col.id) + '\', \'fee schedule\')">' +
              esc(t("requestSchedule")) +
            "</button>" +
          "</div>";

      const hasPlacement = col.placement && col.placement.highest != null && col.placement.last_verified;
      const placementHtml = hasPlacement
        ? '<div class="achieve-pill-list">' +
            '<span class="achieve-pill highlight">Highest: ' + esc(String(col.placement.highest)) + "</span>" +
          "</div>" +
          renderVerifiedMeta(col.placement.last_verified, col.placement.source_url)
        : '<div class="on-request-text" style="font-size:12.5px;">' + esc(t("placementOnRequest")) + "</div>";

      const highlightText = (col.highlights && col.highlights[0]) || "";
      const waLink = waUrl("Hi Chatterjee Corporate Solutions, I want the official fee schedule for " + col.name + ".");

      card.innerHTML =
        '<div class="card-photo-wrap">' +
          '<img class="card-photo" src="' + esc(col.photo) + '" alt="' + esc(col.name) + ' Campus" width="800" height="400" loading="lazy" decoding="async" onerror="handleImageError(this, \'' + esc(col.name) + '\')">' +
          '<div class="card-photo-gradient"></div>' +
          '<div class="card-badges">' +
            '<span class="badge-naac">' + esc(col.accreditation) + "</span>" +
            '<span class="badge-stream">' + esc(col.streamLabel) + "</span>" +
            verifiedBadge +
          "</div>" +
          '<div class="card-photo-bottom">' +
            '<span class="exam-tag">' + esc(col.examRoute) + "</span>" +
            '<span class="est-year">' + esc(col.estYear) + "</span>" +
          "</div>" +
        "</div>" +
        '<div class="card-content">' +
          '<div class="card-header-info">' +
            '<h3 class="college-name">' + esc(col.name) + "</h3>" +
            '<div class="college-area">' + esc(col.area) + "</div>" +
          "</div>" +
          '<div class="commute-pill"><span>' + esc(col.commute) + "</span></div>" +
          feeBlock +
          '<div class="achieve-box">' +
            placementHtml +
            (highlightText ? '<p class="achieve-desc">' + esc(highlightText) + "</p>" : "") +
          "</div>" +
          '<div class="card-footer">' +
            '<button type="button" class="btn-card-action btn-detail" onclick="openDetailModal(\'' + esc(col.id) + '\')">Details &amp; Programs</button>' +
            '<a href="' + esc(waLink) + '" target="_blank" rel="noopener noreferrer" class="btn-wa-card" data-wa-link="true">WhatsApp</a>' +
            '<button type="button" class="btn-compare-add ' + (isCompared ? "added" : "") + '" onclick="toggleCompare(\'' + esc(col.id) + '\', this)">' +
              (isCompared ? "✓ Added" : "+ Compare") +
            "</button>" +
          "</div>" +
        "</div>";

      grid.appendChild(card);
    });
  }

  function filterStream(stream, btnEl) {
    currentStream = stream;
    document.querySelectorAll(".tab-btn").forEach((b) => {
      b.classList.toggle("active", btnEl ? b === btnEl : b.dataset.stream === stream);
    });
    const routeText = document.getElementById("routeDescription");
    if (routeText) {
      if (stream === "eng") {
        routeText.textContent = "WBJEE, JEE Main, or institutional admission per the official yearly notice.";
      } else if (stream === "med") {
        routeText.textContent = "NEET UG merit rank and WBMCC state counselling per the official notice.";
      } else if (stream === "asc") {
        routeText.textContent = "Class 12 board merit, CUET UG, or university entrance test per the official notice.";
      } else {
        routeText.textContent = "WBJEE, JEE Main, NEET UG, CUET, or merit-based admission per the official notice.";
      }
    }
    renderColleges();
  }

  function handleSearch() {
    const input = document.getElementById("searchInput");
    searchQuery = input ? input.value.trim().toLowerCase() : "";
    renderColleges();
  }

  function handleBudgetFilter() {
    const sel = document.getElementById("budgetFilter");
    currentBudget = sel ? sel.value : "all";
    renderColleges();
  }

  function resetFilters() {
    currentStream = "all";
    currentBudget = "all";
    searchQuery = "";
    const s = document.getElementById("searchInput");
    if (s) s.value = "";
    const b = document.getElementById("budgetFilter");
    if (b) b.value = "all";
    filterStream("all");
  }

  function openDetailModal(collegeId) {
    const col = COLLEGES.find((c) => c.id === collegeId);
    if (!col) return;
    window.activeModalCollege = col.name;

    document.getElementById("modalName").textContent = col.name;
    document.getElementById("modalArea").textContent = col.area + " · " + col.estYear;
    document.getElementById("modalNaac").textContent = col.accreditation;
    document.getElementById("modalStream").textContent = col.streamLabel;
    const modalImg = document.getElementById("modalImg");
    modalImg.onerror = function () {
      handleImageError(modalImg, col.name);
    };
    modalImg.src = col.photo;
    document.getElementById("modalAffil").textContent = col.affiliation;
    document.getElementById("modalNirf").textContent = col.examRoute;
    document.getElementById("modalCommuteText").textContent = col.commute;

    const badgeEl = document.getElementById("modalVerifiedBadge");
    if (badgeEl) {
      badgeEl.style.display = isAnyVerified(col) ? "inline-flex" : "none";
    }

    const highPkgEl = document.getElementById("modalHighPkg");
    const avgPkgEl = document.getElementById("modalAvgPkg");
    if (col.placement && col.placement.highest != null && col.placement.last_verified) {
      highPkgEl.textContent = String(col.placement.highest);
      avgPkgEl.innerHTML =
        (col.placement.average != null ? "Avg: " + esc(String(col.placement.average)) + " · " : "") +
        "Verified " + esc(col.placement.last_verified) +
        (col.placement.source_url ? ' · <a href="' + esc(col.placement.source_url) + '" target="_blank" rel="noopener">Source</a>' : "");
    } else {
      highPkgEl.textContent = "On request";
      avgPkgEl.textContent = t("placementOnRequest");
    }

    const totalFeeEl = document.getElementById("modalTotalFee");
    const semFeeEl = document.getElementById("modalSemFee");
    if (isFeeVerified(col)) {
      totalFeeEl.textContent = formatInr(col.fees.total4yr);
      semFeeEl.innerHTML =
        (col.fees.perSemester != null ? esc(formatInr(col.fees.perSemester)) + " / sem · " : "") +
        "Verified " + esc(col.fees.last_verified) +
        (col.fees.source_url ? ' · <a href="' + esc(col.fees.source_url) + '" target="_blank" rel="noopener">Source</a>' : "");
    } else {
      totalFeeEl.textContent = "On request";
      semFeeEl.textContent = t("feeOnRequest");
    }

    const waBtn = document.getElementById("modalWhatsAppBtn");
    if (waBtn) {
      waBtn.href = waUrl("Hi Chatterjee Corporate Solutions, please share the official fee schedule for " + col.name + ".");
    }

    const branchTbody = document.getElementById("modalBranchTableBody");
    const progs = col.programs || [];
    if (progs.length) {
      branchTbody.innerHTML = progs
        .map(
          (p) =>
            "<tr><td><strong>" + esc(p.name) + "</strong></td>" +
            "<td>" + esc(p.intake != null ? String(p.intake) : "Per official seat matrix") + "</td>" +
            "<td>On request (official round notice)</td>" +
            "<td>" + esc(col.examRoute) + "</td></tr>"
        )
        .join("");
    } else {
      branchTbody.innerHTML = '<tr><td colspan="4">Program list available on request.</td></tr>';
    }

    const feeTbody = document.getElementById("modalFeeTableBody");
    const f = col.fees || {};
    const feeRows = [
      ["Admission & Registration Fee", "One-time", f.admissionFee],
      ["Tuition Fee (Per Semester)", "Per semester", f.perSemester],
      ["Total Course Tuition", "Full program", f.total4yr],
      ["Hostel Charges", "Optional", f.hostel],
      ["Mess Charges", "Optional", f.mess]
    ];
    feeTbody.innerHTML = feeRows
      .map((row) => {
        const val = row[2] != null && f.last_verified
          ? esc(formatInr(row[2])) + renderVerifiedMeta(f.last_verified, f.source_url)
          : '<span>' + esc(t("feeOnRequest")) + '</span> <button type="button" class="btn-request-schedule" style="margin-top:6px;" onclick="closeDetailModal(); requestCollegeSchedule(\'' + esc(col.id) + '\', \'fee schedule\')">' + esc(t("requestSchedule")) + "</button>";
        return "<tr><td><strong>" + row[0] + "</strong></td><td>" + row[1] + "</td><td>" + val + "</td></tr>";
      })
      .join("");

    const achieveList = document.getElementById("modalAchievementsList");
    achieveList.innerHTML = (col.highlights || [])
      .map((h) => '<div style="display:flex;gap:8px;font-size:14px;color:var(--slate-700);"><span style="color:var(--green);font-weight:700;">✓</span><span>' + esc(h) + "</span></div>")
      .join("");

    const recList = document.getElementById("modalRecruiters");
    recList.innerHTML = (col.recruiters || [])
      .map((r) => '<span style="background:var(--slate-100);color:var(--navy);padding:5px 10px;border-radius:4px;font-size:13px;font-weight:600;border:1px solid var(--slate-200);">' + esc(r) + "</span>")
      .join("");

    document.getElementById("detailModalBackdrop").classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeDetailModal(e) {
    const backdrop = document.getElementById("detailModalBackdrop");
    if (e && e.target !== backdrop) return;
    backdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  function prefillCollegeInForm() {
    if (window.activeModalCollege) {
      const el = document.getElementById("enq-preferred");
      if (el) el.value = window.activeModalCollege;
      showToast('Prefilled "' + window.activeModalCollege + '" in your enquiry form.');
    }
  }

  function toggleCompare(collegeId, btn) {
    const idx = compareList.findIndex((c) => c.id === collegeId);
    if (idx >= 0) {
      compareList.splice(idx, 1);
      if (btn) {
        btn.classList.remove("added");
        btn.textContent = "+ Compare";
      }
      showToast("Removed college from comparison.");
    } else {
      if (compareList.length >= 3) {
        showToast("You can compare at most 3 colleges at once.");
        return;
      }
      const col = COLLEGES.find((c) => c.id === collegeId);
      if (col) {
        compareList.push(col);
        if (btn) {
          btn.classList.add("added");
          btn.textContent = "✓ Added";
        }
        showToast("Added " + col.shortName + " to comparison.");
      }
    }
    updateCompareBar();
  }

  function updateCompareBar() {
    const bar = document.getElementById("compareBar");
    const slots = document.getElementById("compareSlots");
    const navCount = document.getElementById("compareNavCount");
    if (navCount) navCount.textContent = String(compareList.length);
    if (!bar || !slots) return;
    if (compareList.length > 0) {
      bar.classList.add("visible");
      slots.innerHTML = compareList
        .map(
          (c) =>
            '<div class="compare-chip"><span>' + esc(c.shortName) + '</span>' +
            '<button type="button" onclick="removeCompareItem(\'' + esc(c.id) + '\')" title="Remove">×</button></div>'
        )
        .join("");
    } else {
      bar.classList.remove("visible");
      slots.innerHTML = "";
    }
  }

  function removeCompareItem(collegeId) {
    compareList = compareList.filter((c) => c.id !== collegeId);
    const btn = document.querySelector("#card-" + collegeId + " .btn-compare-add");
    if (btn) {
      btn.classList.remove("added");
      btn.textContent = "+ Compare";
    }
    updateCompareBar();
    if (document.getElementById("compareModalBackdrop").classList.contains("active")) {
      renderComparisonTable();
    }
  }

  function clearComparison() {
    compareList = [];
    document.querySelectorAll(".btn-compare-add").forEach((b) => {
      b.classList.remove("added");
      b.textContent = "+ Compare";
    });
    updateCompareBar();
    closeComparisonModal();
  }

  function openComparisonModal() {
    if (compareList.length < 2 && COLLEGES.length >= 2) {
      if (compareList.length === 0) compareList = [COLLEGES[0], COLLEGES[1]];
      else {
        const second = COLLEGES.find((c) => c.id !== compareList[0].id);
        if (second) compareList.push(second);
      }
      updateCompareBar();
      renderColleges();
    }
    trackEvent("college_compared", {
      count: compareList.length,
      colleges: compareList.map((c) => c.id).join(",")
    });
    renderComparisonTable();
    document.getElementById("compareModalBackdrop").classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeComparisonModal(e) {
    const backdrop = document.getElementById("compareModalBackdrop");
    if (e && e.target !== backdrop) return;
    backdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  function renderComparisonTable() {
    const table = document.getElementById("comparisonTable");
    if (!table) return;
    if (!compareList.length) {
      table.innerHTML = '<tr><td style="text-align:center;padding:24px;">Please select at least 2 colleges to compare.</td></tr>';
      return;
    }

    function feeCell(c, key) {
      if (c.fees && c.fees[key] != null && c.fees.last_verified) {
        return esc(formatInr(c.fees[key])) + renderVerifiedMeta(c.fees.last_verified, c.fees.source_url);
      }
      return esc(t("feeOnRequest"));
    }

    function placeCell(c, key) {
      if (c.placement && c.placement[key] != null && c.placement.last_verified) {
        return esc(String(c.placement[key])) + renderVerifiedMeta(c.placement.last_verified, c.placement.source_url);
      }
      return "On request";
    }

    table.innerHTML =
      "<thead><tr><th>Comparison Metric</th>" +
      compareList.map((c) => '<th style="color:var(--navy);font-size:15px;">' + esc(c.name) + "</th>").join("") +
      "</tr></thead><tbody>" +
      "<tr><td><strong>Campus &amp; Commute</strong></td>" +
      compareList.map((c) => "<td><strong>" + esc(c.area) + '</strong><br><span style="font-size:12px;color:var(--slate-500);">' + esc(c.commute) + "</span></td>").join("") +
      "</tr><tr><td><strong>Accreditation</strong></td>" +
      compareList.map((c) => '<td><span class="badge-naac">' + esc(c.accreditation) + "</span></td>").join("") +
      "</tr><tr><td><strong>Admission Route</strong></td>" +
      compareList.map((c) => "<td>" + esc(c.examRoute) + "</td>").join("") +
      "</tr><tr><td><strong>Total Course Tuition</strong></td>" +
      compareList.map((c) => "<td>" + feeCell(c, "total4yr") + "</td>").join("") +
      "</tr><tr><td><strong>Admission Fee</strong></td>" +
      compareList.map((c) => "<td>" + feeCell(c, "admissionFee") + "</td>").join("") +
      "</tr><tr><td><strong>Hostel</strong></td>" +
      compareList.map((c) => "<td>" + feeCell(c, "hostel") + "</td>").join("") +
      "</tr><tr><td><strong>Highest Placement</strong></td>" +
      compareList.map((c) => "<td>" + placeCell(c, "highest") + "</td>").join("") +
      "</tr><tr><td><strong>Average Placement</strong></td>" +
      compareList.map((c) => "<td>" + placeCell(c, "average") + "</td>").join("") +
      "</tr></tbody>";
  }

  function runRankPredictor(isSubmit) {
    const exam = (document.getElementById("rankExam") || {}).value || "wbjee";
    const container = document.getElementById("rankResultsList");
    const countEl = document.getElementById("rankMatchCount");
    if (!container) return;

    const matching = COLLEGES.filter((col) => {
      const route = (col.examRoute || "").toLowerCase();
      if (exam === "neet") return col.stream === "med" || route.includes("neet");
      if (exam === "jeemain") return route.includes("jee");
      return col.stream === "eng" || route.includes("wbjee");
    });

    if (countEl) countEl.textContent = matching.length + " Colleges Accept This Route";
    container.innerHTML = "";

    matching.slice(0, 10).forEach((col) => {
      const item = document.createElement("div");
      item.className = "result-branch-card";
      const firstProg = col.programs && col.programs[0] ? col.programs[0].name : col.streamLabel;
      item.innerHTML =
        '<div style="display:flex;flex-direction:column;gap:2px;">' +
          '<div style="font-size:14.5px;font-weight:700;color:var(--navy);">' + esc(col.name) + "</div>" +
          '<div style="font-size:13px;color:var(--slate-700);">' + esc(firstProg) + ' · <span style="color:var(--slate-500);">' + esc(col.area) + "</span></div>" +
        "</div>" +
        '<div style="display:flex;align-items:center;gap:10px;">' +
          '<span class="chance-badge chance-moderate">Cutoff on official matrix</span>' +
          '<button type="button" class="btn-detail" style="padding:6px 10px;font-size:12px;border-radius:4px;" onclick="openDetailModal(\'' + esc(col.id) + '\')">Details</button>' +
        "</div>";
      container.appendChild(item);
    });

    if (isSubmit) {
      trackEvent("tool_submitted", { tool: "rank_finder", exam: exam });
    }
  }

  function populateScholarshipColleges() {
    const sel = document.getElementById("calcCollege");
    if (!sel) return;
    sel.innerHTML =
      '<option value="">Select a college (optional)</option>' +
      COLLEGES.map((c) => '<option value="' + esc(c.id) + '">' + esc(c.name) + "</option>").join("");
  }

  function syncScholarshipFeeField() {
    const sel = document.getElementById("calcCollege");
    const manualWrap = document.getElementById("calcManualFeeWrap");
    const manualInput = document.getElementById("calcManualFee");
    if (!sel || !manualWrap || !manualInput) return;

    const col = COLLEGES.find((c) => c.id === sel.value);
    if (col && isFeeVerified(col)) {
      manualWrap.style.display = "none";
      manualInput.value = String(col.fees.total4yr);
    } else {
      manualWrap.style.display = "block";
      manualInput.value = "";
    }
    resetScholarshipOutput();
  }

  function resetScholarshipOutput() {
    const alertBox = document.getElementById("scholarshipAlert");
    if (alertBox) {
      alertBox.className = "scholarship-neutral";
      alertBox.textContent = t("scholarshipNeutral");
    }
    const set = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };
    set("calcBaseFee", "—");
    set("calcSvmcmDiscount", "—");
    set("calcNetPayable", "—");
  }

  function handleScholarshipSubmit(e) {
    e.preventDefault();
    const sel = document.getElementById("calcCollege");
    const manualInput = document.getElementById("calcManualFee");
    const marksInput = document.getElementById("calcMarks");
    const incomeSel = document.getElementById("calcIncome");
    const domicileSel = document.getElementById("calcDomicile");
    const alertBox = document.getElementById("scholarshipAlert");

    const col = COLLEGES.find((c) => c.id === (sel ? sel.value : ""));
    const verifiedFee = col && isFeeVerified(col) ? Number(col.fees.total4yr) : null;
    const rawManual = manualInput ? Number(manualInput.value) : NaN;
    const baseFee = verifiedFee != null ? verifiedFee : rawManual;

    if (!baseFee || Number.isNaN(baseFee) || baseFee <= 0) {
      if (alertBox) {
        alertBox.className = "form-error-msg";
        alertBox.textContent = "Enter the total tuition from the college's fee notice to run the estimate.";
      }
      if (manualInput) manualInput.focus();
      return;
    }

    const marks = parseFloat(marksInput ? marksInput.value : "0") || 0;
    const income = incomeSel ? incomeSel.value : "above";
    const domicile = domicileSel ? domicileSel.value : "no";

    const rules = SITE.SCHOLARSHIP || { marksMinPercent: 60, annualGrantInr: null, courseYears: 4 };
    const eligible = domicile === "yes" && income === "below" && marks >= Number(rules.marksMinPercent || 60);

    document.getElementById("calcBaseFee").textContent = formatInr(baseFee);

    if (eligible) {
      alertBox.className = "";
      alertBox.style.cssText = "background:var(--green-bg);color:var(--green);border:1px solid #A7F3D0;padding:12px 14px;border-radius:8px;font-size:13.5px;font-weight:600;";
      if (rules.annualGrantInr != null) {
        const grantTotal = Number(rules.annualGrantInr) * Number(rules.courseYears || 4);
        const net = Math.max(0, baseFee - grantTotal);
        alertBox.textContent = "Congratulations — your inputs meet the configured SVMCM eligibility criteria.";
        document.getElementById("calcSvmcmDiscount").textContent = "-" + formatInr(grantTotal);
        document.getElementById("calcNetPayable").textContent = formatInr(net);
      } else {
        alertBox.textContent = "Congratulations — your inputs meet the configured SVMCM criteria (WB domicile, income below limit, marks threshold). Confirm the current grant amount on the official SVMCM notice.";
        document.getElementById("calcSvmcmDiscount").textContent = "Per official SVMCM notice";
        document.getElementById("calcNetPayable").textContent = "Confirm grant on official notice";
      }
    } else {
      alertBox.className = "";
      alertBox.style.cssText = "background:var(--amber-bg);color:var(--amber);border:1px solid #FDE68A;padding:12px 14px;border-radius:8px;font-size:13.5px;font-weight:600;";
      const reasons = [];
      if (domicile !== "yes") reasons.push("West Bengal domicile");
      if (income !== "below") reasons.push("family income within the official SVMCM limit");
      if (marks < Number(rules.marksMinPercent || 60)) reasons.push("minimum " + rules.marksMinPercent + "% in Class 12");
      alertBox.textContent = "Does not meet SVMCM criteria (" + reasons.join(", ") + "). Institutional or other government schemes may still apply — verify on the official portal.";
      document.getElementById("calcSvmcmDiscount").textContent = "INR 0";
      document.getElementById("calcNetPayable").textContent = formatInr(baseFee);
    }

    trackEvent("tool_submitted", { tool: "svmcm_estimator", eligible: String(eligible) });
  }

  function renderCounsellor() {
    const box = document.getElementById("counsellorBox");
    if (!box) return;
    const c = SITE.COUNSELLOR || {};
    const hasDetails = Boolean(c.name || c.bio || c.yearsExperience != null || c.photo);
    const initials = (c.name || "CC")
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const avatarHtml = c.photo
      ? '<img src="' + esc(c.photo) + '" alt="' + esc(c.name || "Admissions Counsellor") + '" loading="lazy" decoding="async">'
      : "<span>" + esc(initials || "CC") + "</span>";

    const expHtml =
      c.yearsExperience != null
        ? '<p style="font-size:13.5px;font-weight:700;color:var(--amber);margin-top:4px;">' + esc(t("yearsLabel", { n: c.yearsExperience })) + "</p>"
        : "";

    box.innerHTML =
      '<div class="counsellor-avatar">' + avatarHtml + "</div>" +
      "<div>" +
        '<div class="section-kicker">' + esc(t("counsellorRole")) + "</div>" +
        '<h3 style="font-family:var(--font-display);font-size:24px;color:var(--navy);margin-top:4px;">' +
          esc(c.name || "Senior Admissions Counsellor") +
        "</h3>" +
        expHtml +
        '<p style="color:var(--slate-700);margin-top:10px;line-height:1.6;">' +
          esc(c.bio || t("counsellorPending")) +
        "</p>" +
        (!hasDetails ? '<p style="font-size:12.5px;color:var(--slate-500);margin-top:8px;">Update <code>SITE.COUNSELLOR</code> in <code>js/site-config.js</code>.</p>' : "") +
      "</div>";
  }

  function renderTestimonials(list) {
    const sec = document.getElementById("testimonials");
    const grid = document.getElementById("testimonialsGrid");
    if (!sec || !grid) return;
    if (!Array.isArray(list) || list.length === 0) {
      sec.hidden = true;
      return;
    }
    sec.hidden = false;
    grid.innerHTML = list
      .map(
        (item) =>
          '<div class="testimonial-card">' +
            '<p class="testimonial-quote">"' + esc(item.quote) + '"</p>' +
            '<div class="testimonial-author">' + esc(item.author) + (item.context ? " · " + esc(item.context) : "") + "</div>" +
          "</div>"
      )
      .join("");
  }

  function renderDates(list) {
    const grid = document.getElementById("datesGrid");
    if (!grid || !Array.isArray(list)) return;
    grid.innerHTML = list
      .map((exam) => {
        const rows = (exam.milestones || [])
          .map(
            (m) =>
              '<li class="date-milestone"><span>' + esc(m.label) + "</span><span>" + esc(m.when || "Verify on the official site") + "</span></li>"
          )
          .join("");
        return (
          '<div class="date-card">' +
            '<div class="date-card-head">' +
              "<div><h3>" + esc(exam.name) + '</h3><div style="font-size:12.5px;color:var(--slate-500);">' + esc(exam.official_name) + "</div></div>" +
              '<a class="date-official-link" href="' + esc(exam.official_url) + '" target="_blank" rel="noopener noreferrer">Official site ↗</a>' +
            "</div>" +
            '<ul class="date-milestones">' + rows + "</ul>" +
          "</div>"
        );
      })
      .join("");
  }

  /* Minimal pure-JS single-page PDF generator for the Admission Documents Checklist */
  function buildChecklistPdfBlob(studentName, phone) {
    const lines = [
      "Chatterjee Corporate Solutions - Admission Documents Checklist",
      "Prepared for: " + studentName + " (" + phone + ")",
      "Office: " + (SITE.OFFICE_ADDRESS || "Park Street, Kolkata 700016"),
      "Helpline: " + (SITE.PHONE_PRIMARY_DISPLAY || "+91 861 760 7380") + " / " + (SITE.PHONE_SECONDARY_DISPLAY || "+91 62940 62517"),
      "----------------------------------------------------------------",
      "1. Class 10 Admit Card & Marksheet (Original + 3 photocopies)",
      "2. Class 12 Marksheet & Pass Certificate (Original + 3 photocopies)",
      "3. Entrance Exam Admit Card & Rank Card (WBJEE / JEE / NEET / CUET)",
      "4. Seat Allotment Letter & Fee Payment Receipt (if counselled)",
      "5. School Leaving / Transfer / Migration Certificate",
      "6. Character Certificate from last attended school",
      "7. Student Aadhaar Card / Valid Photo ID (Original + photocopy)",
      "8. Passport-size Colour Photographs (8 copies)",
      "9. West Bengal Domicile Certificate (Proforma A1/A2/B if applicable)",
      "10. Family Income Certificate (for SVMCM / TFW / WBFS if applicable)",
      "11. Category / PwD Certificate (if claiming reservation)",
      "12. Medical Fitness & Blood Group Certificate (per college notice)",
      "13. Anti-Ragging Affidavits (Student & Parent, per UGC format)",
      "----------------------------------------------------------------",
      "Always confirm the final document list on your allotted college's notice."
    ];

    function pdfEsc(s) {
      return s.replace(/[^\x20-\x7E]/g, "-").replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
    }

    const contentLines = ["BT", "/F1 11 Tf", "50 760 Td", "16 TL"];
    lines.forEach((line, idx) => {
      if (idx === 0) contentLines.push("(" + pdfEsc(line) + ") Tj");
      else contentLines.push("T* (" + pdfEsc(line) + ") Tj");
    });
    contentLines.push("ET");
    const stream = contentLines.join("\n");

    const objs = [
      "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n",
      "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n",
      "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n",
      "4 0 obj << /Length " + stream.length + " >> stream\n" + stream + "\nendstream endobj\n",
      "5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n"
    ];

    let pdf = "%PDF-1.4\n";
    const offsets = [0];
    objs.forEach((o) => {
      offsets.push(pdf.length);
      pdf += o;
    });
    const xrefPos = pdf.length;
    pdf += "xref\n0 " + (objs.length + 1) + "\n0000000000 65535 f \n";
    for (let i = 1; i <= objs.length; i++) {
      pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
    }
    pdf += "trailer << /Size " + (objs.length + 1) + " /Root 1 0 R >>\nstartxref\n" + xrefPos + "\n%%EOF";
    return new Blob([pdf], { type: "application/pdf" });
  }

  function handleChecklistSubmit(e) {
    e.preventDefault();
    const nameEl = document.getElementById("chk-name");
    const phoneEl = document.getElementById("chk-phone");
    const statusEl = document.getElementById("checklistStatus");
    const name = nameEl ? nameEl.value.trim() : "";
    const phone = normalizePhone(phoneEl ? phoneEl.value : "");

    if (name.length < 2) {
      if (statusEl) statusEl.textContent = "Please enter the student's name.";
      if (nameEl) nameEl.focus();
      return;
    }
    if (!phone) {
      if (statusEl) statusEl.textContent = "Please enter a valid 10-digit Indian mobile number.";
      if (phoneEl) phoneEl.focus();
      return;
    }

    const blob = buildChecklistPdfBlob(name, phone);
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Chatterjee-Admission-Documents-Checklist.pdf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);

    if (statusEl) {
      statusEl.textContent = "Checklist PDF downloaded. Bring these originals and copies to your session.";
    }
    trackEvent("tool_submitted", { tool: "checklist_pdf" });
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const errEl = document.getElementById("formErrorMsg");
    const successEl = document.getElementById("formSuccessPanel");
    const submitBtn = form.querySelector('button[type="submit"]');
    if (errEl) {
      errEl.hidden = true;
      errEl.textContent = "";
    }

    const name = (document.getElementById("enq-student").value || "").trim();
    const rawPhone = (document.getElementById("enq-phone").value || "").trim();
    const phone = normalizePhone(rawPhone);
    const stream = (document.getElementById("enq-stream").value || "").trim();
    const board = (document.getElementById("enq-board").value || "").trim();
    const college = (document.getElementById("enq-preferred").value || "").trim();
    const message = (document.getElementById("enq-msg").value || "").trim();
    const honeypot = (document.getElementById("enq-company") || {}).value || "";

    if (name.length < 2) {
      errEl.textContent = "Please enter the student's full name.";
      errEl.hidden = false;
      return;
    }
    if (!phone) {
      errEl.textContent = "Please enter a valid 10-digit Indian mobile number.";
      errEl.hidden = false;
      return;
    }

    if (submitBtn) submitBtn.disabled = true;

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name,
          phone: phone,
          stream: stream,
          board: board,
          college: college,
          message: message,
          company_website: honeypot
        })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        errEl.innerHTML =
          esc(data.error || "Could not submit the form right now.") +
          ' You can call <a href="tel:' + esc(SITE.PHONE_PRIMARY_TEL || "+918617607380") + '">' +
          esc(SITE.PHONE_PRIMARY_DISPLAY || "+91 861 760 7380") +
          '</a> or <a href="' + esc(waUrl()) + '" target="_blank" rel="noopener">chat on WhatsApp</a>.';
        errEl.hidden = false;
        return;
      }

      form.reset();
      form.hidden = true;
      if (successEl) {
        const p1d = SITE.PHONE_PRIMARY_DISPLAY || "+91 861 760 7380";
        const p1t = SITE.PHONE_PRIMARY_TEL || "+918617607380";
        const p2d = SITE.PHONE_SECONDARY_DISPLAY || "+91 62940 62517";
        const p2t = SITE.PHONE_SECONDARY_TEL || "+916294062517";
        successEl.innerHTML =
          "<strong>Enquiry received for " + esc(name) + ".</strong>" +
          "<span>We will reach out on " + esc(phone) + " with the official written schedule.</span>" +
          '<div>Need an immediate reply? Call <a href="tel:' + esc(p1t) + '">' + esc(p1d) + '</a> / <a href="tel:' + esc(p2t) + '">' + esc(p2d) + '</a> or <a href="' + esc(waUrl("Hi, I just submitted an enquiry for " + name + ".")) + '" target="_blank" rel="noopener" data-wa-link="true">WhatsApp us</a>.</div>';
        successEl.hidden = false;
      }
      trackEvent("enquiry_submitted", { stream: stream });
      showToast("Enquiry submitted successfully.");
    } catch (_) {
      errEl.innerHTML =
        "Network error while sending the enquiry. Please call " +
        '<a href="tel:' + esc(SITE.PHONE_PRIMARY_TEL || "+918617607380") + '">' + esc(SITE.PHONE_PRIMARY_DISPLAY || "+91 861 760 7380") + "</a> / " +
        '<a href="tel:' + esc(SITE.PHONE_SECONDARY_TEL || "+916294062517") + '">' + esc(SITE.PHONE_SECONDARY_DISPLAY || "+91 62940 62517") + "</a>.";
      errEl.hidden = false;
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  function switchToolTab(tabId, btn) {
    document.querySelectorAll(".tool-tab-trigger").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tool-panel").forEach((p) => p.classList.remove("active"));
    if (btn) btn.classList.add("active");
    const panel = document.getElementById("tool-" + tabId);
    if (panel) panel.classList.add("active");
  }

  function handleImageError(imgEl, title) {
    imgEl.onerror = null;
    const initials = String(title || "CC")
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 3)
      .join("");
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="400" viewBox="0 0 800 400">' +
      '<rect width="100%" height="100%" fill="#0F1E33"/>' +
      '<text x="50%" y="48%" font-family="sans-serif" font-weight="bold" font-size="34" fill="#F5BD02" text-anchor="middle">' + esc(initials) + "</text>" +
      '<text x="50%" y="66%" font-family="sans-serif" font-size="18" fill="#FFFFFF" text-anchor="middle">' + esc(title) + "</text>" +
      "</svg>";
    imgEl.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  /* Expose handlers used by inline attributes */
  window.switchToolTab = switchToolTab;
  window.runRankPredictor = runRankPredictor;
  window.filterStream = filterStream;
  window.handleSearch = handleSearch;
  window.handleBudgetFilter = handleBudgetFilter;
  window.resetFilters = resetFilters;
  window.openDetailModal = openDetailModal;
  window.closeDetailModal = closeDetailModal;
  window.prefillCollegeInForm = prefillCollegeInForm;
  window.toggleCompare = toggleCompare;
  window.removeCompareItem = removeCompareItem;
  window.clearComparison = clearComparison;
  window.openComparisonModal = openComparisonModal;
  window.closeComparisonModal = closeComparisonModal;
  window.handleFormSubmit = handleFormSubmit;
  window.handleImageError = handleImageError;
  window.requestCollegeSchedule = requestCollegeSchedule;

  document.addEventListener("DOMContentLoaded", async () => {
    hydrateContacts();
    setupMobileNav();

    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => applyLanguage(btn.getAttribute("data-lang")));
    });

    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[data-wa-link="true"], a[href^="https://wa.me/"]');
      if (link) trackEvent("whatsapp_click", { href: link.getAttribute("href") });
    });

    const schForm = document.getElementById("scholarshipForm");
    if (schForm) schForm.addEventListener("submit", handleScholarshipSubmit);

    const calcCollege = document.getElementById("calcCollege");
    if (calcCollege) calcCollege.addEventListener("change", syncScholarshipFeeField);

    const chkForm = document.getElementById("checklistForm");
    if (chkForm) chkForm.addEventListener("submit", handleChecklistSubmit);

    try {
      const [collegesRes, datesRes, testRes] = await Promise.all([
        fetch("data/colleges.json"),
        fetch("data/dates.json"),
        fetch("data/testimonials.json")
      ]);
      COLLEGES = await collegesRes.json();
      const dates = await datesRes.json();
      const testimonials = await testRes.json();

      updateCounts();
      updateBudgetFilterVisibility();
      populateScholarshipColleges();
      syncScholarshipFeeField();
      renderColleges();
      runRankPredictor(false);
      renderDates(dates);
      renderTestimonials(testimonials);
    } catch (err) {
      const grid = document.getElementById("collegesGrid");
      if (grid) {
        grid.innerHTML = '<div style="padding:24px;color:var(--slate-700);">Could not load college directory. Please refresh or call our helpline.</div>';
      }
    }

    applyLanguage(currentLang);
  });
})();
