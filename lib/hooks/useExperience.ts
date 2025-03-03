import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useExperiences(userId: string) {
  const { data, error, isLoading, mutate } = useSWR(
    userId ? `/api/users/${userId}/experiences` : null,
    fetcher
  );

  return {
    experiences: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useCreateExperience() {
  return async (userId: string, experienceData: any) => {
    const response = await fetch(`/api/users/${userId}/experiences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(experienceData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create experience');
    }
    
    return response.json();
  };
}

export function useUpdateExperience() {
  return async (userId: string, experienceData: any) => {
    const response = await fetch(`/api/experiences/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(experienceData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update experience');
    }
    
    return response.json();
  };
}

export function useDeleteExperience() {
  return async (userId: string) => {
    const response = await fetch(`/api/experiences/${userId}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete experience');
    }
    
    return response.json();
  };
} 