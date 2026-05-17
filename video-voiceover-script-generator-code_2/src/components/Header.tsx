import { Mic, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-500/25">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                VoiceForge
              </h1>
              <p className="text-xs text-slate-400">AI Voiceover Script Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300 ring-1 ring-violet-500/20">
            <Sparkles className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Powered by AI</span>
          </div>
        </div>
      </div>
    </header>
  );
}
