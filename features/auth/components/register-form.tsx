"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas/auth.schema";
import { ROUTES } from "@/constants/routes";
import type { ApiError } from "@/types/api.types";

export function RegisterForm() {
  const { register: registerUser, isRegistering } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const busy = isRegistering || isSubmitting;

  async function onSubmit(values: RegisterFormValues) {
    if (busy) return;
    setFormError(null);
    try {
      await registerUser({
        fullName: values.fullName,
        email: values.email,
        userName: values.userName,
        password: values.password,
        phoneNumber: values.phoneNumber || undefined,
        currency: values.currency || undefined,
      });
      router.replace(ROUTES.dashboard);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 409) {
        setError("email", { message: "This email is already registered." });
      } else if (apiError.status === 429) {
        setFormError("Too many attempts. Please wait a moment before trying again.");
      } else {
        setFormError(apiError.message || "Unable to register. Please try again.");
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="flex flex-col gap-4 rounded-lg border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div>
        <h1 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Create an account</h1>
        <p className="mt-1 text-sm text-zinc-500">Fill in your details to get started.</p>
      </div>

      {formError && (
        <p role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-300">
          {formError}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="fullName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Full name
        </label>
        <input
          id="fullName"
          type="text"
          autoComplete="name"
          aria-invalid={Boolean(errors.fullName)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          {...register("fullName")}
        />
        {errors.fullName && <p className="text-xs text-red-600">{errors.fullName.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="userName" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Username
        </label>
        <input
          id="userName"
          type="text"
          autoComplete="username"
          aria-invalid={Boolean(errors.userName)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          {...register("userName")}
        />
        {errors.userName && <p className="text-xs text-red-600">{errors.userName.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="phoneNumber" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Phone number <span className="text-zinc-400">(optional)</span>
        </label>
        <input
          id="phoneNumber"
          type="tel"
          autoComplete="tel"
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
          {...register("phoneNumber")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            aria-invalid={Boolean(errors.password)}
            className="w-full rounded-md border border-zinc-300 px-3 py-2 pr-10 text-sm focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 hover:text-zinc-600"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-600">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={busy}
        className="mt-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900"
      >
        {busy ? "Creating account…" : "Create account"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="font-medium text-zinc-900 hover:underline dark:text-zinc-100">
          Sign in
        </Link>
      </p>
    </form>
  );
}
