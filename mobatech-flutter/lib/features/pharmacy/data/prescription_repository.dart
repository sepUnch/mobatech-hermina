import 'package:dio/dio.dart';
import '../models/prescription.dart';


class PrescriptionRepository {
  final Dio _dio;

  PrescriptionRepository(this._dio);

  Future<List<Prescription>> getMyPrescriptions({int page = 1, int limit = 10}) async {
    try {
      final response = await _dio.get(
        '/pharmacy/prescriptions',
        queryParameters: {'page': page, 'limit': limit},
      );
      final responseData = response.data;
      final List<dynamic> data = responseData is Map && responseData.containsKey('data')
          ? responseData['data']
          : (responseData as List? ?? []);
      return data.map((e) => Prescription.fromJson(e)).toList();
    } catch (e) {
      return [];
    }
  }

  Future<void> deletePrescription(int id) async {
    await _dio.delete('/pharmacy/prescriptions/$id');
  }
}
