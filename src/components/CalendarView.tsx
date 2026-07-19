import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Award, Star } from "lucide-react";
import { SpecialDayEvent } from "../types";
import { categoryMeta } from "../data/defaultEvents";
import { Language, uiTranslations, getCategoryLabel, getEventTitle } from "../lib/translations";

interface CalendarViewProps {
  events: SpecialDayEvent[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  favorites: string[];
  language: Language;
}

const enMonths = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  selectedDate,
  onSelectDate,
  favorites,
  language
}) => {
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth()); // 0-indexed

  // Get total days in current month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const totalDays = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Navigate months
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Check if a grid day has events
  const getEventsForDay = (day: number): SpecialDayEvent[] => {
    const monthStr = String(currentMonth + 1).padStart(2, "0");
    const dayStr = String(day).padStart(2, "0");
    const targetKey = `${monthStr}-${dayStr}`;

    return events.filter((e) => {
      // Matches MM-DD
      if (e.date.length === 5) {
        return e.date === targetKey;
      }
      // Matches YYYY-MM-DD
      return e.date.substring(5) === targetKey;
    });
  };

  // Generate calendar cells
  const renderDays = () => {
    const cells = [];
    
    // Empty cells before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      cells.push(
        <div 
          key={`empty-${i}`} 
          className="h-10 sm:h-12 md:h-14 bg-gray-50/50 border border-gray-100 rounded-lg opacity-30"
        />
      );
    }

    // Days in current month
    for (let day = 1; day <= totalDays; day++) {
      const dayEvents = getEventsForDay(day);
      const isSelected = 
        selectedDate.getDate() === day && 
        selectedDate.getMonth() === currentMonth && 
        selectedDate.getFullYear() === currentYear;
      
      const isToday = 
        new Date().getDate() === day && 
        new Date().getMonth() === currentMonth && 
        new Date().getFullYear() === currentYear;

      const hasFavorite = dayEvents.some(de => favorites.includes(de.id));

      cells.push(
        <button
          key={`day-${day}`}
          id={`calendar-day-${day}`}
          onClick={() => onSelectDate(new Date(currentYear, currentMonth, day))}
          className={`h-10 sm:h-12 md:h-14 relative flex flex-col items-center justify-between p-1 border transition-all duration-200 rounded-xl group hover:border-natural-accent hover:bg-natural-accent/5 cursor-pointer ${
            isSelected 
              ? "bg-gradient-to-br from-natural-accent to-natural-primary border-natural-accent text-white shadow-md shadow-natural-accent/20" 
              : isToday 
                ? "bg-natural-accent/15 border-natural-accent/40 text-natural-heading font-bold" 
                : "bg-white border-natural-border/30 text-natural-text"
          }`}
        >
          {/* Day number */}
          <span className={`text-xs sm:text-sm md:text-base font-semibold ${isSelected ? "text-white" : ""}`}>
            {day}
          </span>

          {/* Dots & badges */}
          <div className="flex flex-wrap justify-center gap-0.5 max-w-full overflow-hidden pb-0.5">
            {dayEvents.map((e, index) => {
              if (index >= 3) return null; // limit to 3 dots
              const meta = categoryMeta[e.category] || { color: "bg-gray-400" };
              // extract color class for dot
              const dotColor = meta.color.split(" ")[0].replace("bg-", "bg-");
              return (
                <span
                  key={e.id}
                  title={getEventTitle(e, language)}
                  className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : dotColor} animate-pulse`}
                />
              );
            })}
            {dayEvents.length > 3 && (
              <span className={`text-[8px] leading-none font-bold ${isSelected ? "text-white" : "text-gray-500"}`}>
                +{dayEvents.length - 3}
              </span>
            )}
            
            {hasFavorite && !isSelected && (
              <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500 absolute top-1 right-1" />
            )}
          </div>
        </button>
      );
    }

    return cells;
  };

  const monthNames = uiTranslations.monthTitleBn[language];
  const dayNames = uiTranslations.daysShort[language];

  return (
    <div id="calendar-card" className="bg-white rounded-2xl sm:rounded-3xl border border-natural-border shadow-sm p-3 sm:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-natural-accent" />
            <h2 id="calendar-header-bn" className="text-base sm:text-xl font-bold text-natural-heading tracking-tight">
              {monthNames[currentMonth]} {currentYear}
            </h2>
          </div>
          {language !== "en" && (
            <span className="text-[10px] sm:text-xs text-natural-text/50 font-medium pl-5 sm:pl-7">
              {enMonths[currentMonth]} {currentYear}
            </span>
          )}
        </div>

        <div className="flex gap-1">
          <button
            id="prev-month-btn"
            onClick={handlePrevMonth}
            className="p-1.5 sm:p-2 border border-natural-border rounded-xl hover:bg-natural-aside/40 text-natural-text transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
          <button
            id="next-month-btn"
            onClick={handleNextMonth}
            className="p-1.5 sm:p-2 border border-natural-border rounded-xl hover:bg-natural-aside/40 text-natural-text transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
          </button>
        </div>
      </div>

      {/* Weekday Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1.5 sm:mb-2">
        {dayNames.map((day, idx) => (
          <div
            key={idx}
            className={`text-[10px] sm:text-xs font-bold py-1 sm:py-1.5 rounded-lg ${
              idx === 0 
                ? "text-red-600 bg-red-50/70" 
                : idx === 6 
                  ? "text-natural-accent bg-natural-accent/10" 
                  : "text-natural-text/70 bg-natural-aside/40"
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {renderDays()}
      </div>

      {/* Legend */}
      <div className="mt-5 pt-4 border-t border-natural-border/60 flex flex-wrap gap-2 text-[11px] justify-center text-natural-text/70">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          <span>{getCategoryLabel("national", language)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>{getCategoryLabel("international", language)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>{getCategoryLabel("west_bengal", language)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <span>{language === "en" ? "Poet/Writer" : language === "hi" ? "कवि/साहित्यकार" : "কভি/সাহিত্যিক"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>{getCategoryLabel("freedom_fighter", language)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>{getCategoryLabel("religious", language)}</span>
        </div>
      </div>
    </div>
  );
};
