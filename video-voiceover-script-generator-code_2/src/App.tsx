import { useState, useCallback } from 'react';
import { Wand2, Video, FileText, ArrowRight } from 'lucide-react';
import Header from './components/Header';
import VideoUploader from './components/VideoUploader';
import VideoPreview from './components/VideoPreview';
import ScriptOptions, { type ScriptConfig } from './components/ScriptOptions';
import ScriptOutput from './components/ScriptOutput';
import { generateScript, type GeneratedScript } from './utils/scriptGenerator';

type AppStep = 'upload' | 'configure' | 'result';

export default function App() {
  const [step, setStep] = useState<AppStep>('upload');
  const [video, setVideo] = useState<{ file: File; url: string; duration: number } | null>(null);
  const [scriptConfig, setScriptConfig] = useState<ScriptConfig>({
    style: 'documentary',
    tone: 'professional',
    audience: '',
    description: '',
  });
  const [generatedScript, setGeneratedScript] = useState<GeneratedScript | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleVideoUpload = useCallback((file: File, url: string, duration: number) => {
    setVideo({ file, url, duration });
    setStep('configure');
  }, []);

  const handleRemoveVideo = useCallback(() => {
    if (video?.url) URL.revokeObjectURL(video.url);
    setVideo(null);
    setGeneratedScript(null);
    setStep('upload');
  }, [video]);

  const handleGenerate = useCallback(() => {
    if (!video) return;
    setIsGenerating(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const script = generateScript({
        style: scriptConfig.style,
        tone: scriptConfig.tone,
        audience: scriptConfig.audience,
        description: scriptConfig.description,
        duration: video.duration,
        fileName: video.file.name,
      });
      setGeneratedScript(script);
      setIsGenerating(false);
      setStep('result');
    }, 2000 + Math.random() * 1500);
  }, [video, scriptConfig]);

  const handleRegenerate = useCallback(() => {
    handleGenerate();
  }, [handleGenerate]);

  const handleNewVideo = useCallback(() => {
    handleRemoveVideo();
  }, [handleRemoveVideo]);

  const handleBackToConfigure = useCallback(() => {
    setStep('configure');
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Header />

      {/* Progress Bar */}
      <div className="border-b border-white/5 bg-slate-900/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-4">
            {[
              { key: 'upload', label: 'Upload', icon: Video },
              { key: 'configure', label: 'Configure', icon: Wand2 },
              { key: 'result', label: 'Script', icon: FileText },
            ].map((s, i) => {
              const stepOrder = ['upload', 'configure', 'result'] as AppStep[];
              const currentIndex = stepOrder.indexOf(step);
              const thisIndex = stepOrder.indexOf(s.key as AppStep);
              const isActive = s.key === step;
              const isCompleted = thisIndex < currentIndex;

              return (
                <div key={s.key} className="flex items-center">
                  <button
                    onClick={() => {
                      if (isCompleted || (s.key === 'configure' && video)) {
                        setStep(s.key as AppStep);
                      }
                    }}
                    disabled={!isCompleted && !(s.key === 'configure' && video)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-violet-500/15 text-violet-300'
                        : isCompleted
                        ? 'text-slate-400 hover:text-white cursor-pointer'
                        : 'text-slate-600 cursor-not-allowed'
                    }`}
                  >
                    <s.icon className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{s.label}</span>
                    {isCompleted && <Check className="h-3 w-3 text-green-400" />}
                  </button>
                  {i < 2 && (
                    <ArrowRight className="mx-1 h-3 w-3 text-slate-700" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div className="mx-auto max-w-2xl">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Create Your Voiceover Script
                </h2>
                <p className="mt-3 text-base text-slate-400">
                  Upload a video and let AI generate a professional voiceover script tailored to your content.
                </p>
              </div>

              {/* Features grid */}
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  {
                    icon: '🎬',
                    title: '5 Script Styles',
                    desc: 'Documentary, Commercial, Tutorial, Social Media, Cinematic',
                  },
                  {
                    icon: '🎭',
                    title: '5 Tone Options',
                    desc: 'Professional, Casual, Energetic, Dramatic, Humorous',
                  },
                  {
                    icon: '🔊',
                    title: 'Audio Preview',
                    desc: 'Listen to your script with built-in text-to-speech',
                  },
                ].map((feature) => (
                  <div
                    key={feature.title}
                    className="rounded-xl bg-slate-800/30 p-4 ring-1 ring-white/5 text-center"
                  >
                    <span className="text-2xl">{feature.icon}</span>
                    <h3 className="mt-2 text-sm font-semibold text-white">{feature.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">{feature.desc}</p>
                  </div>
                ))}
              </div>

              <VideoUploader
                onVideoUpload={handleVideoUpload}
                currentVideo={video ? { file: video.file, url: video.url } : null}
                onRemoveVideo={handleRemoveVideo}
              />
            </div>
          )}

          {/* Step 2: Configure */}
          {step === 'configure' && video && (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Left: Video Preview & Upload */}
              <div className="space-y-6">
                <VideoPreview url={video.url} duration={video.duration} />
                <div className="border-t border-white/5 pt-6">
                  <VideoUploader
                    onVideoUpload={handleVideoUpload}
                    currentVideo={{ file: video.file, url: video.url }}
                    onRemoveVideo={handleRemoveVideo}
                  />
                </div>
              </div>

              {/* Right: Script Options */}
              <div className="rounded-2xl bg-slate-800/20 p-6 ring-1 ring-white/5">
                <ScriptOptions
                  config={scriptConfig}
                  onChange={setScriptConfig}
                  duration={video.duration}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  hasVideo={!!video}
                />
              </div>
            </div>
          )}

          {/* Step 3: Result */}
          {step === 'result' && generatedScript && (
            <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
              {/* Left: Video preview (smaller) */}
              <div className="xl:col-span-1 space-y-4">
                <div className="rounded-2xl bg-slate-800/20 p-4 ring-1 ring-white/5 space-y-4">
                  <VideoPreview url={video!.url} duration={video!.duration} />
                  <div className="flex gap-2">
                    <button
                      onClick={handleBackToConfigure}
                      className="flex-1 rounded-lg bg-slate-800/50 px-3 py-2 text-xs font-medium text-slate-300 ring-1 ring-white/10 transition-all hover:bg-slate-800"
                    >
                      ← Edit Options
                    </button>
                    <button
                      onClick={handleNewVideo}
                      className="flex-1 rounded-lg bg-slate-800/50 px-3 py-2 text-xs font-medium text-slate-300 ring-1 ring-white/10 transition-all hover:bg-slate-800"
                    >
                      + New Video
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Script Output */}
              <div className="xl:col-span-2">
                <div className="rounded-2xl bg-slate-800/20 p-6 ring-1 ring-white/5">
                  <ScriptOutput
                    script={generatedScript}
                    onRegenerate={handleRegenerate}
                    isGenerating={isGenerating}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Generating overlay */}
          {isGenerating && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-6 rounded-2xl bg-slate-900 p-12 ring-1 ring-white/10 shadow-2xl">
                <div className="relative">
                  <div className="h-20 w-20 rounded-full border-4 border-slate-700" />
                  <div className="absolute inset-0 h-20 w-20 animate-spin rounded-full border-4 border-transparent border-t-violet-500" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Wand2 className="h-8 w-8 text-violet-400 animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-white">Generating Your Script</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Analyzing video and crafting voiceover...
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:0ms]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:150ms]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-slate-950/50">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs text-slate-600">
            VoiceForge — AI-Powered Voiceover Script Generator. Crafted with care.
          </p>
        </div>
      </footer>
    </div>
  );
}

function Check({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
