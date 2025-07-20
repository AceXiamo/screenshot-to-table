import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Icon } from "@iconify/react";

interface ImageUploaderProps {
  onImageUpload: (base64: string) => void;
  isLoading?: boolean;
}

export function ImageUploader({ onImageUpload, isLoading = false }: ImageUploaderProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(",")[1];
        onImageUpload(base64Data);
      };
      reader.readAsDataURL(file);
    },
    [onImageUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".webp"],
    },
    multiple: false,
    disabled: isLoading,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 group
        ${isDragActive 
          ? "border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50 scale-[1.02]" 
          : "border-slate-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-slate-50 hover:to-blue-50"
        }
        ${isLoading ? "opacity-75 cursor-wait" : "hover:shadow-lg hover:shadow-blue-500/10"}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-6">
        <div className={`
          p-4 rounded-2xl transition-all duration-300
          ${isLoading 
            ? "bg-gradient-to-br from-blue-100 to-indigo-100" 
            : isDragActive 
              ? "bg-gradient-to-br from-blue-100 to-indigo-100 scale-110" 
              : "bg-gradient-to-br from-slate-100 to-slate-150 group-hover:from-blue-100 group-hover:to-indigo-100 group-hover:scale-105"
          }
        `}>
          {isLoading ? (
            <Icon 
              icon="material-symbols:progress-activity" 
              className="w-12 h-12 text-blue-500 animate-spin" 
            />
          ) : (
            <Icon 
              icon="material-symbols:image" 
              className={`w-12 h-12 transition-colors duration-300 ${
                isDragActive ? "text-blue-500" : "text-slate-400 group-hover:text-blue-500"
              }`} 
            />
          )}
        </div>
        
        <div className="space-y-2">
          <p className={`text-xl font-light transition-colors duration-300 ${
            isLoading 
              ? "text-blue-600" 
              : isDragActive 
                ? "text-blue-600" 
                : "text-slate-700 group-hover:text-blue-600"
          }`}>
            {isLoading 
              ? "正在分析图片..." 
              : isDragActive 
                ? "释放鼠标上传" 
                : "上传截图"
            }
          </p>
          {!isLoading && (
            <p className="text-sm text-slate-500 font-light">
              支持 PNG、JPG、JPEG 等格式
            </p>
          )}
        </div>
      </div>

      {/* 装饰性元素 */}
      <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300">
        <Icon icon="material-symbols:upload" className="w-6 h-6 text-slate-400" />
      </div>
    </div>
  );
}