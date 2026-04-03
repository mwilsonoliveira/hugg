import * as React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "available" | "under_review" | "adopted";
}

export function Badge({ children, variant = "available" }: BadgeProps) {
  const variants = {
    available: "bg-green-100 text-green-800",
    under_review: "bg-yellow-100 text-yellow-800",
    adopted: "bg-gray-100 text-gray-800",
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
}
