import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_strings.dart';

class ArrivedCheckmark extends StatelessWidget {
  const ArrivedCheckmark({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 120,
      height: 120,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: AppColors.surface.withValues(alpha: 0.2),
        border: Border.all(color: AppColors.surface.withValues(alpha: 0.4), width: 3),
      ),
      child: const Icon(Icons.check_rounded, color: AppColors.surface, size: 64),
    );
  }
}

class ArrivedMessage extends StatelessWidget {
  const ArrivedMessage({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          AppStrings.ambulanceArrived,
          style: AppTypography.h2.copyWith(
            color: AppColors.surface,
          ),
        ),
        const SizedBox(height: AppSpacing.sm),
        Text(
          AppStrings.arrivedMessage,
          textAlign: TextAlign.center,
          style: AppTypography.body.copyWith(
            color: AppColors.surface.withValues(alpha: 0.8),
          ),
        ),
      ],
    );
  }
}

class ArrivedDriverCard extends StatelessWidget {
  const ArrivedDriverCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(vertical: AppSpacing.md),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        border: Border.all(color: AppColors.surface.withValues(alpha: 0.2)),
      ),
      child: Row(
        children: [
          const Icon(Icons.local_shipping, color: AppColors.surface, size: 28),
          const SizedBox(width: AppSpacing.md),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                AppStrings.driverInfoArrived,
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.surface,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                AppStrings.ambulanceType,
                style: AppTypography.caption.copyWith(
                  color: AppColors.surface.withValues(alpha: 0.7),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class BackToHomeButton extends StatelessWidget {
  final VoidCallback onPressed;

  const BackToHomeButton({super.key, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton(
        onPressed: onPressed,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.surface,
          foregroundColor: AppColors.primary,
          padding: const EdgeInsets.symmetric(vertical: AppSpacing.md),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
          ),
          elevation: 0,
        ),
        child: Text(
          AppStrings.backToHome,
          style: AppTypography.label,
        ),
      ),
    );
  }
}
