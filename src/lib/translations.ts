import { SpecialDayEvent, EventCategory } from "../types";

export type Language = "bn" | "en" | "hi";

export const categoryTranslations: Record<EventCategory, Record<Language, string>> = {
  national: {
    bn: "জাতীয় দিবস",
    en: "National Day",
    hi: "राष्ट्रीय दिवस"
  },
  international: {
    bn: "আন্তর্জাতিক দিবস",
    en: "International Day",
    hi: "अंतरराष्ट्रीय दिवस"
  },
  west_bengal: {
    bn: "পশ্চিমবঙ্গ বিশেষ",
    en: "West Bengal Special",
    hi: "पश्चिम बंगाल विशेष"
  },
  freedom_fighter: {
    bn: "স্বাধীনতা সংগ্রামী",
    en: "Freedom Fighter",
    hi: "स्वतंत्रता सेनानी"
  },
  poet: {
    bn: "কবি",
    en: "Poet",
    hi: "कवि"
  },
  writer: {
    bn: "সাহিত্যিক",
    en: "Writer",
    hi: "साहित्यकार"
  },
  scientist: {
    bn: "বিজ্ঞানী",
    en: "Scientist",
    hi: "वैज्ञानिक"
  },
  leader: {
    bn: "নেতা ও মনীষী",
    en: "Leader & Thinker",
    hi: "नेता एवं मनीषी"
  },
  sports: {
    bn: "খেলাধুলা",
    en: "Sports",
    hi: "खेलकूद"
  },
  religious: {
    bn: "ধর্মীয় উৎসব",
    en: "Religious Festival",
    hi: "धार्मिक त्योहार"
  },
  history: {
    bn: "ইতিহাসে আজ",
    en: "History Today",
    hi: "आज का इतिहास"
  }
};

export const uiTranslations = {
  appTitle: {
    bn: "বিশেষ দিন ক্যালেন্ডার",
    en: "Special Day Calendar",
    hi: "विशेष दिन कैलेंडर"
  },
  appSlogan: {
    bn: "এক জায়গায় প্রতিদিনের সব বিশেষ দিন, শুভেচ্ছা ও তথ্য।",
    en: "All special days, wishes & info in one place.",
    hi: "हर विशेष दिन, शुभकामनाएं और जानकारी एक जगह।"
  },
  searchPlaceholder: {
    bn: "রবীন্দ্রনাথ, নজরুল, পরিবেশ দিবস...",
    en: "Search Nobelists, writers, festivals...",
    hi: "रवींद्रनाथ, नजरुल, पर्यावरण दिवस..."
  },
  navCalendar: {
    bn: "ক্যালেন্ডার ভিউ",
    en: "Calendar View",
    hi: "कैलेंडर व्यू"
  },
  navNotifications: {
    bn: "দিবস নোটিফিকেশন",
    en: "Day Notifications",
    hi: "दिवस सूचनाएं"
  },
  navFavorites: {
    bn: "পছন্দ তালিকা",
    en: "Favorites List",
    hi: "पसंदीदा सूची"
  },
  navAdmin: {
    bn: "এডমিন প্যানেল",
    en: "Admin Panel",
    hi: "एडमिन पैनल"
  },
  googleLogin: {
    bn: "গুগল দিয়ে লগইন",
    en: "Login with Google",
    hi: "गूगल से लॉगिन"
  },
  logout: {
    bn: "লগআউট",
    en: "Logout",
    hi: "लॉगआउट"
  },
  searchResults: {
    bn: "অনুসন্ধান ফলাফল",
    en: "Search Results",
    hi: "खोज परिणाम"
  },
  noResults: {
    bn: "কোন ফলাফল পাওয়া যায়নি!",
    en: "No results found!",
    hi: "कोई परिणाम नहीं मिला!"
  },
  noResultsSub: {
    bn: "দয়া করে অন্য কোন শব্দ বা বানানে অনুসন্ধান করে দেখুন।",
    en: "Please try searching with another word or spelling.",
    hi: "कृपया किसी अन्य शब्द या वर्तनी के साथ खोजने का प्रयास करें।"
  },
  tipHeader: {
    bn: "টিপস:",
    en: "Tip:",
    hi: "सुझाव:"
  },
  tipText: {
    bn: "ক্যালেন্ডারের যেকোনো তারিখে ক্লিক করে সেই দিনের গুরুত্বপূর্ণ ঐতিহাসিক ঘটনা, কবি-সাহিত্যিকদের জয়ন্তী এবং শুভেচ্ছা বার্তা দেখতে পারেন!",
    en: "Click on any date in the calendar to view important historic events, birthdays of poets/writers, and wishes for that day!",
    hi: "कैंडल में किसी भी तारीख पर क्लिक करके उस दिन की महत्वपूर्ण ऐतिहासिक घटनाएं, कवियों/लेखकों की जयंती और शुभकामनाएं देख सकते हैं!"
  },
  selectedDateLabel: {
    bn: "নির্বাচিত তারিখ",
    en: "Selected Date",
    hi: "चयनित तिथि"
  },
  todaysEvents: {
    bn: "আজকের বিশেষ ইভেন্টসমূহ",
    en: "Today's Special Events",
    hi: "आज के विशेष कार्यक्रम"
  },
  noEvents: {
    bn: "এই তারিখে কোন পূর্ব-নির্ধারিত ইভেন্ট নেই।",
    en: "No pre-scheduled events on this date.",
    hi: "इस तारीख को कोई पूर्व-निर्धारित कार्यक्रम नहीं है।"
  },
  noEventsSub: {
    bn: "ক্যালেন্ডারে অন্য কোন তারিখে ক্লিক করুন অথবা এডমিন প্যানেল থেকে নতুন দিবস যোগ করুন!",
    en: "Click on another date in the calendar or add a new special day from the Admin Panel!",
    hi: "कैलेंडर में किसी अन्य तारीख पर क्लिक करें या एडमिन पैनल से नया दिन जोड़ें!"
  },
  readyWishes: {
    bn: "🎁 শুভেচ্ছা ও মেসেজ সমূহ (Ready-made Wishes)",
    en: "🎁 Ready-made Wishes & Messages",
    hi: "🎁 शुभकामनाएं और संदेश (Ready-made Wishes)"
  },
  askGemini: {
    bn: "AI দিয়ে লিখুন",
    en: "Generate with AI",
    hi: "AI से लिखवाएं"
  },
  aiWriting: {
    bn: "AI লিখছে...",
    en: "AI is writing...",
    hi: "AI लिख रहा है..."
  },
  aiError: {
    bn: "AI শুভেচ্ছা তৈরি করতে ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।",
    en: "Failed to generate AI wishes. Please try again.",
    hi: "AI शुभकामनाएं उत्पन्न करने में विफल रहा। कृपया पुनः प्रयास करें।"
  },
  copyBtn: {
    bn: "কপি",
    en: "Copy",
    hi: "कॉपी"
  },
  copiedBtn: {
    bn: "কপি করা হয়েছে",
    en: "Copied",
    hi: "कॉपी हो गया"
  },
  shareBtn: {
    bn: "শেয়ার",
    en: "Share",
    hi: "शेयर"
  },
  aiWishesBoxTitle: {
    bn: "✨ AI জেনারেটেড স্পেশাল শুভেচ্ছা ও স্ট্যাটাস সমূহ",
    en: "✨ AI Generated Special Wishes & Statuses",
    hi: "✨ AI द्वारा तैयार विशेष शुभकामनाएं और स्टेटस"
  },
  aiWishesNotice: {
    bn: "এই শুভেচ্ছা বার্তাগুলি সম্পূর্ণ ইউনিক এবং বিশেষ করে এই দিনের জন্য তৈরি করা হয়েছে!",
    en: "These wishes are completely unique and crafted specifically for this day!",
    hi: "ये शुभकामनाएं पूरी तरह से अनोखी हैं और विशेष रूप से इस दिन के लिए तैयार की गई हैं!"
  },
  posterMakerTitle: {
    bn: "🖼️ Gemini AI ইমেজ জেনারেটর",
    en: "🖼️ Gemini AI Image Generator",
    hi: "🖼️ Gemini AI इमेज जनरेटर"
  },
  posterMakerSub: {
    bn: "বিশেষ দিনের জন্য অনন্য AI সোশ্যাল মিডিয়া পোস্টার ও গ্রাফিক্স তৈরি করুন",
    en: "Create unique AI social media posters and graphics for special days",
    hi: "विशेष दिनों के लिए अद्वितीय AI सोशल मीडिया पोस्टर और ग्राफिक्स बनाएं"
  },
  aspectRatioLabel: {
    bn: "সাইজ এবং ফর্ম্যাট (ASPECT RATIO)",
    en: "Size and Format (ASPECT RATIO)",
    hi: "आकार और प्रारूप (ASPECT RATIO)"
  },
  square: {
    bn: "বর্গাকার (1:1)",
    en: "Square (1:1)",
    hi: "वर्गाकार (1:1)"
  },
  banner: {
    bn: "ব্যানার (16:9)",
    en: "Banner (16:9)",
    hi: "बैनर (16:9)"
  },
  status: {
    bn: "স্ট্যাটাস (9:16)",
    en: "Status (9:16)",
    hi: "स्टेटस (9:16)"
  },
  selectTheme: {
    bn: "ডিজাইন থিম বা কালার প্যালেট নির্বাচন করুন",
    en: "Select Design Theme or Color Palette",
    hi: "डिजाइन थीम या रंग पैलेट चुनें"
  },
  yourNamePlaceholder: {
    bn: "কার্ডে আপনার নাম লিখুন (যেমন: সুব্রত নস্কর)",
    en: "Enter your name for the card (e.g., Subrata Naskar)",
    hi: "कार्ड पर अपना नाम दर्ज करें (जैसे: सुब्रत नस्कर)"
  },
  generatePosterBtn: {
    bn: "ডাউনলোড পোস্টার ইমেজ",
    en: "Download Poster Image",
    hi: "पोस्टर इमेज डाउनलोड करें"
  },
  customCardHeader: {
    bn: "কাস্টম শুভেচ্ছা কার্ড তৈরি করুন",
    en: "Create Custom Greeting Card",
    hi: "कस्टम ग्रीटिंग कार्ड बनाएं"
  },
  footerDesc: {
    bn: "বাঙালির আবেগ ও সংস্কৃতির মেরুদণ্ড এবং আন্তর্জাতিক পর্যায়ের গুরুত্বপূর্ণ দিনগুলিকে এক ছাতার তলায় পরিবেশন করতে এই ক্যালেন্ডারটি তৈরি করা হয়েছে।",
    en: "This calendar was created to present the backbone of emotions, culture, and important international days under one roof.",
    hi: "यह कैलेंडर भावनाओं, संस्कृति और महत्वपूर्ण अंतरराष्ट्रीय दिनों को एक छत के नीचे प्रस्तुत करने के लिए बनाया गया है।"
  },
  nationalDaysLink: {
    bn: "জাতীয় দিবস",
    en: "National Days",
    hi: "राष्ट्रीय दिवस"
  },
  wbFestivalLink: {
    bn: "পশ্চিমবঙ্গ উৎসব",
    en: "West Bengal Festivals",
    hi: "पश्चिम बंगाल त्योहार"
  },
  freedomFightersLink: {
    bn: "স্বাধীনতা সংগ্রামী",
    en: "Freedom Fighters",
    hi: "स्वतंत्रता सेनानी"
  },
  greatThinkersLink: {
    bn: "মনীষীদের জয়ন্তী",
    en: "Great Anniversaries",
    hi: "महान विभूतियों की जयंती"
  },
  monthTitleBn: {
    bn: [
      "জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন",
      "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"
    ],
    en: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    hi: [
      "जनवरी", "फरवरी", "मार्च", "अप्रैल", "मई", "जून",
      "जुलाई", "अगस्त", "सितंबर", "अक्टूबर", "नवंबर", "दिसंबर"
    ]
  },
  daysShort: {
    bn: ["রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র", "শনি"],
    en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    hi: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"]
  },
  modalTitle: {
    bn: "ভাষা নির্বাচন করুন (Select Language)",
    en: "Select Language / ভাষা নির্বাচন / भाषा चुनें",
    hi: "भाषा चुनें (Select Language)"
  },
  modalSubtitle: {
    bn: "ক্যালেন্ডারটি আপনার পছন্দের ভাষায় ব্যবহার করুন",
    en: "Use the calendar in your preferred language",
    hi: "अपनी पसंदीदा भाषा में कैलेंडर का उपयोग करें"
  },
  modalConfirm: {
    bn: "নিশ্চিত করুন",
    en: "Confirm",
    hi: "पुष्टि करें"
  },
  changeLanguage: {
    bn: "ভাষা পরিবর্তন",
    en: "Change Language",
    hi: "भाषा बदलें"
  }
};

// Hindi Translation Map for Default Events
export const defaultEventsHindi: Record<string, { titleHi: string; descriptionHi: string; wishesHi: string[] }> = {
  "vibe-jan-12": {
    titleHi: "राष्ट्रीय युवा दिवस (स्वामी विवेकानंद जयंती)",
    descriptionHi: "स्वामी विवेकानंद की जयंती के उपलक्ष्य में हर साल 12 जनवरी को भारत में राष्ट्रीय युवा दिवस मनाया जाता है। उनके आदर्श और शिक्षाएं युवाओं को प्रेरित करती हैं।",
    wishesHi: [
      "राष्ट्रीय युवा दिवस और स्वामी विवेकानंद जयंती की आप सभी को हार्दिक शुभकामनाएं और प्रणाम।",
      "“उठो, जागो और तब तक मत रुको जब तक लक्ष्य प्राप्त न हो जाए।” स्वामीजी के ये अनमोल शब्द हमें रास्ता दिखाएं। शुभ युवा दिवस!",
      "स्वामी विवेकानंद के आदर्शों को अपनाकर हमारे युवा देश के कल्याण के लिए आगे बढ़ें। शुभ युवा दिवस!"
    ]
  },
  "netaji-jan-23": {
    titleHi: "नेताजी सुभाष चंद्र बोस जयंती (पराक्रम दिवस)",
    descriptionHi: "भारत के स्वतंत्रता संग्राम के महान नायक नेताजी सुभाष चंद्र बोस की जयंती 23 जनवरी को पूरे देश में 'पराक्रम दिवस' के रूप में मनाई जाती है।",
    wishesHi: [
      "“तुम मुझे खून दो, मैं तुम्हें आजादी दूंगा!” नेताजी सुभाष चंद्र बोस की जयंती पर कोटि-कोटि नमन।",
      "पराक्रम दिवस पर नेताजी सुभाष चंद्र बोस के असीम साहस और देशभक्ति को सादर प्रणाम। जय हिंद!",
      "महान देशभक्त नेताजी की जयंती पर उनके आदर्शों और वीरता को याद करते हैं। शुभ पराक्रम दिवस!"
    ]
  },
  "republic-jan-26": {
    titleHi: "गणतंत्र दिवस (भारत का गणतंत्र दिवस)",
    descriptionHi: "26 जनवरी 1950 को स्वतंत्र भारत का संविधान लागू हुआ था। इस गौरवशाली दिन को हर साल पूरे देश में अत्यंत सम्मान के साथ मनाया जाता है।",
    wishesHi: [
      "गणतंत्र दिवस की सभी भारतीयों को हार्दिक शुभकामनाएं और बधाई। जय हिंद, वंदे मातरम!",
      "भारत के संविधान और हमारे महान लोकतंत्र को सलाम। शुभ गणतंत्र दिवस!",
      "हर भारतीय का मन देशभक्ति के रंग में रंग जाए। शुभ गणतंत्र दिवस!"
    ]
  },
  "mother-lang-feb-21": {
    titleHi: "अंतरराष्ट्रीय मातृभाषा दिवस",
    descriptionHi: "भाषा के लिए बंगाली युवाओं के सर्वोच्च बलिदान के सम्मान में यूनेस्को ने 21 फरवरी को अंतरराष्ट्रीय मातृभाषा दिवस घोषित किया है।",
    wishesHi: [
      "मातृभाषा दिवस के अवसर पर उन सभी भाषा शहीदों को विनम्र श्रद्धांजलि जिन्होंने अपनी मातृभाषा के लिए संघर्ष किया।",
      "अपनी मातृभाषा से प्यार करें और उसका सम्मान करें। अंतरराष्ट्रीय मातृभाषा दिवस की हार्दिक शुभकामनाएं।",
      "भाषाई विविधता मानवता की अमूल्य धरोहर है। आज अपनी मातृभाषा का उत्सव मनाएं!"
    ]
  },
  "womens-mar-08": {
    titleHi: "अंतरराष्ट्रीय महिला दिवस",
    descriptionHi: "महिलाओं की सामाजिक, आर्थिक, सांस्कृतिक और राजनीतिक उपलब्धियों को मान्यता देने के लिए हर साल 8 मार्च को अंतरराष्ट्रीय महिला दिवस मनाया जाता है।",
    wishesHi: [
      "घर से लेकर कार्यस्थल तक—हर जगह आपका प्रकाश है। अंतरराष्ट्रीय महिला दिवस की हार्दिक शुभकामनाएं!",
      "नारी की शक्ति, नारी की जीत, नए समाज की शुरुआत हो। शुभ अंतरराष्ट्रीय महिला दिवस!",
      "आप बेटी हैं, पत्नी हैं, मां हैं—आपका योगदान अतुलनीय है। महिला दिवस की शुभकामनाएं!"
    ]
  },
  "pohela-boishakh": {
    titleHi: "पोहेला बैशाख (बंगाली नव वर्ष)",
    descriptionHi: "बंगाली कैलेंडर का पहला दिन 'पोहेला बैशाख' पश्चिम बंगाल और बांग्लादेश में सांस्कृतिक उत्सवों, पूजा और नए व्यावसायिक खाता पूजन (हलखाता) के साथ मनाया जाता है।",
    wishesHi: [
      "नया साल आपके जीवन में असीम खुशी और समृद्धि लाए। शुभ नव वर्ष!",
      "पिछले सभी दुखों को भूलकर नए साल में नई आशाओं के साथ आगे बढ़ें। आपको और आपके परिवार को बंगाली नव वर्ष की शुभकामनाएं!",
      "बंगाली नव वर्ष (पोहेला बैशाख) की आप सभी को बहुत-बहुत बधाई। शुभ नोबोरषो!"
    ]
  },
  "rabindra-jayanti": {
    titleHi: "रवींद्रनाथ टैगोर जयंती (रवींद्र जयंती)",
    descriptionHi: "विश्वकवि रवींद्रनाथ टैगोर की जयंती 25वें बैशाख (आमतौर पर 8 या 9 मई) को मनाई जाती है। वे बंगाली संस्कृति और साहित्य की रीढ़ हैं।",
    wishesHi: [
      "नोबेल पुरस्कार विजेता कविगुरु रवींद्रनाथ टैगोर की जयंती पर सादर नमन और श्रद्धांजलि।",
      "हमारे राष्ट्रगान के रचयिता और मानव आत्मा के कवि रवींद्रनाथ टैगोर को याद करते हुए। शुभ रवींद्र जयंती!",
      "गुरुदेव के शाश्वत विचार और कविताएं हमारे मन को हमेशा आलोकित करती रहें। सादर रवींद्र जयंती!"
    ]
  },
  "nazrul-jayanti": {
    titleHi: "काजी नजरुल इस्लाम जयंती",
    descriptionHi: "विद्रोही कवि काजी नजरुल इस्लाम की जयंती। अन्याय और शोषण के खिलाफ उनकी लेखनी मुखर थी, जो लोगों को हमेशा प्रेरित करती है।",
    wishesHi: [
      "विद्रोही कवि काजी नजरुल इस्लाम की जयंती पर उन्हें सादर नमन।",
      "समानता, मानवता और क्रांति के कवि नजरुल इस्लाम की जयंती पर विनम्र श्रद्धांजलि।",
      "नजरुल जयंती की हार्दिक शुभकामनाएं! समाज में समानता और प्रेम का संदेश फैले।"
    ]
  },
  "env-day-jun-05": {
    titleHi: "विश्व पर्यावरण दिवस",
    descriptionHi: "पर्यावरण प्रदूषण को रोकने और जागरूकता बढ़ाने के लिए हर साल 5 जून को दुनिया भर में विश्व पर्यावरण दिवस मनाया जाता है।",
    wishesHi: [
      "हरा-भरा पर्यावरण, स्वस्थ जीवन। विश्व पर्यावरण दिवस पर आइए हम सब मिलकर कम से कम एक पेड़ लगाएं और उसकी देखभाल करें।",
      "विश्व पर्यावरण दिवस की शुभकामनाएं! आने वाली पीढ़ियों के लिए एक प्रदूषण मुक्त और हरी-भरी पृथ्वी बनाने का संकल्प लें।",
      "पेड़ लगाएं, जीवन बचाएं। पर्यावरण सुरक्षित रहेगा तो हम भी सुरक्षित रहेंगे। शुभ पर्यावरण दिवस!"
    ]
  },
  "doctors-day-jul-01": {
    titleHi: "राष्ट्रीय चिकित्सक दिवस",
    descriptionHi: "महान चिकित्सक और पश्चिम बंगाल के दूसरे मुख्यमंत्री डॉ. बिधान चंद्र रॉय के सम्मान में भारत में हर साल 1 जुलाई को चिकित्सक दिवस मनाया जाता है।",
    wishesHi: [
      "हमारे जीवन के रक्षक चिकित्सकों को सादर नमन और हार्दिक आभार। राष्ट्रीय चिकित्सक दिवस की शुभकामनाएं!",
      "महान चिकित्सक और दूरदर्शी नेता डॉ. बिधान चंद्र रॉय की जयंती पर सादर नमन और सभी डॉक्टरों को बधाई।",
      "अपनी निःस्वार्थ सेवा से हमें स्वस्थ रखने वाले सभी चिकित्सकों को हैप्पी डॉक्टर्स डे!"
    ]
  },
  "independence-aug-15": {
    titleHi: "भारत का स्वतंत्रता दिवस",
    descriptionHi: "15 अगस्त 1947 को भारत ब्रिटिश शासन से मुक्त होकर एक स्वतंत्र संप्रभु राष्ट्र बना था। इस दिन स्वतंत्रता सेनानियों को याद किया जाता है।",
    wishesHi: [
      "स्वतंत्रता दिवस की सभी देशवासियों को हार्दिक शुभकामनाएं और बधाई। जय हिंद!",
      "देशभक्तों के बलिदान को हम व्यर्थ नहीं जाने देंगे। देश के सम्मान की रक्षा का संकल्प लेते हैं। शुभ स्वतंत्रता दिवस!",
      "वंदे मातरम! देश की संप्रभुता और विविधता की रक्षा करना ही हमारा मुख्य लक्ष्य हो। शुभ स्वतंत्रता दिवस!"
    ]
  },
  "teachers-sep-05": {
    titleHi: "शिक्षक दिवस (डॉ. सर्वपल्ली राधाकृष्णन जयंती)",
    descriptionHi: "भारत के पूर्व राष्ट्रपति और दार्शनिक डॉ. सर्वपल्ली राधाकृष्णन की जयंती 5 सितंबर को भारत में शिक्षक दिवस के रूप में मनाई जाती है।",
    wishesHi: [
      "शिक्षक दिवस पर मेरे जीवन के सभी शिक्षकों को सादर प्रणाम और हार्दिक आभार।",
      "हमें अज्ञान के अंधकार से ज्ञान के प्रकाश की ओर ले जाने वाले हमारे मार्गदर्शकों को शुभ शिक्षक दिवस!",
      "प्रिय गुरुवर, आपके दिखाए रास्ते पर ही मैं चल रहा हूं। शिक्षक दिवस की हार्दिक शुभकामनाएं और सादर प्रणाम।"
    ]
  },
  "gandhi-oct-02": {
    titleHi: "गांधी जयंती (अंतरराष्ट्रीय अहिंसा दिवस)",
    descriptionHi: "राष्ट्रपिता महात्मा गांधी की जयंती 2 अक्टूबर को पूरे देश में श्रद्धा के साथ मनाई जाती है। इस दिन को अंतरराष्ट्रीय अहिंसा दिवस के रूप में भी मनाया जाता है।"
    ,
    wishesHi: [
      "सत्य और अहिंसा के पुजारी महात्मा गांधी की जयंती पर उन्हें सादर नमन। शुभ गांधी जयंती!",
      "“खुद वो बदलाव बनिए जो आप दुनिया में देखना चाहते हैं।” गांधीजी के इस महान विचार से प्रेरणा लें। शुभ गांधी जयंती!",
      "गांधी जयंती और अंतरराष्ट्रीय अहिंसा दिवस पर चारों ओर शांति और सद्भाव का संदेश फैले।"
    ]
  },
  "childrens-nov-14": {
    titleHi: "बाल दिवस (चाचा नेहरू जयंती)",
    descriptionHi: "भारत के पहले प्रधानमंत्री पंडित जवाहरलाल नेहरू की जयंती 14 नवंबर को भारत में बाल दिवस के रूप में मनाई जाती है। वे बच्चों से बेहद प्यार करते थे और 'चाचा नेहरू' के नाम से जाने जाते थे।",
    wishesHi: [
      "सभी प्यारे बच्चों को बाल दिवस की बहुत-बहुत शुभकामनाएं और ढेर सारा प्यार! आप हमारे देश का भविष्य हैं।",
      "हर बच्चे की मुस्कान बनी रहे। बाल दिवस की हार्दिक शुभकामनाएं और प्यार।",
      "चाचा नेहरू की जयंती और बाल दिवस पर हमारे हर बच्चे के उज्ज्वल भविष्य की कामना करते हैं।"
    ]
  },
  "christmas-dec-25": {
    titleHi: "क्रिसमस डे (बड़ा दिन)",
    descriptionHi: "प्रभु यीशु मसीह के पावन जन्म के उपलक्ष्य में हर साल 25 दिसंबर को दुनिया भर में और हमारे देश में भी क्रिसमस का त्योहार धूमधाम से मनाया जाता है।",
    wishesHi: [
      "आपको और आपके परिवार को क्रिसमस की बहुत-बहुत शुभकामनाएं और हार्दिक प्यार। मैरी क्रिसमस!",
      "प्रभु यीशु का आशीर्वाद आप पर बना रहे। जीवन सुख, शांति और समृद्धि से भर जाए। शुभ क्रिसमस!",
      "मैरी क्रिसमस! सांता क्लॉज आपके जीवन को खुशियों और सुंदर उपहारों से भर दे।"
    ]
  }
};

// Selection helpers to get translated values
export const getEventTitle = (event: SpecialDayEvent, lang: Language): string => {
  if (!event) return "";
  if (lang === "en") return event.titleEn || event.titleBn;
  if (lang === "hi") {
    const override = defaultEventsHindi[event.id];
    if (override) return override.titleHi;
    // Fallback to titleEn or titleBn if no specific translation exists
    return event.titleEn || event.titleBn;
  }
  return event.titleBn;
};

export const getEventDescription = (event: SpecialDayEvent, lang: Language): string => {
  if (!event) return "";
  if (lang === "en") return event.descriptionEn || event.descriptionBn;
  if (lang === "hi") {
    const override = defaultEventsHindi[event.id];
    if (override) return override.descriptionHi;
    return event.descriptionEn || event.descriptionBn;
  }
  return event.descriptionBn;
};

export const getEventWishes = (event: SpecialDayEvent, lang: Language): string[] => {
  if (!event) return [];
  if (lang === "en") return event.wishesEn && event.wishesEn.length > 0 ? event.wishesEn : event.wishesBn;
  if (lang === "hi") {
    const override = defaultEventsHindi[event.id];
    if (override) return override.wishesHi;
    return event.wishesEn && event.wishesEn.length > 0 ? event.wishesEn : event.wishesBn;
  }
  return event.wishesBn;
};

export const getCategoryLabel = (category: string, lang: Language): string => {
  const cat = category as EventCategory;
  if (categoryTranslations[cat]) {
    return categoryTranslations[cat][lang];
  }
  return category;
};

export const t = (key: keyof typeof uiTranslations, lang: Language): any => {
  const transObj = uiTranslations[key];
  if (transObj) {
    return transObj[lang] || transObj["en"];
  }
  return key;
};
