"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  User,
  FileText,
  Briefcase,
  Mail,
  Menu,
  X,
  LogOut,
  LogIn,
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";

const menuItems = [
  { name: "Profile", href: "/", icon: User },
  { name: "Resume", href: "/resume-builder", icon: FileText },
  { name: "Portfolio", href: "/portfolio", icon: Briefcase },
  { name: "Contact", href: "/contact", icon: Mail },
];

export default function MenuBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <nav className="bg-background border-b">
      {/* Component implementation */}
    </nav>
  );
}
