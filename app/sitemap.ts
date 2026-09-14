import type { MetadataRoute } from "next";
import { siteUrl } from "./site-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: siteUrl, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/research`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/tools`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/awakening`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/insights`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
