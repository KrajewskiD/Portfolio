import { useEffect } from "react";
import type { Session } from "@supabase/supabase-js";
import { adminRoute, getAdminUrl } from "@shared/config/routes";

import {
  clearLastActivity,
  readLastActivity,
  saveLastActivity,
} from "@admin/auth/sessionActivity";
import { signOut } from "@admin/services/authService";

const INACTIVITY_LIMIT = 15 * 60 * 1000;
const CHECK_INTERVAL = 30 * 1000;
const PERSIST_INTERVAL = 5 * 1000;

const ACTIVITY_EVENTS = [
  "pointerdown",
  "keydown",
  "scroll",
  "touchstart",
] as const;

type UseSessionTimeoutParams = {
  session: Session | null;
  isLoading: boolean;
};

export function useSessionTimeout({ session, isLoading }: UseSessionTimeoutParams) {
  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!session) {
      clearLastActivity();
      return;
    }

    let lastActivity = readLastActivity();
    let lastPersistedActivity = lastActivity;
    let isSigningOut = false;

    saveLastActivity(lastActivity);

    function registerActivity() {
      const now = Date.now();

      lastActivity = now;

      if (now - lastPersistedActivity >= PERSIST_INTERVAL) {
        saveLastActivity(now);
        lastPersistedActivity = now;
      }
    }

    async function checkInactivity() {
      const inactivityTime = Date.now() - lastActivity;

      if (inactivityTime < INACTIVITY_LIMIT || isSigningOut) {
        return;
      }

      isSigningOut = true;

      try {
        await signOut("local");
        clearLastActivity();
        window.location.replace(getAdminUrl(adminRoute.login));
      } catch {
        isSigningOut = false;
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void checkInactivity();
      }
    }

    ACTIVITY_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, registerActivity, {
        passive: true,
      });
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);

    const intervalId = window.setInterval(
      () => void checkInactivity(),
      CHECK_INTERVAL,
    );

    void checkInactivity();

    return () => {
      saveLastActivity(lastActivity);

      ACTIVITY_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, registerActivity);
      });

      document.removeEventListener("visibilitychange", handleVisibilityChange);

      window.clearInterval(intervalId);
    };
  }, [isLoading, session]);
}
