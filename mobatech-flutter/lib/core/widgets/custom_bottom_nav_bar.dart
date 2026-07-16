import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../theme/app_colors.dart';
import '../theme/app_spacing.dart';
import '../theme/app_typography.dart';

class CustomBottomNavBar extends StatelessWidget {
  final int currentIndex;

  const CustomBottomNavBar({super.key, required this.currentIndex});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        border: Border(
          top: BorderSide(color: AppColors.border, width: 1),
        ),
      ),
      child: SafeArea(
        top: false,
        child: SizedBox(
          height: AppSpacing.navBarItemHeight,
          child: Row(
            children: List.generate(
              _items.length,
              (index) => _NavBarItem(
                icon: _items[index].icon,
                activeIcon: _items[index].activeIcon,
                label: _items[index].label,
                isActive: index == currentIndex,
                onTap: () => _onTap(context, index),
              ),
            ),
          ),
        ),
      ),
    );
  }

  void _onTap(BuildContext context, int index) {
    if (index == currentIndex) return;
    final routes = ['/home', '/chatbot', '/for-you', '/history', '/profile'];
    context.go(routes[index]);
  }

  static const List<_NavItem> _items = [
    _NavItem(Icons.home_outlined, Icons.home_rounded, 'Home'),
    _NavItem(Icons.chat_bubble_outline, Icons.chat_bubble, 'Chat'),
    _NavItem(Icons.library_books_outlined, Icons.library_books, 'For You'),
    _NavItem(Icons.history_rounded, Icons.history_rounded, 'History'),
    _NavItem(Icons.person_outline, Icons.person, 'Profile'),
  ];
}

class _NavItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;

  const _NavItem(this.icon, this.activeIcon, this.label);
}

class _NavBarItem extends StatelessWidget {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final bool isActive;
  final VoidCallback onTap;

  const _NavBarItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.isActive,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Material(
        color: AppColors.transparent,
        child: InkWell(
          onTap: onTap,
          child: SizedBox(
            height: AppSpacing.navBarItemHeight,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  isActive ? activeIcon : icon,
                  size: 24,
                  color: isActive
                      ? AppColors.primary
                      : AppColors.textTertiary,
                ),
                const SizedBox(height: 4),
                Text(
                  label,
                  style: AppTypography.caption.copyWith(
                    color: isActive
                        ? AppColors.primary
                        : AppColors.textTertiary,
                    fontWeight: isActive
                        ? FontWeight.w600
                        : FontWeight.w400,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
