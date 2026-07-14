"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/auth.schema";
import { ROUTES } from "@/constants/routes";
import type { ApiError } from "@/types/api.types";

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const busy = isLoggingIn || isSubmitting;

  async function onSubmit(values: LoginFormValues) {
    if (busy) return;
    setFormError(null);
    try {
      await login(values);
      router.replace(ROUTES.dashboard);
    } catch (error) {
      const apiError = error as ApiError;
      if (apiError.status === 429) {
        setFormError(
          "Too many attempts. Please wait a moment before trying again.",
        );
      } else if (apiError.status === 401) {
        setFormError("Invalid email or password.");
      } else {
        setFormError(
          apiError.message || "Unable to sign in. Please try again.",
        );
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="surface-card flex flex-col gap-4 p-6"
    >
      <div>
        <h1
          className="text-lg font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          Sign in
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          Welcome back. Enter your details below.
        </p>
      </div>

      {formError && (
        <p
          role="alert"
          className="rounded-lg px-3 py-2 text-sm"
          style={{ background: "var(--danger-soft)", color: "var(--danger)" }}
        >
          {formError}
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "email-error" : undefined}
          className="input-field"
          {...register("email")}
        />
        {errors.email && (
          <p id="email-error" className="text-xs text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Password
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? "password-error" : undefined}
            className="input-field pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-zinc-400 hover:text-zinc-600"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p id="password-error" className="text-xs text-red-600">
            {errors.password.message}
          </p>
        )}
      </div>

      <button type="submit" disabled={busy} className="btn-primary mt-2">
        {busy ? "Signing in…" : "Sign in"}
      </button>

      <p className="text-center text-sm text-zinc-500">
        Don&apos;t have an account?{" "}
        <Link
          href={ROUTES.register}
          className="font-medium text-zinc-900 hover:underline dark:text-zinc-100"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
