import 'package:flutter/material.dart';

import '../../../../core/constants/app_strings.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import 'tracking_info_widgets.dart';

class TrackingInfoSheet extends StatelessWidget {
  final int estimatedMinutes;

  const TrackingInfoSheet({super.key, required this.estimatedMinutes});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(AppSpacing.radiusXl)),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadowColor,
            blurRadius: 20,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            margin: const EdgeInsets.only(top: AppSpacing.sm),
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppColors.border,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(
                AppSpacing.pagePadding, AppSpacing.xl, AppSpacing.pagePadding, AppSpacing.sm),
            child: Row(
              children: [
                EstimatedTimeCircle(estimatedMinutes: estimatedMinutes),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        AppStrings.ambulanceHeading,
                        style: AppTypography.body.copyWith(
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: AppSpacing.xs),
                      Text(
                        '${AppStrings.estimateArrival}$estimatedMinutes${AppStrings.minuteText}',
                        style: AppTypography.bodySmall.copyWith(
                          color: AppColors.textSecondary,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: AppSpacing.xxl, color: AppColors.border),
          const Padding(
            padding: EdgeInsets.fromLTRB(
                AppSpacing.pagePadding, 0, AppSpacing.pagePadding, AppSpacing.sm),
            child: Row(children: [DriverInfoRow()]),
          ),
          SizedBox(height: MediaQuery.of(context).padding.bottom + AppSpacing.md),
        ],
      ),
    );
  }
}
