import 'package:flutter/material.dart';
import '../../../../core/network/dio_client.dart';
import 'package:url_launcher/url_launcher.dart';
import '../../../../core/theme/app_colors.dart';
import '../../../../core/theme/app_spacing.dart';
import '../../../../core/widgets/app_card.dart';
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
        : Uri.parse(
            'https://www.google.com/maps/search/?api=1&query=${Uri.encodeComponent('$name $address')}');

    if (await canLaunchUrl(url)) {
      await launchUrl(url, mode: LaunchMode.externalApplication);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(
        horizontal: AppSpacing.pagePadding,
        vertical: AppSpacing.sm,
      ),
      child: AppCard(
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            _buildImageContainer(),
            const SizedBox(width: AppSpacing.md),
            Expanded(
              child: HospitalInfoColumn(
                name: name,
                address: address,
                distance: distance,
              ),
            ),
            const SizedBox(width: AppSpacing.sm),
            Container(
              width: 1,
              height: 48,
              color: AppColors.divider,
            ),
            const SizedBox(width: AppSpacing.md),
            HospitalActionButtons(onMapTap: _launchMaps),
          ],
        ),
      ),
    );
  }

  Widget _buildImageContainer() {
    final bool hasImage = imageUrl != null && imageUrl!.isNotEmpty;
    final String fullImageUrl = hasImage
        ? (imageUrl!.startsWith('http') ? imageUrl! : '$baseMediaUrl$imageUrl')
        : '';

    return Container(
      width: 64,
      height: 64,
      decoration: BoxDecoration(
        color: AppColors.surfaceVariant,
        borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
        image: hasImage
            ? DecorationImage(
                image: NetworkImage(fullImageUrl),
                fit: BoxFit.cover,
              )
            : null,
      ),
      child: !hasImage
          ? const Icon(Icons.local_hospital, color: AppColors.textTertiary)
          : null,
    );
  }
}
