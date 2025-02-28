"use client"

import { useUser } from '@/lib/hooks/useUser';

export default function ProfilePage() {
  const { user, isLoading, isError } = useUser('user_id_here');
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error loading profile</div>;
  
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.title}</p>
      {/* Rest of your profile page */}
    </div>
  );
} 