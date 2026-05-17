import { useCallback, useContext } from "react";
import { Article, MyListPreferences } from "../lib/types";
import { filterArticles } from "../lib/filterArticles";
import { MyListPreferencesContext } from "../contexts/MyListPreferencesProvider";

export function useMyListPreferences() {
  const ctx = useContext(MyListPreferencesContext);
  if (!ctx) {
    throw new Error(
      "useMyListPreferences must be used inside MyListPreferencesProvider"
    );
  }

  const { prefs, setPrefs, isLoading, isSyncing, syncError } = ctx;

  const applyFilters = useCallback(
    (articles: Article[]) => filterArticles(articles, prefs),
    [prefs]
  );

  const updatePrefs = useCallback(
    (patch: Partial<MyListPreferences>) => {
      void setPrefs({
        ...prefs,
        ...patch,
        updatedAt: new Date().toISOString(),
      });
    },
    [prefs, setPrefs]
  );

  return {
    prefs,
    setPrefs,
    updatePrefs,
    applyFilters,
    isLoading,
    isSyncing,
    syncError,
  };
}
