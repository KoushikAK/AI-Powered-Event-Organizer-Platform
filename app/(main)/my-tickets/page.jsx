/* eslint-disable react-hooks/purity */
"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar, MapPin, Loader2, Ticket, Download } from "lucide-react";
import { useConvexQuery, useConvexMutation } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import QRCode from "react-qr-code";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import EventCard from "@/components/event-card";

// Branding / config
const BRAND = {
  primaryFrom: "#7c3aed", // purple
  primaryTo: "#ec4899", // pink
  accent: "#06b6d4", // cyan
  spacing: "md",
};

export default function MyTicketsPage({ brand = BRAND }) {
  const router = useRouter();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const vantaRef = useRef(null);

  const { data: registrations, isLoading } = useConvexQuery(
    api.registrations.getMyRegistrations
  );

  const { mutate: cancelRegistration, isLoading: isCancelling } =
    useConvexMutation(api.registrations.cancelRegistration);

  const handleCancelRegistration = async (registrationId) => {
    if (!window.confirm("Are you sure you want to cancel this registration?"))
      return;

    try {
      await cancelRegistration({ registrationId });
      toast.success("Registration cancelled successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to cancel registration");
    }
  };

  useEffect(() => {
    // Dynamically load Vanta (net) for subtle parallax background.
    let vantaEffect;
    async function initVanta() {
      if (!containerRef.current) return;
      try {
        const THREE = (await import("three")).default || (await import("three"));
        const vantaModule = await import("vanta/dist/vanta.net.min.js");
        const VANTA = vantaModule.default || window.VANTA;
        if (VANTA && containerRef.current) {
          vantaEffect = VANTA({
            el: containerRef.current,
            THREE,
            color: 0x9b5cf6,
            backgroundColor: 0x0b1020,
            maxDistance: 20.0,
            spacing: 20.0,
            showDots: false,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
          });
          vantaRef.current = vantaEffect;
        }
      } catch (e) {
        console.warn("Vanta init failed — make sure 'vanta' and 'three' are installed.", e);
      }
    }

    initVanta();

    return () => {
      if (vantaRef.current && typeof vantaRef.current.destroy === "function") {
        vantaRef.current.destroy();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  const now = Date.now();

  const upcomingTickets = registrations?.filter(
    (reg) => reg.event && reg.event.startDate >= now && reg.status === "confirmed"
  );
  const pastTickets = registrations?.filter(
    (reg) => reg.event && (reg.event.startDate < now || reg.status === "cancelled")
  );

  // Download QR as PNG by serializing the SVG produced by react-qr-code
  const downloadQRCode = (svgEl, filename = "ticket.png") => {
    try {
      if (!svgEl) return;
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgEl);
      const encodedData = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = 2; // upscale for crispness
        canvas.width = image.width * scale;
        canvas.height = image.height * scale;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
        });
      };
      image.onerror = (err) => {
        console.error("QR image load error", err);
        toast.error("Failed to export QR code");
      };
      image.src = encodedData;
    } catch (e) {
      console.error(e);
      toast.error("Failed to export QR code");
    }
  };

  return (
    <div ref={containerRef} className="relative min-h-screen pb-20 px-4 overflow-hidden">
      {/* Nebula/Vanta sits behind everything in the container */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900/80" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight text-white">My Tickets</h1>
          <p className="text-slate-300">View and manage your event registrations</p>
        </div>

        {/* Upcoming Tickets */}
        {upcomingTickets?.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white">Upcoming Events</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTickets.map((registration) => (
                <div
                  key={registration._id}
                  className="relative group rounded-[18px] p-1 bg-gradient-to-br from-white/6 to-white/2 shadow-2xl overflow-hidden"
                >
                  <div className="rounded-lg backdrop-blur-md bg-white/6 border border-white/6 p-4 transition-transform duration-300 will-change-transform transform hover:-translate-y-1 hover:scale-100">
                    <EventCard
                      event={registration.event}
                      action="ticket"
                      onClick={() => setSelectedTicket(registration)}
                      onDelete={() => handleCancelRegistration(registration._id)}
                      className="bg-transparent"
                    />
                    {/* Use tailwind classes; ripple handled via global CSS below using .ripple-btn */}
                    {/* If you add clickable elements here that should ripple, give them the className="ripple-btn" */}
                  </div>

                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-700">
                    <div className="h-full w-full bg-gradient-to-r from-white/0 via-white/12 to-white/0 blur-2xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Past Tickets */}
        {pastTickets?.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-white">Past Events</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTickets.map((registration) => (
                <div key={registration._id} className="opacity-70">
                  <EventCard
                    event={registration.event}
                    action={null}
                    className="bg-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!upcomingTickets?.length && !pastTickets?.length && (
          <Card className="p-12 text-center bg-gradient-to-br from-white/4 to-white/2 border border-white/8 backdrop-blur-md">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-7xl mb-2">🎟️</div>
              <h2 className="text-2xl font-semibold">No tickets yet</h2>
              <p className="text-slate-300">Register for events to see your tickets here</p>
              <Button
                asChild
                className="mt-2 px-4 py-2 bg-gradient-to-r"
                style={{ background: `linear-gradient(90deg, ${brand.primaryFrom}, ${brand.primaryTo})` }}
              >
                <Link href="/explore" className="flex items-center gap-2">
                  <Ticket className="w-4 h-4" /> Browse Events
                </Link>
              </Button>
            </div>
          </Card>
        )}
      </div>

      {/* QR Code Modal */}
      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Your Ticket</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="text-center">
                <p className="font-semibold mb-1 text-slate-200">{selectedTicket.attendeeName}</p>
                <p className="text-sm text-slate-400 mb-4">{selectedTicket.event.title}</p>
              </div>

              <div
                className="flex flex-col items-center gap-3 p-6 rounded-lg"
                style={{
                  background: "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                <div ref={svgRef} className="bg-white p-2 rounded-sm inline-block">
                  <QRCode value={selectedTicket.qrCode} size={200} level="H" />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => {
                      const svgEl = svgRef.current?.querySelector("svg") || document.querySelector(".react-qr-code svg");
                      downloadQRCode(svgEl, `${selectedTicket._id || "ticket"}.png`);
                    }}
                    className="px-3 py-2 ripple-btn"
                    style={{ background: `linear-gradient(90deg, ${brand.primaryFrom}, ${brand.primaryTo})` }}
                  >
                    <Download className="w-4 h-4 mr-2" /> Download
                  </Button>

                  <Button variant="ghost" onClick={() => setSelectedTicket(null)} className="px-3 py-2">
                    Close
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-xs text-slate-400 mb-1">Ticket ID</p>
                <p className="font-mono text-sm text-slate-200">{selectedTicket.qrCode}</p>
              </div>

              <div className="bg-white/3 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-200">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(selectedTicket.event.startDate), "PPP, h:mm a")}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {selectedTicket.event.locationType === "online"
                      ? "Online Event"
                      : `${selectedTicket.event.city}, ${selectedTicket.event.state || selectedTicket.event.country}`}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400 text-center">Show this QR code at the event entrance for check-in</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Consolidated global styles (NOT nested) */}
      <style jsx global>{`
        @keyframes sheen {
          0% { transform: translateX(-110%) skewX(-12deg); opacity: 0 }
          50% { opacity: 0.35 }
          100% { transform: translateX(110%) skewX(-12deg); opacity: 0 }
        }

        .ripple-btn { position: relative; overflow: hidden; }
        .ripple-btn::after {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) scale(0);
          width: 0;
          height: 0;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          transition: width 0.45s ease, height 0.45s ease, transform 0.45s ease;
          pointer-events: none;
        }
        .ripple-btn:active::after { width: 240px; height: 240px; transform: translate(-50%, -50%) scale(1); }

        .glossy-sheen::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0) 100%);
          transform: translateX(-100%) skewX(-12deg);
          animation: sheen 2.6s ease-in-out infinite;
          pointer-events: none;
        }

        .pressable:active { transform: translateY(1px) scale(0.998); }
      `}</style>
    </div>
  );
}
