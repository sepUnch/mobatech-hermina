import '../constants/app_strings.dart';

class Validators {
  static String? validateRequired(String? value, String fieldName) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName ${AppStrings.requiredField.toLowerCase()}';
    }
    return null;
  }

  static String? validateName(String? value, String fieldName) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName ${AppStrings.requiredField.toLowerCase()}';
    }
    final nameRegex = RegExp(r"^[a-zA-Z\s\.,'-]+$");
    if (!nameRegex.hasMatch(value.trim())) {
      return AppStrings.errInvalidName;
    }
    return null;
  }

  static String? validateEmail(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppStrings.requiredField;
    }
    final emailRegex = RegExp(
      r"^[^\s@]+@[^\s@]+\.(com|id|co\.id|net|org|ac\.id|go\.id|sch\.id)$",
      caseSensitive: false,
    );
    if (!emailRegex.hasMatch(value.trim())) {
      return AppStrings.errInvalidEmailDomain;
    }
    return null;
  }

  static String? validatePhone(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppStrings.requiredField;
    }
    final digits = value.replaceAll(RegExp(r'\D'), '');
    if (digits.length < 7 || digits.length > 12) {
      return AppStrings.errInvalidPhone;
    }
    return null;
  }

  static String? validatePassword(String? value) {
    if (value == null || value.trim().isEmpty) {
      return AppStrings.requiredField;
    }
    final passwordRegex = RegExp(r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$');
    if (!passwordRegex.hasMatch(value)) {
      return AppStrings.errWeakPassword;
    }
    return null;
  }

  static String? validateConfirmPassword(
    String? value,
    String originalPassword,
  ) {
    if (value == null || value.trim().isEmpty) {
      return AppStrings.requiredField;
    }
    if (value != originalPassword) {
      return AppStrings.errPasswordMismatch;
    }
    return null;
  }
}
