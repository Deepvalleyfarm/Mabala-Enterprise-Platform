export interface Tenant {
  id: string;
  name: string;
  type: "Farm" | "Cooperative" | "Veterinary_Clinic" | "Agribusiness";
  plan: "Seedling" | "Grower" | "Harvest" | "Unlimited";
  status: "Trial" | "Active" | "Suspended";
  credits: number;
  modules: string[];
  storageUsedGB: number;
  createdAt: string;
}

export interface User {
  uid: string;
  tenantId: string;
  email: string;
  role: "Platform_Admin" | "Tenant_Admin" | "Farm_Manager" | "Accountant" | "Veterinarian" | "Extension_Officer" | "Auditor" | "Support_Agent";
  mfaEnforced: boolean;
  status: "Active" | "Inactive";
  createdAt: string;
}

export interface CropCycle {
  id: string;
  tenantId: string;
  fieldName: string;
  cropCategory: "Cereals" | "Legumes" | "Cash_Crops" | "Horticulture" | "Fruits";
  cropName: string;
  acreage: number;
  status: "Planned" | "Planted" | "Harvested";
  plantingDate: string;
  expectedHarvest: string;
  inputCosts: number;
  yieldPerHectare: number;
  diseaseStatus: string;
  updatedAt: string;
}

export interface Livestock {
  id: string;
  tagId: string;
  tenantId: string;
  breed: string;
  category: "Cattle" | "Sheep" | "Goats" | "Pigs";
  birthDate: string;
  healthStatus: "Healthy" | "Treatment" | "Quarantine";
  vaccinationCompleted: boolean;
  updatedAt: string;
}

export interface PoultryBatch {
  id: string;
  tenantId: string;
  batchName: string;
  type: "Broilers" | "Layers" | "Village_Chickens";
  birdCount: number;
  mortality: number;
  feedConsumedKG: number;
  eggCount: number;
  updatedAt: string;
}

export interface FishPond {
  id: string;
  tenantId: string;
  name: string;
  category: "Tilapia" | "Catfish";
  fingerlingsCount: number;
  biomass: number;
  mortality: number;
  updatedAt: string;
}

export interface AccountingRecord {
  id: string;
  tenantId: string;
  type: "Income" | "Expense";
  category: string;
  amount: number;
  description: string;
  complianceSRA: boolean;
  date: string;
}

export interface SupportTicket {
  id: string;
  tenantId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: "Open" | "In_Progress" | "Resolved";
  reply: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  email: string;
  action: string;
  tenantId: string;
  device: string;
  ipAddress: string;
  timestamp: string;
}

export interface AiTokenAccess {
  id: string;
  tenantId: string;
  promptType: string;
  costUSD: number;
  timestamp: string;
}

export interface AdCampaign {
  id: string;
  name: string;
  supplier: string;
  impressions: number;
  clicks: number;
  revenueUSD: number;
  status: "Active" | "Paused" | "Scheduled";
}
