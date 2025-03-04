# useUser.ts

This file implements data fetching using the [SWR](https://swr.vercel.app/) library from Vercel. SWR is a React hook for data fetching that provides a simple and efficient way to manage remote data in your application.

## Key Functionalities of SWR

- **Fast, lightweight, and reusable data fetching**: Efficiently fetch data with minimal overhead.
- **Built-in cache and request deduplication**: Reduces redundant requests and improves performance.
- **Real-time experience**: Supports revalidation on focus and network recovery for up-to-date data.
- **Polling, pagination, and scroll position recovery**: Advanced features for dynamic data handling.
- **Server-side rendering (SSR) and static site generation (SSG)**: Compatible with modern rendering techniques.
- **Local mutation (Optimistic UI)**: Update the UI instantly before the server responds.
- **Built-in smart error retry**: Automatically retries failed requests with intelligent backoff.
- **TypeScript support**: Fully typed for a better development experience.
- **Integration with React Suspense and React Native**: Works seamlessly with Suspense and mobile apps.

## Quick Start Example

Below is an example of how to use the `useSWR` hook in a React component to fetch data from an API:

```tsx
import useSWR from 'swr';

// Fetcher function to retrieve data from an API
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function UserProfile() {
  // Use the useSWR hook with a key (API URL) and fetcher
  const { data, isLoading, error } = useSWR('/api/user', fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {data.name}</p>
      <p>Email: {data.email}</p>
    </div>
  );
}

export default UserProfile;



# Custom User Hooks

This file defines two custom React hooks for managing user data in a React application: `useUser` and `useUpdateUser`. These hooks leverage the [SWR](https://swr.vercel.app/) library for efficient data fetching and state management.

## `useUser` Hook

The `useUser` hook fetches user data from an API using the `useSWR` hook from the SWR library.

### Features
- Fetches user data based on an optional `id` parameter.
- Uses a `fetcher` function to handle the API request and parse the response as JSON.
- Automatically manages loading states, errors, and data updates.

### Usage
If an `id` is provided, it fetches data from `/api/users/{id}`. Otherwise, it can be adapted based on your API structure.

### Returns
- **`user`**: The fetched user data (e.g., `{ id, name, email }`).
- **`isLoading`**: A boolean indicating whether the data is still being fetched.
- **`isError`**: An error object if the request fails.
- **`mutate`**: A function to manually trigger a data update in the cache.

### Example
```tsx
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useUser(id?: string) {
  const { data, error, isLoading, mutate } = useSWR(
    id ? `/api/users/${id}` : null,
    fetcher
  );

  return {
    user: data,
    isLoading,
    isError: error,
    mutate,
  };
}

// Usage in a component
function UserProfile({ userId }: { userId: string }) {
  const { user, isLoading, isError } = useUser(userId);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {isError.message}</div>;

  return <div>Name: {user.name}</div>;
}

# `useUpdateUser` Hook

The `useUpdateUser` hook updates user data on the server by sending a PUT request.

## Features
- Takes an `id` and `userData` as arguments to update a specific user.
- Sends a PUT request to `/api/users/{id}` with the updated data.
- Handles errors by throwing an exception if the request fails.

## Arguments
- **`id`**: The ID of the user to update (string).
- **`userData`**: An object containing the updated user data (e.g., `{ name, email }`).

## Returns
- The updated user data if the request is successful.

## Example
```tsx
export async function useUpdateUser(id: string, userData: object) {
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

  return await response.json();
}

// Usage in a component
async function updateUserProfile() {
  try {
    const updatedUser = await useUpdateUser('123', { name: 'New Name' });
    console.log('User updated:', updatedUser);
  } catch (error) {
    console.error(error.message);
  }
}