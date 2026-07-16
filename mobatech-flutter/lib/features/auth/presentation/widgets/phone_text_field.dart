import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../core/widgets/app_text_field.dart';
import '../../../../core/constants/app_strings.dart';

class PhoneTextField extends StatelessWidget {
  final TextEditingController? controller;
  final String? Function(String?)? validator;

  const PhoneTextField({super.key, this.controller, this.validator});

  @override
  Widget build(BuildContext context) {
    return AppTextField(
      label: AppStrings.phoneLabel,
      controller: controller,
      keyboardType: TextInputType.phone,
      validator: validator,
      inputFormatters: [PhonePrefixFormatter()],
      prefixIcon: Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              '+62',
              style: AppTypography.bodyLarge.copyWith(
                color: AppColors.textSecondary,
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            Container(
              width: 1,
              height: 24,
              color: AppColors.border,
            ),
            const SizedBox(width: AppSpacing.xs),
          ],
        ),
      ),
    );
  }
}
