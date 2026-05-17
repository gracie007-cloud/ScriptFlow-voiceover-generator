const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const state = {
  screen: "dashboard",
  dark: false,
  selectedExport: "srt",
  processingProgress: 0,
  processingTimer: null,
  playTimer: null,
  isPlaying: false,
  currentTime: 0,
  activeSegment: 0,
  uploadedVideo: null,
  unreadNotifications: true,
  searchQuery: "",
  settingsTab: "appearance",
};

const sampleProjects = [
  {
    id: 1,
    title: "Product Demo Video V2",
    edited: "Last edited 2 hours ago",
    status: "complete",
    thumb: "product",
    duration: "03:24",
    format: "MP4",
  },
  {
    id: 2,
    title: "Marketing Campaign Q4",
    edited: "Last edited yesterday",
    status: "processing",
    thumb: "campaign",
    duration: "01:45",
    format: "MOV",
  },
  {
    id: 3,
    title: "Training Module 1 - Intro",
    edited: "Last edited Mar 15, 2026",
    status: "complete",
    thumb: "training",
    duration: "08:30",
    format: "MP4",
  },
  {
    id: 4,
    title: "Course Sales Page Walkthrough",
    edited: "Last edited Apr 2, 2026",
    status: "complete",
    thumb: "product",
    duration: "06:42",
    format: "WebM",
  },
];

const notifications = [
  { type: "success", title: "Script generation complete", desc: "Product Demo Video V2 is ready to review", read: false },
  { type: "progress", title: "Processing in progress", desc: "Marketing Campaign Q4 is 67% complete", read: false },
  { type: "info", title: "Export ready", desc: "Your PDF export is ready to download", read: true },
  { type: "warning", title: "Storage at 80%", desc: "Consider archiving older projects", read: true },
];

const processingSteps = [
  "Uploading video",
  "Extracting visual frames",
  "Analyzing scene composition",
  "Detecting on-screen text and objects",
  "Generating voiceover script",
  "Synchronizing timestamps",
  "Finalizing quality check",
];

const exportFormats = [
  { id: "txt", name: "Plain Text", ext: ".txt", desc: "Plain text proof of your script", icon: "file" },
  { id: "docx", name: "Microsoft Word", ext: ".docx", desc: "Formatted document handoff", icon: "doc" },
  { id: "pdf", name: "PDF Document", ext: ".pdf", desc: "Print-ready script package", icon: "pdf" },
  { id: "srt", name: "Subtitle File", ext: ".srt", desc: "Timed subtitle format", icon: "sub" },
  { id: "json", name: "JSON", ext: ".json", desc: "Structured timestamp data", icon: "code" },
  { id: "csv", name: "CSV", ext: ".csv", desc: "Spreadsheet-compatible table", icon: "table" },
];

let scriptSegments = [
  {
    time: "00:00",
    end: "00:08",
    text: "Welcome to ScriptFlow, the intelligent workspace that turns your video into a clear, natural voiceover script.",
    scene: "Title card with brand mark and opening motion.",
  },
  {
    time: "00:08",
    end: "00:18",
    text: "Start by uploading your footage. ScriptFlow reads the visuals, detects transitions, and identifies the story beats that matter.",
    scene: "Dashboard overview with upload area and recent projects.",
  },
  {
    time: "00:18",
    end: "00:28",
    text: "The generator maps each scene to a concise narration line, so your voiceover follows what viewers are seeing on screen.",
    scene: "AI analysis with waveform and processing checklist.",
  },
  {
    time: "00:28",
    end: "00:38",
    text: "Review each timestamped segment, tune the wording, and keep the pacing aligned with the video timeline.",
    scene: "Split editor with synced script segments.",
  },
  {
    time: "00:38",
    end: "00:48",
    text: "When the script is ready, export it as plain text, subtitles, a document, or structured data for your production workflow.",
    scene: "Export modal with format choices.",
  },
  {
    time: "00:48",
    end: "00:55",
    text: "ScriptFlow helps creators move from raw video to polished narration with less friction and more control.",
    scene: "Closing card with finished script status.",
  },
];

function icon(name) {
  const icons = {
    play: '<svg viewBox="0 0 24 24"><path d="m8 5 11 7-11 7Z"/></svg>',
    edit: '<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    down: '<svg viewBox="0 0 24 24"><path d="M12 3v12"/><path d="m7 10 5 5 5-5"/><path d="M5 21h14"/></svg>',
    more: '<svg viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="m20 6-11 11-5-5"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    file: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>',
    doc: '<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4Z"/><path d="M8 8h8"/><path d="M8 12h8"/><path d="M8 16h5"/></svg>',
    pdf: '<svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/><path d="M8 17c2-5 5-5 8 0"/><path d="M9 13h6"/></svg>',
    sub: '<svg viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 13h4"/><path d="M13 13h4"/><path d="M7 16h8"/></svg>',
    code: '<svg viewBox="0 0 24 24"><path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 4-4 16"/></svg>',
    table: '<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18"/><path d="M9 4v16"/><path d="M15 4v16"/></svg>',
    success: '<svg viewBox="0 0 24 24"><path d="m20 6-11 11-5-5"/></svg>',
    progress: '<svg viewBox="0 0 24 24"><path d="M21 12a9 9 0 1 1-2.64-6.36"/><path d="M21 3v6h-6"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><path d="M12 8h.01"/></svg>',
    warning: '<svg viewBox="0 0 24 24"><path d="m12 3 10 18H2Z"/><path d="M12 9v5"/><path d="M12 17h.01"/></svg>',
  };
  return icons[name] || icons.file;
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function formatBytes(bytes) {
  if (!bytes) return "450 MB";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toFixed(size >= 10 ? 0 : 1)} ${units[unit]}`;
}

function secondsToStamp(seconds) {
  const safe = Math.max(0, Math.floor(seconds));
  return `${String(Math.floor(safe / 60)).padStart(2, "0")}:${String(safe % 60).padStart(2, "0")}`;
}

function stampToSeconds(stamp) {
  const [minutes, seconds] = stamp.split(":").map(Number);
  return minutes * 60 + seconds;
}

function getScriptText() {
  return scriptSegments
    .map((segment) => `[${segment.time}] ${segment.text}\nScene: ${segment.scene}`)
    .join("\n\n");
}

function generateScriptForProject(projectTitle) {
  const style = $("#scriptStyle").value.toLowerCase();
  const tone = $("#tone").value.toLowerCase();
  const audience = $("#audience").value.trim() || "the target viewer";
  const title = projectTitle.replace(/\.[a-z0-9]+$/i, "").replace(/[_-]+/g, " ");
  scriptSegments = [
    {
      time: "00:00",
      end: "00:08",
      text: `Open with the key promise of ${title}, using a ${tone} voice that immediately orients ${audience}.`,
      scene: "Opening frame with title, product, or speaker introduction.",
    },
    {
      time: "00:08",
      end: "00:18",
      text: `Show the main problem clearly, then connect the visual action to why this ${style} matters right now.`,
      scene: "Problem context and first visual demonstration.",
    },
    {
      time: "00:18",
      end: "00:28",
      text: "Move through the central steps one at a time, naming what the viewer sees and why each step moves the story forward.",
      scene: "Step-by-step footage with interface or process details.",
    },
    {
      time: "00:28",
      end: "00:38",
      text: "Highlight the proof point on screen, then translate it into a practical result the viewer can understand quickly.",
      scene: "Result, before-and-after state, chart, demo, or customer outcome.",
    },
    {
      time: "00:38",
      end: "00:48",
      text: "Summarize the transformation in one sentence, keeping the pacing natural and the language easy to record.",
      scene: "Wrap-up sequence with final product or lesson recap.",
    },
    {
      time: "00:48",
      end: "00:55",
      text: "Close with a clear next step that matches the video goal without sounding forced or overproduced.",
      scene: "Final frame with call to action or branded outro.",
    },
  ];
}

function switchScreen(screen) {
  state.screen = screen;
  $$(".screen").forEach((node) => node.classList.remove("active"));
  $(`#${screen}Screen`)?.classList.add("active");
  $$(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.screen === screen));
  if (screen === "editor") {
    renderSegments();
    stopPlayback();
  }
  if (screen === "projects") renderProjectBoard();
  if (screen === "settings") renderSettings();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderProjects() {
  const query = state.searchQuery.toLowerCase();
  const filtered = sampleProjects.filter((project) => project.title.toLowerCase().includes(query));
  const target = $("#recentProjects");
  target.innerHTML = filtered.slice(0, 4).map((project) => projectCard(project)).join("");
  target.querySelectorAll("[data-open-project]").forEach((button) => {
    button.addEventListener("click", () => openProject(Number(button.dataset.openProject)));
  });
}

function projectCard(project) {
  return `
    <article class="project-card">
      <div class="project-thumb ${project.thumb}" aria-hidden="true">${icon("play")}</div>
      <div class="project-info">
        <strong>${project.title}</strong>
        <span>${project.edited}</span>
      </div>
      <div class="project-actions">
        <button type="button" title="Edit" aria-label="Edit ${project.title}" data-open-project="${project.id}">${icon("edit")}</button>
        <button type="button" title="Download" aria-label="Download ${project.title}" data-download-project="${project.id}">${icon("down")}</button>
        <button type="button" title="More" aria-label="More actions">${icon("more")}</button>
      </div>
    </article>
  `;
}

function renderProjectBoard() {
  const query = state.searchQuery.toLowerCase();
  const filtered = sampleProjects.filter((project) => project.title.toLowerCase().includes(query));
  $("#projectBoard").innerHTML = filtered
    .map(
      (project) => `
      <article class="project-board-card">
        <div class="project-thumb ${project.thumb}" aria-hidden="true">${icon("play")}</div>
        <div class="project-info">
          <strong>${project.title}</strong>
          <span>${project.edited}</span>
        </div>
        <div class="status-row">
          <span>${project.duration} / ${project.format}</span>
          <span class="status-pill ${project.status === "processing" ? "processing" : ""}">${project.status}</span>
        </div>
        <button class="ghost-action" type="button" data-open-project="${project.id}">Open Editor</button>
      </article>
    `,
    )
    .join("");
  $("#projectBoard").querySelectorAll("[data-open-project]").forEach((button) => {
    button.addEventListener("click", () => openProject(Number(button.dataset.openProject)));
  });
}

function openProject(id) {
  const project = sampleProjects.find((item) => item.id === id) || sampleProjects[0];
  generateScriptForProject(project.title);
  state.uploadedVideo = {
    name: `${project.title.replace(/\s+/g, "_")}.mp4`,
    size: 450 * 1024 * 1024,
    duration: project.duration,
    url: null,
    format: project.format,
  };
  populateVideoMetadata();
  switchScreen("editor");
  showToast(`${project.title} opened`);
}

function renderNotifications() {
  $("#notificationList").innerHTML = notifications
    .map(
      (notice) => `
      <div class="notice-item">
        <span class="notice-icon">${icon(notice.type)}</span>
        <div>
          <strong>${notice.title}</strong>
          <span>${notice.desc}</span>
        </div>
        ${notice.read || !state.unreadNotifications ? "" : '<span class="notice-dot"></span>'}
      </div>
    `,
    )
    .join("");
}

function beginProcessing(fileInfo) {
  state.uploadedVideo = fileInfo || {
    name: "My_Video_Project.mp4",
    size: 450 * 1024 * 1024,
    duration: "14:32",
    url: null,
    format: "MP4",
  };
  generateScriptForProject(state.uploadedVideo.name);
  populateVideoMetadata();
  switchScreen("processing");
  startProcessing();
}

function populateVideoMetadata() {
  const video = state.uploadedVideo || {};
  $("#processingFileName").textContent = video.name || "My_Video_Project.mp4";
  $("#videoDuration").textContent = video.duration || "14:32";
  $("#videoSize").textContent = formatBytes(video.size);
  $("#videoFormat").textContent = video.format || "MP4";

  [$("#videoPreview"), $("#editorVideo")].forEach((node) => {
    if (!node) return;
    if (video.url) {
      node.src = video.url;
      node.classList.add("has-source");
      node.closest(".video-window, .large-video")?.querySelector(".video-placeholder")?.remove();
    } else {
      node.removeAttribute("src");
      node.classList.remove("has-source");
    }
  });
}

function startProcessing() {
  window.clearInterval(state.processingTimer);
  state.processingProgress = 0;
  updateProcessing();
  state.processingTimer = window.setInterval(() => {
    state.processingProgress = Math.min(100, state.processingProgress + 2);
    updateProcessing();
    if (state.processingProgress >= 100) {
      window.clearInterval(state.processingTimer);
      window.setTimeout(() => {
        switchScreen("editor");
        showToast("Script generation complete");
      }, 650);
    }
  }, 95);
}

function updateProcessing() {
  const progress = state.processingProgress;
  $("#progressNumber").textContent = `${progress}%`;
  $("#progressFill").style.width = `${progress}%`;
  $("#progressLabel").textContent = progress < 30 ? "Analyzing video structure..." : progress < 72 ? "Generating narration..." : "Formatting timestamps...";
  $("#etaLabel").textContent = progress < 55 ? "Estimated time remaining: ~2 minutes" : progress < 92 ? "Estimated time remaining: less than 1 minute" : "Final quality check";
  const activeIndex = Math.min(processingSteps.length - 1, Math.floor(progress / (100 / processingSteps.length)));
  $("#stepGrid").innerHTML = processingSteps
    .map((step, index) => {
      const status = index < activeIndex ? "complete" : index === activeIndex ? "active" : "pending";
      const stateIcon = status === "complete" ? icon("check") : status === "active" ? icon("progress") : icon("clock");
      return `
        <div class="step-item ${status}">
          <span class="step-state">${stateIcon}</span>
          <div><strong>${step}</strong><span>${status === "complete" ? "Complete" : status === "active" ? "In progress" : "Waiting"}</span></div>
        </div>
      `;
    })
    .join("");
}

function renderSegments() {
  const target = $("#segments");
  target.innerHTML = scriptSegments
    .map(
      (segment, index) => `
      <article class="segment ${index === state.activeSegment ? "active" : ""}" data-segment="${index}">
        <div class="segment-head">
          <span>[${segment.time}] - [${segment.end}]</span>
          <div class="segment-tools">
            <button type="button" title="Copy segment" data-copy-segment="${index}">${icon("file")}</button>
            <button type="button" title="Set active" data-set-segment="${index}">${icon("play")}</button>
          </div>
        </div>
        <textarea data-edit-segment="${index}">${segment.text}</textarea>
        <p class="segment-scene">${segment.scene}</p>
      </article>
    `,
    )
    .join("");

  target.querySelectorAll("[data-edit-segment]").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      scriptSegments[Number(textarea.dataset.editSegment)].text = textarea.value;
      updateScriptStats();
      persistDraft();
    });
  });
  target.querySelectorAll("[data-copy-segment]").forEach((button) => {
    button.addEventListener("click", () => copyText(scriptSegments[Number(button.dataset.copySegment)].text, "Segment copied"));
  });
  target.querySelectorAll("[data-set-segment]").forEach((button) => {
    button.addEventListener("click", () => setActiveSegment(Number(button.dataset.setSegment)));
  });
  updateScriptStats();
  updateEditorTime();
}

function updateScriptStats() {
  const words = scriptSegments.reduce((sum, segment) => sum + segment.text.split(/\s+/).filter(Boolean).length, 0);
  $("#wordCount").textContent = words;
  $("#segmentCount").textContent = scriptSegments.length;
}

function setActiveSegment(index) {
  state.activeSegment = Math.max(0, Math.min(scriptSegments.length - 1, index));
  state.currentTime = stampToSeconds(scriptSegments[state.activeSegment].time);
  renderSegments();
}

function updateEditorTime() {
  $("#editorTimeDisplay").textContent = secondsToStamp(state.currentTime);
  $("#timelineRange").value = state.currentTime;
  const iconTarget = $("#playIcon");
  iconTarget.outerHTML = state.isPlaying
    ? '<svg viewBox="0 0 24 24" id="playIcon"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>'
    : '<svg viewBox="0 0 24 24" id="playIcon"><path d="m8 5 11 7-11 7Z"/></svg>';
}

function startPlayback() {
  if (state.isPlaying) return;
  state.isPlaying = true;
  const video = $("#editorVideo");
  if (video.classList.contains("has-source")) {
    video.playbackRate = Number($("#speedSelect").value);
    video.play().catch(() => {});
  }
  state.playTimer = window.setInterval(() => {
    state.currentTime += 1;
    if (state.currentTime > 55) {
      stopPlayback();
      state.currentTime = 0;
    }
    const found = scriptSegments.findIndex((segment) => state.currentTime >= stampToSeconds(segment.time) && state.currentTime < stampToSeconds(segment.end));
    if (found !== -1 && found !== state.activeSegment) state.activeSegment = found;
    renderSegments();
  }, 1000 / Number($("#speedSelect").value));
  updateEditorTime();
}

function stopPlayback() {
  state.isPlaying = false;
  window.clearInterval(state.playTimer);
  $("#editorVideo")?.pause();
  updateEditorTime();
}

function togglePlayback() {
  if (state.isPlaying) stopPlayback();
  else startPlayback();
}

async function copyText(value, message) {
  try {
    await navigator.clipboard.writeText(value);
  } catch {
    const temp = document.createElement("textarea");
    temp.value = value;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();
  }
  showToast(message);
}

function renderExportFormats() {
  $("#exportFormats").innerHTML = exportFormats
    .map(
      (format) => `
      <button class="export-card ${format.id === state.selectedExport ? "active" : ""}" type="button" data-export-format="${format.id}">
        ${icon(format.icon)}
        <strong>${format.name} (${format.ext})</strong>
        <span>${format.desc}</span>
      </button>
    `,
    )
    .join("");
  $("#exportFormats").querySelectorAll("[data-export-format]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedExport = button.dataset.exportFormat;
      renderExportFormats();
    });
  });
}

function downloadExport() {
  const format = exportFormats.find((item) => item.id === state.selectedExport) || exportFormats[0];
  const includeTimestamps = $("#includeTimestamps").checked;
  const includeScenes = $("#includeScenes").checked;
  let content = "";
  if (format.id === "json") {
    content = JSON.stringify({ title: state.uploadedVideo?.name || "ScriptFlow Script", segments: scriptSegments }, null, 2);
  } else if (format.id === "csv") {
    content = "start,end,text,scene\n" + scriptSegments.map((segment) => `"${segment.time}","${segment.end}","${segment.text.replaceAll('"', '""')}","${segment.scene.replaceAll('"', '""')}"`).join("\n");
  } else if (format.id === "srt") {
    content = scriptSegments
      .map((segment, index) => `${index + 1}\n00:${segment.time},000 --> 00:${segment.end},000\n${segment.text}`)
      .join("\n\n");
  } else {
    content = scriptSegments
      .map((segment) => {
        const stamp = includeTimestamps ? `[${segment.time}] ` : "";
        const scene = includeScenes ? `\nScene: ${segment.scene}` : "";
        return `${stamp}${segment.text}${scene}`;
      })
      .join("\n\n");
  }

  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `scriptflow-export${format.ext}`;
  link.click();
  URL.revokeObjectURL(link.href);
  $("#exportModal").close();
  showToast(`${format.name} export ready`);
}

function renderSettings() {
  const panels = {
    appearance: `
      <h2>Appearance</h2>
      <div class="setting-grid">
        <div class="setting-card"><strong>Theme</strong><p>Choose the workspace display mode.</p><select id="themeSelect"><option>Light</option><option>Dark</option><option>System</option></select></div>
        <div class="setting-card"><strong>Font Size</strong><p>Adjust editor and interface text density.</p><select><option>Medium</option><option>Large</option><option>Compact</option></select></div>
        <div class="setting-card"><strong>Reduced Motion</strong><p>Limit progress and transition animation.</p><label class="toggle-line"><input type="checkbox" /> Reduce animations</label></div>
        <div class="setting-card"><strong>Editor Layout</strong><p>Keep video and script in a synchronized split view.</p><select><option>Split view</option><option>Script focus</option><option>Video focus</option></select></div>
      </div>
    `,
    voice: `
      <h2>Voice and Language</h2>
      <div class="setting-grid">
        <div class="setting-card"><strong>Language</strong><p>Default language for generated scripts.</p><select><option>English</option><option>Spanish</option><option>French</option></select></div>
        <div class="setting-card"><strong>Tone Preset</strong><p>Default narration tone.</p><select><option>Professional</option><option>Warm</option><option>Energetic</option></select></div>
        <div class="setting-card"><strong>Reading Pace</strong><p>Words per minute target.</p><select><option>145 WPM</option><option>160 WPM</option><option>180 WPM</option></select></div>
        <div class="setting-card"><strong>Speaker Labels</strong><p>Use speaker labels for interview footage.</p><label class="toggle-line"><input type="checkbox" /> Include labels</label></div>
      </div>
    `,
    export: `
      <h2>Export</h2>
      <div class="setting-grid">
        <div class="setting-card"><strong>Default Format</strong><p>Preferred export type.</p><select><option>SRT</option><option>PDF</option><option>DOCX</option><option>TXT</option></select></div>
        <div class="setting-card"><strong>Timestamps</strong><p>Include timestamps by default.</p><label class="toggle-line"><input type="checkbox" checked /> Include timestamps</label></div>
        <div class="setting-card"><strong>Scene Notes</strong><p>Include visual context in exports.</p><label class="toggle-line"><input type="checkbox" checked /> Include scene descriptions</label></div>
        <div class="setting-card"><strong>File Naming</strong><p>Export file prefix.</p><input type="text" value="scriptflow-export" /></div>
      </div>
    `,
    accessibility: `
      <h2>Accessibility</h2>
      <div class="setting-grid">
        <div class="setting-card"><strong>Contrast</strong><p>Use high contrast controls in editor panels.</p><label class="toggle-line"><input type="checkbox" checked /> High contrast focus</label></div>
        <div class="setting-card"><strong>Captions</strong><p>Show caption-safe pacing hints.</p><label class="toggle-line"><input type="checkbox" checked /> Caption hints</label></div>
        <div class="setting-card"><strong>Keyboard Flow</strong><p>Keep primary controls tab reachable.</p><label class="toggle-line"><input type="checkbox" checked /> Enhanced focus rings</label></div>
        <div class="setting-card"><strong>Motion</strong><p>Follow OS reduced motion preferences.</p><label class="toggle-line"><input type="checkbox" /> Force reduced motion</label></div>
      </div>
    `,
    notifications: `
      <h2>Notifications</h2>
      <div class="setting-grid">
        <div class="setting-card"><strong>Generation Complete</strong><p>Alert when a script is ready.</p><label class="toggle-line"><input type="checkbox" checked /> Enabled</label></div>
        <div class="setting-card"><strong>Export Ready</strong><p>Alert when files are prepared.</p><label class="toggle-line"><input type="checkbox" checked /> Enabled</label></div>
        <div class="setting-card"><strong>Storage Alerts</strong><p>Show workspace storage warnings.</p><label class="toggle-line"><input type="checkbox" checked /> Enabled</label></div>
        <div class="setting-card"><strong>Email Summary</strong><p>Send weekly production summary.</p><label class="toggle-line"><input type="checkbox" /> Enabled</label></div>
      </div>
    `,
    account: `
      <h2>Account</h2>
      <div class="setting-grid">
        <div class="setting-card"><strong>Name</strong><p>Visible account name.</p><input type="text" value="John Smith" /></div>
        <div class="setting-card"><strong>Workspace</strong><p>Production workspace.</p><input type="text" value="ScriptFlow Studio" /></div>
        <div class="setting-card"><strong>Plan</strong><p>Current subscription tier.</p><select><option>Creator Pro</option><option>Studio</option><option>Team</option></select></div>
        <div class="setting-card"><strong>Security</strong><p>Protect exports and drafts.</p><label class="toggle-line"><input type="checkbox" checked /> Require confirmation for deletes</label></div>
      </div>
    `,
  };
  $("#settingsPanel").innerHTML = panels[state.settingsTab] || panels.appearance;
  const themeSelect = $("#themeSelect");
  if (themeSelect) {
    themeSelect.value = state.dark ? "Dark" : "Light";
    themeSelect.addEventListener("change", () => {
      if (themeSelect.value !== "System") {
        state.dark = themeSelect.value === "Dark";
        applyTheme();
      }
    });
  }
}

function applyTheme() {
  document.body.classList.toggle("dark", state.dark);
  localStorage.setItem("scriptflow-theme", state.dark ? "dark" : "light");
}

function persistDraft() {
  localStorage.setItem("scriptflow-draft", JSON.stringify(scriptSegments));
}

function restoreDraft() {
  const savedTheme = localStorage.getItem("scriptflow-theme");
  if (savedTheme) state.dark = savedTheme === "dark";
  const saved = localStorage.getItem("scriptflow-draft");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length) scriptSegments = parsed;
    } catch {
      localStorage.removeItem("scriptflow-draft");
    }
  }
  applyTheme();
}

function handleFile(file) {
  if (!file) return;
  const url = URL.createObjectURL(file);
  const extension = (file.name.split(".").pop() || "MP4").toUpperCase();
  state.uploadedVideo = {
    name: file.name,
    size: file.size,
    duration: "00:55",
    url,
    format: extension,
  };
  const probe = document.createElement("video");
  probe.preload = "metadata";
  probe.onloadedmetadata = () => {
    if (Number.isFinite(probe.duration)) {
      state.uploadedVideo.duration = secondsToStamp(probe.duration);
      populateVideoMetadata();
    }
  };
  probe.src = url;
  beginProcessing(state.uploadedVideo);
}

function bindEvents() {
  $$("[data-screen]").forEach((node) => {
    node.addEventListener("click", (event) => {
      event.preventDefault();
      switchScreen(node.dataset.screen);
    });
  });

  $("#notifBtn").addEventListener("click", () => $("#notificationPopover").classList.toggle("open"));
  $("#markReadBtn").addEventListener("click", () => {
    state.unreadNotifications = false;
    $("#notifBtn").classList.remove("has-dot");
    renderNotifications();
  });

  $("#themeBtn").addEventListener("click", () => {
    state.dark = !state.dark;
    applyTheme();
    showToast(state.dark ? "Dark mode enabled" : "Light mode enabled");
  });

  $("#searchInput").addEventListener("input", (event) => {
    state.searchQuery = event.target.value;
    renderProjects();
    if (state.screen === "projects") renderProjectBoard();
  });

  const videoInput = $("#videoInput");
  $("#browseBtn").addEventListener("click", (event) => {
    event.preventDefault();
    videoInput.click();
  });
  videoInput.addEventListener("change", (event) => handleFile(event.target.files[0]));

  const dropZone = $("#dropZone");
  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("drag-over");
  });
  dropZone.addEventListener("dragleave", () => dropZone.classList.remove("drag-over"));
  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("drag-over");
    handleFile(event.dataTransfer.files[0]);
  });

  $("#previewPlayBtn").addEventListener("click", () => showToast("Video preview ready"));
  $("#playBtn").addEventListener("click", togglePlayback);
  $("#stopBtn").addEventListener("click", () => {
    stopPlayback();
    state.currentTime = 0;
    state.activeSegment = 0;
    renderSegments();
  });
  $("#nextSegmentBtn").addEventListener("click", () => setActiveSegment(state.activeSegment + 1));
  $("#timelineRange").addEventListener("input", (event) => {
    state.currentTime = Number(event.target.value);
    const found = scriptSegments.findIndex((segment) => state.currentTime >= stampToSeconds(segment.time) && state.currentTime < stampToSeconds(segment.end));
    if (found !== -1) state.activeSegment = found;
    renderSegments();
  });
  $("#speedSelect").addEventListener("change", () => {
    if (state.isPlaying) {
      stopPlayback();
      startPlayback();
    }
  });

  $("#copyScriptBtn").addEventListener("click", () => copyText(getScriptText(), "Script copied"));
  $("#saveScriptBtn").addEventListener("click", () => {
    persistDraft();
    showToast("Script draft saved locally");
  });
  $("#shareBtn").addEventListener("click", () => copyText("ScriptFlow draft ready for review.", "Share note copied"));
  $("#timestampSyncBtn").addEventListener("click", () => {
    showToast("Timestamps synced to script segments");
  });
  $$(".format-button[data-format]").forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.toggle("active");
      showToast(`${button.title} formatting toggled`);
    });
  });
  $("#undoBtn").addEventListener("click", () => showToast("Undo stack restored last saved version"));
  $("#redoBtn").addEventListener("click", () => showToast("Redo stack is current"));

  $("#openExportBtn").addEventListener("click", () => {
    renderExportFormats();
    $("#exportModal").showModal();
  });
  $("#downloadExportBtn").addEventListener("click", downloadExport);

  $$(".settings-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      state.settingsTab = tab.dataset.settings;
      $$(".settings-tab").forEach((item) => item.classList.toggle("active", item === tab));
      renderSettings();
    });
  });

  document.addEventListener("click", (event) => {
    const popover = $("#notificationPopover");
    if (!popover.contains(event.target) && !$("#notifBtn").contains(event.target)) {
      popover.classList.remove("open");
    }
  });
}

restoreDraft();
renderProjects();
renderProjectBoard();
renderNotifications();
renderSettings();
renderSegments();
bindEvents();
