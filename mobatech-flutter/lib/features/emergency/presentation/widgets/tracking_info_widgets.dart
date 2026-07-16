import 'package:flutter/material.dart';
import '../../../../core/utils/custom_snackbar.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_strings.dart';

class EstimatedTimeCircle extends StatelessWidget {
  final int estimatedMinutes;

  const EstimatedTimeCircle({super.key, required this.estimatedMinutes});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 64,
      height: 64,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: AppColors.primary,
        boxShadow: [
          BoxShadow(
            color: AppColors.primary.withValues(alpha: 0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            '$estimatedMinutes',
            style: AppTypography.h3.copyWith(
              color: AppColors.textOnPrimary,
              height: 1,
            ),
          ),
          Text(
            AppStrings.min,
            style: AppTypography.caption.copyWith(
              color: AppColors.textOnPrimary.withValues(alpha: 0.7),
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }
}

class DriverInfoRow extends StatelessWidget {
  const DriverInfoRow({super.key});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: AppColors.primaryLight,
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.person, color: AppColors.primary, size: 26),
          ),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  AppStrings.driverName,
                  style: AppTypography.bodySmall.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  AppStrings.driverDetails,
                  style: AppTypography.caption.copyWith(color: AppColors.textSecondary),
                ),
              ],
            ),
          ),
          Container(
            decoration: BoxDecoration(
              color: AppColors.success,
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
              boxShadow: [
                BoxShadow(
                  color: AppColors.success.withValues(alpha: 0.3),
                  blurRadius: 8,
                  offset: const Offset(0, 3),
                ),
              ],
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                onTap: () {
                  ScaffoldMessenger.of(context).hideCurrentSnackBar();
                  CustomSnackbar.showInfo(context, AppStrings.contactingDriver);
                },
                child: const Padding(
                  padding: EdgeInsets.all(AppSpacing.sm),
                  child: Icon(Icons.phone, color: AppColors.textOnPrimary, size: 22),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
