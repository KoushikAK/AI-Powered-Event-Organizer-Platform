"use client";

import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ExploreLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const isMainExplore = pathname === "/explore";

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-black text-foreground overflow-hidden">
      {/* Soft ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-[-10rem] h-96 w-96 rounded-full bg-purple-500/30 blur-3xl" />
        <div className="absolute bottom-[-10rem] left-[-5rem] h-80 w-80 rounded-full bg-sky-500/25 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_55%)]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 pb-16 pt-8 md:pt-10">
        {/* Back Button for nested routes */}
        {!isMainExplore && (
          <div className="mb-6">
            <div className="inline-flex items-center rounded-full border border-white/10 bg-black/40 px-1.5 py-1 backdrop-blur-xl shadow-lg shadow-purple-500/20">
              <Button
                variant="minimalLuxe"
                onClick={() => router.push("/explore")}
                className="gap-2 -ml-1 px-3 py-1.5 text-sm hover:bg-white/5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Explore</span>
              </Button>
            </div>
          </div>
        )}

        {/* Glass shell around content */}
        <div className="rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl shadow-[0_0_80px_rgba(168,85,247,0.35)]">
          <div className="p-4 md:p-6 lg:p-8 space-y-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
