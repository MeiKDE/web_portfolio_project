import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUser(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/users/${id}` : null,
    fetcher
  );

  console.log("ln11: data from useUser.ts", data);

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
}

export function useUpdateUser() {
  return async (id: string, userData: any) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    
    return response.json();
  };
} 