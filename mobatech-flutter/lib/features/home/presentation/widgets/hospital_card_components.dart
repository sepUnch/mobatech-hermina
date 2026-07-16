import 'package:flutter/material.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/theme/app_spacing.dart';

class HospitalInfoColumn extends StatelessWidget {
  final String name;
  final String address;
  final String distance;

  const HospitalInfoColumn({
    super.key,
    required this.name,
    required this.address,
    required this.distance,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                name,
                style: AppTypography.h4,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
            Row(
              children: [
                const Icon(
                  Icons.location_on_outlined,
                  color: AppColors.primary,
                  size: 16,
                ),
                const SizedBox(width: 4),
                Text(
                  distance,
                  style: AppTypography.labelSmall.copyWith(
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.xs),
        Text(
          address,
          style: AppTypography.bodySmall,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
        ),
      ],
    );
  }
}

class HospitalActionButtons extends StatelessWidget {
  final VoidCallback onMapTap;

  const HospitalActionButtons({
    super.key,
    required this.onMapTap,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        GestureDetector(
          onTap: onMapTap,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildIconContainer(Icons.directions_outlined),
              const SizedBox(height: AppSpacing.xs),
              Text(
                AppStrings.extRute,
                style: AppTypography.caption.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w600,
                  fontSize: 10,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: AppSpacing.md),
        Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            _buildIconContainer(Icons.more_vert),
            const SizedBox(height: AppSpacing.xs),
            Text(
              AppStrings.extMore,
              style: AppTypography.caption.copyWith(
                color: AppColors.primary,
                fontWeight: FontWeight.w600,
                fontSize: 10,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildIconContainer(IconData icon) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.sm),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.border),
        borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
      ),
      child: Icon(
        icon,
        color: AppColors.primary,
        size: 20,
      ),
    );
  }
}
