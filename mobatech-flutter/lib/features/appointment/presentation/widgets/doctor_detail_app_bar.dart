import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';

class DoctorDetailAppBar extends StatelessWidget implements PreferredSizeWidget {
  const DoctorDetailAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return AppBar(
      title: Text(
        'Detail Dokter',
        style: AppTypography.h3.copyWith(
          color: AppColors.textOnPrimary,
        ),
      ),
      backgroundColor: AppColors.primary,
      iconTheme: const IconThemeData(color: AppColors.textOnPrimary),
      centerTitle: true,
      elevation: 0,
      flexibleSpace: Stack(
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
    );
  }

  @override
  Size get preferredSize => const Size.fromHeight(kToolbarHeight);
}
