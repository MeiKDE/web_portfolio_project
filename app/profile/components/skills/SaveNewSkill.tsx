import { z } from "zod";

const skillSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  proficiencyLevel: z.number().min(1).max(5),
});

interface SkillFormValues {
  name: string;
  category: string;
  proficiencyLevel: number;
}

export const SaveNewSkill = async (
  postData: SkillFormValues
): Promise<void> => {
  try {
    const response = await fetch(`/api/skills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(postData),
    });

    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      let errorMessage = "Failed to create skill";

      if (contentType?.includes("application/json")) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
        }
      }

      throw new Error(errorMessage);
    }

    // Only parse response if there's content
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 0) {
      await response.json();
    }
  } catch (error) {
    console.error("Save error:", error);
    throw error;
  }
};
