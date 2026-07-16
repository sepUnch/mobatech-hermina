part of 'home_screen.dart';

class _HomeBody extends ConsumerWidget {
  const _HomeBody();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Center(
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 800),
        child: TweenAnimationBuilder<double>(
          tween: Tween(begin: 0.0, end: 1.0),
          duration: const Duration(milliseconds: 600),
          curve: Curves.easeOutCubic,
          builder: (context, value, child) {
            return Opacity(
              opacity: value,
              child: Transform.translate(
                offset: Offset(0, 30 * (1 - value)),
                child: child,
              ),
            );
          },
          child: RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(branchProvider);
              ref.invalidate(userAppointmentsProvider);
            },
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(
                parent: BouncingScrollPhysics(),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const HomeHeader(),
                  const SizedBox(height: AppSpacing.sm),
                  const QuickAccessGrid(),
                  const SizedBox(height: AppSpacing.lg),
                  const PromoBannerCarousel(),
                  const SizedBox(height: AppSpacing.xl),
                  _buildSectionTitle(AppStrings.sectionAgenda),
                  const _AgendaList(),
                  const SizedBox(height: AppSpacing.xl),
                  _buildSectionTitle(AppStrings.sectionAssistant),
                  const AssistantCard(),
                  const SizedBox(height: AppSpacing.xl),
                  _buildSectionTitle(AppStrings.sectionHospitals),
                  const _HospitalsList(),
                  const SizedBox(height: AppSpacing.xxl),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) => Padding(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePadding),
        child: Text(
          title,
          style: AppTypography.h3,
        ),
      );
}

class _AgendaList extends ConsumerWidget {
  const _AgendaList();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final appointmentsAsync = ref.watch(userAppointmentsProvider);

    return appointmentsAsync.when(
      data: (appointments) {
        if (appointments.isEmpty) {
          return Padding(
            padding: const EdgeInsets.all(AppSpacing.xxl),
            child: Center(
              child: Text(
                AppStrings.emptyAgenda,
                style: AppTypography.bodySmall,
              ),
            ),
          );
        }

        return ListView.builder(
          padding: EdgeInsets.zero,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: appointments.length > 2 ? 2 : appointments.length,
          itemBuilder: (context, index) =>
              AgendaCard(appointment: appointments[index]),
        );
      },
      loading: () => const Padding(
        padding: EdgeInsets.symmetric(
            horizontal: AppSpacing.pagePadding, vertical: AppSpacing.lg),
        child: CardSkeletonLoader(count: 1),
      ),
      error: (err, stack) => Center(
        child: Text(
          ErrorHandler.getMessage(err),
          style: AppTypography.bodySmall.copyWith(color: AppColors.error),
        ),
      ),
    );
  }
}

class _HospitalsList extends ConsumerWidget {
  const _HospitalsList();

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final branchesAsync = ref.watch(branchProvider);

    return branchesAsync.when(
      data: (branches) {
        if (branches.isEmpty) {
          return Padding(
            padding: const EdgeInsets.all(AppSpacing.xxl),
            child: Text(
              AppStrings.extTidakadarumahsakitterdekat,
              style: AppTypography.bodySmall,
            ),
          );
        }
        return Column(
          children: branches.map((branch) {
            final dummyDistance =
                '${(branch.id * 1.5 + 2).toStringAsFixed(1)} KM';
            return HospitalCard(
              name: branch.name,
              address: branch.address,
              distance: dummyDistance,
              imageUrl: branch.imageUrl,
              gmapsLink: branch.gmapsLink,
            );
          }).toList(),
        );
      },
      loading: () => const Padding(
        padding: EdgeInsets.symmetric(
            horizontal: AppSpacing.pagePadding, vertical: AppSpacing.lg),
        child: CardSkeletonLoader(count: 2),
      ),
      error: (err, stack) => Padding(
        padding: const EdgeInsets.all(AppSpacing.xxl),
        child: Text(
          AppStrings.extGagalmemuatrumahsakit,
          style: AppTypography.bodySmall.copyWith(color: AppColors.error),
        ),
      ),
    );
  }
}
