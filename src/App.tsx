import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Search, 
  Bell, 
  Heart, 
  User as UserIcon, 
  LogOut, 
  Sparkles, 
  Info,
  Menu,
  X,
  PlusCircle,
  HelpCircle,
  Globe
} from "lucide-react";
import { defaultEvents } from "./data/defaultEvents";
import { SpecialDayEvent, UserProfile } from "./types";
import { CalendarView } from "./components/CalendarView";
import { EventDetails } from "./components/EventDetails";
import { PosterGenerator } from "./components/PosterGenerator";
import { NotificationFeed } from "./components/NotificationFeed";
import { FavoriteList } from "./components/FavoriteList";
import { AdminPanel } from "./components/AdminPanel";
import { LanguageSelectionModal } from "./components/LanguageSelectionModal";
import { Language, t, getEventTitle, getEventDescription } from "./lib/translations";

// Firebase Imports
import { 
  auth, 
  db, 
  googleProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  collection, 
  onSnapshot,
  query,
  where,
  deleteDoc,
  doc,
  setDoc,
  User,
  OperationType,
  handleFirestoreError
} from "./lib/firebase";

export default function App() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<string>("calendar");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Language Setup
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("pref_lang") as Language | null;
    return stored || "bn";
  });
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("pref_lang");
    if (!stored) {
      setShowLanguageModal(true);
    }
  }, []);

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("pref_lang", lang);
  };

  // Core App Data
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [customEvents, setCustomEvents] = useState<SpecialDayEvent[]>([]);
  const [events, setEvents] = useState<SpecialDayEvent[]>(defaultEvents);
  const [activeEvent, setActiveEvent] = useState<SpecialDayEvent | null>(defaultEvents[0]);

  // Auth & Profile
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Favorites (Syncing local + Firestore soon)
  const [favorites, setFavorites] = useState<string[]>([]);

  // 1. Listen to Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Verify admin emails
        const adminEmails = ["biswajitnaskar668@gmail.com"];
        const emailLower = currentUser.email?.toLowerCase() || "";
        setIsAdmin(adminEmails.includes(emailLower));
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Sync User Document and Favorites in Firestore (Real-Time)
  useEffect(() => {
    if (!user) {
      // Guest Mode: load favorites from localStorage
      const stored = localStorage.getItem("favs_guest");
      if (stored) {
        setFavorites(JSON.parse(stored));
      } else {
        setFavorites([]);
      }
      return;
    }

    // Authenticated Mode: Read/Write from users/{uid}
    const userDocRef = doc(db, "users", user.uid);
    
    const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        if (userData && Array.isArray(userData.favorites)) {
          setFavorites(userData.favorites);
          // Keep localStorage in sync as backup
          localStorage.setItem(`favs_${user.uid}`, JSON.stringify(userData.favorites));
        }
      } else {
        // Document does not exist in Firestore yet (first login)
        // Retrieve any existing local favorites to migrate to the cloud
        const localFavsStored = localStorage.getItem(`favs_${user.uid}`) || localStorage.getItem("favs_guest") || "[]";
        let localFavs: string[] = [];
        try {
          localFavs = JSON.parse(localFavsStored);
          if (!Array.isArray(localFavs)) localFavs = [];
        } catch (e) {
          localFavs = [];
        }

        try {
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            favorites: localFavs,
            lastLogin: new Date().toISOString(),
            prefLanguage: language
          });
          setFavorites(localFavs);
        } catch (err) {
          console.error("Error creating user document in Firestore on login: ", err);
        }
      }
    }, (error) => {
      console.error("Error listening to user document: ", error);
    });

    // Also update login timestamp
    const updateLastLogin = async () => {
      try {
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          lastLogin: new Date().toISOString(),
        }, { merge: true });
      } catch (e) {
        console.warn("Failed to update lastLogin timestamp: ", e);
      }
    };
    updateLastLogin();

    return () => unsubscribe();
  }, [user, language]);

  // 3. Load and Sync Custom Special Days from Firestore in Real-Time!
  useEffect(() => {
    const q = query(collection(db, "special_days"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched: SpecialDayEvent[] = [];
      snapshot.forEach((doc) => {
        fetched.push({ id: doc.id, ...doc.data() } as SpecialDayEvent);
      });
      setCustomEvents(fetched);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, "special_days");
    });

    return () => unsubscribe();
  }, []);

  // 3. Merge default events and custom Firestore events
  useEffect(() => {
    // Merge system defaults with custom user additions from Firestore
    const merged = [...defaultEvents];
    
    customEvents.forEach((custom) => {
      // Avoid duplicate IDs
      if (!merged.some(e => e.id === custom.id)) {
        merged.push(custom);
      }
    });

    setEvents(merged);
  }, [customEvents]);

  // 4. Update the active event when date changes
  useEffect(() => {
    const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const dd = String(selectedDate.getDate()).padStart(2, "0");
    const targetKey = `${mm}-${dd}`;

    const daysEvents = events.filter((e) => {
      if (e.date.length === 5) {
        return e.date === targetKey;
      }
      return e.date.substring(5) === targetKey;
    });

    if (daysEvents.length > 0) {
      // Set first event as active
      setActiveEvent(daysEvents[0]);
    } else {
      setActiveEvent(null);
    }
  }, [selectedDate, events]);

  // Google Login Handler
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Auth login failure: ", e);
    }
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setActiveTab("calendar");
    } catch (e) {
      console.error("Auth logout failure: ", e);
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = async (eventId: string) => {
    let updated: string[];
    if (favorites.includes(eventId)) {
      updated = favorites.filter((id) => id !== eventId);
    } else {
      updated = [...favorites, eventId];
    }
    setFavorites(updated);

    if (user) {
      // Save to Firestore under users/{uid}
      try {
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          favorites: updated
        }, { merge: true });
        localStorage.setItem(`favs_${user.uid}`, JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving favorites to Firestore: ", error);
      }
    } else {
      // Save to localStorage for guest
      localStorage.setItem("favs_guest", JSON.stringify(updated));
    }
  };

  // Delete Custom Special Day from Firestore
  const handleDeleteCustomEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, "special_days", eventId));
      setCustomEvents((prev) => prev.filter((e) => e.id !== eventId));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `special_days/${eventId}`);
    }
  };

  // Add Custom Event callback
  const handleAddCustomEvent = (newEvent: SpecialDayEvent) => {
    setCustomEvents((prev) => [newEvent, ...prev]);
  };

  // Search Results filtering
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    return events.filter(
      (e) =>
        e.titleBn.toLowerCase().includes(query) ||
        e.titleEn.toLowerCase().includes(query) ||
        e.descriptionBn.toLowerCase().includes(query) ||
        e.descriptionEn.toLowerCase().includes(query) ||
        e.category.toLowerCase().includes(query)
    );
  };

  const handleSearchResultClick = (e: SpecialDayEvent) => {
    // Extract month and day
    const [month, day] = e.date.split("-").map(Number);
    const targetDate = new Date();
    targetDate.setMonth(month - 1);
    targetDate.setDate(day);

    setSelectedDate(targetDate);
    setActiveEvent(e);
    setActiveTab("calendar");
    setSearchQuery(""); // Clear search bar
  };

  // Count notifications
  const getNotificationCount = () => {
    const todayStr = String(selectedDate.getMonth() + 1).padStart(2, "0") + "-" + String(selectedDate.getDate()).padStart(2, "0");
    return events.filter(e => e.date === todayStr).length;
  };

  return (
    <div className="min-h-screen bg-natural-bg text-natural-text flex flex-col font-sans selection:bg-natural-accent/20 selection:text-natural-heading pb-16 lg:pb-0">
      
      {/* 1. Header & Navigation */}
      <header className="sticky top-0 z-40 bg-natural-aside/90 backdrop-blur-md border-b border-natural-border px-3.5 sm:px-6 py-3 sm:py-4 text-natural-text">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo Title */}
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <span className="text-xl sm:text-2xl shrink-0">📅</span>
            <div className="flex flex-col min-w-0">
              <h1 id="app-title-bn" className="text-sm sm:text-base md:text-xl font-extrabold text-natural-heading tracking-tight leading-none truncate">
                {t("appTitle", language)}
              </h1>
              <span id="app-slogan" className="text-[8px] sm:text-[10px] md:text-xs text-natural-accent font-semibold mt-1 truncate">
                {t("appSlogan", language)}
              </span>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center gap-2 bg-white border border-natural-border px-3.5 py-1.5 rounded-2xl w-80 focus-within:border-natural-accent focus-within:ring-1 focus-within:ring-natural-accent/20 transition-all">
            <Search className="w-4 h-4 text-natural-text/40" />
            <input
              id="desktop-search-input"
              type="text"
              placeholder={t("searchPlaceholder", language)}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== "search") setActiveTab("search");
              }}
              className="bg-transparent border-none outline-none text-xs w-full text-natural-text"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-natural-aside/60 border border-natural-border p-1 rounded-2xl">
            <button
              id="nav-calendar"
              onClick={() => setActiveTab("calendar")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "calendar" ? "bg-white text-natural-accent border border-natural-border/60 shadow-sm" : "text-natural-text hover:bg-white/50"
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>{t("navCalendar", language)}</span>
            </button>
            <button
              id="nav-notifications"
              onClick={() => setActiveTab("notifications")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                activeTab === "notifications" ? "bg-white text-natural-accent border border-natural-border/60 shadow-sm" : "text-natural-text hover:bg-white/50"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>{t("navNotifications", language)}</span>
              {getNotificationCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-natural-accent text-white w-4.5 h-4.5 rounded-full flex items-center justify-center text-[9px] font-black animate-pulse">
                  {getNotificationCount()}
                </span>
              )}
            </button>
            <button
              id="nav-favorites"
              onClick={() => setActiveTab("favorites")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "favorites" ? "bg-white text-natural-accent border border-natural-border/60 shadow-sm" : "text-natural-text hover:bg-white/50"
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>{t("navFavorites", language)} ({favorites.length})</span>
            </button>
            {isAdmin && (
              <button
                id="nav-admin"
                onClick={() => setActiveTab("admin")}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === "admin" ? "bg-white text-natural-accent border border-natural-border/60 shadow-sm" : "text-natural-text hover:bg-white/50"
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t("navAdmin", language)}</span>
              </button>
            )}
          </nav>

          {/* User / Authentication Area */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageModal(true)}
                className="p-1.5 sm:p-2 border border-natural-border bg-white hover:bg-natural-aside/40 rounded-xl text-xs font-bold text-natural-text flex items-center gap-1 sm:gap-1.5 cursor-pointer shadow-sm"
                title="Change Language"
              >
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-natural-accent" />
                <span className="hidden sm:inline">{language === "bn" ? "বাংলা" : language === "hi" ? "हिन्दी" : "English"}</span>
              </button>
            </div>

            {user ? (
              <div className="flex items-center gap-1 sm:gap-2 border border-natural-border p-1 bg-white rounded-2xl">
                {user.photoURL ? (
                  <img
                    referrerPolicy="no-referrer"
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-6 h-6 sm:w-7 sm:h-7 rounded-full shadow-sm"
                  />
                ) : (
                  <div className="w-6 h-6 sm:w-7 sm:h-7 bg-natural-accent/10 text-natural-accent rounded-full flex items-center justify-center font-bold text-xs">
                    {user.displayName?.charAt(0) || <UserIcon className="w-3.5 h-3.5" />}
                  </div>
                )}
                <div className="hidden md:flex flex-col text-left">
                  <span className="text-[10px] font-bold text-natural-text leading-none">{user.displayName}</span>
                  <span className="text-[8px] text-natural-text/60 mt-0.5">{user.email}</span>
                </div>
                <button
                  id="auth-logout-btn"
                  onClick={handleLogout}
                  className="p-1 text-natural-text/40 hover:text-red-600 rounded-lg cursor-pointer transition-colors"
                  title="লগআউট করুন"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                id="auth-login-btn"
                onClick={handleGoogleLogin}
                className="flex items-center gap-1 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-natural-primary hover:bg-natural-primary/90 text-white rounded-xl text-[10px] sm:text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
              >
                <UserIcon className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
                <span className="hidden sm:inline">{t("googleLogin", language)}</span>
                <span className="sm:hidden">{language === "bn" ? "লগইন" : language === "hi" ? "लॉगिन" : "Login"}</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-natural-text hover:bg-white/50 rounded-xl cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Mobile Nav Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-natural-aside border-b border-natural-border px-6 py-4 flex flex-col gap-3.5 animate-fadeIn">
          {/* Mobile Search */}
          <div className="flex items-center gap-2 bg-white border border-natural-border px-3 py-1.5 rounded-xl">
            <Search className="w-4 h-4 text-natural-text/40" />
            <input
              id="mobile-search-input"
              type="text"
              placeholder={t("searchPlaceholder", language)}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== "search") setActiveTab("search");
              }}
              className="bg-transparent border-none outline-none text-xs w-full text-natural-text"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                setActiveTab("calendar");
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all ${
                activeTab === "calendar" ? "border-natural-accent bg-white text-natural-heading shadow-sm" : "border-natural-border/60 text-natural-text bg-white/40"
              }`}
            >
              <CalendarIcon className="w-4 h-4" />
              <span>{t("navCalendar", language)}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("notifications");
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all relative ${
                activeTab === "notifications" ? "border-natural-accent bg-white text-natural-heading shadow-sm" : "border-natural-border/60 text-natural-text bg-white/40"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>{t("navNotifications", language)}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("favorites");
                setMobileMenuOpen(false);
              }}
              className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all ${
                activeTab === "favorites" ? "border-natural-accent bg-white text-natural-heading shadow-sm" : "border-natural-border/60 text-natural-text bg-white/40"
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>{t("navFavorites", language)} ({favorites.length})</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => {
                  setActiveTab("admin");
                  setMobileMenuOpen(false);
                }}
                className={`p-3 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all ${
                  activeTab === "admin" ? "border-natural-accent bg-white text-natural-heading shadow-sm" : "border-natural-border/60 text-natural-text bg-white/40"
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>{t("navAdmin", language)}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. Main Body Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 md:px-6 py-8 flex flex-col gap-8">
        
        {/* Search Query Tab Override */}
        {activeTab === "search" && (
          <div className="bg-white rounded-3xl border border-natural-border shadow-sm p-6">
            <h2 className="text-lg font-bold text-natural-heading mb-4 flex items-center gap-1.5">
              <Search className="w-5 h-5 text-natural-accent" />
              <span>{t("searchResults", language)} ({getSearchResults().length})</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getSearchResults().map((e) => (
                <button
                  key={e.id}
                  onClick={() => handleSearchResultClick(e)}
                  className="p-4 bg-natural-aside/20 hover:bg-natural-accent/5 border border-natural-border hover:border-natural-accent transition-all text-left rounded-2xl flex flex-col gap-2 cursor-pointer group"
                >
                  <span className="text-[10px] font-bold text-natural-text/50 uppercase">
                    {e.date} (MM-DD)
                  </span>
                  <h3 className="text-base font-bold text-natural-text group-hover:text-natural-accent">
                    {getEventTitle(e, language)}
                  </h3>
                  <p className="text-xs text-natural-text/80 truncate-3-lines leading-relaxed font-medium">
                    {getEventDescription(e, language)}
                  </p>
                </button>
              ))}

              {getSearchResults().length === 0 && (
                <div className="col-span-full text-center py-12">
                  <HelpCircle className="w-10 h-10 text-natural-text/30 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-natural-text/70">{t("noResults", language)}</p>
                  <p className="text-xs text-natural-text/50 mt-1">{t("noResultsSub", language)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Calendar Main Grid Tab */}
        {activeTab === "calendar" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Calendar Grid & Search */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <CalendarView
                events={events}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                favorites={favorites}
                language={language}
              />

              {/* Informative Tip Block */}
              <div className="bg-natural-aside/40 border border-natural-border rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-4 h-4 text-natural-accent shrink-0 mt-0.5" />
                <p className="text-xs text-natural-text font-medium leading-relaxed">
                  <strong>{t("tipHeader", language)}:</strong> {t("tipText", language)}
                </p>
              </div>
            </div>

            {/* Right Column: Events Details & Poster Generator */}
            <div className="lg:col-span-7 flex flex-col gap-8">
              
              {/* Event details block */}
              <EventDetails
                events={events.filter((e) => {
                  const mm = String(selectedDate.getMonth() + 1).padStart(2, "0");
                  const dd = String(selectedDate.getDate()).padStart(2, "0");
                  const key = `${mm}-${dd}`;
                  return e.date === key || e.date.substring(5) === key;
                })}
                selectedDate={selectedDate}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onSelectEvent={setActiveEvent}
                activeEvent={activeEvent}
                language={language}
              />

              {/* Poster Generator Block */}
              <PosterGenerator event={activeEvent} language={language} />

            </div>
          </div>
        )}

        {/* Tab 2: Notifications Feed */}
        {activeTab === "notifications" && (
          <NotificationFeed
            events={events}
            onSelectDate={setSelectedDate}
            onSelectEvent={setActiveEvent}
            setActiveTab={setActiveTab}
            language={language}
          />
        )}

        {/* Tab 3: Favorites List */}
        {activeTab === "favorites" && (
          <FavoriteList
            events={events}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectDate={setSelectedDate}
            onSelectEvent={setActiveEvent}
            setActiveTab={setActiveTab}
            language={language}
          />
        )}

        {/* Tab 4: Admin Panel Controls */}
        {activeTab === "admin" && isAdmin && (
          <AdminPanel
            customEvents={customEvents}
            onAddCustomEvent={handleAddCustomEvent}
            onDeleteCustomEvent={handleDeleteCustomEvent}
          />
        )}

      </main>

      {/* 4. Footer */}
      <footer className="bg-natural-aside text-natural-text/80 py-12 px-6 mt-12 border-t border-natural-border text-center">
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-4">
          <span className="text-3xl">📅</span>
          <h3 className="text-base font-bold text-natural-heading tracking-wide">{t("appTitle", language)}</h3>
          <p className="text-xs max-w-md leading-relaxed text-natural-text/70">
            {t("footerDesc", language)}
          </p>
          <div className="flex gap-4 text-xs font-semibold mt-2 text-natural-text/60">
            <span className="hover:text-natural-accent transition-colors cursor-pointer">{t("nationalDaysLink", language)}</span>
            <span>•</span>
            <span className="hover:text-natural-accent transition-colors cursor-pointer">{t("wbFestivalLink", language)}</span>
            <span>•</span>
            <span className="hover:text-natural-accent transition-colors cursor-pointer">{t("freedomFightersLink", language)}</span>
            <span>•</span>
            <span className="hover:text-natural-accent transition-colors cursor-pointer">{t("greatThinkersLink", language)}</span>
          </div>
          <span className="text-[10px] text-natural-text/50 mt-6 font-mono">
            &copy; {new Date().getFullYear()} Special Day Calendar. All Rights Reserved. Powered by Gemini & Firebase.
          </span>
        </div>
      </footer>

      {/* Language Selection Popup Modal */}
      <LanguageSelectionModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onSelectLanguage={handleSelectLanguage}
        currentLanguage={language}
      />

      {/* Sticky Bottom Navigation Bar for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-natural-border/80 px-4 py-2 lg:hidden flex items-center justify-around shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => {
            setActiveTab("calendar");
            setMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "calendar" ? "text-natural-accent font-bold" : "text-natural-text/60"
          }`}
        >
          <CalendarIcon className="w-5 h-5 animate-pulse" />
          <span className="text-[10px] font-bold tracking-tight">
            {language === "bn" ? "ক্যালেন্ডার" : language === "hi" ? "कैलेंडर" : "Calendar"}
          </span>
        </button>
        <button
          onClick={() => {
            setActiveTab("notifications");
            setMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer relative ${
            activeTab === "notifications" ? "text-natural-accent font-bold" : "text-natural-text/60"
          }`}
        >
          <Bell className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">
            {language === "bn" ? "নোটিফিকেশন" : language === "hi" ? "सूचना" : "Alerts"}
          </span>
          {getNotificationCount() > 0 && (
            <span className="absolute top-1 right-2.5 bg-natural-accent text-white w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black animate-pulse">
              {getNotificationCount()}
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab("favorites");
            setMobileMenuOpen(false);
          }}
          className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
            activeTab === "favorites" ? "text-natural-accent font-bold" : "text-natural-text/60"
          }`}
        >
          <Heart className="w-5 h-5" />
          <span className="text-[10px] font-bold tracking-tight">
            {language === "bn" ? "প্রিয় তালিকা" : language === "hi" ? "पसंदीदा" : "Favorites"}
          </span>
        </button>
        {isAdmin && (
          <button
            onClick={() => {
              setActiveTab("admin");
              setMobileMenuOpen(false);
            }}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all cursor-pointer ${
              activeTab === "admin" ? "text-natural-accent font-bold" : "text-natural-text/60"
            }`}
          >
            <PlusCircle className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-tight">
              {language === "bn" ? "এডমিন" : language === "hi" ? "एडमिन" : "Admin"}
            </span>
          </button>
        )}
      </div>

    </div>
  );
}
