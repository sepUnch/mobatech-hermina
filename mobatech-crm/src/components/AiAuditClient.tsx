"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { AiAuditMonitor } from "./AiAuditMonitor";
import { AiAuditChatHistory } from "./AiAuditChatHistory";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";

export interface RagStatus {
  status: string;
  vector_count: number;
  knowledge_base_size: number;
}

export interface ChatMessage {
  id: number;
  role: "user" | "model";
  content: string;
  created_at: string;
}

export interface ChatSession {
  id: number;
  user_id: string;
  title: string;
  updated_at: string;
  Messages: ChatMessage[];
}

export function AiAuditClient({ initialData, searchParams }: { initialData?: unknown, searchParams?: Record<string, string | string[] | undefined> }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "admin";

  if (!["admin"].includes(role)) {
    return <ForbiddenView />;
  }

  const [ragStatus, setRagStatus] = useState<RagStatus | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingChats, setLoadingChats] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [expandedSession, setExpandedSession] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
  }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const loadStatus = async () => {
    try {
      setLoadingStats(true);
      const res = await api.get<RagStatus>("/api/admin/rag/status");
      setRagStatus(res.data);
    } catch (err) {
      setToast({ isOpen: true, message: "Gagal mengambil status RAG Engine", type: "error" });
    } finally {
      setLoadingStats(false);
    }
  };

  const loadChats = async () => {
    try {
      setLoadingChats(true);
      const res = await api.get<ChatSession[]>(`/api/admin/chats${searchQuery ? `?search=${encodeURIComponent(searchQuery)}` : ""}`);
      setSessions(res.data || []);
    } catch (err) {
      setToast({ isOpen: true, message: "Gagal memuat histori chat", type: "error" });
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  useEffect(() => {
    loadChats();
  }, [searchQuery]);

  const handleManualSync = async () => {
    const confirmSync = confirm("Apakah Anda yakin ingin membangun ulang Vector DB? Ini mungkin membutuhkan waktu beberapa detik.");
    if (!confirmSync) return;

    try {
      setIsSyncing(true);
      const res = await api.post<{ status: string; message: string }>("/api/admin/rag/sync", {});
      if (res.data.status === "success") {
        setToast({ isOpen: true, message: "Sinkronisasi berhasil! Knowledge Base telah diperbarui.", type: "success" });
        loadStatus();
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      setToast({ isOpen: true, message: "Gagal melakukan sinkronisasi: " + (err as Error).message, type: "error" });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Orchestrator Dashboard</h1>
          <p className="text-foreground/60 text-xs mt-1">
            Pusat kendali dan audit untuk AI Chatbot (GPT-5) dan *Retrieval-Augmented Generation* (RAG).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AiAuditMonitor
          loadingStats={loadingStats}
          ragStatus={ragStatus}
          isSyncing={isSyncing}
          handleManualSync={handleManualSync}
        />

        <div className="rounded-2xl border glass-panel p-6 shadow-sm flex flex-col justify-center items-center text-center">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🛡️</span>
          </div>
          <h3 className="font-semibold text-lg">Privacy & PDP Compliant</h3>
          <p className="text-sm text-foreground/60 mt-2 max-w-sm">
            Sistem AI menggunakan Anonymization Engine di mana informasi pribadi pasien disamarkan sebelum diakses oleh Model LLM, sesuai dengan hukum Perlindungan Data Pribadi.
          </p>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <SearchFilterBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <AiAuditChatHistory
        sessions={sessions}
        loadingChats={loadingChats}
        expandedSession={expandedSession}
        setExpandedSession={setExpandedSession}
      />

      <CustomSnackbar
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast((t) => ({ ...t, isOpen: false }))}
      />
    </div>
  );
}
