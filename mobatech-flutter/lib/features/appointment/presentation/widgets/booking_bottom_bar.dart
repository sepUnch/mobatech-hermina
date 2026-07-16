import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/app_button.dart';

class BookingBottomBar extends StatelessWidget {
  final bool isBooking;
  final VoidCallback onBook;

  const BookingBottomBar({
    super.key,
    required this.isBooking,
    required this.onBook,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 800),
        child: Container(
          padding: const EdgeInsets.all(AppSpacing.pagePadding),
          decoration: BoxDecoration(
            color: AppColors.surface,
            boxShadow: [
              BoxShadow(
                color: AppColors.shadowColor.withValues(alpha: 0.05),
                blurRadius: 10,
                offset: const Offset(0, -4),
              ),
            ],
          ),
          child: SafeArea(
            child: AppButton(
              text: 'Buat Janji Temu',
              onPressed: isBooking ? null : onBook,
              isLoading: isBooking,
              isFullWidth: true,
              size: AppButtonSize.large,
            ),
          ),
        ),
      ),
    );
  }
}
