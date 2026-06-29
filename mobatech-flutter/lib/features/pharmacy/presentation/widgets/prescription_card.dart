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
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: AppColors.backgroundWhite.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: Colors.white.withValues(alpha: 0.2)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.1),
              blurRadius: 15,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(context, ref),
            const SizedBox(height: 8),
            _buildDate(),
            const Divider(height: 24, color: AppColors.dividerGrey),
            if (prescription.imageUrl.isNotEmpty) _buildImage(),
            if (prescription.notes.isNotEmpty) _buildNotes(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(BuildContext context, WidgetRef ref) {
    return Row(
      children: [
        Text(
          'Resep #${prescription.id}',
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
            color: AppColors.textDark,
          ),
        ),
        const Spacer(),
        _buildStatusBadge(),
        const SizedBox(width: 8),
        _buildDeleteButton(context, ref),
      ],
    );
  }

  Widget _buildStatusBadge() {
    final isPending = prescription.status == 'Pending';
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: isPending
            ? AppColors.iconOrange.withValues(alpha: 0.1)
            : AppColors.primaryLight,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        prescription.status,
        style: TextStyle(
          color: isPending ? AppColors.iconOrange : AppColors.primary,
          fontSize: 12,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildDeleteButton(BuildContext context, WidgetRef ref) {
    return GestureDetector(
      onTap: () => _confirmDelete(context, ref),
      child: const Icon(Icons.delete_outline, color: Colors.red, size: 24),
    );
  }

  Future<void> _confirmDelete(BuildContext context, WidgetRef ref) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Hapus E-Resep'),
        content: const Text('Apakah Anda yakin ingin menghapus e-resep ini?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Batal', style: TextStyle(color: AppColors.textGrey))),
          TextButton(onPressed: () => Navigator.pop(context, true), child: const Text('Hapus', style: TextStyle(color: Colors.red))),
        ],
      ),
    );
    if (confirm == true) _deletePrescription(context, ref);
  }

  Future<void> _deletePrescription(BuildContext context, WidgetRef ref) async {
    try {
      await ref.read(prescriptionRepositoryProvider).deletePrescription(prescription.id);
      ref.invalidate(prescriptionsProvider);
      if (context.mounted) if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('E-Resep berhasil dihapus')));
    } catch (e) {
      if (context.mounted) if (!context.mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Gagal menghapus E-Resep')));
    }
  }

  Widget _buildDate() => Text('Tanggal: ${prescription.createdAt.toLocal().toString().split(' ')[0]}', style: const TextStyle(color: AppColors.textGrey, fontSize: 14));

  Widget _buildImage() {
    return ClipRRect(
      borderRadius: BorderRadius.circular(8),
      child: Image.network(
        prescription.imageUrl.replaceAll('127.0.0.1', '10.0.2.2').replaceAll('localhost', '10.0.2.2'),
        height: 150,
        width: double.infinity,
        fit: BoxFit.cover,
        errorBuilder: (_, __, ___) => const SizedBox(),
      ),
    );
  }

  Widget _buildNotes() => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      const SizedBox(height: 12),
      const Text('Catatan:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppColors.textDark)),
      const SizedBox(height: 4),
      Text(prescription.notes, style: const TextStyle(color: AppColors.textGrey, fontSize: 14)),
    ],
  );
}
