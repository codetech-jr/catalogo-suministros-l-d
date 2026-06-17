import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "electric" | "amber" | "success" | "danger";
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold select-none border tracking-wider uppercase font-mono transition-colors",
        {
          "bg-canvas-card border-hairline text-text-secondary": variant === "default",
          "bg-accent-electric/10 border-accent-electric/20 text-accent-electric": variant === "electric",
          "bg-accent-amber/10 border-accent-amber/20 text-accent-amber": variant === "amber",
          "bg-success/10 border-success/20 text-success": variant === "success",
          "bg-danger/10 border-danger/20 text-danger": variant === "danger",
        },
        className
      )}
      {...props}
    />
  );
}

export default Badge;
