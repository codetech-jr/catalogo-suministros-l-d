import * as React from "react";
import { cn } from "@/lib/utils/cn";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          ref={ref}
          className={cn(
            "flex w-full rounded-lg border border-hairline bg-canvas-card px-4 py-3 text-base sm:text-sm text-text-primary placeholder:text-text-muted transition-all duration-200 outline-none focus:border-accent-electric focus:ring-1 focus:ring-accent-electric/25 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-danger focus:border-danger focus:ring-danger/25",
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-danger font-mono font-medium">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
