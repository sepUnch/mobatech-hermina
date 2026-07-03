part of 'agenda_card.dart';

class _DoctorInfo extends StatelessWidget {
  final Appointment appointment;
  const _DoctorInfo({required this.appointment});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(12),
      child: Row(
        children: [
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                _buildDoctorName(),
                const SizedBox(height: 8),
                _buildDoctorSpecialization(),
              ],
            ),
          ),
          const SizedBox(width: 8),
          _DoctorImage(appointment: appointment),
        ],
      ),
    );
  }

  Widget _buildDoctorName() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: AppColors.agendaHeader,
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        appointment.doctor?.name ?? 'Nama Dokter',
        style: const TextStyle(
          color: AppColors.textWhite,
          fontSize: 10,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildDoctorSpecialization() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        border: Border.all(color: AppColors.borderGrey),
        borderRadius: BorderRadius.circular(20),
      ),
      child: Text(
        appointment.doctor?.specialization ?? 'Spesialis',
        style: const TextStyle(
          color: AppColors.textDark,
          fontSize: 11,
          fontWeight: FontWeight.w500,
        ),
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
      borderRadius: BorderRadius.circular(8),
      child: appointment.doctor?.imageUrl != null &&
              !appointment.doctor!.imageUrl.contains('.svg')
          ? Image.network(
              appointment.doctor!.imageUrl,
              width: 60,
              height: 60,
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
      width: 60,
      height: 60,
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
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
      decoration: const BoxDecoration(
        color: AppColors.agendaBackground,
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(16),
          bottomRight: Radius.circular(16),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            appointment.schedule?.date != null ? '${Formatters.formatDateWithDayID(appointment.schedule!.date!)} • ${appointment.schedule!.startTime}' : 'Jadwal belum ditentukan',
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.bold,
              color: AppColors.textDark,
            ),
          ),
          const SizedBox(height: 8),
          Row(
            children: [
              const Text(
                'Status Pendaftaran',
                style: TextStyle(
                  fontSize: 12,
                  color: AppColors.textGrey,
                ),
              ),
              const SizedBox(width: 10),
              GlassStatusChip(
                status: appointment.status,
                fontSize: 10,
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
