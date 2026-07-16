import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../data/models/doctor.dart';

class DoctorImageWidget extends StatelessWidget {
  final Doctor doctor;

  const DoctorImageWidget({super.key, required this.doctor});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
      child: doctor.imageUrl.isNotEmpty
          ? Image.network(
              doctor.imageUrl
                  .replaceAll('/svg', '/png')
                  .replaceAll('.svg', '.png'),
              width: 80,
              height: 100,
              fit: BoxFit.cover,
              errorBuilder: (ctx, err, stack) => _fallbackImage(),
            )
          : _fallbackImage(),
    );
  }

  Widget _fallbackImage() {
    return Image.asset(
      'assets/doctor.png',
      width: 80,
      height: 100,
      fit: BoxFit.cover,
    );
  }
}

class DoctorInfoWidget extends StatelessWidget {
  final Doctor doctor;

  const DoctorInfoWidget({super.key, required this.doctor});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          doctor.name,
          style: AppTypography.h3,
        ),
        const SizedBox(height: AppSpacing.xs),
        Wrap(
          spacing: AppSpacing.sm,
          runSpacing: AppSpacing.sm,
          children: [
            _buildBadge(doctor.polyclinicName ?? 'Belum ada poli'),
            _buildBadge(doctor.specialization),
          ],
        ),
      ],
    );
  }

  Widget _buildBadge(String text) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.sm,
        vertical: AppSpacing.xs,
      ),
      decoration: BoxDecoration(
        color: AppColors.primaryLight,
        borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
      ),
      child: Text(
        text,
        style: AppTypography.labelSmall.copyWith(
          color: AppColors.primary,
        ),
      ),
    );
  }
}

class DoctorAboutWidget extends StatelessWidget {
  final Doctor doctor;

  const DoctorAboutWidget({super.key, required this.doctor});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(vertical: AppSpacing.md),
          child: Divider(height: 1, color: AppColors.border),
        ),
        Text(
          'Tentang Dokter',
          style: AppTypography.h4,
        ),
        const SizedBox(height: AppSpacing.xs),
        Text(
          doctor.description,
          style: AppTypography.bodySmall,
        ),
      ],
    );
  }
}
