part of 'cart_screen.dart';

class _CartBottomBar extends StatelessWidget {
  final dynamic cart;
  const _CartBottomBar({required this.cart});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.backgroundWhite,
        boxShadow: [
          BoxShadow(
            color: AppColors.shadowColor,
            blurRadius: 10,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _buildTotalText(),
            _buildCheckoutButton(context),
          ],
        ),
      ),
    );
  }

  Widget _buildTotalText() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          AppStrings.extTotalpembayaran,
          style: TextStyle(color: AppColors.textGrey, fontSize: 12),
        ),
        Text(
          'Rp ${cart.totalPrice.toInt()}',
          style: const TextStyle(
            color: AppColors.primary,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
      ],
    );
  }

  Widget _buildCheckoutButton(BuildContext context) {
    return ElevatedButton(
      onPressed: () => context.push('/pharmacy/checkout'),
      style: ElevatedButton.styleFrom(
        backgroundColor: AppColors.primary,
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 14),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      ),
      child: const Text(
        AppStrings.extCheckout,
        style: TextStyle(
          fontWeight: FontWeight.bold,
          color: AppColors.textWhite,
          fontSize: 16,
        ),
      ),
    );
  }
}
