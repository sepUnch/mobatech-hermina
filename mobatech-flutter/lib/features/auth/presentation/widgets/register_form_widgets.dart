import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/widgets/app_button.dart';
import 'social_login_button.dart';

class RegisterSubmitButton extends StatelessWidget {
  final bool isLoading;
  final VoidCallback? onPressed;
  final VoidCallback onGooglePressed;

  const RegisterSubmitButton({
    super.key,
    required this.isLoading,
    this.onPressed,
    required this.onGooglePressed,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        AppButton(
          text: AppStrings.registerButton,
          onPressed: onPressed,
          isLoading: isLoading,
          isFullWidth: true,
          size: AppButtonSize.large,
        ),
        const SizedBox(height: AppSpacing.lg),
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
      ],
    );
  }
}

class PasswordValidationRules extends StatelessWidget {
  final String password;

  const PasswordValidationRules({super.key, required this.password});

  @override
  Widget build(BuildContext context) {
    return Wrap(
      spacing: AppSpacing.sm,
      runSpacing: AppSpacing.xs,
      children: [
        _validationItem(AppStrings.passMinChars, password.length >= 8),
        _validationItem(
          AppStrings.passUppercase,
          RegExp(r'[A-Z]').hasMatch(password),
        ),
        _validationItem(
          AppStrings.passLowercase,
          RegExp(r'[a-z]').hasMatch(password),
        ),
        _validationItem(
          AppStrings.passDigit,
          RegExp(r'[0-9]').hasMatch(password),
        ),
      ],
    );
  }

  Widget _validationItem(String text, bool isValid) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(
          isValid ? Icons.check_circle : Icons.check_circle_outline,
          color: isValid ? AppColors.success : AppColors.textTertiary,
          size: 16,
        ),
        const SizedBox(width: AppSpacing.xs),
        Text(
          text,
          style: AppTypography.caption.copyWith(
            color: isValid ? AppColors.textPrimary : AppColors.textSecondary,
          ),
        ),
      ],
    );
  }
}
