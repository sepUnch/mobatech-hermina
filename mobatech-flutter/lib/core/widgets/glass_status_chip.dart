import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

class GlassStatusChip extends StatelessWidget {
  final String status;
  final double fontSize;
  final EdgeInsetsGeometry padding;

  const GlassStatusChip({
    super.key,
    required this.status,
    this.fontSize = 12,
    this.padding = const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
  });

  @override
  Widget build(BuildContext context) {
    Color baseColor;
    String label;

    switch (status.toLowerCase()) {
      case 'pending':
      case 'menunggu':
      case 'menunggu hasil':
        baseColor = AppColors.iconOrange;
        label = 'Menunggu';
        break;
      case 'approved':
      case 'disetujui':
        baseColor = AppColors.iconBlue;
        label = 'Disetujui';
        break;
      case 'completed':
      case 'selesai':
        baseColor = AppColors.successGreen;
        label = 'Selesai';
        break;
      case 'cancelled':
      case 'dibatalkan':
        baseColor = AppColors.errorRed;
        label = 'Dibatalkan';
        break;
      case 'available':
      case 'tersedia':
        baseColor = AppColors.primary;
        label = 'Tersedia';
        break;
      case 'unavailable':
      case 'tidak tersedia':
        baseColor = AppColors.errorRed;
        label = 'Tidak Tersedia';
        break;
      default:
        baseColor = AppColors.textGrey;
        label = status.toUpperCase();
    }

    return Container(
      decoration: BoxDecoration(
        color: baseColor.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: baseColor.withValues(alpha: 0.2)),
      ),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 4, sigmaY: 4),
          child: Padding(
            padding: padding,
            child: Text(
              label,
              style: TextStyle(
                color: baseColor,
                fontWeight: FontWeight.bold,
                fontSize: fontSize,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
