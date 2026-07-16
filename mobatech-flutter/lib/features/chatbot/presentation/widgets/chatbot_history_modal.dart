import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/utils/error_handler.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/widgets/skeleton_loader.dart';
import '../providers/chat_provider.dart';

class ChatbotHistoryModal extends ConsumerWidget {
  const ChatbotHistoryModal({super.key});

  void _showRenameDialog(BuildContext context, WidgetRef ref, int sessionId,
      String currentTitle) {
    final controller = TextEditingController(text: currentTitle);
    showDialog(
      context: context,
      builder: (ctx) => BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 5, sigmaY: 5),
        child: AlertDialog(
          backgroundColor: AppColors.surface.withValues(alpha: 0.9),
          shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(AppSpacing.radiusLg)),
          title: Text('Ubah Nama Percakapan', style: AppTypography.h4),
          content: TextField(
            controller: controller,
            decoration: const InputDecoration(
              hintText: 'Nama baru...',
              border: OutlineInputBorder(),
              focusedBorder: OutlineInputBorder(
                  borderSide: BorderSide(color: AppColors.primary)),
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: Text('Batal',
                  style:
                      AppTypography.label.copyWith(color: AppColors.textSecondary)),
            ),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.primary,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(AppSpacing.radiusSm)),
              ),
              onPressed: () {
                if (controller.text.trim().isNotEmpty) {
                  ref
                      .read(chatMessagesProvider.notifier)
                      .renameSession(sessionId, controller.text.trim());
                }
                Navigator.pop(ctx);
              },
              child: Text('Simpan',
                  style: AppTypography.label.copyWith(
                      color: AppColors.textOnPrimary)),
            ),
          ],
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final sessionsAsync = ref.watch(chatSessionsProvider);
    return BackdropFilter(
      filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
      child: Container(
        padding: const EdgeInsets.all(AppSpacing.lg),
        height: MediaQuery.of(context).size.height * 0.6,
        decoration: BoxDecoration(
          color: AppColors.surface.withValues(alpha: 0.85),
          borderRadius: const BorderRadius.vertical(
              top: Radius.circular(AppSpacing.radiusXl)),
          boxShadow: [
            BoxShadow(
              color: AppColors.shadowColor.withValues(alpha: 0.1),
              blurRadius: 20,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  AppStrings.chatHistoryTitle,
                  style: AppTypography.h3,
                ),
                IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.pop(context),
                ),
              ],
            ),
            const Divider(),
            Expanded(
              child: sessionsAsync.when(
                data: (sessions) {
                  if (sessions.isEmpty) {
                    return Center(
                      child: Text(
                        AppStrings.chatNoHistory,
                        style: AppTypography.body.copyWith(
                            color: AppColors.textSecondary),
                      ),
                    );
                  }
                  return ListView.builder(
                    itemCount: sessions.length,
                    itemBuilder: (context, index) {
                      final session = sessions[index];
                      return Card(
                        elevation: 0,
                        color: AppColors.transparent,
                        margin: const EdgeInsets.only(bottom: AppSpacing.sm),
                        shape: RoundedRectangleBorder(
                          borderRadius:
                              BorderRadius.circular(AppSpacing.radiusMd),
                          side: BorderSide(
                            color: AppColors.border,
                          ),
                        ),
                        child: Material(
                          color: AppColors.surface.withValues(alpha: 0.5),
                          borderRadius:
                              BorderRadius.circular(AppSpacing.radiusMd),
                          child: InkWell(
                            onTap: () {
                              ref
                                  .read(chatMessagesProvider.notifier)
                                  .loadSession(session['ID']);
                              Navigator.pop(context);
                            },
                            borderRadius:
                                BorderRadius.circular(AppSpacing.radiusMd),
                            child: ListTile(
                              contentPadding: const EdgeInsets.symmetric(
                                horizontal: AppSpacing.md,
                                vertical: AppSpacing.xs,
                              ),
                              leading: const CircleAvatar(
                                backgroundColor: AppColors.primaryLight,
                                child: Icon(
                                  Icons.chat_bubble_outline,
                                  color: AppColors.primary,
                                  size: 20,
                                ),
                              ),
                              title: Row(
                                children: [
                                  Expanded(
                                    child: Text(
                                      session['title'] ??
                                          AppStrings.chatNewConversation,
                                      maxLines: 1,
                                      overflow: TextOverflow.ellipsis,
                                      style: AppTypography.bodySmall.copyWith(
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ),
                                  Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      IconButton(
                                        icon: const Icon(
                                          Icons.edit_outlined,
                                          color: AppColors.primary,
                                          size: 20,
                                        ),
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 4),
                                        constraints: const BoxConstraints(),
                                        onPressed: () => _showRenameDialog(
                                          context,
                                          ref,
                                          session['ID'],
                                          session['title'] ??
                                              AppStrings.chatNewConversation,
                                        ),
                                      ),
                                      IconButton(
                                        icon: const Icon(
                                          Icons.delete_outline,
                                          color: AppColors.error,
                                          size: 20,
                                        ),
                                        padding: const EdgeInsets.symmetric(
                                            horizontal: 4),
                                        constraints: const BoxConstraints(),
                                        onPressed: () => ref
                                            .read(chatMessagesProvider.notifier)
                                            .deleteSession(session['ID']),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  );
                },
                loading: () => const CardSkeletonLoader(count: 3),
                error: (err, stack) => Center(
                    child: Text(ErrorHandler.getMessage(err),
                        style: AppTypography.bodySmall
                            .copyWith(color: AppColors.error))),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
