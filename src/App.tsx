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
  HelpCircle
} from "lucide-react";
import { defaultEvents } from "./data/defaultEvents";
import { SpecialDayEvent, UserProfile } from "./types";
import { CalendarView } from "./components/CalendarView";
import { EventDetails } from "./components/EventDetails";
import { PosterGenerator } from "./components/PosterGenerator";
import { NotificationFeed } from "./components/NotificationFeed";
import { FavoriteList } from "./components/FavoriteList";
import { AdminPanel } from "./components/AdminPanel";

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
  User,
  OperationType,
  handleFirestoreError
} from "./lib/firebase";

export default function App() {
  // Navigation & Tabs
  const [activeTab, setActiveTab] = useState<string>("calendar");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Core App Data
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [customEvents, setCustomEvents] = useState<SpecialDayEvent[]>([]);
  const [events, setEvents] = useState<SpecialDayEvent[]>(defaultEvents);
  const [activeEvent, setActiveEvent] = useState<SpecialDayEvent | null>(defaultEvents[0]);

  // Auth & Profile
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(true); // Default true for frictionless testing/admin capabilities!

  // Favorites (Syncing local + Firestore soon)
  const [favorites, setFavorites] = useState<string[]>([]);

  // 1. Listen to Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // If logged in, we sync their favorites from local or firestore
        // Let's load user favorites from localStorage
        const stored = localStorage.getItem(`favs_${currentUser.uid}`);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } else {
        // Logged out
        const stored = localStorage.getItem("favs_guest");
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // 2. Load and Sync Custom Special Days from Firestore in Real-Time!
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

    // Load initial Guest favorites
    if (!user) {
      const stored = localStorage.getItem("favs_guest");
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    }

    return () => unsubscribe();
  }, [user]);

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
    } catch (e) {
      console.error("Auth logout failure: ", e);
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (eventId: string) => {
    let updated: string[];
    if (favorites.includes(eventId)) {
      updated = favorites.filter((id) => id !== eventId);
    } else {
      updated = [...favorites, eventId];
    }
    setFavorites(updated);

    // Save to localStorage based on login status
    const storageKey = user ? `favs_${user.uid}` : "favs_guest";
    localStorage.setItem(storageKey, JSON.stringify(updated));
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
    <div className="min-h-screen bg-natural-bg text-natural-text flex flex-col font-sans selection:bg-natural-accent/20 selection:text-natural-heading">
      
      {/* 1. Header & Navigation */}
      <header className="sticky top-0 z-40 bg-natural-aside/90 backdrop-blur-md border-b border-natural-border px-6 py-4 text-natural-text">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Logo Title */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">📅</span>
            <div className="flex flex-col">
              <h1 id="app-title-bn" className="text-lg md:text-xl font-extrabold text-natural-heading tracking-tight leading-none">
                विशेष दिन ক্যালেন্ডার
              </h1>
              <span id="app-slogan" className="text-[10px] md:text-xs text-natural-accent font-semibold mt-1">
                এক জায়গায় প্রতিদিনের সব বিশেষ দিন, শুভেচ্ছা ও তথ্য।
              </span>
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex items-center gap-2 bg-white border border-natural-border px-3.5 py-1.5 rounded-2xl w-80 focus-within:border-natural-accent focus-within:ring-1 focus-within:ring-natural-accent/20 transition-all">
            <Search className="w-4 h-4 text-natural-text/40" />
            <input
              id="desktop-search-input"
              type="text"
              placeholder="রবীন্দ্রনাথ, নজরুল, পরিবেশ দিবস..."
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
              <span>ক্যালেন্ডার ভিউ</span>
            </button>
            <button
              id="nav-notifications"
              onClick={() => setActiveTab("notifications")}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer relative ${
                activeTab === "notifications" ? "bg-white text-natural-accent border border-natural-border/60 shadow-sm" : "text-natural-text hover:bg-white/50"
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>দিবস নোটিফিকেশন</span>
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
              <span>পছন্দ তালিকা ({favorites.length})</span>
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
                <span>এডমিন প্যানেল</span>
              </button>
            )}
          </nav>

          {/* User / Authentication Area */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="flex items-center gap-2 border border-natural-border p-1.5 pr-3 bg-white rounded-2xl">
                {user.photoURL ? (
                  <img
                    referrerPolicy="no-referrer"
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-7 h-7 rounded-full shadow-sm"
                  />
                ) : (
                  <div className="w-7 h-7 bg-natural-accent/10 text-natural-accent rounded-full flex items-center justify-center font-bold text-xs">
                    {user.displayName?.charAt(0) || <UserIcon className="w-4 h-4" />}
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
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                id="auth-login-btn"
                onClick={handleGoogleLogin}
                className="flex items-center gap-1.5 px-4 py-2 bg-natural-primary hover:bg-natural-primary/90 text-white rounded-xl text-xs font-bold shadow-sm transition-all cursor-pointer shrink-0"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>গুগল দিয়ে লগইন</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-natural-text hover:bg-white/50 rounded-xl cursor-pointer"
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
              placeholder="রবীন্দ্রনাথ, নজরুল, পরিবেশ দিবস..."
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
              <span>ক্যালেন্ডার ভিউ</span>
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
              <span>দিবস নোটিফিকেশন</span>
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
              <span>পছন্দ তালিকা ({favorites.length})</span>
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
                <span>এডমিন প্যানেল</span>
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
              <span>অনুসন্ধান ফলাফল ({getSearchResults().length})</span>
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
                    {e.titleBn}
                  </h3>
                  <p className="text-xs text-natural-text/80 truncate-3-lines leading-relaxed font-medium">
                    {e.descriptionBn}
                  </p>
                </button>
              ))}

              {getSearchResults().length === 0 && (
                <div className="col-span-full text-center py-12">
                  <HelpCircle className="w-10 h-10 text-natural-text/30 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-natural-text/70">কোন ফলাফল পাওয়া যায়নি!</p>
                  <p className="text-xs text-natural-text/50 mt-1">দয়া করে অন্য কোন শব্দ বা বানানে অনুসন্ধান করে দেখুন।</p>
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
              />

              {/* Informative Tip Block */}
              <div className="bg-natural-aside/40 border border-natural-border rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-4 h-4 text-natural-accent shrink-0 mt-0.5" />
                <p className="text-xs text-natural-text font-medium leading-relaxed">
                  <strong>টিপস:</strong> ক্যালেন্ডারের যেকোনো তারিখে ক্লিক করে সেই দিনের গুরুত্বপূর্ণ ঐতিহাসিক ঘটনা, কবি-সাহিত্যিকদের জয়ন্তী এবং শুভেচ্ছা বার্তা দেখতে পারেন!
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
              />

              {/* Poster Generator Block */}
              <PosterGenerator event={activeEvent} />

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
          <h3 className="text-base font-bold text-natural-heading tracking-wide">विशेष दिन कैलेंडार</h3>
          <p className="text-xs max-w-md leading-relaxed text-natural-text/70">
            বাঙালির আবেগ ও সংস্কৃতির মেরুদণ্ড এবং আন্তর্জাতিক পর্যায়ের গুরুত্বপূর্ণ দিনগুলিকে এক ছাতার তলায় পরিবেশন করতে এই ক্যালেন্ডারটি তৈরি করা হয়েছে।
          </p>
          <div className="flex gap-4 text-xs font-semibold mt-2 text-natural-text/60">
            <span className="hover:text-natural-accent transition-colors cursor-pointer">জাতীয় দিবস</span>
            <span>•</span>
            <span className="hover:text-natural-accent transition-colors cursor-pointer">পশ্চিমবঙ্গ উৎসব</span>
            <span>•</span>
            <span className="hover:text-natural-accent transition-colors cursor-pointer">স্বাধীনতা সংগ্রামী</span>
            <span>•</span>
            <span className="hover:text-natural-accent transition-colors cursor-pointer">মনীষীদের জয়ন্তী</span>
          </div>
          <span className="text-[10px] text-natural-text/50 mt-6 font-mono">
            &copy; {new Date().getFullYear()} Special Day Calendar. All Rights Reserved. Powered by Gemini & Firebase.
          </span>
        </div>
      </footer>

    </div>
  );
}
