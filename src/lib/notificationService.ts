import { SpecialDayEvent } from "../types";
import { Language, getEventTitle, getCategoryLabel } from "./translations";

export interface NotificationSettings {
  browserEnabled: boolean;
  dailyAlertEnabled: boolean;
  dailyAlertTime: string; // e.g., "08:00"
  enabledCategories: string[]; // list of category keys
  soundEnabled: boolean;
  customReminders: CustomReminder[];
}

export interface CustomReminder {
  id: string;
  eventId?: string;
  title: string;
  date: string; // MM-DD or YYYY-MM-DD
  time: string; // HH:mm
  enabled: boolean;
  createdAt: string;
}

const STORAGE_KEY = "special_day_notif_settings";

export const defaultNotificationSettings: NotificationSettings = {
  browserEnabled: false,
  dailyAlertEnabled: true,
  dailyAlertTime: "08:00",
  enabledCategories: [
    "national",
    "international",
    "west_bengal",
    "freedom_fighter",
    "poet",
    "writer",
    "scientist",
    "leader",
    "sports",
    "religious",
    "history"
  ],
  soundEnabled: true,
  customReminders: []
};

// Get stored settings
export const getStoredNotificationSettings = (): NotificationSettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultNotificationSettings;
    const parsed = JSON.parse(raw);
    return { ...defaultNotificationSettings, ...parsed };
  } catch (e) {
    return defaultNotificationSettings;
  }
};

// Save settings to localStorage
export const saveNotificationSettings = (settings: NotificationSettings) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error("Failed to save notification settings:", e);
  }
};

// Check if browser notifications are supported
export const isBrowserNotificationSupported = (): boolean => {
  return typeof window !== "undefined" && "Notification" in window;
};

// Request Notification Permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!isBrowserNotificationSupported()) {
    return false;
  }
  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (e) {
    console.error("Permission request failed", e);
    return false;
  }
};

// Get current browser permission state
export const getBrowserPermissionState = (): NotificationPermission => {
  if (!isBrowserNotificationSupported()) return "denied";
  return Notification.permission;
};

// Play a subtle notification chime using Web Audio API (no external sound files required)
export const playNotificationChime = () => {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    
    const now = ctx.currentTime;
    
    // Note 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, now); // C5
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.4);

    // Note 2
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(659.25, now + 0.15); // E5
    gain2.gain.setValueAtTime(0.2, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.6);

  } catch (e) {
    console.warn("Audio chime unsupported or blocked:", e);
  }
};

// Trigger Browser Notification
export const sendBrowserNotification = (
  title: string,
  options?: NotificationOptions,
  playSound = true
) => {
  if (playSound) {
    playNotificationChime();
  }

  if (isBrowserNotificationSupported() && Notification.permission === "granted") {
    try {
      const notifOptions: any = {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        vibrate: [200, 100, 200],
        ...options
      };
      const notif = new Notification(title, notifOptions);
      notif.onclick = () => {
        window.focus();
        notif.close();
      };
    } catch (e) {
      console.warn("Notification construct error:", e);
    }
  }
};

// Trigger notification for special event
export const triggerEventNotification = (
  event: SpecialDayEvent,
  language: Language,
  customTitle?: string
) => {
  const title = customTitle || getEventTitle(event, language);
  const categoryLabel = getCategoryLabel(event.category, language);
  
  sendBrowserNotification(`🔔 ${categoryLabel}: ${title}`, {
    body: event.descriptionBn || event.descriptionEn || "আজকের বিশেষ দিবস সম্পর্কিত বিস্তারিত দেখতে অ্যাপে ক্লিক করুন।",
    tag: `event-${event.id}`,
    renotify: true
  } as any);
};
