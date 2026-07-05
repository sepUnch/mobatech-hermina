part of 'catalog_widgets.dart';

class MedicineCard extends StatelessWidget {
  final Medicine medicine;
  final VoidCallback onAddToCart;

  const MedicineCard({
    super.key,
    required this.medicine,
    required this.onAddToCart,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 120, // Fixed height for list item
      decoration: BoxDecoration(
        color: AppColors.backgroundWhite.withValues(alpha: 0.15),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.backgroundWhite.withValues(alpha: 0.2)),
        boxShadow: [
          BoxShadow(
            color: AppColors.textDark.withValues(alpha: 0.1),
            blurRadius: 15,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Expanded(flex: 3, child: MedicineCardImage(medicine: medicine)),
              Expanded(flex: 7, child: MedicineCardDetails(medicine: medicine, onAddToCart: onAddToCart)),
            ],
          ),
        ),
      ),
    );
  }
}
