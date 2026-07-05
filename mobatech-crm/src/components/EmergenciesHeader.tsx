import { SearchFilterBar } from "@/components/ui/SearchFilterBar";
import { FilterDropdown } from "@/components/ui/FilterDropdown";
import { APP_STRINGS } from "@/lib/constants";

export function EmergenciesHeader({
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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-500 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          Gawat Darurat
        </h1>
        <p className="text-foreground/60 text-xs mt-1">Live tracking panggilan darurat dan pengerahan ambulans.</p>
      </div>
      <div className="flex gap-2">
        <FilterDropdown
          value={filterValue}
          onChange={setFilterValue}
          options={[
            { label: 'Pending', value: 'pending' },
            { label: 'Direspon', value: 'responded' },
            { label: 'Selesai', value: 'resolved' },
          ]}
          placeholder={APP_STRINGS.common.searchStatus}
        />
        <SearchFilterBar value={searchQuery} onChange={setSearchQuery} />
      </div>
    </div>
  );
}
