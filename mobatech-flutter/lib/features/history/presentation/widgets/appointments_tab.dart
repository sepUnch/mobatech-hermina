import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/utils/formatters.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/constants/app_strings.dart';
import '../../../../core/widgets/skeleton_loader.dart';
import '../../../../core/utils/error_handler.dart';
import '../../../appointment/providers/appointment_provider.dart';
import 'history_card.dart';

class AppointmentsTab extends ConsumerStatefulWidget {
  const AppointmentsTab({super.key});

  @override
  ConsumerState<AppointmentsTab> createState() => _AppointmentsTabState();
}

class _AppointmentsTabState extends ConsumerState<AppointmentsTab> {
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _scrollController.addListener(() {
      if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 200) {
        ref.read(userAppointmentsProvider.notifier).fetchNextPage();
      }
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final appointmentsAsync = ref.watch(userAppointmentsProvider);
    return appointmentsAsync.when(
      data: (appointments) {
        if (appointments.isEmpty) {
          return const Center(child: Text(AppStrings.noAppointmentHistory));
        }
        final isFetchingNextPage = ref.read(userAppointmentsProvider.notifier).isFetchingNextPage;
        return ListView.separated(
          controller: _scrollController,
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          itemCount: appointments.length + (isFetchingNextPage ? 1 : 0),
          separatorBuilder: (_, __) => const SizedBox(height: 12),
          itemBuilder: (context, index) {
            if (index == appointments.length) {
              return const Padding(
                padding: EdgeInsets.all(16.0),
                child: Center(
                  child: CupertinoActivityIndicator(radius: 14),
                ),
              );
            }
            final appt = appointments[index];
            final title =
                '${AppStrings.appointmentWith} ${appt.doctor?.name ?? AppStrings.defaultDoctorName}';
            final status = appt.status.toUpperCase();
            final date = appt.schedule?.date != null
                ? Formatters.formatDateID(appt.schedule!.date!)
                : '-';
            return HistoryCard(
              title: title,
              status: status,
              date: date,
              onTap: () => context.push('/appointment/user-appointments'),
            );
          },
        );
      },
      loading: () => const CardSkeletonLoader(count: 3),
      error: (e, stack) => _buildErrorState(ErrorHandler.getMessage(e)),
    );
  }

  Widget _buildErrorState(String message) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.cloud_off,
              size: 64,
              color: AppColors.textLightGrey,
            ),
            const SizedBox(height: 16),
            Text(
              message,
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.textGrey, fontSize: 16),
            ),
          ],
        ),
      ),
    );
  }
}
