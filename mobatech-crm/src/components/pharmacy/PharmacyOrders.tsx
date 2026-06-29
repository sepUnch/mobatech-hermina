"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { ForbiddenView } from "@/components/ui/ForbiddenView";

import { PharmacyOrder } from "@/types/api";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { useState } from "react";
import { Badge, BadgeVariant } from "@/components/ui/Badge";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { useEffect } from "react";
import { APP_STRINGS } from "@/lib/constants";
import { Formatters } from "@/lib/formatters";

function StatusBadge({ value, type }: { value: string; type: "order" | "payment" }) {
  let variant: BadgeVariant = "neutral";
  if (value === "Completed" || value === "Paid") variant = "success";
  else if (value === "Pending" || value === "Unpaid") variant = "warning";
  else if (value === "Cancelled" || value === "Refunded") variant = "error";
  else if (value === "Processing" || value === "Verifying" || value === "Ready") variant = "info";
  return <Badge variant={variant}>{value}</Badge>;
}

const ORDER_STATUSES = ["Pending", "Verifying", "Processing", "Ready", "Completed", "Cancelled"];
const PAYMENT_STATUSES = ["Unpaid", "Paid", "Refunded"];

export function PharmacyOrders({ initialOrders }: { initialOrders: PharmacyOrder[] }) {
  const role = useAuthStore((state) => state.user)?.role || "admin";
  const [orders, setOrders] = useState<PharmacyOrder[]>(initialOrders);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<{isOpen: boolean; message: string; type: "success"|"error"}>({ isOpen: false, message: "", type: "success" });
  const showToast = (message: string, type: "success" | "error") => setToast({ isOpen: true, message, type });
  const [filterValue, setFilterValue] = useState("");

  const loadOrders = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchQuery) queryParams.append("search", searchQuery);
      if (filterValue) queryParams.append("filter", filterValue);
      const qs = queryParams.toString() ? `?${queryParams.toString()}` : "";
      const res = await api.get<PharmacyOrder[]>(`/api/admin/pharmacy/orders${qs}`);
      setOrders(res.data || []);
    } catch { /* suppress */ }
  };

  useEffect(() => { loadOrders(); }, [searchQuery, filterValue]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/api/admin/pharmacy/orders/${id}/status`, { status });
      showToast("Status order diperbarui", "success");
      setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    } catch { showToast("Gagal memperbarui status", "error"); }
  };

  const handleUpdatePayment = async (id: number, payment_status: string) => {
    try {
      await api.put(`/api/admin/pharmacy/orders/${id}/payment`, { payment_status });
      showToast("Status pembayaran diperbarui", "success");
      setOrders(orders.map(o => o.id === id ? { ...o, payment_status } : o));
    } catch { showToast("Gagal memperbarui pembayaran", "error"); }
  };

  if (orders.length === 0) {
    return <Card noPadding><div className="p-10 text-center text-foreground/50 text-sm">Belum ada order masuk.</div></Card>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2">
        <div className="flex flex-col sm:flex-row flex-1 sm:flex-none gap-2">
          <FilterDropdown
            value={filterValue}
            onChange={setFilterValue}
            options={[
              { label: 'Pending', value: 'pending' },
              { label: 'Selesai', value: 'resolved' },
            ]}
            placeholder={APP_STRINGS.common.searchStatus}
            className="w-full sm:w-48 h-11"
          />
          <SearchFilterBar value={searchQuery} onChange={setSearchQuery} className="w-full sm:max-w-xs h-11" />
        </div>
      </div>
      <Card noPadding>
        <div className="divide-y divide-glass-border">
        {orders.map((order) => (
          <div key={order.id}>
            <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
              <div className="flex-1">
                <div className="font-semibold text-sm">{order.order_number}</div>
                <div className="text-xs text-foreground/50 mt-0.5">
                  User #{order.user_id} • {Formatters.date(order.created_at)} • {order.pickup_method}
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <StatusBadge value={order.status} type="order" />
                <StatusBadge value={order.payment_status} type="payment" />
                <span className="text-sm font-semibold">{Formatters.currency(order.total_price)}</span>
              </div>
            </div>
            {expandedOrder === order.id && (
              <div className="px-4 pb-4 bg-black/5 dark:bg-white/5 space-y-3 pt-2">
                <div className="text-xs text-foreground/50 font-semibold uppercase tracking-wider">Item Pesanan</div>
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.medicine?.name ?? `Obat #${item.medicine_id}`} × {item.quantity}</span>
                    <span className="font-medium">{Formatters.currency(item.subtotal)}</span>
                  </div>
                ))}
                {order.delivery_address && <div className="text-xs text-foreground/60"><span className="font-medium">Alamat:</span> {order.delivery_address}</div>}
                {order.notes && <div className="text-xs text-foreground/60"><span className="font-medium">Catatan:</span> {order.notes}</div>}
                
                <div className="flex gap-4 pt-3 mt-2 border-t border-glass-border flex-wrap">
                  <div className="flex flex-col gap-1.5" title={role === "admin" ? "Aksi klinis hanya untuk Dokter/Apoteker" : undefined}>
                    <span className="text-xs font-semibold text-foreground/70">Status Order</span>
                    <select value={order.status} onChange={(e) => handleUpdateStatus(order.id, e.target.value)} disabled={role === "admin"}
                      className="text-sm border border-glass-border rounded-lg px-3 py-1.5 bg-background glass-input cursor-pointer outline-none focus:border-primary disabled:opacity-50">
                      {ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5" title={role === "admin" ? "Aksi klinis hanya untuk Dokter/Apoteker" : undefined}>
                    <span className="text-xs font-semibold text-foreground/70">Status Pembayaran</span>
                    <select value={order.payment_status} onChange={(e) => handleUpdatePayment(order.id, e.target.value)} disabled={role === "admin"}
                      className="text-sm border border-glass-border rounded-lg px-3 py-1.5 bg-background glass-input cursor-pointer outline-none focus:border-primary disabled:opacity-50">
                      {PAYMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </div>
  );
}
