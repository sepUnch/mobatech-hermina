part of 'catalog_widgets.dart';

class MedicineCardImage extends StatelessWidget {
  final Medicine medicine;
  const MedicineCardImage({super.key, required this.medicine});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.backgroundWave,
        borderRadius: BorderRadius.horizontal(left: Radius.circular(16)),
      ),
      child: ClipRRect(
        borderRadius: const BorderRadius.horizontal(left: Radius.circular(16)),
        child: medicine.imageUrl.isNotEmpty
            ? Image.network(
                medicine.imageUrl.replaceAll('127.0.0.1', '10.0.2.2').replaceAll('localhost', '10.0.2.2'),
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => _buildFallbackIcon(),
              )
            : _buildFallbackIcon(),
      ),
    );
  }

  Widget _buildFallbackIcon() => const Center(child: Icon(Icons.medication, size: 40, color: AppColors.backgroundWhite));
}

class MedicineCardDetails extends StatelessWidget {
  final Medicine medicine;
  final VoidCallback onAddToCart;

  const MedicineCardDetails({super.key, required this.medicine, required this.onAddToCart});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(12.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          _buildTextInfo(),
          _buildPriceAndAction(),
        ],
      ),
    );
  }

  Widget _buildTextInfo() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(medicine.name, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textDark), maxLines: 1, overflow: TextOverflow.ellipsis),
        const SizedBox(height: 4),
        Text(medicine.genericName, style: const TextStyle(fontSize: 12, color: AppColors.textGrey), maxLines: 1, overflow: TextOverflow.ellipsis),
      ],
    );
  }

  Widget _buildPriceAndAction() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text('Rp ${medicine.price.toInt()}', style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.primary, fontSize: 14)),
        medicine.requiresPrescription ? _buildPrescriptionLabel() : _buildAddToCartButton(),
      ],
    );
  }

  Widget _buildPrescriptionLabel() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(color: AppColors.iconOrange.withOpacity(0.1), borderRadius: BorderRadius.circular(8)),
      child: const Text(AppStrings.prescriptionLabel, style: TextStyle(color: AppColors.iconOrange, fontSize: 10, fontWeight: FontWeight.bold)),
    );
  }

  Widget _buildAddToCartButton() {
    final isOutOfStock = medicine.stock <= 0;
    return GestureDetector(
      onTap: isOutOfStock ? null : onAddToCart,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: isOutOfStock ? AppColors.backgroundWave : AppColors.primaryLight,
          borderRadius: BorderRadius.circular(8),
        ),
        child: isOutOfStock
            ? const Text('Stok Habis', style: TextStyle(color: AppColors.textGrey, fontSize: 10, fontWeight: FontWeight.bold))
            : const Icon(Icons.add, color: AppColors.primary, size: 18),
      ),
    );
  }
}
