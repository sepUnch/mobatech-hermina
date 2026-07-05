import React from "react";

const STATUS_COLOR: Record<string, { bg: string; text: string; dot: string }> = {
  pending:    { bg: "bg-yellow-500/10", text: "text-yellow-600", dot: "bg-yellow-500" },
  approved:   { bg: "bg-blue-500/10",   text: "text-blue-600",   dot: "bg-blue-500"   },
  completed:  { bg: "bg-green-500/10",  text: "text-green-600",  dot: "bg-green-500"  },
  cancelled:  { bg: "bg-red-500/10",    text: "text-red-600",    dot: "bg-red-500"    },
  dispatched: { bg: "bg-indigo-500/10", text: "text-indigo-600", dot: "bg-indigo-500" },
  arrived:    { bg: "bg-teal-500/10",   text: "text-teal-600",   dot: "bg-teal-500"   },
  resolved:   { bg: "bg-gray-500/10",   text: "text-gray-500",   dot: "bg-gray-400"   },
};

export function StatusPill({ status }: { status: string }) {
  const s = STATUS_COLOR[status?.toLowerCase()] ?? STATUS_COLOR["pending"];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}
