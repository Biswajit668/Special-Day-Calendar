import React from "react";
import { Heart, Star, Calendar, Trash2, ArrowRight } from "lucide-react";
import { SpecialDayEvent } from "../types";
import { categoryMeta } from "../data/defaultEvents";

interface FavoriteListProps {
  events: SpecialDayEvent[];
  favorites: string[];
  onToggleFavorite: (eventId: string) => void;
  onSelectDate: (date: Date) => void;
  onSelectEvent: (event: SpecialDayEvent) => void;
  setActiveTab: (tab: string) => void;
}

export const FavoriteList: React.FC<FavoriteListProps> = ({
  events,
  favorites,
  onToggleFavorite,
  onSelectDate,
  onSelectEvent,
  setActiveTab
}) => {
  const favoriteEvents = events.filter((e) => favorites.includes(e.id));

  const handleFavoriteClick = (e: SpecialDayEvent) => {
    // Parse the date (MM-DD)
    const [month, day] = e.date.split("-").map(Number);
    const targetDate = new Date();
    targetDate.setMonth(month - 1);
    targetDate.setDate(day);

    onSelectDate(targetDate);
    onSelectEvent(e);
    setActiveTab("calendar"); // Switch back to calendar view
  };

  return (
    <div id="favorites-section" className="bg-white rounded-3xl border border-natural-border shadow-sm p-6">
      <div className="flex items-center gap-2.5 mb-6 border-b border-natural-border pb-4">
        <div className="p-2 bg-natural-accent/10 text-natural-accent rounded-xl animate-pulse">
          <Heart className="w-5 h-5 fill-current" />
        </div>
        <div>
          <h2 id="fav-sec-title" className="text-xl font-bold text-natural-heading">
            ❤️ আপনার পছন্দের বিশেষ দিনসমূহ (Bookmarked Days)
          </h2>
          <p className="text-xs text-natural-text/70">আপনার সংরক্ষিত গুরুত্বপূর্ণ দিবসসমূহ ও শুভেচ্ছা কার্ড</p>
        </div>
      </div>

      {favoriteEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {favoriteEvents.map((e) => (
            <div
              key={e.id}
              className="p-4 bg-natural-aside/20 hover:bg-natural-aside/40 border border-natural-border/60 hover:border-natural-border transition-all rounded-2xl flex items-start justify-between gap-4 group shadow-sm"
            >
              <div className="flex-1 min-w-0">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${categoryMeta[e.category]?.color || ""}`}>
                  {categoryMeta[e.category]?.labelBn}
                </span>
                <h3 className="text-base font-bold text-natural-heading mt-2 truncate">{e.titleBn}</h3>
                <p className="text-[11px] text-natural-text/50 mt-0.5 font-medium">তারিখ: {e.date}</p>
                
                <button
                  onClick={() => handleFavoriteClick(e)}
                  className="mt-3 text-xs font-bold text-natural-accent hover:text-natural-primary flex items-center gap-1 group/btn cursor-pointer"
                >
                  <span>ক্যালেন্ডারে দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              <button
                id={`rm-fav-btn-${e.id}`}
                onClick={() => onToggleFavorite(e.id)}
                className="p-2 bg-natural-aside/50 hover:bg-natural-accent/10 hover:text-natural-accent text-natural-text/70 rounded-xl transition-all cursor-pointer"
                title="পছন্দ তালিকা থেকে সরান"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <Heart className="w-12 h-12 text-natural-border mx-auto mb-3" />
          <p className="text-sm font-semibold text-natural-text mb-1">পছন্দ তালিকায় কোনো বিশেষ দিন যোগ করা হয়নি।</p>
          <p className="text-xs text-natural-text/60">দিবস বিবরণী থেকে ❤️ আইকনে ক্লিক করে আপনার পছন্দের দিন সংরক্ষণ করতে পারেন।</p>
        </div>
      )}
    </div>
  );
};
