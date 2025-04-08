// Base interface for all entities
export interface BaseEntity {
  id: string;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Interface for items that need UI state tracking
export interface TrackableUI {
  changed?: boolean;
}

// Interface for items with date ranges
export interface DateRange {
  startDate: string; // ISO date string format
  endDate?: string; // Optional end date
}

// Interface for educational/certification institutions
export interface Institution {
  institution?: string;
  institutionLogoUrl?: string;
  issuer?: string;
}

// Interface for items with descriptions
export interface Describable {
  description?: string;
}
