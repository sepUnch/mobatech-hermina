import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';

class AttachmentPreview extends StatelessWidget {
  final XFile? selectedImage;
  final FilePickerResult? selectedFile;
  final VoidCallback onRemove;

  const AttachmentPreview({
    super.key,
    this.selectedImage,
    this.selectedFile,
    required this.onRemove,
  });

  @override
  Widget build(BuildContext context) {
    if (selectedImage == null && selectedFile == null) {
      return const SizedBox.shrink();
    }

    return Container(
      margin: const EdgeInsets.only(bottom: AppSpacing.sm),
      padding: const EdgeInsets.all(AppSpacing.sm),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppSpacing.radiusLg),
        border: Border.all(color: AppColors.border),
      ),
      child: Row(
        children: [
          if (selectedImage != null)
            ClipRRect(
              borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
              child: Image.file(
                File(selectedImage!.path),
                width: 50,
                height: 50,
                fit: BoxFit.cover,
              ),
            )
          else if (selectedFile != null)
            Container(
              width: 50,
              height: 50,
              decoration: BoxDecoration(
                color: AppColors.warning.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
              ),
              child: const Icon(Icons.description, color: AppColors.warning),
            ),
          const SizedBox(width: AppSpacing.md),
          Expanded(
            child: Text(
              selectedImage?.name ?? selectedFile?.files.single.name ?? '',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: AppTypography.bodySmall.copyWith(
                fontWeight: FontWeight.w500,
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.close, color: AppColors.textSecondary),
            onPressed: onRemove,
          ),
        ],
      ),
    );
  }
}
