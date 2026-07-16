import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/theme/app_typography.dart';
import '../../../../core/constants/app_strings.dart';
import '../widgets/login_form.dart';

class LoginScreen extends StatelessWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.surface,
      body: LayoutBuilder(
        builder: (context, constraints) {
          return SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            child: ConstrainedBox(
              constraints: BoxConstraints(minHeight: constraints.maxHeight),
              child: Stack(
                children: [
                  // Top Green Header (Scrolls together with the page)
                  Container(
                    height: constraints.maxHeight * 0.35,
                    decoration: const BoxDecoration(
                      color: AppColors.primary,
                    ),
                    child: Stack(
                      children: [
                        Positioned(
                          top: -20,
                          right: -20,
                          child: Opacity(
                            opacity: 0.2,
                            child: Image.asset(
                              'assets/header_logo.png',
                              width: 220,
                            ),
                          ),
                        ),
                        Align(
                          alignment: Alignment.bottomCenter,
                          child: Padding(
                            padding: EdgeInsets.only(
                              bottom: constraints.maxHeight * 0.06,
                            ),
                            child: Image.asset(
                              'assets/doctor.png',
                              height: constraints.maxHeight * 0.25,
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Bottom White Form (Overlaps the green header)
                  Container(
                    margin: EdgeInsets.only(top: constraints.maxHeight * 0.30),
                    constraints: BoxConstraints(
                      minHeight: constraints.maxHeight * 0.70,
                    ),
                    width: double.infinity,
                    decoration: const BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.only(
                        topLeft: Radius.circular(AppSpacing.radiusXl),
                        topRight: Radius.circular(AppSpacing.radiusXl),
                      ),
                    ),
                    padding: const EdgeInsets.fromLTRB(
                      AppSpacing.xxl,
                      AppSpacing.xxxl,
                      AppSpacing.xxl,
                      AppSpacing.xxl,
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Text(
                          AppStrings.loginGreeting,
                          style: AppTypography.h1,
                        ),
                        const SizedBox(height: AppSpacing.xs),
                        Text(
                          AppStrings.loginSubtitle,
                          style: AppTypography.bodySmall,
                        ),
                        const SizedBox(height: AppSpacing.xxl),
                        const LoginForm(),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
