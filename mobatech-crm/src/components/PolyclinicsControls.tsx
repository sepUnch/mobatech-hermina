import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";

export function PolyclinicsControls({
  filterValue,
  setFilterValue,
  searchQuery,
  setSearchQuery,
}: {
  filterValue: string;
  setFilterValue: (val: string) => void;
  searchQuery: string;
  setSearchQuery: (val: string) => void;
}) {
  return (
    <div className="flex justify-end mb-4 gap-2">
      <FilterDropdown
        value={filterValue}
        onChange={setFilterValue}
        options={[
          { label: 'Aktif', value: 'active' },
          { label: 'Nonaktif', value: 'inactive' },
        ]}
        placeholder="Status..."
      />
      <SearchFilterBar value={searchQuery} onChange={setSearchQuery} />
    </div>
  );
}
