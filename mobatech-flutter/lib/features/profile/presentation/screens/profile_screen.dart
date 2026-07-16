import '../../../../core/constants/app_strings.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/utils/error_handler.dart';
import '../../../../core/widgets/custom_bottom_nav_bar.dart';
import '../../../../core/widgets/app_button.dart';
import '../providers/profile_provider.dart';
import '../widgets/profile_loading_skeleton.dart';
import '../widgets/profile_user_card.dart';
import '../widgets/profile_menu_section.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/network/dio_client.dart';
import '../widgets/medical_summary_card.dart';

part 'profile_screen_parts.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(userProfileProvider);

    return Scaffold(
      backgroundColor: AppColors.surface,
      body: profileAsync.when(
        data: (user) {
          if (user == null) return const ProfileNullUserView();
          
          return Center(
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 800),
              child: CustomScrollView(
                physics: const BouncingScrollPhysics(),
                slivers: [
                  const ProfileSliverAppBar(),
                  SliverToBoxAdapter(
                    child: TweenAnimationBuilder<double>(
                      tween: Tween(begin: 0.0, end: 1.0),
                      duration: const Duration(milliseconds: 600),
                      curve: Curves.easeOutCubic,
                      builder: (context, value, child) => Opacity(
                        opacity: value,
                        child: Transform.translate(offset: Offset(0, 30 * (1 - value)), child: child),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(AppSpacing.pagePadding),
                        child: Column(
                          children: [
                            ProfileUserCard(user: user),
                            const SizedBox(height: AppSpacing.xl),
                            MedicalSummaryCard(user: user, ref: ref),
                            const SizedBox(height: AppSpacing.xxl),
                            const ProfileMenuSection(),
                            const SizedBox(height: AppSpacing.xxl),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          );
        },
        loading: () => const ProfileLoadingSkeleton(),
        error: (err, stack) =>
            Center(child: Text(ErrorHandler.getMessage(err), style: AppTypography.body)),
      ),
      bottomNavigationBar: const CustomBottomNavBar(currentIndex: 4),
    );
  }
}
