import '../../../../core/constants/app_strings.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/app_button.dart';
import '../../models/pharmacy_order.dart';
import '../widgets/order_tracking_header.dart';
import '../widgets/order_tracking_timeline.dart';

class OrderTrackingScreen extends StatelessWidget {
  final PharmacyOrder? order;

  const OrderTrackingScreen({super.key, this.order});

  @override
  Widget build(BuildContext context) {
    final orderTitle = order?.orderNumber ?? 'ORD-PH-UNKNOWN';
    final status = order?.status ?? 'Pending';
    final statusLower = status.toLowerCase();

    bool isProcessing = statusLower == 'processing' ||
        statusLower == 'ready' ||
        statusLower == 'completed';
    bool isReady = statusLower == 'ready' || statusLower == 'completed';
    bool isCompleted = statusLower == 'completed';
    bool isCancelled = statusLower == 'cancelled';

    return Scaffold(
      backgroundColor: AppColors.surface,
      appBar: AppBar(
        title: Text(
          AppStrings.extDetaillacakpesanan,
          style: AppTypography.h3.copyWith(
            color: AppColors.textOnPrimary,
          ),
        ),
        backgroundColor: AppColors.primary,
        elevation: 0,
        centerTitle: true,
        iconTheme: const IconThemeData(color: AppColors.textOnPrimary),
        shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(bottom: Radius.circular(AppSpacing.radiusXl)),
        ),
        flexibleSpace: ClipRRect(
          borderRadius: const BorderRadius.vertical(
            bottom: Radius.circular(AppSpacing.radiusXl),
          ),
          child: Stack(
            clipBehavior: Clip.none,
            children: [
              Positioned(
                right: -20,
                top: -20,
                child: Opacity(
                  opacity: 0.2,
                  child: Image.asset('assets/header_logo.png', width: 220),
                ),
              ),
            ],
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(AppSpacing.pagePadding),
        child: Column(
          children: [
            OrderTrackingHeader(
              order: order,
              orderTitle: orderTitle,
              status: status,
            ),
            const SizedBox(height: AppSpacing.xl),
            OrderTrackingTimeline(
              isProcessing: isProcessing,
              isReady: isReady,
              isCompleted: isCompleted,
              isCancelled: isCancelled,
            ),
            const SizedBox(height: AppSpacing.xxl),
            SizedBox(
              width: double.infinity,
              child: AppButton(
                onPressed: () {
                  context.go('/home');
                },
                text: 'Kembali ke Beranda',
              ),
            ),
            const SizedBox(height: AppSpacing.xl),
          ],
        ),
      ),
    );
  }
}
