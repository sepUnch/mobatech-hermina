import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';

class UserAppointmentsAppBar extends StatelessWidget {
  const UserAppointmentsAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(

      floating: false,
      pinned: true,
      backgroundColor: AppColors.primary,
      centerTitle: true,
      iconTheme: const IconThemeData(color: AppColors.textOnPrimary),
      title: Text(
        'Janji Temu Saya',
        style: AppTypography.h3.copyWith(
          color: AppColors.textOnPrimary,
        ),
      ),
      flexibleSpace: ClipRRect(
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(AppSpacing.radiusXl)),
        child: Stack(
          clipBehavior: Clip.none,
          children: [
            Positioned(
              right: -20,
              top: -20,
              child: Opacity(
                opacity: 0.2,
                child: Image.asset('assets/header_logo.png', width: 220),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
