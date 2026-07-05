import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:device_preview/device_preview.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:firebase_core/firebase_core.dart';
import 'core/routes/app_router.dart';
import 'core/theme/app_colors.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Load environment variables
  await dotenv.load(fileName: ".env");

  // Initialize Firebase
  try {
    await Firebase.initializeApp();
  } catch (e) {
    debugPrint("Failed to initialize Firebase: $e");
  }

  FlutterError.onError = (FlutterErrorDetails details) {
    FlutterError.presentError(details);
    if (kReleaseMode) {
    }
  };

  ErrorWidget.builder = (FlutterErrorDetails details) {
    return Material(
      child: Container(
        color: AppColors.backgroundScreen,
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, color: AppColors.errorRed, size: 64),
            const SizedBox(height: 16),
            const Text(
              'Terjadi kesalahan',
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.textDark),
            ),
            const SizedBox(height: 8),
            Text(
              kDebugMode ? details.exceptionAsString() : 'Silakan coba lagi atau hubungi dukungan.',
              textAlign: TextAlign.center,
              style: const TextStyle(color: AppColors.textGrey),
            ),
          ],
        ),
      ),
    );
  };

  runApp(
    DevicePreview(
      enabled: !kReleaseMode,
      builder: (context) => const ProviderScope(child: MobatechApp()),
    ),
  );
}

class MobatechApp extends ConsumerWidget {
  const MobatechApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final goRouter = ref.watch(goRouterProvider);

    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      routerConfig: goRouter,
      locale: DevicePreview.locale(context),
      builder: DevicePreview.appBuilder,
      title: 'Mobatech',
      theme: ThemeData(
        fontFamily: 'Inter',
        colorScheme: ColorScheme.fromSeed(seedColor: AppColors.primary),
        scaffoldBackgroundColor: AppColors.backgroundScreen,
        useMaterial3: true,
      ),
    );
  }
}
