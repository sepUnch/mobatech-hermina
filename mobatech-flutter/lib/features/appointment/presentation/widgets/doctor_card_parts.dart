import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';

class DoctorStatusBadge extends StatelessWidget {
  final bool isActive;

  const DoctorStatusBadge({super.key, required this.isActive});

  @override
  Widget build(BuildContext context) {
    if (isActive) {
      return Container(
        padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.sm, vertical: AppSpacing.xs),
        decoration: BoxDecoration(
          color: AppColors.success.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
        ),
        child: Text(
          'Available',
          style: AppTypography.caption.copyWith(
            color: AppColors.success,
            fontWeight: FontWeight.bold,
          ),
        ),
      );
    } else {
      return Container(
        padding: const EdgeInsets.symmetric(
            horizontal: AppSpacing.sm, vertical: AppSpacing.xs),
        decoration: BoxDecoration(
          color: AppColors.error.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
        ),
        child: Text(
          'Unavailable',
          style: AppTypography.caption.copyWith(
            color: AppColors.error,
            fontWeight: FontWeight.bold,
          ),
        ),
      );
    }
  }
}
