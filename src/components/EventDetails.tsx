import React, { useState } from "react";
import { 
  Heart, 
  Share2, 
  Copy, 
  Sparkles, 
  Calendar, 
  MessageCircle, 
  Check,
  Facebook,
  Twitter,
  Send,
  Plus
} from "lucide-react";
import { SpecialDayEvent } from "../types";
import { categoryMeta } from "../data/defaultEvents";

interface EventDetailsProps {
  events: SpecialDayEvent[];
  selectedDate: Date;
  favorites: string[];
  onToggleFavorite: (eventId: string) => void;
  onSelectEvent: (event: SpecialDayEvent) => void;
  activeEvent: SpecialDayEvent | null;
}

export const EventDetails: React.FC<EventDetailsProps> = ({
  events,
  selectedDate,
  favorites,
  onToggleFavorite,
  onSelectEvent,
  activeEvent
}) => {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiWishes, setAiWishes] = useState<any | null>(null);
  const [aiError, setAiError] = useState("");

  const formattedDate = selectedDate.toLocaleDateString("bn-BD", {
    day: "numeric",
    month: "long"
  });

  const formattedDateEn = selectedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long"
  });

  // Handle Clipboard Copy
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Share to social media
  const handleShare = (platform: "fb" | "wa" | "tg" | "x", text: string) => {
    const encodedText = encodeURIComponent(text);
    let url = "";
    if (platform === "fb") {
      url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedText}`;
    } else if (platform === "wa") {
      url = `https://api.whatsapp.com/send?text=${encodedText}`;
    } else if (platform === "tg") {
      url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodedText}`;
    } else if (platform === "x") {
      url = `https://twitter.com/intent/tweet?text=${encodedText}`;
    }
    window.open(url, "_blank");
  };

  // Generate AI Wishes via Server Gemini route
  const handleGenerateAiWishes = async (event: SpecialDayEvent) => {
    setIsAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/gemini/generate-wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          eventTitle: event.titleBn, 
          category: event.category 
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to connect to Gemini API");
      }

      const data = await response.json();
      setAiWishes(data);
    } catch (e: any) {
      console.error(e);
      setAiError("AI শুভেচ্ছা তৈরি করতে ব্যর্থ হয়েছে। দয়া করে আবার চেষ্টা করুন।");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div id="event-details-section" className="flex flex-col gap-6">
      {/* Date Header */}
      <div className="bg-gradient-to-r from-natural-accent to-natural-primary text-white rounded-3xl p-6 shadow-md shadow-natural-primary/10">
        <div className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-1 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>নির্বাচিত তারিখ</span>
        </div>
        <h2 id="details-date-bn" className="text-3xl font-extrabold tracking-tight">
          {formattedDate}
        </h2>
        <p className="text-sm opacity-90 font-medium">{formattedDateEn}</p>
      </div>

      {/* Events Selector if multiple */}
      {events.length > 0 ? (
        <div className="flex flex-col gap-4">
          <label className="text-xs font-bold text-natural-text/60 uppercase tracking-wider">
            আজকের বিশেষ ইভেন্টসমূহ ({events.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {events.map((e) => {
              const isActive = activeEvent?.id === e.id;
              const meta = categoryMeta[e.category] || { labelBn: "দিবস", color: "bg-natural-aside text-natural-text border-natural-border" };
              return (
                <button
                  key={e.id}
                  onClick={() => {
                    onSelectEvent(e);
                    setAiWishes(null); // Reset AI wishes on switch
                  }}
                  className={`px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-natural-primary border-natural-primary text-white shadow-sm"
                      : "bg-white border-natural-border text-natural-text hover:bg-natural-aside/40"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${meta.color.split(" ")[0]}`} />
                  <span>{e.titleBn}</span>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-natural-aside/40 border border-natural-border rounded-3xl p-6 text-center">
          <Calendar className="w-10 h-10 text-natural-accent mx-auto mb-3 animate-bounce" />
          <p className="text-sm font-semibold text-natural-heading mb-1">এই তারিখে কোন পূর্ব-নির্ধারিত ইভেন্ট নেই।</p>
          <p className="text-xs text-natural-text/70">ক্যালেন্ডারে অন্য কোন তারিখে ক্লিক করুন অথবা এডমিন প্যানেল থেকে নতুন দিবস যোগ করুন!</p>
        </div>
      )}

      {/* Active Event Showcase */}
      {activeEvent && (
        <div id={`event-card-${activeEvent.id}`} className="bg-white rounded-3xl border border-natural-border shadow-sm p-6 flex flex-col gap-5">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${categoryMeta[activeEvent.category]?.color || ""}`}>
                {categoryMeta[activeEvent.category]?.labelBn || activeEvent.category}
              </span>
              <h3 id="active-event-title-bn" className="text-2xl font-bold text-natural-heading mt-2 tracking-tight">
                {activeEvent.titleBn}
              </h3>
              <p className="text-xs text-natural-text/50 mt-0.5 font-medium">{activeEvent.titleEn}</p>
            </div>

            {/* Favorite Button */}
            <button
              id={`fav-btn-${activeEvent.id}`}
              onClick={() => onToggleFavorite(activeEvent.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                favorites.includes(activeEvent.id)
                  ? "bg-red-50 border-red-200 text-red-600 shadow-sm"
                  : "bg-white border-natural-border text-natural-text/40 hover:text-natural-text hover:bg-natural-aside/30"
              }`}
            >
              <Heart className={`w-5 h-5 ${favorites.includes(activeEvent.id) ? "fill-current animate-pulse" : ""}`} />
            </button>
          </div>

          {/* Description */}
          <div className="p-4 bg-natural-aside/20 rounded-2xl border border-natural-border/50">
            <p id="active-event-desc-bn" className="text-sm text-natural-text leading-relaxed font-medium">
              {activeEvent.descriptionBn}
            </p>
            <p className="text-xs text-natural-text/50 mt-2 leading-relaxed italic">
              {activeEvent.descriptionEn}
            </p>
          </div>

          {/* Wishes List */}
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-natural-border pb-2">
              <span className="text-xs font-bold text-natural-text/60 uppercase tracking-wider">
                🎁 শুভেচ্ছা ও মেসেজ সমূহ (Ready-made Wishes)
              </span>
              
              <button
                id="ask-gemini-wishes"
                disabled={isAiLoading}
                onClick={() => handleGenerateAiWishes(activeEvent)}
                className="text-xs font-semibold text-natural-primary hover:text-natural-heading flex items-center gap-1 bg-natural-aside/60 hover:bg-natural-aside py-1 px-2.5 rounded-lg transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3 h-3 text-natural-accent" />
                {isAiLoading ? "AI লিখছে..." : "AI দিয়ে লিখুন"}
              </button>
            </div>

            {aiError && (
              <p className="text-xs text-red-600 mb-2 font-medium">{aiError}</p>
            )}

            {/* Standard Wishes Cards */}
            <div className="flex flex-col gap-3">
              {(aiWishes?.wishesBn || activeEvent.wishesBn).map((wish: string, index: number) => {
                const uniqueId = `bn-wish-${index}`;
                return (
                  <div key={uniqueId} className="p-3.5 bg-natural-aside/10 hover:bg-natural-aside/20 border border-natural-border/30 rounded-2xl transition-all group relative flex flex-col gap-2">
                    <p className="text-natural-text text-sm font-semibold pr-10 leading-relaxed">{wish}</p>
                    <div className="flex gap-2 justify-end pt-1 border-t border-dashed border-natural-border/30">
                      <button
                        onClick={() => handleCopy(wish, uniqueId)}
                        className="text-[11px] font-bold text-natural-text/60 hover:text-natural-text flex items-center gap-1 cursor-pointer"
                      >
                        {copiedText === uniqueId ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedText === uniqueId ? "কপি করা হয়েছে" : "কপি"}</span>
                      </button>
                      <button
                        onClick={() => handleShare("wa", wish)}
                        className="text-[11px] font-bold text-natural-accent hover:text-natural-accent/90 flex items-center gap-1 cursor-pointer"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>শেয়ার</span>
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Show English Wishes if AI generated or standard */}
              <div className="mt-2">
                <span className="text-[10px] font-bold text-natural-text/40 block mb-2">ENGLISH GREETINGS</span>
                <div className="flex flex-col gap-2">
                  {(aiWishes?.wishesEn || activeEvent.wishesEn).map((wish: string, index: number) => {
                    const uniqueId = `en-wish-${index}`;
                    return (
                      <div key={uniqueId} className="p-3 bg-natural-aside/10 hover:bg-natural-aside/20 border border-natural-border/20 rounded-2xl transition-all relative flex flex-col gap-2">
                        <p className="text-natural-text text-xs font-semibold pr-10">{wish}</p>
                        <div className="flex gap-2 justify-end pt-1 border-t border-dashed border-natural-border/20">
                          <button
                            onClick={() => handleCopy(wish, uniqueId)}
                            className="text-[10px] font-bold text-natural-text/50 hover:text-natural-text flex items-center gap-1 cursor-pointer"
                          >
                            {copiedText === uniqueId ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedText === uniqueId ? "Copied" : "Copy"}</span>
                          </button>
                          <button
                            onClick={() => handleShare("wa", wish)}
                            className="text-[10px] font-bold text-natural-accent hover:text-natural-accent/90 flex items-center gap-1 cursor-pointer"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>Share</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Facebook and Whatsapp ready caption section */}
          <div className="border-t border-natural-border pt-4 mt-1">
            <span className="text-xs font-bold text-natural-text/60 uppercase tracking-wider block mb-3">
              📱 সোশ্যাল মিডিয়া ক্যাপশন (Facebook / Whatsapp Status)
            </span>
            <div className="bg-natural-aside/15 p-4 rounded-2xl border border-natural-border flex flex-col gap-3">
              <div>
                <span className="text-[11px] font-bold text-natural-primary uppercase">Facebook Caption</span>
                <p className="text-xs text-natural-text font-medium mt-1 pr-6 leading-relaxed bg-white p-2.5 rounded-xl border border-natural-border/30">
                  {aiWishes?.fbCaption || activeEvent.fbCaption || `${activeEvent.titleBn} - শুভেচ্ছা ও প্রণাম!`}
                </p>
                <div className="flex gap-2 justify-end mt-1">
                  <button
                    onClick={() => handleCopy(aiWishes?.fbCaption || activeEvent.fbCaption || "", "fb-cap")}
                    className="text-[10px] font-bold text-natural-text/50 hover:text-natural-text flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText === "fb-cap" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === "fb-cap" ? "কপি হয়েছে" : "কপি করুন"}</span>
                  </button>
                  <button
                    onClick={() => handleShare("fb", aiWishes?.fbCaption || activeEvent.fbCaption || "")}
                    className="text-[10px] font-bold text-natural-primary hover:text-natural-heading flex items-center gap-1 cursor-pointer"
                  >
                    <Facebook className="w-3 h-3" />
                    <span>ফেসবুক</span>
                  </button>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-natural-accent uppercase">WhatsApp Message</span>
                <p className="text-xs text-natural-text font-medium mt-1 pr-6 whitespace-pre-line leading-relaxed bg-white p-2.5 rounded-xl border border-natural-border/30">
                  {aiWishes?.waMessage || activeEvent.waMessage || `শুভ ${activeEvent.titleBn}!`}
                </p>
                <div className="flex gap-2 justify-end mt-1">
                  <button
                    onClick={() => handleCopy(aiWishes?.waMessage || activeEvent.waMessage || "", "wa-cap")}
                    className="text-[10px] font-bold text-natural-text/50 hover:text-natural-text flex items-center gap-1 cursor-pointer"
                  >
                    {copiedText === "wa-cap" ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText === "wa-cap" ? "কপি হয়েছে" : "কপি করুন"}</span>
                  </button>
                  <button
                    onClick={() => handleShare("wa", aiWishes?.waMessage || activeEvent.waMessage || "")}
                    className="text-[10px] font-bold text-natural-accent hover:text-natural-accent/90 flex items-center gap-1 cursor-pointer"
                  >
                    <MessageCircle className="w-3 h-3" />
                    <span>হোয়াটসঅ্যাপ</span>
                  </button>
                </div>
              </div>

              {/* Hashtags list */}
              {((aiWishes?.hashtags || activeEvent.hashtags) && (aiWishes?.hashtags || activeEvent.hashtags).length > 0) && (
                <div className="mt-1 pt-2 border-t border-natural-border/30">
                  <span className="text-[10px] font-bold text-natural-text/40 block mb-1.5">HASHTAGS</span>
                  <div className="flex flex-wrap gap-1">
                    {(aiWishes?.hashtags || activeEvent.hashtags).map((tag: string, index: number) => (
                      <span key={index} className="px-2 py-0.5 bg-natural-aside/60 text-natural-text/80 rounded-md text-[10px] font-semibold">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
