import React from "react";
import { ChatSession } from "./AiAuditClient";

export function AiAuditChatHistory({
  sessions,
  loadingChats,
  expandedSession,
  setExpandedSession,
}: {
  sessions: ChatSession[];
  loadingChats: boolean;
  expandedSession: number | null;
  setExpandedSession: (id: number | null) => void;
}) {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Chat History & Audit (Anonymized)</h2>
      <div className="rounded-2xl border glass-panel overflow-hidden shadow-sm">
        {loadingChats ? (
          <div className="p-8 text-center text-foreground/50 animate-pulse text-sm">Memuat riwayat chat...</div>
        ) : sessions.length === 0 ? (
          <div className="p-8 text-center text-foreground/50">Tidak ada riwayat chat.</div>
        ) : (
          <div className="divide-y divide-glass-border">
            {sessions.map((session) => (
              <div key={session.id} className="bg-black/5 dark:bg-white/5">
                <div
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                  onClick={() => setExpandedSession(expandedSession === session.id ? null : session.id)}
                >
                  <div>
                    <div className="font-semibold text-primary">{session.title || "Percakapan Baru"}</div>
                    <div className="text-xs text-foreground/50 mt-1">
                      Sesi ID: {session.id} • Terakhir aktif:{" "}
                      {new Date(session.updated_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="text-foreground/50 text-sm">
                    {expandedSession === session.id ? "Tutup" : "Lihat Detail"}
                  </div>
                </div>

                {expandedSession === session.id && (
                  <div className="p-4 bg-background">
                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                      {session.Messages?.length > 0 ? (
                        session.Messages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                          >
                            <span className="text-[10px] text-foreground/40 mb-1 ml-1 uppercase">
                              {msg.role === "user" ? "Pasien (Anonymized)" : "AI Assistant"}
                            </span>
                            <div
                              className={`p-3 rounded-2xl max-w-[80%] text-sm ${
                                msg.role === "user"
                                  ? "bg-primary text-primary-foreground rounded-tr-sm"
                                  : "bg-black/5 dark:bg-white/10 text-foreground rounded-tl-sm"
                              }`}
                            >
                              {msg.content}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-center text-foreground/50">Sesi ini kosong.</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
