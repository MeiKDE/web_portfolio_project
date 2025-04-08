// import useSWR from "swr";

// // Updated fetcher with credentials for authenticated requests
// const fetcher = (url: string) =>
//   fetch(url, {
//     credentials: "include",
//   }).then((res) => res.json());

// // Generic data fetching hook for any authenticated API endpoint
// export function useAuthData(url: string | null) {
//   const { data, error, isLoading, mutate } = useSWR(url, fetcher);

//   return {
//     data,
//     isLoading,
//     isError: error,
//     mutate,
//   };
// }

// // User-specific hook based on the generic one
// export function useUser(id: string) {
//   const { data, isLoading, isError, mutate } = useAuthData(
//     id ? `/api/users/${id}` : null
//   );

//   return {
//     user: data,
//     isLoading,
//     isError,
//     mutate,
//   };
// }

// // New hook specifically for experiences
// export function useExperiences(userId: string) {
//   const { data, isLoading, isError, mutate } = useAuthData(
//     userId ? `/api/users/${userId}/experiences` : null
//   );

//   return {
//     experiences: data?.data || [],
//     isLoading,
//     isError,
//     mutate,
//   };
// }

// // ... remaining functions from lib/hooks/useUser.ts
