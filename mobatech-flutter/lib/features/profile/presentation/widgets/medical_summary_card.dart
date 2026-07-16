import '../../../../core/constants/app_strings.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/app_card.dart';
import 'edit_medical_data_modal.dart';

class MedicalSummaryCard extends StatelessWidget {
  final dynamic user;
  final WidgetRef ref;

  const MedicalSummaryCard({super.key, required this.user, required this.ref});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      backgroundColor: AppColors.primaryLight,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                AppStrings.extGolongandarah,
                style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary),
              ),
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: AppSpacing.md,
                      vertical: AppSpacing.xs,
                    ),
                    decoration: BoxDecoration(
                      color: AppColors.error.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                    ),
                    child: Text(
                      user.bloodType ?? '-',
                      style: AppTypography.caption.copyWith(
                        color: AppColors.error,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  GestureDetector(
                    onTap: () =>
                        showEditMedicalDataModal(context, ref, user),
                    child: Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: AppColors.primary,
                        borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                      ),
                      child: const Icon(
                        Icons.edit,
                        color: AppColors.textOnPrimary,
                        size: 14,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              _buildVitals(
                'Tinggi',
                user.height != null ? '${user.height} cm' : '- cm',
              ),
              _buildVitals(
                'Berat',
                user.weight != null ? '${user.weight} kg' : '- kg',
              ),
              _buildVitals(
                'Alergi',
                user.allergies != null && user.allergies.isNotEmpty
                    ? user.allergies
                    : 'Tidak Ada',
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildVitals(String label, String value) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: AppTypography.caption.copyWith(color: AppColors.textSecondary),
        ),
        const SizedBox(height: AppSpacing.xs),
        Text(
          value,
          style: AppTypography.body.copyWith(
            color: AppColors.textPrimary,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }
}
