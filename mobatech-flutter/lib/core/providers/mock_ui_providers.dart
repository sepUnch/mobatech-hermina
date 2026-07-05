import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';

import '../../../../core/network/dio_client.dart';

class Article {
  final String title;
  final String category;
  final String readTime;
  final String content;

  Article(this.title, this.category, this.readTime, this.content);

  factory Article.fromJson(Map<String, dynamic> json) {
    return Article(
      json['title'] ?? '',
      json['category'] ?? '',
      json['readTime'] ?? '',
      json['content'] ?? 'Konten artikel belum tersedia.',
    );
  }
}

final forYouArticlesProvider = FutureProvider<List<Article>>((
  ref,
) async {
  final dio = ref.read(dioProvider);
  final response = await dio.get('/for-you/recommendations');
  final dynamic responseData = response.data;
  final List data = responseData is Map && responseData.containsKey('data')
      ? responseData['data']
      : responseData as List;
  return data.map((e) => Article.fromJson(e)).toList();
});

class PharmacyOrderMock {
  final String title;
  final String status;
  final String date;

  PharmacyOrderMock(this.title, this.status, this.date);
}

final pharmacyHistoryProvider =
    FutureProvider<List<PharmacyOrderMock>>((ref) async {
      final dio = ref.read(dioProvider);
      final response = await dio.get(
        '/pharmacy/orders',
        queryParameters: {'page': 1, 'limit': 10},
      );
      final dynamic responseData = response.data;
      final List data = responseData is Map && responseData.containsKey('data')
          ? responseData['data']
          : responseData as List;
      return data.map((e) {
        // e.g., e['order_number'], e['status'], e['CreatedAt']
        final dt = DateTime.parse(
          e['CreatedAt'] ?? DateTime.now().toIso8601String(),
        );
        final dateStr = "${dt.day}-${dt.month}-${dt.year}";
        return PharmacyOrderMock(
          'Pesanan Obat #${e['order_number']}',
          e['status'] ?? 'Pending',
          dateStr,
        );
      }).toList();
    });

class SpecialOffer {
  final String title;
  final String subtitle;
  final Color themeColor;

  SpecialOffer(this.title, this.subtitle, this.themeColor);
}

final specialOffersProvider = FutureProvider<List<SpecialOffer>>((ref) async {
  final dio = ref.read(dioProvider);
  final response = await dio.get(
    '/promos',
    queryParameters: {'page': 1, 'limit': 10},
  );
  final dynamic responseData = response.data;
  final List data = responseData is Map && responseData.containsKey('data') ? responseData['data'] : responseData as List;
  return data.map((e) {
    String colorStr = e['themeColor'] as String? ?? '';
    Color c = AppColors.primary;
    if (colorStr.isNotEmpty) {
      try {
        c = Color(int.parse(colorStr.replaceAll('#', '0xFF')));
      } catch (_) {}
    }
    return SpecialOffer(e['title'] ?? '', e['subtitle'] ?? '', c);
  }).toList();
});
