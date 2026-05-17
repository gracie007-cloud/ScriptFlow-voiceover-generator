import { Settings, Users, FileText, Clock, Palette, Volume2 } from 'lucide-react';
import type { ScriptStyle, ScriptTone } from '../utils/scriptGenerator';

export interface ScriptConfig {
  style: ScriptStyle;
  tone: ScriptTone;
  audience: string;
  description: string;
}

interface ScriptOptionsProps {
  config: ScriptConfig;
  onChange: (config: ScriptConfig) => void;
  duration: number;
  onGenerate: () => void;
  isGenerating: boolean;
  hasVideo: boolean;
}

const styles: { value: ScriptStyle; label: string; icon: string; desc: string }[] = [
  { value: 'documentary', label: 'Documentary', icon: '🎬', desc: 'Informative & narrative' },
  { value: 'commercial', label: 'Commercial', icon: '💼', desc: 'Persuasive & selling' },
  { value: 'tutorial', label: 'Tutorial', icon: '📚', desc: 'Educational & guiding' },
  { value: 'social-media', label: 'Social Media', icon: '📱', desc: 'Catchy & engaging' },
  { value: 'cinematic', label: 'Cinematic', icon: '🎥', desc: 'Epic & atmospheric' },
];

const tones: { value: ScriptTone; label: string; color: string }[] = [
  { value: 'professional', label: 'Professional', color: 'blue' },
  { value: 'casual', label: 'Casual', color: 'green' },
  { value: 'energetic', label: 'Energetic', color: 'yellow' },
  { value: 'dramatic', label: 'Dramatic', color: 'red' },
  { value: 'humorous', label: 'Humorous', color: 'purple' },
];

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function ScriptOptions({ config, onChange, duration, onGenerate, isGenerating, hasVideo }: ScriptOptionsProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-4 w-4 text-violet-400" />
        <h3 className="text-sm font-medium text-slate-300">Script Configuration</h3>
      </div>

      {/* Video duration info */}
      <div className="flex items-center gap-3 rounded-lg bg-slate-800/50 p-3 ring-1 ring-white/5">
        <Clock className="h-4 w-4 text-slate-400" />
        <div>
          <p className="text-xs text-slate-400">Video Duration</p>
          <p className="text-sm font-medium text-white">{formatDuration(duration)}</p>
        </div>
      </div>

      {/* Style Selection */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
          <Palette className="h-3.5 w-3.5" />
          Script Style
        </label>
        <div className="grid grid-cols-1 gap-2">
          {styles.map((style) => (
            <button
              key={style.value}
              onClick={() => onChange({ ...config, style: style.value })}
              className={`flex items-center gap-3 rounded-lg p-3 text-left transition-all ${
                config.style === style.value
                  ? 'bg-violet-500/15 ring-1 ring-violet-500/30'
                  : 'bg-slate-800/30 ring-1 ring-white/5 hover:bg-slate-800/50'
              }`}
            >
              <span className="text-lg">{style.icon}</span>
              <div>
                <p className={`text-sm font-medium ${config.style === style.value ? 'text-violet-300' : 'text-slate-300'}`}>
                  {style.label}
                </p>
                <p className="text-xs text-slate-500">{style.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Tone Selection */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
          <Volume2 className="h-3.5 w-3.5" />
          Tone
        </label>
        <div className="flex flex-wrap gap-2">
          {tones.map((tone) => (
            <button
              key={tone.value}
              onClick={() => onChange({ ...config, tone: tone.value })}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                config.tone === tone.value
                  ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/25'
                  : 'bg-slate-800/50 text-slate-400 ring-1 ring-white/10 hover:text-white'
              }`}
            >
              {tone.label}
            </button>
          ))}
        </div>
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
          <Users className="h-3.5 w-3.5" />
          Target Audience
        </label>
        <input
          type="text"
          value={config.audience}
          onChange={(e) => onChange({ ...config, audience: e.target.value })}
          placeholder="e.g., Marketing professionals, Gen Z, Beginners..."
          className="w-full rounded-lg border-0 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 ring-1 ring-white/10 focus:ring-2 focus:ring-violet-500/50 focus:outline-none transition-all"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
          <FileText className="h-3.5 w-3.5" />
          Video Description
        </label>
        <textarea
          value={config.description}
          onChange={(e) => onChange({ ...config, description: e.target.value })}
          placeholder="Describe your video content... What's it about? Key topics, products, or themes?"
          rows={4}
          className="w-full rounded-lg border-0 bg-slate-800/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 ring-1 ring-white/10 focus:ring-2 focus:ring-violet-500/50 focus:outline-none transition-all resize-none"
        />
      </div>

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={!hasVideo || isGenerating}
        className={`w-full rounded-xl py-3.5 text-sm font-semibold transition-all ${
          !hasVideo
            ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
            : isGenerating
            ? 'bg-violet-600/50 text-violet-200 cursor-wait'
            : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98]'
        }`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating Script...
          </span>
        ) : !hasVideo ? (
          'Upload a video to begin'
        ) : (
          <span className="flex items-center justify-center gap-2">
            ✨ Generate Voiceover Script
          </span>
        )}
      </button>
    </div>
  );
}
