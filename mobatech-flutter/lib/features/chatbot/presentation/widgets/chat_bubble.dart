import 'dart:ui';
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import 'chat_bubble_parts.dart';

class ChatBubble extends StatelessWidget {
  final String text;
  final String time;
  final bool isUser;
  final bool isLoading;
  final String? imagePath;
  final String? filePath;

  const ChatBubble({
    super.key,
    required this.text,
    required this.time,
    this.isUser = false,
    this.isLoading = false,
    this.imagePath,
    this.filePath,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        if (!isUser) ...[
          Container(
            margin: const EdgeInsets.only(bottom: AppSpacing.sm),
            padding: const EdgeInsets.all(AppSpacing.sm),
            decoration: const BoxDecoration(
              color: AppColors.primaryLight,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.smart_toy,
              color: AppColors.primary,
              size: 20,
            ),
          ),
          const SizedBox(width: AppSpacing.sm),
        ] else
          const SizedBox(width: 48),

        Expanded(
          child: Container(
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
              boxShadow: [
                BoxShadow(
                  color: AppColors.shadowColor.withValues(alpha: 0.05),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
                child: Container(
                  padding: const EdgeInsets.all(AppSpacing.md),
                  color: isUser
                      ? AppColors.primary.withValues(alpha: 0.85)
                      : AppColors.surface.withValues(alpha: 0.85),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      if (imagePath != null)
                        ChatBubbleImage(imagePath: imagePath!),
                      if (filePath != null)
                        ChatBubbleFile(filePath: filePath!, isUser: isUser),
                      if (isLoading)
                        const ChatBubbleLoader()
                      else
                        ChatBubbleText(text: text, isUser: isUser),
                      const SizedBox(height: AppSpacing.xs),
                      Align(
                        alignment: Alignment.bottomRight,
                        child: Text(
                          time,
                          style: TextStyle(
                            fontSize: 10,
                            color: isUser
                                ? AppColors.textOnPrimary
                                : AppColors.textSecondary,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),

        if (isUser) ...[
          const SizedBox(width: AppSpacing.sm),
          Container(
            margin: const EdgeInsets.only(bottom: AppSpacing.sm),
            width: 36,
            height: 36,
            decoration: const BoxDecoration(
              color: AppColors.primary,
              shape: BoxShape.circle,
            ),
            child: const Icon(
              Icons.person,
              color: AppColors.textOnPrimary,
              size: 20,
            ),
          ),
        ] else
          const SizedBox(width: 48),
      ],
    );
  }
}
