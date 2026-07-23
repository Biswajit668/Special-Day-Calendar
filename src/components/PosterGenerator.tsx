import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Download, 
  RefreshCw, 
  Image as ImageIcon, 
  AlertCircle, 
  Copy, 
  Share2, 
  Wand2,
  Maximize2,
  User
} from "lucide-react";
import { SpecialDayEvent } from "../types";
import { Language, t, getEventTitle, getEventDescription } from "../lib/translations";

interface PosterGeneratorProps {
  event: SpecialDayEvent | null;
  language: Language;
  user?: any | null;
  onGoogleLogin?: () => void;
}

interface GeneratedImageItem {
  id: string;
  url: string;
  prompt: string;
  timestamp: string;
  aspectRatio: string;
}

export const PosterGenerator: React.FC<PosterGeneratorProps> = ({ event, language, user, onGoogleLogin }) => {
  // 1. Image Generation Controls State
  const [prompt, setPrompt] = useState<string>("");
  const [aspectRatio, setAspectRatio] = useState<"1:1" | "16:9" | "9:16" | "4:3">("1:1");
  const [userName, setUserName] = useState<string>("");

  // Pre-fill user name when Google login user is present
  useEffect(() => {
    if (user?.displayName && !userName) {
      setUserName(user.displayName);
    }
  }, [user]);
  
  // 2. Execution & Output States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  
  // 3. Session History / Gallery
  const [gallery, setGallery] = useState<GeneratedImageItem[]>([]);

  // Sync prompt with selected event automatically
  useEffect(() => {
    if (event) {
      const title = getEventTitle(event, language);
      const desc = getEventDescription(event, language);
      
      let styleHint = "cultural festive artwork with decorative lighting and traditional elements";
      if (event.category === "poet" || event.category === "writer") {
        styleHint = "artistic portrait style with book, pen, literary aesthetic and warm ambient background";
      } else if (event.category === "freedom_fighter" || event.category === "national") {
        styleHint = "patriotic Indian celebration poster with tricolor saffron white green accents and majestic dignity";
      } else if (event.category === "west_bengal") {
        styleHint = "traditional Bengali celebration poster with delicate Alpona floor patterns, marigold flowers, and cultural motifs";
      } else if (event.category === "religious") {
        styleHint = "glowing spiritual festival artwork with diyas, oil lamps, floral decorations, and auspicious atmosphere";
      }

      const generatedPrompt = `High quality festival greeting poster for "${title}". Description: ${desc}. Style: ${styleHint}. Vibrant colors, highly detailed, artistic 8k resolution.`;
      setPrompt(generatedPrompt);
    } else {
      setPrompt("A vibrant cultural celebration poster with marigold flowers, traditional Bengali Alpona artwork, oil lamps, and festive decorations, highly detailed 8k.");
    }
  }, [event, language]);

  // Helper to append user name greeting to prompt
  const buildFullPrompt = () => {
    let full = prompt;
    if (userName.trim()) {
      full += `, featuring elegant festive text banner with "Greetings from ${userName.trim()}" written clearly on the poster`;
    }
    return full;
  };

  // AI Image Generation Execution
  const handleGenerateImage = async () => {
    // If user is not logged in, initiate Google Login immediately
    if (!user) {
      if (onGoogleLogin) {
        onGoogleLogin();
      } else {
        setErrorMessage(
          language === "bn" 
            ? "ছবি তৈরি করতে অনুগ্রহ করে গুগল দিয়ে লগইন করুন।" 
            : language === "hi" 
              ? "चित्र बनाने के लिए कृपया गूगल से लॉगिन करें।" 
              : "Please login with Google to generate images."
        );
      }
      return;
    }

    if (!prompt.trim()) {
      setErrorMessage(
        language === "bn" 
          ? "অনুগ্রহ করে ছবির বিবরণ বা প্রম্পট লিখুন।" 
          : language === "hi" 
            ? "कृपया छवि का विवरण दर्ज करें।" 
            : "Please enter an image description."
      );
      return;
    }

    setIsGenerating(true);
    setErrorMessage(null);
    setStatusText(
      language === "bn" 
        ? "Gemini AI-তে কানেক্ট হচ্ছে..." 
        : language === "hi" 
          ? "Gemini AI से कनेक्ट हो रहा है..." 
          : "Connecting to Gemini AI..."
    );

    const fullPrompt = buildFullPrompt();

    try {
      setStatusText(
        language === "bn" 
          ? "Gemini AI সার্ভিসেসের মাধ্যমে ছবি রেন্ডার করা হচ্ছে..." 
          : language === "hi" 
            ? "Gemini AI सेवाओं के माध्यम से चित्र रेंडर किया जा रहा है..." 
            : "Rendering image via Gemini AI service..."
      );

      let imageUrlResult: string | null = null;

      // Try Backend API route first
      try {
        const proxyRes = await fetch("/api/gemini/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: fullPrompt,
            userUid: user.uid,
            aspectRatio: aspectRatio,
            userName: userName.trim()
          })
        });

        const contentType = proxyRes.headers.get("content-type") || "";

        if (proxyRes.ok && contentType.includes("application/json")) {
          const proxyData = await proxyRes.json();
          if (proxyData.imageUrl) {
            imageUrlResult = proxyData.imageUrl;
          }
        } else if (contentType.includes("application/json")) {
          const errData = await proxyRes.json();
          console.warn("Backend API error response:", errData);
        } else {
          console.warn("Backend API not returning JSON (likely static host like GitHub Pages). Switching to client AI engine...");
        }
      } catch (fetchErr) {
        console.warn("Backend API call failed, switching to client AI engine...", fetchErr);
      }

      // Fallback: If backend route is absent or failed (e.g. static host on GitHub Pages), generate client-side AI image
      if (!imageUrlResult) {
        setStatusText(
          language === "bn" 
            ? "ক্লায়েন্ট AI এঞ্জিনের মাধ্যমে এইচডি ছবি পোস্টার তৈরি হচ্ছে..." 
            : language === "hi" 
              ? "क्लाइंट AI इंजन के माध्यम से चित्र रेंडर किया जा रहा है..." 
              : "Generating high-quality poster via client AI engine..."
        );

        let width = 1024;
        let height = 1024;
        if (aspectRatio === "16:9") { width = 1280; height = 720; }
        else if (aspectRatio === "9:16") { width = 720; height = 1280; }
        else if (aspectRatio === "4:3") { width = 1024; height = 768; }

        const seed = Math.floor(Math.random() * 1000000);
        const encodedPrompt = encodeURIComponent(fullPrompt);
        const fallbackUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&model=flux`;

        // Preload image to ensure valid rendering
        const img = new Image();
        img.src = fallbackUrl;
        await new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true);
          setTimeout(() => resolve(true), 12000); // 12s safety timeout
        });

        imageUrlResult = fallbackUrl;
      }

      if (imageUrlResult) {
        setActiveImage(imageUrlResult);
        
        // Add to history gallery
        const newItem: GeneratedImageItem = {
          id: Date.now().toString(),
          url: imageUrlResult,
          prompt: fullPrompt,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          aspectRatio: aspectRatio
        };
        setGallery((prev) => [newItem, ...prev.slice(0, 9)]);
      } else {
        throw new Error("AI engine did not return image data. Please try again.");
      }

    } catch (err: any) {
      console.error("Gemini AI Image Generation Error:", err);
      setErrorMessage(
        err.message || (
          language === "bn" 
            ? "ছবি তৈরিতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।" 
            : language === "hi" 
              ? "चित्र बनाने में समस्या हुई। कृपया पुनः प्रयास करें।" 
              : "Failed to generate image. Please try again."
        )
      );
    } finally {
      setIsGenerating(false);
      setStatusText("");
    }
  };

  // Download Generated Image with optional Name Banner Overlay
  const handleDownloadImage = async (format: "png" | "jpg") => {
    if (!activeImage) return;

    if (userName.trim()) {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = activeImage;
        await new Promise((resolve) => {
          img.onload = () => resolve(true);
          img.onerror = () => resolve(true);
          setTimeout(() => resolve(true), 4000);
        });

        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || 1024;
        canvas.height = img.naturalHeight || 1024;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // 1. Base Image
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // 2. Bottom Gradient Ribbon
          const bannerHeight = Math.max(60, Math.floor(canvas.height * 0.085));
          const gradient = ctx.createLinearGradient(0, canvas.height - bannerHeight, 0, canvas.height);
          gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
          gradient.addColorStop(0.3, "rgba(0, 0, 0, 0.65)");
          gradient.addColorStop(1, "rgba(0, 0, 0, 0.9)");

          ctx.fillStyle = gradient;
          ctx.fillRect(0, canvas.height - bannerHeight, canvas.width, bannerHeight);

          // 3. Name Text
          const fontSize = Math.max(20, Math.floor(canvas.height * 0.034));
          ctx.font = `bold ${fontSize}px sans-serif`;
          ctx.fillStyle = "#FDE047"; // Warm gold text
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const prefix = language === "bn" ? "শুভেচ্ছান্তে: " : language === "hi" ? "शुभकामनाएं: " : "Best Wishes from: ";
          const text = `✨ ${prefix}${userName.trim()} ✨`;
          ctx.fillText(text, canvas.width / 2, canvas.height - (bannerHeight / 2));

          const dataUrl = canvas.toDataURL(format === "jpg" ? "image/jpeg" : "image/png", 0.95);
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `poster_${userName.trim().replace(/\s+/g, '_')}_${Date.now()}.${format}`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return;
        }
      } catch (err) {
        console.warn("Canvas overlay failed, falling back to direct download:", err);
      }
    }

    const link = document.createElement("a");
    link.href = activeImage;
    link.download = `gemini_ai_image_${event?.id || "custom"}_${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Image Data / URL
  const handleCopyImageLink = () => {
    if (!activeImage) return;
    navigator.clipboard.writeText(activeImage);
    alert(
      language === "bn" 
        ? "ইমেজ ডেটা ক্লিপবোর্ডে কপি করা হয়েছে!" 
        : language === "hi" 
          ? "इमेज डेटा क्लिपबोर्ड पर कॉपी हो गया!" 
          : "Image data copied to clipboard!"
    );
  };

  return (
    <div id="direct-ai-image-generator" className="bg-white rounded-3xl border border-natural-border shadow-sm p-5 md:p-6 flex flex-col gap-6">
      
      {/* 1. Component Header & Auth Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-natural-border/60 pb-4">
        <div>
          <h2 id="ai-generator-title" className="text-lg sm:text-xl font-bold text-natural-heading flex items-center gap-2">
            <span>🖼️</span>
            <span>{t("posterMakerTitle", language)}</span>
          </h2>
          <p className="text-xs text-natural-text/70 mt-0.5">
            {t("posterMakerSub", language)}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {user ? (
            <div className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold truncate max-w-[160px] sm:max-w-[200px]">
                {user.displayName || user.email}
              </span>
              <span className="text-[10px] text-emerald-700 font-normal">
                ({language === "bn" ? "কানেক্টেড" : "Google Connected"})
              </span>
            </div>
          ) : (
            onGoogleLogin && (
              <button
                onClick={onGoogleLogin}
                className="px-3.5 py-1.5 bg-natural-primary hover:bg-natural-primary/90 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {language === "bn" 
                    ? "ছবি তৈরি করতে লগইন করুন" 
                    : language === "hi" 
                      ? "चित्र बनाने के लिए लॉगिन करें" 
                      : "Login to Generate Image"}
                </span>
              </button>
            )
          )}
        </div>
      </div>

      {/* 2. Login Prompt Banner if not logged in */}
      {!user && (
        <div className="p-4 bg-amber-50/80 border border-amber-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-amber-900">
                {language === "bn" 
                  ? "ছবি তৈরি করতে গুগল লগইন আবশ্যক (Login to Generate Image)" 
                  : language === "hi" 
                    ? "चित्र बनाने के लिए गूगल लॉगिन आवश्यक (Login to Generate Image)" 
                    : "Google Login Required to Generate Image"}
              </h3>
              <p className="text-[11px] text-amber-800/80 mt-0.5">
                {language === "bn"
                  ? "হাই-কোয়ালিটি AI ছবি ফ্রিতে তৈরি করতে আপনার গুগল অ্যাকাউন্ট দিয়ে লগইন করুন।"
                  : language === "hi"
                    ? "उच्च गुणवत्ता वाले AI चित्र मुफ्त में बनाने के लिए अपने गूगल खाते से लॉगिन करें।"
                    : "Login with your Google account to generate high-quality AI images for free."}
              </p>
            </div>
          </div>

          {onGoogleLogin && (
            <button
              onClick={onGoogleLogin}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-xs flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {language === "bn" ? "গুগল দিয়ে লগইন করুন" : language === "hi" ? "गूगल से लॉगिन करें" : "Login with Google"}
              </span>
            </button>
          )}
        </div>
      )}

      {/* 3. Error Banner */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-medium flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-grow">
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      {/* 4. Controls & Input Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Image Prompt & Controls */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          
          {/* Prompt Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-natural-text/60 uppercase tracking-wider flex items-center gap-1">
                <Wand2 className="w-3.5 h-3.5 text-natural-accent" />
                <span>{language === "bn" ? "ছবি বিবরণ (AI Prompt)" : language === "hi" ? "चित्र विवरण (AI Prompt)" : "Image Description Prompt"}</span>
              </label>

              {event && (
                <button
                  type="button"
                  onClick={() => {
                    const title = getEventTitle(event, language);
                    const desc = getEventDescription(event, language);
                    setPrompt(`Festival celebration poster for "${title}". ${desc}. Detailed 8k resolution, vibrant traditional motifs.`);
                  }}
                  className="text-[10px] font-bold text-natural-accent hover:underline"
                >
                  {language === "bn" ? "✨ ইভেন্ট বিবরণ রিসেট" : "✨ Reset to Event"}
                </button>
              )}
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder={language === "bn" ? "এখানে আপনার ছবির বিবরণ লিখুন..." : "Describe the image you want to generate..."}
              className="w-full p-3 bg-white border border-natural-border rounded-2xl text-xs text-natural-text focus:ring-1 focus:ring-natural-accent outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Your Name Input Field */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-natural-text/60 uppercase tracking-wider flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-natural-accent" />
                <span>
                  {language === "bn" 
                    ? "আপনার নাম (ছবিতে ফুট উঠবে)" 
                    : language === "hi" 
                      ? "आपका नाम (चित्र पर प्रदर्शित होगा)" 
                      : "Your Name (Appears on Poster)"}
                </span>
              </label>
              {user?.displayName && userName !== user.displayName && (
                <button
                  type="button"
                  onClick={() => setUserName(user.displayName || "")}
                  className="text-[10px] font-bold text-natural-accent hover:underline"
                >
                  {language === "bn" ? "গুগল নাম ব্যবহার করুন" : "Use Google Name"}
                </button>
              )}
            </div>

            <div className="relative">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={
                  language === "bn" 
                    ? "আপনার নাম লিখুন... (যেমন: বিশ্বজিৎ নস্কর)" 
                    : language === "hi" 
                      ? "अपना नाम लिखें... (जैसे: बिश्वजीत नस्कर)" 
                      : "Enter your name... (e.g. Biswajit Naskar)"
                }
                className="w-full px-3.5 py-2.5 bg-white border border-natural-border rounded-2xl text-xs text-natural-text font-bold focus:ring-1 focus:ring-natural-accent outline-none shadow-xs"
              />
              {userName.trim() && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md font-bold">
                  {language === "bn" ? "ছবিতে সংযুক্ত" : "On Image"}
                </span>
              )}
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div>
            <label className="text-[11px] font-bold text-natural-text/60 uppercase tracking-wider mb-2 block">
              {t("aspectRatioLabel", language)}
            </label>

            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "1:1", label: t("square", language), iconWidth: "w-3.5 h-3.5" },
                { id: "16:9", label: t("banner", language), iconWidth: "w-4 h-2.5" },
                { id: "9:16", label: t("status", language), iconWidth: "w-2.5 h-4" },
                { id: "4:3", label: language === "bn" ? "ল্যান্ডস্কেপ" : "Landscape", iconWidth: "w-4 h-3" }
              ].map((ar) => (
                <button
                  key={ar.id}
                  type="button"
                  onClick={() => setAspectRatio(ar.id as any)}
                  className={`py-2 px-2 rounded-xl text-[10px] font-bold border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    aspectRatio === ar.id
                      ? "bg-natural-accent/15 border-natural-accent text-natural-heading"
                      : "bg-white border-natural-border text-natural-text hover:bg-natural-aside/40"
                  }`}
                >
                  <span className={`${ar.iconWidth} border border-current rounded-xs`} />
                  <span className="truncate">{ar.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            id="generate-ai-image-btn"
            disabled={isGenerating}
            onClick={handleGenerateImage}
            className="w-full py-3.5 bg-gradient-to-r from-natural-accent via-natural-primary to-natural-heading text-white rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 hover:opacity-95"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>{language === "bn" ? "ছবি তৈরি হচ্ছে..." : "Generating Image..."}</span>
              </>
            ) : !user ? (
              <>
                <Sparkles className="w-4 h-4" />
                <span>
                  {language === "bn" 
                    ? "🔑 ছবি তৈরি করতে লগইন করুন (Login to Generate Image)" 
                    : language === "hi" 
                      ? "🔑 चित्र बनाने के लिए लॉगिन करें (Login to Generate Image)" 
                      : "🔑 Login to Generate Image"}
                </span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{language === "bn" ? "✨ অরিজিনাল AI ছবি তৈরি করুন" : "✨ Generate Original AI Image"}</span>
              </>
            )}
          </button>

          {isGenerating && statusText && (
            <p className="text-[11px] text-natural-accent font-medium text-center animate-pulse">
              {statusText}
            </p>
          )}

        </div>

        {/* Right Column: Display Canvas & Generated Result */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center bg-natural-aside/20 rounded-3xl p-4 border border-natural-border/80 min-h-[340px] relative group">
          
          {activeImage ? (
            <div className="flex flex-col items-center gap-4 w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-lg border border-natural-border/60 bg-white max-h-[380px] flex items-center justify-center group">
                <img
                  src={activeImage}
                  alt="Gemini AI Generated Poster"
                  referrerPolicy="no-referrer"
                  className="max-h-[380px] w-auto object-contain rounded-2xl"
                />

                {/* Dynamic Name Banner Overlay Preview */}
                {userName.trim() && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-3 pt-6 text-center">
                    <p className="text-amber-300 font-extrabold text-xs sm:text-sm drop-shadow-md tracking-wide">
                      ✨ {language === "bn" ? "শুভেচ্ছান্তে: " : language === "hi" ? "शुभकामनाएं: " : "Best Wishes from: "}{userName.trim()} ✨
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-2 w-full">
                <button
                  onClick={() => handleDownloadImage("png")}
                  className="flex-1 min-w-[120px] py-2 px-3 bg-natural-primary hover:bg-natural-primary/90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>PNG Download</span>
                </button>

                <button
                  onClick={() => handleDownloadImage("jpg")}
                  className="flex-1 min-w-[120px] py-2 px-3 bg-natural-accent hover:bg-natural-accent/90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>JPG Download</span>
                </button>

                <button
                  onClick={handleCopyImageLink}
                  className="py-2 px-3 bg-white hover:bg-natural-aside/60 border border-natural-border text-natural-text rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  title="Copy Image URL"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{language === "bn" ? "কপি" : "Copy"}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 text-natural-text/50">
              <div className="w-16 h-16 rounded-full bg-natural-accent/10 flex items-center justify-center mb-3">
                <ImageIcon className="w-8 h-8 text-natural-accent/60" />
              </div>
              <h4 className="text-sm font-bold text-natural-heading">
                {language === "bn" ? "আপনার AI ছবি এখানে প্রদর্শিত হবে" : "Your AI Image will appear here"}
              </h4>
              <p className="text-xs max-w-xs mt-1 leading-relaxed text-natural-text/60">
                {language === "bn"
                  ? "প্রম্পট বেছে নিয়ে 'অরিজিনাল AI ছবি তৈরি করুন' বাটনে ক্লিক করুন।"
                  : "Click 'Generate Original AI Image' to render a high definition custom poster."}
              </p>
            </div>
          )}

        </div>

      </div>

      {/* 5. Session Gallery History */}
      {gallery.length > 0 && (
        <div className="border-t border-natural-border/60 pt-4 mt-2">
          <h4 className="text-xs font-bold text-natural-heading mb-3 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-natural-accent" />
            <span>{language === "bn" ? "সাম্প্রতিক জেনারেটেড ছবিসমূহ (Session Gallery)" : "Recent Generated Images (Session Gallery)"}</span>
          </h4>

          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
            {gallery.map((img) => (
              <button
                key={img.id}
                onClick={() => setActiveImage(img.url)}
                className={`relative shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                  activeImage === img.url ? "border-natural-accent ring-2 ring-natural-accent/30 shadow-md" : "border-natural-border/80 hover:opacity-90"
                }`}
              >
                <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] font-mono py-0.5 text-center">
                  {img.timestamp}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
