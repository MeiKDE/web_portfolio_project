export const SaveNewSkill = async (
  e: React.FormEvent,
  validateForm: () => boolean,
  values: any,
  touchField: (field: string) => void,
  mutate: () => Promise<any>,
  resetForm: () => void,
  cancelAddingNew: () => void
) => {
  e.preventDefault();

  console.log("Attempting to save skill with values:", values);

  if (!validateForm()) {
    console.log("Form validation failed");
    Object.keys(values).forEach((key) => {
      touchField(key);
    });
    return;
  }

  try {
    const requestBody = {
      name: values.name.trim(),
      category: values.category.trim(),
      proficiencyLevel: parseInt(values.proficiencyLevel.toString()),
    };

    console.log("ln31: Sending request with body:", requestBody);

    // Create a new skill, userId is not needed for this endpoint
    const response = await fetch(`/api/skills`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(requestBody),
    });

    console.log("ln42: Response:", response);
    console.log("ln43: Response body:", response.body);
    console.log("ln44: Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const contentType = response.headers.get("content-type");
      let errorMessage = "Failed to create skill";

      if (contentType?.includes("application/json")) {
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
        }
      } else {
        const textError = await response.text();
        console.error("Non-JSON error response:", textError);
      }

      throw new Error(errorMessage);
    }

    // Don't try to parse the response if it's empty
    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 0) {
      await response.json();
    }

    // Check if mutate is a function before calling
    if (typeof mutate === "function") {
      await mutate();
    } else {
      console.warn("Mutate is not a function:", mutate);
    }

    resetForm();
    cancelAddingNew();
  } catch (error) {
    console.error("Save error:", error);
    throw error;
  }
};
