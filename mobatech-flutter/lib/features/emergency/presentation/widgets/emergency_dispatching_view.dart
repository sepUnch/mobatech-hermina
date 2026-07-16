import 'package:flutter/material.dart';

import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_strings.dart';

class EmergencyDispatchingView extends StatefulWidget {
  const EmergencyDispatchingView({super.key});

  @override
  State<EmergencyDispatchingView> createState() =>
      _EmergencyDispatchingViewState();
}

class _EmergencyDispatchingViewState extends State<EmergencyDispatchingView>
    with SingleTickerProviderStateMixin {
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);

    _pulseAnimation = Tween<double>(begin: 0.8, end: 1.2).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      key: const ValueKey('dispatching'),
      color: AppColors.primaryDark,
      child: SafeArea(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Pulsating ambulance icon
              AnimatedBuilder(
                animation: _pulseAnimation,
                builder: (context, child) {
                  return Transform.scale(
                    scale: _pulseAnimation.value,
                    child: Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppColors.error.withValues(alpha: 0.1),
                        border: Border.all(
                          color: AppColors.error.withValues(
                            alpha: _pulseAnimation.value * 0.5,
                          ),
                          width: 3,
                        ),
                      ),
                      child: const Icon(
                        Icons.local_hospital,
                        color: AppColors.error,
                        size: 52,
                      ),
                    ),
                  );
                },
              ),
              const SizedBox(height: AppSpacing.xxl),
              Text(
                AppStrings.searchingAmbulance,
                style: AppTypography.h3.copyWith(
                  color: AppColors.surface,
                ),
              ),
              const SizedBox(height: AppSpacing.sm),
              Text(
                AppStrings.contactingEmergencyUnit,
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.surface.withValues(alpha: 0.8),
                ),
              ),
              const SizedBox(height: AppSpacing.xxl),
              SizedBox(
                width: 200,
                child: LinearProgressIndicator(
                  color: AppColors.surface.withValues(alpha: 0.2),
                  valueColor: const AlwaysStoppedAnimation<Color>(
                    AppColors.error,
                  ),
                  minHeight: 3,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
