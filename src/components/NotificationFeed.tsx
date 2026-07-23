import React, { useState, useEffect } from "react";
import { 
  Bell, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Volume2, 
  VolumeX, 
  Clock, 
  Plus, 
  Trash2, 
  Sliders, 
  Sparkles,
  Calendar,
  AlertCircle
} from "lucide-react";
import { SpecialDayEvent } from "../types";
import { categoryMeta } from "../data/defaultEvents";
import { Language, getEventTitle, getCategoryLabel } from "../lib/translations";
import {
  NotificationSettings,
  CustomReminder,
  getStoredNotificationSettings,
  saveNotificationSettings,
  requestNotificationPermission,
  getBrowserPermissionState,
  sendBrowserNotification,
  triggerEventNotification,
  isBrowserNotificationSupported
} from "../lib/notificationService";

interface NotificationFeedProps {
  events: SpecialDayEvent[];
  onSelectDate: (date: Date) => void;
  onSelectEvent: (event: SpecialDayEvent) => void;
  setActiveTab: (tab: string) => void;
  language: Language;
}

const notifTranslations = {
  feedTitle: {
    bn: "🔔 দিবস নোটিফিকেশন ও অ্যালার্ট সেন্টার",
    en: "🔔 Special Day Alerts & Notification Center",
    hi: "🔔 विशेष दिवस सूचनाएं एवं अलर्ट सेंटर"
  },
  feedSub: {
    bn: "ব্রাউজার নোটিফিকেশন, দৈনিক অ্যালার্ট সেটিংস এবং কাস্টম রিমাইন্ডার সেট করুন",
    en: "Manage browser push notifications, daily alerts, and custom reminders",
    hi: "ब्राउज़र पुश सूचनाएं, दैनिक अलर्ट और कस्टम रिमाइंडर प्रबंधित करें"
  },
  browserAlertTitle: {
    bn: "ব্রাউজার পুশ নোটিফিকেশন",
    en: "Browser Push Notifications",
    hi: "ब्राउज़र पुश सूचनाएं"
  },
  browserAlertSub: {
    bn: "গুরুত্বপূর্ণ দিবসের সকালে আপনার ডিভাইসে সরাসরি নোটিফিকেশন পেতে অনুমতি দিন",
    en: "Get instant desktop/mobile alerts directly on your device on important days",
    hi: "महत्वपूर्ण दिनों की सुबह अपने डिवाइस पर सीधे सूचनाएं प्राप्त करें"
  },
  statusGranted: {
    bn: "নোটিফিকেশন সক্রিয় করা হয়েছে (Granted)",
    en: "Notifications Enabled (Granted)",
    hi: "सूचनाएं सक्षम हैं (Granted)"
  },
  statusDenied: {
    bn: "নোটিফিকেশন ব্লক করা রয়েছে (Denied)",
    en: "Notifications Blocked (Denied)",
    hi: "सूचनाएं अवरुद्ध हैं (Denied)"
  },
  statusDefault: {
    bn: "অনুমতি দেওয়া হয়নি (Not Enabled)",
    en: "Permission Not Requested Yet",
    hi: "अनुमति नहीं दी गई"
  },
  enableBtn: {
    bn: "নোটিফিকেশন চালু করুন",
    en: "Enable Push Notifications",
    hi: "सूचनाएं चालू करें"
  },
  testBtn: {
    bn: "টেস্ট নোটিফিকেশন পাঠান",
    en: "Send Test Notification",
    hi: "टेस्ट नोटिफिकेशन भेजें"
  },
  settingsTab: {
    bn: "অ্যালার্ট সেটিংস",
    en: "Alert Settings",
    hi: "अलर्ट सेटिंग्स"
  },
  remindersTab: {
    bn: "আমার কাস্টম রিমাইন্ডার",
    en: "Custom Reminders",
    hi: "कस्टम रिमाइंडर"
  },
  eventsTab: {
    bn: "আসন্ন ইভেন্টসমূহ",
    en: "Upcoming Events",
    hi: "आगामी कार्यक्रम"
  },
  dailyTimeLabel: {
    bn: "দৈনিক নোটিফিকেশন সময়:",
    en: "Daily Morning Alert Time:",
    hi: "दैनिक सूचना समय:"
  },
  soundLabel: {
    bn: "নোটিফিকেশন সাউন্ড বা চিম বীপ",
    en: "Notification Chime Sound",
    hi: "सूचना ध्वनि"
  },
  categoryFiltersLabel: {
    bn: "যে ক্যাটাগরির নোটিফিকেশন পেতে চান:",
    en: "Notification Categories to Receive:",
    hi: "सूचना प्राप्त करने की श्रेणियां:"
  },
  addReminderTitle: {
    bn: "নতুন ইভেন্ট রিমাইন্ডার যোগ করুন",
    en: "Add New Custom Reminder Alert",
    hi: "नया कस्टम रिमाइंडर जोड़ें"
  },
  selectEventOption: {
    bn: "ক্যালেন্ডার ইভেন্ট থেকে বেছে নিন (ঐচ্ছিক)",
    en: "Select from Calendar Event (Optional)",
    hi: "कैलेंडर ईवेंट में से चुनें (वैकल्पिक)"
  },
  customTitlePlaceholder: {
    bn: "যেমন: রবীন্দ্রনাথ জয়ন্তী অথবা বন্ধুর জন্মদিন...",
    en: "e.g., Rabindra Jayanti or Friend's Birthday...",
    hi: "जैसे: रवींद्रनाथ जयंती या दोस्त का जन्मदिन..."
  },
  reminderDateLabel: {
    bn: "তারিখ (MM-DD)",
    en: "Date (MM-DD)",
    hi: "तारीख (MM-DD)"
  },
  reminderTimeLabel: {
    bn: "সময় (HH:MM)",
    en: "Time (HH:MM)",
    hi: "समय (HH:MM)"
  },
  saveReminderBtn: {
    bn: "রিমাইন্ডার সেভ করুন",
    en: "Save Reminder Alert",
    hi: "रिमाइंडर सहेजें"
  },
  noReminders: {
    bn: "আপনার কোনো কাস্টম রিমাইন্ডার যোগ করা নেই।",
    en: "No custom reminders configured yet.",
    hi: "अभी कोई कस्टम रिमाइंडर नहीं जोड़ा गया है।"
  },
  todayLabel: {
    bn: "আজকের বিশেষ দিন (TODAY)",
    en: "Today's Special Days",
    hi: "आज के विशेष दिन"
  },
  tomorrowLabel: {
    bn: "আগামীকালের বিশেষ দিন (TOMORROW)",
    en: "Tomorrow's Special Days",
    hi: "कल के विशेष दिन"
  },
  upcomingLabel: {
    bn: "আগামী ৭ দিনের গুরুত্বপূর্ণ দিবস (UPCOMING)",
    en: "Upcoming Days (Next 7 Days)",
    hi: "आगामी दिवस (अगले 7 दिन)"
  },
  noEventsToday: {
    bn: "আজকের জন্য বিশেষ কোনো পূর্ব-নির্ধারিত দিবস নেই।",
    en: "No special days scheduled for today.",
    hi: "आज के लिए कोई विशेष कार्यक्रम निर्धारित नहीं है।"
  },
  noEventsTomorrow: {
    bn: "আগামীকালের জন্য বিশেষ কোনো পূর্ব-নির্ধারিত দিবস নেই।",
    en: "No special days scheduled for tomorrow.",
    hi: "कल के लिए कोई विशेष कार्यक्रम निर्धारित नहीं है।"
  },
  noEventsUpcoming: {
    bn: "আসন্ন সপ্তাহে বিশেষ কোনো দিবস নেই।",
    en: "No special days in the coming week.",
    hi: "आने वाले सप्ताह में कोई विशेष कार्यक्रम नहीं है।"
  },
  daysLeftText: {
    bn: (days: number) => `${days.toLocaleString("bn-BD")} দিন পর`,
    en: (days: number) => `In ${days} days`,
    hi: (days: number) => `${days} दिनों में`
  },
  quickAlertSet: {
    bn: "অ্যালার্ট সেট করা হয়েছে",
    en: "Alert Set",
    hi: "अलर्ट सेट है"
  },
  setQuickAlert: {
    bn: "স্মারক অ্যালার্ট সেট করুন",
    en: "Set Quick Reminder",
    hi: "त्वरित रिमाइंडर सेट करें"
  }
};

export const NotificationFeed: React.FC<NotificationFeedProps> = ({
  events,
  onSelectDate,
  onSelectEvent,
  setActiveTab,
  language
}) => {
  const [permissionState, setPermissionState] = useState<NotificationPermission>("default");
  const [settings, setSettings] = useState<NotificationSettings>(getStoredNotificationSettings);
  const [activeSubTab, setActiveSubTab] = useState<"events" | "reminders" | "settings">("events");

  // Custom reminder form state
  const [selectedEventId, setSelectedEventId] = useState<string>("");
  const [reminderTitle, setReminderTitle] = useState<string>("");
  const [reminderDate, setReminderDate] = useState<string>("");
  const [reminderTime, setReminderTime] = useState<string>("09:00");

  useEffect(() => {
    setPermissionState(getBrowserPermissionState());
  }, []);

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    setPermissionState(getBrowserPermissionState());
    if (granted) {
      const updated = { ...settings, browserEnabled: true };
      setSettings(updated);
      saveNotificationSettings(updated);
      
      // Fire welcome toast notification
      sendBrowserNotification(
        language === "bn" ? "🎉 স্পেশাল দিন নোটিফিকেশন সক্রিয় হয়েছে!" : "🎉 Special Day Notifications Enabled!",
        {
          body: language === "bn" 
            ? "প্রতিদিনের গুরুত্বপূর্ণ দিন ও ঐতিহাসিক স্মারক বার্তা আপনি এখানে পেয়ে যাবেন।" 
            : "You will now receive timely alerts for daily special days and memorials."
        }
      );
    }
  };

  const handleTestNotification = () => {
    sendBrowserNotification(
      language === "bn" ? "🔔 বিশেষ দিন টেস্ট নোটিফিকেশন" : "🔔 Special Day Test Alert",
      {
        body: language === "bn"
          ? "আপনার ডিভাইসে নোটিফিকেশন অ্যালার্ট সিস্টেম সফলভাবে কাজ করছে!"
          : "Notification alert system is working perfectly on your device!"
      }
    );
  };

  const handleToggleCategory = (categoryKey: string) => {
    let updatedCats: string[];
    if (settings.enabledCategories.includes(categoryKey)) {
      updatedCats = settings.enabledCategories.filter((c) => c !== categoryKey);
    } else {
      updatedCats = [...settings.enabledCategories, categoryKey];
    }
    const updated = { ...settings, enabledCategories: updatedCats };
    setSettings(updated);
    saveNotificationSettings(updated);
  };

  const handleToggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    setSettings(updated);
    saveNotificationSettings(updated);
  };

  const handleDailyTimeChange = (timeStr: string) => {
    const updated = { ...settings, dailyAlertTime: timeStr };
    setSettings(updated);
    saveNotificationSettings(updated);
  };

  const handleSelectEventForReminder = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const evId = e.target.value;
    setSelectedEventId(evId);
    if (evId) {
      const ev = events.find((item) => item.id === evId);
      if (ev) {
        setReminderTitle(getEventTitle(ev, language));
        setReminderDate(ev.date.length === 5 ? ev.date : ev.date.substring(5));
      }
    }
  };

  const handleAddCustomReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderTitle.trim() || !reminderDate.trim()) return;

    const newRem: CustomReminder = {
      id: "rem-" + Date.now(),
      eventId: selectedEventId || undefined,
      title: reminderTitle.trim(),
      date: reminderDate.trim(),
      time: reminderTime || "09:00",
      enabled: true,
      createdAt: new Date().toISOString()
    };

    const updated = {
      ...settings,
      customReminders: [newRem, ...settings.customReminders]
    };
    setSettings(updated);
    saveNotificationSettings(updated);

    // Reset fields
    setSelectedEventId("");
    setReminderTitle("");
    setReminderDate("");

    // Notify user
    sendBrowserNotification(
      language === "bn" ? "✅ কাস্টম রিমাইন্ডার যোগ হয়েছে" : "✅ Custom Reminder Saved",
      {
        body: `${newRem.title} (${newRem.date} ${newRem.time})`
      }
    );
  };

  const handleToggleReminder = (id: string) => {
    const updatedReminders = settings.customReminders.map((rem) =>
      rem.id === id ? { ...rem, enabled: !rem.enabled } : rem
    );
    const updated = { ...settings, customReminders: updatedReminders };
    setSettings(updated);
    saveNotificationSettings(updated);
  };

  const handleDeleteReminder = (id: string) => {
    const updatedReminders = settings.customReminders.filter((rem) => rem.id !== id);
    const updated = { ...settings, customReminders: updatedReminders };
    setSettings(updated);
    saveNotificationSettings(updated);
  };

  const handleQuickAddAlert = (event: SpecialDayEvent) => {
    const evDate = event.date.length === 5 ? event.date : event.date.substring(5);
    const existing = settings.customReminders.find((r) => r.eventId === event.id);

    if (existing) {
      handleDeleteReminder(existing.id);
    } else {
      const newRem: CustomReminder = {
        id: "rem-" + Date.now(),
        eventId: event.id,
        title: getEventTitle(event, language),
        date: evDate,
        time: settings.dailyAlertTime || "08:00",
        enabled: true,
        createdAt: new Date().toISOString()
      };
      const updated = {
        ...settings,
        customReminders: [newRem, ...settings.customReminders]
      };
      setSettings(updated);
      saveNotificationSettings(updated);

      sendBrowserNotification(
        language === "bn" ? "🔔 ইভেন্ট রিমাইন্ডার সেট করা হয়েছে" : "🔔 Event Alert Configured",
        {
          body: `${newRem.title} (${evDate} @ ${newRem.time})`
        }
      );
    }
  };

  // Date Math for Upcoming Feed
  const today = new Date();
  const getMMDD = (date: Date) => {
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${mm}-${dd}`;
  };

  const getDayOffsetMMDD = (offset: number) => {
    const target = new Date();
    target.setDate(today.getDate() + offset);
    return {
      mmdd: getMMDD(target),
      dateObj: target,
      offset
    };
  };

  const todayKey = getMMDD(today);
  const tomorrowObj = getDayOffsetMMDD(1);
  const tomorrowKey = tomorrowObj.mmdd;

  const todayEvents = events.filter((e) => e.date === todayKey);
  const tomorrowEvents = events.filter((e) => e.date === tomorrowKey);

  const upcomingEvents: { event: SpecialDayEvent; daysLeft: number; dateObj: Date }[] = [];
  for (let i = 2; i <= 7; i++) {
    const dayObj = getDayOffsetMMDD(i);
    const dayEvents = events.filter((e) => e.date === dayObj.mmdd);
    dayEvents.forEach((e) => {
      upcomingEvents.push({
        event: e,
        daysLeft: i,
        dateObj: dayObj.dateObj
      });
    });
  }

  const handleEventClick = (event: SpecialDayEvent, dateObj: Date) => {
    onSelectDate(dateObj);
    onSelectEvent(event);
    setActiveTab("calendar");
  };

  const localeStr = language === "bn" ? "bn-BD" : language === "hi" ? "hi-IN" : "en-US";

  return (
    <div id="notification-section" className="flex flex-col gap-6">
      
      {/* 1. Header & Browser Permission Card */}
      <div className="bg-white rounded-3xl border border-natural-border shadow-sm p-6">
        <div className="flex items-center gap-3 border-b border-natural-border pb-4 mb-6">
          <div className="p-3 bg-natural-accent/10 text-natural-accent rounded-2xl shrink-0">
            <Bell className="w-6 h-6 animate-swing" />
          </div>
          <div>
            <h2 id="notif-sec-title" className="text-xl font-bold text-natural-heading">
              {notifTranslations.feedTitle[language]}
            </h2>
            <p className="text-xs text-natural-text/70 mt-0.5">
              {notifTranslations.feedSub[language]}
            </p>
          </div>
        </div>

        {/* Browser Push Permission Banner */}
        <div className="bg-gradient-to-r from-natural-primary/5 via-white to-natural-accent/5 border border-natural-border rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-white border border-natural-border/80 shadow-xs shrink-0 mt-0.5">
              {permissionState === "granted" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : permissionState === "denied" ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-natural-heading">
                  {notifTranslations.browserAlertTitle[language]}
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  permissionState === "granted" 
                    ? "bg-emerald-100 text-emerald-700" 
                    : permissionState === "denied" 
                    ? "bg-red-100 text-red-700" 
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {permissionState === "granted"
                    ? notifTranslations.statusGranted[language]
                    : permissionState === "denied"
                    ? notifTranslations.statusDenied[language]
                    : notifTranslations.statusDefault[language]}
                </span>
              </div>
              <p className="text-xs text-natural-text/70 mt-1 max-w-xl">
                {notifTranslations.browserAlertSub[language]}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {permissionState !== "granted" && (
              <button
                id="enable-push-btn"
                onClick={handleRequestPermission}
                className="px-4 py-2 bg-natural-accent hover:bg-natural-accent/90 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{notifTranslations.enableBtn[language]}</span>
              </button>
            )}
            
            <button
              id="test-push-btn"
              onClick={handleTestNotification}
              className="px-3.5 py-2 border border-natural-border bg-white hover:bg-natural-aside/50 text-natural-text rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-natural-accent" />
              <span>{notifTranslations.testBtn[language]}</span>
            </button>
          </div>
        </div>

        {/* 2. Sub Tabs Navigation */}
        <div className="flex items-center gap-2 mt-6 border-b border-natural-border/60 pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveSubTab("events")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "events"
                ? "bg-natural-accent text-white shadow-xs"
                : "bg-natural-aside/50 text-natural-text hover:bg-natural-aside"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{notifTranslations.eventsTab[language]}</span>
          </button>
          <button
            onClick={() => setActiveSubTab("reminders")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap relative ${
              activeSubTab === "reminders"
                ? "bg-natural-accent text-white shadow-xs"
                : "bg-natural-aside/50 text-natural-text hover:bg-natural-aside"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{notifTranslations.remindersTab[language]}</span>
            {settings.customReminders.length > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-black ${
                activeSubTab === "reminders" ? "bg-white text-natural-accent" : "bg-natural-accent text-white"
              }`}>
                {settings.customReminders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab("settings")}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === "settings"
                ? "bg-natural-accent text-white shadow-xs"
                : "bg-natural-aside/50 text-natural-text hover:bg-natural-aside"
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{notifTranslations.settingsTab[language]}</span>
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: Upcoming Events Grid */}
      {activeSubTab === "events" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Today's Special */}
          <div className="bg-gradient-to-br from-natural-accent/5 to-natural-primary/5 border border-natural-border rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-natural-accent text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                {notifTranslations.todayLabel[language]}
              </span>
              <span className="text-xs font-semibold text-natural-text/60">
                {today.toLocaleDateString(localeStr, { day: "numeric", month: "short" })}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {todayEvents.length > 0 ? (
                todayEvents.map((e) => {
                  const isAlertSet = settings.customReminders.some((r) => r.eventId === e.id);
                  return (
                    <div
                      key={e.id}
                      className="bg-white p-3.5 rounded-2xl border border-natural-border/80 hover:border-natural-accent transition-all flex flex-col gap-2 shadow-xs group"
                    >
                      <button
                        onClick={() => handleEventClick(e, today)}
                        className="text-left w-full cursor-pointer"
                      >
                        <span className="text-[10px] font-bold text-natural-accent uppercase tracking-wide">
                          {getCategoryLabel(e.category, language)}
                        </span>
                        <h4 className="text-sm font-bold text-natural-heading group-hover:text-natural-accent flex items-center justify-between mt-0.5">
                          <span>{getEventTitle(e, language)}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-natural-text/40 group-hover:translate-x-1 transition-transform" />
                        </h4>
                      </button>

                      <div className="flex items-center justify-between pt-2 border-t border-natural-border/40 text-[10px]">
                        <button
                          onClick={() => handleQuickAddAlert(e)}
                          className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                            isAlertSet
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-natural-aside/60 text-natural-text hover:bg-natural-accent/10 hover:text-natural-accent"
                          }`}
                        >
                          <Bell className="w-3 h-3" />
                          <span>{isAlertSet ? notifTranslations.quickAlertSet[language] : notifTranslations.setQuickAlert[language]}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-natural-text/50 italic py-6 text-center">
                  {notifTranslations.noEventsToday[language]}
                </p>
              )}
            </div>
          </div>

          {/* Tomorrow's Special */}
          <div className="bg-gradient-to-br from-natural-primary/5 to-natural-aside border border-natural-border rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 bg-natural-primary text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
                {notifTranslations.tomorrowLabel[language]}
              </span>
              <span className="text-xs font-semibold text-natural-text/60">
                {tomorrowObj.dateObj.toLocaleDateString(localeStr, { day: "numeric", month: "short" })}
              </span>
            </div>

            <div className="mt-4 flex flex-col gap-3">
              {tomorrowEvents.length > 0 ? (
                tomorrowEvents.map((e) => {
                  const isAlertSet = settings.customReminders.some((r) => r.eventId === e.id);
                  return (
                    <div
                      key={e.id}
                      className="bg-white p-3.5 rounded-2xl border border-natural-border/80 hover:border-natural-primary transition-all flex flex-col gap-2 shadow-xs group"
                    >
                      <button
                        onClick={() => handleEventClick(e, tomorrowObj.dateObj)}
                        className="text-left w-full cursor-pointer"
                      >
                        <span className="text-[10px] font-bold text-natural-primary uppercase tracking-wide">
                          {getCategoryLabel(e.category, language)}
                        </span>
                        <h4 className="text-sm font-bold text-natural-heading group-hover:text-natural-primary flex items-center justify-between mt-0.5">
                          <span>{getEventTitle(e, language)}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-natural-text/40 group-hover:translate-x-1 transition-transform" />
                        </h4>
                      </button>

                      <div className="flex items-center justify-between pt-2 border-t border-natural-border/40 text-[10px]">
                        <button
                          onClick={() => handleQuickAddAlert(e)}
                          className={`px-2 py-1 rounded-lg font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                            isAlertSet
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-natural-aside/60 text-natural-text hover:bg-natural-primary/10 hover:text-natural-primary"
                          }`}
                        >
                          <Bell className="w-3 h-3" />
                          <span>{isAlertSet ? notifTranslations.quickAlertSet[language] : notifTranslations.setQuickAlert[language]}</span>
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-natural-text/50 italic py-6 text-center">
                  {notifTranslations.noEventsTomorrow[language]}
                </p>
              )}
            </div>
          </div>

          {/* Next 7 Days */}
          <div className="bg-natural-aside/30 border border-natural-border rounded-3xl p-5 shadow-xs">
            <span className="px-2.5 py-1 bg-natural-text/70 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
              {notifTranslations.upcomingLabel[language]}
            </span>

            <div className="mt-4 flex flex-col gap-2.5 overflow-y-auto max-h-80 pr-1">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map(({ event: e, daysLeft, dateObj }) => {
                  const isAlertSet = settings.customReminders.some((r) => r.eventId === e.id);
                  return (
                    <div
                      key={e.id}
                      className="bg-white p-3 rounded-2xl border border-natural-border/60 hover:border-natural-border transition-all flex items-center justify-between gap-2 shadow-xs group"
                    >
                      <button
                        onClick={() => handleEventClick(e, dateObj)}
                        className="text-left overflow-hidden flex-1 cursor-pointer"
                      >
                        <span className="text-[9px] font-bold text-natural-text/50 block">
                          {getCategoryLabel(e.category, language)} ({dateObj.toLocaleDateString(localeStr, { day: "numeric", month: "short" })})
                        </span>
                        <span className="text-xs font-bold text-natural-text truncate block group-hover:text-natural-heading">
                          {getEventTitle(e, language)}
                        </span>
                      </button>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleQuickAddAlert(e)}
                          className={`p-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-colors ${
                            isAlertSet ? "bg-emerald-100 text-emerald-700" : "bg-natural-aside text-natural-text/70 hover:bg-natural-accent/10 hover:text-natural-accent"
                          }`}
                          title="Quick Alert"
                        >
                          <Bell className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 py-1 bg-natural-accent/10 text-natural-accent rounded-lg text-[9px] font-bold">
                          {notifTranslations.daysLeftText[language](daysLeft)}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-natural-text/50 italic py-6 text-center">
                  {notifTranslations.noEventsUpcoming[language]}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: Custom Reminders Creator & Active List */}
      {activeSubTab === "reminders" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Creator Form */}
          <div className="lg:col-span-5 bg-white border border-natural-border rounded-3xl p-6 shadow-xs">
            <h3 className="text-base font-bold text-natural-heading flex items-center gap-2 mb-4">
              <Plus className="w-4 h-4 text-natural-accent" />
              <span>{notifTranslations.addReminderTitle[language]}</span>
            </h3>

            <form onSubmit={handleAddCustomReminder} className="flex flex-col gap-4">
              {/* Event Picker Dropdown */}
              <div>
                <label className="text-xs font-bold text-natural-text/80 block mb-1">
                  {notifTranslations.selectEventOption[language]}
                </label>
                <select
                  value={selectedEventId}
                  onChange={handleSelectEventForReminder}
                  className="w-full bg-natural-aside/40 border border-natural-border rounded-xl px-3 py-2 text-xs font-medium text-natural-text focus:outline-none focus:border-natural-accent"
                >
                  <option value="">-- {language === "bn" ? "নিজস্ব শিরোনাম লিখুন" : "Enter Custom Title"} --</option>
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.date} - {getEventTitle(e, language)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title input */}
              <div>
                <label className="text-xs font-bold text-natural-text/80 block mb-1">
                  {language === "bn" ? "রিমাইন্ডার শিরোনাম:" : "Reminder Title:"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={notifTranslations.customTitlePlaceholder[language]}
                  value={reminderTitle}
                  onChange={(e) => setReminderTitle(e.target.value)}
                  className="w-full bg-natural-aside/40 border border-natural-border rounded-xl px-3 py-2 text-xs text-natural-text focus:outline-none focus:border-natural-accent"
                />
              </div>

              {/* Date & Time Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-natural-text/80 block mb-1">
                    {notifTranslations.reminderDateLabel[language]}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="01-23"
                    value={reminderDate}
                    onChange={(e) => setReminderDate(e.target.value)}
                    className="w-full bg-natural-aside/40 border border-natural-border rounded-xl px-3 py-2 text-xs font-mono text-natural-text focus:outline-none focus:border-natural-accent"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-natural-text/80 block mb-1">
                    {notifTranslations.reminderTimeLabel[language]}
                  </label>
                  <input
                    type="time"
                    required
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full bg-natural-aside/40 border border-natural-border rounded-xl px-3 py-2 text-xs font-mono text-natural-text focus:outline-none focus:border-natural-accent"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-natural-accent hover:bg-natural-accent/90 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{notifTranslations.saveReminderBtn[language]}</span>
              </button>
            </form>
          </div>

          {/* Active Reminders List */}
          <div className="lg:col-span-7 bg-white border border-natural-border rounded-3xl p-6 shadow-xs flex flex-col">
            <h3 className="text-base font-bold text-natural-heading flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-natural-accent" />
              <span>{notifTranslations.remindersTab[language]} ({settings.customReminders.length})</span>
            </h3>

            {settings.customReminders.length > 0 ? (
              <div className="flex flex-col gap-3 overflow-y-auto max-h-96 pr-1">
                {settings.customReminders.map((rem) => (
                  <div
                    key={rem.id}
                    className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                      rem.enabled
                        ? "bg-natural-aside/20 border-natural-border/80 hover:border-natural-accent"
                        : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleToggleReminder(rem.id)}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-colors shrink-0 ${
                          rem.enabled
                            ? "bg-natural-accent/10 text-natural-accent"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        <Bell className="w-4 h-4" />
                      </button>
                      <div>
                        <h4 className="text-sm font-bold text-natural-heading">{rem.title}</h4>
                        <span className="text-xs font-mono text-natural-text/70 flex items-center gap-2 mt-0.5">
                          <span>📅 {rem.date}</span>
                          <span>⏰ {rem.time}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteReminder(rem.id)}
                        className="p-2 text-natural-text/40 hover:text-red-600 rounded-xl cursor-pointer transition-colors"
                        title="Delete Reminder"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-natural-text/50 my-auto">
                <Clock className="w-10 h-10 mx-auto mb-3 text-natural-text/30" />
                <p className="text-xs font-medium">{notifTranslations.noReminders[language]}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: Detailed Alert Settings & Category Toggles */}
      {activeSubTab === "settings" && (
        <div className="bg-white border border-natural-border rounded-3xl p-6 shadow-xs flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-natural-border/60">
            {/* Daily Morning Time Picker */}
            <div className="bg-natural-aside/30 border border-natural-border rounded-2xl p-4 flex flex-col gap-2">
              <label className="text-xs font-bold text-natural-heading flex items-center gap-2">
                <Clock className="w-4 h-4 text-natural-accent" />
                <span>{notifTranslations.dailyTimeLabel[language]}</span>
              </label>
              <input
                type="time"
                value={settings.dailyAlertTime}
                onChange={(e) => handleDailyTimeChange(e.target.value)}
                className="bg-white border border-natural-border rounded-xl px-3 py-2 text-sm font-bold font-mono text-natural-heading focus:outline-none focus:border-natural-accent w-36"
              />
            </div>

            {/* Sound Toggle */}
            <div className="bg-natural-aside/30 border border-natural-border rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="w-5 h-5 text-natural-accent" />
                ) : (
                  <VolumeX className="w-5 h-5 text-natural-text/40" />
                )}
                <span className="text-xs font-bold text-natural-heading">
                  {notifTranslations.soundLabel[language]}
                </span>
              </div>
              <button
                onClick={handleToggleSound}
                className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
                  settings.soundEnabled ? "bg-natural-accent" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Category Preferences Checklist */}
          <div>
            <h3 className="text-sm font-bold text-natural-heading mb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-natural-accent" />
              <span>{notifTranslations.categoryFiltersLabel[language]}</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.keys(categoryMeta).map((catKey) => {
                const isChecked = settings.enabledCategories.includes(catKey);
                const meta = categoryMeta[catKey as keyof typeof categoryMeta];
                const label = getCategoryLabel(catKey, language);

                return (
                  <button
                    key={catKey}
                    onClick={() => handleToggleCategory(catKey)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      isChecked
                        ? "bg-natural-accent/10 border-natural-accent text-natural-heading font-bold shadow-xs"
                        : "bg-natural-aside/20 border-natural-border/60 text-natural-text/60 hover:border-natural-border"
                    }`}
                  >
                    <span className="text-base">📅</span>
                    <span className="text-xs truncate flex-1">{label}</span>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}} // handled by parent button
                      className="accent-natural-accent rounded cursor-pointer shrink-0"
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
