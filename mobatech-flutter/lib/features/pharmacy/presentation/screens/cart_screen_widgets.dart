part of 'cart_screen.dart';

class _CartItemList extends ConsumerWidget {
  final dynamic cart;
  const _CartItemList({required this.cart});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (cart.items.isEmpty) {
      return SliverFillRemaining(
        child: Center(
            child: Text(AppStrings.extKeranjangandakosong,
                style: AppTypography.body)),
      );
    }
    return SliverPadding(
      padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.pagePadding, vertical: AppSpacing.md),
      sliver: SliverList(
        delegate: SliverChildBuilderDelegate(
          (context, index) {
            final item = cart.items[index];
            return Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.md),
              child: _CartItemWidget(item: item),
            );
          },
          childCount: cart.items.length,
        ),
      ),
    );
  }
}

class _CartItemWidget extends ConsumerWidget {
  final dynamic item;
  const _CartItemWidget({required this.item});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return AppCard(
      child: Row(
        children: [
          _buildItemImage(),
          const SizedBox(width: AppSpacing.md),
          _buildItemDetails(),
          _buildQuantityControls(ref),
        ],
      ),
    );
  }

  Widget _buildItemImage() {
    return Container(
      width: 60,
      height: 60,
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant,
        borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
        child: item.medicine.imageUrl.isNotEmpty
            ? Image.network(
                item.medicine.imageUrl,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => const Icon(Icons.medication,
                    color: AppColors.primary),
              )
            : const Icon(Icons.medication, color: AppColors.primary),
      ),
    );
  }

  Widget _buildItemDetails() {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            item.medicine.name,
            style: AppTypography.body.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            'Rp ${item.medicine.price.toInt()}',
            style: AppTypography.bodySmall.copyWith(
              color: AppColors.primary,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuantityControls(WidgetRef ref) {
    return Row(
      children: [
        IconButton(
          icon: const Icon(Icons.remove_circle_outline,
              color: AppColors.textSecondary),
          onPressed: () {
            if (item.quantity > 1) {
              ref
                  .read(cartProvider.notifier)
                  .updateCartItem(item.id, item.quantity - 1);
            } else {
              ref.read(cartProvider.notifier).removeFromCart(item.id);
            }
          },
        ),
        Text(
          '${item.quantity}',
          style: AppTypography.bodySmall.copyWith(fontWeight: FontWeight.bold),
        ),
        IconButton(
          icon: const Icon(Icons.add_circle_outline, color: AppColors.primary),
          onPressed: () {
            ref
                .read(cartProvider.notifier)
                .updateCartItem(item.id, item.quantity + 1);
          },
        ),
      ],
    );
  }
}
