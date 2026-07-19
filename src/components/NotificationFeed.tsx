import React from "react";
import { Bell, ArrowRight } from "lucide-react";
import { SpecialDayEvent } from "../types";
import { categoryMeta } from "../data/defaultEvents";
import { Language, getEventTitle, getCategoryLabel } from "../lib/translations";

interface NotificationFeedProps {
  events: SpecialDayEvent[];
  onSelectDate: (date: Date) => void;
  onSelectEvent: (event: SpecialDayEvent) => void;
  setActiveTab: (tab: string) => void;
  language: Language;
}

const notifTranslations = {
  feedTitle: {
    bn: "🔔 দিবস নোটিফিকেশন ও অ্যালার্ট (Upcoming Events)",
    en: "🔔 Special Day Alerts & Notifications (Upcoming)",
    hi: "🔔 विशेष दिवस सूचनाएं और अलर्ट (Upcoming)"
  },
  feedSub: {
    bn: "আজকের, আগামীকালের এবং আগামী ৭ দিনের গুরুত্বপূর্ণ দিবসসমূহ",
    en: "Important events of today, tomorrow, and the next 7 days",
    hi: "आज, कल और अगले 7 दिनों के महत्वपूर्ण कार्यक्रम"
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
  }
};

export const NotificationFeed: React.FC<NotificationFeedProps> = ({
  events,
  onSelectDate,
  onSelectEvent,
  setActiveTab,
  language
}) => {
  const today = new Date();
  
  // Helper to format key "MM-DD"
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

  // Find events
  const todayEvents = events.filter(e => e.date === todayKey);
  const tomorrowEvents = events.filter(e => e.date === tomorrowKey);

  // Find upcoming 7 days events (excluding today and tomorrow)
  const upcomingEvents: { event: SpecialDayEvent; daysLeft: number; dateObj: Date }[] = [];
  for (let i = 2; i <= 7; i++) {
    const dayObj = getDayOffsetMMDD(i);
    const dayEvents = events.filter(e => e.date === dayObj.mmdd);
    dayEvents.forEach(e => {
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
    setActiveTab("calendar"); // Switch back to calendar view
  };

  const localeStr = language === "bn" ? "bn-BD" : language === "hi" ? "hi-IN" : "en-US";

  return (
    <div id="notification-section" className="bg-white rounded-3xl border border-natural-border shadow-sm p-6">
      <div className="flex items-center gap-2.5 mb-6 border-b border-natural-border pb-4">
        <div className="p-2 bg-natural-accent/10 text-natural-accent rounded-xl">
          <Bell className="w-5 h-5 animate-swing" />
        </div>
        <div>
          <h2 id="notif-sec-title" className="text-xl font-bold text-natural-heading">
            {notifTranslations.feedTitle[language]}
          </h2>
          <p className="text-xs text-natural-text/70">{notifTranslations.feedSub[language]}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Today's Special */}
        <div className="bg-gradient-to-br from-natural-accent/5 to-natural-primary/5 border border-natural-border rounded-2xl p-5">
          <span className="px-2.5 py-0.5 bg-natural-accent text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
            {notifTranslations.todayLabel[language]}
          </span>
          <div className="mt-4 flex flex-col gap-3">
            {todayEvents.length > 0 ? (
              todayEvents.map(e => (
                <button
                  key={e.id}
                  onClick={() => handleEventClick(e, today)}
                  className="w-full text-left bg-white p-3 rounded-xl border border-natural-border/60 hover:border-natural-accent transition-all cursor-pointer flex flex-col gap-1 group shadow-sm"
                >
                  <span className="text-xs font-bold text-natural-accent">
                    {getCategoryLabel(e.category, language)}
                  </span>
                  <span className="text-sm font-bold text-natural-heading group-hover:text-natural-accent flex items-center justify-between">
                    <span>{getEventTitle(e, language)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-natural-text/40 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              ))
            ) : (
              <p className="text-xs text-natural-text/50 italic">
                {notifTranslations.noEventsToday[language]}
              </p>
            )}
          </div>
        </div>

        {/* Tomorrow's Special */}
        <div className="bg-gradient-to-br from-natural-primary/5 to-natural-aside border border-natural-border rounded-2xl p-5">
          <span className="px-2.5 py-0.5 bg-natural-primary text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
            {notifTranslations.tomorrowLabel[language]}
          </span>
          <div className="mt-4 flex flex-col gap-3">
            {tomorrowEvents.length > 0 ? (
              tomorrowEvents.map(e => (
                <button
                  key={e.id}
                  onClick={() => handleEventClick(e, tomorrowObj.dateObj)}
                  className="w-full text-left bg-white p-3 rounded-xl border border-natural-border/60 hover:border-natural-primary transition-all cursor-pointer flex flex-col gap-1 group shadow-sm"
                >
                  <span className="text-xs font-bold text-natural-primary">
                    {getCategoryLabel(e.category, language)}
                  </span>
                  <span className="text-sm font-bold text-natural-heading group-hover:text-natural-primary flex items-center justify-between">
                    <span>{getEventTitle(e, language)}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-natural-text/40 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              ))
            ) : (
              <p className="text-xs text-natural-text/50 italic">
                {notifTranslations.noEventsTomorrow[language]}
              </p>
            )}
          </div>
        </div>

        {/* Next 7 Days */}
        <div className="bg-natural-aside/30 border border-natural-border rounded-2xl p-5">
          <span className="px-2.5 py-0.5 bg-natural-text/70 text-white rounded-full text-[10px] font-bold uppercase tracking-wider">
            {notifTranslations.upcomingLabel[language]}
          </span>
          <div className="mt-4 flex flex-col gap-2.5 overflow-y-auto max-h-64 pr-1">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map(({ event: e, daysLeft, dateObj }) => (
                <button
                  key={e.id}
                  onClick={() => handleEventClick(e, dateObj)}
                  className="w-full text-left bg-white p-2.5 rounded-xl border border-natural-border/50 hover:border-natural-border transition-all cursor-pointer flex items-center justify-between gap-3 group shadow-sm"
                >
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <span className="text-[10px] font-bold text-natural-text/50">
                      {getCategoryLabel(e.category, language)} ({dateObj.toLocaleDateString(localeStr, { day: "numeric", month: "short" })})
                    </span>
                    <span className="text-xs font-bold text-natural-text truncate group-hover:text-natural-heading">
                      {getEventTitle(e, language)}
                    </span>
                  </div>
                  <span className="px-2 py-1 bg-natural-accent/10 text-natural-accent rounded-lg text-[9px] font-bold shrink-0">
                    {notifTranslations.daysLeftText[language](daysLeft)}
                  </span>
                </button>
              ))
            ) : (
              <p className="text-xs text-natural-text/50 italic">
                {notifTranslations.noEventsUpcoming[language]}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
