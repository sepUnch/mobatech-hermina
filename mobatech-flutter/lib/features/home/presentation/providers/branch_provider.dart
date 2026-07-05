import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/network/dio_client.dart';
import '../../data/models/branch.dart';

final branchProvider = FutureProvider<List<Branch>>((ref) async {
  final dio = ref.watch(dioProvider);
  final response = await dio.get(
    '/branches',
    queryParameters: {'page': 1, 'limit': 10},
  );

  if (response.statusCode == 200) {
    final responseData = response.data;
    final List<dynamic> data = responseData is Map && responseData.containsKey('data')
        ? responseData['data']
        : (responseData as List? ?? []);
    return data.map((json) => Branch.fromJson(json)).toList();
  } else {
    throw Exception('Failed to load branches');
  }
});
