import { PatientsClient } from "@/components/PatientsClient";
import { serverFetch } from "@/lib/serverApi";

export const revalidate = 60; // Cache for 60 seconds (ISR)

export default async function Page({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const page = (await searchParams).page || "1";
  const search = (await searchParams).search || "";
  
  // Example fetch, customize per page
  let initialData: unknown = [];
  try {
    initialData = await serverFetch(`/api/admin/users?page=${page}&search=${search}`);
  } catch (e) {
    console.error(e);
  }

  return <PatientsClient initialData={initialData} searchParams={await searchParams} />;
}
