import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/app_card.dart';

class AssistantCard extends StatelessWidget {
  const AssistantCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.pagePadding,
        vertical: AppSpacing.sm,
      ),
      child: AppCard(
        onTap: () => context.push('/chatbot'),
        child: Row(
          children: [
            Container(
              width: 64,
              height: 64,
              decoration: BoxDecoration(
                color: AppColors.primaryLight,
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.smart_toy_outlined,
                size: 32,
                color: AppColors.primary,
              ),
            ),
            const SizedBox(width: AppSpacing.lg),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    AppStrings.extAsistenhermina,
                    style: AppTypography.h3,
                  ),
                  const SizedBox(height: AppSpacing.xs),
                  Text(
                    AppStrings.extSiapmembantuandamenemukaninformasijadwaldokterlayananfasilitasrshermina,
                    style: AppTypography.bodySmall,
                  ),
                  const SizedBox(height: AppSpacing.md),
                  Text(
                    AppStrings.extTanyasekarang,
                    style: AppTypography.label.copyWith(
                      color: AppColors.primary,
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
