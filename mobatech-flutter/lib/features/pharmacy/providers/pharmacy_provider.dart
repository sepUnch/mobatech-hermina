import 'dart:async';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/network/dio_client.dart';
import '../data/medicine_repository.dart';
import '../data/prescription_repository.dart';
import '../data/pharmacy_order_repository.dart';
import '../data/cart_repository.dart';
import '../models/medicine_category.dart';
import '../models/medicine.dart';
import '../models/prescription.dart';
import '../models/pharmacy_order.dart';
import '../models/cart.dart';

final medicineRepositoryProvider = Provider<MedicineRepository>((ref) {
  return MedicineRepository(ref.watch(dioProvider));
});

final prescriptionRepositoryProvider = Provider<PrescriptionRepository>((ref) {
  return PrescriptionRepository(ref.watch(dioProvider));
});

final pharmacyOrderRepositoryProvider = Provider<PharmacyOrderRepository>((
  ref,
) {
  return PharmacyOrderRepository(ref.watch(dioProvider));
});

final cartRepositoryProvider = Provider<CartRepository>((ref) {
  return CartRepository(
    ref.watch(dioProvider),
  );
});

final categoriesProvider = FutureProvider<List<MedicineCategory>>((ref) async {
  final repo = ref.watch(medicineRepositoryProvider);
  return repo.getCategories(page: 1, limit: 10);
});

typedef MedicineFilter = ({int? categoryId, String? search});

final medicinesProvider = FutureProvider.family<List<Medicine>, MedicineFilter>((
  ref,
  filter,
) async {
  final repo = ref.watch(medicineRepositoryProvider);
  return repo.getMedicines(categoryId: filter.categoryId, search: filter.search, page: 1, limit: 10);
});

final prescriptionsProvider = FutureProvider<List<Prescription>>((ref) async {
  final repo = ref.watch(prescriptionRepositoryProvider);
  final timer = Timer(const Duration(seconds: 5), () {
    ref.invalidateSelf();
  });
  ref.onDispose(() => timer.cancel());
  return repo.getMyPrescriptions(page: 1, limit: 10);
});

final ordersProvider = FutureProvider<List<PharmacyOrder>>((ref) async {
  final repo = ref.watch(pharmacyOrderRepositoryProvider);
  final timer = Timer(const Duration(seconds: 5), () {
    ref.invalidateSelf();
  });
  ref.onDispose(() => timer.cancel());
  return repo.getMyOrders(page: 1, limit: 10);
});

class CartNotifier extends StateNotifier<AsyncValue<Cart>> {
  final CartRepository repository;

  CartNotifier(this.repository) : super(const AsyncValue.loading()) {
    fetchCart();
  }

  Future<void> fetchCart() async {
    try {
      state = const AsyncValue.loading();
      final cart = await repository.getCart();
      state = AsyncValue.data(cart);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> addToCart(int medicineId, int quantity) async {
    try {
      await repository.addToCart(medicineId, quantity);
      await fetchCart();
    } catch (e) {
      throw Exception('Failed to add to cart: $e');
    }
  }

  Future<void> updateCartItem(int cartItemId, int quantity) async {
    try {
      await repository.updateCartItem(cartItemId, quantity);
      await fetchCart();
    } catch (e) {
      throw Exception('Failed to update cart: $e');
    }
  }

  Future<void> removeFromCart(int cartItemId) async {
    try {
      await repository.removeFromCart(cartItemId);
      await fetchCart();
    } catch (e) {
      throw Exception('Failed to remove from cart: $e');
    }
  }
}

final cartProvider = StateNotifierProvider<CartNotifier, AsyncValue<Cart>>((
  ref,
) {
  final repo = ref.watch(cartRepositoryProvider);
  return CartNotifier(repo);
});
