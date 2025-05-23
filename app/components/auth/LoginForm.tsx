// "use client";

// import { useState, useRef } from "react";
// import Link from "next/link";
// import { FcGoogle } from "react-icons/fc";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { useAuthError } from "@/app/hooks/auth/use-auth-error";
// import { handleAuthError } from "@/app/lib/auth/auth-errors";

// interface LoginFormProps {
//   callbackUrl?: string;
//   error?: string;
// }

// export default function LoginForm({
//   callbackUrl = "/",
//   error: initialError,
// }: LoginFormProps) {
//   const emailRef = useRef<HTMLInputElement>(null);
//   const passwordRef = useRef<HTMLInputElement>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [formError, setFormError] = useState("");
//   const router = useRouter();
//   const { errorMessage, clearError } = useAuthError();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     clearError();
//     setFormError("");

//     const email = emailRef.current?.value || "";
//     const password = passwordRef.current?.value || "";

//     try {
//       const result = await signIn("credentials", {
//         redirect: false,
//         email,
//         password,
//       });

//       if (result?.error) {
//         setFormError(handleAuthError(result.error));
//       } else if (result?.ok) {
//         router.push(callbackUrl);
//       }
//     } catch (err) {
//       setFormError(handleAuthError(err));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md">
//       <div>
//         <h2 className="text-center text-3xl font-bold text-gray-900">
//           Sign in to your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Or{" "}
//           <Link
//             href="/register"
//             className="font-medium text-blue-600 hover:text-blue-500"
//           >
//             create a new account
//           </Link>
//         </p>
//       </div>

//       {formError && (
//         <Alert variant="destructive">
//           <AlertDescription>{formError}</AlertDescription>
//         </Alert>
//       )}

//       <form className="space-y-6" onSubmit={handleSubmit}>
//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="email">Email address</Label>
//             <Input
//               id="email"
//               name="email"
//               type="email"
//               autoComplete="email"
//               required
//               ref={emailRef}
//               className="mt-1"
//               placeholder="you@example.com"
//             />
//           </div>
//           <div>
//             <div className="flex items-center justify-between">
//               <Label htmlFor="password">Password</Label>
//               <Link
//                 href="/forgot-password"
//                 className="text-sm font-medium text-blue-600 hover:text-blue-500"
//               >
//                 Forgot your password?
//               </Link>
//             </div>
//             <Input
//               id="password"
//               name="password"
//               type="password"
//               autoComplete="current-password"
//               required
//               ref={passwordRef}
//               className="mt-1"
//             />
//           </div>
//         </div>

//         <Button type="submit" className="w-full" disabled={isLoading}>
//           {isLoading ? "Signing in..." : "Sign in"}
//         </Button>

//         <div className="relative flex items-center justify-center">
//           <div className="flex-grow border-t border-gray-300"></div>
//           <span className="mx-4 flex-shrink text-gray-600">
//             Or continue with
//           </span>
//           <div className="flex-grow border-t border-gray-300"></div>
//         </div>

//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => signIn("google", { callbackUrl })}
//           className="w-full"
//         >
//           <FcGoogle className="mr-2 h-5 w-5" />
//           Google
//         </Button>
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
import { useAuthError } from "@/app/hooks/auth/use-auth-error";
import { handleAuthError } from "@/app/lib/auth/auth-errors";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface LoginFormProps {
  callbackUrl?: string;
  error?: string;
}

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 8 characters" }),
});

type LoginData = z.infer<typeof loginSchema>;

export default function LoginForm({
  callbackUrl = "/",
  error: initialError,
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const router = useRouter();
  const { errorMessage, clearError } = useAuthError();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginData) => {
    setIsLoading(true);
    clearError();
    setFormError("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setFormError(handleAuthError(result.error));
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (err) {
      setFormError(handleAuthError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 rounded-lg bg-white p-6 shadow-md">
      <div>
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Or{" "}
          <Link
            href="/register"
            className="font-medium text-blue-600 hover:text-blue-500"
          >
            create a new account
          </Link>
        </p>
      </div>

      {(formError || errorMessage) && (
        <Alert variant="destructive">
          <AlertDescription>{formError || errorMessage}</AlertDescription>
        </Alert>
      )}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              className="mt-1"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              className="mt-1"
            />
            {errors.password && (
              <p className="text-sm text-red-600 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign in"}
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
          onClick={() => signIn("google", { callbackUrl })}
          className="w-full"
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          Google
        </Button>
      </form>
    </div>
  );
}
