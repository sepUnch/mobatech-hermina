import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';

class AppTextField extends StatelessWidget {
  final String label;
  final String? hint;
  final TextEditingController? controller;
  final bool isPassword;
  final TextInputType keyboardType;
  final String? Function(String?)? validator;
  final Widget? prefixIcon;
  final Widget? suffixIcon;
  final bool readOnly;
  final VoidCallback? onTap;
  final int maxLines;
  final List<TextInputFormatter>? inputFormatters;
  final void Function(String)? onChanged;
  final bool isRequired;

  const AppTextField({
    super.key,
    required this.label,
    this.hint,
    this.controller,
    this.isPassword = false,
    this.keyboardType = TextInputType.text,
    this.validator,
    this.prefixIcon,
    this.suffixIcon,
    this.readOnly = false,
    this.onTap,
    this.maxLines = 1,
    this.inputFormatters,
    this.onChanged,
    this.isRequired = false,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (label.isNotEmpty) ...[
          Row(
            children: [
              Text(
                label,
                style: AppTypography.label,
              ),
              if (isRequired)
                Text(
                  ' *',
                  style: AppTypography.label.copyWith(color: AppColors.error),
                ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
        ],
        TextFormField(
          controller: controller,
          obscureText: isPassword,
          keyboardType: keyboardType,
          validator: validator,
          readOnly: readOnly,
          onTap: onTap,
          maxLines: maxLines,
          inputFormatters: inputFormatters,
          onChanged: onChanged,
          style: AppTypography.bodyLarge, // 16px to prevent iOS auto-zoom
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: AppTypography.bodyLarge.copyWith(
              color: AppColors.textTertiary,
            ),
            prefixIcon: prefixIcon != null
                ? IconTheme(
                    data: const IconThemeData(color: AppColors.textSecondary),
                    child: prefixIcon!)
                : null,
            suffixIcon: suffixIcon,
            filled: true,
            fillColor: readOnly ? AppColors.surfaceVariant : AppColors.surface,
            contentPadding: const EdgeInsets.symmetric(
              horizontal: AppSpacing.lg,
              vertical: AppSpacing.md, // Total height will be around 48px
            ),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
              borderSide: const BorderSide(color: AppColors.border),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
              borderSide: const BorderSide(color: AppColors.border),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
              borderSide: const BorderSide(color: AppColors.borderFocused, width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
              borderSide: const BorderSide(color: AppColors.error),
            ),
            focusedErrorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
              borderSide: const BorderSide(color: AppColors.error, width: 2),
            ),
          ),
        ),
      ],
    );
  }
}
