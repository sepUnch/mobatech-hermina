"use client";
import { useState } from "react";
import { Medicine, MedicineCategory, PharmacyOrder } from "@/types/api";
import { PharmacyMedicines } from "./PharmacyMedicines";
import { PharmacyOrders } from "./PharmacyOrders";
import { PageHeader } from "@/components/ui/PageHeader";
import { Package, ShoppingCart } from "lucide-react";

export function PharmacyClient({
  initialMedicines,
  categories,
  initialOrders,
}: {
  initialMedicines: Medicine[];
  categories: MedicineCategory[];
  initialOrders: PharmacyOrder[];
}) {
  const [activeTab, setActiveTab] = useState<"orders" | "medicines">("orders");

  return (
    <div className="space-y-6 animate-slide-in relative">
      <PageHeader
        title="Manajemen Apotek"
        description="Kelola order obat, stok, dan kategori produk apotek."
      />
      
      {/* Unified Tab Navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-xl w-full sm:w-max">
        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${
            activeTab === "orders" ? "bg-white dark:bg-black/50 shadow text-primary" : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <ShoppingCart size={16} /> Pesanan Obat
        </button>
        <button
          onClick={() => setActiveTab("medicines")}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors w-full sm:w-auto ${
            activeTab === "medicines" ? "bg-white dark:bg-black/50 shadow text-primary" : "text-foreground/60 hover:text-foreground"
          }`}
        >
          <Package size={16} /> Katalog Obat
        </button>
      </div>

      {activeTab === "orders" && <PharmacyOrders initialOrders={initialOrders} />}
      {activeTab === "medicines" && (
        <PharmacyMedicines initialMedicines={initialMedicines} categories={categories} />
      )}
    </div>
  );
}
