import 'package:flutter/material.dart';
import 'package:mobatech_app/core/theme/app_colors.dart';


enum AppButtonVariant { primary, secondary, danger, ghost, outline }
enum AppButtonSize { small, medium, large }

class AppButton extends StatelessWidget {
  final String text;
  final VoidCallback? onPressed;
  final AppButtonVariant variant;
  final AppButtonSize size;
  final bool isLoading;
  final Widget? icon;
  final bool isFullWidth;

  const AppButton({
    super.key,
    required this.text,
    this.onPressed,
    this.variant = AppButtonVariant.primary,
    this.size = AppButtonSize.medium,
    this.isLoading = false,
    this.icon,
    this.isFullWidth = false,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    Color bgColor;
    Color fgColor;
    Color borderColor = AppColors.transparent;
    
    switch (variant) {
      case AppButtonVariant.primary:
        bgColor = AppColors.primaryGreen;
        fgColor = AppColors.backgroundWhite;
        break;
      case AppButtonVariant.secondary:
        bgColor = isDark ? AppColors.backgroundWhite.withValues(alpha: 0.1) : AppColors.backgroundWhite.withValues(alpha: 0.5);
        fgColor = AppColors.getTextPrimary(isDark);
        borderColor = AppColors.getGlassBorder(isDark);
        break;
      case AppButtonVariant.danger:
        bgColor = AppColors.errorRed.withValues(alpha: 0.1);
        fgColor = AppColors.errorRed;
        borderColor = AppColors.errorRed.withValues(alpha: 0.2);
        break;
      case AppButtonVariant.ghost:
        bgColor = AppColors.transparent;
        fgColor = AppColors.getTextPrimary(isDark).withValues(alpha: 0.8);
        break;
      case AppButtonVariant.outline:
        bgColor = AppColors.transparent;
        fgColor = AppColors.primaryGreen;
        borderColor = AppColors.primaryGreen.withValues(alpha: 0.5);
        break;
    }

    double height;
    double fontSize;
    EdgeInsets padding;
    
    switch (size) {
      case AppButtonSize.small:
        height = 40;
        fontSize = 13;
        padding = const EdgeInsets.symmetric(horizontal: 14);
        break;
      case AppButtonSize.medium:
        height = 48;
        fontSize = 15;
        padding = const EdgeInsets.symmetric(horizontal: 20);
        break;
      case AppButtonSize.large:
        height = 56;
        fontSize = 16;
        padding = const EdgeInsets.symmetric(horizontal: 24);
        break;
    }

    final buttonStyle = ElevatedButton.styleFrom(
      backgroundColor: bgColor,
      foregroundColor: fgColor,
      elevation: variant == AppButtonVariant.primary ? 2 : 0,
      shadowColor: variant == AppButtonVariant.primary ? AppColors.primaryGreen.withValues(alpha: 0.4) : AppColors.transparent,
      padding: padding,
      minimumSize: Size(isFullWidth ? double.infinity : 0, height),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: borderColor),
      ),
    );

    Widget content = isLoading 
      ? SizedBox(
          width: fontSize, 
          height: fontSize, 
          child: CircularProgressIndicator(strokeWidth: 2, color: fgColor)
        )
      : Row(
          mainAxisSize: isFullWidth ? MainAxisSize.max : MainAxisSize.min,
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            if (icon != null) ...[
              IconTheme(data: IconThemeData(color: fgColor, size: fontSize + 4), child: icon!),
              const SizedBox(width: 8),
            ],
            Text(
              text, 
              style: TextStyle(
                color: fgColor, 
                fontWeight: FontWeight.w600,
                fontSize: fontSize,
              )
            ),
          ],
        );

    return ElevatedButton(
      onPressed: isLoading ? null : onPressed,
      style: buttonStyle,
      child: content,
    );
  }
}
