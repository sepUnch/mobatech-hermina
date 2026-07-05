import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import '../../data/auth_repository.dart';
import '../../../../core/network/dio_client.dart';
import 'package:shared_preferences/shared_preferences.dart';

final authRepositoryProvider = Provider((ref) => AuthRepository(ref.watch(dioProvider)));

final authStateProvider = StateNotifierProvider<AuthNotifier, bool>((ref) {
  return AuthNotifier(ref.watch(authRepositoryProvider));
});

class AuthNotifier extends StateNotifier<bool> {
  final AuthRepository _repository;

  AuthNotifier(this._repository) : super(false);

  Future<void> _saveUserData(Map<String, dynamic> res) async {
    globalAuthToken = res['token'];
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('jwt_token', globalAuthToken!);
    await prefs.setString('user_data', jsonEncode(res['user']));
  }

  Future<void> login(String email, String password) async {
    state = true;
    try {
      final cred = await FirebaseAuth.instance
          .signInWithEmailAndPassword(email: email, password: password);
      final user = cred.user;
      if (user == null) throw Exception("User tidak ditemukan.");
      if (!user.emailVerified) {
        await FirebaseAuth.instance.signOut();
        throw Exception("Email Anda belum diverifikasi. Silakan cek email.");
      }
      final idToken = await user.getIdToken();
      if (idToken == null) throw Exception("Gagal mengambil token Firebase.");
      final res = await _repository.loginWithGoogle(idToken);
      await _saveUserData(res);
    } finally {
      state = false;
    }
  }

  Future<void> loginWithGoogle() async {
    state = true;
    try {
      await GoogleSignIn.instance.initialize(
        serverClientId: dotenv.env['GOOGLE_WEB_CLIENT_ID'],
      );
      final googleUser = await GoogleSignIn.instance.authenticate();
      final googleAuth = googleUser.authentication;
      final credential = GoogleAuthProvider.credential(idToken: googleAuth.idToken);
      final userCred = await FirebaseAuth.instance.signInWithCredential(credential);
      final idToken = await userCred.user?.getIdToken();
      if (idToken == null) throw Exception("Failed to retrieve ID Token");
      final res = await _repository.loginWithGoogle(idToken);
      await _saveUserData(res);
    } finally {
      state = false;
    }
  }

  Future<void> register(
    String fullName, String email, String phone, String password,
  ) async {
    state = true;
    try {
      final cred = await FirebaseAuth.instance
          .createUserWithEmailAndPassword(email: email, password: password);
      await cred.user?.updateDisplayName(fullName);
      await cred.user?.sendEmailVerification();
      await FirebaseAuth.instance.signOut();
      await _repository.register(fullName, email, phone, password);
    } finally {
      state = false;
    }
  }

  Future<void> sendPasswordResetEmail(String email) async {
    state = true;
    try {
      await FirebaseAuth.instance.sendPasswordResetEmail(email: email);
    } finally {
      state = false;
    }
  }

  Future<void> updateProfile(
    String name, String phone, String? path, {
    String? bloodType, int? height, int? weight,
    String? allergies, String? dob, String? gender,
  }) async {
    state = true;
    try {
      final res = await _repository.updateProfile(
        name, phone, path,
        bloodType: bloodType, height: height, weight: weight,
        allergies: allergies, dob: dob, gender: gender,
      );
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user_data', jsonEncode(res));
    } finally {
      state = false;
    }
  }

  Future<void> refreshProfile() async {
    try {
      final res = await _repository.getProfile();
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('user_data', jsonEncode(res));
    } catch (e) {
      // Ignore errors silently on background refresh
    }
  }

  Future<void> addFamilyMember(Map<String, dynamic> payload) async {
    state = true;
    try {
      await _repository.addFamilyMember(payload);
      await refreshProfile();
    } finally {
      state = false;
    }
  }

  Future<void> deleteFamilyMember(int id) async {
    state = true;
    try {
      await _repository.deleteFamilyMember(id);
      await refreshProfile();
    } finally {
      state = false;
    }
  }
}
