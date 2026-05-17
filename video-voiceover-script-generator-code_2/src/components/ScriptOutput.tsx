import { useState, useCallback, useRef, useEffect } from 'react';
import {
  Copy,
  Check,
  Download,
  RotateCcw,
  Volume2,
  Square,
  ChevronDown,
  ChevronUp,
  Edit3,
  FileText,
  Clock,
  Hash,
  Info,
} from 'lucide-react';
import type { GeneratedScript, ScriptSection } from '../utils/scriptGenerator';

interface ScriptOutputProps {
  script: GeneratedScript;
  onRegenerate: () => void;
  isGenerating: boolean;
}

export default function ScriptOutput({ script, onRegenerate, isGenerating }: ScriptOutputProps) {
  const [sections, setSections] = useState<ScriptSection[]>(script.sections);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(script.sections.map(s => s.id)));
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentSpeakSection, setCurrentSpeakSection] = useState<string | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setSections(script.sections);
    setExpandedSections(new Set(script.sections.map(s => s.id)));
  }, [script]);

  useEffect(() => {
    if (editingId && textAreaRef.current) {
      textAreaRef.current.focus();
      textAreaRef.current.style.height = 'auto';
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + 'px';
    }
  }, [editingId]);

  const handleCopy = useCallback(async () => {
    const fullText = sections
      .map((s) => `[${s.label}] (${s.timestamp})\n${s.content}`)
      .join('\n\n---\n\n');
    await navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [sections]);

  const handleDownload = useCallback(() => {
    const fullText = `${script.title}\n${'='.repeat(script.title.length)}\n\n`;
    const meta = `Duration: ${script.estimatedDuration} | Words: ${script.totalWords}\n\n`;
    const notes = `${script.notes}\n\n${'─'.repeat(40)}\n\n`;
    const body = sections
      .map((s) => `[${s.label}]\nTimestamp: ${s.timestamp}\n\n${s.content}`)
      .join('\n\n' + '─'.repeat(40) + '\n\n');

    const content = fullText + meta + notes + body;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'voiceover-script.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [script, sections]);

  const startEdit = (section: ScriptSection) => {
    setEditingId(section.id);
    setEditValue(section.content);
  };

  const saveEdit = () => {
    if (editingId) {
      setSections(sections.map(s => s.id === editingId ? { ...s, content: editValue } : s));
      setEditingId(null);
      setEditValue('');
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const speakSection = (section: ScriptSection) => {
    if (isSpeaking && currentSpeakSection === section.id) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakSection(null);
      return;
    }

    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(section.content);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakSection(section.id);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakSection(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakSection(null);
    };
    speechSynthesis.speak(utterance);
  };

  const speakAll = () => {
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      setCurrentSpeakSection(null);
      return;
    }

    const fullText = sections.map(s => s.content).join('. ');
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.9;
    utterance.onstart = () => {
      setIsSpeaking(true);
      setCurrentSpeakSection('all');
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setCurrentSpeakSection(null);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setCurrentSpeakSection(null);
    };
    speechSynthesis.speak(utterance);
  };

  const totalWords = sections.reduce((acc, s) => acc + s.content.split(/\s+/).length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">{script.title}</h2>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {script.estimatedDuration}
            </span>
            <span className="flex items-center gap-1">
              <Hash className="h-3 w-3" />
              {totalWords} words
            </span>
            <span className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {sections.length} sections
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={speakAll}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
              isSpeaking && currentSpeakSection === 'all'
                ? 'bg-red-500/15 text-red-400 ring-1 ring-red-500/20'
                : 'bg-slate-800/50 text-slate-300 ring-1 ring-white/10 hover:bg-slate-800'
            }`}
          >
            {isSpeaking && currentSpeakSection === 'all' ? (
              <>
                <Square className="h-3 w-3" />
                Stop
              </>
            ) : (
              <>
                <Volume2 className="h-3 w-3" />
                Preview All
              </>
            )}
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800/50 px-3 py-2 text-xs font-medium text-slate-300 ring-1 ring-white/10 transition-all hover:bg-slate-800"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-green-400" />
                <span className="text-green-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-lg bg-slate-800/50 px-3 py-2 text-xs font-medium text-slate-300 ring-1 ring-white/10 transition-all hover:bg-slate-800"
          >
            <Download className="h-3 w-3" />
            Download
          </button>
          <button
            onClick={onRegenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 rounded-lg bg-violet-500/10 px-3 py-2 text-xs font-medium text-violet-300 ring-1 ring-violet-500/20 transition-all hover:bg-violet-500/20 disabled:opacity-50"
          >
            <RotateCcw className={`h-3 w-3 ${isGenerating ? 'animate-spin' : ''}`} />
            Regenerate
          </button>
        </div>
      </div>

      {/* Notes */}
      <div className="flex items-start gap-2 rounded-lg bg-indigo-500/5 p-3 ring-1 ring-indigo-500/10">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-indigo-400" />
        <p className="text-xs text-indigo-300/80">{script.notes}</p>
      </div>

      {/* Script Sections */}
      <div className="space-y-3">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="rounded-xl bg-slate-800/30 ring-1 ring-white/5 overflow-hidden transition-all"
          >
            {/* Section header */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-800/50 transition-colors"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10 text-xs font-bold text-violet-400">
                  {index + 1}
                </span>
                <div>
                  <h4 className="text-sm font-medium text-white">{section.label}</h4>
                  <p className="text-xs text-slate-500">{section.timestamp}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {editingId !== section.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      startEdit(section);
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-700 hover:text-slate-300"
                  >
                    <Edit3 className="h-3 w-3" />
                  </button>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    speakSection(section);
                  }}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                    isSpeaking && currentSpeakSection === section.id
                      ? 'bg-red-500/10 text-red-400'
                      : 'text-slate-500 hover:bg-slate-700 hover:text-slate-300'
                  }`}
                >
                  {isSpeaking && currentSpeakSection === section.id ? (
                    <Square className="h-3 w-3" />
                  ) : (
                    <Volume2 className="h-3 w-3" />
                  )}
                </button>
                {expandedSections.has(section.id) ? (
                  <ChevronUp className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                )}
              </div>
            </div>

            {/* Section content */}
            {expandedSections.has(section.id) && (
              <div className="border-t border-white/5 px-4 py-4">
                {editingId === section.id ? (
                  <div className="space-y-3">
                    <textarea
                      ref={textAreaRef}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-full rounded-lg bg-slate-900/50 p-3 text-sm text-slate-200 ring-1 ring-violet-500/30 focus:ring-2 focus:ring-violet-500/50 focus:outline-none resize-none min-h-[100px]"
                    />
                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="rounded-lg bg-slate-700/50 px-4 py-1.5 text-xs font-medium text-slate-300 transition-all hover:bg-slate-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="rounded-lg bg-violet-600 px-4 py-1.5 text-xs font-medium text-white transition-all hover:bg-violet-500"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-line">
                    {section.content}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
