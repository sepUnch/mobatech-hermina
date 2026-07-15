import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:device_preview/device_preview.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:firebase_core/firebase_core.dart';
import 'core/routes/app_router.dart';
import 'core/theme/app_colors.dart';

void main() async {
  // Pastikan Flutter binding sudah siap sebelum memanggil native code
  WidgetsFlutterBinding.ensureInitialized();

  // 1. Load environment variables dengan error handling
  try {
    await dotenv.load(fileName: ".env");
  } catch (e) {
    debugPrint("Error loading .env: $e");
  }

  // 2. Initialize Firebase
  try {
    await Firebase.initializeApp();
    debugPrint("Firebase initialized successfully");
  } catch (e) {
    debugPrint("Failed to initialize Firebase: $e");
  }

  // Konfigurasi Error Global
  FlutterError.onError = (FlutterErrorDetails details) {
    FlutterError.presentError(details);
  };

  ErrorWidget.builder = (FlutterErrorDetails details) {
    return Material(
      child: Container(
        color: Colors.white,
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, color: Colors.red, size: 64),
            const SizedBox(height: 16),
            const Text('Terjadi kesalahan', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(details.exceptionAsString(), textAlign: TextAlign.center),
          ],
        ),
      ),
    );
  };

  runApp(
    const ProviderScope(
      child: MobatechApp(),
    ),
  );
}

class MobatechApp extends ConsumerWidget {
  const MobatechApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    // Memanggil router provider
    final goRouter = ref.watch(goRouterProvider);

    return MaterialApp.router(
      debugShowCheckedModeBanner: false,
      routerConfig: goRouter,
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