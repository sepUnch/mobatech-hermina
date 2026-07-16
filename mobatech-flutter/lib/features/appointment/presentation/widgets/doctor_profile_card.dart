import 'package:flutter/material.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/app_card.dart';
import '../../data/models/doctor.dart';
import 'doctor_profile_card_components.dart';

class DoctorProfileCard extends StatelessWidget {
  final Doctor doctor;

  const DoctorProfileCard({super.key, required this.doctor});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.lg),
      child: AppCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                DoctorImageWidget(doctor: doctor),
                const SizedBox(width: AppSpacing.md),
                Expanded(child: DoctorInfoWidget(doctor: doctor)),
              ],
            ),
            DoctorAboutWidget(doctor: doctor),
          ],
        ),
      ),
    );
  }
}
