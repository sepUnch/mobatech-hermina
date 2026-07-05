"use client";

import { PharmacyPrescriptions } from "@/components/pharmacy/PharmacyPrescriptions";

export default function PrescriptionsPage() {
  return (
    <div className="space-y-6 animate-slide-in">
      <PharmacyPrescriptions />
    </div>
  );
}
