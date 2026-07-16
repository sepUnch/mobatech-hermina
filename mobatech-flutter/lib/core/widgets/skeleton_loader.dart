import 'package:flutter/material.dart';
import 'package:shimmer/shimmer.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';

class SkeletonLoader extends StatelessWidget {
  final double width;
  final double height;
  final double borderRadius;
  final EdgeInsetsGeometry? margin;

  const SkeletonLoader({
    super.key,
    required this.width,
    required this.height,
    this.borderRadius = AppSpacing.radiusMd,
    this.margin,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: margin,
      width: width,
      height: height,
      child: Shimmer.fromColors(
        baseColor: AppColors.surfaceVariant,
        highlightColor: AppColors.surface,
        child: Container(
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(borderRadius),
          ),
        ),
      ),
    );
  }
}

class CardSkeletonLoader extends StatelessWidget {
  final int count;

  const CardSkeletonLoader({super.key, this.count = 3});

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      padding: const EdgeInsets.all(AppSpacing.pagePadding),
      itemCount: count,
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      itemBuilder: (context, index) {
        return SkeletonLoader(
          width: double.infinity,
          height: 120,
          margin: const EdgeInsets.only(bottom: AppSpacing.md),
          borderRadius: AppSpacing.radiusMd,
        );
      },
    );
  }
}

class GridSkeletonLoader extends StatelessWidget {
  final int count;

  const GridSkeletonLoader({super.key, this.count = 4});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePadding),
      child: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 4,
          mainAxisSpacing: AppSpacing.sm,
          crossAxisSpacing: AppSpacing.sm,
          childAspectRatio: 0.85,
        ),
        physics: const NeverScrollableScrollPhysics(),
        shrinkWrap: true,
        itemCount: count,
        itemBuilder: (context, index) {
          return const Column(
            children: [
              SkeletonLoader(width: 44, height: 44, borderRadius: AppSpacing.radiusSm),
              SizedBox(height: AppSpacing.sm),
              SkeletonLoader(width: 60, height: 10, borderRadius: 5),
              SizedBox(height: 4),
              SkeletonLoader(width: 40, height: 10, borderRadius: 5),
            ],
          );
        },
      ),
    );
  }
}
