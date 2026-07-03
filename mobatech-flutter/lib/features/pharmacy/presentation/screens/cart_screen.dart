import '../../../../core/constants/app_strings.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../providers/pharmacy_provider.dart';

part 'cart_screen_widgets.dart';
part 'cart_bottom_bar.dart';

class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cartAsync = ref.watch(cartProvider);

    return Scaffold(
      backgroundColor: AppColors.backgroundLightGrey,
      body: cartAsync.when(
        data: (cart) => CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
            SliverAppBar(
              expandedHeight: 40,
              pinned: true,
              backgroundColor: AppColors.primary,
              iconTheme: const IconThemeData(color: AppColors.textWhite),
              centerTitle: true,
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.vertical(bottom: Radius.circular(24)),
              ),
              title: const Text(
                AppStrings.extKeranjang,
                style: TextStyle(
                  color: AppColors.textWhite,
                  fontWeight: FontWeight.bold,
                ),
              ),
              flexibleSpace: FlexibleSpaceBar(
                background: Stack(
                  children: [
                    Positioned(
                      right: -20,
                      top: 0,
                      child: Opacity(
                        opacity: 0.2,
                        child: Image.asset('assets/header_logo.png', width: 150),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            _CartItemList(cart: cart),
          ],
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) =>
            const Center(child: Text(AppStrings.extGagalmemuatkeranjang)),
      ),
      bottomNavigationBar: cartAsync.whenOrNull(
        data: (cart) {
          if (cart.items.isEmpty) return null;
          return _CartBottomBar(cart: cart);
        },
      ),
    );
  }
}

