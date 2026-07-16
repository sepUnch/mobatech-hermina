import 'package:flutter/material.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/app_card.dart';
import '../screens/appointment_detail_screen.dart';

import 'appointment_card_parts.dart';
import 'appointment_card_middle.dart';

class AppointmentCard extends StatelessWidget {
  final dynamic appointment;
  final VoidCallback onCancel;

  const AppointmentCard({
    super.key,
    required this.appointment,
    required this.onCancel,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.md),
      child: AppCard(
        padding: EdgeInsets.zero,
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (_) => AppointmentDetailScreen(appointment: appointment),
            ),
          );
        },
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Top Section: Date & Status
            AppointmentCardTopSection(appointment: appointment),
            // 2. Middle Section: Doctor Info
            AppointmentCardMiddleSection(appointment: appointment),
            // 3. Bottom Section: Action
            AppointmentCardBottomSection(
              appointment: appointment,
              onCancel: onCancel,
            ),
          ],
        ),
      ),
    );
  }
}
