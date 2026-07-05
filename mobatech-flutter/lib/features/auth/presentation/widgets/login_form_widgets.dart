import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
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
              child: Divider(color: AppColors.dividerGrey, thickness: 1.5),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Text(
                AppStrings.orContinueWith,
                style: TextStyle(
                  color: Theme.of(context).brightness == Brightness.dark 
                      ? AppColors.textLightGrey 
                      : AppColors.textGrey, 
                  fontSize: 14,
                ),
              ),
            ),
            const Expanded(
              child: Divider(color: AppColors.dividerGrey, thickness: 1.5),
            ),
          ],
        ),
        const SizedBox(height: 16),
        SocialLoginButton(
          text: AppStrings.continueWithGoogle,
          onPressed: onGooglePressed,
        ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              AppStrings.noAccount,
              style: TextStyle(
                color: Theme.of(context).brightness == Brightness.dark 
                    ? AppColors.textLightGrey 
                    : AppColors.textGrey, 
                fontSize: 14,
              ),
            ),
            GestureDetector(
              onTap: () => context.push('/register'),
              child: const Text(
                AppStrings.registerLink,
                style: TextStyle(
                  color: AppColors.primary,
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
}
