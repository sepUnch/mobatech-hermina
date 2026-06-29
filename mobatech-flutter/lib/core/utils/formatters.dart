import 'package:flutter/services.dart';

import 'package:intl/intl.dart';

class Formatters {
  static String formatDate(DateTime date, {String format = 'dd MMM yyyy'}) {
    return DateFormat(format).format(date);
  }

  static String getDayOfWeekID(DateTime d) => ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'][d.weekday-1];
  
  static String getMonthID(DateTime d) => ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'][d.month-1];

  static String formatDateID(DateTime d) => '${d.day} ${getMonthID(d)} ${d.year}';

  static String parseAndFormatDateID(String dateStr) {
    if (dateStr.isEmpty || dateStr == '-') return '-';
    try {
      final dt = DateTime.parse(dateStr);
      return formatDateID(dt);
    } catch (e) {
      return dateStr;
    }
  }

  static String formatPhoneNumber(String phone) {
    // Clean all non-digit characters except the leading plus
    String cleanPhone = phone.replaceAll(RegExp(r'[^\d+]'), '');

    // If it doesn't start with +62, but starts with 0 or 62, normalize it to +62
    if (!cleanPhone.startsWith('+62')) {
      if (cleanPhone.startsWith('62')) {
        cleanPhone = '+62${cleanPhone.substring(2)}';
      } else if (cleanPhone.startsWith('0')) {
        cleanPhone = '+62${cleanPhone.substring(1)}';
      }
    }

    // Now format: +62 812-3456-7890
    if (cleanPhone.startsWith('+62')) {
      String localPart = cleanPhone.substring(3);
      if (localPart.length > 3) {
        String p1 = localPart.substring(0, 3); // 812
        String remainder = localPart.substring(3); // 34567890

        if (remainder.length > 4) {
          String p2 = remainder.substring(0, 4); // 3456
          String p3 = remainder.substring(4); // 7890
          return '+62 $p1-$p2-$p3';
        } else {
          return '+62 $p1-$remainder';
        }
      } else if (localPart.isNotEmpty) {
        return '+62 $localPart';
      }
    }
    return cleanPhone; // Fallback
  }
}

class PhonePrefixFormatter extends TextInputFormatter {
  @override
  TextEditingValue formatEditUpdate(
    TextEditingValue oldValue,
    TextEditingValue newValue,
  ) {
    String text = newValue.text.replaceAll(RegExp(r'[^\d+]'), '');

    if (text.startsWith('+62')) {
      text = text.substring(3);
    } else if (text.startsWith('62')) {
      text = text.substring(2);
    } else if (text.startsWith('0')) {
      text = text.substring(1);
    }

    text = text.replaceAll(RegExp(r'\D'), '');
    if (text.length > 12) text = text.substring(0, 12);

    final buf = StringBuffer();
    for (int i = 0; i < text.length; i++) {
      if (i == 3 || i == 7) buf.write('-');
      buf.write(text[i]);
    }

    final formatted = buf.toString();
    return newValue.copyWith(
      text: formatted,
      selection: TextSelection.collapsed(offset: formatted.length),
    );
  }
}
