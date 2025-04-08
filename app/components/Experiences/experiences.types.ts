import {
  BaseEntity,
  TrackableUI,
  DateRange,
  Describable,
} from "@/app/types/common.types";

export interface Experience
  extends BaseEntity,
    TrackableUI,
    DateRange,
    Describable {
  companyName: string;
  position: string;
  isCurrentPosition: boolean;
  location?: string;
}
