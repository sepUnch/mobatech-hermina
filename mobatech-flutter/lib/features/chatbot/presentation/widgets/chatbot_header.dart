import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_strings.dart';
import '../providers/chat_provider.dart';

class ChatbotHeader extends ConsumerWidget {
  final VoidCallback onShowHistory;

  const ChatbotHeader({super.key, required this.onShowHistory});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Container(
      width: double.infinity,
      decoration: const BoxDecoration(
        color: AppColors.primary,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(AppSpacing.radiusXl),
          bottomRight: Radius.circular(AppSpacing.radiusXl),
        ),
      ),
      child: Stack(
        children: [
          Positioned(
            right: -20,
            top: -10,
            child: Opacity(
              opacity: 0.2,
              child: Image.asset('assets/header_logo.png', width: 160),
            ),
          ),
          SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.symmetric(
                horizontal: AppSpacing.pagePadding,
                vertical: AppSpacing.xl,
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(AppSpacing.sm),
                    decoration: const BoxDecoration(
                      color: AppColors.surface,
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(
                      Icons.smart_toy,
                      color: AppColors.primary,
                      size: 30,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          AppStrings.chatHospitalName,
                          style: AppTypography.h3.copyWith(
                            color: AppColors.textOnPrimary,
                          ),
                        ),
                        const SizedBox(height: AppSpacing.xs),
                        Text(
                          AppStrings.chatSubtitle,
                          style: AppTypography.caption.copyWith(
                            color: AppColors.textOnPrimary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    icon: const Icon(
                      Icons.add_circle_outline,
                      color: AppColors.textOnPrimary,
                    ),
                    tooltip: AppStrings.chatNewTooltip,
                    onPressed: () {
                      ref.read(currentSessionIdProvider.notifier).state = null;
                      ref.read(chatMessagesProvider.notifier).clearMessages();
                    },
                  ),
                  IconButton(
                    icon: const Icon(Icons.history,
                        color: AppColors.textOnPrimary),
                    tooltip: AppStrings.chatHistoryTooltip,
                    onPressed: onShowHistory,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
