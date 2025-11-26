"use client"

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BlobCursor from "@/components/BlobCursor";
import FloatingLines from "@/components/FloatingLines";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* FloatingLines fixed to viewport so there's no offset/gap */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <FloatingLines
          enabledWaves={["top", "middle", "bottom"]}
          lineCount={[6, 6, 6]}
          lineDistance={[5, 5, 5]}
          mixBlendMode="normal"
          animationSpeed={1}
          interactive={false}
        />
      </div>

      {/* BlobCursor on top */}
      <BlobCursor
        blobType="circle"
        fillColor="#5227FF"
        trailCount={3}
        sizes={[60, 125, 75]}
        innerSizes={[20, 35, 25]}
        innerColor="rgba(255,255,255,0.8)"
        opacities={[0.6, 0.6, 0.6]}
        shadowColor="rgba(0,0,0,0.75)"
        shadowBlur={5}
        shadowOffsetX={10}
        shadowOffsetY={10}
        filterStdDeviation={30}
        useFilter={true}
        fastDuration={0.1}
        slowDuration={0.5}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 9999,
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <section className="pb-16 relative overflow-hidden z-10 pointer-events-none pt-0">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10 pointer-events-auto">
          <div className="text-center sm:text-left">
            <div className="mb-6">
              <span className="text-gray-500 font-light tracking-wide">
                spott<span className="text-purple-400">*</span>
              </span>
            </div>

            {/* reset h1 top margin */}
            <h1 className="mt-0 text-5xl sm:text-6xl md:text-7xl font-bold mb-6 leading-[0.95] tracking-tight">
              Discover &<br />
              create amazing
              <br />
              <span className="bg-linear-to-r from-blue-400 via-purple-400 to-orange-400 bg-clip-text text-transparent">
                events.
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 mb-12 max-w-lg font-light">
              Whether you&apos;re hosting or attending, Spott makes every event
              memorable. Join our community today.
            </p>

            <Link href="/explore">
              <Button className={"rounded-4xl"}>Get Started</Button>
            </Link>
          </div>

          <div className="relative block">
            <Image
              src="/hero.png"
              alt="react meetup"
              width={700}
              height={700}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
}
