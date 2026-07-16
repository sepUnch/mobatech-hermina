import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/skeleton_loader.dart';

class ChatBubbleImage extends StatelessWidget {
  final String imagePath;

  const ChatBubbleImage({super.key, required this.imagePath});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: AppSpacing.sm),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
        child: Image.file(File(imagePath), fit: BoxFit.cover),
      ),
    );
  }
}

class ChatBubbleFile extends StatelessWidget {
  final String filePath;
  final bool isUser;

  const ChatBubbleFile({
    super.key,
    required this.filePath,
    required this.isUser,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      padding: const EdgeInsets.all(AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface.withValues(alpha: 0.2),
        borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
        border: Border.all(
          color: isUser ? AppColors.iconWhite30 : AppColors.border,
        ),
      ),
      child: Row(
        children: [
          Icon(Icons.description,
              color: isUser ? AppColors.textOnPrimary : AppColors.primary),
          const SizedBox(width: AppSpacing.sm),
          Expanded(
            child: Text(
              filePath.split('/').last,
              style: AppTypography.caption.copyWith(
                color: isUser ? AppColors.textOnPrimary : AppColors.textPrimary,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class ChatBubbleLoader extends StatelessWidget {
  const ChatBubbleLoader({super.key});

  @override
  Widget build(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        SkeletonLoader(
          height: 14,
          width: 200,
          margin: EdgeInsets.only(bottom: AppSpacing.sm),
        ),
        SkeletonLoader(
          height: 14,
          width: 150,
          margin: EdgeInsets.only(bottom: AppSpacing.sm),
        ),
        SkeletonLoader(height: 14, width: 180),
      ],
    );
  }
}

class ChatBubbleText extends StatelessWidget {
  final String text;
  final bool isUser;

  const ChatBubbleText({super.key, required this.text, required this.isUser});

  @override
  Widget build(BuildContext context) {
    if (text.isEmpty) return const SizedBox.shrink();
    if (isUser) {
      return Text(
        text,
        style: AppTypography.bodySmall.copyWith(
          color: AppColors.textOnPrimary,
        ),
      );
    }
    return MarkdownBody(
      data: text,
      styleSheet: MarkdownStyleSheet(
        p: AppTypography.bodySmall.copyWith(
          color: AppColors.textPrimary,
          fontWeight: FontWeight.w500,
        ),
        pPadding: const EdgeInsets.only(bottom: AppSpacing.sm),
        listBullet: const TextStyle(color: AppColors.textPrimary),
        listBulletPadding: const EdgeInsets.only(right: AppSpacing.sm),
        strong: AppTypography.bodySmall.copyWith(
          color: AppColors.textPrimary,
          fontWeight: FontWeight.bold,
        ),
        blockSpacing: 12.0,
      ),
    );
  }
}
