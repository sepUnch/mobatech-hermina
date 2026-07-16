part of 'profile_screen.dart';

class ProfileSliverAppBar extends StatelessWidget {
  const ProfileSliverAppBar({super.key});

  @override
  Widget build(BuildContext context) {
    return SliverAppBar(

      floating: false,
      pinned: true,
      backgroundColor: AppColors.primary,
      elevation: 0,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.vertical(bottom: Radius.circular(AppSpacing.radiusXl))),
      centerTitle: true,
      title: Text(
        AppStrings.extProfilsaya,
        style: AppTypography.h3.copyWith(color: AppColors.textOnPrimary),
      ),
      flexibleSpace: ClipRRect(
        borderRadius: BorderRadius.vertical(bottom: Radius.circular(AppSpacing.radiusXl)),
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
            Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [Colors.transparent, AppColors.primary.withValues(alpha: 0.6)],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class ProfileNullUserView extends ConsumerWidget {
  const ProfileNullUserView({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(AppStrings.extDataprofiltidakditemukansilakanloginulang, textAlign: TextAlign.center, style: AppTypography.body),
          const SizedBox(height: AppSpacing.md),
          AppButton(
            text: AppStrings.extKeluardariakun,
            onPressed: () async {
              final prefs = await SharedPreferences.getInstance();
              await prefs.clear();
              globalAuthToken = null;
              ref.invalidate(userProfileProvider);
              if (context.mounted) context.go('/login');
            },
          ),
        ],
      ),
    );
  }
}
