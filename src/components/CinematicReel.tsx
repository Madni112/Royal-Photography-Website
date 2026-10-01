"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, Film, Disc } from "lucide-react";
import { soundEngine } from "@/lib/sound";

const REEL_SCENES = [
  {
    id: "scene-1",
    title: "NOIR ÉTERNEL // Saint Laurent",
    tagline: "Anamorphic 35mm Master",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4",
    poster: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85",
    timecode: "00:01:24 // 24.00 FPS",
    resolution: "4K DCI ANAMORPHIC"
  },
  {
    id: "scene-2",
    title: "VALKYRIE // Apex Formula Circuit",
    tagline: "High-G Night Cinematography",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-traffic-lights-at-night-in-a-city-43224-large.mp4",
    poster: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85",
    timecode: "00:02:18 // 120 FPS HIGH SPEED",
    resolution: "8K RAW SONY VENICE 2"
  },
  {
    id: "scene-3",
    title: "SOLITUDE // Midnight Arctic Odyssey",
    tagline: "Aerial Cinema & Dolby Atmos",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4",
    poster: "https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1600&q=85",
    timecode: "00:03:45 // 24.00 FPS",
    resolution: "8K CINEMADNG AIR"
  }
];

export default function CinematicReel() {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentScene = REEL_SCENES[activeSceneIndex];

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      if (isPlaying) {
        videoRef.current.play().catch(() => setIsPlaying(false));
      }
    }
  }, [activeSceneIndex]);

  const togglePlay = () => {
    soundEngine.playClick();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    soundEngine.playClick();
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    soundEngine.playClick();
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => alert(err.message));
    } else {
      document.exitFullscreen();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 1);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  return (
    <section id="cinematic-reel" className="relative py-28 bg-black overflow-hidden">
      {/* Background Ethereal White Glow Backdrop */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-[85vw] h-[60vh] bg-gradient-to-r from-white/10 via-white/15 to-white/5 rounded-full blur-[140px] opacity-40 animate-pulse-slow" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-white/[0.1]">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">
              <Film className="w-4 h-4 text-white" />
              <span>BORDERLESS STREAMING ENGINE</span>
            </div>
            <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black text-white">
              DIRECTOR'S <span className="luxury-gradient-text">SHOWREEL</span>
            </h2>
          </div>

          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <span className="text-xs font-mono text-neutral-400">SELECT REEL CUT:</span>
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-900/90 border border-white/10">
              {REEL_SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  onClick={() => {
                    soundEngine.playClick();
                    setActiveSceneIndex(idx);
                  }}
                  onMouseEnter={() => soundEngine.playHover()}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                    activeSceneIndex === idx
                      ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  0{idx + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The Borderless Cinema Screen Container */}
        <div
          ref={containerRef}
          className="relative rounded-2xl overflow-hidden bg-black border border-white/20 shadow-[0_0_80px_rgba(255,255,255,0.15),0_25px_60px_rgba(0,0,0,0.95)] group"
        >
          {/* Top Laser Accent */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white to-transparent z-30 opacity-70" />

          {/* Video Player */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-black overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              src={currentScene.videoUrl}
              poster={currentScene.poster}
              autoPlay
              muted={isMuted}
              loop
              playsInline
              onTimeUpdate={handleTimeUpdate}
              className="w-full h-full object-cover"
            />

            {/* Cinematic Letterbox Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />

            {/* Watermark / Spec Details */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 pointer-events-none flex flex-col gap-1">
              <span className="px-2.5 py-1 rounded-md bg-black/80 border border-white/20 text-[10px] font-mono text-white tracking-widest backdrop-blur-md self-start">
                {currentScene.resolution}
              </span>
              <span className="font-cinzel text-base sm:text-xl font-bold text-white tracking-wide drop-shadow-md">
                {currentScene.title}
              </span>
              <span className="text-xs font-mono text-neutral-300">
                {currentScene.tagline}
              </span>
            </div>

            <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 pointer-events-none text-right">
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-300">
                <Disc className="w-3.5 h-3.5 animate-spin text-white" />
                <span>REC // LIVE STREAM</span>
              </div>
              <div className="text-[10px] font-mono text-neutral-400 mt-1">
                {currentScene.timecode}
              </div>
            </div>

            {/* Play Overlay Button if paused */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute z-30 w-20 h-20 rounded-full bg-white/95 text-black flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.7)] hover:scale-110 transition-transform"
              >
                <Play className="w-8 h-8 fill-current ml-1" />
              </button>
            )}

            {/* Bottom HUD Controls Bar */}
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/60 to-transparent z-20 flex flex-col gap-3 transition-opacity duration-300">
              {/* Scrubber Bar */}
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={duration || 100}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-white hover:h-2 transition-all"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={toggleMute}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title={isMuted ? "Unmute Audio" : "Mute Audio"}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-neutral-400" /> : <Volume2 className="w-4 h-4 text-white" />}
                  </button>

                  <div className="hidden sm:block text-xs font-mono text-neutral-400">
                    <span>{Math.floor(currentTime)}s</span> / <span>{Math.floor(duration)}s</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 text-xs font-mono text-neutral-400">
                    <Sparkles className="w-3.5 h-3.5 text-white" />
                    <span>MASTER COLOR PIPELINE: ACEScc</span>
                  </div>

                  <button
                    onClick={toggleFullscreen}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
