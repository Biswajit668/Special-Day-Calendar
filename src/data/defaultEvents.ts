import { SpecialDayEvent } from "../types";
import { poetEvents } from "./poetEvents";
import { additionalNationalEvents } from "./additionalNationalEvents";
import { scientistEvents } from "./scientistEvents";
import { biplobiEvents } from "./biplobiEvents";
import { moreIndiaEvents } from "./moreIndiaEvents";

export const categoryMeta = {
  national: { labelBn: "জাতীয় দিবস", labelEn: "National Day", color: "bg-amber-50 text-amber-900 border-amber-200/60" },
  international: { labelBn: "আন্তর্জাতিক দিবস", labelEn: "International Day", color: "bg-sky-50 text-sky-900 border-sky-200/60" },
  west_bengal: { labelBn: "পশ্চিমবঙ্গ", labelEn: "West Bengal Special", color: "bg-emerald-50 text-emerald-900 border-emerald-200/60" },
  freedom_fighter: { labelBn: "স্বাধীনতা সংগ্রামী", labelEn: "Freedom Fighter", color: "bg-red-50 text-red-900 border-red-200/60" },
  poet: { labelBn: "কবি", labelEn: "Poet", color: "bg-purple-50 text-purple-900 border-purple-200/60" },
  writer: { labelBn: "সাহিত্যিক", labelEn: "Writer", color: "bg-fuchsia-50 text-fuchsia-900 border-fuchsia-200/60" },
  scientist: { labelBn: "বিজ্ঞনী", labelEn: "Scientist", color: "bg-cyan-50 text-cyan-900 border-cyan-200/60" },
  leader: { labelBn: "নেতা ও মনীষী", labelEn: "Leader & Thinker", color: "bg-orange-50 text-orange-900 border-orange-200/60" },
  sports: { labelBn: "খেলাধুলা", labelEn: "Sports", color: "bg-lime-50 text-lime-900 border-lime-200/60" },
  religious: { labelBn: "ধর্মীয় উৎসব", labelEn: "Religious Festival", color: "bg-rose-50 text-rose-900 border-rose-200/60" },
  history: { labelBn: "ইতিহাসে আজ", labelEn: "History Today", color: "bg-natural-aside text-natural-text border-natural-border/60" },
};

export const defaultEvents: SpecialDayEvent[] = [
  {
    id: "vibe-jan-12",
    titleBn: "জাতীয় যুব দিবস (স্বামী বিবেকানন্দ জন্মজয়ন্তী)",
    titleEn: "National Youth Day (Swami Vivekananda Jayanti)",
    date: "01-12",
    category: "leader",
    descriptionBn: "স্বামী বিবেকানন্দের জন্মদিবস স্মরণে প্রতি বছর ১২ জানুয়ারি ভারতে জাতীয় যুব দিবস হিসেবে পালিত হয়। তাঁর আদর্শ ও বাণী যুবসমাজকে অনুপ্রাণিত করে।",
    descriptionEn: "National Youth Day is celebrated in India on January 12 to honor the birth anniversary of Swami Vivekananda, whose teachings inspire youth globally.",
    wishesBn: [
      "জাতীয় যুব দিবস ও স্বামী বিবেকানন্দের জন্মজয়ন্তীতে সকলকে জানাই আন্তরিক শুভেচ্ছা ও প্রণাম।",
      "‘ওঠো, জাগো এবং লক্ষ্যে না পৌঁছানো পর্যন্ত থেমো না।’ স্বামীজীর এই অমূল্য বাণী আমাদের পথ দেখাক। শুভ যুব দিবস!",
      "স্বামী বিবেকানন্দের আদর্শ বুকে নিয়ে দেশ ও দশের কল্যাণে এগিয়ে চলুক আমাদের যুবসমাজ। শুভ যুব দিবস!"
    ],
    wishesEn: [
      "Wishing you a very Happy National Youth Day. Let us take inspiration from Swami Vivekananda's thoughts.",
      "'Arise, awake, and stop not till the goal is reached.' Happy Youth Day to everyone!",
      "May the spirit of youth keep us motivated to build a better nation. Happy Swami Vivekananda Jayanti!"
    ],
    fbCaption: "“ওঠো, জাগো এবং লক্ষ্যে না পৌঁছানো পর্যন্ত থেমো না।” স্বামী বিবেকানন্দের জন্মজয়ন্তী এবং জাতীয় যুব দিবসে জানাই সশ্রদ্ধ প্রণাম ও আন্তরিক শুভেচ্ছা। 🕉️✨ #YouthDay #SwamiVivekananda",
    waMessage: "শুভ জাতীয় যুব দিবস! স্বামীজীর বাণী আমাদের জীবনকে সুন্দর ও আলোকময় করে তুলুক। 🙏\n\"ওঠো, জাগো এবং লক্ষ্যে না পৌঁছানো পর্যন্ত থেমো না।\"",
    xPost: "Arise, awake, and stop not till the goal is reached! Remembering Swami Vivekananda on his birth anniversary & celebrating #NationalYouthDay. 🙏",
    hashtags: ["NationalYouthDay", "SwamiVivekananda", "YouthPower", "VivekanandaJayanti", "Inspiration"]
  },
  {
    id: "netaji-jan-23",
    titleBn: "নেতাজী সুভাষচন্দ্র বসুর জন্মদিন (পরাক্রম দিবস)",
    titleEn: "Netaji Subhas Chandra Bose Jayanti (Parakram Diwas)",
    date: "01-23",
    category: "freedom_fighter",
    descriptionBn: "ভারতের স্বাধীনতা সংগ্রামের মহান নায়ক নেতাজী সুভাষচন্দ্র বসুর জন্মদিন ২৩ জানুয়ারি দেশজুড়ে ‘পরাক্রম দিবস’ হিসেবে উদযাপিত হয়।",
    descriptionEn: "The birth anniversary of India's legendary freedom fighter, Netaji Subhas Chandra Bose, is celebrated as 'Parakram Diwas' (Day of Valor).",
    wishesBn: [
      "“তোমরা আমাকে রক্ত দাও, আমি তোমাদের স্বাধীনতা দেব!” নেতাজী সুভাষচন্দ্র বসুর জন্মজয়ন্তীতে জানাই শতকোটি প্রণাম।",
      "পরাক্রম দিবসে নেতাজী সুভাষচন্দ্র বসুর অসীম সাহস ও দেশপ্রেমকে জানাই সশ্রদ্ধ সেলাম। জয় হিন্দ!",
      "মহান দেশপ্রেমিক নেতাজীর জন্মজয়ন্তীতে তাঁর আদর্শ ও বীরত্বকে স্মরণ করি। শুভ পরাক্রম দিবস!"
    ],
    wishesEn: [
      "“Give me blood, and I shall give you freedom!” Salute to the great leader Netaji Subhas Chandra Bose on his birth anniversary.",
      "Wishing you a very inspiring Parakram Diwas. Let us keep the flame of patriotism alive like Netaji.",
      "Remembering Netaji Subhas Chandra Bose's ultimate sacrifice and courage for India's freedom. Jai Hind!"
    ],
    fbCaption: "“তোমরা আমাকে রক্ত দাও, আমি তোমাদের স্বাধীনতা দেব!” বীর যোদ্ধা, মহান স্বাধীনতা সংগ্রামী নেতাজী সুভাষচন্দ্র বসুর জন্মজয়ন্তীতে জানাই সশ্রদ্ধ প্রণাম ও সেলাম। 🇮🇳✊ #NetajiSubhasChandraBose #ParakramDiwas #JaiHind",
    waMessage: "পরাক্রম দিবসের আন্তরিক শুভেচ্ছা! নেতাজীর অসীম বীরত্ব ও দেশপ্রেমের আদর্শ আমাদের মনে চিরজাগ্রত থাকুক। জয় হিন্দ! 🇮🇳",
    xPost: "Remembering Netaji Subhas Chandra Bose on his birth anniversary. His courage, vision, and patriotism continue to inspire every Indian. #ParakramDiwas #Netaji125",
    hashtags: ["Netaji", "SubhasChandraBose", "ParakramDiwas", "JaiHind", "FreedomFighter"]
  },
  {
    id: "republic-jan-26",
    titleBn: "সাধারণতন্ত্র দিবস (প্রজাতন্ত্র দিবস)",
    titleEn: "Republic Day of India",
    date: "01-26",
    category: "national",
    descriptionBn: "১৯৫০ সালের ২৬ জানুয়ারি স্বাধীন ভারতের সংবিধান কার্যকর হয়েছিল। এই গৌরবময় দিনটি প্রতি বছর অত্যন্ত মর্যাদার সাথে দেশজুড়ে পালিত হয়।",
    descriptionEn: "Republic Day honors the date on which the Constitution of India came into effect on 26 January 1950, turning the nation into a newly formed republic.",
    wishesBn: [
      "৭৭তম সাধারণতন্ত্র দিবসে সমস্ত ভারতীয়কে জানাই আন্তরিক শুভেচ্ছা ও অভিনন্দন। জয় হিন্দ, বন্দে মাতরম্!",
      "ভারতের সংবিধান ও আমাদের মহান গণতন্ত্রকে জানাই কুর্নিশ। শুভ প্রজাতন্ত্র দিবস!",
      "দেশপ্রেমের রঙে রঙিল হোক প্রতিটি ভারতীয়র মন। শুভ সাধারণতন্ত্র দিবস!"
    ],
    wishesEn: [
      "Wishing you a very Happy Republic Day! Proud to be an Indian. Jai Hind!",
      "Let us remember the golden heritage of our country and feel proud of being an Indian. Happy Republic Day!",
      "Saluting the constitution, the visionaries, and the citizens who build this nation. Vande Mataram!"
    ],
    fbCaption: "ভারতের প্রজাতন্ত্র দিবসে দেশের বীর শহীদ ও সংবিধান প্রণেতাদের জানাই সশ্রদ্ধ শ্রদ্ধাঞ্জলি। সমস্ত দেশবাসীকে জানাই আন্তরিক সাধারণতন্ত্র দিবসের শুভেচ্ছা। 🇮🇳✨ #RepublicDay #JaiHind #VandeMataram",
    waMessage: "শুভ সাধারণতন্ত্র দিবস! আসুন ঐক্য ও সম্প্রীতির বন্ধন দৃঢ় করে আমাদের প্রিয় দেশ ভারতকে আরও এগিয়ে নিয়ে যাই। 🇮🇳🙏",
    xPost: "Wishing everyone a very Happy #RepublicDay! Let's cherish our constitution & celebrate the spirit of being Indian. Jai Hind! 🇮🇳",
    hashtags: ["RepublicDay", "India", "JaiHind", "Constitution", "VandeMataram"]
  },
  {
    id: "mother-lang-feb-21",
    titleBn: "আন্তর্জাতিক মাতৃভাষা দিবস",
    titleEn: "International Mother Language Day",
    date: "02-21",
    category: "international",
    descriptionBn: "ভাষার জন্য বাঙালি তরুণদের আত্মবলিদানকে সম্মান জানিয়ে ইউনেস্কো ২১ ফেব্রুয়ারিকে আন্তর্জাতিক মাতৃভাষা দিবস হিসেবে ঘোষণা করে।",
    descriptionEn: "International Mother Language Day is observed on February 21 worldwide to promote awareness of linguistic and cultural diversity.",
    wishesBn: [
      "“আমার ভাইয়ের রক্তে রাঙানো একুশে ফেব্রুয়ারি, আমি কি ভুলিতে পারি।” আন্তর্জাতিক মাতৃভাষা দিবসে ভাষা শহীদদের জানাই বিনম্র শ্রদ্ধা।",
      "বাংলা আমার তৃষ্ণা মেটায়, বাংলা আমার গান। আন্তর্জাতিক মাতৃভাষা দিবসে বাংলা ভাষা ও তার শহীদদের জানাই প্রণাম।",
      "সবাইকে জানাই আন্তর্জাতিক মাতৃভাষা দিবসের অন্তরের শুভেচ্ছা। নিজের ভাষাকে ভালোবাসুন, সম্মান করুন।"
    ],
    wishesEn: [
      "Wishing you a happy International Mother Language Day! Let's cherish and preserve our beautiful mother tongue.",
      "Linguistic diversity is a heritage of humanity. Celebrate your native tongue today!",
      "Saluting the language martyrs who fought for their mother tongue. Happy International Mother Language Day."
    ],
    fbCaption: "আমার মুখের মিষ্টি ভাষা, মায়ের কোল আর নদীর পাড়। ভাষা শহীদদের রক্তে ভেজা একুশে ফেব্রুয়ারিতে জানাই গভীর শ্রদ্ধাঞ্জলি। 🇧🇩🇧🇬❤️ #MotherLanguageDay #EkusheyFebruary #Bengali",
    waMessage: "শুভ আন্তর্জাতিক মাতৃভাষা দিবস! মাতৃভাষার চেয়ে আপন কোনো ভাষা নেই। আসুন নিজের ভাষাকে ভালোবাসার শপথ নিই। 📝❤️",
    xPost: "Saluting the language martyrs of 21st February. Let us pledge to respect and preserve linguistic diversity. #InternationalMotherLanguageDay",
    hashtags: ["MotherLanguageDay", "Ekushey", "Bengali", "LanguageMartyrs", "LinguisticDiversity"]
  },
  {
    id: "womens-mar-08",
    titleBn: "আন্তর্জাতিক নারী দিবস",
    titleEn: "International Women's Day",
    date: "03-08",
    category: "international",
    descriptionBn: "নারীদের সামাজিক, অর্থনৈতিক, সাংস্কৃতিক এবং রাজনৈতিক অর্জনের স্বীকৃতিস্বরূপ প্রতি বছর ৮ মার্চ আন্তর্জাতিক নারী দিবস পালিত হয়।",
    descriptionEn: "International Women's Day (March 8) is a global day celebrating the social, economic, cultural, and political achievements of women.",
    wishesBn: [
      "সংসার থেকে কর্মক্ষেত্র— সর্বত্র তোমার আলো। আন্তর্জাতিক নারী দিবসে সমস্ত লড়াকু নারীকে জানাই সেলাম ও শুভেচ্ছা!",
      "নারীর শক্তি, নারীর জয়, নতুন সমাজের হোক প্রারম্ভ। শুভ আন্তর্জাতিক নারী দিবস!",
      "তুমি কন্যা, তুমি জায়া, তুমি জননী— তোমার অবদান অতুলনীয়। নারী দিবসের শুভেচ্ছা!"
    ],
    wishesEn: [
      "Happy International Women's Day! To all the incredible women, thank you for making the world a better place.",
      "Here's to strong women: may we know them, may we be them, may we raise them. Happy Women's Day!",
      "Celebrate the grace, power, and wisdom of women. Happy International Women's Day!"
    ],
    fbCaption: "নারীর উপস্থিতি ও অবদান ছাড়া সমাজ অসম্পূর্ণ। প্রতিটি ক্ষেত্রে নারীদের জয়যাত্রা অক্ষুণ্ণ থাকুক। আন্তর্জাতিক নারী দিবসের আন্তরিক শুভেচ্ছা। 🌸💪 #WomensDay #IWD #WomenEmpowerment",
    waMessage: "শুভ আন্তর্জাতিক নারী দিবস! সমস্ত মা, বোন, জায়া ও কন্যাকে জানাই সশ্রদ্ধ অভিনন্দন। আপনি অনন্য ও অসাধারণ! ✨👩",
    xPost: "Happy International Women's Day to all the inspiring women breaking barriers and leading change everywhere! 🌸 #IWD2026 #WomensDay",
    hashtags: ["WomensDay", "IWD", "WomenEmpowerment", "GenderEquality", "SheInspirits"]
  },
  {
    id: "pohela-boishakh",
    titleBn: "পহেলা বৈশাখ (শুভ নববর্ষ)",
    titleEn: "Pohela Boishakh (Bengali New Year)",
    date: "04-14",
    category: "west_bengal",
    descriptionBn: "বাঙালির প্রাণের উৎসব নববর্ষ। বঙ্গাব্দের প্রথম দিনটি পশ্চিমবঙ্গ ও বাংলাদেশে মহাসমারোহে বর্ষবরণ ও হালখাতার মাধ্যমে উদযাপিত হয়।",
    descriptionEn: "Pohela Boishakh is the first day of the Bengali calendar, celebrated with cultural pageantry, prayers, and business ledger renovations (Halkhata).",
    wishesBn: [
      "এসো হে বৈশাখ এসো এসো... নতুন বছর বয়ে আনুক অনাবিল আনন্দ ও সমৃদ্ধি। শুভ নববর্ষ!",
      "পুরনো যত দুঃখ-কষ্ট ভুলে নতুন বছরে মেতে উঠি নতুন আশায়। আপনাকে ও আপনার পরিবারকে শুভ নববর্ষের প্রীতি ও শুভেচ্ছা!",
      "নতুন বছরের হালখাতায় উঠুক আনন্দের নাম। শুভ নববর্ষ ও শুভ হালখাতা!"
    ],
    wishesEn: [
      "Wishing you a joyous and prosperous Bengali New Year! Shubho Noboborsho!",
      "May this Pohela Boishakh fill your life with sweet moments, success, and good health. Happy Bengali New Year!",
      "Let's welcome the Bengali New Year with a smile. Shubho Noboborsho to you and your loved ones!"
    ],
    fbCaption: "মুছে যাক গ্লানি, ঘুচে যাক জরা, অগ্নিস্নানে শুচি হোক ধরা। নববর্ষের এই পুণ্যলগ্নে সকলকে জানাই শুভ নববর্ষের আন্তরিক শুভেচ্ছা ও ভালোবাসা। ☀️🌾🙏 #ShubhoNoboborsho #BengaliNew Year #PohelaBoishakh",
    waMessage: "শুভ নববর্ষ! 🌾 নতুন বছর আপনার জীবনে বয়ে আনুক সুখ, সমৃদ্ধি ও অনাবিল আনন্দ। ভালো কাটুক নতুন বছর! 💥",
    xPost: "Wishing all my Bengali friends across the globe a very happy and prosperous #ShubhoNoboborsho! May this year bring peace and success. 🌾",
    hashtags: ["ShubhoNoboborsho", "BengaliNewYear", "PohelaBoishakh", "BangaliUtsav", "NewBeginning"]
  },
  {
    id: "rabindra-jayanti",
    titleBn: "রবীন্দ্র জয়ন্তী (২৫শে বৈশাখ)",
    titleEn: "Rabindranath Tagore Jayanti",
    date: "05-09",
    category: "poet",
    descriptionBn: "বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের জন্মদিন ২৫শে বৈশাখ (সাধারণত ৮ বা ৯ মে)। বাঙালির আবেগ ও সংস্কৃতির মেরুদণ্ড হলেন রবীন্দ্রনাথ।",
    descriptionEn: "Rabindra Jayanti is an annually celebrated cultural festival, commemorating the birth anniversary of polymath Rabindranath Tagore.",
    wishesBn: [
      "“তুমি নব নব রূপে এসো প্রাণে...” কবিগুরু রবীন্দ্রনাথ ঠাকুরের জন্মজয়ন্তীতে জানাই বিনম্র প্রণাম ও শ্রদ্ধাঞ্জলি।",
      "বাঙালির আনন্দ-বেদনা, প্রেম-বিরহের চিরন্তন সঙ্গী বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের জয়ন্তীতে সশ্রদ্ধ প্রণাম।",
      "রবীন্দ্র জয়ন্তীর পুণ্যলগ্নে কবিগুরুর সৃষ্টিশীলতাকে প্রণাম জানাই। আমাদের মনন জুড়ে থাকুন তিনি।"
    ],
    wishesEn: [
      "Salute to the Nobel laureate polymath Gurudev Rabindranath Tagore on his birth anniversary.",
      "Remembering the writer of our national anthem, the poet of human souls, Rabindranath Tagore. Happy Rabindra Jayanti!",
      "May Gurudev's timeless philosophy and poetry enlighten our minds and spirits. Peaceful Rabindra Jayanti."
    ],
    fbCaption: "বাঙালির জীবনের সকল অনুভূতি যার গানে, লেখনীতে মূর্ত হয়ে উঠেছে, সেই বিশ্বকবি রবীন্দ্রনাথ ঠাকুরের ১৬৫তম জন্মজয়ন্তীতে জানাই বিনম্র প্রণাম। ✍️🎶🌸 #RabindranathTagore #RabindraJayanti #Gurudev",
    waMessage: "রবীন্দ্র জয়ন্তীর আন্তরিক প্রীতি ও শুভেচ্ছা! রবীন্দ্রসৃষ্টি হোক আমাদের দৈনন্দিন জীবনের অনুপ্রেরণা। 🙏✨",
    xPost: "Paying my humble tributes to the great visionary, poet, and Nobel Laureate Gurudev Rabindranath Tagore on his birth anniversary. #RabindraJayanti 🙏",
    hashtags: ["RabindraJayanti", "RabindranathTagore", "Gurudev", "BengaliCulture", "PoetryTimeless"]
  },
  {
    id: "nazrul-jayanti",
    titleBn: "কাজী নজরুল ইসলাম জয়ন্তী",
    titleEn: "Kazi Nazrul Islam Jayanti",
    date: "05-25",
    category: "poet",
    descriptionBn: "বিদ্রোহী কবি কাজী নজরুল ইসলামের জন্মবার্ষিকী। অন্যায় ও শোষণের বিরুদ্ধে তাঁর লেখনী ছিল সোচ্চার, যা বাঙালিকে চিরকাল বিপ্লবে উদ্বুদ্ধ করে।",
    descriptionEn: "Birth anniversary of Kazi Nazrul Islam, the 'Rebel Poet' of Bengal, who championed freedom, humanity, and revolution against oppression.",
    wishesBn: [
      "“মম এক হাতে বাঁকা বাঁশের বাঁশরী, আর হাতে রণ-তূর্য!” বিদ্রোহী কবি কাজী নজরুল ইসলামের জন্মজয়ন্তীতে জানাই সশ্রদ্ধ প্রণাম।",
      "মানবতা ও বিপ্লবের চারণকবি নজরুল ইসলামের জন্মবার্ষিকীতে জানাই বিনম্র শ্রদ্ধা।",
      "নজরুল জয়ন্তীর আন্তরিক শুভেচ্ছা! সাম্য ও ভালোবাসার বার্তা ছড়িয়ে পড়ুক সমাজ জুড়ে।"
    ],
    wishesEn: [
      "Paying tribute to the Rebel Poet, Kazi Nazrul Islam, on his birth anniversary. His words fought oppression.",
      "Celebrating the birth of the voice of revolution and communal harmony, Kazi Nazrul Islam.",
      "Happy Kazi Nazrul Islam Jayanti. Let's remember his vision of equality and universal brotherhood."
    ],
    fbCaption: "“গাহি সাম্যের গান— যেখানে আসিয়া এক হয়ে গেছে সব বাধা-ব্যবধান।” বিদ্রোহী কবি, মানবতার রূপকার কাজী নজরুল ইসলামের জন্মবার্ষিকীতে জানাই সশ্রদ্ধ প্রণাম। ✊🔥📝 #KaziNazrulIslam #NazrulJayanti #RebelPoet",
    waMessage: "শুভ নজরুল জয়ন্তী! আসুন কবির বিদ্রোহী ও অসাম্প্রদায়িক চেতনাকে বুকে নিয়ে এগিয়ে চলি। 🙏🇧🇩",
    xPost: "Remembering the Rebel Poet Kazi Nazrul Islam on his birth anniversary. His poems and songs remain the supreme voice of justice & freedom. #NazrulJayanti",
    hashtags: ["NazrulJayanti", "KaziNazrulIslam", "RebelPoet", "BengaliLiterature", "Revolutionary"]
  },
  {
    id: "env-day-jun-05",
    titleBn: "বিশ্ব পরিবেশ দিবস",
    titleEn: "World Environment Day",
    date: "06-05",
    category: "international",
    descriptionBn: "পরিবেশ দূষণ রোধ ও পরিবেশ সচেতনতা বাড়াতে প্রতি বছর ৫ জুন সারা পৃথিবীজুড়ে বিশ্ব পরিবেশ দিবস পালিত হয়।",
    descriptionEn: "World Environment Day (June 5) is the United Nations' principal vehicle for encouraging awareness and action for the protection of our environment.",
    wishesBn: [
      "সবুজ পৃথিবী, সুস্থ জীবন। বিশ্ব পরিবেশ দিবসে আসুন সকলে মিলে অন্তত একটি করে গাছ লাগাই ও যত্ন নিই।",
      "বিশ্ব পরিবেশ দিবসের শুভেচ্ছা! ভবিষ্যৎ প্রজন্মের জন্য একটি দূষণমুক্ত ও সবুজ পৃথিবী গড়ে তোলার শপথ নিই।",
      "গাছ লাগান, প্রাণ বাঁচান। পরিবেশ ভালো থাকলে আমরাও ভালো থাকব। শুভ পরিবেশ দিবস!"
    ],
    wishesEn: [
      "Happy World Environment Day! Let us nurture nature so that we can have a better future.",
      "Join the hands to save our beautiful planet. Plant a tree today! Happy Environment Day.",
      "Let's keep our environment clean, green, and healthy. Best wishes on World Environment Day!"
    ],
    fbCaption: "একটি গাছ, একটি প্রাণ। বিশ্ব পরিবেশ দিবসে আসুন সকলে মিলে শপথ নিই— আমরা প্লাস্টিকের ব্যবহার কমাবো, বেশি করে গাছ লাগাবো এবং পৃথিবীকে সবুজ রাখবো। 🌳💚🌎 #WorldEnvironment Day #SaveEarth #GoGreen",
    waMessage: "শুভ বিশ্ব পরিবেশ দিবস! আসুন পৃথিবীকে পরবর্তী প্রজন্মের বসবাসের উপযোগী সুন্দর ও সবুজ করে তোলার অঙ্গীকার করি। 🌿🏡",
    xPost: "Only One Earth! On this #WorldEnvironmentDay, let's pledge to protect our planet by planting more trees and adopting sustainable lives. 🌍💚",
    hashtags: ["WorldEnvironmentDay", "SaveEarth", "GoGreen", "PlantTrees", "NatureLover"]
  },
  {
    id: "doctors-day-jul-01",
    titleBn: "জাতীয় চিকিৎসক দিবস (বিধানচন্দ্র রায়ের জন্ম ও মৃত্যুবার্ষিকী)",
    titleEn: "National Doctors' Day (Dr. Bidhan Chandra Roy Jayanti)",
    date: "07-01",
    category: "west_bengal",
    descriptionBn: "পশ্চিমবঙ্গের রূপকার তথা প্রখ্যাত চিকিৎসক ডক্টর বিধানচন্দ্র রায়ের জন্ম ও প্রয়ান দিবস স্মরণে প্রতি বছর ১ জুলাই ভারতে জাতীয় চিকিৎসক দিবস পালিত হয়।",
    descriptionEn: "Doctors' Day is celebrated on July 1 in India to honor the legendary physician and West Bengal's second Chief Minister, Dr. B.C. Roy.",
    wishesBn: [
      "আমাদের জীবনের রক্ষাকর্তা চিকিৎসকদের জানাই আন্তরিক কৃতজ্ঞতা ও কুর্নিশ। শুভ জাতীয় চিকিৎসক দিবস!",
      "প্রখ্যাত চিকিৎসক তথা পশ্চিমবঙ্গের অন্যতম রূপকার ডক্টর বিধানচন্দ্র রায়ের জন্ম ও মৃত্যুবার্ষিকীতে প্রণাম ও চিকিৎসক দিবসের শুভেচ্ছা।",
      "নিঃস্বার্থ সেবার মাধ্যমে যারা আমাদের সুস্থ রাখেন, সেইসব চিকিৎসকদের শুভ ডক্টরস ডে!"
    ],
    wishesEn: [
      "Happy National Doctors' Day! Thank you to all doctors who work tirelessly to save lives and heal communities.",
      "Saluting the real-life heroes who put their patients before themselves. Happy Doctors' Day!",
      "Remembering Dr. Bidhan Chandra Roy, the medical pioneer and statesman, on National Doctors' Day."
    ],
    fbCaption: "জীবন বাঁচানোর মহান কারিগর চিকিৎসকদের জানাই সশ্রদ্ধ সেলাম। পশ্চিমবঙ্গের রূপকার ডাঃ বিধানচন্দ্র রায়ের জন্ম ও প্রয়ান দিবসে আন্তরিক শ্রদ্ধা ও শুভেচ্ছা। 🩺🏥❤️ #DoctorsDay #BidhanChandraRoy #HealthcareHeroes",
    waMessage: "শুভ জাতীয় চিকিৎসক দিবস! নিঃস্বার্থ সেবায় নিয়োজিত সমস্ত ডাক্তারবাবুকে জানাই আন্তরিক কৃতজ্ঞতা ও অভিনন্দন। 🩺🙏",
    xPost: "Salute to the selflessness and commitment of all doctors on #NationalDoctorsDay. Remembering the legendary Dr. BC Roy today. 🩺🙏",
    hashtags: ["DoctorsDay", "DrBCRoy", "WestBengal", "Healthcare", "ThankYouDoctors"]
  },
  {
    id: "independence-aug-15",
    titleBn: "ভারতের স্বাধীনতা দিবস",
    titleEn: "Independence Day of India",
    date: "08-15",
    category: "national",
    descriptionBn: "১৯৪৭ সালের ১৫ আগস্ট ভারত ব্রিটিশ শাসন থেকে মুক্তি পেয়ে স্বাধীন সার্বভৌম রাষ্ট্র হিসেবে আত্মপ্রকাশ করে। এই দিন স্বাধীনতা সংগ্রামীদের স্মরণ করা হয়।",
    descriptionEn: "Independence Day is celebrated annually on 15 August as a national holiday in India commemorating the nation's independence from the United Kingdom.",
    wishesBn: [
      "৭৯তম স্বাধীনতা দিবসে সমস্ত ভারতীয়কে জানাই আন্তরিক শুভেচ্ছা ও অভিনন্দন। জয় হিন্দ!",
      "স্বাধীনতা সংগ্রামীদের আত্মবলিদান বৃথা যেতে দেব না। দেশের মর্যাদা রক্ষা করার শপথ নিই। শুভ স্বাধীনতা দিবস!",
      "বন্দে মাতরম্! দেশের সার্বভৌমত্ব ও বৈচিত্র্য রক্ষা করাই আমাদের মূল লক্ষ্য হোক। শুভ স্বাধীনতা দিবস!"
    ],
    wishesEn: [
      "Happy Independence Day of India! Let's celebrate the freedom and unity of our nation. Jai Hind!",
      "Paying homage to the brave souls who fought for our freedom. Happy Independence Day!",
      "May our tricolor fly high and fill our hearts with pride. Happy 15th August!"
    ],
    fbCaption: "যে স্বাধীনতা আমরা পেয়েছি তা অনেক বীর সংগ্রামীদের রক্তের বিনিময়ে। তাদের আত্মত্যাগকে প্রণাম জানাই। সমস্ত দেশবাসীকে স্বাধীনতা দিবসের আন্তরিক অভিনন্দন। 🇮🇳✊🔥 #IndependenceDay #India #JaiHind #Freedom",
    waMessage: "শুভ স্বাধীনতা দিবস! 🇮🇳 আসুন ভারতের অখণ্ডতা ও শান্তি বজায় রাখতে সকলে একসাথে কাজ করি। বন্দে মাতরম্! 🚩",
    xPost: "Wishing all my fellow Indians a Happy #IndependenceDay! Let's salute the martyrs who gave us a free tomorrow. Jai Hind! 🇮🇳",
    hashtags: ["IndependenceDay", "India15August", "JaiHind", "FreedomFighters", "Patriotism"]
  },
  {
    id: "teachers-sep-05",
    titleBn: "শিক্ষক দিবস (ডঃ সর্বপল্লী রাধাকৃষ্ণন জন্মজয়ন্তী)",
    titleEn: "Teachers' Day (Dr. Sarvepalli Radhakrishnan Jayanti)",
    date: "09-05",
    category: "national",
    descriptionBn: "ভারতের প্রাক্তন রাষ্ট্রপতি ও দার্শনিক ডঃ সর্বপল্লী রাধাকৃষ্ণনের জন্মদিন ৫ সেপ্টেম্বর ভারতে শিক্ষক দিবস হিসেবে পালিত হয়।",
    descriptionEn: "Teachers' Day is celebrated in India on September 5 to mark the birth anniversary of educator and former President Dr. S. Radhakrishnan.",
    wishesBn: [
      "শিক্ষক দিবসে আমার জীবনের সমস্ত শিক্ষকদের জানাই সশ্রদ্ধ প্রণাম ও কৃতজ্ঞতা।",
      "আমাদের অন্ধকার থেকে আলোর পথে নিয়ে যাওয়ার কান্ডারী হলেন শিক্ষকরা। শুভ শিক্ষক দিবস!",
      "প্রিয় শিক্ষক মহাশয়, আপনার দেখানো পথেই আমি পথ চলছি। শিক্ষক দিবসের আন্তরিক প্রণাম জানবেন।"
    ],
    wishesEn: [
      "Happy Teachers' Day! Thank you for guiding us, inspiring us, and making us who we are today.",
      "A good teacher is like a candle - it consumes itself to light the way for others. Happy Teachers' Day!",
      "To the world's best teacher, thank you for your patience and support. Happy Teachers' Day!"
    ],
    fbCaption: "মা-বাবা আমাদের জন্ম দেন, কিন্তু শিক্ষকরা আমাদের প্রকৃত মানুষ হিসেবে গড়ে তোলেন। শিক্ষক দিবসের এই পবিত্র লগ্নে আমার সকল শিক্ষক-শিক্ষিকাদের জানাই সশ্রদ্ধ প্রণাম। 📚🎓🙏 #TeachersDay #Gurudev #Inspiration",
    waMessage: "শুভ শিক্ষক দিবস! জ্ঞান ও নৈতিকতার আলো দিয়ে আমাদের জীবন গড়ার জন্য শিক্ষকদের জানাই অনেক শ্রদ্ধা ও প্রণাম। 📚🙏",
    xPost: "Paying tribute to India's great scholar & former President Dr. S Radhakrishnan on his birth anniversary. Happy #TeachersDay to all mentors! 📚",
    hashtags: ["TeachersDay", "ThankYouTeacher", "SRadhakrishnan", "Education", "Mentor"]
  },
  {
    id: "gandhi-oct-02",
    titleBn: "গান্ধী জয়ন্তী (আন্তর্জাতিক অহিংসা দিবস)",
    titleEn: "Gandhi Jayanti (International Day of Non-Violence)",
    date: "10-02",
    category: "leader",
    descriptionBn: "জাতির জনক মহাত্মা গান্ধীর জন্মদিন ২ অক্টোবর দেশজুড়ে যথাযোগ্য শ্রদ্ধায় পালিত হয়। এই দিনটি বিশ্বজুড়ে আন্তর্জাতিক অহিংসা দিবস হিসেবেও উদযাপিত হয়।",
    descriptionEn: "Gandhi Jayanti is a national holiday in India celebrating the birth of Mohandas Karamchand Gandhi, also celebrated as International Day of Non-Violence.",
    wishesBn: [
      "অহিংসা ও সত্যের পূজারী মহাত্মা গান্ধীর জন্মজয়ন্তীতে জানাই সশ্রদ্ধ প্রণাম। শুভ গান্ধী জয়ন্তী!",
      "“তুমি নিজেই সেই পরিবর্তন হও, যা তুমি বিশ্বে দেখতে চাও।” গান্ধীজীর এই মহান ভাবনায় অনুপ্রাণিত হই। শুভ গান্ধী জয়ন্তী!",
      "গান্ধী জয়ন্তী ও আন্তর্জাতিক অহিংসা দিবসে শান্তি ও মৈত্রীর বার্তা ছড়িয়ে পড়ুক সর্বত্র।"
    ],
    wishesEn: [
      "Wishing you a Happy Gandhi Jayanti. Let us follow the path of truth and non-violence.",
      "“Be the change that you wish to see in the world.” Remembering Mahatma Gandhi on his birth anniversary.",
      "Happy Gandhi Jayanti! May the ideals of peace, harmony, and love guide us always."
    ],
    fbCaption: "সত্য ও অহিংসার মহামন্ত্রে যিনি ভারতকে স্বাধীনতার পথে পরিচালিত করেছিলেন, সেই জাতির জনক মহাত্মা গান্ধীর জন্মজয়ন্তীতে জানাই বিনম্র প্রণাম। 🕉️🕊️🇮🇳 #GandhiJayanti #MahatmaGandhi #NonViolence",
    waMessage: "শুভ গান্ধী জয়ন্তী! আসুন হিংসা-বিদ্বেষ ভুলে সত্য ও অহিংসার পথে সমাজ গড়ে তুলি। শান্তিময় হোক আমাদের জীবন। 🕊️🙏",
    xPost: "Remembering Mahatma Gandhi on his birth anniversary. His message of truth, harmony, and non-violence is more relevant today than ever. #GandhiJayanti 🕊️",
    hashtags: ["GandhiJayanti", "MahatmaGandhi", "NonViolenceDay", "Peace", "Bapu"]
  },
  {
    id: "childrens-nov-14",
    titleBn: "শিশু দিবস (চাচা নেহেরুর জন্মজয়ন্তী)",
    titleEn: "Children's Day (Chacha Nehru Jayanti)",
    date: "11-14",
    category: "national",
    descriptionBn: "ভারতের প্রথম প্রধানমন্ত্রী পণ্ডিত জওহরলাল নেহেরুর জন্মদিন ১৪ নভেম্বর ভারতে শিশু দিবস হিসেবে উদযাপিত হয়। তিনি শিশুদের অত্যন্ত ভালোবাসতেন এবং ‘চাচা নেহেরু’ নামে পরিচিত ছিলেন।",
    descriptionEn: "Children's Day is celebrated on 14 November in India to mark the birth anniversary of Pandit Jawaharlal Nehru, who loved children dearly.",
    wishesBn: [
      "শিশু দিবসের অনেক শুভেচ্ছা ও আদর সমস্ত মিষ্টি শিশুদের! তোমরা আমাদের দেশের ভবিষ্যৎ।",
      "প্রতিটি শিশুর হাসি হোক অমলিন। শিশু দিবসের শুভেচ্ছা ও ভালোবাসা জানাই।",
      "চাচা নেহেরুর জয়ন্তী ও শিশু দিবসে আমাদের প্রতিটি শিশুর উজ্জ্বল ভবিষ্যতের কামনা করি।"
    ],
    wishesEn: [
      "Happy Children's Day! Every child is a different kind of flower, and all together they make this world a beautiful garden.",
      "Wishing a very Happy Children's Day to the future leaders and innovators of our country!",
      "May the innocence in children's hearts remain forever. Happy Children's Day!"
    ],
    fbCaption: "আজকের শিশুরাই আগামী দিনের সমাজ গড়ার কারিগর। পন্ডিত জওহরলাল নেহেরুর জন্মজয়ন্তী তথা শিশু দিবসে সমস্ত শিশুকে জানাই অনেক ভালোবাসা ও শুভকামনা। 🧸🎈👧 #ChildrensDay #ChachaNehru #KidsOurFuture",
    waMessage: "শুভ শিশু দিবস! 🍭 শিশুদের নিষ্পাপ হাসি যেন আমাদের সমাজকে আনন্দময় ও হিংসামুক্ত রাখে। অনেক ভালোবাসা সকল শিশুকে। 🐣",
    xPost: "Remembering India's first PM Pandit Jawaharlal Nehru on his birth anniversary & wishing a happy #ChildrensDay to the beautiful children. 🎈",
    hashtags: ["ChildrensDay", "ChachaNehru", "JawaharlalNehru", "KidsSmile", "FutureOfIndia"]
  },
  {
    id: "christmas-dec-25",
    titleBn: "বড়দিন (যীশু খ্রীষ্টের জন্মদিন)",
    titleEn: "Christmas Day",
    date: "12-25",
    category: "religious",
    descriptionBn: "প্রভু যীশু খ্রীষ্টের পবিত্র জন্মতিথি স্মরণে সারা বিশ্বের ন্যায় বাংলাতেও ২৫ ডিসেম্বর মহাসমারোহে বড়দিন বা ক্রিসমাস উৎসব উদযাপিত হয়।",
    descriptionEn: "Christmas is an annual festival commemorating the birth of Jesus Christ, observed primarily on December 25 as a religious and cultural celebration.",
    wishesBn: [
      "আপনাকে ও আপনার পরিবারকে জানাই বড়দিনের অনেক অনেক শুভেচ্ছা ও আন্তরিক ভালোবাসা। মেরি ক্রিসমাস!",
      "প্রভু যীশুর আশিস বর্ষিত হোক আপনার ওপর। জীবন ভরে উঠুক সুখ, শান্তি ও আনন্দে। শুভ বড়দিন!",
      "মেরি ক্রিসমাস! সান্তা ক্লজ আপনার জীবন খুশি এবং সুন্দর উপহারে ভরিয়ে তুলুক।"
    ],
    wishesEn: [
      "Wishing you a Merry Christmas filled with love, laughter, and goodwill! Merry Christmas!",
      "May the peace and joy of Christmas be with you today and throughout the New Year. God bless you!",
      "Merry Christmas! May your holiday season sparkle with moments of love, gratitude, and happiness."
    ],
    fbCaption: "সকলকে জানাই বড়দিনের আন্তরিক শুভেচ্ছা ও মেরি ক্রিসমাস! প্রভু যীশুর আশীর্বাদে সকলের জীবন শান্তিময় ও সুন্দর হয়ে উঠুক। 🎄🎅🎁 #Christmas #MerryChristmas #FestivalOfJoy",
    waMessage: "মেরি ক্রিসমাস! 🎄✨ বড়দিনের এই পবিত্র উৎসবে আপনার ও আপনার পরিবারের সুখ, সমৃদ্ধি ও সুস্বাস্থ্য কামনা করি। 🎅🍰",
    xPost: "Wishing everyone a very #MerryChristmas! May this festive season bring joy, peace, and prosperity to all. 🎄🎁",
    hashtags: ["Christmas", "MerryChristmas", "HolidaySeason", "JesusChrist", "JoyToTheWorld"]
  },
  ...poetEvents,
  ...additionalNationalEvents,
  ...scientistEvents,
  ...biplobiEvents,
  ...moreIndiaEvents
];
