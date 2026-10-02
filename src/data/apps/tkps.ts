export interface AppScreenshot {
  src: string;
  alt: string;
}

export interface AppFeature {
  title: string;
  text: string;
}

export interface AppListing {
  name: string;
  /** Who the app is for, shown above the name. */
  community: string;
  tagline: string;
  description: string;
  icon: string;
  /** Public address the QR code points to. Phones that open it are sent to their store. */
  shareUrl: string;
  appStoreUrl: string;
  playStoreUrl: string;
  screenshots: AppScreenshot[];
  features: AppFeature[];
}

export const TKPS_APP: AppListing = {
  name: "Talpada Koli Patel Trust",
  community: "Shri Talpada Koli Patel Pragati Trust",
  tagline: "Your samaj in your pocket.",
  description:
    "The official members app for the Talpada Koli Patel community. Everything the trust publishes in one place - the events calendar, photo albums from every celebration, students' results, community achievements, committee contacts, news and the annual report.",
  icon: "/images/apps/tkps/icon.png",
  shareUrl: "https://skyllect.com/app/tkps",
  appStoreUrl: "https://apps.apple.com/in/app/talpada-koli-patel-trust/id6811017425",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.skyllect.tkps",
  screenshots: [
    { src: "/images/apps/tkps/home.jpg", alt: "Home screen with the community feed and quick links" },
    { src: "/images/apps/tkps/events.jpg", alt: "Events screen listing upcoming and past gatherings" },
    { src: "/images/apps/tkps/gallery.jpg", alt: "Photo gallery organised by event" },
  ],
  features: [
    { title: "Community feed", text: "Photo albums, updates and news from the trust as they happen." },
    { title: "Events calendar", text: "Every sabha, camp and celebration - upcoming and past." },
    { title: "Students & achievements", text: "Results and achievements from across the community." },
    { title: "Member & business directory", text: "Find members and 755+ trades, with birthday wishes on Home." },
    { title: "Committee contacts", text: "Reach the right committee member in one tap." },
    { title: "English & Gujarati", text: "Use the app in the language you are most comfortable with." },
  ],
};
