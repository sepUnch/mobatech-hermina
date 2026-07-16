part of 'appointment_header_widgets.dart';

class AppointmentSearchBar extends ConsumerWidget {
  final TextEditingController searchController;

  const AppointmentSearchBar({super.key, required this.searchController});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Row(
        children: [
          Expanded(child: _buildSearchInput(ref)),
          const SizedBox(width: 12),
          _buildFilterButton(context),
        ],
      ),
    );
  }

  Widget _buildSearchInput(WidgetRef ref) {
    return Container(
      height: 48,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.grey.shade300),
      ),
      child: TextField(
        controller: searchController,
        onChanged: (value) =>
            ref.read(searchQueryProvider.notifier).state = value,
        style: const TextStyle(color: AppColors.textDark),
        decoration: const InputDecoration(
          hintText: AppStrings.searchDoctorHint,
          hintStyle: TextStyle(color: AppColors.textGrey, fontSize: 13),
          prefixIcon: Icon(Icons.search, color: AppColors.textGrey, size: 20),
          border: InputBorder.none,
          contentPadding: EdgeInsets.symmetric(vertical: 14),
        ),
      ),
    );
  }

  Widget _buildFilterButton(BuildContext context) {
    return GestureDetector(
      onTap: () {
        AppointmentSortBottomSheet.show(context);
      },
      child: Container(
        height: 48,
        width: 48,
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.grey.shade300),
        ),
        child: const Icon(Icons.tune, color: AppColors.textGrey, size: 20),
      ),
    );
  }
}
