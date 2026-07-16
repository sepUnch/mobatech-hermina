import 'package:flutter/material.dart';
import '../../../../../core/theme/app_colors.dart';
import '../../../../../core/theme/app_spacing.dart';
import '../../../../../core/theme/app_typography.dart';
import '../../../../../core/widgets/app_card.dart';

part 'order_tracking_item.dart';

class OrderTrackingTimeline extends StatelessWidget {
  final bool isProcessing;
  final bool isReady;
  final bool isCompleted;
  final bool isCancelled;

  const OrderTrackingTimeline({
    super.key,
    required this.isProcessing,
    required this.isReady,
    required this.isCompleted,
    this.isCancelled = false,
  });

  @override
  Widget build(BuildContext context) {
    if (isCancelled) {
      return AppCard(
        child: Column(
          children: [
            _TimelineItem(
              title: 'Pesanan Dibatalkan',
              description: 'Pesanan ini telah dibatalkan.',
              time: 'Selesai',
              isCompleted: true,
              isLast: true,
              isError: true,
            ),
          ],
        ),
      );
    }

    return AppCard(
      child: Column(
        children: [
          _TimelineItem(
            title: 'Pesanan Masuk',
            description: 'Sistem telah menerima pesanan Anda.',
            time: '08:00',
            isCompleted: true,
            isLast: false,
          ),
          _TimelineItem(
            title: 'Sedang Diproses',
            description: 'Apoteker sedang menyiapkan pesanan Anda.',
            time: isProcessing ? '08:30' : '-',
            isCompleted: isProcessing,
            isLast: false,
          ),
          _TimelineItem(
            title: 'Siap Diambil/Dikirim',
            description:
                'Obat siap diambil di konter atau sedang diantar kurir.',
            time: isReady ? '10:00' : '-',
            isCompleted: isReady,
            isLast: false,
          ),
          _TimelineItem(
            title: 'Selesai',
            description: 'Pesanan telah diterima pelanggan.',
            time: isCompleted ? 'Selesai' : '-',
            isCompleted: isCompleted,
            isLast: true,
          ),
        ],
      ),
    );
  }
}
