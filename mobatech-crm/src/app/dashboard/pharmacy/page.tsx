import { serverFetch } from "@/lib/serverApi";
import { PharmacyClient } from "@/components/pharmacy/PharmacyClient";
import { PharmacyOrder, Medicine, MedicineCategory } from "@/types/api";

export const revalidate = 60; // Cache for 60 seconds (ISR)

export default async function PharmacyPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const tab = typeof (await searchParams).tab === "string" ? (await searchParams).tab : "orders";
  const page = typeof (await searchParams).page === "string" ? (await searchParams).page : "1";
  const search = typeof (await searchParams).search === "string" ? (await searchParams).search : "";

  let orders: PharmacyOrder[] = [];
  let medicines: Medicine[] = [];
  let categories: MedicineCategory[] = [];

  try {
    if (tab === "orders") {
      orders = await serverFetch(`/api/admin/pharmacy/orders?page=${page}&search=${search}`);
    } else if (tab === "medicines") {
      medicines = await serverFetch(`/api/pharmacy/medicines?page=${page}&search=${search}`);
      categories = await serverFetch(`/api/pharmacy/categories`);
    }
  } catch (e) {
    console.error(e);
  }


  return <PharmacyClient initialMedicines={medicines} categories={categories} initialOrders={orders} />;
}
