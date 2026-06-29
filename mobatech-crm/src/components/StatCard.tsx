import Link from "next/link";
import React from "react";

export function StatCard({ icon, label, value, sub, href, color }: { icon: string; label: string; value: number | string; sub?: string; href: string; color: string; }) {
  return (
    <Link href={href} className={`group relative p-5 rounded-2xl border glass-panel overflow-hidden hover:scale-[1.02] transition-all duration-300 shadow-sm cursor-pointer`}>
      <div className={`absolute -top-3 -right-3 w-20 h-20 rounded-full ${color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
      <div className={`w-10 h-10 rounded-xl ${color} bg-opacity-15 flex items-center justify-center text-xl mb-3`}>{icon}</div>
      <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">{label}</p>
      <p className="text-3xl font-extrabold text-foreground mt-1">{value}</p>
      {sub && <p className="text-xs text-foreground/50 mt-1">{sub}</p>}
    </Link>
  );
}
