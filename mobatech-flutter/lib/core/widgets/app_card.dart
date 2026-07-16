import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_shadows.dart';

class AppCard extends StatelessWidget {
  final Widget child;
  final EdgeInsetsGeometry? padding;
  final VoidCallback? onTap;
  final Color? backgroundColor;
  final double? borderRadius;
  final Color? borderColor;

  const AppCard({
    super.key,
    required this.child,
    this.padding,
    this.onTap,
    this.backgroundColor,
    this.borderRadius,
    this.borderColor,
  });

  @override
  Widget build(BuildContext context) {
    final card = Container(
      padding: padding ??
          const EdgeInsets.all(AppSpacing.cardPadding),
      decoration: BoxDecoration(
        color: backgroundColor ?? AppColors.surface,
        borderRadius: BorderRadius.circular(
          borderRadius ?? AppSpacing.radiusMd,
        ),
        border: Border.all(color: borderColor ?? AppColors.border, width: 1),
        boxShadow: AppShadows.card,
      ),
      child: child,
    );

    if (onTap != null) {
      return GestureDetector(onTap: onTap, child: card);
    }
    return card;
  }
}
