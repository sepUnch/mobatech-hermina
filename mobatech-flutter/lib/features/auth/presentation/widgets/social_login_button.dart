import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/app_button.dart';

class SocialLoginButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  const SocialLoginButton({
    super.key,
    required this.text,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return AppButton(
      text: text,
      onPressed: onPressed,
      variant: AppButtonVariant.secondary,
      size: AppButtonSize.large,
      isFullWidth: true,
      icon: Container(
        width: 24,
        height: 24,
        alignment: Alignment.center,
        decoration: const BoxDecoration(
          color: AppColors.surface,
          shape: BoxShape.circle,
        ),
        child: ShaderMask(
          shaderCallback: (bounds) => const LinearGradient(
            colors: [
              AppColors.googleBlue,
              AppColors.googleRed,
              AppColors.googleYellow,
              AppColors.googleGreen,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ).createShader(bounds),
          child: Text(
            'G',
            style: AppTypography.h4.copyWith(
              color: AppColors.surface,
            ),
          ),
        ),
      ),
    );
  }
}
