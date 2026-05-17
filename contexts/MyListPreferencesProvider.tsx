import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  DEFAULT_MY_LIST_PREFERENCES,
  MyListPreferences,
} from "../lib/types";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthProvider";

const STORAGE_KEY = "@mylist_preferences_v1";

interface MyListPreferencesContextValue {
  prefs: MyListPreferences;
  setPrefs: (next: MyListPreferences) => Promise<void>;
  isLoading: boolean;
  isSyncing: boolean;
  syncError: string | null;
}

export const MyListPreferencesContext =
  createContext<MyListPreferencesContextValue | null>(null);

function mergePreferences(
  local: MyListPreferences,
  remote: MyListPreferences
): MyListPreferences {
  const localFresher =
    new Date(local.updatedAt).getTime() >= new Date(remote.updatedAt).getTime();
  const scalar = localFresher ? local : remote;
  return {
    ...scalar,
    categories: Array.from(
      new Set([...local.categories, ...remote.categories])
    ),
    sources: Array.from(new Set([...local.sources, ...remote.sources])),
  };
}

function normalize(input: Partial<MyListPreferences> | null | undefined): MyListPreferences {
  if (!input || typeof input !== "object") return DEFAULT_MY_LIST_PREFERENCES;
  return {
    ...DEFAULT_MY_LIST_PREFERENCES,
    ...input,
    categories: Array.isArray(input.categories) ? input.categories : [],
    sources: Array.isArray(input.sources) ? input.sources : [],
  };
}

async function loadLocal(): Promise<MyListPreferences | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return normalize(JSON.parse(raw));
  } catch {
    return null;
  }
}

async function saveLocal(prefs: MyListPreferences): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    // best effort; storage failures shouldn't block the UI
  }
}

async function fetchRemote(userId: string): Promise<MyListPreferences | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("profiles")
    .select("list_preferences")
    .eq("id", userId)
    .maybeSingle<{ list_preferences: Partial<MyListPreferences> | null }>();
  if (error || !data) return null;
  return data.list_preferences ? normalize(data.list_preferences) : null;
}

async function pushRemote(
  userId: string,
  prefs: MyListPreferences
): Promise<void> {
  if (!supabase) return;
  await supabase.from("profiles").upsert(
    {
      id: userId,
      list_preferences: prefs,
      updated_at: prefs.updatedAt,
    } as never,
    { onConflict: "id" }
  );
}

export function MyListPreferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isAuthLoading } = useAuth();
  const userId = session?.user?.id ?? null;

  const [prefs, setPrefsState] = useState<MyListPreferences>(
    DEFAULT_MY_LIST_PREFERENCES
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const mergedForUserRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const local = await loadLocal();
      if (cancelled) return;
      if (local) setPrefsState(local);
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (isAuthLoading || isLoading) return;
    if (!userId) {
      mergedForUserRef.current = null;
      return;
    }
    if (mergedForUserRef.current === userId) return;
    mergedForUserRef.current = userId;

    let cancelled = false;
    (async () => {
      setIsSyncing(true);
      setSyncError(null);
      try {
        const remote = await fetchRemote(userId);
        const next = remote ? mergePreferences(prefs, remote) : prefs;
        if (cancelled) return;
        setPrefsState(next);
        await saveLocal(next);
        await pushRemote(userId, next);
      } catch (e) {
        if (!cancelled) {
          setSyncError(
            e instanceof Error ? e.message : "Senkronizasyon başarısız"
          );
        }
      } finally {
        if (!cancelled) setIsSyncing(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId, isAuthLoading, isLoading, prefs]);

  const setPrefs = useCallback(
    async (next: MyListPreferences) => {
      setPrefsState(next);
      await saveLocal(next);
      if (userId) {
        setIsSyncing(true);
        setSyncError(null);
        try {
          await pushRemote(userId, next);
        } catch (e) {
          setSyncError(
            e instanceof Error ? e.message : "Senkronizasyon başarısız"
          );
        } finally {
          setIsSyncing(false);
        }
      }
    },
    [userId]
  );

  const value = useMemo<MyListPreferencesContextValue>(
    () => ({ prefs, setPrefs, isLoading, isSyncing, syncError }),
    [prefs, setPrefs, isLoading, isSyncing, syncError]
  );

  return (
    <MyListPreferencesContext.Provider value={value}>
      {children}
    </MyListPreferencesContext.Provider>
  );
}
