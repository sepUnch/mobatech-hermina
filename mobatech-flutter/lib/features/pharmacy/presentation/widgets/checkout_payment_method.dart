import 'package:flutter/material.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/theme/app_spacing.dart';
import '../../../../../core/theme/app_typography.dart';
import '../../../../../core/widgets/app_card.dart';

class CheckoutPaymentMethod extends StatelessWidget {
  final String paymentMethod;
  final ValueChanged<String> onChanged;

  const CheckoutPaymentMethod({
    super.key,
    required this.paymentMethod,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildPaymentOption(
          'Transfer Bank',
          'Transfer',
          Icons.account_balance_outlined,
        ),
        const SizedBox(height: AppSpacing.md),
        _buildPaymentOption('Tunai (Cash)', 'Cash', Icons.money_outlined),
        const SizedBox(height: AppSpacing.md),
        _buildPaymentOption(
          'BPJS Kesehatan',
          'BPJS',
          Icons.health_and_safety_outlined,
        ),
      ],
    );
  }

  Widget _buildPaymentOption(String title, String value, IconData icon) {
    final isSelected = paymentMethod == value;
    return GestureDetector(
      onTap: () => onChanged(value),
      child: AppCard(
        borderColor: isSelected ? AppColors.primary : AppColors.border,
        child: Row(
          children: [
            Icon(
              icon,
              color: isSelected ? AppColors.primary : AppColors.textSecondary,
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Text(
                title,
                style: AppTypography.bodySmall.copyWith(
                  color: isSelected ? AppColors.textPrimary : AppColors.textSecondary,
                  fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                ),
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle, color: AppColors.primary),
          ],
        ),
      ),
    );
  }
}
