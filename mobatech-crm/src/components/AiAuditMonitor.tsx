import React from "react";
import { RagStatus } from "@/types/api";

export function AiAuditMonitor({
  loadingStats,
  ragStatus,
  isSyncing,
  handleManualSync,
}: {
  loadingStats: boolean;
  ragStatus: RagStatus | null;
  isSyncing: boolean;
  handleManualSync: () => void;
}) {
  return (
    <div className="rounded-2xl border glass-panel p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Knowledge Base Monitor</h2>
      {loadingStats ? (
        <div className="animate-pulse flex space-x-4">
          <div className="h-4 bg-foreground/10 rounded w-3/4"></div>
        </div>
      ) : ragStatus ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-glass-border pb-2">
            <span className="text-foreground/70">Status Engine</span>
            <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded-md text-xs font-semibold capitalize">
              {ragStatus.status}
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-glass-border pb-2">
            <span className="text-foreground/70">Vector DB Count</span>
            <span className="font-medium text-lg">
              {ragStatus.vector_count} <span className="text-xs text-foreground/50">vectors</span>
            </span>
          </div>
          <div className="flex justify-between items-center border-b border-glass-border pb-2">
            <span className="text-foreground/70">Medical Knowledge Size</span>
            <span className="font-medium text-lg">
              {ragStatus.knowledge_base_size} <span className="text-xs text-foreground/50">documents</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="text-rose-500 text-sm">Python AI Engine tidak merespon / Offline.</div>
      )}

      <div className="mt-6">
        <button
          onClick={handleManualSync}
          disabled={isSyncing}
          className="w-full bg-primary hover:bg-primary-hover text-primary-foreground py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {isSyncing ? "Menyinkronkan..." : "Sinkronisasi Manual (Rebuild DB)"}
        </button>
        <p className="text-xs text-foreground/50 mt-2 text-center">
          Gunakan jika Anda baru saja menambah Jadwal/Poli baru agar AI mengetahuinya.
        </p>
      </div>
    </div>
  );
}
