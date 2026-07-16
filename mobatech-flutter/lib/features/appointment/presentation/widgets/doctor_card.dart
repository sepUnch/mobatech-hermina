import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/app_card.dart';
import '../../data/models/doctor.dart';
import '../../../../core/utils/formatters.dart';
import 'doctor_card_parts.dart';

class DoctorCard extends StatelessWidget {
  final Doctor doctor;
  final VoidCallback? onTap;

  const DoctorCard({super.key, required this.doctor, this.onTap});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.md),
      child: AppCard(
        onTap: onTap,
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
              child: doctor.imageUrl.isNotEmpty
                  ? Image.network(
                      doctor.imageUrl
                          .replaceAll('/svg', '/png')
                          .replaceAll('.svg', '.png'),
                      width: 72,
                      height: 96,
                      fit: BoxFit.cover,
                      alignment: Alignment.topCenter,
                      errorBuilder: (_, __, ___) => _buildPlaceholder(),
                    )
                  : _buildPlaceholder(),
            ),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    doctor.name,
                    style: AppTypography.h4,
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  _buildInfoRow(
                    Icons.local_hospital_outlined,
                    doctor.polyclinicName ?? 'Belum ada poliklinik',
                  ),
                  const SizedBox(height: 4),
                  _buildInfoRow(
                    Icons.medical_services_outlined,
                    doctor.specialization,
                  ),
                  const SizedBox(height: 4),
                  _buildInfoRow(
                    Icons.phone_outlined,
                    Formatters.formatPhoneNumber(doctor.contactInfo),
                  ),
                  const SizedBox(height: AppSpacing.sm),
                  DoctorStatusBadge(isActive: doctor.isAvailableToday),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPlaceholder() {
    return Image.asset(
      'assets/doctor.png',
      width: 72,
      height: 96,
      fit: BoxFit.cover,
      alignment: Alignment.topCenter,
    );
  }

  Widget _buildInfoRow(
    IconData icon,
    String text, {
    Color color = AppColors.textSecondary,
  }) {
    return Row(
      children: [
        Icon(icon, size: 14, color: AppColors.primary),
        const SizedBox(width: AppSpacing.xs),
        Expanded(
          child: Text(
            text,
            style: AppTypography.labelSmall.copyWith(color: color),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
