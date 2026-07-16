import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../data/models/polyclinic.dart';

class PolyclinicScheduleItem extends StatelessWidget {
  final PolyclinicSchedule schedule;

  const PolyclinicScheduleItem({super.key, required this.schedule});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(AppSpacing.xs),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
            ),
            child: const Icon(
              Icons.schedule,
              color: AppColors.primary,
              size: 16,
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Text(
              schedule.dayOfWeek,
              style: AppTypography.bodySmall.copyWith(
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Text(
            '${schedule.startTime} - ${schedule.endTime}',
            style: AppTypography.labelSmall,
          ),
        ],
      ),
    );
  }
}
