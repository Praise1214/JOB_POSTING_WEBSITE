"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import AnimatedButton from "@/components/AnimatedButton";
import AnimatedCard from "@/components/AnimatedCard";
import CountUp from "@/components/CountUp";
import ThreeBackground from "@/components/ThreeBackground";

export default function Home() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Animate title on load
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" }
      );
    }

    // Animate subtitle
    if (subtitleRef.current) {
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power2.out" }
      );
    }
  }, []);

  return (
    <div className="relative overflow-hidden">
      <ThreeBackground />

      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <h1
            ref={titleRef}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Find Your Dream Job Today
          </h1>
          <p
            ref={subtitleRef}
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
          >
            Discover amazing opportunities from top companies. Connect with
            employers and take your career to the next level.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <AnimatedButton className="px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
              <Link href="/jobs">Browse Jobs</Link>
            </AnimatedButton>
            <AnimatedButton className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 rounded-md hover:bg-indigo-50 font-medium">
              <Link href="/jobs/post">Post a Job</Link>
            </AnimatedButton>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <AnimatedCard delay={0}>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                <CountUp end={1000} suffix="+" />
              </div>
              <p className="text-gray-600">Active Jobs</p>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.1}>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                <CountUp end={500} suffix="+" />
              </div>
              <p className="text-gray-600">Companies</p>
            </div>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">
                <CountUp end={50000} suffix="+" />
              </div>
              <p className="text-gray-600">Candidates</p>
            </div>
          </AnimatedCard>
        </section>

        {/* Features Section */}
        <section className="py-12">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedCard delay={0}>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Lightning Fast
                </h3>
                <p className="text-gray-600">
                  Find and apply to jobs in seconds with our streamlined
                  platform
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.1}>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Top Companies
                </h3>
                <p className="text-gray-600">
                  Access exclusive opportunities from industry leaders
                </p>
              </div>
            </AnimatedCard>

            <AnimatedCard delay={0.2}>
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  Career Growth
                </h3>
                <p className="text-gray-600">
                  Build your dream career with mentorship and opportunities
                </p>
              </div>
            </AnimatedCard>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <div className="bg-indigo-50 p-12 rounded-lg">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-gray-600 mb-8">
              Join thousands of professionals finding their dream jobs
            </p>
            <AnimatedButton className="px-8 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
              <Link href="/jobs">Get Started Now</Link>
            </AnimatedButton>
          </div>
        </section>
      </div>
    </div>
  );
}
