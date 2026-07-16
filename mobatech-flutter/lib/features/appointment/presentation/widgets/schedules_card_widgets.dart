import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../data/models/doctor_schedule.dart';

class ScheduleItemCard extends StatelessWidget {
  final DoctorSchedule schedule;
  final bool isSelected;
  final VoidCallback? onTap;

  const ScheduleItemCard({
    super.key,
    required this.schedule,
    required this.isSelected,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    bool isExpired = false;
    if (schedule.date != null && schedule.endTime.isNotEmpty) {
      final now = DateTime.now();
      final localDate = schedule.date!.toLocal();
      final timeParts = schedule.endTime.split(':');
      if (timeParts.length >= 2) {
        final endHour = int.tryParse(timeParts[0]) ?? 0;
        final endMinute = int.tryParse(timeParts[1]) ?? 0;
        final scheduleEnd = DateTime(
          localDate.year,
          localDate.month,
          localDate.day,
          endHour,
          endMinute,
        );
        if (now.isAfter(scheduleEnd)) {
          isExpired = true;
        }
      }
    }

    final isAvailable = !isExpired &&
        schedule.isAvailable &&
        (schedule.quota - schedule.booked > 0);
    final localDate = schedule.date?.toLocal();
    final dateStr = localDate != null
        ? '${localDate.day}/${localDate.month}/${localDate.year}'
        : '';

    return GestureDetector(
      onTap: isAvailable ? onTap : null,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.all(AppSpacing.md),
        decoration: BoxDecoration(
          color: isSelected
              ? AppColors.primary.withValues(alpha: 0.05)
              : AppColors.surface,
          borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
          border: Border.all(
            color: isSelected ? AppColors.primary : AppColors.border,
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(AppSpacing.sm),
              decoration: BoxDecoration(
                color: isSelected
                    ? AppColors.primary
                    : AppColors.surfaceVariant,
                shape: BoxShape.circle,
              ),
              child: Icon(
                Icons.calendar_month,
                color: isSelected ? AppColors.textOnPrimary : AppColors.textSecondary,
                size: 20,
              ),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '$dateStr • ${schedule.startTime} - ${schedule.endTime}',
                    style: AppTypography.body.copyWith(
                      fontWeight: FontWeight.bold,
                      color: isAvailable
                          ? AppColors.textPrimary
                          : AppColors.textTertiary,
                    ),
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  Text(
                    'Sisa kuota: ${schedule.quota - schedule.booked}',
                    style: AppTypography.caption.copyWith(
                      color: AppColors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),
            if (!isAvailable)
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.sm, vertical: AppSpacing.xs),
                decoration: BoxDecoration(
                  color: AppColors.error.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                ),
                child: Text(
                  isExpired ? 'Berakhir' : 'Penuh',
                  style: AppTypography.caption.copyWith(
                    color: AppColors.error,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              )
            else
              Icon(
                isSelected
                    ? Icons.radio_button_checked
                    : Icons.radio_button_unchecked,
                color: isSelected ? AppColors.primary : AppColors.border,
              ),
          ],
        ),
      ),
    );
  }
}
