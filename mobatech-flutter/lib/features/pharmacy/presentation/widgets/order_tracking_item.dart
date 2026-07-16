part of 'order_tracking_timeline.dart';

class _TimelineItem extends StatelessWidget {
  final String title;
  final String description;
  final String time;
  final bool isCompleted;
  final bool isLast;
  final bool isError;

  const _TimelineItem({
    required this.title,
    required this.description,
    required this.time,
    required this.isCompleted,
    required this.isLast,
    this.isError = false,
  });

  @override
  Widget build(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildIndicator(),
        const SizedBox(width: AppSpacing.md),
        _buildDetails(),
      ],
    );
  }

  Widget _buildIndicator() {
    return Column(
      children: [
        Container(
          width: 24,
          height: 24,
          decoration: BoxDecoration(
            color: isError
                ? AppColors.error
                : (isCompleted ? AppColors.primary : AppColors.surfaceVariant),
            shape: BoxShape.circle,
            border: Border.all(
              color: isError
                  ? AppColors.error
                  : (isCompleted ? AppColors.primary : AppColors.border),
              width: 2,
            ),
          ),
          child: isError
              ? const Icon(Icons.close,
                  size: 16, color: AppColors.textOnPrimary)
              : (isCompleted
                  ? const Icon(Icons.check,
                      size: 16, color: AppColors.textOnPrimary)
                  : null),
        ),
        if (!isLast)
          Container(
            width: 2,
            height: 50,
            color: isCompleted ? AppColors.primary : AppColors.border,
          ),
      ],
    );
  }

  Widget _buildDetails() {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: AppTypography.bodySmall.copyWith(
                  fontWeight: FontWeight.bold,
                  color: isError
                      ? AppColors.error
                      : (isCompleted
                          ? AppColors.textPrimary
                          : AppColors.textSecondary),
                ),
              ),
              Text(
                time,
                style: AppTypography.caption.copyWith(
                  color: isCompleted
                      ? AppColors.textSecondary
                      : AppColors.textTertiary,
                ),
              ),
            ],
          ),
          const SizedBox(height: AppSpacing.xs),
          Text(
            description,
            style: AppTypography.caption.copyWith(
              color: isCompleted
                  ? AppColors.textSecondary
                  : AppColors.textTertiary,
            ),
          ),
          const SizedBox(height: AppSpacing.xl),
        ],
      ),
    );
  }
}
