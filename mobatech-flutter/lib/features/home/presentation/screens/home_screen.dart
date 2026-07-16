import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/widgets/custom_bottom_nav_bar.dart';
import '../providers/branch_provider.dart';
import '../../../../core/constants/app_strings.dart';
import '../widgets/home_header.dart';
import '../widgets/quick_access_grid.dart';
import '../widgets/promo_banner_carousel.dart';
import '../widgets/assistant_card.dart';
import '../widgets/hospital_card.dart';
import '../widgets/agenda_card.dart';
import '../../../appointment/providers/appointment_provider.dart';
import '../../../../core/widgets/skeleton_loader.dart';
import '../../../../core/utils/error_handler.dart';

part 'home_screen_widgets.dart';

class HomeScreen extends ConsumerWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return const Scaffold(
      backgroundColor: AppColors.backgroundScreen,
      body: _HomeBody(),
      bottomNavigationBar: CustomBottomNavBar(currentIndex: 0),
    );
  }
}
