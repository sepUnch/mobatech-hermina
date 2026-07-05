import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { APP_STRINGS } from "@/lib/constants";

export function MedicalResultsControls({
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
          { label: 'Terbaru', value: 'newest' },
          { label: 'Terlama', value: 'oldest' },
        ]}
        placeholder={APP_STRINGS.common.searchSort}
      />
      <SearchFilterBar value={searchQuery} onChange={setSearchQuery} />
    </div>
  );
}
