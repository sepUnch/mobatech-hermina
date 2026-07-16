import '../../../../core/constants/app_strings.dart';
import '../../../../core/utils/custom_snackbar.dart';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/utils/error_handler.dart';
import '../../../../core/widgets/skeleton_loader.dart';
import '../../providers/appointment_provider.dart';
import '../widgets/appointment_card.dart';
import '../widgets/user_appointments_app_bar.dart';
import '../widgets/user_appointments_empty.dart';

class UserAppointmentsScreen extends ConsumerStatefulWidget {
  const UserAppointmentsScreen({super.key});
  @override
  ConsumerState<UserAppointmentsScreen> createState() =>
      _UserAppointmentsScreenState();
}

class _UserAppointmentsScreenState
    extends ConsumerState<UserAppointmentsScreen> {
  final ScrollController _scrollController = ScrollController();
  @override
  void initState() {
    super.initState();
    _scrollController.addListener(() {
      if (_scrollController.position.pixels >=
          _scrollController.position.maxScrollExtent - 200) {
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
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: appointmentsAsync.when(
        data: (appointments) {
          final isFetchingNextPage =
              ref.read(userAppointmentsProvider.notifier).isFetchingNextPage;
          return RefreshIndicator(
            onRefresh: () async {
              ref.invalidate(userAppointmentsProvider);
            },
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
              child: Center(
                child: ConstrainedBox(
                  constraints: const BoxConstraints(maxWidth: 800),
                  child: CustomScrollView(
                    controller: _scrollController,
                    slivers: [
                      const UserAppointmentsAppBar(),
                      if (appointments.isEmpty)
                        const SliverFillRemaining(child: EmptyAppointments())
                      else
                        SliverPadding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppSpacing.pagePadding,
                            vertical: AppSpacing.lg,
                          ),
                          sliver: SliverList(
                            delegate: SliverChildBuilderDelegate(
                              (
                                context,
                                index,
                              ) {
                                if (index == appointments.length) {
                                  return const Padding(
                                    padding: EdgeInsets.all(AppSpacing.md),
                                    child: Center(
                                      child: CupertinoActivityIndicator(
                                          radius: 14),
                                    ),
                                  );
                                }
                                final appointment = appointments[index];
                                return AppointmentCard(
                                  appointment: appointment,
                                  onCancel: () => _handleCancel(
                                      context, ref, appointment.id),
                                );
                              },
                              childCount: appointments.length +
                                  (isFetchingNextPage ? 1 : 0),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
        loading: () => const CardSkeletonLoader(count: 4),
        error: (e, stack) => Center(
          child: Text(
            ErrorHandler.getMessage(e),
            style: AppTypography.bodySmall.copyWith(color: AppColors.error),
          ),
        ),
      ),
    );
  }

  Future<void> _handleCancel(
    BuildContext context,
    WidgetRef ref,
    int id,
  ) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text(AppStrings.extBatalkanjanjitemu, style: AppTypography.h3),
        content: Text(
          'Apakah Anda yakin ingin membatalkan janji temu ini?',
          style: AppTypography.body,
        ),
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(AppSpacing.radiusLg)),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx, false),
            child: Text(AppStrings.extTidak,
                style: AppTypography.label.copyWith(color: AppColors.primary)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              foregroundColor: AppColors.textOnPrimary,
            ),
            child: Text(AppStrings.extYabatalkan, style: AppTypography.label),
          ),
        ],
      ),
    );
    if (confirm == true) {
      try {
        final repo = ref.read(appointmentRepositoryProvider);
        await repo.cancelAppointment(id);
        ref.invalidate(userAppointmentsProvider);
        if (context.mounted) {
          ScaffoldMessenger.of(context).hideCurrentSnackBar();
          CustomSnackbar.showSuccess(
              context, AppStrings.extJanjitemuberhasildibatalkan);
        }
      } catch (e) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).hideCurrentSnackBar();
          CustomSnackbar.showError(context, ErrorHandler.getMessage(e));
        }
      }
    }
  }
}
