import 'package:flutter/material.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_text_field.dart';

class SymptomsCard extends StatelessWidget {
  final TextEditingController controller;

  const SymptomsCard({super.key, required this.controller});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.lg),
      child: AppCard(
        child: AppTextField(
          label: 'Keluhan / Gejala',
          hint: 'Tuliskan secara singkat keluhan yang Anda alami...',
          controller: controller,
          maxLines: 4,
        ),
      ),
    );
  }
}
