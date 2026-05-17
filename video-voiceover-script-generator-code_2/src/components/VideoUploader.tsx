import { useCallback, useState, useRef } from 'react';
import { Upload, Film, X, FileVideo } from 'lucide-react';

interface VideoUploaderProps {
  onVideoUpload: (file: File, url: string, duration: number) => void;
  currentVideo: { file: File; url: string } | null;
  onRemoveVideo: () => void;
}

export default function VideoUploader({ onVideoUpload, currentVideo, onRemoveVideo }: VideoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('video/')) {
      alert('Please upload a video file.');
      return;
    }
    const url = URL.createObjectURL(file);
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      onVideoUpload(file, url, video.duration);
      URL.revokeObjectURL(video.src);
    };
    video.src = url;
  }, [onVideoUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  if (currentVideo) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-slate-300">Uploaded Video</h3>
          <button
            onClick={onRemoveVideo}
            className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 ring-1 ring-red-500/20 transition hover:bg-red-500/20"
          >
            <X className="h-3 w-3" />
            Remove
          </button>
        </div>
        <div className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-4 ring-1 ring-white/5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-violet-500/10">
            <FileVideo className="h-6 w-6 text-violet-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{currentVideo.file.name}</p>
            <p className="text-xs text-slate-400">{formatFileSize(currentVideo.file.size)}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-slate-300">Upload Video</h3>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`group relative cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-violet-400 bg-violet-500/10 scale-[1.02]'
            : 'border-slate-700 bg-slate-800/30 hover:border-violet-500/50 hover:bg-slate-800/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*"
          onChange={handleInputChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-4">
          <div className={`flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300 ${
            isDragging
              ? 'bg-violet-500/20 scale-110'
              : 'bg-slate-700/50 group-hover:bg-violet-500/10'
          }`}>
            {isDragging ? (
              <Film className="h-8 w-8 text-violet-400" />
            ) : (
              <Upload className="h-8 w-8 text-slate-400 group-hover:text-violet-400 transition-colors" />
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-200">
              {isDragging ? 'Drop your video here' : 'Drag & drop your video'}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              or click to browse · MP4, MOV, AVI, WebM
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-1.5 text-xs text-violet-300 ring-1 ring-violet-500/20">
            <Film className="h-3 w-3" />
            Any video up to 2GB
          </div>
        </div>
      </div>
    </div>
  );
}
