"use client";

import { useState, useEffect, useRef } from "react";
import { Briefcase, Mail, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface SignupData {
  name: string;
  email: string;
  password: string;
}

export default function VerifyOtpPage() {
  const router = useRouter();
  const formRef = useRef<HTMLDivElement>(null);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [signupData, setSignupData] = useState<SignupData | null>(null);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  useEffect(() => {
    // Get signup data from session storage
    const data = sessionStorage.getItem("signupData");
    if (!data) {
      router.push("/auth/signup");
      return;
    }

    setSignupData(JSON.parse(data));

    // Fade-in animation
    if (formRef.current) {
      formRef.current.style.opacity = "0";
      formRef.current.style.transform = "translateY(20px)";

      setTimeout(() => {
        if (formRef.current) {
          formRef.current.style.transition = "all 0.6s ease-out";
          formRef.current.style.opacity = "1";
          formRef.current.style.transform = "translateY(0)";
        }
      }, 100);
    }
  }, [router]);

  // Handle resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0 && !canResend && signupData) {
      setCanResend(true);
    }
  }, [resendTimer, canResend, signupData]);

  const handleResendOtp = async () => {
    if (!canResend || !signupData) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email: signupData.email }),
      });

      if (!res.ok) {
        throw new Error("Failed to resend OTP");
      }

      setCanResend(false);
      setResendTimer(60);
      setOtp("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to resend OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!otp.trim()) {
      setError("Please enter the OTP");
      setLoading(false);
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      setLoading(false);
      return;
    }

    if (!signupData) {
      setError("Session expired. Please sign up again.");
      setLoading(false);
      return;
    }

    try {
      // Call backend to create account with verified OTP
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({
          name: signupData.name,
          email: signupData.email,
          password: signupData.password,
          otp,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create account");
      }

      setSuccess(true);
      
      // Clear session storage
      sessionStorage.removeItem("signupData");

      // Redirect to signin after 2 seconds
      setTimeout(() => {
        router.push("/auth/signin");
      }, 2000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to verify OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!signupData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-subtle">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-subtle p-4 pt-8">
      <div
        ref={formRef}
        className="w-full max-w-md bg-card/80 backdrop-blur-xl rounded-2xl shadow-medium p-8 border border-border/50"
      >
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-glow">
            <Briefcase className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">FluxJobs</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-foreground text-center mb-2">
          Verify your email
        </h1>
        <p className="text-muted-foreground text-center mb-2 text-sm">
          We&apos;ve sent a 6-digit OTP to:
        </p>

        {/* Email Display */}
        <div className="flex items-center justify-center gap-2 mb-6 p-3 bg-secondary/30 rounded-lg">
          <Mail className="w-4 h-4 text-muted-foreground" />
          <p className="text-sm font-medium text-foreground">{signupData.email}</p>
        </div>

        {/* Success State */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 text-center font-medium">
              ✓ Account created successfully! Redirecting to sign in...
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleVerifyOtp} className="space-y-4">
          {/* OTP Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              maxLength={6}
              className="w-full h-12 bg-background border border-border rounded-lg px-3 text-center text-lg font-semibold focus:border-primary focus:ring-2 focus:ring-primary/20 text-foreground tracking-widest"
              disabled={success}
              required
            />
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed text-primary-foreground rounded-lg shadow-soft hover:shadow-medium transition-all duration-300"
          >
            {loading ? "Verifying..." : success ? "Success!" : "Verify OTP"}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-6 pt-6 border-t border-border/30 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Didn&apos;t receive the OTP?
          </p>
          <button
            onClick={handleResendOtp}
            disabled={!canResend || loading}
            className="text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:cursor-not-allowed font-semibold text-sm transition-colors"
          >
            {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
          </button>
        </div>
      </div>
    </div>
  );
}
