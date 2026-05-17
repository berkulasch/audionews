import "react-native-url-polyfill/auto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppState } from "react-native";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { MyListPreferences } from "./types";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          list_preferences: MyListPreferences | null;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          list_preferences?: MyListPreferences | null;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          list_preferences?: MyListPreferences | null;
          updated_at?: string;
        };
      };
    };
  };
}

function createSupabase(): SupabaseClient<Database> | null {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    if (__DEV__) {
      console.warn(
        "[supabase] EXPO_PUBLIC_SUPABASE_URL or EXPO_PUBLIC_SUPABASE_ANON_KEY missing; auth & sync disabled."
      );
    }
    return null;
  }
  return createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  });
}

export const supabase = createSupabase();
export const isSupabaseConfigured = supabase !== null;

if (supabase) {
  AppState.addEventListener("change", (state) => {
    if (state === "active") {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
