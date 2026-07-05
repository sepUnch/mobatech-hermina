"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { AiAuditMonitor } from "./AiAuditMonitor";
import { AiAuditChatHistory } from "./AiAuditChatHistory";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { PrivacyComplianceBadge } from "./PrivacyComplianceBadge";
import { AiAuditHeader } from "./AiAuditHeader";
import { ConfirmModal } from "./ConfirmModal";
import { RagStatus, ChatSession, ChatMessage } from "@/types/api";

export function AiAuditClient({ initialData, searchParams }: { initialData?: unknown, searchParams?: Record<string, string | string[] | undefined> }) {
  const user = useAuthStore((state) => state.user);
  const role = user?.role || "admin";
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

  const [showSyncConfirm, setShowSyncConfirm] = useState(false);

  const executeManualSync = async () => {
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

  

  if (!["admin"].includes(role)) {
    return <ForbiddenView />;
  }
  return (
    <div className="space-y-6 animate-slide-in">
      <AiAuditHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AiAuditMonitor
          loadingStats={loadingStats}
          ragStatus={ragStatus}
          isSyncing={isSyncing}
          handleManualSync={() => setShowSyncConfirm(true)}
        />

        <PrivacyComplianceBadge />
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

      <ConfirmModal
        isOpen={showSyncConfirm}
        onClose={() => setShowSyncConfirm(false)}
        onConfirm={() => {
          setShowSyncConfirm(false);
          executeManualSync();
        }}
        title="Bangun Ulang Knowledge Base"
        description="Apakah Anda yakin ingin membangun ulang Vector DB? Ini mungkin membutuhkan waktu beberapa detik."
        confirmText="Mulai Sinkronisasi"
        variant="primary"
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
