// Format date to yyyy-MM-dd for input fields
export const formatDateForInput = (isoDate: string) => {
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Format date to ISO-8601 format for database
export const formatDateForDatabase = (date: string) => {
  const d = new Date(date);
  return d.toISOString(); // Converts to ISO-8601 format
};

// Get current date in YYYY-MM-DD format for date input max attribute
export const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Format date for display (Month Year)
export const formatDateForDisplay = (isoDate: string) => {
  const date = new Date(isoDate);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

// Calculate duration between two dates
export const calculateDuration = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const years = end.getFullYear() - start.getFullYear();
  const months = end.getMonth() - start.getMonth();

  let totalMonths = years * 12 + months;

  if (totalMonths < 1) return "Less than a month";
  if (totalMonths < 12)
    return `${totalMonths} month${totalMonths > 1 ? "s" : ""}`;

  const displayYears = Math.floor(totalMonths / 12);
  const displayMonths = totalMonths % 12;

  let result = `${displayYears} year${displayYears > 1 ? "s" : ""}`;
  if (displayMonths > 0) {
    result += ` ${displayMonths} month${displayMonths > 1 ? "s" : ""}`;
  }

  return result;
};
