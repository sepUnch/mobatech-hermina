import 'dart:io';
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/utils/formatters.dart';
import '../providers/profile_provider.dart';

class ProfileUserCard extends StatelessWidget {
  final UserProfile user;
  const ProfileUserCard({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return AppCard(
      backgroundColor: AppColors.primaryLight,
      child: Row(
        children: [
          CircleAvatar(
            radius: 36,
            backgroundColor: AppColors.primary,
            backgroundImage: user.imagePath != null
                ? (user.imagePath!.startsWith('http')
                      ? NetworkImage(user.imagePath!) as ImageProvider
                      : FileImage(File(user.imagePath!)))
                : null,
            child: user.imagePath == null
                ? Text(
                    user.fullName.isNotEmpty
                        ? user.fullName[0].toUpperCase()
                        : 'U',
                    style: AppTypography.h1.copyWith(
                      color: AppColors.textOnPrimary,
                    ),
                  )
                : null,
          ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  user.fullName,
                  style: AppTypography.h4.copyWith(
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  user.email,
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  Formatters.formatPhoneNumber(user.phone),
                  style: AppTypography.bodySmall.copyWith(
                    color: AppColors.textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
