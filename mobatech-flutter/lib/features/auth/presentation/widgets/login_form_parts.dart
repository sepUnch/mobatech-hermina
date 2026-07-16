part of 'login_form.dart';

class _EmailInputSection extends StatelessWidget {
  final TextEditingController controller;
  final VoidCallback onChanged;

  const _EmailInputSection({
    required this.controller,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return AuthTextField(
      label: AppStrings.emailLabel,
      hint: AppStrings.emailHint,
      controller: controller,
      keyboardType: TextInputType.emailAddress,
      validator: Validators.validateEmail,
      onChanged: (_) => onChanged(),
    );
  }
}

class _PasswordInputSection extends StatelessWidget {
  final TextEditingController controller;
  final bool obscurePassword;
  final VoidCallback onChanged;
  final VoidCallback onTogglePassword;

  const _PasswordInputSection({
    required this.controller,
    required this.obscurePassword,
    required this.onChanged,
    required this.onTogglePassword,
  });

  @override
  Widget build(BuildContext context) {
    return AuthTextField(
      label: AppStrings.passwordLabel,
      hint: AppStrings.passwordHint,
      isPassword: true,
      obscureText: obscurePassword,
      controller: controller,
      validator: Validators.validatePassword,
      onChanged: (_) => onChanged(),
      onTogglePassword: onTogglePassword,
    );
  }
}

class _LoginFormOptions extends StatelessWidget {
  final bool rememberMe;
  final ValueChanged<bool?> onRememberMeChanged;
  final VoidCallback onForgotPasswordPressed;

  const _LoginFormOptions({
    required this.rememberMe,
    required this.onRememberMeChanged,
    required this.onForgotPasswordPressed,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Row(
          children: [
            SizedBox(
              width: 24,
              height: 24,
              child: Checkbox(
                value: rememberMe,
                activeColor: AppColors.primary,
                checkColor: AppColors.surface,
                side: const BorderSide(
                  color: AppColors.border,
                  width: 1.5,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(4),
                ),
                onChanged: onRememberMeChanged,
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            Text(
              AppStrings.rememberMe,
              style: AppTypography.bodySmall,
            ),
          ],
        ),
        TextButton(
          onPressed: onForgotPasswordPressed,
          child: Text(
            AppStrings.forgotPassword,
            style: AppTypography.labelSmall.copyWith(
              color: AppColors.primary,
            ),
          ),
        ),
      ],
    );
  }
}
