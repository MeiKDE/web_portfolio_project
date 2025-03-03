"use client"

import { useUser } from '@/lib/hooks/useUser';

export default function ProfilePage() {
  const { user, isLoading, isError } = useUser('cm7rqjkb50000mwp1311qx6m9');
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading profile</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.title}</p>
      <p>{user.location}</p>
      <p>{user.bio}</p>
      {user.profileImageUrl && <img src={user.profileImageUrl} alt={`${user.name}'s profile`} />}
      {/* Display other user information as needed */}
    </div>
  );
} 