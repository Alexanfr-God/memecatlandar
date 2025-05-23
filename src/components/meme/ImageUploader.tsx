import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ImageUploaderProps {
  imageUrl: string;
  onImageChange: (url: string) => void;
}

export const ImageUploader = ({ imageUrl, onImageChange }: ImageUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

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
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleFile = async (file?: File) => {
    if (!file) return;
    
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Error",
        description: "Please upload a PNG, JPEG, or GIF file.",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "File size must be less than 10MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from('memecardstore')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('memecardstore')
        .getPublicUrl(filePath);

      onImageChange(publicUrl);
      
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to upload image",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-4 h-80 flex flex-col items-center justify-center cursor-pointer transition-colors relative
        ${dragActive ? 'border-[#FF4500] bg-[#FF4500]/5' : 'border-gray-300 hover:border-[#FF4500] hover:bg-[#FF4500]/5'}
        ${imageUrl ? 'bg-gray-50' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={() => document.getElementById('file-upload')?.click()}
    >
      {isUploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
          <div className="text-white">Uploading...</div>
        </div>
      )}
      
      {imageUrl ? (
        <img src={imageUrl} alt="Preview" className="max-h-full object-contain" />
      ) : (
        <div className="text-center space-y-2">
          <p className="text-gray-500 font-serif">Click to upload image</p>
          <p className="text-sm text-gray-400">or drag and drop</p>
          <p className="text-xs text-gray-400 mt-2">PNG, JPEG, GIF (max 10MB)</p>
        </div>
      )}
      <input
        id="file-upload"
        type="file"
        accept="image/png,image/jpeg,image/gif"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
};