import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/app_card.dart';

class AppointmentDoctorCard extends StatelessWidget {
  final dynamic appointment;

  const AppointmentDoctorCard({super.key, required this.appointment});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
            child: appointment.doctor?.imageUrl != null &&
                    appointment.doctor!.imageUrl.isNotEmpty
                ? Image.network(
                    appointment.doctor!.imageUrl
                        .replaceAll('/svg', '/png')
                        .replaceAll('.svg', '.png'),
                    width: 64,
                    height: 64,
                    fit: BoxFit.cover,
                    errorBuilder: (ctx, err, stack) => _buildPlaceholder(),
                  )
                : _buildPlaceholder(),
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  appointment.doctor?.name ?? 'Dokter',
                  style: AppTypography.h4,
                ),
                const SizedBox(height: AppSpacing.xs),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.sm,
                    vertical: AppSpacing.xs,
                  ),
                  decoration: BoxDecoration(
                    color: AppColors.primaryLight,
                    borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                  ),
                  child: Text(
                    appointment.doctor?.specialization ?? '-',
                    style: AppTypography.labelSmall.copyWith(
                      color: AppColors.primary,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlaceholder() {
    return Container(
      width: 64,
      height: 64,
      color: AppColors.surfaceVariant,
      child: const Icon(Icons.person, color: AppColors.primary),
    );
  }
}
