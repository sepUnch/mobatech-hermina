import 'package:flutter/material.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/theme/app_spacing.dart';
import '../../../../../core/theme/app_typography.dart';
import '../../../../../core/widgets/app_card.dart';

class CheckoutPickupMethod extends StatelessWidget {
  final String pickupMethod;
  final ValueChanged<String> onChanged;

  const CheckoutPickupMethod({
    super.key,
    required this.pickupMethod,
    required this.onChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: _buildSelectableCard(
            title: 'Delivery',
            icon: Icons.local_shipping_outlined,
            isSelected: pickupMethod == 'Delivery',
            onTap: () => onChanged('Delivery'),
          ),
        ),
        const SizedBox(width: AppSpacing.md),
        Expanded(
          child: _buildSelectableCard(
            title: 'Pickup at Counter',
            icon: Icons.storefront_outlined,
            isSelected: pickupMethod == 'Pickup',
            onTap: () => onChanged('Pickup'),
          ),
        ),
      ],
    );
  }

  Widget _buildSelectableCard({
    required String title,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AppCard(
        backgroundColor: isSelected ? AppColors.primaryLight : AppColors.surface,
        borderColor: isSelected ? AppColors.primary : AppColors.border,
        child: Column(
          children: [
            Icon(
              icon,
              size: 32,
              color: isSelected ? AppColors.primary : AppColors.textSecondary,
            ),
            const SizedBox(height: AppSpacing.sm),
            Text(
              title,
              textAlign: TextAlign.center,
              style: AppTypography.caption.copyWith(
                fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                color: isSelected ? AppColors.primary : AppColors.textSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
