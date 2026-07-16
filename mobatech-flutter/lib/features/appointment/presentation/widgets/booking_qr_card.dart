import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/glass_status_chip.dart';

class BookingQRCard extends StatelessWidget {
  final dynamic appointment;

  const BookingQRCard({super.key, required this.appointment});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        children: [
          Text(
            'ID Booking: #${appointment.id.toString().padLeft(6, '0')}',
            style: AppTypography.h4,
          ),
          const SizedBox(height: AppSpacing.lg),
          if (appointment.status.toLowerCase() == 'pending' ||
              appointment.status.toLowerCase() == 'approved') ...[
            Container(
              width: 150,
              height: 150,
              decoration: BoxDecoration(
                color: AppColors.surfaceVariant,
                borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
                border: Border.all(color: AppColors.border, width: 2),
              ),
              child: const Icon(
                Icons.qr_code_2,
                size: 100,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              'Tunjukkan QR Code ini di mesin antrean',
              style: AppTypography.caption,
            ),
            const SizedBox(height: AppSpacing.md),
          ] else if (appointment.status.toLowerCase() == 'completed') ...[
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.check_circle,
                size: 60,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              'Konsultasi telah selesai dilakukan',
              style: AppTypography.caption,
            ),
            const SizedBox(height: AppSpacing.md),
          ] else ...[
            Container(
              width: 100,
              height: 100,
              decoration: BoxDecoration(
                color: AppColors.error.withValues(alpha: 0.1),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.cancel,
                size: 60,
                color: AppColors.error,
              ),
            ),
            const SizedBox(height: AppSpacing.md),
            Text(
              'Janji temu ini telah dibatalkan',
              style: AppTypography.caption,
            ),
            const SizedBox(height: AppSpacing.md),
          ],
          GlassStatusChip(status: appointment.status, fontSize: 13),
        ],
      ),
    );
  }
}
