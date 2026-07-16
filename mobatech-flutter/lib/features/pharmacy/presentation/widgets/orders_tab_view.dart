import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/constants/app_strings.dart';
import '../../providers/pharmacy_provider.dart';
import '../widgets/shimmer_loading.dart';

class OrdersTabView extends ConsumerWidget {
  const OrdersTabView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ordersAsync = ref.watch(ordersProvider);

    return ordersAsync.when(
      data: (orders) {
        if (orders.isEmpty) {
          return Center(
            child: Text(
              AppStrings.noOrders,
              style: AppTypography.body
                  .copyWith(color: AppColors.textSecondary),
            ),
          );
        }
        return RefreshIndicator(
          onRefresh: () async {
            ref.invalidate(ordersProvider);
            await ref.read(ordersProvider.future);
          },
          child: ListView.separated(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.pagePadding, vertical: AppSpacing.md),
            itemCount: orders.length,
            separatorBuilder: (context, index) =>
                const SizedBox(height: AppSpacing.md),
            itemBuilder: (context, index) {
              final order = orders[index];
              return GestureDetector(
                onTap: () => context.push('/pharmacy/tracking', extra: order),
                child: AppCard(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            order.orderNumber,
                            style: AppTypography.body.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: AppSpacing.sm,
                              vertical: AppSpacing.xs,
                            ),
                            decoration: BoxDecoration(
                              color:
                                  AppColors.warning.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(
                                  AppSpacing.radiusSm),
                            ),
                            child: Text(
                              order.status,
                              style: AppTypography.caption.copyWith(
                                color: AppColors.warning,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: AppSpacing.md),
                      Row(
                        children: [
                          const Icon(
                            Icons.inventory_2_outlined,
                            color: AppColors.textSecondary,
                            size: 20,
                          ),
                          const SizedBox(width: AppSpacing.sm),
                          Expanded(
                            child: Text(
                              order.items
                                  .map((e) => e.medicine.name)
                                  .join(', '),
                              style: AppTypography.bodySmall.copyWith(
                                color: AppColors.textSecondary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                      const Divider(
                          height: AppSpacing.xl, color: AppColors.border),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            AppStrings.totalOrder,
                            style: AppTypography.bodySmall,
                          ),
                          Text(
                            'Rp ${order.totalPrice.toInt()}',
                            style: AppTypography.body.copyWith(
                              color: AppColors.primary,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        );
      },
      loading: () => ListView.separated(
        padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.pagePadding, vertical: AppSpacing.md),
        itemCount: 3,
        separatorBuilder: (context, index) =>
            const SizedBox(height: AppSpacing.md),
        itemBuilder: (context, index) => const ShimmerLoading(
          width: double.infinity,
          height: 140,
          borderRadius: 16,
        ),
      ),
      error: (err, stack) => Center(
        child: Text(
          AppStrings.errorLoadOrders,
          style: AppTypography.body.copyWith(color: AppColors.error),
        ),
      ),
    );
  }
}
