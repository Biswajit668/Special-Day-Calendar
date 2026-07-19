export type EventCategory =
  | "national"
  | "international"
  | "west_bengal"
  | "freedom_fighter"
  | "poet"
  | "writer"
  | "scientist"
  | "leader"
  | "sports"
  | "religious"
  | "history";

export interface SpecialDayEvent {
  id: string;
  titleBn: string;
  titleEn: string;
  date: string; // MM-DD or YYYY-MM-DD
  category: EventCategory;
  descriptionBn: string;
  descriptionEn: string;
  wishesBn: string[];
  wishesEn: string[];
  fbCaption?: string;
  waMessage?: string;
  xPost?: string;
  hashtags?: string[];
  createdBy?: string;
  imageUrl?: string;
}

export interface UserFavorite {
  id: string;
  eventId: string;
  userId: string;
  savedAt: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin?: boolean;
}

export interface AnalyticsStats {
  eventViews: Record<string, number>;
  wishShares: Record<string, number>;
  favoritesCount: Record<string, number>;
}
