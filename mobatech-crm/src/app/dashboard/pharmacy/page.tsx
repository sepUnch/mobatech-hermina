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
    // Fetch all required data for the client-side tabs to work seamlessly
    const [ordersRes, medicinesRes, categoriesRes] = await Promise.all([
      serverFetch(`/api/admin/pharmacy/orders?page=${page}&search=${search}`).catch(() => []),
      serverFetch(`/api/pharmacy/medicines?page=${page}&search=${search}`).catch(() => []),
      serverFetch(`/api/pharmacy/categories`).catch(() => [])
    ]);
    orders = ordersRes || [];
    medicines = medicinesRes || [];
    categories = categoriesRes || [];
  } catch (e) {
    console.error(e);
  }


  return <PharmacyClient initialMedicines={medicines} categories={categories} initialOrders={orders} />;
}
