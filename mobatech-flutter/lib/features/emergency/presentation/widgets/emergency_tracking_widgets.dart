import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_strings.dart';

class TrackingTopBar extends StatelessWidget {
  const TrackingTopBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: EdgeInsets.fromLTRB(
        AppSpacing.pagePadding,
        MediaQuery.of(context).padding.top + AppSpacing.sm,
        AppSpacing.pagePadding,
        AppSpacing.md,
      ),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
          colors: [AppColors.textPrimary.withValues(alpha: 0.6), Colors.transparent],
        ),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(AppSpacing.sm),
            decoration: BoxDecoration(
              color: AppColors.surface.withValues(alpha: 0.2),
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
            ),
            child: const Icon(Icons.emergency, color: AppColors.surface, size: 20),
          ),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Text(
              AppStrings.ambulanceTracking,
              style: AppTypography.body.copyWith(
                color: AppColors.surface,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.sm, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.success,
              borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.circle, color: AppColors.surface, size: 8),
                const SizedBox(width: AppSpacing.xs),
                Text(
                  AppStrings.live,
                  style: AppTypography.caption.copyWith(
                    color: AppColors.surface,
                    fontWeight: FontWeight.w800,
                    letterSpacing: 1,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
