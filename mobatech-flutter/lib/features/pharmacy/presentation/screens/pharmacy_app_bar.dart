part of 'pharmacy_main_screen.dart';

class _PharmacyAppBar extends StatelessWidget {
  final int cartItemCount;
  final TabController tabController;

  const _PharmacyAppBar({
    required this.cartItemCount,
    required this.tabController,
  });

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(
      expandedHeight: 120,
      pinned: true,
      backgroundColor: AppColors.primary,
      iconTheme: const IconThemeData(color: AppColors.textOnPrimary),
      centerTitle: true,
      title: Text(
        AppStrings.pharmacyTitle,
        style: AppTypography.h3.copyWith(
          color: AppColors.textOnPrimary,
        ),
      ),
      actions: [
        _buildCartAction(context),
        const SizedBox(width: AppSpacing.sm),
      ],
      flexibleSpace: _buildFlexibleSpace(),
      bottom: _buildTabBar(),
    );
  }

  Widget _buildCartAction(BuildContext context) {
    return Stack(
      alignment: Alignment.center,
      children: [
        IconButton(
          icon: const Icon(Icons.shopping_cart_outlined,
              color: AppColors.textOnPrimary),
          onPressed: () => context.push('/pharmacy/cart'),
        ),
        if (cartItemCount > 0)
          Positioned(
            right: 8,
            top: 8,
            child: Container(
              padding: const EdgeInsets.all(4),
              decoration: const BoxDecoration(
                color: AppColors.error,
                shape: BoxShape.circle,
              ),
              child: Text(
                '$cartItemCount',
                style: AppTypography.caption.copyWith(
                  color: AppColors.textOnPrimary,
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
      ],
    );
  }

  Widget _buildFlexibleSpace() {
    return FlexibleSpaceBar(
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
    );
  }

  PreferredSizeWidget _buildTabBar() {
    return PreferredSize(
      preferredSize: const Size.fromHeight(48),
      child: Container(
        decoration: const BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.only(
            topLeft: Radius.circular(AppSpacing.radiusXl),
            topRight: Radius.circular(AppSpacing.radiusXl),
          ),
        ),
        child: TabBar(
          controller: tabController,
          labelColor: AppColors.primary,
          unselectedLabelColor: AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          indicatorWeight: 3,
          labelStyle: AppTypography.label,
          unselectedLabelStyle: AppTypography.label,
          tabs: const [
            Tab(text: AppStrings.catalogTab),
            Tab(text: AppStrings.ePrescriptionTab),
            Tab(text: AppStrings.ordersTab),
          ],
        ),
      ),
    );
  }
}
