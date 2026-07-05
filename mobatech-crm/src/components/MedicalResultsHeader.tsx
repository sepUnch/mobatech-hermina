import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { APP_STRINGS } from "@/lib/constants";

export function MedicalResultsHeader({
  openCreate,
  role,
  filterValue,
  setFilterValue,
  searchQuery,
  setSearchQuery,
}: {
  openCreate: () => void;
  role: string;
  filterValue: string;
  setFilterValue: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}) {
  return (
    <>
      <PageHeader
        title="Hasil Medis Pasien"
        description="Input dan kelola hasil lab, radiologi, dan pemeriksaan medis lainnya."
        action={
          <div title={role === "admin" ? "Aksi klinis hanya untuk Dokter/Apoteker" : undefined}>
            <Button onClick={openCreate} icon={<Plus size={18} />} disabled={role === "admin"}>
              Tambah Hasil Medis
            </Button>
          </div>
        }
      />
      <div className="flex justify-end mb-4 gap-2">
        <FilterDropdown
          value={filterValue}
          onChange={setFilterValue}
          options={[
            { label: 'Terbaru', value: 'newest' },
            { label: 'Terlama', value: 'oldest' },
          ]}
          placeholder={APP_STRINGS.common.searchSort}
        />
        <SearchFilterBar value={searchQuery} onChange={setSearchQuery} />
      </div>
    </>
  );
}
