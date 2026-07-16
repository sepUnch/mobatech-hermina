import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/app_button.dart';
import '../../../../core/widgets/app_card.dart';
import '../../data/models/polyclinic.dart';
import '../../providers/appointment_provider.dart';
import 'polyclinic_card_widgets.dart';

class PolyclinicCard extends ConsumerWidget {
  final Polyclinic poly;

  const PolyclinicCard({super.key, required this.poly});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.md),
      child: AppCard(
        padding: EdgeInsets.zero, // Padding handled inside elements
        child: Theme(
          data: Theme.of(context).copyWith(
            dividerColor: AppColors.transparent,
            splashColor: AppColors.transparent,
            highlightColor: AppColors.transparent,
          ),
          child: ExpansionTile(
            tilePadding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.lg,
              vertical: AppSpacing.sm,
            ),
            iconColor: AppColors.primary,
            collapsedIconColor: AppColors.textSecondary,
            title: Text(
              poly.name,
              style: AppTypography.h3,
            ),
            subtitle: Padding(
              padding: const EdgeInsets.only(top: AppSpacing.xs),
              child: Text(
                poly.description,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
                style: AppTypography.bodySmall,
              ),
            ),
            children: [
              Container(
                width: double.infinity,
                color: AppColors.surfaceVariant,
                padding: const EdgeInsets.all(AppSpacing.lg),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Jadwal Praktik:',
                      style: AppTypography.label,
                    ),
                    const SizedBox(height: AppSpacing.md),
                    if (poly.schedules.isEmpty)
                      Text(
                        'Jadwal belum tersedia',
                        style: AppTypography.bodySmall,
                      )
                    else
                      ...poly.schedules.map(
                        (s) => PolyclinicScheduleItem(schedule: s),
                      ),
                    const SizedBox(height: AppSpacing.lg),
                    AppButton(
                      text: 'Lihat Dokter di Poli Ini',
                      onPressed: () {
                        ref.read(selectedPolyclinicIdProvider.notifier).state =
                            poly.id;
                        Navigator.pop(context);
                      },
                      icon: const Icon(Icons.person_search, size: 20),
                      isFullWidth: true,
                    ),
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
