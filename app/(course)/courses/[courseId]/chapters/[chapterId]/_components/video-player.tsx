"use client";

import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, PlayCircle } from "lucide-react";
import MuxPlayer from "@mux/mux-player-react";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti-store";

interface VideoPlayerProps {
  playbackId?: string | null;
  videoUrl?: string | null;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  isLocked: boolean;
  completeOnEnd: boolean;
  title: string;
}

// Load the YouTube IFrame API once and resolve when it's ready. Resolves to the
// global YT namespace, or rejects if it can't load (callers fall back silently).
function loadYouTubeApi(): Promise<any> {
  if (typeof window === "undefined") return Promise.reject();
  const w = window as any;
  if (w.YT?.Player) return Promise.resolve(w.YT);

  if (!w.__lhYtApiPromise) {
    w.__lhYtApiPromise = new Promise((resolve, reject) => {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.onerror = reject;
      document.head.appendChild(tag);

      let tries = 0;
      const timer = setInterval(() => {
        tries += 1;
        if (w.YT?.Player) {
          clearInterval(timer);
          resolve(w.YT);
        } else if (tries > 100) {
          clearInterval(timer);
          reject();
        }
      }, 100);
    });
  }

  return w.__lhYtApiPromise;
}

export const VideoPlayer = ({
  playbackId,
  videoUrl,
  courseId,
  chapterId,
  nextChapterId,
  isLocked,
  completeOnEnd,
  title,
}: VideoPlayerProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isReady, setIsReady] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const onEnd = async () => {
    try {
      if(completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, {
          isCompleted: true,
        });

        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success("Progress updated");
        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}/chapters/${nextChapterId}`);
        }
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // Keep the latest onEnd in a ref so the YouTube listener effect doesn't need
  // to re-subscribe on every render.
  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  const isYouTube = !!videoUrl && videoUrl.includes("youtube.com/embed");
  const iframeSrc = videoUrl
    ? isYouTube
      ? `${videoUrl}${videoUrl.includes("?") ? "&" : "?"}enablejsapi=1`
      : videoUrl
    : "";

  // Auto-complete the chapter when a YouTube (iframe) video finishes — the
  // Mux player wires this via onEnded, but the default URL provider needs the
  // YouTube IFrame API. Purely additive: if it fails, the manual "Mark as
  // complete" button still works.
  useEffect(() => {
    if (!completeOnEnd || isLocked || !isYouTube || !iframeRef.current) return;

    let player: any;
    let cancelled = false;

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !iframeRef.current) return;
        try {
          player = new YT.Player(iframeRef.current, {
            events: {
              onStateChange: (event: any) => {
                if (event?.data === YT.PlayerState?.ENDED) {
                  onEndRef.current();
                }
              },
            },
          });
        } catch {
          // Non-fatal — manual completion remains available.
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
      try {
        player?.destroy?.();
      } catch {
        // ignore
      }
    };
  }, [completeOnEnd, isLocked, isYouTube, iframeSrc]);

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 shadow-sm dark:border-slate-800 dark:shadow-elevate-dark">
      {!isReady && !isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-3 bg-slate-950">
          <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
          <p className="text-xs font-medium text-slate-400">Loading lesson...</p>
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-3 bg-slate-950 px-6 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-500/10 ring-1 ring-brand-500/20">
            <Lock className="h-6 w-6 text-brand-400" />
          </div>
          <p className="text-sm font-medium text-slate-200">This lesson is locked</p>
          <p className="max-w-xs text-xs text-slate-400">
            Enroll in the course to unlock this chapter and track your progress.
          </p>
        </div>
      )}
      {!isLocked && videoUrl && (
        <iframe
          ref={iframeRef}
          title={title}
          src={iframeSrc}
          className={cn("h-full w-full border-0", !isReady && "hidden")}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIsReady(true)}
        />
      )}
      {!isLocked && !videoUrl && playbackId && (
        <MuxPlayer
          title={title}
          className={cn("h-full w-full", !isReady && "hidden")}
          onCanPlay={() => setIsReady(true)}
          onEnded={onEnd}
          autoPlay
          playbackId={playbackId}
        />
      )}
      {!isLocked && !videoUrl && !playbackId && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-100 px-6 text-center text-sm text-slate-600 dark:bg-slate-900 dark:text-slate-300">
          <PlayCircle className="h-8 w-8 text-slate-400 dark:text-slate-500" />
          <p>The video for this lesson is on its way.</p>
        </div>
      )}
    </div>
  );
};
