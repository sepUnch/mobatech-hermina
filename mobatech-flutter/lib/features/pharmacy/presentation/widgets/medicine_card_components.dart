part of 'catalog_widgets.dart';

class MedicineCardImage extends StatelessWidget {
  final Medicine medicine;
  const MedicineCardImage({super.key, required this.medicine});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppColors.surfaceVariant,
      ),
      child: ClipRRect(
        child: medicine.imageUrl.isNotEmpty
            ? Image.network(
                medicine.imageUrl,
                fit: BoxFit.cover,
                errorBuilder: (_, __, ___) => _buildFallbackIcon(),
              )
            : _buildFallbackIcon(),
      ),
    );
  }

  Widget _buildFallbackIcon() => const Center(
      child: Icon(Icons.medication, size: 40, color: AppColors.primary));
}

class MedicineCardDetails extends StatelessWidget {
  final Medicine medicine;
  final VoidCallback onAddToCart;

  const MedicineCardDetails(
      {super.key, required this.medicine, required this.onAddToCart});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.md),
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
        Text(medicine.name,
            style: AppTypography.body
                .copyWith(fontWeight: FontWeight.bold),
            maxLines: 1,
            overflow: TextOverflow.ellipsis),
        const SizedBox(height: AppSpacing.xs),
        Text(medicine.genericName,
            style: AppTypography.caption
                .copyWith(color: AppColors.textSecondary),
            maxLines: 1,
            overflow: TextOverflow.ellipsis),
      ],
    );
  }

  Widget _buildPriceAndAction() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text('${AppStrings.extRp} ${medicine.price.toInt()}',
            style: AppTypography.body.copyWith(
                fontWeight: FontWeight.bold, color: AppColors.primary)),
        medicine.requiresPrescription
            ? _buildPrescriptionLabel()
            : _buildAddToCartButton(),
      ],
    );
  }

  Widget _buildPrescriptionLabel() {
    return Container(
      padding: EdgeInsets.symmetric(
          horizontal: AppSpacing.sm, vertical: AppSpacing.xs),
      decoration: BoxDecoration(
          color: AppColors.warning.withValues(alpha: 0.1),
          borderRadius: BorderRadius.circular(AppSpacing.radiusSm)),
      child: Text(AppStrings.prescriptionLabel,
          style: AppTypography.caption.copyWith(
              color: AppColors.warning, fontWeight: FontWeight.bold)),
    );
  }

  Widget _buildAddToCartButton() {
    final isOutOfStock = medicine.stock <= 0;
    return GestureDetector(
      onTap: isOutOfStock ? null : onAddToCart,
      child: Container(
        padding: EdgeInsets.symmetric(
            horizontal: AppSpacing.md, vertical: AppSpacing.sm),
        decoration: BoxDecoration(
          color: isOutOfStock
              ? AppColors.surfaceVariant
              : AppColors.primaryLight,
          borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
        ),
        child: isOutOfStock
            ? Text(AppStrings.extStokhabis,
                style: AppTypography.caption.copyWith(
                    color: AppColors.textSecondary,
                    fontWeight: FontWeight.bold))
            : const Icon(Icons.add, color: AppColors.primary, size: 18),
      ),
    );
  }
}
