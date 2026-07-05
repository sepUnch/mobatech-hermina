import 'package:dio/dio.dart';
import '../models/polyclinic.dart';

class PolyclinicRepository {
  final Dio _dio;

  PolyclinicRepository(this._dio);

  Future<List<Polyclinic>> getPolyclinics({int page = 1, int limit = 10}) async {
    try {
      final response = await _dio.get(
        '/polyclinics',
        queryParameters: {'page': page, 'limit': limit},
      );
      final responseData = response.data;
      final List<dynamic> data = responseData is Map && responseData.containsKey('data')
          ? responseData['data']
          : (responseData as List? ?? []);
      return data.map((json) => Polyclinic.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<Polyclinic> getPolyclinicById(int id) async {
    try {
      final response = await _dio.get('/polyclinics/$id');
      return Polyclinic.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }
}
