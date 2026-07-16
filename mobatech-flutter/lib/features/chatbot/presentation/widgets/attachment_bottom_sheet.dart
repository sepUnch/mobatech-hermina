import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_strings.dart';

class AttachmentBottomSheet extends StatelessWidget {
  final VoidCallback onPickGallery;
  final VoidCallback onPickCamera;
  final VoidCallback onPickDocument;

  const AttachmentBottomSheet({
    super.key,
    required this.onPickGallery,
    required this.onPickCamera,
    required this.onPickDocument,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(AppSpacing.lg),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.vertical(
            top: Radius.circular(AppSpacing.radiusXl)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.only(bottom: AppSpacing.lg),
            decoration: BoxDecoration(
              color: AppColors.border,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildOption(
                Icons.image,
                AppStrings.chatAttachmentGallery,
                AppColors.info,
                onPickGallery,
              ),
              _buildOption(
                Icons.camera_alt,
                AppStrings.chatAttachmentCamera,
                AppColors.success,
                onPickCamera,
              ),
              _buildOption(
                Icons.description,
                AppStrings.chatAttachmentDocument,
                AppColors.warning,
                onPickDocument,
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.md),
        ],
      ),
    );
  }

  Widget _buildOption(
    IconData icon,
    String label,
    Color color,
    VoidCallback onTap,
  ) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, color: color, size: 28),
          ),
          const SizedBox(height: AppSpacing.sm),
          Text(
            label,
            style: AppTypography.caption,
          ),
        ],
      ),
    );
  }
}
