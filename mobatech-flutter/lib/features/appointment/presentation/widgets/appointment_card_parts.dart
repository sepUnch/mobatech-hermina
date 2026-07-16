import 'package:flutter/material.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/glass_status_chip.dart';
import '../../../../core/widgets/app_button.dart';

class AppointmentCardTopSection extends StatelessWidget {
  final dynamic appointment;

  const AppointmentCardTopSection({super.key, required this.appointment});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.md,
        vertical: AppSpacing.sm,
      ),
      decoration: const BoxDecoration(
        color: AppColors.surfaceVariant,
        border: Border(
          bottom: BorderSide(color: AppColors.border),
        ),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              const Icon(
                Icons.calendar_month,
                size: 16,
                color: AppColors.primary,
              ),
              const SizedBox(width: AppSpacing.xs),
              Text(
                '${appointment.schedule?.date != null ? Formatters.formatDateID(appointment.schedule!.date!) : '-'} • ${appointment.schedule?.startTime ?? ''}',
                style: AppTypography.bodySmall.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          GlassStatusChip(status: appointment.status, fontSize: 11),
        ],
      ),
    );
  }
}

class AppointmentCardBottomSection extends StatelessWidget {
  final dynamic appointment;
  final VoidCallback onCancel;

  const AppointmentCardBottomSection({
    super.key,
    required this.appointment,
    required this.onCancel,
  });

  @override
  Widget build(BuildContext context) {
    if (appointment.status != 'pending' && appointment.status != 'approved') {
      return const SizedBox.shrink();
    }
    return Padding(
      padding: const EdgeInsets.fromLTRB(AppSpacing.md, 0, AppSpacing.md, AppSpacing.md),
      child: AppButton(
        text: 'Batalkan Janji Temu',
        onPressed: onCancel,
        variant: AppButtonVariant.outline,
        size: AppButtonSize.small,
        isFullWidth: true,
      ),
    );
  }
}
