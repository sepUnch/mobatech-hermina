import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/utils/custom_snackbar.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../providers/pharmacy_provider.dart';
import '../widgets/shimmer_loading.dart';
import 'catalog_widgets.dart';

class SearchAndCategories extends StatelessWidget {
  final TextEditingController searchController;
  final ValueChanged<String> onSearchChanged;
  final int? selectedCategoryId;
  final ValueChanged<int?> onCategorySelected;
  final AsyncValue<List<dynamic>> categoriesAsync;

  const SearchAndCategories({
    super.key,
    required this.searchController,
    required this.onSearchChanged,
    required this.selectedCategoryId,
    required this.onCategorySelected,
    required this.categoriesAsync,
  });

  @override
  Widget build(BuildContext context) {
    return SliverToBoxAdapter(
      child: Padding(
        padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.pagePadding, vertical: AppSpacing.md),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            AppTextField(
              label: '',
              controller: searchController,
              hint: AppStrings.searchMedicineHint,
              onChanged: onSearchChanged,
              prefixIcon: const Icon(Icons.search),
            ),
            const SizedBox(height: AppSpacing.md),
            categoriesAsync.when(
              data: (categories) => SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: [
                    CategoryChip(
                      label: AppStrings.allCategory,
                      isSelected: selectedCategoryId == null,
                      onSelected: () => onCategorySelected(null),
                    ),
                    ...categories.map(
                      (c) => CategoryChip(
                        label: c.name,
                        isSelected: selectedCategoryId == c.id,
                        onSelected: () => onCategorySelected(c.id),
                      ),
                    ),
                  ],
                ),
              ),
              loading: () => SingleChildScrollView(
                scrollDirection: Axis.horizontal,
                child: Row(
                  children: List.generate(
                    4,
                    (index) => const Padding(
                      padding: EdgeInsets.only(right: AppSpacing.sm),
                      child: ShimmerLoading(
                        width: 80,
                        height: 35,
                        borderRadius: 20,
                      ),
                    ),
                  ),
                ),
              ),
              error: (err, stack) => Text(
                AppStrings.errorLoadCategories,
                style: AppTypography.bodySmall.copyWith(color: AppColors.error),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class MedicinesList extends ConsumerWidget {
  final AsyncValue<List<dynamic>> medicinesAsync;
  const MedicinesList({
    super.key,
    required this.medicinesAsync,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return medicinesAsync.when(
      data: (medicines) => SliverPadding(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePadding),
        sliver: SliverList(
          delegate: SliverChildBuilderDelegate((context, index) {
            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.md),
              child: MedicineCard(
                medicine: medicines[index],
                onAddToCart: () {
                  ref
                      .read(cartProvider.notifier)
                      .addToCart(medicines[index].id, 1);
                  ScaffoldMessenger.of(context).hideCurrentSnackBar();
                  CustomSnackbar.showSuccess(
                    context,
                    '${medicines[index].name}${AppStrings.addedToCartSuffix}',
                  );
                },
              ),
            );
          }, childCount: medicines.length),
        ),
      ),
      loading: () => SliverPadding(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePadding),
        sliver: SliverList(
          delegate: SliverChildBuilderDelegate(
            (context, index) => const Padding(
              padding: EdgeInsets.only(bottom: AppSpacing.md),
              child: ShimmerLoading(
                width: double.infinity,
                height: 100,
                borderRadius: 16,
              ),
            ),
            childCount: 4,
          ),
        ),
      ),
      error: (err, stack) => const SliverToBoxAdapter(
        child: Center(child: Text(AppStrings.errorLoadMedicines)),
      ),
    );
  }
}
