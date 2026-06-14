import { Tenant, User, CropCycle, Livestock, PoultryBatch, FishPond, AccountingRecord, SupportTicket, AuditLog, AdCampaign } from "./types";

export const CROP_CATEGORIES = {
  Cereals: ["Maize", "Wheat", "Rice", "Millet", "Sorghum"],
  Legumes: ["Soybeans", "Groundnuts", "Beans", "Cowpeas"],
  Cash_Crops: ["Tobacco", "Cotton", "Coffee", "Sugarcane"],
  Horticulture: ["Vegetables", "Tomatoes", "Onions", "Cabbage"],
  Fruits: ["Citrus", "Mangoes", "Bananas", "Avocados"]
};

export const LIVESTOCK_BREEDS = {
  Cattle: ["Boran", "Angoni", "Brahman", "Holstein Friesian"],
  Sheep: ["Dorper", "Blackhead Persian"],
  Goats: ["Boer Goat", "Galla", "Local Zambian"],
  Pigs: ["Large White", "Landrace", "Duroc"]
};

export const POULTRY_TYPES = ["Broilers", "Layers", "Village_Chickens"];
export const AQUACULTURE_SPECIES = ["Tilapia", "Catfish"];

export interface PlatformStats {
  totalTenants: number;
  activeTenants: number;
  trialTenants: number;
  suspendedTenants: number;
  totalUsers: number;
  totalFarms: number;
  totalCredits: number;
  totalAcreage: number;
  totalAnimals: number;
  totalBirds: number;
  totalFish: number;
  revenue: {
    subscriptions: number;
    credits: number;
    veterinary: number;
    advertising: number;
    marketplace: number;
    total: number;
  };
  observability: {
    apiRequests: number;
    dbPingMs: number;
    errorRate: number;
    notificationVolume: number;
  };
}

// Default Seed Data to populating Firestore on first load
export const INITIAL_TENANTS: Tenant[] = [
  {
    id: "tenant-mufulira-coop",
    name: "Mufulira Smallholder Cooperative",
    type: "Cooperative",
    plan: "Harvest",
    status: "Active",
    credits: 8250,
    modules: ["Crops", "Accounting", "Cooperative"],
    storageUsedGB: 4.8,
    createdAt: "2026-01-10T12:00:00Z"
  },
  {
    id: "tenant-safari-farms",
    name: "Safari Zambezi Farming Group",
    type: "Farm",
    plan: "Unlimited",
    status: "Active",
    credits: 17400,
    modules: ["Crops", "Livestock", "Poultry", "Fish_Farming", "Accounting"],
    storageUsedGB: 15.2,
    createdAt: "2026-02-14T08:30:00Z"
  },
  {
    id: "tenant-lusaka-vet",
    name: "Chaminuka Veterinary Clinic Services",
    type: "Veterinary_Clinic",
    plan: "Grower",
    status: "Active",
    credits: 1200,
    modules: ["Vet_Services", "Accounting"],
    storageUsedGB: 1.5,
    createdAt: "2026-03-01T15:45:00Z"
  },
  {
    id: "tenant-kasama-agro",
    name: "Kasama Agribusiness Hub Ltd",
    type: "Agribusiness",
    plan: "Seedling",
    status: "Active",
    credits: 450,
    modules: ["Sales", "Inventory", "Accounting"],
    storageUsedGB: 0.9,
    createdAt: "2026-04-12T10:15:00Z"
  },
  {
    id: "tenant-mazabuka-sugar",
    name: "Mazabuka Sugar Cane Estates",
    type: "Farm",
    plan: "Harvest",
    status: "Suspended",
    credits: 0,
    modules: ["Crops", "Accounting"],
    storageUsedGB: 8.4,
    createdAt: "2026-01-20T09:00:00Z"
  }
];

export const INITIAL_CROP_CYCLES: CropCycle[] = [
  {
    id: "crop-1",
    tenantId: "tenant-mufulira-coop",
    fieldName: "North Field A",
    cropCategory: "Cereals",
    cropName: "Maize (White Pioneer)",
    acreage: 450,
    status: "Planted",
    plantingDate: "2026-05-15T00:00:00Z",
    expectedHarvest: "2026-10-15T00:00:00Z",
    inputCosts: 3500,
    yieldPerHectare: 7.2,
    diseaseStatus: "None (Healthy)",
    updatedAt: "2026-06-12T08:00:00Z"
  },
  {
    id: "crop-2",
    tenantId: "tenant-safari-farms",
    fieldName: "Irrigation Zone 1",
    cropCategory: "Legumes",
    cropName: "Soybeans (Safari Special)",
    acreage: 320,
    status: "Planted",
    plantingDate: "2026-05-01T00:00:00Z",
    expectedHarvest: "2026-09-01T00:00:00Z",
    inputCosts: 4200,
    yieldPerHectare: 4.1,
    diseaseStatus: "Mild Rust (Sprayed)",
    updatedAt: "2026-06-10T14:30:00Z"
  },
  {
    id: "crop-3",
    tenantId: "tenant-safari-farms",
    fieldName: "South Ridge Land",
    cropCategory: "Cash_Crops",
    cropName: "Cotton (African Leaf)",
    acreage: 180,
    status: "Planned",
    plantingDate: "2026-06-25T00:00:00Z",
    expectedHarvest: "2026-12-10T00:00:00Z",
    inputCosts: 1800,
    yieldPerHectare: 0,
    diseaseStatus: "None",
    updatedAt: "2026-06-14T01:00:00Z"
  },
  {
    id: "crop-4",
    tenantId: "tenant-mufulira-coop",
    fieldName: "Greenhouse Alpha",
    cropCategory: "Horticulture",
    cropName: "Tomatoes (Moneymaker)",
    acreage: 25,
    status: "Harvested",
    plantingDate: "2026-03-01T00:00:00Z",
    expectedHarvest: "2026-06-05T00:00:00Z",
    inputCosts: 1200,
    yieldPerHectare: 35.5,
    diseaseStatus: "None",
    updatedAt: "2026-06-05T17:00:00Z"
  }
];

export const INITIAL_LIVESTOCK: Livestock[] = [
  {
    id: "live-1",
    tagId: "RFID-ZM-94028",
    tenantId: "tenant-safari-farms",
    breed: "Boran Bulls",
    category: "Cattle",
    birthDate: "2024-04-15",
    healthStatus: "Healthy",
    vaccinationCompleted: true,
    updatedAt: "2026-06-11T12:00:00Z"
  },
  {
    id: "live-2",
    tagId: "RFID-ZM-94119",
    tenantId: "tenant-safari-farms",
    breed: "Brahman Heifers",
    category: "Cattle",
    birthDate: "2024-11-20",
    healthStatus: "Treatment",
    vaccinationCompleted: false,
    updatedAt: "2026-06-13T09:15:00Z"
  },
  {
    id: "live-3",
    tagId: "RFID-ZM-38491",
    tenantId: "tenant-safari-farms",
    breed: "Dorper Sheep",
    category: "Sheep",
    birthDate: "2025-05-02",
    healthStatus: "Healthy",
    vaccinationCompleted: true,
    updatedAt: "2026-06-08T10:00:00Z"
  }
];

export const INITIAL_POULTRY: PoultryBatch[] = [
  {
    id: "poul-1",
    tenantId: "tenant-safari-farms",
    batchName: "Broiler Batch 18B",
    type: "Broilers",
    birdCount: 4500,
    mortality: 112,
    feedConsumedKG: 14200,
    eggCount: 0,
    updatedAt: "2026-06-13T16:00:00Z"
  },
  {
    id: "poul-2",
    tenantId: "tenant-safari-farms",
    batchName: "Layer Enclosure 4G",
    type: "Layers",
    birdCount: 3000,
    mortality: 45,
    feedConsumedKG: 9800,
    eggCount: 28400,
    updatedAt: "2026-06-14T08:00:00Z"
  }
];

export const INITIAL_FISH_PONDS: FishPond[] = [
  {
    id: "pond-1",
    tenantId: "tenant-safari-farms",
    name: "Lusaka River Cage 1",
    category: "Tilapia",
    fingerlingsCount: 15000,
    biomass: 3450,
    mortality: 210,
    updatedAt: "2026-06-14T06:30:00Z"
  },
  {
    id: "pond-2",
    tenantId: "tenant-safari-farms",
    name: "Breeding Tank B",
    category: "Catfish",
    fingerlingsCount: 8000,
    biomass: 1980,
    mortality: 95,
    updatedAt: "2026-06-12T11:45:00Z"
  }
];

export const INITIAL_ACCOUNTING: AccountingRecord[] = [
  {
    id: "acc-1",
    tenantId: "tenant-mufulira-coop",
    type: "Income",
    category: "Cash Crop Sales",
    amount: 14800,
    description: "Export transaction of White Maize to Milling Group",
    complianceSRA: true,
    date: "2026-06-02T11:00:00Z"
  },
  {
    id: "acc-2",
    tenantId: "tenant-mufulira-coop",
    type: "Expense",
    category: "Chemical Application",
    amount: 3200,
    description: "Anti-fungicide sprays purchase and logistics",
    complianceSRA: true,
    date: "2026-06-05T14:20:00Z"
  },
  {
    id: "acc-3",
    tenantId: "tenant-safari-farms",
    type: "Income",
    category: "Livestock Sales",
    amount: 23500,
    description: "Boran Stud trade with Kasama Breeder Organization",
    complianceSRA: true,
    date: "2026-06-10T10:00:00Z"
  },
  {
    id: "acc-4",
    tenantId: "tenant-safari-farms",
    type: "Expense",
    category: "Fuel & Irrigation",
    amount: 4500,
    description: "Zambia Electricity (ZESCO) power station credits purchase",
    complianceSRA: true,
    date: "2026-06-12T16:45:00Z"
  }
];

export const INITIAL_SUPPORT: SupportTicket[] = [
  {
    id: "ticket-1",
    tenantId: "tenant-mufulira-coop",
    userName: "Aaron Tembo",
    userEmail: "tembo@mufuliracoop.zm",
    subject: "MFA Authentication issue on Mobile App",
    message: "We activated MFA mandatory setting across our cooperative field agents last night. Some of our remote inspectors inside North-West districts are not receiving SMS setup codes. What is the alternative backup code strategy?",
    status: "Open",
    reply: "",
    createdAt: "2026-06-13T17:30:00Z"
  },
  {
    id: "ticket-2",
    tenantId: "tenant-safari-farms",
    userName: "Priscilla Chansa",
    userEmail: "p.chansa@safarifarms.co.zm",
    subject: "Credits deducted for aborted disease AI scan",
    message: "Our agronomist ran an AI diagnostic analysis on an Avocado crop segment. The file connection failed midway, but 25 credits were deducted from our ledger. Kindly refund or check API operations status.",
    status: "In_Progress",
    reply: "Greetings Priscilla, MEAP-AI logs have flagged a latency spike during the upload. We are tracing the event payload and have tentatively queued credit recovery.",
    createdAt: "2026-06-14T02:15:00Z"
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: "log-1",
    userId: "sysadmin-1",
    email: "shikasuli@gmail.com",
    action: "SUSPENDED_TENANT",
    tenantId: "tenant-mazabuka-sugar",
    device: "Chrome / Windows Server Console",
    ipAddress: "197.211.53.11",
    timestamp: "2026-06-14T06:00:00Z"
  },
  {
    id: "log-2",
    userId: "sysadmin-1",
    email: "shikasuli@gmail.com",
    action: "ADJUST_CREDITS",
    tenantId: "tenant-safari-farms",
    device: "Chrome / ChromeOS Terminal",
    ipAddress: "197.211.53.11",
    timestamp: "2026-06-14T08:10:00Z"
  },
  {
    id: "log-3",
    userId: "farmer-safari",
    email: "safari-operations@gmail.com",
    action: "CROP_CYCLE_PLANTED",
    tenantId: "tenant-safari-farms",
    device: "Safari / Apple iPad",
    ipAddress: "41.139.12.84",
    timestamp: "2026-06-14T08:45:00Z"
  }
];

export const INITIAL_ADS: AdCampaign[] = [
  {
    id: "ad-1",
    name: "Pioneer Seed Stocking Discount",
    supplier: "Corteva Agriscience Zambia",
    impressions: 489000,
    clicks: 12400,
    revenueUSD: 3680,
    status: "Active"
  },
  {
    id: "ad-2",
    name: "Super-D Feed Mix Launch",
    supplier: "Tiger Feeds Zambia Ltd",
    impressions: 215000,
    clicks: 5800,
    revenueUSD: 1950,
    status: "Active"
  },
  {
    id: "ad-3",
    name: "John Deere Electric Harvesters",
    supplier: "AFGRI Equipment Zambia",
    impressions: 0,
    clicks: 0,
    revenueUSD: 1200,
    status: "Scheduled"
  }
];

export const INITIAL_USERS: User[] = [
  {
    uid: "sys-operator-110",
    tenantId: "system-wide",
    email: "shikasuli@gmail.com",
    role: "Platform_Admin",
    mfaEnforced: true,
    status: "Active",
    createdAt: "2026-06-14T08:00:00Z"
  },
  {
    uid: "safari-m1",
    tenantId: "tenant-safari-farms",
    email: "safari.mgr@mabala.zm",
    role: "Farm_Manager",
    mfaEnforced: false,
    status: "Active",
    createdAt: "2026-06-14T08:15:00Z"
  },
  {
    uid: "lusaka-v1",
    tenantId: "tenant-lusaka-coop",
    email: "lusaka.vet@mabala.zm",
    role: "Veterinarian",
    mfaEnforced: true,
    status: "Active",
    createdAt: "2026-06-14T08:30:00Z"
  }
];

// Calculation utility for global stats based on fully populated client collections
export function computeGlobalStats(
  tenants: Tenant[],
  crops: CropCycle[],
  livestock: Livestock[],
  poultry: PoultryBatch[],
  fish: FishPond[],
  ads: AdCampaign[]
): PlatformStats {
  const totTenants = tenants.length;
  const actTenants = tenants.filter(t => t.status === "Active").length;
  const triTenants = tenants.filter(t => t.status === "Trial").length;
  const susTenants = tenants.filter(t => t.status === "Suspended").length;
  
  // Total user estimate based on tenants
  const totUsers = actTenants * 15 + triTenants * 3 + susTenants;

  let totalFarms = tenants.filter(t => t.type === "Farm" || t.type === "Cooperative").length;
  let totalCredits = tenants.reduce((acc, t) => acc + t.credits, 0);
  let totalAcreage = crops.reduce((acc, c) => acc + (c.status !== "Harvested" ? c.acreage : 0), 0);
  let totalAnimals = livestock.filter(l => l.healthStatus !== "Quarantine").length;
  let totalBirds = poultry.reduce((acc, p) => acc + (p.birdCount - p.mortality), 0);
  let totalFish = fish.reduce((acc, f) => acc + (f.fingerlingsCount - f.mortality), 0);

  // Financial components
  // Subscriptions estimated from tenant plans
  // Seedling: $49/mo, Grower: $149/mo, Harvest: $299/mo, Unlimited: $699/mo
  const subsRevenue = tenants.reduce((acc, t) => {
    if (t.status !== "Active") return acc;
    const base = t.plan === "Seedling" ? 49 : t.plan === "Grower" ? 149 : t.plan === "Harvest" ? 299 : 699;
    return acc + base * 6; // cumulative representing estimate
  }, 0);

  // Credit pricing model: $0.10 per credit
  const creditRevenue = tenants.reduce((acc, t) => acc + (t.credits * 0.10), 0);
  const adsRevenue = ads.reduce((acc, a) => acc + a.revenueUSD, 0);
  // Fixed estimations plus some dynamic metrics
  const vetRevenue = livestock.length * 125;
  const marketplaceRev = (totalBirds + totalFish) * 0.05;

  const totalRevenue = subsRevenue + creditRevenue + adsRevenue + vetRevenue + marketplaceRev;

  return {
    totalTenants: totTenants,
    activeTenants: actTenants,
    trialTenants: triTenants,
    suspendedTenants: susTenants,
    totalUsers: totUsers,
    totalFarms,
    totalCredits,
    totalAcreage,
    totalAnimals,
    totalBirds,
    totalFish,
    revenue: {
      subscriptions: Math.round(subsRevenue),
      credits: Math.round(creditRevenue),
      veterinary: Math.round(vetRevenue),
      advertising: Math.round(adsRevenue),
      marketplace: Math.round(marketplaceRev),
      total: Math.round(totalRevenue)
    },
    observability: {
      apiRequests: 843920,
      dbPingMs: 45,
      errorRate: 0.14,
      notificationVolume: 128450
    }
  };
}
