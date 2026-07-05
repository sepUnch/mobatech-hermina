import React, { useState, useRef } from "react";
import { UploadCloud, Image as ImageIcon } from "lucide-react";
import { CustomSnackbar } from "@/components/CustomSnackbar";
import { APP_STRINGS } from "@/lib/constants";

interface ImageUploadProps {
  imageUrl: string;
  setImageUrl: (url: string) => void;
  label?: string;
}

export function ImageUpload({ imageUrl, setImageUrl, label = "Upload Gambar / Foto" }: ImageUploadProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: "success" | "error" }>({ isOpen: false, message: "", type: "success" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
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
        setToast({ isOpen: true, message: "Gambar berhasil diunggah", type: "success" });
      } else {
        setToast({ isOpen: true, message: data.error || "Gagal mengunggah gambar", type: "error" });
      }
    } catch {
      setToast({ isOpen: true, message: "Terjadi kesalahan jaringan saat mengunggah", type: "error" });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    handleFile(e.target.files[0]);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div>
      <label className="block text-xs font-semibold mb-2">{label}</label>
      <div className="flex gap-4 items-start">
        {/* Preview Box */}
        <div 
          className={`shrink-0 w-24 h-24 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center overflow-hidden relative group transition-colors duration-200 cursor-pointer ${dragActive ? 'border-primary bg-primary/5' : 'border-glass-border hover:border-primary/50 bg-black/5 dark:bg-white/5'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploadingImage ? (
            <div className="animate-pulse flex flex-col items-center">
              <UploadCloud className="text-primary/50 mb-1 animate-bounce" size={24} />
              <span className="text-[10px] text-primary/70 font-medium">Uploading...</span>
            </div>
          ) : imageUrl ? (
            <>
              <img src={imageUrl} alt="Preview" className="w-full h-full object-cover group-hover:opacity-60 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <UploadCloud className="text-white drop-shadow-md" size={24} />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center text-foreground/40 group-hover:text-primary/70 transition-colors">
              <ImageIcon size={24} className="mb-1" />
              <span className="text-[10px] font-medium">Klik / Drop</span>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
        </div>

        {/* URL Input Fallback */}
        <div className="flex-1 space-y-2 mt-2">
          <p className="text-[10px] text-foreground/50">Unggah file langsung dari perangkat Anda, atau tempel URL gambar yang sudah ada di bawah ini.</p>
          <input 
            type="text" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
            placeholder={APP_STRINGS.common.uploadExternal} 
            className="w-full h-10 px-3 rounded-xl border glass-input text-sm text-foreground" 
          />
        </div>
      </div>
      <CustomSnackbar isOpen={toast.isOpen} message={toast.message} type={toast.type} onClose={() => setToast((t) => ({ ...t, isOpen: false }))} />
    </div>
  );
}
