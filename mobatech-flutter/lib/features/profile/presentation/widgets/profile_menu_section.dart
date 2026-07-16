import '../../../../core/constants/app_strings.dart';
import '../../../../core/utils/custom_snackbar.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:firebase_auth/firebase_auth.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/app_card.dart';
import '../providers/profile_provider.dart';

class ProfileMenuSection extends ConsumerWidget {
  const ProfileMenuSection({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final menuItems = [
      {'icon': Icons.person_outline, 'title': 'Ubah Profil'},
      {'icon': Icons.medical_information_outlined, 'title': 'Data Rekam Medis'},
      {'icon': Icons.family_restroom, 'title': 'Anggota Keluarga'},
      {'icon': Icons.settings_outlined, 'title': 'Pengaturan'},
      {'icon': Icons.help_outline, 'title': 'Bantuan & Dukungan'},
    ];

    return AppCard(
      padding: EdgeInsets.zero,
      child: Column(
        children: [
          ...menuItems.map(
            (item) => ListTile(
              leading: Container(
                padding: const EdgeInsets.all(AppSpacing.sm),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                ),
                child: Icon(
                  item['icon'] as IconData,
                  color: AppColors.primary,
                ),
              ),
              title: Text(
                item['title'] as String,
                style: AppTypography.body.copyWith(
                  fontWeight: FontWeight.w600,
                  color: AppColors.textPrimary,
                ),
              ),
              trailing: const Icon(
                Icons.chevron_right,
                color: AppColors.textSecondary,
              ),
              onTap: () {
                if (item['title'] == 'Ubah Profil') {
                  context.push('/profile/edit');
                } else if (item['title'] == 'Data Rekam Medis') {
                  context.push('/medical-results');
                } else if (item['title'] == 'Anggota Keluarga') {
                  context.push('/profile/family-members');
                } else if (item['title'] == 'Pengaturan') {
                  context.push('/profile/settings');
                } else if (item['title'] == 'Bantuan & Dukungan') {
                  context.push('/profile/help-support');
                } else {
                  ScaffoldMessenger.of(context).hideCurrentSnackBar();
                  CustomSnackbar.showInfo(context, 'Menu ${item['title']} segera hadir!',);
                }
              },
            ),
          ),
          const Divider(height: 1, color: AppColors.border),
          ListTile(
            leading: Container(
              padding: const EdgeInsets.all(AppSpacing.sm),
              decoration: BoxDecoration(
                color: AppColors.error.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
              ),
              child: const Icon(Icons.logout, color: AppColors.error),
            ),
            title: Text(
              AppStrings.extKeluar,
              style: AppTypography.body.copyWith(
                fontWeight: FontWeight.w600,
                color: AppColors.error,
              ),
            ),
            onTap: () async {
              final prefs = await SharedPreferences.getInstance();
              await prefs.clear();
              globalAuthToken = null;
              await FirebaseAuth.instance.signOut();
              ref.invalidate(userProfileProvider);
              if (context.mounted) {
                context.go('/login');
              }
            },
          ),
        ],
      ),
    );
  }
}
