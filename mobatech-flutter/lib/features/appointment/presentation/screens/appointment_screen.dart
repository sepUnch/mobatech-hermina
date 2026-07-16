import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/utils/error_handler.dart';
import '../../../../core/widgets/skeleton_loader.dart';
import '../widgets/doctor_card.dart';
import '../../providers/appointment_provider.dart';
import 'doctor_detail_screen.dart';
import '../widgets/appointment_sliver_header.dart';
import '../widgets/appointment_header_widgets.dart';

class AppointmentScreen extends ConsumerStatefulWidget {
  const AppointmentScreen({super.key});

  @override
  ConsumerState<AppointmentScreen> createState() => _AppointmentScreenState();
}

class _AppointmentScreenState extends ConsumerState<AppointmentScreen> {
  late TextEditingController _searchController;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _searchController = TextEditingController(
      text: ref.read(searchQueryProvider),
    );
    _scrollController.addListener(() {
      if (_scrollController.position.pixels >=
          _scrollController.position.maxScrollExtent - 200) {
        ref.read(doctorsProvider.notifier).fetchNextPage();
      }
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final doctorsAsync = ref.watch(filteredDoctorsProvider);

    return Scaffold(
      backgroundColor: AppColors.backgroundScreen,
      body: TweenAnimationBuilder<double>(
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
        child: CustomScrollView(
          controller: _scrollController,
          physics: const BouncingScrollPhysics(),
          slivers: [
            const AppointmentSliverHeader(),
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.symmetric(vertical: 16),
                child: Column(
                  children: [
                    AppointmentSearchBar(searchController: _searchController),
                    const SizedBox(height: 16),
                    const AppointmentFilterChips(),
                  ],
                ),
              ),
            ),
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
              sliver: doctorsAsync.when(
                data: (doctors) {
                  if (doctors.isEmpty) {
                    return const SliverToBoxAdapter(
                      child: Center(
                        child: Text(
                          'Tidak ada dokter tersedia',
                          style: TextStyle(color: AppColors.textGrey),
                        ),
                      ),
                    );
                  }
                  final isFetchingNextPage = ref.read(doctorsProvider.notifier).isFetchingNextPage;
                  return SliverList(
                    delegate: SliverChildBuilderDelegate((context, index) {
                      if (index == doctors.length) {
                        return const Padding(
                          padding: EdgeInsets.all(16.0),
                          child: Center(
                            child: CupertinoActivityIndicator(radius: 14),
                          ),
                        );
                      }
                      final doctor = doctors[index];
                      return DoctorCard(
                        doctor: doctor,
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  DoctorDetailScreen(doctorId: doctor.id),
                            ),
                          );
                        },
                      );
                    }, childCount: doctors.length + (isFetchingNextPage ? 1 : 0)),
                  );
                },
                loading: () => const SliverToBoxAdapter(
                  child: CardSkeletonLoader(count: 4),
                ),
                error: (err, stack) => SliverToBoxAdapter(
                  child: Center(child: Text(ErrorHandler.getMessage(err))),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
