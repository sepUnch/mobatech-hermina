part of 'agenda_card.dart';

class _AgendaAccentStrip extends StatelessWidget {
  final String status;
  const _AgendaAccentStrip({required this.status});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 4,
      decoration: BoxDecoration(
        color: _getStatusColor(),
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(AppSpacing.radiusMd),
          bottomLeft: Radius.circular(AppSpacing.radiusMd),
        ),
      ),
    );
  }

  Color _getStatusColor() {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'selesai':
        return AppColors.success;
      case 'cancelled':
      case 'batal':
        return AppColors.error;
      case 'pending':
      case 'menunggu':
      default:
        return AppColors.warning;
    }
  }
}

class _DoctorInfo extends StatelessWidget {
  final Appointment appointment;
  const _DoctorInfo({required this.appointment});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(AppSpacing.md),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  appointment.doctor?.name ?? 'Nama Dokter',
                  style: AppTypography.h4,
                ),
                const SizedBox(height: AppSpacing.xs),
                Text(
                  appointment.doctor?.specialization ?? 'Spesialis',
                  style: AppTypography.bodySmall,
                ),
              ],
            ),
          ),
          const SizedBox(width: AppSpacing.md),
          _DoctorImage(appointment: appointment),
        ],
      ),
    );
  }
}

class _DoctorImage extends StatelessWidget {
  final Appointment appointment;
  const _DoctorImage({required this.appointment});

  @override
  Widget build(BuildContext context) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(AppSpacing.radiusSm),
      child: appointment.doctor?.imageUrl != null &&
              !appointment.doctor!.imageUrl.contains('.svg')
          ? Image.network(
              appointment.doctor!.imageUrl,
              width: 56,
              height: 56,
              fit: BoxFit.cover,
              alignment: Alignment.topCenter,
              errorBuilder: (context, error, stackTrace) => _fallbackImage(),
            )
          : _fallbackImage(),
    );
  }

  Widget _fallbackImage() {
    return Image.asset(
      'assets/doctor.png',
      width: 56,
      height: 56,
      fit: BoxFit.cover,
      alignment: Alignment.topCenter,
    );
  }
}

class _ScheduleInfo extends StatelessWidget {
  final Appointment appointment;
  const _ScheduleInfo({required this.appointment});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(
          horizontal: AppSpacing.md, vertical: AppSpacing.sm),
      decoration: const BoxDecoration(
        color: AppColors.surfaceVariant,
        borderRadius: BorderRadius.only(
          bottomRight: Radius.circular(AppSpacing.radiusMd),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            appointment.schedule?.date != null
                ? '${Formatters.formatDateWithDayID(appointment.schedule!.date!)} • ${appointment.schedule!.startTime}'
                : 'Jadwal belum ditentukan',
            style: AppTypography.bodySmall.copyWith(
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: AppSpacing.xs),
          Row(
            children: [
              Text(
                'Status Pendaftaran',
                style: AppTypography.labelSmall.copyWith(
                  color: AppColors.textTertiary,
                ),
              ),
              const SizedBox(width: AppSpacing.sm),
              GlassStatusChip(
                status: appointment.status,
                fontSize: 10,
                padding:
                    const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
