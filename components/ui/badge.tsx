import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        converting: "border-transparent bg-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  conversionProgress?: number; // Optional prop for progress percentage
}

function Badge({
  className,
  variant,
  conversionProgress = 0,
  ...props
}: BadgeProps) {
  // Calculate dynamic background style for converting variant
  const style =
    variant === "converting"
      ? {
          background:
            conversionProgress > 0
              ? `
              linear-gradient(
                  to right,
                  #388E3C 0%,            
                  #2E7D32 ${Math.max(0, conversionProgress - 30)}%, 
                  #1B5E20 ${Math.max(5, conversionProgress - 15)}%,
                  #004D40 ${conversionProgress}%, 
                  transparent ${conversionProgress}%
              )
          `
              : "transparent",
          border:
            conversionProgress > 0
              ? `linear-gradient(to right, #4CAF50 0%, #4CAF50 ${conversionProgress}%, transparent ${conversionProgress}%)`
              : "transparent",
          fontFamily: "monospace",
        }
      : {};

  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      style={style}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
