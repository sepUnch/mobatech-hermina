import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../profile/presentation/providers/profile_provider.dart';
import '../../../patient_support/providers/patient_support_provider.dart';
import 'home_header_parts.dart';

class HomeHeader extends ConsumerWidget {
  const HomeHeader({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userProfile = ref.watch(userProfileProvider).valueOrNull;
    final firstName =
        userProfile?.fullName.split(' ').first ?? AppStrings.defaultUser;

    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(AppSpacing.radiusXl),
          bottomRight: Radius.circular(AppSpacing.radiusXl),
        ),
      ),
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
          SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.fromLTRB(
                AppSpacing.pagePadding,
                AppSpacing.lg,
                AppSpacing.pagePadding,
                AppSpacing.xl, // Restore compact padding
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _buildTopRow(context, ref, userProfile, firstName),
                  const SizedBox(height: AppSpacing.lg),
                  const HomeHeaderSearchField(),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTopRow(
    BuildContext context,
    WidgetRef ref,
    dynamic userProfile,
    String firstName,
  ) {
    return Row(
      children: [
        _buildAvatar(userProfile),
        const SizedBox(width: AppSpacing.md),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                '${AppStrings.homeGreetingPrefix}$firstName',
                style: AppTypography.h2.copyWith(
                  color: AppColors.textOnPrimary,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                AppStrings.homeGreetingSubtitle,
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.textOnPrimaryMuted,
                ),
              ),
            ],
          ),
        ),
        _NotificationBell(),
      ],
    );
  }

  Widget _buildAvatar(dynamic userProfile) {
    return CircleAvatar(
      radius: 22,
      backgroundColor: Colors.white.withValues(alpha: 0.2),
      backgroundImage: userProfile?.imagePath != null
          ? (userProfile!.imagePath!.startsWith('http')
                ? NetworkImage(userProfile.imagePath!) as ImageProvider
                : FileImage(File(userProfile.imagePath!)))
          : null,
      child: userProfile?.imagePath == null
          ? const Icon(Icons.person, color: AppColors.textOnPrimary, size: 24)
          : null,
    );
  }
}

class _NotificationBell extends ConsumerWidget {
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final unreadCountAsync = ref.watch(unreadReminderCountProvider);
    final count = unreadCountAsync.valueOrNull ?? 0;

    return Stack(
      children: [
        IconButton(
          icon: const Icon(
            Icons.notifications_outlined,
            color: AppColors.textOnPrimary,
            size: 26,
          ),
          onPressed: () => context.push('/notifications'),
        ),
        if (count > 0)
          Positioned(
            right: 8,
            top: 8,
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: const BoxDecoration(
                color: AppColors.error,
                shape: BoxShape.circle,
              ),
              child: Text(
                count.toString(),
                style: AppTypography.caption.copyWith(
                  color: AppColors.textOnPrimary,
                  fontSize: 10,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
      ],
    );
  }
}
