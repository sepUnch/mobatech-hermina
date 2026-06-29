import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:image_picker/image_picker.dart';
import 'package:dio/dio.dart';
import '../../../../core/network/dio_client.dart';
import '../../../../core/utils/custom_snackbar.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/constants/app_strings.dart';
import '../../providers/pharmacy_provider.dart';
import '../widgets/shimmer_loading.dart';
import 'prescription_card.dart';

class PrescriptionTabView extends ConsumerStatefulWidget {
  const PrescriptionTabView({super.key});

  @override
  ConsumerState<PrescriptionTabView> createState() => _PrescriptionTabViewState();
}

class _PrescriptionTabViewState extends ConsumerState<PrescriptionTabView> {
  bool _isUploading = false;

  Future<void> _uploadPrescription() async {
    final picker = ImagePicker();
    final pickedFile = await picker.pickImage(source: ImageSource.gallery);
    if (pickedFile == null) return;

    setState(() => _isUploading = true);
    try {
      final dio = ref.read(dioProvider);
      
      final formData = FormData.fromMap({
        'file': await MultipartFile.fromFile(pickedFile.path),
      });
      final uploadRes = await dio.post('$baseUrl/upload', data: formData);
      final imageUrl = uploadRes.data['url'] as String;

      await dio.post('/pharmacy/prescriptions', data: {
        'image_url': imageUrl,
        'notes': 'Resep dari pelanggan (Mobile)',
      });

      if (mounted) CustomSnackbar.showSuccess(context, 'E-Resep berhasil diunggah!');
      ref.invalidate(prescriptionsProvider);
    } catch (e) {
      if (mounted) CustomSnackbar.showError(context, 'Gagal mengunggah E-Resep');
    } finally {
      if (mounted) setState(() => _isUploading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final prescriptionsAsync = ref.watch(prescriptionsProvider);

    return prescriptionsAsync.when(
      data: (prescriptions) {
        return CustomScrollView(
          physics: const AlwaysScrollableScrollPhysics(),
          slivers: [
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: ElevatedButton.icon(
                  onPressed: _isUploading ? null : _uploadPrescription,
                  icon: _isUploading 
                      ? const SizedBox(
                          width: 20, 
                          height: 20, 
                          child: CircularProgressIndicator(
                            strokeWidth: 2, 
                            color: AppColors.backgroundWhite,
                          ),
                        )
                      : const Icon(Icons.upload_file),
                  label: Text(_isUploading ? 'Mengunggah...' : 'Unggah E-Resep Baru'),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.primary,
                    foregroundColor: AppColors.textWhite,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12),
                    ),
                  ),
                ),
              ),
            ),
            if (prescriptions.isEmpty)
              const SliverFillRemaining(
                child: Center(child: Text(AppStrings.noPrescription)),
              )
            else
              SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) => PrescriptionCard(prescription: prescriptions[index]),
                  childCount: prescriptions.length,
                ),
              ),
          ],
        );
      },
      loading: () => ListView.separated(
        padding: const EdgeInsets.all(16.0),
        itemCount: 3,
        separatorBuilder: (context, index) => const SizedBox(height: 16),
        itemBuilder: (context, index) => const ShimmerLoading(
          width: double.infinity,
          height: 180,
          borderRadius: 16,
        ),
      ),
      error: (err, stack) =>
          const Center(child: Text(AppStrings.errorLoadPrescriptions)),
    );
  }
}
