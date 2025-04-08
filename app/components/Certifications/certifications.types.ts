import { BaseEntity, Institution } from "@/app/types/common.types";

export interface Certification extends BaseEntity, Institution {
  name: string;
  issueDate: string;
  expirationDate?: string;
  credentialUrl?: string;
  issuer: string; // Override optional issuer
}
