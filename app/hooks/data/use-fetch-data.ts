import useSWR from "swr";

// Improved fetcher function with error handling
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    credentials: "include",
  });

  // Check if the request was successful
  if (!response.ok) {
    // Create an error object with details from the response
    const error = new Error(
      `An error occurred while fetching the data: ${response.statusText}`
    );
    // Add status and info from response to the error
    (error as any).status = response.status;

    // Try to parse error details if available
    try {
      (error as any).info = await response.json();
    } catch (e) {
      // If parsing fails, just use the status text
      (error as any).info = response.statusText;
    }

    throw error;
  }

  return response.json();
};

export function useFetchData<T>(url: string | null) {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: false,
  });

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}
