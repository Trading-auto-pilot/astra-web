// src/components/atoms/base/AudioPlayer.tsx
import { useEffect, useRef, useState } from "react";

export type AudioPlayerProps = {
  src: string;
  className?: string;
  downloadable?: boolean;
};

const formatTime = (sec: number) => {
  if (!sec || !Number.isFinite(sec)) return "00:00";
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  const mm = minutes.toString().padStart(2, "0");
  const ss = seconds.toString().padStart(2, "0");
  return `${mm}:${ss}`;
};

export function AudioPlayer({
  src,
  className = "",
  downloadable = true,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0..100
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (!isSeeking && audio.duration) {
        setCurrentTime(audio.currentTime);
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isSeeking]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      void audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const handleSeek = (value: number) => {
    setProgress(value);
    setCurrentTime((value / 100) * duration);
  };

  const commitSeek = (value: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = (value / 100) * duration;
    setIsSeeking(false);
  };

  const handleDownload = () => {
    if (!downloadable || !src) return;
    const a = document.createElement("a");
    a.href = src;
    a.download = src.split("/").pop() || "audio-file.mp3";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setMenuOpen(false);
  };

  return (
    <div
      className={`
        flex items-center gap-3 rounded-full px-3 py-2
        bg-slate-100
        ${className}
      `}
    >
      <audio ref={audioRef} src={src} style={{ display: "none" }} />

      {/* Play / Pause */}
      <button
        type="button"
        onClick={togglePlayPause}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        {isPlaying ? (
          // pausa
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5h3v14H8zM13 5h3v14h-3z" />
          </svg>
        ) : (
          // play
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      {/* Time */}
      <div className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      {/* Slider */}
      <div className="flex-1">
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={(e) => {
            setIsSeeking(true);
            const v = Number(e.target.value);
            handleSeek(v);
          }}
          onMouseUp={(e) => commitSeek(Number((e.target as HTMLInputElement).value))}
          onTouchEnd={(e) => commitSeek(Number((e.target as HTMLInputElement).value))}
          className="
            w-full h-1 cursor-pointer appearance-none rounded-full
            bg-muted-foreground/20
            accent-primary
          "
        />
      </div>

      {/* Mute + menu */}
      <div className="relative flex flex-col gap-1">
        <button
          type="button"
          onClick={toggleMute}
          className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted transition-colors"
        >
          {isMuted ? (
            // volume off
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 9v6h4l5 5V4l-5 5H9z" />
              <path d="M3 3l18 18" />
            </svg>
          ) : (
            // volume up
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 9v6h4l5 5V4l-5 5H9z" />
              <path d="M19 12a4 4 0 0 0-4-4" />
            </svg>
          )}
        </button>

        {downloadable && (
          <>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-muted transition-colors"
            >
              {/* more (3 dots) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <circle cx="12" cy="5" r="1.6" />
                <circle cx="12" cy="12" r="1.6" />
                <circle cx="12" cy="19" r="1.6" />
              </svg>
            </button>

            {menuOpen && (
              <div
                className="
                  absolute right-0 top-full mt-1 min-w-[120px]
                  rounded-md border bg-popover text-popover-foreground
                  shadow-md text-xs py-1 z-10
                "
              >
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full px-3 py-1 text-left hover:bg-muted"
                >
                  Download
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default AudioPlayer;
