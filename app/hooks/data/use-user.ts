import useSWR from "swr";

// Enhanced fetcher with credentials and error handling
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    credentials: "include", // Include credentials for authenticated requests
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return response.json();
};

// Generic authenticated data fetching hook
export function useAuthData<T>(url: string | null) {
  const { data, error, isLoading, mutate } = useSWR<T>(url, fetcher, {
    revalidateOnFocus: false, // Prevent unnecessary revalidation
  });

  return {
    data,
    isLoading,
    isError: !!error,
    error,
    mutate,
  };
}

// User-specific hook
export function useUser(id: string | null) {
  const { data, isLoading, isError, error, mutate } = useAuthData(
    id ? `/api/users/${id}` : null
  );

  return {
    user: data,
    isLoading,
    isError,
    error,
    mutate,
  };
}

// Hook for updating user data
export function useUpdateUser() {
  return async (id: string, userData: any) => {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return response.json();
  };
}

// Hook for deleting user
export function useDeleteUser() {
  return async (id: string) => {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    return response.json();
  };
}

// Hook for current user data
export function useCurrentUser() {
  const { data, isLoading, isError, error, mutate } =
    useAuthData("/api/auth/user");

  return {
    user: data,
    isLoading,
    isError,
    error,
    mutate,
  };
}

// Hook for user profile data
export function useUserProfile(id: string | null) {
  const { data, isLoading, isError, error, mutate } = useAuthData(
    id ? `/api/users/${id}/profile` : null
  );

  return {
    profile: data,
    isLoading,
    isError,
    error,
    mutate,
  };
}
