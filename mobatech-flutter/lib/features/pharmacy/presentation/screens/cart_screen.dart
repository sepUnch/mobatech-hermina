import '../../../../core/constants/app_strings.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/app_card.dart';
import '../../../../core/widgets/app_button.dart';
import '../../providers/pharmacy_provider.dart';

part 'cart_screen_widgets.dart';
part 'cart_bottom_bar.dart';

class CartScreen extends ConsumerWidget {
  const CartScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final cartAsync = ref.watch(cartProvider);

    return Scaffold(
      backgroundColor: AppColors.surface,
      body: cartAsync.when(
        data: (cart) => CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
            SliverAppBar(
              expandedHeight: 40,
              pinned: true,
              backgroundColor: AppColors.primary,
              iconTheme: const IconThemeData(color: AppColors.textOnPrimary),
              centerTitle: true,
              shape: const RoundedRectangleBorder(
                borderRadius: BorderRadius.vertical(bottom: Radius.circular(AppSpacing.radiusXl)),
              ),
              title: Text(
                AppStrings.extKeranjang,
                style: AppTypography.h3.copyWith(
                  color: AppColors.textOnPrimary,
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
        loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primary)),
        error: (err, stack) =>
             Center(child: Text(AppStrings.extGagalmemuatkeranjang, style: AppTypography.body)),
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
