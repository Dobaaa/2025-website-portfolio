export const API_ORIGIN =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export type ProjectImage = {
  id: number;
  image_path: string;
  caption?: string | null;
};

export type PortfolioProject = {
  id: number;
  title: string;
  short_description?: string | null;
  details?: string | null;
  cover_image?: string | null;
  images: ProjectImage[];
  technologies?: string[];
  access_type: "public" | "confidential";
  can_open_live: boolean;
  live_url?: string | null;
  github_url?: string | null;
  confidential_message?: string | null;
};

export type PortfolioTestimonial = {
  id: number;
  quote: string;
  name: string;
  title?: string | null;
  avatar?: string | null;
};

export type PortfolioExperience = {
  id: number;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
};

export type PortfolioSocial = {
  id: number;
  name: string;
  url: string;
  icon?: string | null;
};

export type PortfolioSettings = {
  hero_label?: string | null;
  hero_title?: string | null;
  hero_subtitle?: string | null;
  hero_image?: string | null;
  footer_heading?: string | null;
  footer_text?: string | null;
  contact_email?: string | null;
  copyright_text?: string | null;
  cv_path?: string | null;
  cv_original_name?: string | null;
};

export type PortfolioPayload = {
  settings: PortfolioSettings;
  projects: PortfolioProject[];
  testimonials: PortfolioTestimonial[];
  experiences: PortfolioExperience[];
  social_links: PortfolioSocial[];
};

export function mediaUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/uploads")) return `${API_ORIGIN}${path}`;
  return path;
}

const TECH_ICONS: Record<string, string> = {
  react: "/re.svg",
  tailwind: "/tail.svg",
  "tailwind css": "/tail.svg",
  typescript: "/ts.svg",
  "next.js": "/next.svg",
  next: "/next.svg",
  "three.js": "/three.svg",
  three: "/three.svg",
  javascript: "/javascript.svg",
  angular: "/angular.svg",
  css3: "/CSS3.png",
  laravel: "/c.svg",
};

export function techIcon(value: string) {
  if (value.startsWith("/") || value.startsWith("http")) return mediaUrl(value);
  return TECH_ICONS[value.trim().toLowerCase()] || "";
}

const SOCIAL_ICONS: Record<string, string> = {
  github: "/git.svg",
  whatsapp: "/www.png",
  linkedin: "/link.svg",
};

export function socialIcon(value?: string | null) {
  if (!value) return "/link.svg";
  if (value.startsWith("/") || value.startsWith("http")) return mediaUrl(value);
  return SOCIAL_ICONS[value.trim().toLowerCase()] || "/link.svg";
}
