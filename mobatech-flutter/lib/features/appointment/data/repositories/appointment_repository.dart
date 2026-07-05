import 'package:dio/dio.dart';
import '../models/doctor.dart';
import '../models/doctor_schedule.dart';
import '../models/appointment.dart';

class AppointmentRepository {
  final Dio _dio;

  AppointmentRepository(this._dio);

  Future<(List<Doctor>, bool)> getDoctors({
    String? specialization,
    int? polyclinicId,
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final Map<String, dynamic> params = {
        'page': page,
        'limit': limit,
      };
      if (specialization != null && specialization.isNotEmpty && specialization != 'All') {
        params['specialization'] = specialization;
      }
      if (polyclinicId != null && polyclinicId > 0) {
        params['polyclinic_id'] = polyclinicId.toString();
      }
      final response = await _dio.get(
        '/doctors',
        queryParameters: params,
      );
      
      final dynamic responseData = response.data;
      final dataList = responseData is Map && responseData.containsKey('data')
          ? responseData['data'] as List<dynamic>? ?? []
          : (responseData as List<dynamic>? ?? []);
      final meta = responseData is Map && responseData.containsKey('meta')
          ? responseData['meta'] as Map<String, dynamic>?
          : response.extra['meta'] as Map<String, dynamic>?;
      
      final doctors = dataList.map((json) => Doctor.fromJson(json)).toList();
      final currentPage = meta?['current_page'] as int? ?? 1;
      final totalPages = meta?['total_pages'] as int? ?? 1;
      
      return (doctors, currentPage < totalPages);
    } catch (e) {
      rethrow;
    }
  }

  Future<Doctor> getDoctorById(int id) async {
    try {
      final response = await _dio.get('/doctors/$id');
      return Doctor.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<List<DoctorSchedule>> getDoctorSchedules(int id) async {
    try {
      final response = await _dio.get('/doctors/$id/schedules');
      final List<dynamic> data = response.data ?? [];
      return data.map((json) => DoctorSchedule.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<(List<Appointment>, bool)> getUserAppointments({
    int page = 1,
    int limit = 10,
  }) async {
    try {
      final response = await _dio.get(
        '/appointments',
        queryParameters: {'page': page, 'limit': limit},
      );
      
      final dynamic responseData = response.data;
      final dataList = responseData is Map && responseData.containsKey('data')
          ? responseData['data'] as List<dynamic>? ?? []
          : (responseData as List<dynamic>? ?? []);
      final meta = responseData is Map && responseData.containsKey('meta')
          ? responseData['meta'] as Map<String, dynamic>?
          : response.extra['meta'] as Map<String, dynamic>?;
      
      final appointments = dataList.map((json) => Appointment.fromJson(json)).toList();
      final currentPage = meta?['current_page'] as int? ?? 1;
      final totalPages = meta?['total_pages'] as int? ?? 1;
      
      return (appointments, currentPage < totalPages);
    } catch (e) {
      rethrow;
    }
  }

  Future<Appointment> bookAppointment(int scheduleId, String symptoms) async {
    try {
      final response = await _dio.post(
        '/appointments',
        data: {'doctor_schedule_id': scheduleId, 'notes': symptoms},
      );
      return Appointment.fromJson(response.data);
    } catch (e) {
      rethrow;
    }
  }

  Future<void> cancelAppointment(int id) async {
    try {
      await _dio.post('/appointments/$id/cancel');
    } catch (e) {
      rethrow;
    }
  }
}
