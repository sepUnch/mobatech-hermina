import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppShadows {
  static List<BoxShadow> card = [
    BoxShadow(
      color: AppColors.shadowLight,
      blurRadius: 8,
      offset: const Offset(0, 2),
    ),
  ];

  static List<BoxShadow> elevated = [
    BoxShadow(
      color: AppColors.shadowMedium,
      blurRadius: 16,
      offset: const Offset(0, 4),
    ),
  ];

  static List<BoxShadow> subtle = [
    BoxShadow(
      color: AppColors.shadowLight,
      blurRadius: 4,
      offset: const Offset(0, 1),
    ),
  ];
}
