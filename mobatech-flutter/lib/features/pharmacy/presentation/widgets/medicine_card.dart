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
    return SizedBox(
      height: 120, // Fixed height for list item
      child: AppCard(
        padding: EdgeInsets.zero,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Expanded(flex: 3, child: MedicineCardImage(medicine: medicine)),
            Expanded(flex: 7, child: MedicineCardDetails(medicine: medicine, onAddToCart: onAddToCart)),
          ],
        ),
      ),
    );
  }
}
