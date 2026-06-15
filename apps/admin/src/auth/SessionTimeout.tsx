import { useEffect } from "react";
import { adminRoute, getAdminUrl } from "@shared/config/routes";
import { useAuth } from "./AuthProvider";
import { signOut } from "../services/authService";

const LAST_ACTIVITY_KEY = "portfolio-admin:last-activity";
const INACTIVITY_LIMIT = 15 * 60 * 1000;
const CHECK_INTERVAL = 30 * 1000;
const PERSIST_INTERVAL = 5 * 1000;

const ACTIVITY_EVENTS = [
  "pointerdown",
  "keydown",
  "scroll",
  "touchstart",
] as const;

function readLastActivity(): number {
  const storedValue = window.sessionStorage.getItem(LAST_ACTIVITY_KEY);
  const timestamp = Number(storedValue);

  return Number.isFinite(timestamp) && timestamp > 0
    ? timestamp
    : Date.now();
}

function saveLastActivity(timestamp: number): void {
  window.sessionStorage.setItem(LAST_ACTIVITY_KEY, String(timestamp));
}

function clearLastActivity(): void {
  window.sessionStorage.removeItem(LAST_ACTIVITY_KEY);
}

function SessionTimeout() {
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

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

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

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

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );

      window.clearInterval(intervalId);
    };
  }, [session, isLoading]);

  return null;
}

export default SessionTimeout;
