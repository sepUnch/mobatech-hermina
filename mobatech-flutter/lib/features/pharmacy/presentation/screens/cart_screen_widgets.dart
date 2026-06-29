part of 'cart_screen.dart';

class _CartItemList extends ConsumerWidget {
  final dynamic cart;
  const _CartItemList({required this.cart});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    if (cart.items.isEmpty) {
      return const Center(child: Text(AppStrings.extKeranjangandakosong));
    }
    return ListView.separated(
      padding: const EdgeInsets.all(16.0),
      itemCount: cart.items.length,
      separatorBuilder: (context, index) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        final item = cart.items[index];
        return _CartItemWidget(item: item);
      },
    );
  }
}

class _CartItemWidget extends ConsumerWidget {
  final dynamic item;
  const _CartItemWidget({required this.item});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppColors.backgroundWhite,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: AppColors.shadowColor,
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          _buildItemImage(),
          const SizedBox(width: 12),
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
        color: AppColors.backgroundWave,
        borderRadius: BorderRadius.circular(12),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(12),
        child: item.medicine.imageUrl.isNotEmpty
            ? Image.network(
                item.medicine.imageUrl,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => const Icon(Icons.medication, color: AppColors.backgroundWhite),
              )
            : const Icon(Icons.medication, color: AppColors.backgroundWhite),
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
            style: const TextStyle(
              fontWeight: FontWeight.bold,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'Rp ${item.medicine.price.toInt()}',
            style: const TextStyle(
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
          icon: const Icon(Icons.remove_circle_outline, color: AppColors.textGrey),
          onPressed: () {
            if (item.quantity > 1) {
              ref.read(cartProvider.notifier).updateCartItem(item.id, item.quantity - 1);
            } else {
              ref.read(cartProvider.notifier).removeFromCart(item.id);
            }
          },
        ),
        Text(
          '${item.quantity}',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        IconButton(
          icon: const Icon(Icons.add_circle_outline, color: AppColors.primary),
          onPressed: () {
            ref.read(cartProvider.notifier).updateCartItem(item.id, item.quantity + 1);
          },
        ),
      ],
    );
  }
}

