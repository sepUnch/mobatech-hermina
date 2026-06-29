import { APP_STRINGS } from "@/lib/constants";
import React, { useState } from "react";

interface DoctorImageUploadProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
}

export function DoctorImageUpload({ imageUrl, setImageUrl }: DoctorImageUploadProps) {
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploadingImage(true);
      const res = await fetch("http://127.0.0.1:8080/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setImageUrl(data.url);
      } else {
        alert(data.error || "Gagal mengunggah gambar");
      }
    } catch {
      alert("Gagal mengunggah gambar");
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold mb-2">{APP_STRINGS.doctors.imgLabel}</label>
      <div className="flex gap-2 items-center">
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-glass-border shadow-sm shrink-0" />
        )}
        <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Atau tempel URL gambar..." className="flex-1 min-w-0 h-10 px-3 rounded-xl border glass-input text-sm text-foreground" />
        <div className="relative shrink-0 flex items-center justify-center">
          <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
          <button type="button" disabled={uploadingImage} className="h-10 px-4 bg-primary/10 text-primary hover:bg-primary/20 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 pointer-events-none">
            {uploadingImage ? "..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
