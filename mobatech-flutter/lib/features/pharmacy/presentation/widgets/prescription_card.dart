import '../../../../core/constants/app_strings.dart';
import '../../../../core/utils/custom_snackbar.dart';
import '../../../../core/utils/formatters.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../models/prescription.dart';
import '../../providers/pharmacy_provider.dart';
class PrescriptionCard extends ConsumerWidget {
  final Prescription prescription;
  const PrescriptionCard({super.key, required this.prescription});
  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Padding( padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 8.0),
      child: Container( padding: const EdgeInsets.all(16),
        decoration: BoxDecoration( color: AppColors.backgroundWhite.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.backgroundWhite.withValues(alpha: 0.2)),
          boxShadow: [ BoxShadow( color: AppColors.textDark.withValues(alpha: 0.1),
              blurRadius: 15,
              offset: const Offset(0, 4), ), ], ),
        child: Column( crossAxisAlignment: CrossAxisAlignment.start,
          children: [ _buildHeader(context, ref),
            if (prescription.doctorName.isNotEmpty) ...[ const SizedBox(height: 8),
              Row( children: [ const Icon(Icons.person, size: 14, color: AppColors.textGrey),
                  const SizedBox(width: 4),
                  Text('Dr. ${prescription.doctorName}', style: const TextStyle(color: AppColors.textGrey, fontSize: 13, fontWeight: FontWeight.w600)), ], ),
              if (prescription.diagnosis.isNotEmpty) Text(' ${prescription.diagnosis}', style: const TextStyle(color: AppColors.textGrey, fontSize: 12)), ],
            const SizedBox(height: 8),
            _buildDate(),
            const Divider(height: 24, color: AppColors.dividerGrey),
            if (prescription.items.isNotEmpty) _buildItems(),
            if (prescription.imageUrl.isNotEmpty) _buildImage(),
            if (prescription.notes.isNotEmpty) _buildNotes(),
            _buildRedeemButton(context), ], ), ), ); }
  Widget _buildHeader(BuildContext context, WidgetRef ref) {
    return Row( children: [ Text( 'Resep #${prescription.id}',
          style: const TextStyle( fontWeight: FontWeight.bold,
            fontSize: 16,
            color: AppColors.textDark, ), ),
        const Spacer(),
        _buildStatusBadge(),
        const SizedBox(width: 8),
        _buildDeleteButton(context, ref), ], ); }
  Widget _buildStatusBadge() {
    final isPending = prescription.status == 'Pending';
    return Container( padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration( color: isPending
            ? AppColors.iconOrange.withValues(alpha: 0.1)
            : AppColors.primaryLight,
        borderRadius: BorderRadius.circular(12), ),
      child: Text( prescription.status,
        style: TextStyle( color: isPending ? AppColors.iconOrange : AppColors.primary,
          fontSize: 12,
          fontWeight: FontWeight.bold, ), ), ); }
  Widget _buildDeleteButton(BuildContext context, WidgetRef ref) {
    return GestureDetector( onTap: () => _confirmDelete(context, ref),
      child: const Icon(Icons.delete_outline, color: AppColors.errorRed, size: 24), ); }
  Future<void> _confirmDelete(BuildContext context, WidgetRef ref) async {
    final confirm = await showDialog<bool>( context: context,
      builder: (context) => AlertDialog( title: Text(AppStrings.extHapuseresep),
        content: Text(AppStrings.extApakahandayakininginmenghapuseresepini),
        actions: [ TextButton(onPressed: () => Navigator.pop(context, false), child: Text(AppStrings.extBatal, style: TextStyle(color: AppColors.textGrey))),
          TextButton(onPressed: () => Navigator.pop(context, true), child: Text(AppStrings.extHapus, style: TextStyle(color: AppColors.errorRed))), ], ), );
    if (confirm == true) {
      if (!context.mounted) return;
      _deletePrescription(context, ref);
    } 
  }
  Future<void> _deletePrescription(BuildContext context, WidgetRef ref) async {
    try {
      await ref.read(prescriptionRepositoryProvider).deletePrescription(prescription.id);
      ref.invalidate(prescriptionsProvider);
      if (!context.mounted) return;
      CustomSnackbar.showSuccess(context, AppStrings.extEresepberhasildihapus);
    } catch (e) {
      if (!context.mounted) return;
      CustomSnackbar.showError(context, AppStrings.extGagalmenghapuseresep); } }
  Widget _buildDate() => Text('${AppStrings.extTanggal} ${Formatters.formatDateID(prescription.createdAt.toLocal())}', style: const TextStyle(color: AppColors.textGrey, fontSize: 14));
  Widget _buildItems() {
    if (prescription.items.isEmpty) return const SizedBox.shrink();
    return Column( crossAxisAlignment: CrossAxisAlignment.start,
      children: [ const SizedBox(height: 12),
        const Text('Daftar Obat Resep', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textDark)),
        const SizedBox(height: 8),
        ...prescription.items.map((item) => Padding( padding: const EdgeInsets.only(bottom: 8.0),
          child: Row( crossAxisAlignment: CrossAxisAlignment.start,
            children: [ const Icon(Icons.medication, size: 16, color: AppColors.primary),
              const SizedBox(width: 8),
              Expanded( child: Column( crossAxisAlignment: CrossAxisAlignment.start,
                  children: [ Text(item.medicineName, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                    Text('${item.dosageInstruction} • ${item.duration}', style: const TextStyle(fontSize: 12, color: AppColors.textGrey)), ], ), ),
              Text('${item.quantity}x', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13)), ], ),
        )), ], ); }
  Widget _buildRedeemButton(BuildContext context) {
    if (prescription.status != 'Pending') return const SizedBox.shrink();
    return Padding( padding: const EdgeInsets.only(top: 16.0),
      child: SizedBox( width: double.infinity,
        child: ElevatedButton( onPressed: () {
            CustomSnackbar.showSuccess(context, 'Obat berhasil ditambahkan ke keranjang!');
          },
          style: ElevatedButton.styleFrom( backgroundColor: AppColors.primary,
            foregroundColor: AppColors.textWhite,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            padding: const EdgeInsets.symmetric(vertical: 12), ),
          child: const Text('Tebus Obat', style: TextStyle(fontWeight: FontWeight.bold)), ), ), ); }
  Widget _buildImage() {
    return ClipRRect( borderRadius: BorderRadius.circular(8),
      child: Image.network( prescription.imageUrl,
        height: 150,
        width: double.infinity,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => const SizedBox(), ), ); }
  Widget _buildNotes() => Column( crossAxisAlignment: CrossAxisAlignment.start,
    children: [ const SizedBox(height: 12),
      Text(AppStrings.extCatatan, style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textDark)),
      const SizedBox(height: 4),
      Text(prescription.notes, style: const TextStyle(color: AppColors.textGrey, fontSize: 14)), ], ); }
