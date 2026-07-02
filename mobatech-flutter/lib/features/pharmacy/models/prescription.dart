import '../../../core/network/dio_client.dart';


class PrescriptionItem {
  final int medicineId;
  final String medicineName;
  final String dosageInstruction;
  final String duration;
  final int quantity;
  
  PrescriptionItem({
    required this.medicineId,
    required this.medicineName,
    required this.dosageInstruction,
    required this.duration,
    required this.quantity,
  });

  factory PrescriptionItem.fromJson(Map<String, dynamic> json) {
    return PrescriptionItem(
      medicineId: json['medicine_id'] as int? ?? 0,
      medicineName: (json['medicine'] != null ? json['medicine']['name'] : '') as String? ?? 'Obat',
      dosageInstruction: json['dosage_instruction'] as String? ?? '',
      duration: json['duration'] as String? ?? '',
      quantity: json['quantity'] as int? ?? 1,
    );
  }
}

class Prescription {
  final int id;
  final int? appointmentId;
  final String doctorName;
  final String diagnosis;
  final List<PrescriptionItem> items;
  final int userId;
  final String imageUrl;
  final String notes;
  final String status;
  final DateTime createdAt;

  Prescription({
    required this.id,
    this.appointmentId,
    required this.doctorName,
    required this.diagnosis,
    required this.items,
    required this.userId,
    required this.imageUrl,
    required this.notes,
    required this.status,
    required this.createdAt,
  });

  factory Prescription.fromJson(Map<String, dynamic> json) {
    String rawImageUrl = json['image_url'] as String? ?? '';
    rawImageUrl = fixImageUrl(rawImageUrl);

    return Prescription(
      id: json['ID'] ?? json['id'] as int,
      appointmentId: json['appointment_id'] as int?,
      doctorName: json['doctor_name'] as String? ?? '',
      diagnosis: json['diagnosis'] as String? ?? '',
      items: (json['items'] as List<dynamic>?)?.map((e) => PrescriptionItem.fromJson(e as Map<String, dynamic>)).toList() ?? [],
      userId: json['user_id'] as int? ?? 0,
      imageUrl: rawImageUrl,
      notes: json['notes'] as String? ?? '',
      status: json['status'] as String? ?? 'Pending',
      createdAt: json['CreatedAt'] != null 
          ? DateTime.parse(json['CreatedAt']) 
          : DateTime.now(),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'user_id': userId,
      'image_url': imageUrl,
      'notes': notes,
      'status': status,
      'CreatedAt': createdAt.toIso8601String(),
    };
  }
}
