import 'package:flutter/material.dart';

class AppColors {
  // Primary — Hermina Green Identity
  static const Color primary = Color(0xFF1E5E44);
  static const Color primaryDark = Color(0xFF113C2B);
  static const Color primaryLight = Color(0xFFE8F5E9);

  // Surface & Background
  static const Color background = Color(0xFFF5F7FA);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color surfaceVariant = Color(0xFFF0F2F5);

  // Text — High Contrast
  static const Color textPrimary = Color(0xFF1A1A1A);
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textTertiary = Color(0xFF9CA3AF);
  static const Color textOnPrimary = Color(0xFFFFFFFF);
  static const Color textOnPrimaryMuted = Color(0xCCFFFFFF);

  // Borders & Dividers
  static const Color border = Color(0xFFE5E7EB);
  static const Color borderFocused = primary;
  static const Color divider = Color(0xFFF3F4F6);

  // Status
  static const Color success = Color(0xFF16A34A);
  static const Color successLight = Color(0xFFDCFCE7);
  static const Color error = Color(0xFFDC2626);
  static const Color errorLight = Color(0xFFFEE2E2);
  static const Color warning = Color(0xFFF59E0B);
  static const Color warningLight = Color(0xFFFEF3C7);
  static const Color info = Color(0xFF2563EB);
  static const Color infoLight = Color(0xFFDBEAFE);

  // Interactive
  static const Color buttonDisabled = Color(0xFFD1D5DB);
  static const Color buttonDisabledText = Color(0xFF9CA3AF);

  // Shadows
  static Color shadowLight = Colors.black.withValues(alpha: 0.04);
  static Color shadowMedium = Colors.black.withValues(alpha: 0.08);

  // Specific — Emergency (dark theme)
  static const Color emergencyDark1 = Color(0xFF1A1A2E);
  static const Color emergencyDark2 = Color(0xFF16213E);
  static const Color ambulanceBlue = Color(0xFF1565C0);
  static const Color ambulanceBlueDark = Color(0xFF0D47A1);
  static const Color arrivedGreen1 = Color(0xFF1B5E20);
  static const Color arrivedGreen2 = Color(0xFF2E7D32);

  // Google Sign-In
  static const Color googleBlue = Color(0xFF4285F4);
  static const Color googleRed = Color(0xFFEA4335);
  static const Color googleYellow = Color(0xFFFBBC05);
  static const Color googleGreen = Color(0xFF34A853);

  // Legacy aliases (backward compatibility)
  static const Color primaryGreen = primary;
  static const Color backgroundScreen = background;
  static const Color backgroundWhite = surface;
  static const Color backgroundLightGrey = surfaceVariant;
  static const Color textDark = textPrimary;
  static const Color textGrey = textSecondary;
  static const Color textLightGrey = textTertiary;
  static const Color textWhite = textOnPrimary;
  static const Color textWhite70 = textOnPrimaryMuted;
  static const Color borderGrey = border;
  static const Color dividerGrey = divider;
  static const Color iconGrey = textSecondary;
  static const Color iconLightGrey = border;
  static const Color errorRed = error;
  static const Color successGreen = success;
  static const Color warningYellow = warning;
  static const Color agendaHeader = Color(0xFF265A8E);
  static const Color agendaBackground = Color(0xFFFDF7E7);
  static const Color assistantBackground = Color(0xFFF0F4FD);
  static const Color assistantIconColor = Color(0xFF4F7396);
  static const Color assistantBorder = Color(0xFFE3EAFC);
  static const Color backgroundWave = Color(0xFFBAC8EE);
  static const Color transparent = Colors.transparent;
  static const Color iconOrange = Colors.orange;
  static const Color iconBlue = Colors.blue;
  static const Color iconGreen = Colors.green;
  static const Color warningOrange = Colors.orange;
  static Color warningLight2 = Colors.orange.withValues(alpha: 0.1);
  static Color shadowColor = shadowLight;
  static Color overlayWhite20 = surface.withValues(alpha: 0.2);
  static Color overlayPrimary15 = primary.withValues(alpha: 0.15);
  static Color black10 = Colors.black.withValues(alpha: 0.1);
  static Color white85 = surface.withValues(alpha: 0.85);
  static Color white50 = surface.withValues(alpha: 0.5);
  static Color grey20 = Colors.grey.withValues(alpha: 0.2);
  static Color primary85 = primary.withValues(alpha: 0.85);
  static Color orange10 = Colors.orange.withValues(alpha: 0.1);
  static Color iconWhite30 = Colors.white30;

  static Color getGlassBackground(bool isDark) =>
      isDark ? surface.withValues(alpha: 0.05) : surface.withValues(alpha: 0.7);

  static Color getGlassBorder(bool isDark) =>
      isDark ? surface.withValues(alpha: 0.1) : Colors.black.withValues(alpha: 0.1);

  static Color getTextPrimary(bool isDark) =>
      isDark ? surface : textPrimary;

  static Color getTextSecondary(bool isDark) =>
      isDark ? Colors.white70 : textSecondary;
}
