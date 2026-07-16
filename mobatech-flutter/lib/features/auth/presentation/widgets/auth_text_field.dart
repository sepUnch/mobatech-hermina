import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/widgets/app_text_field.dart';

class AuthTextField extends StatelessWidget {
  final String label;
  final String hint;
  final bool isPassword;
  final bool obscureText;
  final VoidCallback? onTogglePassword;
  final TextEditingController? controller;
  final Function(String)? onChanged;
  final String? Function(String?)? validator;
  final TextInputType? keyboardType;

  const AuthTextField({
    super.key,
    required this.label,
    required this.hint,
    this.isPassword = false,
    this.obscureText = false,
    this.onTogglePassword,
    this.controller,
    this.onChanged,
    this.validator,
    this.keyboardType,
  });

  @override
  Widget build(BuildContext context) {
    return AppTextField(
      label: label,
      hint: hint,
      controller: controller,
      isPassword: obscureText,
      keyboardType: keyboardType ?? TextInputType.text,
      validator: validator,
      onChanged: onChanged,
      suffixIcon: isPassword
          ? IconButton(
              icon: Icon(
                obscureText
                    ? Icons.visibility_outlined
                    : Icons.visibility_off_outlined,
                color: AppColors.textSecondary,
                size: 22,
              ),
              onPressed: onTogglePassword,
            )
          : null,
    );
  }
}
