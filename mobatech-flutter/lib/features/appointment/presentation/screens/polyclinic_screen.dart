import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/utils/error_handler.dart';
import '../../../../core/widgets/skeleton_loader.dart';
import '../../providers/polyclinic_provider.dart';
import '../widgets/polyclinic_card.dart';

class PolyclinicScreen extends ConsumerWidget {
  const PolyclinicScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final polyclinicsAsync = ref.watch(polyclinicsProvider);

    return Scaffold(
      backgroundColor: AppColors.surface,
      body: TweenAnimationBuilder<double>(
        tween: Tween(begin: 0.0, end: 1.0),
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeOutCubic,
        builder: (context, value, child) {
          return Opacity(
            opacity: value,
            child: Transform.translate(
              offset: Offset(0, 30 * (1 - value)),
              child: child,
            ),
          );
        },
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 800),
            child: CustomScrollView(
              physics: const BouncingScrollPhysics(),
              slivers: [
                SliverAppBar(
                  backgroundColor: AppColors.primary,
                  expandedHeight: 120,
                  pinned: true,
                  elevation: 0,
                  iconTheme:
                      const IconThemeData(color: AppColors.textOnPrimary),
                  title: Text(
                    'Jadwal Poli',
                    style: AppTypography.h3.copyWith(
                      color: AppColors.textOnPrimary,
                    ),
                  ),
                  centerTitle: true,
                  flexibleSpace: FlexibleSpaceBar(
                    background: Stack(
                      clipBehavior: Clip.none,
                      children: [
                        Positioned(
                          right: -20,
                          top: -20,
                          child: Opacity(
                            opacity: 0.2,
                            child: Image.asset(
                              'assets/header_logo.png',
                              width: 220,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.symmetric(
                    horizontal: AppSpacing.pagePadding,
                    vertical: AppSpacing.lg,
                  ),
                  sliver: polyclinicsAsync.when(
                    data: (polys) {
                      if (polys.isEmpty) {
                        return SliverToBoxAdapter(
                          child: Center(
                            child: Text(
                              'Belum ada jadwal poli',
                              style: AppTypography.bodySmall,
                            ),
                          ),
                        );
                      }
                      return SliverList(
                        delegate: SliverChildBuilderDelegate(
                          (context, index) {
                            final poly = polys[index];
                            return PolyclinicCard(poly: poly);
                          },
                          childCount: polys.length,
                        ),
                      );
                    },
                    loading: () => const SliverToBoxAdapter(
                      child: CardSkeletonLoader(count: 6),
                    ),
                    error: (err, stack) => SliverToBoxAdapter(
                      child: Center(
                        child: Text(
                          ErrorHandler.getMessage(err),
                          style: AppTypography.bodySmall
                              .copyWith(color: AppColors.error),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
