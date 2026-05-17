import { useState, useRef, useCallback, createContext, useContext } from "react";
import { Audio, AVPlaybackStatus } from "expo-av";
import { Article } from "../lib/types";

interface AudioPlayerState {
  currentArticle: Article | null;
  isPlaying: boolean;
  progress: number; // 0-1
  duration: number; // ms
  position: number; // ms
  playbackRate: number;
  isLoading: boolean;
}

interface AudioPlayerActions {
  play: (article: Article) => Promise<void>;
  togglePlay: () => Promise<void>;
  seek: (position: number) => Promise<void>;
  setRate: (rate: number) => Promise<void>;
  skipForward: (seconds?: number) => Promise<void>;
  skipBackward: (seconds?: number) => Promise<void>;
}

export type AudioPlayerHook = AudioPlayerState & AudioPlayerActions;

// Singleton sound instance
let soundRef: Audio.Sound | null = null;

const defaultState: AudioPlayerState = {
  currentArticle: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  position: 0,
  playbackRate: 1,
  isLoading: false,
};

// Simple module-level state for demo (replace with Context in production)
let globalState = { ...defaultState };
let globalSetters: Array<(s: AudioPlayerState) => void> = [];

function notifyAll(state: AudioPlayerState) {
  globalState = state;
  globalSetters.forEach((fn) => fn(state));
}

export function useAudioPlayer(): AudioPlayerHook {
  const [state, setState] = useState<AudioPlayerState>(globalState);

  // Register this component's setter
  const setterRef = useRef(setState);
  setterRef.current = setState;

  // Add/remove setter on mount/unmount
  const stableSetState = useCallback((s: AudioPlayerState) => {
    setterRef.current(s);
  }, []);

  if (!globalSetters.includes(stableSetState)) {
    globalSetters.push(stableSetState);
  }

  const cleanup = useCallback(() => {
    globalSetters = globalSetters.filter((fn) => fn !== stableSetState);
  }, [stableSetState]);

  // Clean up on unmount - we rely on the component's useEffect for this
  // For now, just provide the state and actions

  const play = useCallback(async (article: Article) => {
    try {
      notifyAll({ ...globalState, isLoading: true, currentArticle: article });

      // Stop existing sound
      if (soundRef) {
        await soundRef.stopAsync();
        await soundRef.unloadAsync();
        soundRef = null;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
      });

      // Use a demo audio URL if no audioUrl on article
      const uri =
        article.audioUrl ??
        "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, progressUpdateIntervalMillis: 500 },
        (status: AVPlaybackStatus) => {
          if (!status.isLoaded) return;
          const progress =
            status.durationMillis && status.durationMillis > 0
              ? status.positionMillis / status.durationMillis
              : 0;
          notifyAll({
            ...globalState,
            isPlaying: status.isPlaying,
            progress,
            position: status.positionMillis,
            duration: status.durationMillis ?? 0,
            isLoading: false,
          });
        }
      );

      soundRef = sound;
      notifyAll({
        ...globalState,
        currentArticle: article,
        isPlaying: true,
        isLoading: false,
      });
    } catch (e) {
      console.error("Audio play error:", e);
      notifyAll({ ...globalState, isLoading: false });
    }
  }, []);

  const togglePlay = useCallback(async () => {
    if (!soundRef) return;
    if (globalState.isPlaying) {
      await soundRef.pauseAsync();
    } else {
      await soundRef.playAsync();
    }
  }, []);

  const seek = useCallback(async (position: number) => {
    if (!soundRef) return;
    await soundRef.setPositionAsync(position);
  }, []);

  const setRate = useCallback(async (rate: number) => {
    if (!soundRef) return;
    await soundRef.setRateAsync(rate, true);
    notifyAll({ ...globalState, playbackRate: rate });
  }, []);

  const skipForward = useCallback(async (seconds = 15) => {
    if (!soundRef) return;
    const newPos = Math.min(globalState.position + seconds * 1000, globalState.duration);
    await soundRef.setPositionAsync(newPos);
  }, []);

  const skipBackward = useCallback(async (seconds = 15) => {
    if (!soundRef) return;
    const newPos = Math.max(globalState.position - seconds * 1000, 0);
    await soundRef.setPositionAsync(newPos);
  }, []);

  return {
    ...state,
    play,
    togglePlay,
    seek,
    setRate,
    skipForward,
    skipBackward,
  };
}
