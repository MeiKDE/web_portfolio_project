// "use client";

// import { useState, useRef } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { FcGoogle } from "react-icons/fc";
// import { signIn } from "next-auth/react";

// interface RegisterFormProps {
//   onSubmit: (formData: {
//     name: string;
//     email: string;
//     password: string;
//   }) => Promise<void>;
//   error?: string;
// }

// export default function RegisterForm({ onSubmit, error }: RegisterFormProps) {
//   const nameRef = useRef<HTMLInputElement>(null);
//   const emailRef = useRef<HTMLInputElement>(null);
//   const passwordRef = useRef<HTMLInputElement>(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       await onSubmit({
//         name: nameRef.current?.value || "",
//         email: emailRef.current?.value || "",
//         password: passwordRef.current?.value || "",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
//       <div>
//         <h2 className="text-center text-3xl font-bold text-gray-900">
//           Create your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Or{" "}
//           <Link
//             href="/login"
//             className="font-medium text-blue-600 hover:text-blue-500"
//           >
//             sign in to your account
//           </Link>
//         </p>
//       </div>

//       {error && (
//         <div className="rounded-md bg-red-50 p-4">
//           <div className="text-sm text-red-700">{error}</div>
//         </div>
//       )}

//       <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//         <div className="space-y-4 rounded-md shadow-sm">
//           <div>
//             <label htmlFor="name" className="sr-only">
//               Full Name
//             </label>
//             <input
//               id="name"
//               name="name"
//               type="text"
//               required
//               ref={nameRef}
//               className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
//               placeholder="Full Name"
//             />
//           </div>
//           <div>
//             <label htmlFor="email-address" className="sr-only">
//               Email address
//             </label>
//             <input
//               id="email-address"
//               name="email"
//               type="email"
//               autoComplete="email"
//               required
//               ref={emailRef}
//               className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
//               placeholder="Email address"
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="sr-only">
//               Password
//             </label>
//             <input
//               id="password"
//               name="password"
//               type="password"
//               autoComplete="new-password"
//               required
//               ref={passwordRef}
//               className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
//               placeholder="Password"
//             />
//           </div>
//         </div>

//         <div>
//           <button
//             type="submit"
//             disabled={loading}
//             className="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             {loading ? "Creating account..." : "Sign up"}
//           </button>
//         </div>

//         <div className="relative flex items-center justify-center">
//           <div className="flex-grow border-t border-gray-300"></div>
//           <span className="mx-4 flex-shrink text-gray-600">
//             Or continue with
//           </span>
//           <div className="flex-grow border-t border-gray-300"></div>
//         </div>

//         <div>
//           <button
//             type="button"
//             onClick={() => signIn("google", { callbackUrl: "/profile" })}
//             className="group relative flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             <span className="mr-2">
//               <FcGoogle className="h-5 w-5" />
//             </span>
//             Google
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface RegisterFormProps {
  onSubmit: (formData: {
    name: string;
    email: string;
    password: string;
  }) => Promise<void>;
  error?: string;
}

const registerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 8 characters" }),
});

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterForm({ onSubmit, error }: RegisterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema),
  });

  const handleFormSubmit = async (data: RegisterData) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-6 shadow-md">
      <div>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            sign in to your account
          </Link>
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form
        className="mt-8 space-y-6"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="space-y-4 rounded-md shadow-sm">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              {...register("name")}
              placeholder="Full Name"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              placeholder="Email address"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete="new-password"
              {...register("password")}
              placeholder="Password"
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Creating account..." : "Sign up"}
        </Button>

        <div className="relative flex items-center justify-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 flex-shrink text-gray-600">
            Or continue with
          </span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={() => signIn("google", { callbackUrl: "/profile" })}
          className="w-full"
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Google
        </Button>
      </form>
    </div>
  );
}
