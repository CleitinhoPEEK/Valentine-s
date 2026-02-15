const rawText = `Feliz Dia dos Namorados ❤️

Há 4 anos você é "Dona" de mim, há 4 anos estou "Te Esperando" e pode "Escreve aí" que em 4 anos ainda vou te ter.

Eu não quero que a gente seja "Meio Termo" porque a cada dia eu "Te Vivo" mais, e acredito que ainda teremos nossa "Chuva de Arroz", celebrando tudo o que passamos.

Eu anotei os "Sinais" e nunca precisei de "Cantada", quero te dar "Tudo Que Você Quiser", mas acima de tudo quero que você se sinta uma "Mulher Segura" ao meu lado.

Eu sei que o "Sogrão Caprichou", e por isso quero que seja "Incondicional", você é e sempre será meu maior "Abalo Emocional".

Eu sei que "Amar Não É Pecado", e mesmo assim tenho medo até de "Um Beijo". E pelos meus erros, você "Não Merece Chorar".

Agora eu te pergunto, de coração aberto: "Cê Topa?" 💍✨`;

const messageEl = document.getElementById("message");
const textMiniPlayerEl = document.getElementById("text-mini-player");
const textMiniOpenEl = document.getElementById("text-mini-open");
const textMiniCurrentEl = document.getElementById("text-mini-current");
const textMiniDurationEl = document.getElementById("text-mini-duration");
const textMiniTrackFillEl = document.getElementById("text-mini-track-fill");
const textMiniTitleEl = document.getElementById("text-mini-title");
const textMiniTogglePlayEl = document.getElementById("text-mini-toggle-play");
const textMiniToggleVolumeEl = document.getElementById("text-mini-toggle-volume");
const wrapperEl = document.getElementById("main-wrapper");
const externalControlsEl = document.getElementById("external-controls");
const playerViewEl = document.getElementById("player-view");
const modeToggleEl = document.getElementById("mode-toggle");
const modeToggleLabelEl = document.getElementById("mode-toggle-label");
const introFlowEl = document.getElementById("intro-flow");
const introClickScreenEl = document.getElementById("intro-screen-click");
const introLeftScreenEl = document.getElementById("intro-screen-left");
const introUpScreenEl = document.getElementById("intro-screen-up");
const introFracturesEl = document.getElementById("intro-fractures");
const introTitleEl = document.getElementById("intro-title");
const introSwipeLeftGateEl = document.getElementById("intro-swipe-left-gate");
const introSwipeLeftTrackEl = document.getElementById("intro-swipe-left-track");
const introSwipeLeftHandleEl = document.getElementById("intro-swipe-left-handle");
const canvas = document.getElementById("sky-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;

const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const artistName = "Luan Santana";
const INTRO_AUTOPLAY_TITLE = "Matheus & Kauan - De Sol A Sol";
const INTRO_AUTOPLAY_FILE = "De Sol A Sol (Ao Vivo) - Matheus & Kauan (youtube).mp3";
const INTRO_AUTOPLAY_START_SECONDS = 8;
const MUSIC_VOLUME = 0.36;
const STORAGE_VOLUME_KEY = "romantic_player_volume";
const STORAGE_SHUFFLE_KEY = "romantic_player_shuffle";

const DEVICE_CORES = navigator.hardwareConcurrency || 4;
const IS_LOW_POWER_DEVICE = DEVICE_CORES <= 4;
const MAX_STATIC_STARS = IS_LOW_POWER_DEVICE ? 110 : 160;
const MAX_METEORS = IS_LOW_POWER_DEVICE ? 2 : 3;
const INTRO_CLICKS_REQUIRED = 3;
const MAX_INTRO_FRACTURES = IS_LOW_POWER_DEVICE ? 560 : 900;
const INTRO_SEGMENT_BUDGET_PER_CLICK = IS_LOW_POWER_DEVICE ? 34 : 56;
const INTRO_SWIPE_UNLOCK_RATIO = 0.86;
const INTRO_FIRST_STAGE_SWITCH_DELAY_MS = 220;
const INTRO_STAGE_SWITCH_DELAY_MS = 520;
const INTRO_SWIPE_FINISH_DELAY_MS = 120;
const INTRO_SWIPE_UP_THRESHOLD = 72;

const TRACKS_BASE_PATH = ".";
const INTRO_AUTOPLAY_SOURCE = encodeURI(`${TRACKS_BASE_PATH}/${INTRO_AUTOPLAY_FILE}`);

const localTrackFiles = {
  "matheus kauan de sol a sol": INTRO_AUTOPLAY_FILE,
  dona: "Luan Santana - DONA (Ao Vivo na Lua) - Luan Santana (youtube).mp3",
  "te esperando": "Te Esperando - Luan Santana (youtube).mp3",
  "te vivo": "Luan Santana - TE VIVO (Registro Histórico) - Luan Santana (youtube).mp3",
  "escreve ai": "Luan Santana - Escreve aí - (Vídeo Oficial) - DVD Luan Santana Acústico - Luan Santana (youtube).mp3",
  "meio termo": "MEIO TERMO (Ao Vivo) - Luan Santana (youtube).mp3",
  "chuva de arroz": "Chuva de Arroz (Ao Vivo) - Luan Santana (youtube).mp3",
  sinais: "Sinais (Ao Vivo) - Luan Santana (youtube).mp3",
  cantada: "Luan Santana - CANTADA (Registro Histórico) - Luan Santana (youtube).mp3",
  "tudo que voce quiser": "Tudo Que Você Quiser - Luan Santana (youtube).mp3",
  "mulher segura": "MULHER SEGURA (Ao Vivo) - Luan Santana (youtube).mp3",
  "sograo caprichou": "Sogrão Caprichou - Luan Santana (youtube).mp3",
  incondicional: "Incondicional (Ao Vivo) - Luan Santana (youtube).mp3",
  "abalo emocional": "Luan Santana - ABALO EMOCIONAL (Baixinha Invocada) (LUAN CITY) - Luan Santana (youtube).mp3",
  "amar nao e pecado": "Amar Não É Pecado (Ao Vivo) - Luan Santana (youtube).mp3",
  "um beijo": "Um Beijo (Ao Vivo) - Luan Santana (youtube).mp3",
  "nao merece chorar": "Garotas Não Merecem Chorar - Luan Santana (youtube).mp3",
  "ce topa": "Cê Topa - Luan Santana (youtube).mp3"
};

// Segundos de início por faixa (edite manualmente aqui).
const TRACK_START_OFFSETS = {
  "matheus kauan de sol a sol": INTRO_AUTOPLAY_START_SECONDS,
  dona: 15,
  "te esperando": 29,
  "te vivo": 17,
  "escreve ai": 30,
  "meio termo": 13,
  "chuva de arroz": 16,
  sinais: 30,
  cantada: 08,
  "tudo que voce quiser": 27,
  "mulher segura": 13,
  "sograo caprichou": 0,
  incondicional: 17,
  "abalo emocional": 0,
  "amar nao e pecado": 14,
  "um beijo": 20,
  "nao merece chorar": 06,
  "ce topa": 16
};
function buildRepoTrackUrl(fileName) {
  return encodeURI(`${TRACKS_BASE_PATH}/${fileName}`);
}

const localTrackSources = Object.fromEntries(
  Object.entries(localTrackFiles).map(([key, fileName]) => [key, buildRepoTrackUrl(fileName)])
);

const sky = {
  width: 0,
  height: 0,
  dpr: 1,
  stars: [],
  meteors: [],
  running: false,
  frameId: 0,
  lastTs: 0,
  nextSpawnTs: 0
};

let prefersReducedMotion = motionQuery.matches;
let musicAudio = null;
let currentTrackQuery = "";
let currentTrackTitle = "";
let currentTrackSource = "none";
let playerVolume = MUSIC_VOLUME;
let lastNonZeroVolume = MUSIC_VOLUME;
let isShuffleMode = false;
let isPlaying = false;
let isPlayerMode = false;

let introOpened = false;
let introAutoplayStarted = false;
let introClickCount = 0;
let introLetters = [];
let introStage = 1;
let introLeftUnlocked = false;
let introLeftSwipeActive = false;
let introLeftSwipeStartX = 0;
let introLeftSwipeStartLeft = 0;
let introLeftSwipeLeft = 0;
let introLeftSwipeMaxLeft = 0;
let introLeftSwipePointerId = null;
let introUpPointerId = null;
let introUpStartX = 0;
let introUpStartY = 0;
let introUpTouchId = null;

let nowPlayingEl = null;
let nowPlayingTitleEl = null;
let playPauseBtnEl = null;
let prevTrackBtnEl = null;
let nextTrackBtnEl = null;
let shuffleBtnEl = null;
let volumeControlEl = null;
let volumeValueEl = null;
let volumeDockEl = null;
let volumeToggleEl = null;
let progressBarEl = null;
let progressCurrentEl = null;
let progressDurationEl = null;

let trackButtonMap = new Map();
let quoteMap = new Map();

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function formatTime(totalSeconds) {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "0:00";
  const safe = Math.floor(totalSeconds);
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function setPlaybackProgress(currentTime, duration) {
  const safeCurrent = Number.isFinite(currentTime) ? Math.max(0, currentTime) : 0;
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  const ratio = safeDuration > 0 ? clamp(safeCurrent / safeDuration, 0, 1) : 0;

  if (progressBarEl) {
    progressBarEl.value = String(Math.round(ratio * 1000));
    progressBarEl.style.setProperty("--progress", `${Math.round(ratio * 100)}%`);
  }

  if (progressCurrentEl) {
    progressCurrentEl.textContent = formatTime(safeCurrent);
  }

  if (progressDurationEl) {
    progressDurationEl.textContent = safeDuration > 0 ? formatTime(safeDuration) : "0:00";
  }

  if (textMiniCurrentEl) {
    textMiniCurrentEl.textContent = formatTime(safeCurrent);
  }

  if (textMiniDurationEl) {
    textMiniDurationEl.textContent = safeDuration > 0 ? formatTime(safeDuration) : "0:00";
  }

  if (textMiniTrackFillEl) {
    textMiniTrackFillEl.style.width = `${Math.round(ratio * 100)}%`;
  }
}

function syncPlaybackProgressFromAudio() {
  if (!musicAudio || currentTrackSource !== "local" || !currentTrackTitle) {
    setPlaybackProgress(0, 0);
    return;
  }

  setPlaybackProgress(musicAudio.currentTime || 0, musicAudio.duration || 0);
}

function setVolumeDockOpen(open) {
  if (!volumeDockEl || !volumeToggleEl) return;
  const isOpen = Boolean(open);
  volumeDockEl.classList.toggle("is-open", isOpen);
  volumeToggleEl.setAttribute("aria-expanded", String(isOpen));
}

function readStoredNumber(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    const value = Number(raw);
    return Number.isFinite(value) ? value : fallback;
  } catch (_) {
    return fallback;
  }
}

function readStoredBoolean(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return raw === "1";
  } catch (_) {
    return fallback;
  }
}

function storeValue(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch (_) {
    // ignore storage failures
  }
}

function hydratePlayerPreferences() {
  playerVolume = clamp(readStoredNumber(STORAGE_VOLUME_KEY, MUSIC_VOLUME), 0, 1);
  isShuffleMode = readStoredBoolean(STORAGE_SHUFFLE_KEY, false);
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value) {
  return value.replace(/"/g, "&quot;");
}

function normalizeTrackKey(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function getLocalAudioSource(trackTitle) {
  const normalized = normalizeTrackKey(trackTitle);
  return localTrackSources[normalized] || "";
}

function getTrackStartOffset(trackTitle) {
  const normalized = normalizeTrackKey(trackTitle);
  return TRACK_START_OFFSETS[normalized] || 0;
}

function extractSongTitles(text) {
  const titles = [];
  const seen = new Set();
  const matches = text.matchAll(/"([^"]+)"/g);

  for (const [, titleRaw] of matches) {
    const title = titleRaw.trim();
    if (!seen.has(title)) {
      seen.add(title);
      titles.push(title);
    }
  }

  return titles;
}

function buildPlayerSongTitles(text) {
  const titles = [];
  const seen = new Set();

  const addTitle = (title) => {
    const normalized = title.trim();
    if (!normalized || seen.has(normalized)) return;
    seen.add(normalized);
    titles.push(normalized);
  };

  // Mantem a faixa de abertura fixa no player.
  addTitle(INTRO_AUTOPLAY_TITLE);
  extractSongTitles(text).forEach(addTitle);
  return titles;
}

const songTitles = buildPlayerSongTitles(rawText);

function wrapQuotedParts(text) {
  const safeText = escapeHtml(text);
  return safeText.replace(
    /"([^"]+)"/g,
    (_, quoted) =>
      `<span class="quote" tabindex="0" role="button" aria-pressed="false">${quoted}</span>`
  );
}

function renderMessage() {
  if (!messageEl) return;
  const paragraphs = rawText.split(/\n\s*\n/);
  messageEl.innerHTML = paragraphs
    .map((paragraph, index) => `<p style="--idx:${index};">${wrapQuotedParts(paragraph)}</p>`)
    .join("");

  quoteMap = new Map();
  messageEl.querySelectorAll(".quote").forEach((quote) => {
    quoteMap.set(quote.textContent.trim(), quote);
  });
}

function renderPlayerList() {
  if (!playerViewEl) return;

  const trackButtons = songTitles
    .map(
      (title) =>
        `<li><button class="track-item" type="button" data-track="${escapeAttribute(title)}" aria-pressed="false">${escapeHtml(title)}</button></li>`
    )
    .join("");

  playerViewEl.innerHTML = `
    <div class="player-tools">
      <div class="player-controls" aria-label="Controles do player">
        <button id="prev-track" class="control-btn control-btn--transport" type="button" title="Voltar faixa" aria-label="Voltar faixa"></button>
        <button id="toggle-play" class="control-btn control-btn--transport control-btn--play" type="button" title="Tocar" aria-label="Tocar" disabled></button>
        <button id="next-track" class="control-btn control-btn--transport" type="button" title="Avançar faixa" aria-label="Avançar faixa"></button>
        <button id="shuffle-track" class="control-btn control-btn--shuffle" type="button" aria-pressed="false" title="Aleatório desativado" aria-label="Aleatório desativado"></button>
      </div>
      <div id="volume-dock" class="volume-dock">
        <button id="volume-toggle" class="volume-toggle" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Volume" title="Volume">
          <span class="speaker-icon" aria-hidden="true">
            <svg class="speaker-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path class="speaker-body" d="M4 10h4.2l4.8-4v12l-4.8-4H4z"></path>
              <path class="speaker-wave-path speaker-wave-path--1" d="M16 9.2c1.5 1.3 1.5 4.3 0 5.6"></path>
              <path class="speaker-wave-path speaker-wave-path--2" d="M18.3 7c2.8 2.5 2.8 7.5 0 10"></path>
            </svg>
          </span>
        </button>
        <div class="volume-panel" role="group" aria-label="Controle de volume">
          <div class="volume-track-wrap">
            <input id="volume-control" class="volume-control" type="range" min="0" max="100" step="1" value="${Math.round(playerVolume * 100)}" aria-label="Volume">
          </div>
          <span id="volume-value" class="volume-value">${Math.round(playerVolume * 100)}%</span>
        </div>
      </div>
    </div>
    <div class="playback-progress" aria-label="Progresso da música">
      <span id="progress-current" class="progress-time">0:00</span>
      <input id="progress-control" class="progress-control" type="range" min="0" max="1000" step="1" value="0" aria-label="Linha do tempo da música">
      <span id="progress-duration" class="progress-time">0:00</span>
    </div>
    <div id="now-playing" class="now-playing" data-playing="false" aria-live="polite">
      <span class="now-playing-icon" aria-hidden="true">&#9835;</span>
      <span id="now-playing-title" class="now-playing-title">Nenhuma música tocando</span>
    </div>
    <ul class="track-list">${trackButtons}</ul>
  `;

  nowPlayingEl = document.getElementById("now-playing");
  nowPlayingTitleEl = document.getElementById("now-playing-title");
  playPauseBtnEl = document.getElementById("toggle-play");
  prevTrackBtnEl = document.getElementById("prev-track");
  nextTrackBtnEl = document.getElementById("next-track");
  shuffleBtnEl = document.getElementById("shuffle-track");
  volumeDockEl = document.getElementById("volume-dock");
  volumeToggleEl = document.getElementById("volume-toggle");
  volumeControlEl = document.getElementById("volume-control");
  volumeValueEl = document.getElementById("volume-value");
  progressBarEl = document.getElementById("progress-control");
  progressCurrentEl = document.getElementById("progress-current");
  progressDurationEl = document.getElementById("progress-duration");

  trackButtonMap = new Map();
  playerViewEl.querySelectorAll(".track-item").forEach((button) => {
    const title = button.dataset.track;
    trackButtonMap.set(title, button);
  });
}

function popQuote(target) {
  if (prefersReducedMotion || !target) return;
  target.classList.remove("pop");
  void target.offsetWidth;
  target.classList.add("pop");
}

function ensureMusicAudio() {
  if (musicAudio) return musicAudio;

  musicAudio = document.createElement("audio");
  musicAudio.id = "music-audio";
  musicAudio.preload = "none";
  musicAudio.volume = playerVolume;
  musicAudio.style.position = "fixed";
  musicAudio.style.left = "-9999px";
  musicAudio.style.bottom = "0";
  musicAudio.style.opacity = "0";
  musicAudio.style.pointerEvents = "none";

  musicAudio.addEventListener("play", () => {
    if (currentTrackSource !== "local") return;
    isPlaying = true;
    updatePlaybackUi();
    syncPlaybackProgressFromAudio();
  });

  musicAudio.addEventListener("pause", () => {
    if (currentTrackSource !== "local") return;
    isPlaying = false;
    updatePlaybackUi();
    syncPlaybackProgressFromAudio();
  });

  musicAudio.addEventListener("ended", () => {
    if (currentTrackSource !== "local") return;
    isPlaying = false;
    updatePlaybackUi();
    playAdjacentTrack(1);
  });

  musicAudio.addEventListener("timeupdate", syncPlaybackProgressFromAudio);
  musicAudio.addEventListener("loadedmetadata", syncPlaybackProgressFromAudio);
  musicAudio.addEventListener("durationchange", syncPlaybackProgressFromAudio);

  document.body.appendChild(musicAudio);
  return musicAudio;
}

function updatePlaybackUi() {
  const hasTrack = Boolean(currentTrackTitle);
  const playing = hasTrack && isPlaying;

  if (nowPlayingEl) {
    nowPlayingEl.dataset.playing = String(playing);
  }

  if (textMiniPlayerEl) {
    textMiniPlayerEl.dataset.playing = String(playing);
  }

  if (playPauseBtnEl) {
    const actionLabel = playing ? "Pausar" : "Tocar";
    playPauseBtnEl.disabled = !hasTrack;
    playPauseBtnEl.classList.toggle("is-playing", playing);
    playPauseBtnEl.title = actionLabel;
    playPauseBtnEl.setAttribute("aria-label", actionLabel);
  }

  if (textMiniTogglePlayEl) {
    const actionLabel = playing ? "Pausar" : "Tocar";
    textMiniTogglePlayEl.disabled = !hasTrack;
    textMiniTogglePlayEl.classList.toggle("is-playing", playing);
    textMiniTogglePlayEl.textContent = playing ? "⏸" : "▶";
    textMiniTogglePlayEl.title = actionLabel;
    textMiniTogglePlayEl.setAttribute("aria-label", actionLabel);
  }

  if (shuffleBtnEl) {
    const shuffleLabel = isShuffleMode ? "Aleatório ativado" : "Aleatório desativado";
    shuffleBtnEl.setAttribute("aria-pressed", String(isShuffleMode));
    shuffleBtnEl.classList.toggle("is-active", isShuffleMode);
    shuffleBtnEl.title = shuffleLabel;
    shuffleBtnEl.setAttribute("aria-label", shuffleLabel);
  }

  if (volumeControlEl) {
    const volumePercent = Math.round(playerVolume * 100);
    volumeControlEl.value = String(volumePercent);
    volumeControlEl.style.setProperty("--volume-progress", `${volumePercent}%`);
  }

  if (volumeToggleEl) {
    const volumePercent = Math.round(playerVolume * 100);
    const level = volumePercent === 0 ? "muted" : (volumePercent < 50 ? "low" : "high");
    const volumeLabel = `Volume ${volumePercent}%`;
    volumeToggleEl.dataset.level = level;
    volumeToggleEl.title = volumeLabel;
    volumeToggleEl.setAttribute("aria-label", volumeLabel);
  }

  if (textMiniToggleVolumeEl) {
    const volumePercent = Math.round(playerVolume * 100);
    const volumeLabel = `Volume ${volumePercent}%`;
    textMiniToggleVolumeEl.textContent = volumePercent === 0 ? "🔇" : "🔊";
    textMiniToggleVolumeEl.title = volumeLabel;
    textMiniToggleVolumeEl.setAttribute("aria-label", volumeLabel);
  }

  if (volumeValueEl) {
    volumeValueEl.textContent = `${Math.round(playerVolume * 100)}%`;
  }

  if (progressBarEl) {
    progressBarEl.disabled = !hasTrack;
    if (!hasTrack) {
      progressBarEl.style.setProperty("--progress", "0%");
    }
  }

  if (!hasTrack) {
    setPlaybackProgress(0, 0);
  }
}

function updateNowPlaying(trackTitle) {
  const label = trackTitle
    ? (/\s-\s/.test(trackTitle) ? trackTitle : `${artistName} - ${trackTitle}`)
    : "Nenhuma música tocando";

  if (nowPlayingTitleEl) {
    nowPlayingTitleEl.textContent = label;
  }

  if (textMiniTitleEl) {
    textMiniTitleEl.textContent = label;
  }

  updatePlaybackUi();
}

function applyPlayerVolume(value, persist = true) {
  playerVolume = clamp(value, 0, 1);
  if (playerVolume > 0.001) {
    lastNonZeroVolume = playerVolume;
  }

  if (musicAudio) {
    musicAudio.volume = playerVolume;
  }

  if (persist) {
    storeValue(STORAGE_VOLUME_KEY, String(playerVolume));
  }

  updatePlaybackUi();
}

function stopLocalAudio() {
  if (!musicAudio) return;
  musicAudio.onerror = null;
  musicAudio.pause();
  musicAudio.removeAttribute("src");
  musicAudio.load();
}

function applyStartOffset(audio, startAtSeconds = 0) {
  const safeOffset = Number.isFinite(startAtSeconds) ? Math.max(0, startAtSeconds) : 0;
  if (safeOffset <= 0) return;

  const seekToOffset = () => {
    const duration = audio.duration;
    if (Number.isFinite(duration) && duration > 0) {
      audio.currentTime = Math.min(safeOffset, Math.max(duration - 0.15, 0));
      return;
    }
    audio.currentTime = safeOffset;
  };

  if (audio.readyState >= 1) {
    seekToOffset();
    return;
  }

  audio.addEventListener("loadedmetadata", seekToOffset, { once: true });
}

function playLocalTrack(trackTitle, source, startAtSeconds = 0) {
  const audio = ensureMusicAudio();
  const sameTrack = source === currentTrackQuery && currentTrackSource === "local";

  if (sameTrack) {
    applyStartOffset(audio, startAtSeconds);
    const resumePromise = audio.play();
    if (resumePromise && typeof resumePromise.catch === "function") {
      resumePromise.catch(() => {
        // keep state unchanged on failure
      });
    }
    currentTrackTitle = trackTitle;
    isPlaying = true;
    updateNowPlaying(trackTitle);
    return;
  }

  currentTrackQuery = source;
  currentTrackTitle = trackTitle;
  currentTrackSource = "local";
  isPlaying = true;
  audio.src = source;
  audio.currentTime = 0;
  applyStartOffset(audio, startAtSeconds);
  audio.volume = playerVolume;
  setPlaybackProgress(0, 0);
  updateNowPlaying(trackTitle);

  audio.onerror = () => {
    if (currentTrackQuery !== source) return;
    deactivateTrackSilently();
  };

  const playPromise = audio.play();
  if (playPromise && typeof playPromise.catch === "function") {
    playPromise.catch(() => {
      if (currentTrackQuery !== source) return;
      deactivateTrackSilently();
    });
  }
}
function playSelectedSong(trackTitle) {
  const localSource = getLocalAudioSource(trackTitle);
  if (!localSource) {
    deactivateTrackSilently();
    return;
  }

  playLocalTrack(trackTitle, localSource, getTrackStartOffset(trackTitle));
}

function stopSelectedSong() {
  currentTrackQuery = "";
  currentTrackTitle = "";
  currentTrackSource = "none";
  isPlaying = false;
  stopLocalAudio();
  setPlaybackProgress(0, 0);
  updateNowPlaying("");
}

function setActivePlayerTrack(trackTitle) {
  trackButtonMap.forEach((button, title) => {
    const isActive = title === trackTitle;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function clearActiveQuotes() {
  quoteMap.forEach((quote) => {
    quote.classList.remove("active");
    quote.setAttribute("aria-pressed", "false");
  });
}

function clearActiveTrackState() {
  clearActiveQuotes();
  setActivePlayerTrack("");
}

function findQuoteByTitle(trackTitle) {
  return quoteMap.get(trackTitle) || null;
}

function deactivateTrackSilently() {
  stopSelectedSong();
  clearActiveTrackState();
}

function activateTrack(trackTitle) {
  clearActiveTrackState();

  const quote = findQuoteByTitle(trackTitle);
  if (quote) {
    quote.classList.add("active");
    quote.setAttribute("aria-pressed", "true");
    if (quote.offsetParent !== null) {
      popQuote(quote);
    }
  }

  setActivePlayerTrack(trackTitle);
  playSelectedSong(trackTitle);
  spawnMeteor({ special: true });
}

function deactivateTrack() {
  deactivateTrackSilently();
}

function toggleQuote(target) {
  const wasActive = target.classList.contains("active");
  const title = target.textContent.trim();

  if (wasActive) {
    deactivateTrack();
    return;
  }

  activateTrack(title);
}

function bindQuoteEvents() {
  if (!messageEl) return;

  messageEl.addEventListener("click", (event) => {
    const quote = event.target.closest(".quote");
    if (!quote) return;
    toggleQuote(quote);
  });

  messageEl.addEventListener("keydown", (event) => {
    const quote = event.target.closest(".quote");
    if (!quote) return;

    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      toggleQuote(quote);
    }
  });
}
function getVisibleTrackTitles() {
  return songTitles.filter((title) => trackButtonMap.has(title));
}

function playAdjacentTrack(step) {
  const available = getVisibleTrackTitles();
  if (!available.length) return;

  let nextTitle = available[0];

  if (isShuffleMode) {
    const pool = available.filter((title) => title !== currentTrackTitle);
    const randomPool = pool.length ? pool : available;
    nextTitle = randomPool[Math.floor(Math.random() * randomPool.length)];
  } else {
    const currentIndex = available.indexOf(currentTrackTitle);
    const baseIndex = currentIndex >= 0 ? currentIndex : (step > 0 ? -1 : 0);
    const nextIndex = (baseIndex + step + available.length) % available.length;
    nextTitle = available[nextIndex];
  }

  activateTrack(nextTitle);
}

function pauseOrResumeCurrentTrack() {
  if (!currentTrackTitle) return;
  if (currentTrackSource !== "local") return;

  const audio = ensureMusicAudio();

  if (audio.paused) {
    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        // keep state unchanged on failure
      });
    }
    isPlaying = true;
  } else {
    audio.pause();
    isPlaying = false;
  }

  updatePlaybackUi();
}

function toggleMiniVolume() {
  if (playerVolume <= 0.001) {
    applyPlayerVolume(clamp(lastNonZeroVolume || MUSIC_VOLUME, 0.05, 1));
    return;
  }

  applyPlayerVolume(0);
}

function setShuffleMode(enabled, persist = true) {
  isShuffleMode = Boolean(enabled);
  if (persist) {
    storeValue(STORAGE_SHUFFLE_KEY, isShuffleMode ? "1" : "0");
  }
  updatePlaybackUi();
}

function togglePlayerMode() {
  if (!wrapperEl || !modeToggleEl || !modeToggleLabelEl) return;

  isPlayerMode = !isPlayerMode;
  wrapperEl.classList.toggle("player-mode", isPlayerMode);
  if (externalControlsEl) {
    externalControlsEl.classList.toggle("player-mode", isPlayerMode);
  }
  modeToggleEl.setAttribute("aria-pressed", String(isPlayerMode));
  modeToggleLabelEl.textContent = isPlayerMode ? "Voltar ao texto" : "Abrir player";
}

function bindModeToggle() {
  if (modeToggleEl) {
    modeToggleEl.addEventListener("click", togglePlayerMode);
  }

  if (textMiniOpenEl) {
    textMiniOpenEl.addEventListener("click", () => {
      if (!isPlayerMode) {
        togglePlayerMode();
      }
    });
  }

  if (textMiniTogglePlayEl) {
    textMiniTogglePlayEl.addEventListener("click", () => {
      pauseOrResumeCurrentTrack();
    });
  }

  if (textMiniToggleVolumeEl) {
    textMiniToggleVolumeEl.addEventListener("click", () => {
      toggleMiniVolume();
    });
  }
}

function bindPlayerEvents() {
  if (!playerViewEl) return;

  playerViewEl.addEventListener("click", (event) => {
    const trackButton = event.target.closest(".track-item");
    if (!trackButton) return;

    const title = trackButton.dataset.track;
    const wasActive = trackButton.classList.contains("active");

    if (wasActive) {
      deactivateTrack(trackButton);
      return;
    }

    activateTrack(title, trackButton);
  });

  if (prevTrackBtnEl) {
    prevTrackBtnEl.addEventListener("click", () => {
      playAdjacentTrack(-1);
    });
  }

  if (nextTrackBtnEl) {
    nextTrackBtnEl.addEventListener("click", () => {
      playAdjacentTrack(1);
    });
  }

  if (playPauseBtnEl) {
    playPauseBtnEl.addEventListener("click", () => {
      pauseOrResumeCurrentTrack();
    });
  }

  if (shuffleBtnEl) {
    shuffleBtnEl.addEventListener("click", () => {
      setShuffleMode(!isShuffleMode);
    });
  }

  if (volumeControlEl) {
    volumeControlEl.addEventListener("input", () => {
      const level = Number(volumeControlEl.value) / 100;
      applyPlayerVolume(level);
    });
  }

  if (volumeToggleEl && volumeDockEl) {
    volumeToggleEl.addEventListener("click", () => {
      const shouldOpen = !volumeDockEl.classList.contains("is-open");
      setVolumeDockOpen(shouldOpen);
    });

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (volumeDockEl.contains(target)) return;
      setVolumeDockOpen(false);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setVolumeDockOpen(false);
      }
    });
  }

  if (progressBarEl) {
    progressBarEl.addEventListener("input", () => {
      if (!musicAudio || currentTrackSource !== "local") return;
      const duration = musicAudio.duration;
      if (!Number.isFinite(duration) || duration <= 0) return;

      const ratio = clamp(Number(progressBarEl.value) / 1000, 0, 1);
      const nextTime = duration * ratio;
      musicAudio.currentTime = nextTime;
      setPlaybackProgress(nextTime, duration);
    });
  }
}

function bindNowPlayingEvents() {
  document.addEventListener("keydown", (event) => {
    if (!isPlayerMode) return;

    const target = event.target;
    const isTyping = target instanceof HTMLElement && (
      target.tagName === "INPUT" ||
      target.tagName === "TEXTAREA" ||
      target.isContentEditable
    );

    if (isTyping) return;

    if (event.code === "Space") {
      event.preventDefault();
      pauseOrResumeCurrentTrack();
      return;
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      playAdjacentTrack(1);
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      playAdjacentTrack(-1);
    }
  });
}

function prepareIntroLetters() {
  if (!introTitleEl) return;

  const text = introTitleEl.textContent || "";
  const fragment = document.createDocumentFragment();
  const letters = [];
  let index = 0;

  for (const char of text) {
    const letter = document.createElement("span");
    letter.className = "intro-letter";

    if (char === " ") {
      letter.classList.add("space-letter");
      letter.innerHTML = "&nbsp;";
    } else {
      letter.textContent = char;
      letter.style.setProperty("--ld", `${Math.round(index * 14 + randomBetween(0, 90))}ms`);
      letter.style.setProperty("--lx", `${randomBetween(-38, 38).toFixed(2)}px`);
      letter.style.setProperty("--ly", `${randomBetween(-60, -16).toFixed(2)}px`);
      letter.style.setProperty("--lr", `${randomBetween(-22, 22).toFixed(2)}deg`);
    }

    letter.style.setProperty("--drop-delay", `${Math.round(index * 40 + randomBetween(0, 180))}ms`);
    letter.style.setProperty("--drop-dur", `${Math.round(randomBetween(1700, 2600))}ms`);
    letter.style.setProperty("--drop-x", `${randomBetween(-34, 34).toFixed(2)}px`);
    letter.style.setProperty("--drop-r", `${randomBetween(-16, 16).toFixed(2)}deg`);
    letter.style.setProperty("--drop-y", `${Math.round(randomBetween(104, 132))}vh`);

    fragment.appendChild(letter);
    letters.push(letter);
    index += 1;
  }

  introTitleEl.textContent = "";
  introTitleEl.appendChild(fragment);
  introLetters = letters;
}

function triggerIntroImpact() {
  if (!introClickScreenEl || prefersReducedMotion) return;
  introClickScreenEl.classList.remove("impact");
  void introClickScreenEl.offsetWidth;
  introClickScreenEl.classList.add("impact");
}

function randomEdgePoint(width, height) {
  const side = Math.floor(Math.random() * 4);
  const margin = 2;

  if (side === 0) return { x: randomBetween(margin, width - margin), y: margin };
  if (side === 1) return { x: width - margin, y: randomBetween(margin, height - margin) };
  if (side === 2) return { x: randomBetween(margin, width - margin), y: height - margin };
  return { x: margin, y: randomBetween(margin, height - margin) };
}

function createFractureSegment(x1, y1, x2, y2, delayMs) {
  if (!introFracturesEl) return;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.hypot(dx, dy);
  if (length < 6) return;

  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const midX = (x1 + x2) / 2;
  const midY = (y1 + y2) / 2;

  const fracture = document.createElement("span");
  fracture.className = "intro-fracture";
  fracture.style.setProperty("--fx", `${midX.toFixed(2)}px`);
  fracture.style.setProperty("--fy", `${midY.toFixed(2)}px`);
  fracture.style.setProperty("--fl", `${length.toFixed(2)}px`);
  fracture.style.setProperty("--fr", `${angle.toFixed(2)}deg`);
  fracture.style.setProperty("--fo", randomBetween(0.44, 0.9).toFixed(2));
  fracture.style.setProperty("--fd", `${Math.round(delayMs)}ms`);
  fracture.style.setProperty("--fw", `${randomBetween(1, 1.7).toFixed(2)}px`);
  fracture.style.setProperty("--bs", randomBetween(0.2, 0.55).toFixed(2));
  fracture.style.setProperty("--br", `${randomBetween(-42, 42).toFixed(2)}deg`);
  fracture.style.setProperty("--sf-delay", `${Math.round(randomBetween(20, 360))}ms`);
  fracture.style.setProperty("--sf-dur", `${Math.round(randomBetween(820, 1320))}ms`);
  fracture.style.setProperty("--sf-x", `${randomBetween(-55, 55).toFixed(2)}px`);
  fracture.style.setProperty("--sf-y", `${randomBetween(120, 220).toFixed(2)}px`);
  fracture.style.setProperty("--sf-r", `${randomBetween(-22, 22).toFixed(2)}deg`);
  fracture.style.setProperty("--sf-scale", randomBetween(0.9, 1.06).toFixed(2));

  introFracturesEl.appendChild(fracture);
}

function addCurvedFractureRoute(progress, delayBase) {
  const width = window.innerWidth;
  const height = window.innerHeight;

  const start = randomEdgePoint(width, height);
  const end = randomEdgePoint(width, height);
  const segments = Math.round(randomBetween(5, 10) + progress * 4);

  const points = [start];

  for (let i = 1; i < segments; i += 1) {
    const t = i / segments;
    const baseX = start.x + (end.x - start.x) * t;
    const baseY = start.y + (end.y - start.y) * t;
    const curve = 1 - Math.abs(0.5 - t) * 2;
    const wiggle = (40 + progress * 180) * curve;

    points.push({
      x: clamp(baseX + randomBetween(-wiggle, wiggle), 0, width),
      y: clamp(baseY + randomBetween(-wiggle, wiggle), 0, height)
    });
  }

  points.push(end);

  for (let i = 0; i < points.length - 1; i += 1) {
    const p1 = points[i];
    const p2 = points[i + 1];
    createFractureSegment(p1.x, p1.y, p2.x, p2.y, delayBase + i * 22);
  }
}

function addIntroFractures(clickNumber) {
  if (!introFracturesEl) return;

  const progress = clamp(clickNumber / INTRO_CLICKS_REQUIRED, 0, 1);
  const cap = Math.round(MAX_INTRO_FRACTURES * (0.35 + progress * 0.65));

  while (introFracturesEl.childElementCount > cap) {
    introFracturesEl.firstElementChild.remove();
  }

  const routeCount = Math.max(1, Math.round(1 + progress * 2.5));
  const segmentBudget = Math.round(INTRO_SEGMENT_BUDGET_PER_CLICK * (0.55 + progress * 0.95));

  let createdSegments = 0;
  for (let r = 0; r < routeCount && createdSegments < segmentBudget; r += 1) {
    const before = introFracturesEl.childElementCount;
    addCurvedFractureRoute(progress, randomBetween(0, 110));
    const after = introFracturesEl.childElementCount;
    createdSegments += Math.max(0, after - before);
  }

  while (introFracturesEl.childElementCount > MAX_INTRO_FRACTURES) {
    introFracturesEl.firstElementChild.remove();
  }
}

function setIntroScreenVisible(screenEl, visible) {
  if (!screenEl) return;
  screenEl.classList.toggle("is-hidden", !visible);
  screenEl.classList.toggle("intro-screen--active", visible);
  screenEl.setAttribute("aria-hidden", String(!visible));
}

function measureIntroLeftSwipeRange() {
  if (!introSwipeLeftTrackEl || !introSwipeLeftHandleEl) return;
  const trackWidth = introSwipeLeftTrackEl.clientWidth;
  const handleWidth = introSwipeLeftHandleEl.offsetWidth;
  introLeftSwipeMaxLeft = Math.max(0, trackWidth - handleWidth - 8);
}

function setIntroLeftSwipePosition(nextLeft, animated = false) {
  if (!introSwipeLeftGateEl || !introSwipeLeftHandleEl) return;
  const clamped = clamp(nextLeft, 0, introLeftSwipeMaxLeft || 0);
  introLeftSwipeLeft = clamped;

  if (animated) {
    introSwipeLeftHandleEl.classList.remove("is-dragging");
  }

  introSwipeLeftHandleEl.style.transform = `translateX(${clamped}px)`;
  const progress = introLeftSwipeMaxLeft > 0 ? clamp(1 - (clamped / introLeftSwipeMaxLeft), 0, 1) : 0;
  introSwipeLeftGateEl.style.setProperty("--swipe-progress", progress.toFixed(4));

  if (!introLeftUnlocked && introStage === 2 && progress >= INTRO_SWIPE_UNLOCK_RATIO) {
    completeIntroLeftSwipe();
  }
}

function setIntroStage(stage) {
  introStage = stage;
  setIntroScreenVisible(introClickScreenEl, stage === 1);
  setIntroScreenVisible(introLeftScreenEl, stage === 2);
  setIntroScreenVisible(introUpScreenEl, stage === 3);

  if (stage === 2) {
    introLeftUnlocked = false;
    measureIntroLeftSwipeRange();
    setIntroLeftSwipePosition(introLeftSwipeMaxLeft, true);
  }
}

function completeIntroLeftSwipe() {
  if (introOpened || introLeftUnlocked || introStage !== 2) return;
  introLeftUnlocked = true;
  if (introLeftScreenEl) {
    introLeftScreenEl.classList.add("swipe-complete");
  }
  window.setTimeout(() => {
    if (introOpened) return;
    setIntroStage(3);
  }, INTRO_STAGE_SWITCH_DELAY_MS);
}

function completeIntroUpSwipe() {
  if (introOpened || introStage !== 3) return;
  if (introUpScreenEl) {
    introUpScreenEl.classList.add("swipe-complete");
  }
  window.setTimeout(() => {
    if (!introOpened) finishIntro();
  }, INTRO_SWIPE_FINISH_DELAY_MS);
}

function beginIntroLeftSwipe(event) {
  if (!introSwipeLeftHandleEl || introOpened || introStage !== 2 || introLeftUnlocked) return;
  introLeftSwipeActive = true;
  introLeftSwipePointerId = event.pointerId;
  introLeftSwipeStartX = event.clientX;
  introLeftSwipeStartLeft = introLeftSwipeLeft;
  introSwipeLeftHandleEl.classList.add("is-dragging");
  if (introSwipeLeftHandleEl.setPointerCapture) {
    introSwipeLeftHandleEl.setPointerCapture(event.pointerId);
  }
}

function moveIntroLeftSwipe(event) {
  if (!introLeftSwipeActive || introOpened || introStage !== 2 || introLeftUnlocked) return;
  if (introLeftSwipePointerId !== null && event.pointerId !== introLeftSwipePointerId) return;
  const delta = event.clientX - introLeftSwipeStartX;
  setIntroLeftSwipePosition(introLeftSwipeStartLeft + delta);
}

function endIntroLeftSwipe(event, cancelled = false) {
  if (!introLeftSwipeActive || !introSwipeLeftHandleEl) return;
  if (introLeftSwipePointerId !== null && event && event.pointerId !== introLeftSwipePointerId) return;
  introLeftSwipeActive = false;
  introLeftSwipePointerId = null;
  introSwipeLeftHandleEl.classList.remove("is-dragging");
  if (introStage === 2 && !introLeftUnlocked && !cancelled) {
    setIntroLeftSwipePosition(introLeftSwipeMaxLeft, true);
  }
}

function handleIntroUpStart(event) {
  if (introOpened || introStage !== 3) return;
  introUpPointerId = event.pointerId;
  introUpTouchId = null;
  introUpStartX = event.clientX;
  introUpStartY = event.clientY;
  const target = event.currentTarget;
  if (target instanceof Element && typeof target.setPointerCapture === "function") {
    target.setPointerCapture(event.pointerId);
  }
}

function handleIntroUpEnd(event) {
  if (introOpened || introStage !== 3) return;
  if (introUpPointerId !== null && event.pointerId !== introUpPointerId) return;
  introUpPointerId = null;
  introUpTouchId = null;

  const deltaY = introUpStartY - event.clientY;
  const deltaX = Math.abs(event.clientX - introUpStartX);
  if (deltaY >= INTRO_SWIPE_UP_THRESHOLD && deltaY > deltaX * 1.15) {
    completeIntroUpSwipe();
  }
}

function handleIntroUpTouchStart(event) {
  if (introOpened || introStage !== 3) return;
  const touch = event.changedTouches && event.changedTouches[0];
  if (!touch) return;
  introUpTouchId = touch.identifier;
  introUpPointerId = null;
  introUpStartX = touch.clientX;
  introUpStartY = touch.clientY;
  event.preventDefault();
}

function handleIntroUpTouchEnd(event) {
  if (introOpened || introStage !== 3) return;
  if (introUpTouchId === null) return;

  let touch = null;
  for (let i = 0; i < event.changedTouches.length; i += 1) {
    const candidate = event.changedTouches[i];
    if (candidate.identifier === introUpTouchId) {
      touch = candidate;
      break;
    }
  }

  if (!touch) return;
  introUpTouchId = null;

  const deltaY = introUpStartY - touch.clientY;
  const deltaX = Math.abs(touch.clientX - introUpStartX);
  if (deltaY >= INTRO_SWIPE_UP_THRESHOLD && deltaY > deltaX * 1.15) {
    completeIntroUpSwipe();
  }
}

function bindIntroLeftScreen() {
  if (!introSwipeLeftHandleEl || !introSwipeLeftTrackEl) return;

  introSwipeLeftHandleEl.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    beginIntroLeftSwipe(event);
  });

  introSwipeLeftHandleEl.addEventListener("pointermove", moveIntroLeftSwipe);
  introSwipeLeftHandleEl.addEventListener("pointerup", (event) => endIntroLeftSwipe(event));
  introSwipeLeftHandleEl.addEventListener("pointercancel", (event) => endIntroLeftSwipe(event, true));

  introSwipeLeftHandleEl.addEventListener("keydown", (event) => {
    if (introOpened || introStage !== 2) return;
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar" || event.key === "ArrowLeft") {
      event.preventDefault();
      completeIntroLeftSwipe();
    }
  });

  window.addEventListener("pointerup", (event) => endIntroLeftSwipe(event));
  window.addEventListener("pointercancel", (event) => endIntroLeftSwipe(event, true));
  window.addEventListener("resize", () => {
    if (introOpened || introStage !== 2) return;
    measureIntroLeftSwipeRange();
    if (introLeftUnlocked) {
      setIntroLeftSwipePosition(0, true);
      return;
    }
    setIntroLeftSwipePosition(introLeftSwipeMaxLeft, true);
  });
}

function bindIntroUpScreen() {
  if (!introUpScreenEl) return;

  introUpScreenEl.addEventListener("pointerdown", handleIntroUpStart);
  introUpScreenEl.addEventListener("pointerup", handleIntroUpEnd);
  introUpScreenEl.addEventListener("pointercancel", () => {
    introUpPointerId = null;
    introUpTouchId = null;
  });
  introUpScreenEl.addEventListener("touchstart", handleIntroUpTouchStart, { passive: false });
  introUpScreenEl.addEventListener("touchend", handleIntroUpTouchEnd, { passive: true });
  introUpScreenEl.addEventListener("touchcancel", () => {
    introUpTouchId = null;
  }, { passive: true });

  introUpScreenEl.setAttribute("tabindex", "0");
  introUpScreenEl.setAttribute("role", "button");
  introUpScreenEl.setAttribute("aria-label", "Deslize para cima para continuar");

  introUpScreenEl.addEventListener("keydown", (event) => {
    if (introOpened || introStage !== 3) return;
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar" || event.key === "ArrowUp") {
      event.preventDefault();
      completeIntroUpSwipe();
    }
  });

  window.addEventListener("pointerup", handleIntroUpEnd);
  window.addEventListener("pointercancel", () => {
    introUpPointerId = null;
    introUpTouchId = null;
  });
  window.addEventListener("touchend", handleIntroUpTouchEnd, { passive: true });
  window.addEventListener("touchcancel", () => {
    introUpTouchId = null;
  }, { passive: true });
}

function dropIntroText() {
  if (!introClickScreenEl) return;
  introClickScreenEl.classList.add("text-dropped");

  if (prefersReducedMotion) {
    introLetters.forEach((letter) => letter.classList.add("dropped"));
    return;
  }

  introLetters.forEach((letter) => {
    if (letter.classList.contains("space-letter")) return;
    letter.classList.add("falling");

    const delay = Number.parseFloat(letter.style.getPropertyValue("--drop-delay")) || 0;
    const dur = Number.parseFloat(letter.style.getPropertyValue("--drop-dur")) || 1900;
    window.setTimeout(() => {
      letter.classList.add("dropped");
    }, delay + dur + 40);
  });
}

function autoplayIntroTrack() {
  if (introAutoplayStarted) return;
  introAutoplayStarted = true;
  clearActiveTrackState();
  playLocalTrack(INTRO_AUTOPLAY_TITLE, INTRO_AUTOPLAY_SOURCE, INTRO_AUTOPLAY_START_SECONDS);
}

function showMainContent() {
  document.body.classList.add("main-ready");
}

function finishIntro() {
  if (!introFlowEl || introOpened) return;
  introOpened = true;

  if (prefersReducedMotion) {
    introFlowEl.remove();
    showMainContent();
    syncCanvasAnimation();
    autoplayIntroTrack();
    return;
  }

  const activeIntroScreen =
    (!introUpScreenEl || introUpScreenEl.classList.contains("is-hidden"))
      ? ((!introLeftScreenEl || introLeftScreenEl.classList.contains("is-hidden")) ? introClickScreenEl : introLeftScreenEl)
      : introUpScreenEl;

  if (activeIntroScreen) {
    activeIntroScreen.classList.add("shattering");
  }
  introFlowEl.classList.add("is-leaving");

  window.setTimeout(() => {
    introFlowEl.remove();
    showMainContent();
    syncCanvasAnimation();
    autoplayIntroTrack();
  }, 380);
}

function handleIntroCrack() {
  if (!introClickScreenEl || introOpened || introStage !== 1) return;
  if (introClickCount >= 1) return;

  introClickCount = 1;
  introClickScreenEl.classList.add("cracked");
  introClickScreenEl.style.setProperty("--break-progress", (introClickCount / INTRO_CLICKS_REQUIRED).toFixed(3));

  triggerIntroImpact();
  addIntroFractures(INTRO_CLICKS_REQUIRED);

  dropIntroText();
  window.setTimeout(() => {
    if (!introOpened) setIntroStage(2);
  }, prefersReducedMotion ? 50 : INTRO_FIRST_STAGE_SWITCH_DELAY_MS);
}

function bindIntroScreen() {
  if (!introClickScreenEl) return;

  introClickScreenEl.addEventListener("click", () => {
    handleIntroCrack();
  });

  introClickScreenEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      handleIntroCrack();
    }
  });
}

function resizeCanvas() {
  if (!canvas || !ctx) return;

  sky.width = Math.max(window.innerWidth, 1);
  sky.height = Math.max(window.innerHeight, 1);
  sky.dpr = Math.min(window.devicePixelRatio || 1, 2);

  canvas.width = Math.round(sky.width * sky.dpr);
  canvas.height = Math.round(sky.height * sky.dpr);

  ctx.setTransform(sky.dpr, 0, 0, sky.dpr, 0, 0);
}

function buildStaticStars() {
  sky.stars = [];

  const areaFactor = clamp((sky.width * sky.height) / 900000, 0.55, 1.2);
  const count = Math.round(MAX_STATIC_STARS * areaFactor);

  for (let i = 0; i < count; i += 1) {
    sky.stars.push({
      x: randomBetween(0, sky.width),
      y: randomBetween(0, sky.height * 0.45),
      r: randomBetween(0.6, 1.7),
      alpha: randomBetween(0.3, 0.9),
      twinkle: randomBetween(0.4, 1.2),
      phase: randomBetween(0, Math.PI * 2)
    });
  }
}

function spawnMeteor({ special = false } = {}) {
  if (prefersReducedMotion) return;

  const maxAllowed = special ? MAX_METEORS + 1 : MAX_METEORS;
  if (sky.meteors.length >= maxAllowed) return;

  const speed = special ? randomBetween(460, 620) : randomBetween(280, 430);
  const vx = speed;
  const vy = speed * randomBetween(0.52, 0.66);

  sky.meteors.push({
    x: randomBetween(-sky.width * 0.18, sky.width * 0.58),
    y: randomBetween(-sky.height * 0.18, sky.height * 0.3),
    vx,
    vy,
    life: special ? randomBetween(0.9, 1.25) : randomBetween(0.8, 1.5),
    age: 0,
    tail: special ? randomBetween(150, 240) : randomBetween(90, 175),
    width: special ? randomBetween(1.6, 2.2) : randomBetween(1, 1.8),
    alpha: special ? randomBetween(0.78, 0.95) : randomBetween(0.46, 0.8)
  });
}

function updateMeteors(deltaSeconds) {
  for (let i = sky.meteors.length - 1; i >= 0; i -= 1) {
    const meteor = sky.meteors[i];
    meteor.age += deltaSeconds;
    meteor.x += meteor.vx * deltaSeconds;
    meteor.y += meteor.vy * deltaSeconds;

    const outOfBounds = meteor.x > sky.width + meteor.tail || meteor.y > sky.height + meteor.tail;
    const expired = meteor.age >= meteor.life;

    if (outOfBounds || expired) {
      sky.meteors.splice(i, 1);
    }
  }
}

function drawSky(ts) {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, sky.width, sky.height);

  for (let i = 0; i < sky.stars.length; i += 1) {
    const star = sky.stars[i];
    const flicker = 0.82 + Math.sin(ts * 0.0012 * star.twinkle + star.phase) * 0.18;
    ctx.globalAlpha = star.alpha * flicker;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 1;

  for (let i = 0; i < sky.meteors.length; i += 1) {
    const meteor = sky.meteors[i];
    const progress = clamp(1 - meteor.age / meteor.life, 0, 1);
    const angle = Math.atan2(meteor.vy, meteor.vx);
    const tailX = meteor.x - Math.cos(angle) * meteor.tail;
    const tailY = meteor.y - Math.sin(angle) * meteor.tail;

    const grad = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
    grad.addColorStop(0, `rgba(255,255,255,${(meteor.alpha * progress).toFixed(3)})`);
    grad.addColorStop(0.35, `rgba(255,245,220,${(meteor.alpha * 0.5 * progress).toFixed(3)})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");

    ctx.strokeStyle = grad;
    ctx.lineWidth = meteor.width;
    ctx.lineCap = "round";
    ctx.shadowColor = "rgba(255,255,255,0.36)";
    ctx.shadowBlur = meteor.width * 4;

    ctx.beginPath();
    ctx.moveTo(meteor.x, meteor.y);
    ctx.lineTo(tailX, tailY);
    ctx.stroke();

    ctx.shadowBlur = 0;
  }
}

function animateSky(ts) {
  if (!sky.running) return;

  if (!sky.lastTs) sky.lastTs = ts;
  const deltaSeconds = clamp((ts - sky.lastTs) / 1000, 0, 0.05);
  sky.lastTs = ts;

  if (!prefersReducedMotion && ts >= sky.nextSpawnTs && sky.meteors.length < MAX_METEORS) {
    spawnMeteor();
    sky.nextSpawnTs = ts + randomBetween(1800, 4200);
  }

  updateMeteors(deltaSeconds);
  drawSky(ts);
  sky.frameId = window.requestAnimationFrame(animateSky);
}

function syncCanvasAnimation() {
  if (!canvas || !ctx) return;

  if (prefersReducedMotion || document.hidden) {
    sky.running = false;
    if (sky.frameId) {
      window.cancelAnimationFrame(sky.frameId);
      sky.frameId = 0;
    }
    drawSky(performance.now());
    return;
  }

  if (sky.running) return;

  sky.running = true;
  sky.lastTs = 0;
  sky.nextSpawnTs = performance.now() + randomBetween(900, 1900);
  sky.frameId = window.requestAnimationFrame(animateSky);
}

function initCanvas() {
  if (!canvas || !ctx) return;

  resizeCanvas();
  buildStaticStars();
  drawSky(performance.now());

  window.addEventListener("resize", () => {
    resizeCanvas();
    buildStaticStars();
    drawSky(performance.now());
  });

  document.addEventListener("visibilitychange", syncCanvasAnimation);
  syncCanvasAnimation();
}

function handleMotionPreferenceChange(event) {
  prefersReducedMotion = event.matches;
  sky.meteors = [];
  buildStaticStars();
  syncCanvasAnimation();
}

function initMotionListeners() {
  if (typeof motionQuery.addEventListener === "function") {
    motionQuery.addEventListener("change", handleMotionPreferenceChange);
  } else if (typeof motionQuery.addListener === "function") {
    motionQuery.addListener(handleMotionPreferenceChange);
  }
}

function init() {
  document.body.classList.toggle("low-power", IS_LOW_POWER_DEVICE);
  hydratePlayerPreferences();

  prepareIntroLetters();
  renderMessage();
  renderPlayerList();

  applyPlayerVolume(playerVolume, false);
  setShuffleMode(isShuffleMode, false);

  bindIntroScreen();
  bindIntroLeftScreen();
  bindIntroUpScreen();
  bindQuoteEvents();
  bindPlayerEvents();
  bindNowPlayingEvents();
  bindModeToggle();

  initCanvas();
  initMotionListeners();
  updateNowPlaying("");

  if (introFlowEl) {
    setIntroStage(1);
  } else {
    showMainContent();
  }
}

init();
