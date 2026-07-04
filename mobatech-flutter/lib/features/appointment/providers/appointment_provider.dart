import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../data/repositories/appointment_repository.dart';
import '../data/models/doctor.dart';
import '../data/models/doctor_schedule.dart';
import '../data/models/appointment.dart';

final appointmentRepositoryProvider = Provider((ref) {
  return AppointmentRepository(ref.watch(dioProvider));
});

final selectedPolyclinicIdProvider = StateProvider<int?>((ref) => null);

final searchQueryProvider = StateProvider<String>((ref) => '');

enum DoctorSortOption { nameAsc, nameDesc }

final doctorSortProvider = StateProvider<DoctorSortOption>(
  (ref) => DoctorSortOption.nameAsc,
);

class DoctorsNotifier extends AutoDisposeAsyncNotifier<List<Doctor>> {
  int _page = 1;
  bool _hasMore = true;
  bool _isFetchingNextPage = false;

  bool get hasMore => _hasMore;
  bool get isFetchingNextPage => _isFetchingNextPage;

  @override
  FutureOr<List<Doctor>> build() async {
    _page = 1;
    _hasMore = true;
    _isFetchingNextPage = false;
    
    final repository = ref.watch(appointmentRepositoryProvider);
    final polyclinicId = ref.watch(selectedPolyclinicIdProvider);
    
    final (newDoctors, hasMoreData) = await repository.getDoctors(
      polyclinicId: polyclinicId,
      page: 1,
      limit: 10,
    );
    
    _hasMore = hasMoreData;
    return newDoctors;
  }

  Future<void> fetchNextPage() async {
    if (_isFetchingNextPage || !_hasMore) return;
    
    _isFetchingNextPage = true;
    // Trigger rebuild to update UI loaders
    state = AsyncData(state.value ?? []);
    
    try {
      final repository = ref.read(appointmentRepositoryProvider);
      final polyclinicId = ref.read(selectedPolyclinicIdProvider);
      
      final (newDoctors, hasMoreData) = await repository.getDoctors(
        polyclinicId: polyclinicId,
        page: _page + 1,
        limit: 10,
      );
      
      _page++;
      _hasMore = hasMoreData;
      
      final currentDoctors = state.value ?? [];
      state = AsyncData([...currentDoctors, ...newDoctors]);
    } catch (e) {
      state = AsyncData(state.value ?? []);
    } finally {
      _isFetchingNextPage = false;
    }
  }
}

final doctorsProvider = AsyncNotifierProvider.autoDispose<DoctorsNotifier, List<Doctor>>(
  DoctorsNotifier.new,
);

final filteredDoctorsProvider = Provider<AsyncValue<List<Doctor>>>((ref) {
  final doctorsAsync = ref.watch(doctorsProvider);
  final query = ref.watch(searchQueryProvider).toLowerCase();
  final sortOption = ref.watch(doctorSortProvider);

  return doctorsAsync.whenData((doctors) {
    var filtered = List<Doctor>.from(doctors);
    if (query.isNotEmpty) {
      filtered = doctors
          .where(
            (doc) =>
                doc.name.toLowerCase().contains(query) ||
                doc.specialization.toLowerCase().contains(query),
          )
          .toList();
    }

    if (sortOption == DoctorSortOption.nameAsc) {
      filtered.sort((a, b) => a.name.compareTo(b.name));
    } else if (sortOption == DoctorSortOption.nameDesc) {
      filtered.sort((a, b) => b.name.compareTo(a.name));
    }

    return filtered;
  });
});

final doctorDetailProvider = FutureProvider.family<Doctor, int>((ref, id) {
  final repository = ref.watch(appointmentRepositoryProvider);
  return repository.getDoctorById(id);
});

final doctorSchedulesProvider =
    FutureProvider.family<List<DoctorSchedule>, int>((ref, doctorId) {
      final repository = ref.watch(appointmentRepositoryProvider);
      return repository.getDoctorSchedules(doctorId);
    });

class UserAppointmentsNotifier extends AutoDisposeAsyncNotifier<List<Appointment>> {
  int _page = 1;
  bool _hasMore = true;
  bool _isFetchingNextPage = false;

  bool get hasMore => _hasMore;
  bool get isFetchingNextPage => _isFetchingNextPage;

  @override
  FutureOr<List<Appointment>> build() async {
    _page = 1;
    _hasMore = true;
    _isFetchingNextPage = false;
    
    final repository = ref.watch(appointmentRepositoryProvider);
    final (newAppointments, hasMoreData) = await repository.getUserAppointments(
      page: 1,
      limit: 10,
    );
    
    _hasMore = hasMoreData;
    return newAppointments;
  }

  Future<void> fetchNextPage() async {
    if (_isFetchingNextPage || !_hasMore) return;
    
    _isFetchingNextPage = true;
    state = AsyncData(state.value ?? []);
    
    try {
      final repository = ref.read(appointmentRepositoryProvider);
      
      final (newAppointments, hasMoreData) = await repository.getUserAppointments(
        page: _page + 1,
        limit: 10,
      );
      
      _page++;
      _hasMore = hasMoreData;
      
      final currentAppointments = state.value ?? [];
      state = AsyncData([...currentAppointments, ...newAppointments]);
    } catch (e) {
      state = AsyncData(state.value ?? []);
    } finally {
      _isFetchingNextPage = false;
    }
  }
}

final userAppointmentsProvider = AsyncNotifierProvider.autoDispose<UserAppointmentsNotifier, List<Appointment>>(
  UserAppointmentsNotifier.new,
);
