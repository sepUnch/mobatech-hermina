"use client";
import { useState, useEffect } from "react";
import { Prescription } from "@/types/api";
import { Medicine, MedicineCategory, PharmacyOrder } from "@/types/api";
import { PharmacyMedicines } from "./PharmacyMedicines";
import { PharmacyOrders } from "./PharmacyOrders";
import { PrescriptionFormModal } from "./PrescriptionFormModal";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { CustomSnackbar } from "@/components/CustomSnackbar";
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
  const searchParams = useSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState<{isOpen: boolean, message: string, type: "success"|"error"}>({ isOpen: false, message: "", type: "success" });

  useEffect(() => {
    if (searchParams?.get("action") === "create_prescription") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const handleSavePrescription = async (form: Partial<Prescription>) => {
    try {
      await api.post("/api/admin/pharmacy/prescriptions", form);
      setToast({ isOpen: true, message: "E-Resep berhasil diterbitkan!", type: "success" });
    } catch {
      setToast({ isOpen: true, message: "Gagal menerbitkan E-Resep", type: "error" });
    }
  };


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

      <PrescriptionFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSavePrescription} 
        initialAppointmentId={Number(searchParams?.get("appointment_id")) || 0}
        initialUserId={Number(searchParams?.get("user_id")) || 0}
        medicines={initialMedicines} 
      />
      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast(t => ({...t, isOpen: false}))} />
    </div>
  );
}
