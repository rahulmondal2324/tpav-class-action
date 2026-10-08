import "server-only";
import { cache } from "react";
import { prisma } from "./prisma";
export const defaults: Record<string, string> = {
  siteTitle: "Class Action Against TPAV",
  contactEmail: "",
  authorStory: "",
  privacy: "",
  terms: "",
  facebook: "",
  instagram: "",
  twitter: "",
  youtube: "",
};
export const getSettings = cache(async () => {
  const entries = await prisma.setting.findMany();
  return {
    ...defaults,
    ...Object.fromEntries(entries.map((s) => [s.key, s.value || ""])),
  };
});
