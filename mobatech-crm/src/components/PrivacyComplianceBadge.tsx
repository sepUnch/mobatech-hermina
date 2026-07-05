export function PrivacyComplianceBadge() {
  return (
    <div className="rounded-2xl border glass-panel p-6 shadow-sm flex flex-col justify-center items-center text-center">
      <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4">
        <span className="text-3xl">🛡️</span>
      </div>
      <h3 className="font-semibold text-lg">Privacy & PDP Compliant</h3>
      <p className="text-sm text-foreground/60 mt-2 max-w-sm">
        Sistem AI menggunakan Anonymization Engine di mana informasi pribadi pasien disamarkan sebelum diakses oleh Model LLM, sesuai dengan hukum Perlindungan Data Pribadi.
      </p>
    </div>
  );
}
