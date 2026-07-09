import { RAW_PAGES } from "@/lib/generated-pages";

export type SeoPage = (typeof RAW_PAGES)[number];

export const SITE_NAME = "ProHomeGuard";
export const DEFAULT_SITE_URL = "https://prohomeguard.com";
export const PHONE_DISPLAY = "1-888-896-5840";
export const PHONE_E164 = "+18888965840";

export const SEO_PAGES: SeoPage[] = [...RAW_PAGES];
export const SERVICE_PILLARS = SEO_PAGES.filter((page) => page.pageType === "Service Pillar");
export const CITY_PAGES = SEO_PAGES.filter((page) => isCityPage(page));
export const SUPPORT_PAGES = SEO_PAGES.filter((page) => !isCityPage(page) && page.pageType !== "Service Pillar");

const FAMILY_RULES = [
  {
    slug: "/emergency-plumber",
    terms: ["emergency plumber", "24 hour plumber", "burst pipe", "plumbing emergency", "water leak", "frozen pipe"],
  },
  {
    slug: "/emergency-electrician",
    terms: ["emergency electrician", "electrical repair", "breaker", "power outage", "electrical emergency"],
  },
  {
    slug: "/emergency-property-management",
    terms: ["property management", "maintenance response", "rental repair", "tenant repair"],
  },
  {
    slug: "/flood-damage-restoration",
    terms: ["flood damage", "water damage", "water extraction", "flood cleanup", "restoration"],
  },
  {
    slug: "/emergency-hvac-repair",
    terms: ["emergency hvac", "furnace repair", "ac repair", "heating repair", "hvac emergency"],
  },
  {
    slug: "/arborist",
    terms: ["arborist", "tree care", "tree service", "tree inspection"],
  },
  {
    slug: "/tree-removal",
    terms: ["tree removal", "tree cutting", "fallen tree", "storm damage tree", "stump removal"],
  },
  {
    slug: "/tree-trimming",
    terms: ["tree trimming", "tree pruning", "pruning", "trimming"],
  },
  {
    slug: "/painting-contractor",
    terms: ["painting contractor", "painting service", "painters", "house painting", "commercial painting", "residential painting"],
  },
  {
    slug: "/flooring-installation",
    terms: ["flooring", "floor installation", "hardwood", "laminate", "vinyl"],
  },
];

function familyBucketForPillar(slug: string) {
  if (
    ["/painting-contractor", "/interior-painting", "/exterior-painting", "/house-painting", "/commercial-painting", "/residential-painting"].includes(
      slug,
    )
  ) {
    return "/painting-contractor";
  }
  if (
    [
      "/flooring-installation",
      "/hardwood-flooring",
      "/laminate-flooring-installation",
      "/engineered-hardwood-flooring",
      "/vinyl-flooring-installation",
    ].includes(slug)
  ) {
    return "/flooring-installation";
  }
  if (["/arborist", "/tree-removal", "/tree-trimming", "/stump-removal"].includes(slug)) {
    return "/tree-removal";
  }
  return slug;
}

export function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, "");
}

export function toPath(slug: string) {
  return slug.startsWith("/") ? slug : `/${slug}`;
}

export function absoluteUrl(path: string) {
  return `${getSiteUrl()}${toPath(path)}`;
}

export function bySlug(slug: string) {
  const clean = toPath(slug).replace(/\/+$/, "");
  return SEO_PAGES.find((page) => page.pageSlug === clean);
}

export function isCityPage(page: SeoPage) {
  return page.pageType === "City Service Page" && !page.targetArea.includes("National");
}

export function cityFromTargetArea(targetArea: string) {
  return targetArea.replace(/\s*\([^)]*\)/, "").split(",")[0].trim();
}

export function provinceFromTargetArea(targetArea: string) {
  return targetArea.includes(",") ? targetArea.split(",")[1].trim() : "Canada";
}

export function titleCase(value: string) {
  return value
    .split(/(\s|-|\/)/)
    .map((part) => {
      if (/^\s|-|\/$/.test(part)) return part;
      if (part === "rv") return "RV";
      if (part === "hvac") return "HVAC";
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join("")
    .replace(/\bAnd\b/g, "and")
    .replace(/\bIn\b/g, "in")
    .replace(/\bNear Me\b/g, "Near Me");
}

function normalizeSource(page: SeoPage) {
  return [page.pageSlug, page.pageTitle, page.primaryKeyword, page.secondaryKeywords, page.targetArea, page.pageType]
    .join(" ")
    .toLowerCase();
}

function cleanTitle(value: string) {
  return value
    .replace(/\s*\|\s*1-888-896-5840\s*$/i, "")
    .replace(/\s*\|\s*Call\s+1-888-896-5840\s*$/i, "")
    .replace(/\s*\|\s*ProHomeGuard\s*$/i, "")
    .trim();
}

export function serviceFamily(page: SeoPage) {
  if (page.pageType === "Service Pillar") return page.pageSlug;
  const source = normalizeSource(page);
  const matched = FAMILY_RULES.find((rule) => rule.terms.some((term) => source.includes(term)));
  return matched?.slug || "/flood-damage-restoration";
}

export function pillarFor(page: SeoPage) {
  return bySlug(serviceFamily(page)) || SERVICE_PILLARS[0];
}

export function cityPagesForPillar(pillar: SeoPage) {
  const targetFamily = familyBucketForPillar(pillar.pageSlug);
  const direct = CITY_PAGES.filter((page) => serviceFamily(page) === targetFamily);
  if (direct.length > 0) return direct;
  return CITY_PAGES.filter((page) => serviceFamily(page) === "/flood-damage-restoration").slice(0, 8);
}

export function sameCityPages(page: SeoPage) {
  if (!isCityPage(page)) return [];
  const city = cityFromTargetArea(page.targetArea);
  return CITY_PAGES.filter((item) => item.pageSlug !== page.pageSlug && cityFromTargetArea(item.targetArea) === city);
}

export function supportCityLinks(page: SeoPage, limit = 5) {
  const targetFamily = isCityPage(page) ? serviceFamily(page) : familyBucketForPillar(page.pageSlug);
  const familyMatches = CITY_PAGES.filter((item) => serviceFamily(item) === targetFamily).slice(0, limit);
  if (familyMatches.length >= 2) return familyMatches;
  return [...familyMatches, ...CITY_PAGES.filter((item) => !familyMatches.includes(item)).slice(0, limit - familyMatches.length)];
}

export function linkLabel(page: SeoPage) {
  if (isCityPage(page)) return cityFromTargetArea(page.targetArea);
  return titleCase(page.primaryKeyword);
}

export function pageListLabel(page: SeoPage) {
  if (isCityPage(page)) return cityFromTargetArea(page.targetArea);
  return cleanTitle(page.pageTitle)
    .replace(/\s+Canada$/i, "")
    .replace(/\s+\|\s+.*$/i, "")
    .trim();
}

export function serviceTopicLabel(page: SeoPage) {
  const source = isCityPage(page) ? pillarFor(page) : page;
  return pageListLabel(source).replace(/\s+Services$/i, "").trim();
}

export function pageLocation(page: SeoPage) {
  return isCityPage(page) ? cityFromTargetArea(page.targetArea) : "Canada";
}

export function buildH1(page: SeoPage) {
  const location = pageLocation(page);
  const key = titleCase(page.primaryKeyword);
  if (key.toLowerCase().includes(location.toLowerCase())) return key;
  return location === "Canada" ? `${key} Canada` : `${key} ${location}`;
}

export function buildMetaTitle(page: SeoPage) {
  const lead = cleanTitle(page.pageTitle).replace(/\s+Canada$/i, "Canada").trim();
  let title = lead;
  if (!title.includes(SITE_NAME)) title = `${title} | ${SITE_NAME}`;
  if (title.length > 60) {
    const shortened = lead.replace(/\s*\|\s*.*$/, "").replace(/\s+-\s+.*$/, "").trim();
    title = `${shortened} | ${SITE_NAME}`;
  }
  return title;
}

export function buildMetaDescription(page: SeoPage) {
  const location = pageLocation(page);
  const focus = isCityPage(page) ? `${serviceTopicLabel(page)} in ${location}` : pageListLabel(page);
  let description = `Need help with ${focus.toLowerCase()}? We confirm the issue, check access, explain your options, and help you move forward with confidence. Call ${PHONE_DISPLAY} for fast, direct support.`;
  if (description.length > 160) {
    description = description.slice(0, 157);
    description = `${description.slice(0, description.lastIndexOf(" ")).replace(/\b(and|or|for|with)\b$/i, "").replace(/[,. ]+$/, "")}.`;
  }
  while (description.length < 150) {
    const addition = description.length < 132 ? " Fast response guidance." : " Call now.";
    description = `${description.replace(/\.$/, "")}.${addition}`;
  }
  if (description.length > 160) description = `${description.slice(0, 156).replace(/[,. ]+$/, "")}.`;
  return description;
}

export type CityFact = {
  neighborhoods: string[];
  landmarks: string[];
  climate: string;
};

export const CITY_FACTS: Record<string, CityFact> = {
  Ajax: { neighborhoods: ["Pickering Village", "Southwood"], landmarks: ["Ajax Waterfront Park", "Carruthers Creek"], climate: "humid summers and freeze-thaw winters near Lake Ontario" },
  Barrie: { neighborhoods: ["Allandale", "Painswick"], landmarks: ["Kempenfelt Bay", "Barrie waterfront"], climate: "snowy winters shaped by Georgian Bay weather" },
  Beaconsfield: { neighborhoods: ["Beacon Hill", "Sherwood"], landmarks: ["Lac Saint-Louis", "Centennial Park"], climate: "cold Montreal-area winters and humid summers" },
  Bowmanville: { neighborhoods: ["Historic Downtown", "Soper Creek"], landmarks: ["Bowmanville Creek", "Lake Ontario shoreline"], climate: "lake-influenced winters and damp spring thaws" },
  Brampton: { neighborhoods: ["Springdale", "Heart Lake"], landmarks: ["Etobicoke Creek", "Gage Park"], climate: "humid summers and icy winter swings" },
  Burlington: { neighborhoods: ["Aldershot", "Millcroft"], landmarks: ["Spencer Smith Park", "Niagara Escarpment"], climate: "Lake Ontario humidity and winter freeze-thaw cycles" },
  Burnaby: { neighborhoods: ["Metrotown", "Brentwood"], landmarks: ["Burnaby Mountain", "Deer Lake"], climate: "wet coastal winters and mild summers" },
  Calgary: { neighborhoods: ["Bowness", "Forest Lawn"], landmarks: ["Bow River", "Nose Hill Park"], climate: "dry prairie weather with sudden Chinook temperature changes" },
  "Dollard-des-Ormeaux": { neighborhoods: ["Westpark", "Sunnybrooke"], landmarks: ["Centennial Park", "Marché de l'Ouest"], climate: "cold West Island winters and wet spring melts" },
  Edmonton: { neighborhoods: ["Mill Woods", "Westmount"], landmarks: ["North Saskatchewan River", "Hawrelak Park"], climate: "long cold winters and dry prairie summers" },
  Etobicoke: { neighborhoods: ["The Kingsway", "Mimico"], landmarks: ["Humber Bay Park", "Etobicoke Creek"], climate: "lake-effect moisture and winter thaw cycles" },
  Guelph: { neighborhoods: ["Exhibition Park", "Kortright Hills"], landmarks: ["Speed River", "University of Guelph"], climate: "humid summers and cold, wet shoulder seasons" },
  Halifax: { neighborhoods: ["Hydrostone", "Fairview"], landmarks: ["Halifax Harbour", "Point Pleasant Park"], climate: "coastal rain, fog, and winter storms" },
  Hamilton: { neighborhoods: ["Stoney Creek", "Westdale"], landmarks: ["Hamilton Harbour", "Niagara Escarpment"], climate: "lake humidity plus escarpment-driven runoff" },
  Kamloops: { neighborhoods: ["Sahali", "Brocklehurst"], landmarks: ["Thompson Rivers", "Riverside Park"], climate: "hot dry summers and cold interior winters" },
  Kelowna: { neighborhoods: ["Rutland", "Glenmore"], landmarks: ["Okanagan Lake", "Knox Mountain"], climate: "dry summers and damp winter valleys" },
  Kingston: { neighborhoods: ["Portsmouth", "Cataraqui North"], landmarks: ["Lake Ontario", "Fort Henry"], climate: "windy lakefront winters and humid summers" },
  Kirkland: { neighborhoods: ["Timberlea", "Lacey Green"], landmarks: ["Kirkland Sports Complex", "Lac Saint-Louis nearby"], climate: "Montreal freeze-thaw winters and humid summers" },
  Kitchener: { neighborhoods: ["Doon", "Forest Heights"], landmarks: ["Victoria Park", "Grand River corridor"], climate: "snowy winters and humid Waterloo Region summers" },
  Langley: { neighborhoods: ["Willoughby", "Murrayville"], landmarks: ["Fort Langley", "Nicomekl River"], climate: "wet Fraser Valley winters and mild summers" },
  London: { neighborhoods: ["Old North", "Byron"], landmarks: ["Thames River", "Victoria Park"], climate: "humid summers with snowy Southwestern Ontario winters" },
  Markham: { neighborhoods: ["Unionville", "Milliken"], landmarks: ["Rouge River", "Main Street Unionville"], climate: "humid summers and icy York Region winters" },
  Milton: { neighborhoods: ["Dempsey", "Bronte Meadows"], landmarks: ["Rattlesnake Point", "Sixteen Mile Creek"], climate: "escarpment weather with winter freeze-thaw movement" },
  Mississauga: { neighborhoods: ["Port Credit", "Streetsville"], landmarks: ["Credit River", "Lake Ontario shoreline"], climate: "lake humidity and sharp winter temperature swings" },
  "North Vancouver": { neighborhoods: ["Lonsdale", "Lynn Valley"], landmarks: ["Capilano River", "Grouse Mountain"], climate: "heavy coastal rain and mild winters" },
  Oshawa: { neighborhoods: ["Kedron", "Lakeview"], landmarks: ["Oshawa Creek", "Lakeview Park"], climate: "Lake Ontario moisture and cold winter snaps" },
  Ottawa: { neighborhoods: ["Glebe", "Orléans"], landmarks: ["Rideau Canal", "Ottawa River"], climate: "very cold winters and humid summers" },
  Pierrefonds: { neighborhoods: ["Roxboro", "Cap-Saint-Jacques"], landmarks: ["Rivière des Prairies", "Bois-de-Liesse"], climate: "cold island winters and spring flood awareness" },
  "Red Deer": { neighborhoods: ["Bower", "Clearview Ridge"], landmarks: ["Red Deer River", "Waskasoo Park"], climate: "cold central Alberta winters and dry summers" },
  Regina: { neighborhoods: ["Cathedral", "Lakeview"], landmarks: ["Wascana Centre", "Saskatchewan Legislative Building"], climate: "windy prairie weather with deep winter freezes" },
  Saskatoon: { neighborhoods: ["Nutana", "Riversdale"], landmarks: ["South Saskatchewan River", "Meewasin Valley"], climate: "dry cold winters and warm prairie summers" },
  Sudbury: { neighborhoods: ["New Sudbury", "Minnow Lake"], landmarks: ["Ramsey Lake", "Science North"], climate: "long snowy winters and rocky Shield drainage" },
  Surrey: { neighborhoods: ["Newton", "Guildford"], landmarks: ["Serpentine River", "Crescent Beach"], climate: "wet coastal winters and mild growing seasons" },
  Toronto: { neighborhoods: ["Leslieville", "The Junction"], landmarks: ["Don Valley", "Lake Ontario"], climate: "humid summers and lake-influenced winter weather" },
  Vancouver: { neighborhoods: ["Kitsilano", "Mount Pleasant"], landmarks: ["False Creek", "Stanley Park"], climate: "rainy coastal winters and mild summers" },
  Vaughan: { neighborhoods: ["Woodbridge", "Maple"], landmarks: ["Humber River", "Canada's Wonderland"], climate: "humid GTA summers and cold winter cycles" },
  Victoria: { neighborhoods: ["James Bay", "Fernwood"], landmarks: ["Inner Harbour", "Beacon Hill Park"], climate: "mild coastal winters with frequent rain" },
  Windsor: { neighborhoods: ["Walkerville", "Riverside"], landmarks: ["Detroit River", "Jackson Park"], climate: "hot humid summers and damp winter thaws" },
  Winnipeg: { neighborhoods: ["St. Boniface", "River Heights"], landmarks: ["Red River", "The Forks"], climate: "extreme winter cold and spring melt pressure" },
};

export function cityFactsFor(page: SeoPage) {
  return CITY_FACTS[cityFromTargetArea(page.targetArea)];
}

const faqOpeners = [
  "What should I do before your team arrives",
  "How does the first visit work",
  "Can you help with older homes or rental properties",
];

export function faqsFor(page: SeoPage) {
  const topic = pageLocation(page);
  return [
    {
      q: `${faqOpeners[0]} in ${topic}?`,
      a: `Start by making the area safe, noting any active leak or damage, and taking a few photos if it is safe to do so. When you call, share the location, any access limits, and what changed most recently so we can begin with the right priorities.`,
    },
    {
      q: `${faqOpeners[1]}?`,
      a: `We start by checking access, visible symptoms, and the immediate risk to your home or property. From there, we explain the next practical step — whether that means repair, cleanup, replacement, or a follow-up visit.`,
    },
    {
      q: `${faqOpeners[2]}?`,
      a: `Yes. We keep the process easy to follow and document, so owners, tenants, managers, or insurers can all stay informed. You get clear notes, not jargon.`,
    },
  ];
}
