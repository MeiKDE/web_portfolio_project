import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    title?: string | null;
    location?: string | null;
    phone?: string | null;
    bio?: string | null;
    // Add any other fields you need
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      title?: string | null;
      location?: string | null;
      phone?: string | null;
      bio?: string | null;
      // Add any other fields you need
    };
  }
}

// If you're using JWT strategy, also extend the JWT type
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    title?: string | null;
    location?: string | null;
    phone?: string | null;
    bio?: string | null;
    // Add any other fields you need
  }
}
