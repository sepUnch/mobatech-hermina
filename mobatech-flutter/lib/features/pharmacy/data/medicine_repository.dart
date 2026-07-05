import 'package:dio/dio.dart';
import '../models/medicine_category.dart';
import '../models/medicine.dart';

class MedicineRepository {
  final Dio _dio;

  MedicineRepository(this._dio);

  Future<List<MedicineCategory>> getCategories({int page = 1, int limit = 10}) async {
    final response = await _dio.get(
      '/pharmacy/categories',
      queryParameters: {'page': page, 'limit': limit},
    );
    final responseData = response.data;
    final List<dynamic> data = responseData is Map && responseData.containsKey('data')
        ? responseData['data']
        : (responseData as List? ?? []);
    return data.map((e) => MedicineCategory.fromJson(e)).toList();
  }

  Future<List<Medicine>> getMedicines({int? categoryId, String? search, int page = 1, int limit = 10}) async {
    final response = await _dio.get(
      '/pharmacy/medicines',
      queryParameters: {
        if (categoryId != null) 'category_id': categoryId,
        if (search != null && search.isNotEmpty) 'search': search,
        'page': page,
        'limit': limit,
      },
    );
    final responseData = response.data;
    final List<dynamic> data = responseData is Map && responseData.containsKey('data')
        ? responseData['data']
        : (responseData as List? ?? []);
    return data.map((e) => Medicine.fromJson(e)).toList();
  }
}
