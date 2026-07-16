import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../core/widgets/glass_status_chip.dart';
import '../../../appointment/data/models/appointment.dart';

part 'agenda_card_components.dart';

class AgendaCard extends StatelessWidget {
  final Appointment appointment;
  const AgendaCard({super.key, required this.appointment});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => context.push('/appointment/user-appointments'),
      child: Container(
        margin: const EdgeInsets.only(
          top: AppSpacing.md,
          left: AppSpacing.pagePadding,
          right: AppSpacing.pagePadding,
        ),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
          border: Border.all(color: AppColors.border),
          boxShadow: [
            BoxShadow(
              color: AppColors.shadowLight,
              blurRadius: 8,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: IntrinsicHeight(
          child: Row(
            children: [
              _AgendaAccentStrip(status: appointment.status),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _DoctorInfo(appointment: appointment),
                    const Divider(height: 1, color: AppColors.divider),
                    _ScheduleInfo(appointment: appointment),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
