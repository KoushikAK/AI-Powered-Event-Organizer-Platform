"use client";

import { Star, Zap, Infinity } from "lucide-react"; 
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PricingTable } from "@clerk/nextjs";

export default function UpgradeModal({ isOpen, onClose, trigger = "limit" }) {
  // Define a map for trigger messages for cleaner display
  const triggerMessages = {
    header: "Unlock infinite potential and streamline your workflow.",
    limit: "You've reached your free event limit. Go Pro to lift all constraints.",
    color: "Custom theme colors are a Pro exclusive. Define your brand's identity.",
  };

  const currentMessage = triggerMessages[trigger] || triggerMessages.limit;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* DialogContent Adjustments:
        - sm:max-w-2xl: Increased width.
        - max-h-[90vh]: Limits the overall height of the modal to ensure it fits on smaller screens.
        - p-0 and custom styling remain for the premium look.
      */}
      <DialogContent className="sm:max-w-2xl max-h-[90vh] p-0 bg-gray-950 text-white rounded-[16px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)] border-none flex flex-col">
        
        {/* HEADER SECTION - Fixed (Non-scrolling) */}
        <DialogHeader className="p-8 pb-4 border-b border-gray-800 space-y-4 flex-shrink-0">
          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl shadow-purple-900/50 mb-2 ring-4 ring-purple-500/30">
              <Star className="w-8 h-8 text-white fill-white" />
            </div>
            <DialogTitle className="text-4xl lg:text-5xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-red-400">
              Go Pro: Limitless Creation
            </DialogTitle>
          </div>
          <DialogDescription className="text-lg text-gray-400 max-w-lg mx-auto text-center font-medium">
            <span className="text-white font-semibold flex items-center justify-center gap-1">
              <Infinity className="w-5 h-5 text-pink-500" />
              {currentMessage}
            </span>
            <span className="block mt-2 text-sm text-gray-500">
                Unlock unparalleled performance, priority support, and exclusive Pro features.
            </span>
          </DialogDescription>
        </DialogHeader>

        {/* PRICING SECTION - Scrollable Content Area */}
        {/* Added overflow-y-auto to create the scrollbar and flex-grow to take up available vertical space */}
        <div className="p-8 pt-4 overflow-y-auto flex-grow custom-scrollbar"> 
          <PricingTable
            checkoutProps={{
              appearance: {
                elements: {
                  drawerRoot: {
                    zIndex: 2000,
                  },
                },
              },
            }}
          />
        </div>

        {/* FOOTER SECTION - Fixed (Non-scrolling) */}
        <div className="flex justify-center p-4 border-t border-gray-800 bg-gray-900 rounded-b-[16px] flex-shrink-0">
          <Button 
            variant="link"
            onClick={onClose} 
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors duration-200"
          >
            <Zap className="w-4 h-4 mr-1 text-yellow-500" />
            No thanks, I'll continue with the free plan
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}