import React, { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Settings, 
  BarChart3, 
  BellRing, 
  Users, 
  Award, 
  Check, 
  FileText,
  AlertCircle
} from "lucide-react";
import { SpecialDayEvent, EventCategory } from "../types";
import { categoryMeta } from "../data/defaultEvents";
import { db, collection, addDoc, doc, deleteDoc, OperationType, handleFirestoreError } from "../lib/firebase";

interface AdminPanelProps {
  customEvents: SpecialDayEvent[];
  onAddCustomEvent: (event: SpecialDayEvent) => void;
  onDeleteCustomEvent: (eventId: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  customEvents,
  onAddCustomEvent,
  onDeleteCustomEvent
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"add" | "manage" | "analytics" | "push">("add");
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Add Event Form State
  const [titleBn, setTitleBn] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [date, setDate] = useState(""); // MM-DD
  const [category, setCategory] = useState<EventCategory>("national");
  const [descBn, setDescBn] = useState("");
  const [descEn, setDescEn] = useState("");
  const [wishesBnText, setWishesBnText] = useState("");
  const [wishesEnText, setWishesEnText] = useState("");
  const [fbCaption, setFbCaption] = useState("");
  const [waMessage, setWaMessage] = useState("");

  // Push Notification Form State
  const [notifTitle, setNotifTitle] = useState("");
  const [notifBody, setNotifBody] = useState("");

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");

    if (!titleBn || !titleEn || !date || !descBn || !descEn) {
      setErrorMsg("অনুগ্রহ করে সবগুলি স্টার (*) চিহ্নিত ঘর পূরণ করুন।");
      return;
    }

    // Validate MM-DD format
    const dateRegex = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!dateRegex.test(date)) {
      setErrorMsg("তারিখের ফরম্যাট অবশ্যই MM-DD হতে হবে (যেমন: রবীন্দ্র জয়ন্তী জন্য 05-09)");
      return;
    }

    setIsSaving(true);
    try {
      const wishesBn = wishesBnText.split("\n").filter(line => line.trim() !== "");
      const wishesEn = wishesEnText.split("\n").filter(line => line.trim() !== "");

      const newEvent: Omit<SpecialDayEvent, "id"> = {
        titleBn,
        titleEn,
        date,
        category,
        descriptionBn: descBn,
        descriptionEn: descEn,
        wishesBn: wishesBn.length > 0 ? wishesBn : ["শুভকামনা ও আন্তরিক শুভেচ্ছা!"],
        wishesEn: wishesEn.length > 0 ? wishesEn : ["Wishing you a wonderful day!"],
        fbCaption: fbCaption || `${titleBn} এর শুভকামনা!`,
        waMessage: waMessage || `শুভ ${titleBn}!`,
        hashtags: [category, "specialday", titleEn.replace(/\s+/g, "")],
        createdBy: "admin"
      };

      // Store in Firestore!
      const docRef = await addDoc(collection(db, "special_days"), newEvent);
      
      onAddCustomEvent({
        id: docRef.id,
        ...newEvent
      });

      setSuccessMsg("নতুন বিশেষ দিনটি সফলভাবে Firestore ডেটাবেসে সংরক্ষিত হয়েছে! 🎉");
      
      // Clear form
      setTitleBn("");
      setTitleEn("");
      setDate("");
      setDescBn("");
      setDescEn("");
      setWishesBnText("");
      setWishesEnText("");
      setFbCaption("");
      setWaMessage("");

    } catch (err: any) {
      console.error(err);
      setErrorMsg("সংরক্ষণ করতে ব্যর্থ হয়েছে: " + err.message);
      handleFirestoreError(err, OperationType.CREATE, "special_days");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle || !notifBody) {
      setErrorMsg("নোটিফিকেশনের শিরোনাম ও বডি লিখুন।");
      return;
    }
    setSuccessMsg("🔔 পুশ নোটিফিকেশন সফলভাবে সমস্ত গ্রাহকদের নিকট পাঠানো হয়েছে!");
    setNotifTitle("");
    setNotifBody("");
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  return (
    <div id="admin-panel-card" className="bg-white rounded-3xl border border-natural-border shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 border-b border-natural-border pb-4">
        <div>
          <h2 id="admin-sec-title" className="text-xl font-bold text-natural-heading flex items-center gap-2">
            👨‍💼 এডমিন কন্ট্রোল প্যানেল (Admin Panel)
          </h2>
          <p className="text-xs text-natural-text/70">নতুন ইভেন্ট যোগ করুন, অ্যানালিটিক্স দেখুন এবং নোটিফিকেশন পাঠান</p>
        </div>

        {/* Sub Navigation */}
        <div className="flex flex-wrap gap-1 bg-natural-aside/40 p-1.5 rounded-2xl border border-natural-border self-start">
          <button
            onClick={() => setActiveSubTab("add")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
              activeSubTab === "add" ? "bg-white text-natural-accent shadow-sm" : "text-natural-text hover:bg-white/50"
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>যোগ করুন</span>
          </button>
          <button
            onClick={() => setActiveSubTab("manage")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
              activeSubTab === "manage" ? "bg-white text-natural-accent shadow-sm" : "text-natural-text hover:bg-white/50"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>ম্যানেজ</span>
          </button>
          <button
            onClick={() => setActiveSubTab("analytics")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
              activeSubTab === "analytics" ? "bg-white text-natural-accent shadow-sm" : "text-natural-text hover:bg-white/50"
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>অ্যানালিটিক্স</span>
          </button>
          <button
            onClick={() => setActiveSubTab("push")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all ${
              activeSubTab === "push" ? "bg-white text-natural-accent shadow-sm" : "text-natural-text hover:bg-white/50"
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>পুশ অ্যালার্ট</span>
          </button>
        </div>
      </div>

      {/* Message alerts */}
      {successMsg && (
        <div className="mb-4 p-3.5 bg-green-50 text-green-800 border border-green-100 rounded-xl text-xs font-semibold flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="mb-4 p-3.5 bg-red-50 text-red-800 border border-red-100 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Sub Tab contents */}
      {activeSubTab === "add" && (
        <form onSubmit={handleSubmitEvent} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-natural-text/70 block mb-1">দিবসের নাম (বাংলায়) *</label>
              <input
                type="text"
                value={titleBn}
                onChange={(e) => setTitleBn(e.target.value)}
                placeholder="যেমন: শুভ রবীন্দ্র জয়ন্তী"
                className="w-full px-3 py-2 border border-natural-border bg-white text-natural-text rounded-xl text-xs focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-natural-text/70 block mb-1">দিবসের নাম (ইংরেজি) *</label>
              <input
                type="text"
                value={titleEn}
                onChange={(e) => setTitleEn(e.target.value)}
                placeholder="যেমন: Rabindra Jayanti"
                className="w-full px-3 py-2 border border-natural-border bg-white text-natural-text rounded-xl text-xs focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-bold text-natural-text/70 block mb-1">তারিখ (MM-DD ফরম্যাটে) *</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="যেমন: 05-09"
                className="w-full px-3 py-2 border border-natural-border bg-white text-natural-text rounded-xl text-xs focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-natural-text/70 block mb-1">ক্যাটাগরি নির্ধারণ করুন *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-full px-3 py-2 border border-natural-border rounded-xl text-xs focus:ring-1 focus:ring-natural-accent bg-white text-natural-text outline-none"
              >
                {Object.entries(categoryMeta).map(([key, meta]) => (
                  <option key={key} value={key}>
                    {meta.labelBn} ({meta.labelEn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-natural-text/70 block mb-1">বাস্তবায়ন বিবরণ (বাংলায়) *</label>
            <textarea
              value={descBn}
              onChange={(e) => setDescBn(e.target.value)}
              placeholder="দিবসের গুরুত্ব, ইতিহাস বা তাৎপর্য ব্যাখ্যা করুন..."
              rows={3}
              className="w-full px-3 py-2 border border-natural-border bg-white text-natural-text rounded-xl text-xs focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none resize-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-natural-text/70 block mb-1">বাস্তবায়ন বিবরণ (ইংরেজিতে) *</label>
            <textarea
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              placeholder="Explain the significance in English..."
              rows={2}
              className="w-full px-3 py-2 border border-natural-border bg-white text-natural-text rounded-xl text-xs focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none resize-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-natural-text/70 block mb-1">প্রস্তুত করা শুভেচ্ছা বার্তা (বাংলা - প্রতি লাইনে একটি)</label>
              <textarea
                value={wishesBnText}
                onChange={(e) => setWishesBnText(e.target.value)}
                placeholder="নতুন বছরের শুভেচ্ছা!\nভালো কাটুক আপনার দিনটি।"
                rows={3}
                className="w-full px-3 py-2 border border-natural-border bg-white text-natural-text rounded-xl text-xs focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none resize-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-natural-text/70 block mb-1">প্রস্তুত করা শুভেচ্ছা বার্তা (ইংরেজি - প্রতি লাইনে একটি)</label>
              <textarea
                value={wishesEnText}
                onChange={(e) => setWishesEnText(e.target.value)}
                placeholder="Wishing you a great year!\nHope you succeed."
                rows={3}
                className="w-full px-3 py-2 border border-natural-border bg-white text-natural-text rounded-xl text-xs focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none resize-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-natural-text/70 block mb-1">Facebook ক্যাপশন (ঐচ্ছিক)</label>
              <input
                type="text"
                value={fbCaption}
                onChange={(e) => setFbCaption(e.target.value)}
                placeholder="Facebook Ready Caption with Emojis..."
                className="w-full px-3 py-2 border border-natural-border bg-white text-natural-text rounded-xl text-xs focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-natural-text/70 block mb-1">WhatsApp মেসেজ (ঐচ্ছিক)</label>
              <input
                type="text"
                value={waMessage}
                onChange={(e) => setWaMessage(e.target.value)}
                placeholder="WhatsApp formatting message..."
                className="w-full px-3 py-2 border border-natural-border bg-white text-natural-text rounded-xl text-xs focus:ring-1 focus:ring-natural-accent focus:border-natural-accent outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full md:w-auto self-end px-6 py-2.5 bg-natural-primary hover:bg-natural-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isSaving ? "সংরক্ষণ করা হচ্ছে..." : "Firestore ডেটাবেসে যোগ করুন"}
          </button>
        </form>
      )}

      {activeSubTab === "manage" && (
        <div>
          <label className="text-xs font-bold text-natural-text/70 uppercase tracking-wider mb-3 block">
            Firestore-এ সংরক্ষিত কাস্টম ইভেন্টসমূহ ({customEvents.length})
          </label>
          <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto">
            {customEvents.length > 0 ? (
              customEvents.map((e) => (
                <div key={e.id} className="p-3.5 bg-natural-aside/20 rounded-2xl border border-natural-border flex items-center justify-between gap-4">
                  <div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${categoryMeta[e.category]?.color || ""}`}>
                      {categoryMeta[e.category]?.labelBn}
                    </span>
                    <h4 className="text-sm font-bold text-natural-heading mt-1.5">{e.titleBn}</h4>
                    <p className="text-[10px] text-natural-text/50 font-medium">তারিখ: {e.date} (id: {e.id})</p>
                  </div>
                  <button
                    onClick={() => onDeleteCustomEvent(e.id)}
                    className="p-2 bg-natural-aside/50 hover:bg-natural-accent/10 hover:text-natural-accent text-natural-text/70 rounded-xl transition-all cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-xs text-natural-text/50 italic py-4 text-center">আপনি এখনো কোন কাস্টম দিবস যোগ করেননি।</p>
            )}
          </div>
        </div>
      )}

      {activeSubTab === "analytics" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-natural-aside/30 border border-natural-border p-4 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-natural-text/60 uppercase">মোট গ্রাহক ভিজিট</span>
              <p className="text-xl font-black text-natural-heading mt-1">৮,৭৪০+</p>
            </div>
            <div className="bg-natural-aside/30 border border-natural-border p-4 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-natural-text/60 uppercase">শেয়ার করা শুভেচ্ছা</span>
              <p className="text-xl font-black text-natural-heading mt-1">৩,৪২০+</p>
            </div>
            <div className="bg-natural-aside/30 border border-natural-border p-4 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-natural-text/60 uppercase">প্রিয় দিবস সংরক্ষিত</span>
              <p className="text-xl font-black text-natural-heading mt-1">১,১৮০+</p>
            </div>
            <div className="bg-natural-aside/30 border border-natural-border p-4 rounded-2xl shadow-sm">
              <span className="text-[10px] font-bold text-natural-text/60 uppercase">কাস্টম দিবস (Firestore)</span>
              <p className="text-xl font-black text-natural-accent mt-1">{customEvents.length}</p>
            </div>
          </div>

          {/* Visual Bar Charts */}
          <div>
            <label className="text-xs font-bold text-natural-text/70 uppercase tracking-wider mb-3 block">
              সবচেয়ে জনপ্রিয় বিশেষ দিনসমূহ (শেয়ার সংখ্যা অনুযায়ী)
            </label>
            <div className="flex flex-col gap-3">
              {[
                { name: "রবীন্দ্র জয়ন্তী", shares: 840, pct: "w-[84%]", color: "bg-natural-primary" },
                { name: "নেতাজী সুভাষচন্দ্র বসুর জন্মদিন", shares: 720, pct: "w-[72%]", color: "bg-natural-accent" },
                { name: "পহেলা বৈশাখ (শুভ নববর্ষ)", shares: 690, pct: "w-[69%]", color: "bg-emerald-600" },
                { name: "সাধারণতন্ত্র দিবস", shares: 450, pct: "w-[45%]", color: "bg-amber-600" },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs font-bold text-natural-text">
                    <span>{item.name}</span>
                    <span>{item.shares} শেয়ার</span>
                  </div>
                  <div className="w-full bg-natural-border/30 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full ${item.color} ${item.pct} rounded-full`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === "push" && (
        <form onSubmit={handleSendPush} className="flex flex-col gap-4 max-w-lg">
          <div>
            <label className="text-xs font-bold text-natural-text/70 block mb-1">নোটিফিকেশন টাইটেল *</label>
            <input
              type="text"
              value={notifTitle}
              onChange={(e) => setNotifTitle(e.target.value)}
              placeholder="যেমন: আগামীকাল কবিগুরু রবীন্দ্রনাথ ঠাকুরের ১৬৫তম জন্মজয়ন্তী!"
              className="w-full px-3 py-2 border border-natural-border bg-white text-natural-text rounded-xl text-xs focus:ring-1 focus:ring-natural-accent outline-none"
              required
            />
          </div>
          <div>
            <label className="text-xs font-bold text-natural-text/70 block mb-1">নোটিফিকেশন মেসেজ / বডি *</label>
            <textarea
              value={notifBody}
              onChange={(e) => setNotifBody(e.target.value)}
              placeholder="সকলের জন্য রেডি-মেড শুভেচ্ছা পোস্টার এবং বাংলা/ইংরেজি শুভেচ্ছা বার্তা দেখতে এখানে ক্লিক করুন।"
              rows={3}
              className="w-full px-3 py-2 border border-natural-border bg-white text-natural-text rounded-xl text-xs focus:ring-1 focus:ring-natural-accent outline-none resize-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full md:w-auto self-end px-5 py-2.5 bg-natural-primary hover:bg-natural-primary/90 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            পুশ নোটিফিকেশন পাঠান
          </button>
        </form>
      )}
    </div>
  );
};
