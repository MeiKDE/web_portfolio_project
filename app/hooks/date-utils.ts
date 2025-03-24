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

// Add this function to calculate duration between two dates
// This is for the date display in the experience section
export const calculateDuration = (
  startDate: string,
  endDate: string
): string => {
  if (!endDate || endDate === "") return "";

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Calculate years and months
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();

  // Adjust if months is negative
  if (months < 0) {
    years--;
    months += 12;
  }

  // Format the duration string
  let durationStr = "";
  if (years > 0) {
    durationStr += `${years} ${years === 1 ? "yr" : "yrs"}`;
  }

  if (months > 0) {
    if (durationStr) durationStr += " ";
    durationStr += `${months} ${months === 1 ? "mo" : "mos"}`;
  }

  // If less than a month, show "< 1 mo"
  if (years === 0 && months === 0) {
    durationStr = "< 1 mo";
  }

  return durationStr;
};

// Format date fields for UI display in forms
export function formatDatesForUI<T>(
  items: T[] | null | undefined,
  dateFieldsConfig: {
    [key: string]: {
      useCurrentDateAsFallback?: boolean;
    };
  }
): T[] {
  if (!items) return [];

  try {
    return items.map((item) => {
      const formattedItem = { ...item };

      // Process each date field according to config
      Object.keys(dateFieldsConfig).forEach((fieldName) => {
        const config = dateFieldsConfig[fieldName];
        const value = (item as any)[fieldName];

        if (value) {
          (formattedItem as any)[fieldName] = formatDateForInput(value);
        } else if (config.useCurrentDateAsFallback) {
          (formattedItem as any)[fieldName] = getCurrentDate();
        } else {
          (formattedItem as any)[fieldName] = "";
        }
      });

      return formattedItem;
    });
  } catch (error) {
    console.error("Error formatting dates for UI:", error);
    return items;
  }
}

// For convenience, add specific formatters for your common entities
export function formatCertificationsForUI(
  certifications: any[] | null | undefined
) {
  return formatDatesForUI(certifications, {
    issueDate: { useCurrentDateAsFallback: true },
    expirationDate: { useCurrentDateAsFallback: false },
  });
}

export function formatExperiencesForUI(experiences: any[] | null | undefined) {
  return formatDatesForUI(experiences, {
    startDate: { useCurrentDateAsFallback: true },
    endDate: { useCurrentDateAsFallback: false },
  });
}

export function formatEducationForUI(education: any[] | null | undefined) {
  return formatDatesForUI(education, {
    startDate: { useCurrentDateAsFallback: true },
    endDate: { useCurrentDateAsFallback: false },
  });
}
