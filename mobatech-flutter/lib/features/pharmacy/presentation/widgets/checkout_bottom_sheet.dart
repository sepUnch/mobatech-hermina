import '../../../../core/constants/app_strings.dart';
import '../../../../core/utils/custom_snackbar.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/theme/app_spacing.dart';
import '../../../../../core/theme/app_typography.dart';
import '../../../../../core/widgets/app_button.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/pharmacy_provider.dart';
import '../../models/cart.dart';
import '../../models/pharmacy_order.dart';

class CheckoutBottomSheet extends ConsumerWidget {
  final double grandTotal;
  final Cart cart;
  final String paymentMethod;
  final String pickupMethod;

  const CheckoutBottomSheet({
    super.key, 
    required this.grandTotal,
    required this.cart,
    required this.paymentMethod,
    required this.pickupMethod,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        boxShadow: [
          BoxShadow(
            color: AppColors.shadowColor.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Total Pembayaran',
                  style: AppTypography.caption.copyWith(color: AppColors.textSecondary),
                ),
                Text(
                  'Rp ${grandTotal.toInt()}',
                  style: AppTypography.h4.copyWith(
                    color: AppColors.primary,
                  ),
                ),
              ],
            ),
            AppButton(
              onPressed: () async {
                try {
                  final orderData = {
                    'payment_method': paymentMethod,
                    'pickup_method': pickupMethod,
                    'items': cart.items.map((e) => {
                      'medicine_id': e.medicine.id,
                      'quantity': e.quantity,
                    }).toList(),
                  };
                  
                  final repo = ref.read(pharmacyOrderRepositoryProvider);
                  final result = await repo.createOrder(orderData);
                  final order = PharmacyOrder.fromJson(result);

                  for (var item in cart.items) {
                    await ref.read(cartProvider.notifier).removeFromCart(item.id);
                  }

                  // Invalidate orders provider so the UI will fetch the new order
                  ref.invalidate(ordersProvider);

                  if (context.mounted) {
                    ScaffoldMessenger.of(context).hideCurrentSnackBar();
                    CustomSnackbar.showSuccess(context, AppStrings.extPesananberhasildibuat);
                    context.go('/pharmacy/tracking', extra: order);
                  }
                } catch (e) {
                  if (context.mounted) {
                    CustomSnackbar.showError(context, 'Gagal membuat pesanan');
                  }
                }
              },
              text: 'Bayar Sekarang',
            ),
          ],
        ),
      ),
    );
  }
}
