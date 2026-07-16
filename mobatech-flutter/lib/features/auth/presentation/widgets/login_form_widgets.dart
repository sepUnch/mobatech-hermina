import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/widgets/app_button.dart';
import 'social_login_button.dart';

class LoginSubmitButton extends StatelessWidget {
  final bool isLoading;
  final bool isEnabled;
  final VoidCallback onPressed;

  const LoginSubmitButton({
    super.key,
    required this.isLoading,
    required this.isEnabled,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return AppButton(
      text: AppStrings.loginButton,
      onPressed: isEnabled ? onPressed : null,
      isLoading: isLoading,
      isFullWidth: true,
      size: AppButtonSize.large,
    );
  }
}

class LoginFooter extends StatelessWidget {
  final VoidCallback onGooglePressed;

  const LoginFooter({
    super.key,
    required this.onGooglePressed,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          children: [
            const Expanded(
              child: Divider(color: AppColors.border, thickness: 1),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
              child: Text(
                AppStrings.orContinueWith,
                style: AppTypography.caption,
              ),
            ),
            const Expanded(
              child: Divider(color: AppColors.border, thickness: 1),
            ),
          ],
        ),
        const SizedBox(height: AppSpacing.lg),
        SocialLoginButton(
          text: AppStrings.continueWithGoogle,
          onPressed: onGooglePressed,
        ),
        const SizedBox(height: AppSpacing.lg),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              AppStrings.noAccount,
              style: AppTypography.bodySmall,
            ),
            GestureDetector(
              onTap: () => context.push('/register'),
              child: Text(
                AppStrings.registerLink,
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.primary,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
