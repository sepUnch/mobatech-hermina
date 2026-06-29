import 'package:dio/dio.dart';
import '../models/cart.dart';

class CartRepository {
  final Dio _dio;

  CartRepository(this._dio);

  Future<Cart> getCart() async {
    final response = await _dio.get('/pharmacy/cart');
    return Cart.fromJson(response.data);
  }

  Future<void> addToCart(int medicineId, int quantity) async {
    await _dio.post(
      '/pharmacy/cart',
      data: {'medicine_id': medicineId, 'quantity': quantity},
    );
  }

  Future<void> updateCartItem(int cartItemId, int quantity) async {
    await _dio.put(
      '/pharmacy/cart/$cartItemId',
      data: {'quantity': quantity},
    );
  }

  Future<void> removeFromCart(int cartItemId) async {
    await _dio.delete('/pharmacy/cart/$cartItemId');
  }
}
