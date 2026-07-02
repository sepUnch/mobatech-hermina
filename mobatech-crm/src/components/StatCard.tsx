import Link from "next/link";
import React, { ReactNode } from "react";

export function StatCard({ icon, label, value, sub, href, colorClass = "bg-primary text-primary" }: { icon: ReactNode; label: string; value: number | string; sub?: string; href: string; colorClass?: string; }) {
  // colorClass expects a string like "bg-primary text-primary", we split to use them
  const bgClass = colorClass.split(" ").find(c => c.startsWith("bg-")) || "bg-primary";
  const textClass = colorClass.split(" ").find(c => c.startsWith("text-")) || "text-primary";

  return (
    <Link href={href} className={`group relative p-5 rounded-2xl border glass-panel overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-sm cursor-pointer`}>
      <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full ${bgClass} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      <div className={`w-10 h-10 rounded-xl ${bgClass} bg-opacity-10 flex items-center justify-center mb-3 ${textClass}`}>
        {icon}
      </div>
      <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-extrabold text-foreground mt-1">{value}</p>
      {sub && <p className="text-xs text-foreground/50 mt-1">{sub}</p>}
    </Link>
  );
}
