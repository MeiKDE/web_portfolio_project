import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => {
  console.log("ln4: response from fetcher", res);
  return res.json()});


// EXPORT functions can be imported and used in other files.
export function useUser(id: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/users/${id}` : null,
    fetcher
  );
  console.log("ln12: check if id exist from userUser.ts of useUser function", id);
  console.log("ln13: data from useUser.ts of useUser function", data);
  console.log("ln14: error from useUser.ts of useUser function", error);

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// EXPORT functions can be imported and used in other files.
export function useUpdateUser() {
  return async (id: string, userData: any) => {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json', // tells the server that the body of the request is in JSON format.
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to update user');
    }
    
    return response.json();
  };
} 