part of 'family_member_card.dart';

class _FamilyMemberHeader extends StatelessWidget {
  final String name;
  final bool isPrimary;
  final String relation;

  const _FamilyMemberHeader({
    required this.name,
    required this.isPrimary,
    required this.relation,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Expanded(
              child: Text(
                name,
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.textDark),
                overflow: TextOverflow.ellipsis,
              ),
            ),
            if (isPrimary)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(12)),
                child: const Text(
                  AppStrings.extUtama,
                  style: TextStyle(color: AppColors.backgroundWhite, fontSize: 10, fontWeight: FontWeight.bold),
                ),
              ),
          ],
        ),
        const SizedBox(height: 6),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: isPrimary ? AppColors.primary : AppColors.primaryLight.withValues(alpha: 0.5),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Text(
            relation,
            style: TextStyle(
              color: isPrimary ? AppColors.backgroundWhite : AppColors.primary,
              fontSize: 11,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ],
    );
  }
}

class _FamilyMemberDetails extends StatelessWidget {
  final String? dob;
  final String? gender;
  
  const _FamilyMemberDetails({this.dob, this.gender});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _DetailRow(icon: Icons.cake_outlined, text: Formatters.parseAndFormatDateID(dob ?? '-')),
        const SizedBox(height: 6),
        _DetailRow(
          icon: gender?.toLowerCase() == 'perempuan' ? Icons.female : Icons.male,
          text: gender ?? '-',
        ),
      ],
    );
  }
}

class _DetailRow extends StatelessWidget {
  final IconData icon;
  final String text;

  const _DetailRow({required this.icon, required this.text});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Icon(icon, size: 14, color: AppColors.textGrey),
        const SizedBox(width: 8),
        Expanded(
          child: Text(
            text,
            style: const TextStyle(color: AppColors.textGrey, fontSize: 13, fontWeight: FontWeight.w500),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ),
      ],
    );
  }
}
