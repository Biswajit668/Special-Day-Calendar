import React, { useState, useEffect } from "react";
import { 
  Users, 
  Cake, 
  Search, 
  Plus, 
  Calendar as CalendarIcon, 
  Sparkles, 
  RefreshCw, 
  Mail, 
  Phone, 
  Check, 
  AlertCircle, 
  UserPlus, 
  Trash2,
  Share2,
  Gift
} from "lucide-react";
import { Language, t } from "../lib/translations";
import { SpecialDayEvent } from "../types";
import { db, collection, addDoc, handleFirestoreError, OperationType, User } from "../lib/firebase";

export interface ContactPerson {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  photoUrl?: string;
  birthdayMonth?: number; // 1-12
  birthdayDay?: number;   // 1-31
  birthdayFormatted?: string;
  source: "google" | "custom";
}

interface ContactsManagerProps {
  user: User | null;
  accessToken: string | null;
  onGoogleLogin: () => void;
  language: Language;
  onSelectDate: (date: Date) => void;
  onSelectEvent: (event: SpecialDayEvent) => void;
  setActiveTab: (tab: string) => void;
  onAddCustomEvent: (event: SpecialDayEvent) => void;
}

export const ContactsManager: React.FC<ContactsManagerProps> = ({
  user,
  accessToken,
  onGoogleLogin,
  language,
  onSelectDate,
  onSelectEvent,
  setActiveTab,
  onAddCustomEvent
}) => {
  const [contacts, setContacts] = useState<ContactPerson[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterType, setFilterType] = useState<"all" | "birthdays">("all");
  const [addedCalendarIds, setAddedCalendarIds] = useState<string[]>([]);

  // Manual Contact Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [newContactName, setNewContactName] = useState<string>("");
  const [newContactEmail, setNewContactEmail] = useState<string>("");
  const [newContactPhone, setNewContactPhone] = useState<string>("");
  const [newContactMonth, setNewContactMonth] = useState<number>(new Date().getMonth() + 1);
  const [newContactDay, setNewContactDay] = useState<number>(new Date().getDate());

  // Load custom contacts from localStorage
  const getCustomContacts = (): ContactPerson[] => {
    try {
      const stored = localStorage.getItem(`custom_contacts_${user?.uid || "guest"}`);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  };

  const saveCustomContacts = (list: ContactPerson[]) => {
    localStorage.setItem(`custom_contacts_${user?.uid || "guest"}`, JSON.stringify(list));
  };

  // Fetch Google Contacts via Google People API
  const fetchGoogleContacts = async () => {
    if (!accessToken) {
      setError(
        language === "bn" 
          ? "গুগল কন্টাক্টস এক্সেস করতে অনুগ্রহ করে পুন-লগইন করুন।" 
          : language === "hi" 
            ? "गूगल संपर्क एक्सेस करने के लिए कृपया पुनः लॉगिन करें।" 
            : "Please re-login to access Google Contacts."
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Google People API endpoint
      const response = await fetch(
        "https://people.googleapis.com/v1/people/me/connections?personFields=names,photos,birthdays,emailAddresses,phoneNumbers&pageSize=100",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json"
          }
        }
      );

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error?.message || `Google API status ${response.status}`);
      }

      const data = await response.json();
      const connections = data.connections || [];

      const googleList: ContactPerson[] = connections.map((person: any, index: number) => {
        const primaryName = person.names?.[0]?.displayName || "Unknown Name";
        const primaryPhoto = person.photos?.[0]?.url;
        const primaryEmail = person.emailAddresses?.[0]?.value;
        const primaryPhone = person.phoneNumbers?.[0]?.value;

        // Parse Birthday
        let bMonth: number | undefined;
        let bDay: number | undefined;
        let bFormatted: string | undefined;

        if (person.birthdays && person.birthdays.length > 0) {
          const bdayObj = person.birthdays[0].date;
          if (bdayObj && bdayObj.month && bdayObj.day) {
            bMonth = bdayObj.month;
            bDay = bdayObj.day;
            const dateObj = new Date(2000, bMonth - 1, bDay);
            bFormatted = dateObj.toLocaleDateString(
              language === "bn" ? "bn-BD" : language === "hi" ? "hi-IN" : "en-US",
              { month: "long", day: "numeric" }
            );
          }
        }

        return {
          id: person.resourceName || `google_${index}`,
          name: primaryName,
          email: primaryEmail,
          phone: primaryPhone,
          photoUrl: primaryPhoto,
          birthdayMonth: bMonth,
          birthdayDay: bDay,
          birthdayFormatted: bFormatted,
          source: "google"
        };
      });

      const customs = getCustomContacts();
      setContacts([...googleList, ...customs]);
    } catch (err: any) {
      console.warn("Failed to fetch Google Contacts:", err);
      setError(
        language === "bn" 
          ? "গুগল কন্টাক্টস লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে পারমিশন চেক করুন অথবা নতুন লগইন করুন।" 
          : language === "hi" 
            ? "गूगल संपर्क लोड करने में समस्या आई। कृपया अनुमति जांचें या पुनः लॉगिन करें।" 
            : "Failed to load Google Contacts. Please check permissions or login again."
      );
      // Fallback to custom contacts
      setContacts(getCustomContacts());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && accessToken) {
      fetchGoogleContacts();
    } else {
      setContacts(getCustomContacts());
    }
  }, [user, accessToken]);

  // Handle Add Custom Contact
  const handleSaveCustomContact = () => {
    if (!newContactName.trim()) return;

    const dateObj = new Date(2000, newContactMonth - 1, newContactDay);
    const bFormatted = dateObj.toLocaleDateString(
      language === "bn" ? "bn-BD" : language === "hi" ? "hi-IN" : "en-US",
      { month: "long", day: "numeric" }
    );

    const newContact: ContactPerson = {
      id: `custom_${Date.now()}`,
      name: newContactName.trim(),
      email: newContactEmail.trim() || undefined,
      phone: newContactPhone.trim() || undefined,
      birthdayMonth: newContactMonth,
      birthdayDay: newContactDay,
      birthdayFormatted: bFormatted,
      source: "custom"
    };

    const updated = [newContact, ...contacts];
    setContacts(updated);
    const customs = updated.filter(c => c.source === "custom");
    saveCustomContacts(customs);

    // Reset Form
    setNewContactName("");
    setNewContactEmail("");
    setNewContactPhone("");
    setShowAddModal(false);
  };

  // Delete Custom Contact
  const handleDeleteCustomContact = (id: string) => {
    const updated = contacts.filter(c => c.id !== id);
    setContacts(updated);
    const customs = updated.filter(c => c.source === "custom");
    saveCustomContacts(customs);
  };

  // Add Contact Birthday to App's Special Days Calendar
  const handleAddBirthdayToCalendar = async (contact: ContactPerson) => {
    if (!contact.birthdayMonth || !contact.birthdayDay) return;

    const mm = String(contact.birthdayMonth).padStart(2, "0");
    const dd = String(contact.birthdayDay).padStart(2, "0");
    const dateKey = `${mm}-${dd}`;

    const titleBn = `🎂 ${contact.name}-এর জন্মদিন`;
    const titleEn = `🎂 ${contact.name}'s Birthday`;
    const titleHi = `🎂 ${contact.name} का जन्मदिन`;

    const descBn = `আজকে আপনার প্রিয়জন ${contact.name}-এর জন্মদিন! শুভেচ্ছা পাঠান এবং আনন্দ শেয়ার করুন।`;
    const descEn = `Today is ${contact.name}'s Birthday! Send birthday wishes and share happiness.`;
    const descHi = `आज आपके प्रियजन ${contact.name} का जन्मदिन है! शुभकामनाएं भेजें और खुशियां बांटें।`;

    const newSpecialDay: SpecialDayEvent = {
      id: `bday_${contact.id}`,
      date: dateKey,
      titleBn,
      titleEn,
      titleHi,
      category: "religious", // Personal celebration
      descriptionBn: descBn,
      descriptionEn: descEn,
      descriptionHi: descHi,
      wishesBn: [
        `শুভ জন্মদিন, ${contact.name}! আপনার আগামী দিনগুলো সুখে-শান্তিতে ভরে উঠুক। 🎉🎂`,
        `${contact.name}-কে জন্মদিনের অনেক শুভেচ্ছা ও ভালোবাসা! 🎁✨`,
        `আজকের এই বিশেষ দিনে আপনার দীর্ঘায়ু ও সাফল্য কামনা করি, ${contact.name}! 🌟`
      ],
      wishesEn: [
        `Happy Birthday, ${contact.name}! May your day be filled with love and laughter. 🎉🎂`,
        `Wishing you a fantastic birthday, ${contact.name}! Have an amazing year ahead. 🎁✨`
      ],
      wishesHi: [
        `जन्मदिन की ढेर सारी शुभकामनाएं, ${contact.name}! आपका दिन मंगलमय हो। 🎉🎂`
      ]
    };

    try {
      // Save to Firestore
      const docRef = await addDoc(collection(db, "special_days"), {
        date: dateKey,
        titleBn,
        titleEn,
        titleHi,
        category: "religious",
        descriptionBn: descBn,
        descriptionEn: descEn,
        descriptionHi: descHi,
        wishesBn: newSpecialDay.wishesBn,
        wishesEn: newSpecialDay.wishesEn,
        wishesHi: newSpecialDay.wishesHi,
        createdAt: new Date().toISOString(),
        createdBy: user?.uid || "guest"
      });

      newSpecialDay.id = docRef.id;
      onAddCustomEvent(newSpecialDay);
      setAddedCalendarIds(prev => [...prev, contact.id]);

      // Jump to date
      const targetDate = new Date();
      targetDate.setMonth(contact.birthdayMonth - 1);
      targetDate.setDate(contact.birthdayDay);
      onSelectDate(targetDate);
      onSelectEvent(newSpecialDay);

    } catch (err) {
      console.error("Error adding birthday to Firestore: ", err);
      // Fallback local state add
      onAddCustomEvent(newSpecialDay);
      setAddedCalendarIds(prev => [...prev, contact.id]);
    }
  };

  // Jump to Poster Creator with Pre-filled Birthday Event
  const handleCreatePosterForContact = (contact: ContactPerson) => {
    const mm = String(contact.birthdayMonth || 1).padStart(2, "0");
    const dd = String(contact.birthdayDay || 1).padStart(2, "0");
    const dateKey = `${mm}-${dd}`;

    const tempEvent: SpecialDayEvent = {
      id: `poster_contact_${contact.id}`,
      date: dateKey,
      titleBn: `${contact.name}-এর শুভ জন্মদিন`,
      titleEn: `Happy Birthday ${contact.name}`,
      titleHi: `${contact.name} को जन्मदिन की बधाई`,
      category: "religious",
      descriptionBn: `${contact.name}-এর জন্মদিনের ডিজিটাল পোস্টার গ্রাফিক্স।`,
      descriptionEn: `Digital birthday celebration poster for ${contact.name}.`,
      descriptionHi: `${contact.name} के जन्मदिन का डिजिटल पोस्टर।`,
      wishesBn: [`শুভ জন্মদিন, ${contact.name}! 🎉`],
      wishesEn: [`Happy Birthday, ${contact.name}! 🎉`],
      wishesHi: [`जन्मदिन की बधाई, ${contact.name}! 🎉`]
    };

    onSelectEvent(tempEvent);
    setActiveTab("calendar");

    // Scroll to poster generator section smooth
    setTimeout(() => {
      const el = document.getElementById("direct-ai-image-generator");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Filtered Contacts
  const filteredContacts = contacts.filter((c) => {
    const matchesSearch = 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email && c.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.phone && c.phone.includes(searchQuery));

    if (filterType === "birthdays") {
      return matchesSearch && c.birthdayMonth && c.birthdayDay;
    }
    return matchesSearch;
  });

  return (
    <div className="bg-white rounded-3xl border border-natural-border shadow-sm p-6 flex flex-col gap-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-natural-border/60 pb-5">
        <div>
          <h2 className="text-xl font-extrabold text-natural-heading flex items-center gap-2">
            <Users className="w-6 h-6 text-natural-accent" />
            <span>
              {language === "bn" ? "গুগল কন্টাক্টস ও জন্মদিন" : language === "hi" ? "गूगल संपर्क और जन्मदिन" : "Google Contacts & Birthdays"}
            </span>
          </h2>
          <p className="text-xs text-natural-text/70 mt-1">
            {language === "bn" 
              ? "আপনার বন্ধুদের কন্টাক্ট ইনফো ও জন্মদিন ট্র্যাক করুন এবং সরাসরি তাদের শুভেচ্ছা দিন!" 
              : language === "hi" 
                ? "अपने दोस्तों के संपर्क और जन्मदिन ट्रैक करें और सीधे शुभकामनाएं दें!" 
                : "Track your friends' contact details and birthdays, and send wish posters directly!"}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {user && accessToken ? (
            <button
              onClick={fetchGoogleContacts}
              disabled={loading}
              className="px-3.5 py-2 bg-natural-aside hover:bg-natural-aside/80 text-natural-text rounded-xl text-xs font-bold border border-natural-border flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>{language === "bn" ? "রিফ্রেশ" : "Refresh"}</span>
            </button>
          ) : (
            <button
              onClick={onGoogleLogin}
              className="px-4 py-2 bg-natural-primary hover:bg-natural-primary/90 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {language === "bn" ? "গুগল কন্টাক্টস কানেক্ট করুন" : "Connect Google Contacts"}
              </span>
            </button>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>{language === "bn" ? "নতুন যোগ করুন" : language === "hi" ? "नया जोड़ें" : "Add Contact"}</span>
          </button>
        </div>
      </div>

      {/* Error / Auth Notice */}
      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3 text-amber-900 text-xs font-medium">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="flex-grow">{error}</p>
          <button
            onClick={onGoogleLogin}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
          >
            {language === "bn" ? "লগইন করুন" : "Login"}
          </button>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="flex items-center gap-2 bg-natural-aside/40 border border-natural-border px-3.5 py-2 rounded-2xl flex-grow max-w-md focus-within:border-natural-accent focus-within:ring-1 focus-within:ring-natural-accent/20 transition-all">
          <Search className="w-4 h-4 text-natural-text/40 shrink-0" />
          <input
            type="text"
            placeholder={
              language === "bn" 
                ? "নাম, ইমেইল অথবা ফোন নম্বর দিয়ে খুঁজুন..." 
                : "Search by name, email, or phone..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-xs w-full text-natural-text placeholder:text-natural-text/40"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-natural-aside/60 border border-natural-border p-1 rounded-2xl shrink-0">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              filterType === "all" ? "bg-white text-natural-accent shadow-xs" : "text-natural-text hover:bg-white/50"
            }`}
          >
            {language === "bn" ? "সব কন্টাক্টস" : language === "hi" ? "सभी संपर्क" : "All Contacts"} ({contacts.length})
          </button>
          <button
            onClick={() => setFilterType("birthdays")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all cursor-pointer ${
              filterType === "birthdays" ? "bg-white text-natural-accent shadow-xs" : "text-natural-text hover:bg-white/50"
            }`}
          >
            <Cake className="w-3.5 h-3.5 text-amber-500" />
            <span>{language === "bn" ? "জন্মদিনসমূহ" : "Birthdays"}</span>
            ({contacts.filter(c => c.birthdayMonth && c.birthdayDay).length})
          </button>
        </div>
      </div>

      {/* Contacts List Grid */}
      {loading ? (
        <div className="py-16 text-center flex flex-col items-center justify-center gap-3">
          <RefreshCw className="w-8 h-8 text-natural-accent animate-spin" />
          <p className="text-xs font-bold text-natural-text/70">
            {language === "bn" ? "গুগল কন্টাক্টস ফেচ করা হচ্ছে..." : "Fetching Google Contacts..."}
          </p>
        </div>
      ) : filteredContacts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => {
            const isAdded = addedCalendarIds.includes(contact.id);
            const hasBirthday = contact.birthdayMonth && contact.birthdayDay;

            return (
              <div
                key={contact.id}
                className="p-4 bg-natural-aside/20 border border-natural-border/80 hover:border-natural-accent/50 rounded-2xl flex flex-col justify-between gap-3 transition-all hover:shadow-xs group"
              >
                <div className="flex items-start gap-3">
                  {contact.photoUrl ? (
                    <img
                      referrerPolicy="no-referrer"
                      src={contact.photoUrl}
                      alt={contact.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-natural-border shrink-0 shadow-xs"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-2xl bg-natural-accent/10 text-natural-accent font-extrabold text-base flex items-center justify-center shrink-0 border border-natural-accent/20">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-sm font-bold text-natural-heading truncate">
                        {contact.name}
                      </h3>
                      {contact.source === "custom" && (
                        <button
                          onClick={() => handleDeleteCustomContact(contact.id)}
                          className="text-natural-text/30 hover:text-rose-600 p-1 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {contact.email && (
                      <p className="text-[11px] text-natural-text/70 flex items-center gap-1 truncate mt-0.5">
                        <Mail className="w-3 h-3 text-natural-text/40 shrink-0" />
                        <span className="truncate">{contact.email}</span>
                      </p>
                    )}

                    {contact.phone && (
                      <p className="text-[11px] text-natural-text/70 flex items-center gap-1 truncate mt-0.5">
                        <Phone className="w-3 h-3 text-natural-text/40 shrink-0" />
                        <span>{contact.phone}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Birthday Tag & Action Buttons */}
                <div className="pt-2 border-t border-natural-border/40 flex items-center justify-between gap-2">
                  {hasBirthday ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200/80 rounded-xl text-[11px] font-bold">
                      <Cake className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{contact.birthdayFormatted || `${contact.birthdayMonth}/${contact.birthdayDay}`}</span>
                    </div>
                  ) : (
                    <span className="text-[10px] text-natural-text/40 italic">
                      {language === "bn" ? "জন্মদিন যুক্ত নেই" : "No birthday set"}
                    </span>
                  )}

                  {hasBirthday && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleAddBirthdayToCalendar(contact)}
                        disabled={isAdded}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isAdded 
                            ? "bg-emerald-100 text-emerald-800 cursor-default" 
                            : "bg-white border border-natural-border hover:border-natural-accent text-natural-heading"
                        }`}
                        title="Add Birthday Event to Calendar"
                      >
                        {isAdded ? <Check className="w-3 h-3 text-emerald-600" /> : <CalendarIcon className="w-3 h-3 text-natural-accent" />}
                        <span>{isAdded ? (language === "bn" ? "যুক্ত" : "Added") : (language === "bn" ? "+ ক্যালেন্ডার" : "+ Calendar")}</span>
                      </button>

                      <button
                        onClick={() => handleCreatePosterForContact(contact)}
                        className="px-2.5 py-1 bg-natural-primary hover:bg-natural-primary/90 text-white rounded-xl text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                        title="Generate Birthday Poster"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{language === "bn" ? "পোস্টার" : "Poster"}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-12 text-center flex flex-col items-center justify-center gap-3 bg-natural-aside/20 rounded-2xl border border-dashed border-natural-border">
          <Users className="w-10 h-10 text-natural-text/30" />
          <h3 className="text-sm font-bold text-natural-heading">
            {language === "bn" ? "কোন কন্টাক্ট পাওয়া যায়নি!" : "No contacts found!"}
          </h3>
          <p className="text-xs text-natural-text/60 max-w-xs">
            {language === "bn" 
              ? "গুগল কন্টাক্টস সিঙ্ক করুন অথবা 'নতুন যোগ করুন' বাটনে ক্লিক করে ম্যানুয়ালি যুক্ত করুন।" 
              : "Sync Google Contacts or add manual entries using the button above."}
          </p>
        </div>
      )}

      {/* Manual Add Contact Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-natural-border p-6 max-w-md w-full shadow-xl flex flex-col gap-4">
            <h3 className="text-base font-extrabold text-natural-heading flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-natural-accent" />
              <span>{language === "bn" ? "নতুন কন্টাক্ট ও জন্মদিন যোগ করুন" : "Add Contact & Birthday"}</span>
            </h3>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-natural-heading uppercase tracking-wider block mb-1">
                  {language === "bn" ? "নাম *" : "Name *"}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Anish Kumar"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-natural-aside/40 border border-natural-border rounded-xl text-xs font-medium outline-none focus:border-natural-accent"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-natural-heading uppercase tracking-wider block mb-1">
                    {language === "bn" ? "মাস *" : "Month *"}
                  </label>
                  <select
                    value={newContactMonth}
                    onChange={(e) => setNewContactMonth(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-natural-aside/40 border border-natural-border rounded-xl text-xs font-medium outline-none focus:border-natural-accent"
                  >
                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(m => (
                      <option key={m} value={m}>
                        {new Date(2000, m - 1, 1).toLocaleString(language === "bn" ? "bn-BD" : "en-US", { month: "long" })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-natural-heading uppercase tracking-wider block mb-1">
                    {language === "bn" ? "দিন *" : "Day *"}
                  </label>
                  <select
                    value={newContactDay}
                    onChange={(e) => setNewContactDay(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-natural-aside/40 border border-natural-border rounded-xl text-xs font-medium outline-none focus:border-natural-accent"
                  >
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-natural-heading uppercase tracking-wider block mb-1">
                  {language === "bn" ? "ইমেইল (ঐচ্ছিক)" : "Email (Optional)"}
                </label>
                <input
                  type="email"
                  placeholder="e.g. friend@gmail.com"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2 bg-natural-aside/40 border border-natural-border rounded-xl text-xs font-medium outline-none focus:border-natural-accent"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-natural-heading uppercase tracking-wider block mb-1">
                  {language === "bn" ? "ফোন নম্বর (ঐচ্ছিক)" : "Phone (Optional)"}
                </label>
                <input
                  type="tel"
                  placeholder="e.g. +91 9876543210"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-natural-aside/40 border border-natural-border rounded-xl text-xs font-medium outline-none focus:border-natural-accent"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-2 pt-3 border-t border-natural-border">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-natural-border text-natural-text rounded-xl text-xs font-bold hover:bg-natural-aside cursor-pointer"
              >
                {language === "bn" ? "বাতিল" : "Cancel"}
              </button>
              <button
                onClick={handleSaveCustomContact}
                disabled={!newContactName.trim()}
                className="px-5 py-2 bg-natural-primary hover:bg-natural-primary/90 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                {language === "bn" ? "সংরক্ষণ করুন" : "Save Contact"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
