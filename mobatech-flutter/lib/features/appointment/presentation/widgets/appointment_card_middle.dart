import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';

class AppointmentCardMiddleSection extends StatelessWidget {
  final dynamic appointment;

  const AppointmentCardMiddleSection({super.key, required this.appointment});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
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
                  appointment.doctor?.name ?? 'Dokter Tidak Diketahui',
                  style: AppTypography.h4,
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  appointment.doctor?.specialization ?? '-',
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.primary,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (appointment.notes != null &&
                    appointment.notes!.isNotEmpty) ...[
                  const SizedBox(height: AppSpacing.sm),
                  Row(
                    children: [
                      const Icon(
                        Icons.notes,
                        size: 14,
                        color: AppColors.textTertiary,
                      ),
                      const SizedBox(width: AppSpacing.xs),
                      Expanded(
                        child: Text(
                          appointment.notes!,
                          style: AppTypography.caption.copyWith(
                            color: AppColors.textSecondary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ],
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
