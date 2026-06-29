import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../data/models/doctor.dart';

class DoctorImageWidget extends StatelessWidget {
  final Doctor doctor;

  const DoctorImageWidget({super.key, required this.doctor});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(16),
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
          style: const TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.bold,
            color: AppColors.textDark,
          ),
        ),
        const SizedBox(height: 6),
        Wrap(
          spacing: 8,
          runSpacing: 8,
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
        horizontal: 10,
        vertical: 4,
      ),
      decoration: BoxDecoration(
        color: AppColors.primaryLight,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        text,
        style: const TextStyle(
          fontSize: 12,
          color: AppColors.primary,
          fontWeight: FontWeight.bold,
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
          padding: EdgeInsets.symmetric(vertical: 16),
          child: Divider(height: 1, color: AppColors.backgroundScreen),
        ),
        const Text(
          'Tentang Dokter',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.bold,
            color: AppColors.textDark,
          ),
        ),
        const SizedBox(height: 8),
        Text(
          doctor.description,
          style: const TextStyle(
            fontSize: 14,
            color: AppColors.textGrey,
            height: 1.5,
          ),
        ),
      ],
    );
  }
}
