"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BlobCursor from "@/components/BlobCursor";
import FloatingLines from "@/components/FloatingLines";
import { useMagnetic } from "@/hooks/useMagnetic";
import { useRipple } from "@/hooks/useRipple";

const { onMove, onLeave } = useMagnetic();
const { createRipple } = useRipple();

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 1. Deep cinematic base gradient */}
      <div className="fixed inset-0 z-[-4] bg-[radial-gradient(ellipse_at_top,_#1a103d_0%,_#05010e_60%,_#020008_100%)]" />

      {/* 2. Ambient light / bloom layer */}
      <div
        className="fixed inset-0 z-[-3] blur-3xl opacity-60 
        bg-[radial-gradient(circle_at_15%_25%,_rgba(124,92,255,0.35),_transparent_55%),_radial-gradient(circle_at_85%_70%,_rgba(248,130,190,0.25),_transparent_55%),_radial-gradient(circle_at_50%_120%,_rgba(40,180,255,0.25),_transparent_60%)]"
      />

      {/* 3. FloatingLines shader field */}
      <div className="fixed inset-0 z-[-2] pointer-events-none">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={[5, 7, 5]}
          lineDistance={[7, 6, 8]}
          animationSpeed={0.6}
          interactive={false}
          parallax={true}
          parallaxStrength={0.16}
          mixBlendMode="screen"
          linesGradient={["#6366F1", "#8B5CF6", "#EC4899", "#F97316"]}
        />
      </div>

      {/* 4. Film grain / noise overlay */}
      <div className="fixed inset-0 z-[-1] pointer-events-none bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />

      {/* 5. BlobCursor on top (cinematic glassy blob) */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <BlobCursor
          blobType="circle"
          fillColor="#7C5CFF"
          trailCount={2}
          sizes={[110, 60]}
          innerSizes={[40, 24]}
          innerColor="rgba(255,255,255,0.9)"
          opacities={[0.45, 0.25]}
          shadowColor="rgba(124,92,255,0.4)"
          shadowBlur={28}
          shadowOffsetX={0}
          shadowOffsetY={18}
          filterStdDeviation={40}
          useFilter={true}
          fastDuration={0.12}
          slowDuration={0.55}
        />
      </div>

      {/* 6. Main hero content */}
      <section className="relative z-20 flex items-center justify-center py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full">
          <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-12 items-center">
            {/* Left: Text & primary CTA */}
            <div className="text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs md:text-sm tracking-wide uppercase text-gray-300/90 backdrop-blur-sm">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-medium">Event OS for the next decade</span>
              </div>

              <div>
                <p className="mb-3 text-sm md:text-base text-gray-400/90 font-light tracking-[0.28em] uppercase">
                  spott<span className="text-purple-400">*</span>
                </p>
                <h1 className="mt-0 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[0.95] tracking-tight">
                  Discover &<br />
                  create unforgettable
                  <br />
                  <span className="bg-[linear-gradient(to_right,_#60a5fa,_#a855f7,_#fb923c)] bg-clip-text text-transparent">
                    experiences.
                  </span>
                </h1>
              </div>

              <p className="text-base sm:text-lg md:text-xl text-gray-300/85 max-w-xl mx-auto lg:mx-0 font-light">
                From intimate meetups to large-scale conferences, Spott gives you
                the tools to design, host, and grow events that people remember.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-start justify-center">
                <Link href="/explore">
                  <Button
                    variant="premium"
                    onMouseMove={onMove}
                    onMouseLeave={onLeave}
                    className="rounded-full px-7 py-5 text-sm md:text-base font-medium shadow-[0_18px_60px_rgba(124,92,255,0.55)]">
                    Get started in seconds
                  </Button>
                </Link>


                <button className="text-sm md:text-sm text-gray-300/90 hover:text-white/95 transition-colors inline-flex items-center justify-center gap-2">
                  <span className="h-7 w-7 rounded-full border border-white/15 flex items-center justify-center text-[11px]">
                    ?
                  </span>
                  Watch product overview
                </button>
              </div>

              <div className="flex flex-wrap gap-4 items-center justify-center lg:justify-start pt-3 text-xs sm:text-sm text-gray-400/90">
                <div className="flex -space-x-2">
                  <span className="inline-flex h-8 w-8 rounded-full border border-white/10 bg-white/10 backdrop-blur-sm" />
                  <span className="inline-flex h-8 w-8 rounded-full border border-white/10 bg-white/10 backdrop-blur-sm" />
                  <span className="inline-flex h-8 w-8 rounded-full border border-white/10 bg-white/10 backdrop-blur-sm" />
                </div>
                <span>Trusted by teams hosting over 12,000+ events.</span>
              </div>
            </div>

            {/* Right: Cinematic glass hero mock */}
            <div className="relative w-full max-w-xl mx-auto lg:mx-0">
              {/* Soft halo behind card */}
              <div className="absolute -inset-16 opacity-50 blur-3xl bg-[radial-gradient(circle_at_30%_0%,_rgba(129,140,248,0.5),_transparent_55%),_radial-gradient(circle_at_90%_80%,_rgba(251,146,60,0.4),_transparent_60%)]" />

              {/* Main glass card */}
              <div className="relative rounded-[32px] border border-white/10 bg-white/5/5 bg-gradient-to-br from-white/6 via-white/2 to-white/[0.01] backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.85)] px-5 sm:px-7 md:px-8 py-6 sm:py-7 md:py-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.28em] text-gray-400/90">
                      Live event
                    </p>
                    <p className="text-base sm:text-lg font-medium text-white">
                      React Meetup · Bengaluru
                    </p>
                  </div>
                  <span className="rounded-full border border-emerald-400/40 bg-emerald-500/20 px-3 py-1 text-[11px] font-medium text-emerald-200">
                    92% seats filled
                  </span>
                </div>

                <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-black/50 mb-5">
                  <Image
                    src="/hero.png"
                    alt="React meetup"
                    width={700}
                    height={700}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-gray-200/95">
                    <div className="space-y-0.5">
                      <p className="font-medium">React India · Mumbai</p>
                      <p className="text-[11px] text-gray-300/80">
                        24 Jan · 6:30 PM IST
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] uppercase tracking-wide text-gray-300/70">
                        Starting from
                      </span>
                      <span className="text-base font-semibold text-white">₹999</span>
                    </div>
                  </div>
                </div>

                {/* Mini stats row */}
                <div className="grid grid-cols-3 gap-3 text-[11px] sm:text-xs text-gray-200/90">
                  <div className="rounded-2xl border border-white/10 bg-white/3 px-3 py-3 space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400/90">
                      Hosts
                    </p>
                    <p className="text-lg font-semibold">3.4K</p>
                    <p className="text-[11px] text-gray-400/90">
                      creators launched in the last 30 days
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/3 px-3 py-3 space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400/90">
                      Attendance
                    </p>
                    <p className="text-lg font-semibold">96%</p>
                    <p className="text-[11px] text-gray-400/90">
                      avg. show-up rate for Spott events
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/3 px-3 py-3 space-y-1">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400/90">
                      NPS
                    </p>
                    <p className="text-lg font-semibold">+72</p>
                    <p className="text-[11px] text-gray-400/90">
                      attendee satisfaction across categories
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating pill behind card for depth */}
              <div className="absolute -bottom-8 left-8 right-4 h-16 rounded-full bg-gradient-to-r from-indigo-500/30 via-purple-500/35 to-amber-400/30 blur-2xl opacity-70" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
