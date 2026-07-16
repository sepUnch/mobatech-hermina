import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/skeleton_loader.dart';
import '../../../../core/utils/error_handler.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/models/doctor_schedule.dart';
import 'schedules_card_widgets.dart';

class SchedulesCard extends StatelessWidget {
  final AsyncValue<List<DoctorSchedule>> schedulesAsync;
  final int? selectedScheduleId;
  final ValueChanged<int?> onScheduleSelected;

  const SchedulesCard({
    super.key,
    required this.schedulesAsync,
    required this.selectedScheduleId,
    required this.onScheduleSelected,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.lg),
      child: AppCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Pilih Jadwal',
              style: AppTypography.h4,
            ),
            const SizedBox(height: AppSpacing.md),
            schedulesAsync.when(
              data: (schedules) {
                if (schedules.isEmpty) {
                  return Center(
                    child: Text(
                      'Tidak ada jadwal tersedia',
                      style: AppTypography.bodySmall,
                    ),
                  );
                }
                return StreamBuilder<int>(
                    stream: Stream.periodic(const Duration(minutes: 1), (i) => i),
                    builder: (context, snapshot) {
                      final now = DateTime.now();
                      // Hanya tampilkan jadwal untuk HARI INI
                      final todaySchedules = schedules.where((s) {
                        if (s.date == null) return false;
                        // Pastikan date di-parse ke local untuk perbandingan
                        final localDate = s.date!.toLocal();
                        return localDate.year == now.year &&
                            localDate.month == now.month &&
                            localDate.day == now.day;
                      }).toList();

                      if (todaySchedules.isEmpty) {
                        return Center(
                          child: Text(
                            'Tidak ada jadwal tersedia untuk hari ini',
                            style: AppTypography.bodySmall,
                          ),
                        );
                      }

                      return ListView.separated(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: todaySchedules.length,
                        separatorBuilder: (_, __) =>
                            const SizedBox(height: AppSpacing.md),
                        itemBuilder: (context, index) {
                          final schedule = todaySchedules[index];
                          final isSelected =
                              selectedScheduleId == schedule.id;
                          return ScheduleItemCard(
                            schedule: schedule,
                            isSelected: isSelected,
                            onTap: () {
                              if (selectedScheduleId == schedule.id) {
                                onScheduleSelected(null);
                              } else {
                                onScheduleSelected(schedule.id);
                              }
                            },
                          );
                        },
                      );
                    });
              },
              loading: () => const CardSkeletonLoader(count: 3),
              error: (e, _) => Text(
                ErrorHandler.getMessage(e),
                style: AppTypography.bodySmall.copyWith(color: AppColors.error),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
