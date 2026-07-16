part of 'cart_screen.dart';

class _CartBottomBar extends StatelessWidget {
  final dynamic cart;
  const _CartBottomBar({required this.cart});

  @override
  Widget build(BuildContext context) {
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
            _buildTotalText(),
            const SizedBox(width: AppSpacing.md),
            Expanded(child: _buildCheckoutButton(context)),
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
        Text(
          AppStrings.extTotalpembayaran,
          style: AppTypography.caption.copyWith(color: AppColors.textSecondary),
        ),
        Text(
          'Rp ${cart.totalPrice.toInt()}',
          style: AppTypography.h4.copyWith(color: AppColors.primary),
        ),
      ],
    );
  }

  Widget _buildCheckoutButton(BuildContext context) {
    return AppButton(
      text: AppStrings.extCheckout,
      onPressed: () => context.push('/pharmacy/checkout'),
    );
  }
}
