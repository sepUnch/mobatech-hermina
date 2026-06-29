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
              ref.refresh(branchProvider);
              ref.refresh(userAppointmentsProvider);
            },
            child: SingleChildScrollView(
              physics: const AlwaysScrollableScrollPhysics(
                parent: BouncingScrollPhysics(),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const HomeHeader(),
                  const SizedBox(height: 24),
                  const QuickAccessGrid(),
                  const SizedBox(height: 24),
                  const PromoBannerCarousel(),
                  const SizedBox(height: 20),
                  _buildSectionTitle(AppStrings.sectionAgenda),
                  const _AgendaList(),
                  const SizedBox(height: 20),
                  _buildSectionTitle(AppStrings.sectionAssistant),
                  const AssistantCard(),
                  const SizedBox(height: 20),
                  _buildSectionTitle(AppStrings.sectionHospitals),
                  const _HospitalsList(),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) => Padding(
    padding: const EdgeInsets.symmetric(horizontal: 24),
    child: Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.textDark)),
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
          return const Padding(
            padding: EdgeInsets.all(24.0),
            child: Center(
              child: Text(AppStrings.emptyAgenda, style: TextStyle(color: AppColors.textGrey)),
            ),
          );
        }

        return ListView.builder(
          padding: EdgeInsets.zero,
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: appointments.length > 2 ? 2 : appointments.length,
          itemBuilder: (context, index) => AgendaCard(appointment: appointments[index]),
        );
      },
      loading: () => const Padding(
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: CardSkeletonLoader(count: 1),
      ),
      error: (err, stack) => Center(child: Text(ErrorHandler.getMessage(err))),
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
        if (branches.isEmpty) return const Padding(padding: EdgeInsets.all(24.0), child: Text('Tidak ada rumah sakit terdekat.', style: TextStyle(color: AppColors.textGrey)));
        return Column(
          children: branches.map((branch) {
            final dummyDistance = (branch.id * 1.5 + 2).toStringAsFixed(1) + ' KM';
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
        padding: EdgeInsets.symmetric(horizontal: 24, vertical: 16),
        child: CardSkeletonLoader(count: 2),
      ),
      error: (err, stack) => const Padding(
        padding: EdgeInsets.all(24.0),
        child: Text('Gagal memuat rumah sakit', style: TextStyle(color: AppColors.errorRed)),
      ),
    );
  }
}
