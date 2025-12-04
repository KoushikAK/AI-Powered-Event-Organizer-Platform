import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        // 🌿 Default Buttons
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",

        // 🎨 Stylish Variants
        glossy:
          "bg-gradient-to-b from-primary/90 to-primary text-white shadow-md hover:from-primary to-primary/80 active:scale-[0.97]",
        success:
          "bg-green-600 text-white shadow-md hover:bg-green-700 focus-visible:ring-green-400 dark:bg-green-500 dark:hover:bg-green-600",
        gradient:
          "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:brightness-110 transition-all duration-300",
        neon:
          "bg-black text-white border border-white/20 shadow-[0_0_15px_rgba(0,255,153,0.7)] hover:shadow-[0_0_25px_rgba(0,255,153,1)] hover:text-green-300",
        glass:
          "bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-md hover:bg-white/20 hover:shadow-lg transition-all duration-300",
        soft:
          "bg-gray-100 text-gray-800 shadow-sm hover:shadow-md hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
        animatedGradient:
          "relative bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-[length:200%_200%] text-white shadow-lg transition-all duration-500 ease-in-out hover:brightness-110 animate-gradient rounded-md",
        floating:
          "relative bg-blue-600 text-white shadow-lg transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.03] hover:shadow-[0_15px_25px_rgba(59,130,246,0.5)] active:scale-[0.97] focus-visible:ring-2 focus-visible:ring-blue-300",
        premium:
          "relative bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 bg-[length:300%_300%] text-white font-semibold shadow-xl hover:brightness-110 animate-gradient transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.06] hover:shadow-[0_20px_35px_rgba(168,85,247,0.5)] active:scale-[0.98] rounded-xl",

        // 🚀 Cyberpunk Holographic Button
        holographic:
          "relative bg-gradient-to-br from-pink-500 via-cyan-400 to-purple-600 bg-[length:400%_400%] text-white font-semibold shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-gradient hover:scale-[1.05] hover:shadow-[0_0_35px_rgba(255,255,255,0.7)] active:scale-[0.97] backdrop-blur-md border border-white/20 rounded-xl overflow-hidden before:absolute before:inset-0 before:bg-white/20 before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-20",

        ripple:
          "relative overflow-hidden bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-[0.97] transition-all duration-300 before:absolute before:inset-0 before:content-['']",

        magnetic:
          "relative bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg transition-all duration-300 will-change-transform",

        luxe:
          "relative bg-slate-950 text-slate-50 border border-white/10 shadow-[0_18px_45px_rgba(15,23,42,0.95)] rounded-xl overflow-hidden before:content-[''] before:absolute before:inset-px before:rounded-[inherit] before:bg-gradient-to-b before:from-white/15 before:via-white/5 before:to-transparent before:pointer-events-none hover:border-white/35 hover:shadow-[0_24px_70px_rgba(15,23,42,1)] hover:-translate-y-[2px] active:translate-y-[1px] transition-all duration-500",

        // 2. GOLD - rich metallic gradient, perfect for upgrade / payment CTAs
        gold:
          "relative bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-900 font-semibold border border-amber-200/80 shadow-[0_12px_35px_rgba(245,158,11,0.7)] hover:shadow-[0_18px_55px_rgba(245,158,11,0.95)] hover:brightness-110 hover:-translate-y-[2px] active:translate-y-[1px] transition-all duration-400",

        // 3. CARBON - stealth, dashboard / pro-tier button
        carbon:
          "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-slate-100 border border-slate-600/70 shadow-[0_14px_40px_rgba(15,23,42,0.95)] hover:border-slate-300/50 hover:shadow-[0_22px_65px_rgba(15,23,42,1)] hover:-translate-y-[2px] active:translate-y-[1px] transition-all duration-400",

        // 4. OUTLINE-GLOW - minimal body, strong neon border & glow
        outlineGlow:
          "bg-transparent text-sky-300 border border-sky-400/80 shadow-[0_0_22px_rgba(56,189,248,0.65)] hover:bg-sky-400/10 hover:text-sky-50 hover:shadow-[0_0_38px_rgba(56,189,248,0.95)] active:shadow-[0_0_18px_rgba(56,189,248,0.7)] transition-all duration-300",

        // 5. PILL - soft, pill-shaped, very “product site CTA”
        pill:
          "rounded-full px-7 font-medium bg-gradient-to-r from-slate-100 via-slate-50 to-slate-200 text-slate-900 shadow-md hover:shadow-lg hover:-translate-y-[1px] active:translate-y-[1px] dark:from-slate-700 dark:via-slate-800 dark:to-slate-950 dark:text-slate-50 dark:shadow-[0_10px_30px_rgba(15,23,42,0.9)]",

        // 6. MINIMAL-LUXE - almost text-only but still premium
        minimalLuxe:
          "bg-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:text-slate-50 dark:hover:bg-slate-800/80 shadow-none hover:shadow-[0_8px_20px_rgba(15,23,42,0.25)] rounded-full px-4 transition-all duration-250",

        // 7. CHROME - glossy, reflective, slightly futuristic
        chrome:
          "relative bg-gradient-to-b from-slate-200 via-slate-50 to-slate-300 text-slate-900 border border-white/60 shadow-[0_14px_40px_rgba(148,163,184,0.8)] overflow-hidden before:content-[''] before:absolute before:-top-1/2 before:left-0 before:w-full before:h-full before:bg-gradient-to-b before:from-white/80 before:via-transparent before:to-transparent before:opacity-60 before:translate-y-6 before:blur-md hover:before:translate-y-10 hover:shadow-[0_20px_60px_rgba(148,163,184,1)] hover:-translate-y-[2px] active:translate-y-[1px] transition-all duration-500 dark:bg-gradient-to-b dark:from-slate-500 dark:via-slate-700 dark:to-slate-900 dark:text-slate-50",

        // 8. LIQUID METAL - metallic, futuristic, with a liquid metal effect
        liquidMetal:
          "relative overflow-hidden bg-slate-800 text-white font-semibold shadow-[0_14px_50px_rgba(0,0,0,0.5)] rounded-xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-slate-700 before:via-slate-500 before:to-slate-700 before:opacity-30 before:blur-[5px] before:translate-x-[-100%] before:transition-transform before:duration-1200 hover:before:translate-x-[100%] hover:shadow-[0_20px_70px_rgba(0,0,0,0.7)] hover:-translate-y-[1px] active:translate-y-[1px] transition-all duration-500",

        velvetLight:
          "relative bg-gradient-to-br from-rose-600 to-rose-800 text-white font-semibold rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.25)] before:absolute before:inset-0 before:bg-[url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"8\" height=\"8\" fill=\"none\" stroke=\"rgba(255,255,255,0.05)\" stroke-width=\"1\"><path d=\"M0 8 L8 0 M-1 1 L1 -1 M7 9 L9 7\"/></svg>')] before:opacity-0 before:transition-opacity before:duration-600 hover:before:opacity-30 hover:shadow-[0_16px_45px_rgba(0,0,0,0.35)] hover:-translate-y-[1px] active:translate-y-[1px] transition-all duration-450",

        auroraWave:
          "relative bg-gradient-to-r from-teal-500 via-cyan-400 to-indigo-600 text-white font-medium rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.35)] bg-[length:200%_200%] animate-[auroraShift_6s_ease_infinite] hover:shadow-[0_18px_55px_rgba(0,0,0,0.55)] hover:-translate-y-[1.5px] active:translate-y-[1px] transition-all duration-400",

        obsidianEdge:
          "relative bg-neutral-900 text-gray-100 border border-neutral-700 shadow-[0_8px_25px_rgba(0,0,0,0.6)] rounded-md hover:border-neutral-400 hover:shadow-[0_16px_50px_rgba(0,0,0,0.8)] hover:-translate-y-[2px] active:translate-y-[1px] transition-all duration-350 before:absolute before:inset-0 before:border-2 before:border-transparent before:rounded-md before:transition-colors before:duration-300 hover:before:border-neutral-400/40"

      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
