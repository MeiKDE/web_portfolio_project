export interface Experience {
  id: string;
  userId: string;
  companyName: string;
  position: string;
  startDate: string; // ISO date string format
  endDate?: string; // Optional for current positions
  isCurrentPosition: boolean;
  description: string;
  location?: string;
  changed?: boolean; // For tracking UI state changes
}
