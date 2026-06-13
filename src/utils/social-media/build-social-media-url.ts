import { SocialMediaPlatform } from "@/lib/sektor-api/__generated__/types";

const PHONE_PLATFORMS = [
  SocialMediaPlatform.Phone,
  SocialMediaPlatform.EmergencyPhone,
  SocialMediaPlatform.Whatsapp,
];

const PLATFORM_BASE_URLS: Partial<Record<SocialMediaPlatform, string>> = {
  [SocialMediaPlatform.Facebook]: "https://www.facebook.com/",
  [SocialMediaPlatform.Instagram]: "https://www.instagram.com/",
  [SocialMediaPlatform.Twitter]: "https://www.twitter.com/",
  [SocialMediaPlatform.Website]: "https://",
};

export function buildSocialMediaUrl(
  platform: SocialMediaPlatform,
  inputUrl: string
): string {
  const trimmedUrl = inputUrl.trim();
  if (!trimmedUrl) return "";

  if (PHONE_PLATFORMS.includes(platform)) {
    return trimmedUrl;
  }

  if (/^https?:\/\//i.test(trimmedUrl)) {
    return trimmedUrl;
  }

  const withoutAt = trimmedUrl.replace(/^@+/, "");

  if (withoutAt.includes(".") || withoutAt.includes("/")) {
    return `https://${withoutAt.replace(/^\/+/, "")}`;
  }

  const baseUrl = PLATFORM_BASE_URLS[platform] ?? "https://";
  return `${baseUrl}${withoutAt}`;
}

export function buildSocialMediaHref(
  platform: SocialMediaPlatform,
  inputUrl: string
): string {
  const url = buildSocialMediaUrl(platform, inputUrl);

  if (
    platform === SocialMediaPlatform.Phone ||
    platform === SocialMediaPlatform.EmergencyPhone
  ) {
    return `tel:${url.replace(/\s/g, "")}`;
  }

  if (platform === SocialMediaPlatform.Whatsapp) {
    const digits = url.replace(/\D/g, "");
    return digits ? `https://wa.me/${digits}` : "#";
  }

  return url;
}
