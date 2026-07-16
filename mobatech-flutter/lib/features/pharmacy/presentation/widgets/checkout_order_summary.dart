import '../../../../core/constants/app_strings.dart';
import 'package:flutter/material.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/theme/app_spacing.dart';
import '../../../../../core/theme/app_typography.dart';
import '../../../../../core/widgets/app_card.dart';
import '../../models/cart.dart';

class CheckoutOrderSummary extends StatelessWidget {
  final String pickupMethod;
  final Cart cart;

  const CheckoutOrderSummary({
    super.key,
    required this.pickupMethod,
    required this.cart,
  });

  @override
  Widget build(BuildContext context) {
    return AppCard(
      child: Column(
        children: [
          ...cart.items.map(
            (item) => Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    '${item.medicine.name} (${item.quantity})',
                    style: AppTypography.bodySmall.copyWith(
                      color: AppColors.textPrimary,
                    ),
                  ),
                  Text(
                    'Rp ${(item.medicine.price * item.quantity).toInt()}',
                    style: AppTypography.bodySmall.copyWith(
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),
          const Divider(height: AppSpacing.xl, color: AppColors.border),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                AppStrings.extSubtotal,
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              Text(
                'Rp ${cart.totalPrice.toInt()}',
                style: AppTypography.bodySmall.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.sm),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                AppStrings.extOngkoskirim,
                style: AppTypography.bodySmall.copyWith(
                  color: AppColors.textSecondary,
                ),
              ),
              Text(
                pickupMethod == 'Delivery' ? 'Rp 10.000' : 'Rp 0',
                style: AppTypography.bodySmall.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
