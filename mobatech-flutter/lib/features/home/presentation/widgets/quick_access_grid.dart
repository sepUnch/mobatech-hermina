import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/utils/error_handler.dart';
import '../../../../core/widgets/skeleton_loader.dart';
import '../../../services/presentation/providers/service_provider.dart';
import '../../../../core/constants/app_strings.dart';
import 'quick_access_item.dart';
import 'quick_access_more_menu.dart';

class QuickAccessGrid extends ConsumerWidget {
  const QuickAccessGrid({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final servicesAsync = ref.watch(servicesProvider);

    return servicesAsync.when(
      data: (services) {
        final List<_MenuItem> menuItems = [
          _MenuItem(
            Icons.calendar_month_outlined,
            AppStrings.menuAppointment,
            AppColors.primary,
            () => context.push('/appointment'),
          ),
          _MenuItem(
            Icons.card_giftcard_outlined,
            AppStrings.menuOffers,
            AppColors.primary,
            () => context.push('/special-offers'),
          ),
          _MenuItem(
            Icons.smart_toy_outlined,
            AppStrings.menuAssistant,
            AppColors.primary,
            () => context.push('/chatbot'),
          ),
          _MenuItem(
            Icons.emergency_outlined,
            AppStrings.menuEmergency,
            AppColors.error,
            () => context.push('/emergency'),
          ),
          _MenuItem(
            Icons.local_pharmacy_outlined,
            'Apotek',
            AppColors.primary,
            () => context.push('/pharmacy'),
          ),
        ];

        for (var service in services) {
          menuItems.add(
            _MenuItem(
              _getIconData(service['icon']),
              service['name'] ?? '',
              AppColors.primary,
              () {
                if (service['name'] == 'IGD 24 Jam') {
                  context.push('/emergency');
                } else if (service['name'] == 'Farmasi' ||
                    service['name'] == 'Layanan Farmasi') {
                  context.push('/pharmacy');
                }
              },
            ),
          );
        }

        return _buildGrid(context, menuItems);
      },
      loading: () => const GridSkeletonLoader(count: 4),
      error: (err, stack) => Center(child: Text(ErrorHandler.getMessage(err))),
    );
  }

  Widget _buildGrid(BuildContext context, List<_MenuItem> items) {
    final List<Widget> displayItems;
    if (items.length > 4) {
      displayItems = items.sublist(0, 3).map((m) => _buildItem(m)).toList();
      displayItems.add(
        QuickAccessItem(
          icon: Icons.grid_view_rounded,
          label: AppStrings.menuOthers,
          iconColor: AppColors.primary,
          onTap: () {
            final remaining = items.sublist(3).map((m) {
              return QuickAccessItem(
                icon: m.icon,
                label: m.label,
                iconColor: m.color,
                onTap: m.onTap,
              );
            }).toList();
            showQuickAccessMoreMenu(context, remaining);
          },
        ),
      );
    } else {
      displayItems = items.map((m) => _buildItem(m)).toList();
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: AppSpacing.pagePadding),
      child: GridView.count(
        padding: EdgeInsets.zero, // Prevent Flutter from injecting safe area padding
        crossAxisCount: 4,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        mainAxisSpacing: AppSpacing.sm,
        crossAxisSpacing: AppSpacing.sm,
        childAspectRatio: 0.75,
        children: displayItems,
      ),
    );
  }

  Widget _buildItem(_MenuItem m) {
    return QuickAccessItem(
      icon: m.icon,
      label: m.label,
      iconColor: m.color,
      onTap: m.onTap,
    );
  }

  IconData _getIconData(String? iconName) {
    switch (iconName) {
      case 'local_hospital':
        return Icons.local_hospital_outlined;
      case 'medical_services':
        return Icons.medical_services_outlined;
      case 'biotech':
        return Icons.biotech_outlined;
      case 'bed':
        return Icons.bed_outlined;
      default:
        return Icons.healing_outlined;
    }
  }
}

class _MenuItem {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  _MenuItem(this.icon, this.label, this.color, this.onTap);
}
