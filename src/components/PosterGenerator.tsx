import React, { useRef, useState, useEffect } from "react";
import { 
  Download, 
  Sparkles, 
  RefreshCw, 
  Type, 
  Palette, 
  Maximize2, 
  User, 
  Image as ImageIcon,
  Check
} from "lucide-react";
import { SpecialDayEvent } from "../types";
import { Language, t, getEventTitle, getEventWishes } from "../lib/translations";

interface PosterGeneratorProps {
  event: SpecialDayEvent | null;
  language: Language;
}

interface PresetGradient {
  name: string;
  start: string;
  end: string;
  text: string;
  accent: string;
}

const presets: PresetGradient[] = [
  { name: "উজ্জ্বল সূর্যমুখী", start: "#fff7ed", end: "#fed7aa", text: "#431407", accent: "#ea580c" },
  { name: "অভিজাত গোধূলি", start: "#1e1b4b", end: "#311042", text: "#ffffff", accent: "#fbbf24" },
  { name: "সবুজ প্রকৃতি", start: "#f0fdf4", end: "#bbf7d0", text: "#14532d", accent: "#16a34a" },
  { name: "শান্ত সমুদ্র", start: "#ecfeff", end: "#cffafe", text: "#083344", accent: "#0d9488" },
  { name: "রাজকীয় সিঁদুর", start: "#fef2f2", end: "#fee2e2", text: "#7f1d1d", accent: "#dc2626" },
  { name: "কসমিক ব্লু", start: "#0f172a", end: "#1e293b", text: "#f8fafc", accent: "#38bdf8" },
];

export const PosterGenerator: React.FC<PosterGeneratorProps> = ({ event, language }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // States
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16">("1:1");
  const [selectedPreset, setSelectedPreset] = useState<PresetGradient>(presets[1]);
  const [customStart, setCustomStart] = useState(presets[1].start);
  const [customEnd, setCustomEnd] = useState(presets[1].end);
  const [customTextCol, setCustomTextCol] = useState(presets[1].text);
  const [customAccent, setCustomAccent] = useState(presets[1].accent);

  const [posterTitle, setPosterTitle] = useState("");
  const [posterQuote, setPosterQuote] = useState("");
  const [signature, setSignature] = useState("");
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState("");

  // Sync state with selected event
  useEffect(() => {
    if (event) {
      setPosterTitle(getEventTitle(event, language));
      const wishes = getEventWishes(event, language);
      setPosterQuote(wishes[0] || "");
      
      // Select appropriate theme based on category
      let matchedPreset = presets[1]; // default twilight
      if (event.category === "poet" || event.category === "writer") {
        matchedPreset = presets[0]; // warm sunflower
      } else if (event.category === "west_bengal" || event.category === "international") {
        matchedPreset = presets[3]; // ocean/teal
      } else if (event.category === "freedom_fighter" || event.category === "national") {
        matchedPreset = presets[4]; // vermilion/red accent
      } else if (event.category === "religious") {
        matchedPreset = presets[1]; // royal deep
      }
      
      setSelectedPreset(matchedPreset);
      setCustomStart(matchedPreset.start);
      setCustomEnd(matchedPreset.end);
      setCustomTextCol(matchedPreset.text);
      setCustomAccent(matchedPreset.accent);
    } else {
      setPosterTitle(t("appTitle", language));
      setPosterQuote(t("tipText", language));
    }
  }, [event, language]);

  // Handle Preset Change
  const handlePresetSelect = (preset: PresetGradient) => {
    setSelectedPreset(preset);
    setCustomStart(preset.start);
    setCustomEnd(preset.end);
    setCustomTextCol(preset.text);
    setCustomAccent(preset.accent);
  };

  // Helper to wrap text for canvas
  const wrapText = (
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number
  ) => {
    const words = text.split(""); // Split by characters for Bengali compatibility
    let line = "";
    let lines: string[] = [];

    // Let's split by spaces first, then check if words are too long
    const spaceWords = text.split(" ");
    for (let n = 0; n < spaceWords.length; n++) {
      let testLine = line + spaceWords[n] + " ";
      let metrics = ctx.measureText(testLine);
      let testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        lines.push(line.trim());
        line = spaceWords[n] + " ";
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    // Draw the wrapped lines
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, y + i * lineHeight);
    }
    return lines.length * lineHeight;
  };

  // Render Poster to Canvas
  const drawPoster = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions based on aspect ratio
    let width = 1080;
    let height = 1080;

    if (aspectRatio === "16:9") {
      width = 1200;
      height = 630;
    } else if (aspectRatio === "9:16") {
      width = 1080;
      height = 1920;
    }

    canvas.width = width;
    canvas.height = height;

    // 1. Draw Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, customStart);
    gradient.addColorStop(1, customEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Draw Decorative Borders
    ctx.strokeStyle = customAccent;
    ctx.lineWidth = width * 0.015; // responsive border
    ctx.strokeRect(width * 0.03, width * 0.03, width - width * 0.06, height - width * 0.06);

    // Subtle inner border
    ctx.strokeStyle = customTextCol;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    ctx.strokeRect(width * 0.04, width * 0.04, width - width * 0.08, height - width * 0.08);
    ctx.globalAlpha = 1.0;

    // Decorative corner accents (Traditional Bengali Alpona style corners)
    const drawCornerAccent = (cx: number, cy: number, rx: number, ry: number) => {
      ctx.save();
      ctx.strokeStyle = customAccent;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, rx, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    };

    // Draw standard elegant overlay shapes
    ctx.save();
    ctx.fillStyle = customAccent;
    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.arc(width * 0.1, height * 0.1, width * 0.3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.9, height * 0.9, width * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 3. Write App Branding Header
    ctx.textAlign = "center";
    ctx.fillStyle = customAccent;
    ctx.font = `bold ${width * 0.02}px sans-serif`;
    ctx.fillText("📅 বিশেষ দিন ক্যালেন্ডার", width / 2, height * 0.08);

    // 4. Draw Title
    ctx.fillStyle = customTextCol;
    ctx.font = `bold ${width * 0.055}px system-ui, -apple-system, sans-serif`;
    const titleY = height * 0.25;
    ctx.fillText(posterTitle, width / 2, titleY);

    // Divider line below title
    ctx.strokeStyle = customAccent;
    ctx.lineWidth = width * 0.005;
    ctx.beginPath();
    ctx.moveTo(width * 0.4, titleY + width * 0.03);
    ctx.lineTo(width * 0.6, titleY + width * 0.03);
    ctx.stroke();

    // 5. Draw Quote / Wish content (Large & Central)
    ctx.fillStyle = customTextCol;
    ctx.globalAlpha = 0.9;
    ctx.font = `italic ${width * 0.035}px Georgia, serif, system-ui`;
    
    const quoteY = height * 0.45;
    const maxQuoteWidth = width * 0.8;
    const lineHeight = width * 0.055;
    wrapText(ctx, posterQuote, width / 2, quoteY, maxQuoteWidth, lineHeight);
    ctx.globalAlpha = 1.0;

    // 6. Signature (Bottom-center)
    if (signature.trim()) {
      ctx.fillStyle = customAccent;
      ctx.font = `bold ${width * 0.03}px sans-serif`;
      const sigText = `শুভকামনায়: ${signature}`;
      ctx.fillText(sigText, width / 2, height * 0.85);
    } else {
      ctx.fillStyle = customTextCol;
      ctx.globalAlpha = 0.5;
      ctx.font = `${width * 0.022}px sans-serif`;
      ctx.fillText("www.SpecialDayCalendar.in", width / 2, height * 0.88);
      ctx.globalAlpha = 1.0;
    }
  };

  // Redraw when properties change
  useEffect(() => {
    drawPoster();
  }, [aspectRatio, customStart, customEnd, customTextCol, customAccent, posterTitle, posterQuote, signature]);

  // Download logic
  const handleDownload = (format: "png" | "jpg") => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const mimeType = format === "png" ? "image/png" : "image/jpeg";
    const dataUrl = canvas.toDataURL(mimeType, 1.0);
    const link = document.createElement("a");
    link.download = `special_day_poster_${event?.id || "custom"}.${format}`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // AI Design Concept Generation
  const generateAiConcept = async () => {
    if (!event) return;
    setIsAiLoading(true);
    setAiMessage(language === "en" ? "Gemini is designing your poster..." : language === "hi" ? "Gemini आपका पोस्टर डिजाइन कर रहा है..." : "Gemini আপনার পোস্টার ডিজাইন করছে...");
    try {
      const response = await fetch("/api/gemini/generate-poster-concept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventTitle: getEventTitle(event, language) }),
      });
      if (!response.ok) throw new Error("AI request failed");
      const data = await response.json();
      
      // Set concept properties
      const quote = language === "en" ? data.quoteEn : language === "hi" ? data.quoteHi : data.quoteBn;
      if (quote) setPosterQuote(quote);
      if (data.bgStartColor) setCustomStart(data.bgStartColor);
      if (data.bgEndColor) setCustomEnd(data.bgEndColor);
      if (data.textColor) setCustomTextCol(data.textColor);
      if (data.accentColor) setCustomAccent(data.accentColor);
      
      setAiMessage(language === "en" ? "Gemini updated the poster successfully! ✨" : language === "hi" ? "Gemini ने सफलतापूर्वक पोस्टर अपडेट किया! ✨" : "Gemini সফলভাবে পোস্টার আপডেট করেছে! ✨");
      setTimeout(() => setAiMessage(""), 4000);
    } catch (e: any) {
      console.error(e);
      setAiMessage(language === "en" ? "Failed to load design. Please try again." : language === "hi" ? "डिजाइन लोड करने में विफल। कृपया पुन: प्रयास करें।" : "ডিজাইন লোড করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div id="ai-poster-card" className="bg-white rounded-3xl border border-natural-border shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 id="poster-sec-title" className="text-xl font-bold text-natural-heading flex items-center gap-2">
            {t("posterMakerTitle", language)}
          </h2>
          <p className="text-xs text-natural-text/70">{t("posterMakerSub", language)}</p>
        </div>

        {event && (
          <button
            id="ai-concept-btn"
            disabled={isAiLoading}
            onClick={generateAiConcept}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-natural-accent to-natural-primary text-white rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isAiLoading ? (language === "en" ? "Designing..." : language === "hi" ? "बना रहा है..." : "তৈরি হচ্ছে...") : (language === "en" ? "AI Design" : language === "hi" ? "AI डिजाइन" : "AI ডিজাইন করুন")}
          </button>
        )}
      </div>

      {aiMessage && (
        <div className="mb-4 p-3 bg-natural-aside/80 text-natural-heading border border-natural-border rounded-xl text-xs font-medium animate-pulse">
          {aiMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Canvas Display */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-natural-aside/10 rounded-2xl p-4 border border-natural-border relative group">
          <canvas
            ref={canvasRef}
            className="max-w-full rounded-xl shadow-lg border border-natural-border/40 bg-white"
            style={{ 
              maxHeight: "450px", 
              objectFit: "contain",
              aspectRatio: aspectRatio === "1:1" ? "1/1" : aspectRatio === "16:9" ? "16/9" : "9/16"
            }}
          />
          <div className="mt-3 text-natural-text/50 text-xs flex items-center gap-1">
            <Maximize2 className="w-3 h-3 text-natural-accent" />
            <span>{language === "en" ? "Super HD 1080p download preview" : language === "hi" ? "सुपर एचडी 1080p डाउनलोड पूर्वावलोकन" : "সুপার হাই-ডেফিনিশন ১০৮০p ডাউনলোড প্রিভিউ"}</span>
          </div>
        </div>

        {/* Controls Grid */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Size Selectors */}
          <div>
            <label className="text-xs font-bold text-natural-text/60 uppercase tracking-wider mb-2 block">
              {t("aspectRatioLabel", language)}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                id="ratio-1-1"
                onClick={() => setAspectRatio("1:1")}
                className={`py-2 px-3 border rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  aspectRatio === "1:1"
                    ? "border-natural-accent bg-natural-accent/10 text-natural-heading font-bold"
                    : "border-natural-border text-natural-text hover:bg-natural-aside/40"
                }`}
              >
                <span className="w-4 h-4 border border-current rounded-sm" />
                <span>{t("square", language)}</span>
              </button>
              <button
                id="ratio-16-9"
                onClick={() => setAspectRatio("16:9")}
                className={`py-2 px-3 border rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  aspectRatio === "16:9"
                    ? "border-natural-accent bg-natural-accent/10 text-natural-heading font-bold"
                    : "border-natural-border text-natural-text hover:bg-natural-aside/40"
                }`}
              >
                <span className="w-5 h-3 border border-current rounded-sm" />
                <span>{t("banner", language)}</span>
              </button>
              <button
                id="ratio-9-16"
                onClick={() => setAspectRatio("9:16")}
                className={`py-2 px-3 border rounded-xl text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                  aspectRatio === "9:16"
                    ? "border-natural-accent bg-natural-accent/10 text-natural-heading font-bold"
                    : "border-natural-border text-natural-text hover:bg-natural-aside/40"
                }`}
              >
                <span className="w-3 h-5 border border-current rounded-sm" />
                <span>{t("status", language)}</span>
              </button>
            </div>
          </div>

          {/* Background Gradients Preset */}
          <div>
            <label className="text-xs font-bold text-natural-text/60 uppercase tracking-wider mb-2 block">
              {t("selectTheme", language)}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {presets.map((preset, index) => {
                const isSelected = selectedPreset.name === preset.name;
                return (
                  <button
                    key={index}
                    onClick={() => handlePresetSelect(preset)}
                    className={`h-9 rounded-lg border text-[11px] font-medium flex items-center justify-between px-2 relative transition-all cursor-pointer ${
                      isSelected ? "border-natural-heading ring-2 ring-natural-accent" : "border-natural-border"
                    }`}
                    style={{ background: `linear-gradient(135deg, ${preset.start}, ${preset.end})` }}
                  >
                    <span style={{ color: preset.text }}>আভা</span>
                    {isSelected && (
                      <Check className="w-3 h-3 text-white absolute right-1 drop-shadow-sm" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Color Picker Toggle */}
            <div className="mt-3 flex gap-2">
              <div className="flex-1">
                <span className="text-[10px] text-natural-text/50 block mb-1">{language === "en" ? "Start Color" : language === "hi" ? "प्रारंभ रंग" : "স্টার্ট রঙ"}</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={customStart}
                    onChange={(e) => setCustomStart(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border border-natural-border"
                  />
                  <span className="text-xs font-mono">{customStart}</span>
                </div>
              </div>
              <div className="flex-1">
                <span className="text-[10px] text-natural-text/50 block mb-1">{language === "en" ? "End Color" : language === "hi" ? "अंतिम रंग" : "এন্ড রঙ"}</span>
                <div className="flex items-center gap-1.5">
                  <input
                    type="color"
                    value={customEnd}
                    onChange={(e) => setCustomEnd(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border border-natural-border"
                  />
                  <span className="text-xs font-mono">{customEnd}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Controls */}
          <div>
            <label className="text-xs font-bold text-natural-text/60 uppercase tracking-wider mb-2 block">
              {language === "en" ? "Edit Text & Greeting" : language === "hi" ? "टेक्स्ट और शुभकामनाएं बदलें" : "লেখা ও শুভেচ্ছা এডিট করুন"}
            </label>
            <div className="flex flex-col gap-2">
              <input
                id="edit-poster-title"
                type="text"
                value={posterTitle}
                onChange={(e) => setPosterTitle(e.target.value)}
                placeholder="টাইটেল লিখুন"
                className="w-full px-3 py-2 border border-natural-border bg-white text-natural-text rounded-xl text-xs focus:ring-1 focus:ring-natural-accent outline-none"
              />
              <textarea
                id="edit-poster-quote"
                value={posterQuote}
                onChange={(e) => setPosterQuote(e.target.value)}
                placeholder="শুভেচ্ছা বার্তা বা উদ্ধৃতি লিখুন"
                rows={3}
                className="w-full px-3 py-2 border border-natural-border bg-white text-natural-text rounded-xl text-xs focus:ring-1 focus:ring-natural-accent outline-none resize-none"
              />
            </div>
          </div>

          {/* Signature Name */}
          <div>
            <label className="text-xs font-bold text-natural-text/60 uppercase tracking-wider mb-2 block flex items-center gap-1">
              <User className="w-3 h-3 text-natural-text/50" />
              <span>{language === "en" ? "Your Name (Signature)" : language === "hi" ? "आपका नाम (हस्ताक्षर)" : "আপনার নাম দিন (সিগনেচার)"}</span>
            </label>
            <input
              id="edit-poster-signature"
              type="text"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder={t("yourNamePlaceholder", language)}
              className="w-full px-3 py-2 border border-natural-border bg-white text-natural-text rounded-xl text-xs focus:ring-1 focus:ring-natural-accent outline-none"
            />
          </div>

          {/* Download buttons */}
          <div className="mt-2 flex gap-2">
            <button
              id="dl-png"
              onClick={() => handleDownload("png")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-natural-primary hover:bg-natural-primary/90 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>{language === "en" ? "PNG Download" : language === "hi" ? "PNG डाउनलोड" : "PNG ডাউনলোড"}</span>
            </button>
            <button
              id="dl-jpg"
              onClick={() => handleDownload("jpg")}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-natural-accent hover:bg-natural-accent/90 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>{language === "en" ? "JPG Download" : language === "hi" ? "JPG डाउनलोड" : "JPG ডাউনলোড"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
