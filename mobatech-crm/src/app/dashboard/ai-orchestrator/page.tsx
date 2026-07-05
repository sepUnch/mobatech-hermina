"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { APP_STRINGS } from "@/lib/constants";
import { CustomSnackbar } from "@/components/CustomSnackbar";

export default function AIOrchestratorPage() {
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({ isOpen: false, message: "", type: "success" });
  const [vectorCount, setVectorCount] = useState<number | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await api.get<{vector_count: number, status: string, knowledge_base_size: number}>("/api/admin/rag/status");
      if (res.data && typeof res.data.vector_count === "number") {
        setVectorCount(res.data.vector_count);
      }
    } catch (err) {
      console.error("Failed to fetch RAG status:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleSync = async () => {
    setSubmitting(true);
    try {
      await api.post("/api/admin/rag/sync", {});
      setToast({
        isOpen: true,
        message: APP_STRINGS.aiOrchestrator.syncSuccess,
        type: "success",
      });
      await fetchStatus();
    } catch (err) {
      console.error(err);
      setToast({
        isOpen: true,
        message: APP_STRINGS.aiOrchestrator.syncError,
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{APP_STRINGS.aiOrchestrator.title}</h1>
        <p className="text-foreground/60 text-xs mt-1">{APP_STRINGS.aiOrchestrator.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border glass-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-[100px] flex items-center justify-center text-4xl">
            🧠
          </div>
          <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wider">
            {APP_STRINGS.aiOrchestrator.knowledgeBaseSize}
          </p>
          <p className="text-4xl font-extrabold text-foreground mt-2">
            {vectorCount !== null ? `${vectorCount} Vectors` : "Memuat..."}
          </p>
          <p className="text-xs text-foreground/60 mt-2">{APP_STRINGS.aiOrchestrator.knowledgeBaseDesc}</p>
        </div>

        <div className="p-6 rounded-2xl border glass-panel flex flex-col justify-between">
          <div>
            <p className="text-xs font-bold text-foreground/80 uppercase tracking-wider">RAG Database Alignment</p>
            <p className="text-xs text-foreground/60 mt-2">
              Lakukan sinkronisasi database MySQL ke Vector database (FAISS) asisten AI secara manual untuk meregenerasi natural language embeddings.
            </p>
          </div>
          <div className="mt-6">
            <button
              onClick={handleSync}
              disabled={submitting}
              className="w-full h-11 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-xl transition-all duration-200 shadow-md flex items-center justify-center disabled:opacity-50 cursor-pointer"
            >
              {submitting ? APP_STRINGS.aiOrchestrator.manualSyncSubmitting : APP_STRINGS.aiOrchestrator.manualSyncBtn}
            </button>
          </div>
        </div>
      </div>

      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </div>
  );
}
