import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Globe, HelpCircle } from "lucide-react";
import { Language, uiTranslations } from "../lib/translations";

interface LanguageSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLanguage: (lang: Language) => void;
  currentLanguage: Language;
}

export const LanguageSelectionModal: React.FC<LanguageSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelectLanguage,
  currentLanguage,
}) => {
  const [selected, setSelected] = useState<Language>(currentLanguage);

  const handleConfirm = () => {
    onSelectLanguage(selected);
    onClose();
  };

  const languagesList: { code: Language; name: string; nativeName: string; flag: string; themeColor: string; bgLight: string }[] = [
    {
      code: "bn",
      name: "Bengali",
      nativeName: "বাংলা",
      flag: "🇧🇩",
      themeColor: "border-emerald-500 text-emerald-600",
      bgLight: "bg-emerald-50/40",
    },
    {
      code: "en",
      name: "English",
      nativeName: "English",
      flag: "🇬🇧",
      themeColor: "border-sky-500 text-sky-600",
      bgLight: "bg-sky-50/40",
    },
    {
      code: "hi",
      name: "Hindi",
      nativeName: "हिन्दी",
      flag: "🇮🇳",
      themeColor: "border-orange-500 text-orange-600",
      bgLight: "bg-orange-50/40",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              // Only allow closing if there is already a saved language preference
              if (localStorage.getItem("pref_lang")) {
                onClose();
              }
            }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative bg-white rounded-3xl border border-gray-100 shadow-2xl w-full max-w-md overflow-hidden p-6 md:p-8 flex flex-col gap-6"
          >
            {/* Header Icon */}
            <div className="flex flex-col items-center text-center gap-2">
              <div className="w-14 h-14 bg-natural-accent/10 rounded-2xl flex items-center justify-center text-natural-accent mb-2">
                <Globe className="w-7 h-7" />
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-natural-heading tracking-tight leading-snug">
                {uiTranslations.modalTitle[selected]}
              </h2>
              <p className="text-xs md:text-sm text-natural-text/60 font-medium">
                {uiTranslations.modalSubtitle[selected]}
              </p>
            </div>

            {/* Language Selection Grid */}
            <div className="flex flex-col gap-3">
              {languagesList.map((lang) => {
                const isCurrent = selected === lang.code;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setSelected(lang.code)}
                    className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer group ${
                      isCurrent
                        ? `${lang.bgLight} border-2 ${lang.themeColor.split(" ")[0]}`
                        : "bg-gray-50/40 hover:bg-gray-50 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <span className="text-3xl filter drop-shadow-sm select-none">{lang.flag}</span>
                      <div className="flex flex-col">
                        <span className={`text-base font-bold transition-colors ${
                          isCurrent ? "text-natural-heading" : "text-natural-text"
                        }`}>
                          {lang.nativeName}
                        </span>
                        <span className="text-[10px] md:text-xs text-natural-text/50 font-semibold tracking-wide uppercase">
                          {lang.name}
                        </span>
                      </div>
                    </div>

                    {isCurrent && (
                      <div className="w-6 h-6 bg-natural-accent rounded-full flex items-center justify-center text-white shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Confirm Action Button */}
            <button
              onClick={handleConfirm}
              className="w-full py-4 bg-natural-primary hover:bg-natural-primary/95 text-white rounded-2xl font-bold text-sm shadow-md shadow-natural-primary/10 hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{uiTranslations.modalConfirm[selected]}</span>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
