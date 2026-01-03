"use client";

import { useState, useEffect, useRef } from "react";
import { loginGithub, loginGoogle, loginX } from "@/lib/auth";
import { Eye, EyeOff, Briefcase } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import AnimatedButton from "@/components/AnimatedButton";

export default function SignInPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" }
      );
    }
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error || "Invalid email or password");
      } else if (result?.ok) {
        router.push("/");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div
        ref={containerRef}
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="grid md:grid-cols-2 gap-0">
          {/* Left Side - Branding */}
          <div className="hidden md:flex md:flex-col md:items-center md:justify-center bg-gradient-to-br from-blue-600 to-indigo-700 p-12 text-white">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center mb-6 mx-auto backdrop-blur-sm border border-white/30">
                <Briefcase className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold mb-4">FluxJobs</h2>
              <p className="text-lg text-white/80 leading-relaxed mb-8">
                Connect with opportunities and talented professionals
              </p>
              <div className="space-y-4 mt-12">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-white/90">Post and manage job listings</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-white/90">Find your next opportunity</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-white/90">
                    Grow your professional network
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <h1 className="font-interTight text-[22px] leading-[28px] font-semibold text-[rgb(34,34,34) mb-2">
                Welcome Back!
              </h1>
              <p className="text-gray-600 text-lg">
                Sign in to your FluxJobs account
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="font-interTight font-normal text-[14px] leading-[12px] text-[rgb(167,167,167)] mb-2">
                  EMAIL OR USERNAME
                </label>
                <input
                  type="email"
                  placeholder="Email or Username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-0 py-3 bg-transparent border-b border-gray-300 outline-none placeholder:opacity-30 placeholder-gray-500 font-interTight font-light text-[15px] leading-normal text-[rgb(34,34,34)] pl-4"
                />
              </div>

              {/* Password */}
              <div>
                <label className="font-interTight font-normal text-[14px] leading-[12px] text-[rgb(167,167,167)] mb-2">
                  PASSWORD
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-0 py-3 bg-transparent border-b border-gray-300 outline-none placeholder:opacity-30 placeholder-gray-500 font-interTight font-light text-[15px] leading-normal text-[rgb(34,34,34)] pl-4"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-gray-300 text-blue-700 focus:ring-2 focus:ring-blue-200 cursor-pointer"
                  />
                  <label
                    htmlFor="remember"
                    className="font-inter-tight font-light text-[14px] leading-[18px] text-[#222222] cursor-pointer"
                  >
                    Keep me logged in
                  </label>
                </div>
              </div>

            <div className="space-y-2">
              {/* Submit Button */}
              <AnimatedButton
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-blue-700 hover:bg-gray-900 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 text-lg"
                onClick={() => {}}
              >
                {loading ? "Signing in..." : "Log in now"}
              </AnimatedButton>

              {/* Forgot Password Link */}
              <div className="flex text-center justify-end ">
                <a
                  href="#"
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors font-semibold"
                >
                  Forgot password?
                </a>
              </div>
            </div>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-sm text-gray-600 font-medium">
                  Or sign in with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={loginGoogle}
                className="py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              </button>

              <button
                onClick={loginX}
                className="py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2H21l-6.168 7.047L21.5 22h-5.3l-4.154-6.212L6.56 22H3.8l6.574-7.508L2.5 2H8l3.76 5.636L18.244 2zm-1.856 18h1.51L7.37 4H5.76l10.628 16z" />
                </svg>
              </button>

              <button
                onClick={loginGithub}
                className="py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-700">
                Don&apos;t have an account?{" "}
                <a
                  href="/auth/signup"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                >
                  Register now
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
