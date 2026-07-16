import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/widgets/skeleton_loader.dart';
import '../../../../core/utils/error_handler.dart';
import '../../../pharmacy/providers/pharmacy_provider.dart';
import 'history_card.dart';

class PharmacyTab extends ConsumerWidget {
  const PharmacyTab({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final ordersAsync = ref.watch(ordersProvider);
    return ordersAsync.when(
      data: (orders) {
        if (orders.isEmpty) {
          return Center(
            child: Text(
              AppStrings.noPharmacyHistory,
              style: AppTypography.body.copyWith(color: AppColors.textSecondary),
            ),
          );
        }
        return ListView.separated(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePadding, vertical: AppSpacing.md),
          itemCount: orders.length,
          separatorBuilder: (_, __) => const SizedBox(height: AppSpacing.sm),
          itemBuilder: (context, index) {
            final order = orders[index];
            return HistoryCard(
              title: 'Pesanan Obat #${order.orderNumber}',
              status: order.status,
              date: '-', // Real model doesn't have date string yet, so we show dash
              onTap: () => context.push('/pharmacy/tracking', extra: order),
            );
          },
        );
      },
      loading: () => const CardSkeletonLoader(count: 3),
      error: (e, stack) => _buildErrorState(ErrorHandler.getMessage(e)),
    );
  }

  Widget _buildErrorState(String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(AppSpacing.xxl),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.cloud_off,
              size: 64,
              color: AppColors.textTertiary,
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              message,
              textAlign: TextAlign.center,
              style: AppTypography.body.copyWith(color: AppColors.textSecondary),
            ),
          ],
        ),
      ),
    );
  }
}
