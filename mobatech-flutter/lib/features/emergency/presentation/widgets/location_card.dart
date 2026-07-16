import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_map/flutter_map.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/constants/app_strings.dart';
import 'location_card_map_preview.dart';

class LocationCard extends StatelessWidget {
  final double? userLat;
  final double? userLng;
  final bool isLocating;
  final String? locationError;
  final MapController formMapController;
  final VoidCallback onDetectLocation;

  const LocationCard({
    super.key,
    required this.userLat,
    required this.userLng,
    required this.isLocating,
    required this.locationError,
    required this.formMapController,
    required this.onDetectLocation,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      padding: EdgeInsets.zero,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(AppSpacing.radiusMd),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            color: AppColors.surface.withValues(alpha: 0.85),
            child: Column(
              children: [
                ClipRRect(
                  borderRadius: const BorderRadius.vertical(
                    top: Radius.circular(AppSpacing.radiusMd),
                  ),
                  child: SizedBox(
                    height: 180,
                    child: LocationCardMapPreview(
                      isLocating: isLocating,
                      locationError: locationError,
                      userLat: userLat,
                      userLng: userLng,
                      mapController: formMapController,
                    ),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(AppSpacing.sm),
                        decoration: BoxDecoration(
                          color: userLat != null
                              ? AppColors.success.withValues(alpha: 0.1)
                              : AppColors.error.withValues(alpha: 0.1),
                          borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
                        ),
                        child: Icon(
                          userLat != null
                              ? Icons.location_on
                              : Icons.location_searching,
                          color: userLat != null
                              ? AppColors.success
                              : AppColors.error,
                          size: 22,
                        ),
                      ),
                      const SizedBox(width: AppSpacing.sm),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              isLocating
                                  ? AppStrings.detectingLocation
                                  : locationError != null
                                  ? AppStrings.detectFailed
                                  : AppStrings.locationDetected,
                              style: AppTypography.labelSmall.copyWith(
                                color: locationError != null
                                    ? AppColors.error
                                    : AppColors.textPrimary,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              isLocating
                                  ? AppStrings.usingGps
                                  : locationError ??
                                        '${userLat?.toStringAsFixed(6)}, ${userLng?.toStringAsFixed(6)}',
                              style: AppTypography.caption.copyWith(
                                color: locationError != null
                                    ? AppColors.error
                                    : AppColors.textSecondary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      if (locationError != null || isLocating)
                        IconButton(
                          onPressed: isLocating ? null : onDetectLocation,
                          icon: Icon(
                            Icons.refresh,
                            color: isLocating
                                ? AppColors.textTertiary
                                : AppColors.primary,
                          ),
                        ),
                    ],
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
