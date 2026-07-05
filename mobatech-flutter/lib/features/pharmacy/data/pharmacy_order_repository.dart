import 'package:dio/dio.dart';
import '../models/pharmacy_order.dart';

class PharmacyOrderRepository {
  final Dio _dio;

  PharmacyOrderRepository(this._dio);

  Future<Map<String, dynamic>> createOrder(Map<String, dynamic> data) async {
    final response = await _dio.post('/pharmacy/orders', data: data);
    return response.data;
  }

  Future<List<PharmacyOrder>> getMyOrders({int page = 1, int limit = 10}) async {
    final response = await _dio.get(
      '/pharmacy/orders',
      queryParameters: {'page': page, 'limit': limit},
    );
    final responseData = response.data;
    final List<dynamic> data = responseData is Map && responseData.containsKey('data')
        ? responseData['data']
        : (responseData as List? ?? []);
    return data.map((e) => PharmacyOrder.fromJson(e)).toList();
  }
}
