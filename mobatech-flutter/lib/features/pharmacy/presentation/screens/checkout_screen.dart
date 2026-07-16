import '../../../../core/constants/app_strings.dart';
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../widgets/checkout_order_summary.dart';
import '../widgets/checkout_pickup_method.dart';
import '../widgets/checkout_payment_method.dart';
import '../widgets/checkout_bottom_sheet.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../providers/pharmacy_provider.dart';

class CheckoutScreen extends ConsumerStatefulWidget {
  const CheckoutScreen({super.key});

  @override
  ConsumerState<CheckoutScreen> createState() => _CheckoutScreenState();
}

class _CheckoutScreenState extends ConsumerState<CheckoutScreen> {
  String _pickupMethod = 'Delivery';
  String _paymentMethod = 'Transfer';

  @override
  Widget build(BuildContext context) {
    final cartAsync = ref.watch(cartProvider);

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        title: Text(
          'Checkout',
          style: AppTypography.h3,
        ),
        backgroundColor: AppColors.surface,
        elevation: 0,
        iconTheme: const IconThemeData(color: AppColors.textPrimary),
      ),
      body: cartAsync.when(
        data: (cart) {
          if (cart.items.isEmpty) {
            return Center(
                child: Text(AppStrings.extKeranjangandakosong,
                    style: AppTypography.body));
          }
          return SingleChildScrollView(
            padding: const EdgeInsets.all(AppSpacing.pagePadding),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildSectionTitle('Ringkasan Pesanan'),
                CheckoutOrderSummary(pickupMethod: _pickupMethod, cart: cart),
                const SizedBox(height: AppSpacing.xl),
                _buildSectionTitle('Metode Pengambilan'),
                CheckoutPickupMethod(
                  pickupMethod: _pickupMethod,
                  onChanged: (val) => setState(() => _pickupMethod = val),
                ),
                const SizedBox(height: AppSpacing.xl),
                _buildSectionTitle('Metode Pembayaran'),
                CheckoutPaymentMethod(
                  paymentMethod: _paymentMethod,
                  onChanged: (val) => setState(() => _paymentMethod = val),
                ),
                const SizedBox(height: 100),
              ],
            ),
          );
        },
        loading: () =>
            const Center(child: CircularProgressIndicator(color: AppColors.primary)),
        error: (e, s) => Center(
            child: Text(AppStrings.extGagalmemuatpesanan,
                style: AppTypography.body.copyWith(color: AppColors.error))),
      ),
      bottomSheet: cartAsync.whenOrNull(
        data: (cart) {
          if (cart.items.isEmpty) return null;
          final ongkir = _pickupMethod == 'Delivery' ? 10000 : 0;
          final grandTotal = cart.totalPrice + ongkir;
          return CheckoutBottomSheet(
            grandTotal: grandTotal,
            cart: cart,
            paymentMethod: _paymentMethod,
            pickupMethod: _pickupMethod,
          );
        },
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.md),
      child: Text(
        title,
        style: AppTypography.h4,
      ),
    );
  }
}
