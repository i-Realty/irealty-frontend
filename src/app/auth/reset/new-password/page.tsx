"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/auth/AuthLayout";
import PasswordInput from "@/components/auth/PasswordInput";
import { validatePassword } from "@/lib/utils/authValidation";

function ResetNewPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams?.get("email") || "";

  // Step guard
  useEffect(() => {
    if (!email) router.replace("/auth/reset");
  }, [email, router]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function handleReset() {
    const errs: Record<string, string> = {};
    const pwErr = validatePassword(password);
    if (pwErr) errs.password = pwErr;
    if (!confirmPassword) errs.confirm = "Please confirm your password";
    else if (password !== confirmPassword) errs.confirm = "Passwords do not match";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    // Simulate API call — replace with POST /api/auth/reset-password
    setTimeout(() => {
      router.push("/auth/reset/success");
    }, 600);
  }

  return (
    <AuthLayout>
      <div className="bg-white rounded-xl p-6 sm:p-8">
        <h3 className="text-lg sm:text-xl font-bold mb-2">Create New Password</h3>
        <p className="text-gray-500 mb-5 text-sm">
          Enter a new password for your account
        </p>

        <div className="grid gap-4">
          <PasswordInput
            id="new-password"
            label="New Password"
            value={password}
            onChange={setPassword}
            placeholder="Password (Min. of 8 characters)"
            error={errors.password}
          />

          <PasswordInput
            id="confirm-password"
            label="Confirm Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Re-enter your password"
            error={errors.confirm}
          />

          <button
            onClick={handleReset}
            disabled={loading}
            className={`w-full py-3 rounded-lg border-none text-white font-bold text-sm mt-2 transition-colors ${
              loading ? "bg-blue-300 cursor-wait" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

export default function ResetNewPassword() {
  return (
    <Suspense>
      <ResetNewPasswordContent />
    </Suspense>
  );
}
