import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_strings.dart';

class EmergencySubmitButton extends StatelessWidget {
  final bool isLoading;
  final bool hasLocation;
  final VoidCallback onSubmit;

  const EmergencySubmitButton({
    super.key,
    required this.isLoading,
    required this.hasLocation,
    required this.onSubmit,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
        boxShadow: [
          BoxShadow(
            color: AppColors.error.withValues(alpha: 0.3),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: ElevatedButton(
        onPressed: (isLoading || !hasLocation) ? null : onSubmit,
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.error,
          disabledBackgroundColor: AppColors.buttonDisabled,
          foregroundColor: AppColors.textOnPrimary,
          padding: const EdgeInsets.symmetric(vertical: 18),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
          ),
          elevation: 0,
        ),
        child: isLoading
            ? const SizedBox(
                width: 22,
                height: 22,
                child: CircularProgressIndicator(
                  color: AppColors.textOnPrimary,
                  strokeWidth: 2.5,
                ),
              )
            : Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.emergency, size: 22),
                  const SizedBox(width: AppSpacing.sm),
                  Text(
                    AppStrings.callAmbulance,
                    style: AppTypography.label.copyWith(
                      color: AppColors.textOnPrimary,
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}
