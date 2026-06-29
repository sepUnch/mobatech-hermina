import 'dart:ui';
import 'package:flutter/material.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/network/dio_client.dart';
import 'package:url_launcher/url_launcher.dart';
import 'hospital_card_components.dart';

class HospitalCard extends StatelessWidget {
  final String name;
  final String address;
  final String distance;
  final String? imageUrl;
  final String? gmapsLink;

  const HospitalCard({
    super.key,
    required this.name,
    required this.address,
    required this.distance,
    this.imageUrl,
    this.gmapsLink,
  });

  void _launchMaps() async {
    final url = (gmapsLink != null && gmapsLink!.isNotEmpty) 
      ? Uri.parse(gmapsLink!)
      : Uri.parse('https://www.google.com/maps/search/?api=1&query=${Uri.encodeComponent('$name $address')}');

    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 16, left: 24, right: 24),
      decoration: _buildDecoration(),
      child: ClipRRect(
        borderRadius: BorderRadius.circular(16),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 10, sigmaY: 10),
          child: Container(
            color: AppColors.backgroundWhite.withValues(alpha: 0.85),
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                _buildImageContainer(),
                const SizedBox(width: 16),
                Expanded(
                  child: HospitalInfoColumn(
                    name: name,
                    address: address,
                    distance: distance,
                  ),
                ),
                const SizedBox(width: 16),
                Container(
                  width: 1.5,
                  height: 40,
                  color: AppColors.dividerGrey.withValues(alpha: 0.5),
                ),
                const SizedBox(width: 16),
                HospitalActionButtons(onMapTap: _launchMaps),
              ],
            ),
          ),
        ),
      ),
    );
  }

  BoxDecoration _buildDecoration() {
    return BoxDecoration(
      borderRadius: BorderRadius.circular(16),
      boxShadow: [
        BoxShadow(
          color: AppColors.shadowColor.withValues(alpha: 0.05),
          blurRadius: 10,
          offset: const Offset(0, 4),
        ),
      ],
    );
  }

  Widget _buildImageContainer() {
    final bool hasImage = imageUrl != null && imageUrl!.isNotEmpty;
    final String fullImageUrl = hasImage 
        ? (imageUrl!.startsWith('http') ? imageUrl! : '$baseMediaUrl$imageUrl')
        : '';
        
    return Container(
      width: 60,
      height: 60,
      decoration: BoxDecoration(
        color: AppColors.borderGrey,
        borderRadius: BorderRadius.circular(8),
        image: hasImage
            ? DecorationImage(
                image: NetworkImage(fullImageUrl),
                fit: BoxFit.cover,
              )
            : null,
      ),
      child: !hasImage
          ? const Icon(Icons.local_hospital, color: Colors.white)
          : null,
    );
  }
}
