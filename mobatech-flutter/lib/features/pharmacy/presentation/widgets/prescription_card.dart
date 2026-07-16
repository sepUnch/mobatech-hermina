import '../../../../core/constants/app_strings.dart';
import '../../../../core/utils/custom_snackbar.dart';
import '../../../../core/utils/formatters.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_button.dart';
import '../../models/prescription.dart';
import '../../providers/pharmacy_provider.dart';

class PrescriptionCard extends ConsumerWidget {
  final Prescription prescription;
  const PrescriptionCard({super.key, required this.prescription});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Padding(
      padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.pagePadding, vertical: AppSpacing.sm),
      child: AppCard(
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildHeader(context, ref),
            if (prescription.doctorName.isNotEmpty) ...[
              const SizedBox(height: AppSpacing.sm),
              Row(
                children: [
                  const Icon(Icons.person,
                      size: 14, color: AppColors.textSecondary),
                  const SizedBox(width: AppSpacing.xs),
                  Text('Dr. ${prescription.doctorName}',
                      style: AppTypography.labelSmall.copyWith(
                          color: AppColors.textSecondary,
                          fontWeight: FontWeight.w600)),
                ],
              ),
              if (prescription.diagnosis.isNotEmpty)
                Text(' ${prescription.diagnosis}',
                    style: AppTypography.caption
                        .copyWith(color: AppColors.textSecondary)),
            ],
            const SizedBox(height: AppSpacing.sm),
            _buildDate(),
            const Divider(height: AppSpacing.xl, color: AppColors.border),
            if (prescription.items.isNotEmpty) _buildItems(),
            if (prescription.imageUrl.isNotEmpty) _buildImage(),
            if (prescription.notes.isNotEmpty) _buildNotes(),
            _buildRedeemButton(context),
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
          style: AppTypography.h4,
        ),
        const Spacer(),
        _buildStatusBadge(),
        const SizedBox(width: AppSpacing.sm),
        _buildDeleteButton(context, ref),
      ],
    );
  }

  Widget _buildStatusBadge() {
    final isPending = prescription.status == 'Pending';
    return Container(
      padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.sm, vertical: AppSpacing.xs),
      decoration: BoxDecoration(
        color: isPending
            ? AppColors.warning.withValues(alpha: 0.1)
            : AppColors.primaryLight,
        borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
      ),
      child: Text(
        prescription.status,
        style: AppTypography.caption.copyWith(
          color: isPending ? AppColors.warning : AppColors.primary,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildDeleteButton(BuildContext context, WidgetRef ref) {
    return GestureDetector(
      onTap: () => _confirmDelete(context, ref),
      child:
          const Icon(Icons.delete_outline, color: AppColors.error, size: 24),
    );
  }

  Future<void> _confirmDelete(BuildContext context, WidgetRef ref) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(AppStrings.extHapuseresep, style: AppTypography.h4),
        content: Text(AppStrings.extApakahandayakininginmenghapuseresepini,
            style: AppTypography.body),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(context, false),
              child: Text(AppStrings.extBatal,
                  style: AppTypography.label
                      .copyWith(color: AppColors.textSecondary))),
          TextButton(
              onPressed: () => Navigator.pop(context, true),
              child: Text(AppStrings.extHapus,
                  style: AppTypography.label.copyWith(color: AppColors.error))),
        ],
      ),
    );
    if (confirm == true) {
      if (!context.mounted) return;
      _deletePrescription(context, ref);
    }
  }

  Future<void> _deletePrescription(BuildContext context, WidgetRef ref) async {
    try {
      await ref
          .read(prescriptionRepositoryProvider)
          .deletePrescription(prescription.id);
      ref.invalidate(prescriptionsProvider);
      if (!context.mounted) return;
      CustomSnackbar.showSuccess(context, AppStrings.extEresepberhasildihapus);
    } catch (e) {
      if (!context.mounted) return;
      CustomSnackbar.showError(context, AppStrings.extGagalmenghapuseresep);
    }
  }

  Widget _buildDate() => Text(
      '${AppStrings.extTanggal} ${Formatters.formatDateID(prescription.createdAt.toLocal())}',
      style: AppTypography.bodySmall.copyWith(color: AppColors.textSecondary));

  Widget _buildItems() {
    if (prescription.items.isEmpty) return const SizedBox.shrink();
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: AppSpacing.md),
        Text('Daftar Obat Resep', style: AppTypography.label),
        const SizedBox(height: AppSpacing.sm),
        ...prescription.items.map((item) => Padding(
              padding: const EdgeInsets.only(bottom: AppSpacing.sm),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Icon(Icons.medication,
                      size: 16, color: AppColors.primary),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(item.medicineName,
                            style: AppTypography.bodySmall
                                .copyWith(fontWeight: FontWeight.w600)),
                        Text(
                            '${item.dosageInstruction} • ${item.duration}',
                            style: AppTypography.caption
                                .copyWith(color: AppColors.textSecondary)),
                      ],
                    ),
                  ),
                  Text('${item.quantity}x',
                      style: AppTypography.bodySmall
                          .copyWith(fontWeight: FontWeight.bold)),
                ],
              ),
            )),
      ],
    );
  }

  Widget _buildRedeemButton(BuildContext context) {
    if (prescription.status != 'Pending') return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(top: AppSpacing.md),
      child: SizedBox(
        width: double.infinity,
        child: AppButton(
          text: 'Tebus Obat',
          onPressed: () {
            CustomSnackbar.showSuccess(
                context, 'Obat berhasil ditambahkan ke keranjang!');
          },
        ),
      ),
    );
  }

  Widget _buildImage() {
    return ClipRRect(
      borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
      child: Image.network(
        prescription.imageUrl,
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
          const SizedBox(height: AppSpacing.md),
          Text(AppStrings.extCatatan, style: AppTypography.label),
          const SizedBox(height: AppSpacing.xs),
          Text(prescription.notes,
              style: AppTypography.bodySmall
                  .copyWith(color: AppColors.textSecondary)),
        ],
      );
}
