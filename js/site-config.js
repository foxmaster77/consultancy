/* Chatterjee Corporate Solutions — edit this file only for contact details,
   counsellor profile, scholarship thresholds, and interface language text.
   Do not put college fee or placement figures here. Those belong in data/colleges.json
   and must come from the institution's own notice. */
window.SITE = {
  PHONE_PRIMARY_DISPLAY: "+91 861 760 7380",
  PHONE_PRIMARY_TEL: "+918617607380",
  PHONE_SECONDARY_DISPLAY: "+91 62940 62517",
  PHONE_SECONDARY_TEL: "+916294062517",
  /* WhatsApp stays on the primary line unless you change this value. */
  WHATSAPP_NUMBER: "918617607380",
  WHATSAPP_TEXT: "Hello Chatterjee Corporate Solutions, I am looking for guidance on Kolkata private college admissions.",

  OFFICE_ADDRESS: "Suite 4B, Park Center, Park Street / Maidan, Kolkata 700016",
  OFFICE_HOURS: "Monday – Saturday: 10:00 AM – 7:30 PM (Sunday by Appointment)",
  MAPS_QUERY: "Park Street, Kolkata 700016",

  /* Budget filter appears only when this share of colleges have a verified total fee. */
  BUDGET_MIN_VERIFIED_RATIO: 0.6,

  /* Eligibility checklist for the SVMCM estimator. Confirm these against the
     current government notice before you rely on them, then edit the numbers. */
  SCHOLARSHIP: {
    marksMinPercent: 60,
    incomeMaxInr: 250000,
    /* Leave null until you copy the year's grant from the official SVMCM notice. */
    annualGrantInr: null,
    courseYears: 4
  },

  /* Fill these in. Empty fields are not replaced with a made-up profile. */
  COUNSELLOR: {
    name: "",
    photo: "",
    bio: "",
    yearsExperience: null
  },

  I18N: {
    en: {
      heroTitle: "The right private college, at a <em>fee you understand.</em>",
      heroLead: "We help Class 12 students and parents compare private colleges in Kolkata. Fee and placement figures appear only after they are copied from the institution's written notice.",
      ctaFind: "Find colleges",
      ctaExplore: "Explore {n} colleges",
      ctaBook: "Book a Session",
      ctaCall: "Call",
      ctaWhatsapp: "WhatsApp",
      navTools: "Rank & Fee Tools",
      navColleges: "Colleges Directory",
      navProcess: "How it Works",
      navRules: "Ground Rules",
      navFaq: "Questions",
      navCompare: "Compare",
      formTitle: "Request Free Counselling",
      labelName: "Student's Full Name *",
      labelPhone: "Parent / Student Phone *",
      labelStream: "Stream / Program *",
      labelBoard: "Class 12 Board",
      labelCollege: "Target college",
      labelMessage: "Message",
      submit: "Confirm Counselling Session",
      privacyNote: "We use your name, phone, stream, board, college, and message only to reply to this enquiry.",
      feeOnRequest: "Fee on request · written schedule before you pay",
      requestSchedule: "Request fee schedule",
      placementOnRequest: "Placement on request · confirm the institution's placement report",
      requestPlacement: "Request placement report",
      counsellorRole: "Admissions counsellor",
      counsellorPending: "Name, photo, short bio, and years of experience are added in the site config.",
      yearsLabel: "{n} years of experience",
      checkEligibility: "Check eligibility",
      scholarshipNeutral: "Enter the college, your details, and the total tuition from that college's fee notice. An eligibility message appears only after you check.",
      menuLabel: "Menu"
    },
    bn: {
      heroTitle: "সঠিক বেসরকারি কলেজ, <em>যে ফি আপনি বুঝে নিতে পারেন।</em>",
      heroLead: "ক্লাস ১২-এর ছাত্রছাত্রী ও অভিভাবকদের জন্য কলকাতার বেসরকারি কলেজ। ফি ও প্লেসমেন্ট তখনই দেখাই, যখন সেটি প্রতিষ্ঠানের লিখিত নোটিস থেকে নেওয়া।",
      ctaFind: "কলেজ খুঁজুন",
      ctaExplore: "{n}টি কলেজ দেখুন",
      ctaBook: "সেশন বুক করুন",
      ctaCall: "কল",
      ctaWhatsapp: "হোয়াটসঅ্যাপ",
      navTools: "টুল",
      navColleges: "কলেজ তালিকা",
      navProcess: "কীভাবে হয়",
      navRules: "নীতি",
      navFaq: "প্রশ্ন",
      navCompare: "তুলনা",
      formTitle: "ফ্রি কাউন্সেলিংয়ের অনুরোধ",
      labelName: "ছাত্রছাত্রীর পুরো নাম *",
      labelPhone: "ফোন *",
      labelStream: "স্ট্রিম *",
      labelBoard: "ক্লাস ১২ বোর্ড",
      labelCollege: "যে কলেজ নিয়ে জানতে চান",
      labelMessage: "বার্তা",
      submit: "সেশন নিশ্চিত করুন",
      privacyNote: "নাম, ফোন, স্ট্রিম, বোর্ড, কলেজ ও বার্তা শুধু এই জিজ্ঞাসার উত্তর দিতে ব্যবহার হয়।",
      feeOnRequest: "ফি অনুরোধে · টাকা দেওয়ার আগে লিখিত তালিকা",
      requestSchedule: "ফি তালিকা চাইুন",
      placementOnRequest: "প্লেসমেন্ট অনুরোধে · প্রতিষ্ঠানের রিপোর্ট যাচাই করুন",
      requestPlacement: "প্লেসমেন্ট রিপোর্ট চাইুন",
      counsellorRole: "ভর্তি কাউন্সেলর",
      counsellorPending: "নাম, ছবি, সংক্ষিপ্ত পরিচিতি ও অভিজ্ঞতার বছর সাইট কনফিগে বসানো হয়।",
      yearsLabel: "{n} বছরের অভিজ্ঞতা",
      checkEligibility: "যোগ্যতা দেখুন",
      scholarshipNeutral: "কলেজ, আপনার তথ্য, এবং কলেজের ফি নোটিসের মোট টিউশন লিখুন। যোগ্যতার বার্তা শুধু চেক করার পর আসে।",
      menuLabel: "মেনু"
    },
    hi: {
      heroTitle: "सही प्राइवेट कॉलेज, <em>वह फीस जो आप समझ सकें।</em>",
      heroLead: "कक्षा 12 के छात्रों और अभिभावकों के लिए कोलकाता के प्राइवेट कॉलेज। फीस और प्लेसमेंट तभी दिखाते हैं जब वे संस्थान की लिखित सूचना से लिए गए हों।",
      ctaFind: "कॉलेज खोजें",
      ctaExplore: "{n} कॉलेज देखें",
      ctaBook: "सत्र बुक करें",
      ctaCall: "कॉल",
      ctaWhatsapp: "व्हाट्सऐप",
      navTools: "टूल्स",
      navColleges: "कॉलेज सूची",
      navProcess: "प्रक्रिया",
      navRules: "नियम",
      navFaq: "प्रश्न",
      navCompare: "तुलना",
      formTitle: "मुफ्त काउंसलिंग का अनुरोध",
      labelName: "छात्र का पूरा नाम *",
      labelPhone: "फोन *",
      labelStream: "स्ट्रीम *",
      labelBoard: "कक्षा 12 बोर्ड",
      labelCollege: "जिस कॉलेज के बारे में पूछना है",
      labelMessage: "संदेश",
      submit: "सत्र की पुष्टि करें",
      privacyNote: "नाम, फोन, स्ट्रीम, बोर्ड, कॉलेज और संदेश का उपयोग केवल इस पूछताछ का उत्तर देने के लिए होता है।",
      feeOnRequest: "फीस अनुरोध पर · भुगतान से पहले लिखित सूची",
      requestSchedule: "फीस सूची माँगें",
      placementOnRequest: "प्लेसमेंट अनुरोध पर · संस्थान की रिपोर्ट से पुष्टि करें",
      requestPlacement: "प्लेसमेंट रिपोर्ट माँगें",
      counsellorRole: "प्रवेश काउंसलर",
      counsellorPending: "नाम, फोटो, संक्षिप्त परिचय और अनुभव के वर्ष साइट कॉन्फ़िग में भरे जाते हैं।",
      yearsLabel: "{n} वर्षों का अनुभव",
      checkEligibility: "पात्रता देखें",
      scholarshipNeutral: "कॉलेज, अपना विवरण, और कॉलेज की फीस सूचना से कुल ट्यूशन लिखें। पात्रता का संदेश जाँच के बाद ही दिखेगा।",
      menuLabel: "मेनू"
    }
  }
};
