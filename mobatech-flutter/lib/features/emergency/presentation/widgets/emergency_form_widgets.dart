import 'dart:ui';
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_strings.dart';

class EmergencyAppBar extends StatelessWidget {
  const EmergencyAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      pinned: true,
      backgroundColor: AppColors.error,
      foregroundColor: AppColors.textOnPrimary,
      title: Text(
        AppStrings.emergencyTitle,
        style: AppTypography.h3.copyWith(color: AppColors.textOnPrimary),
      ),
      centerTitle: true,
      elevation: 0,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(AppSpacing.radiusXl)),
      ),
      flexibleSpace: ClipRRect(
        borderRadius: const BorderRadius.vertical(bottom: Radius.circular(AppSpacing.radiusXl)),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Positioned(
              right: -20,
              top: -20,
              child: Opacity(
                opacity: 0.2,
                child: Image.asset('assets/header_logo.png', width: 220),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class EmergencyWarningBanner extends StatelessWidget {
  const EmergencyWarningBanner({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.error.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        border: Border.all(color: AppColors.error.withValues(alpha: 0.2)),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
          child: Padding(
            padding: const EdgeInsets.all(AppSpacing.md),
            child: Row(
              children: [
                const Icon(
                  Icons.warning_amber_rounded,
                  color: AppColors.error,
                  size: 32,
                ),
                const SizedBox(width: AppSpacing.sm),
                Expanded(
                  child: Text(
                    AppStrings.emergencyWarning,
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.error,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
