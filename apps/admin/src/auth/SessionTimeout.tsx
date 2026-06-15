import { useEffect, useRef } from "react";
import { useAuth } from "./AuthProvider";
import { signOut } from "../services/authService";

const INACTIVITY_LIMIT = 15 * 60 * 1000;
const CHECK_INTERVAL = 30 * 1000;

function SessionTimeout() {
  const { session } = useAuth();
  const lastActivity = useRef(Date.now());
  const isSigningOut = useRef(false);

  useEffect(() => {
    if (!session) {
      return;
    }

    lastActivity.current = Date.now();
    isSigningOut.current = false;

    function registerActivity() {
      lastActivity.current = Date.now();
    }

    async function checkInactivity() {
      const inactivityTime = Date.now() - lastActivity.current;

      if (
        inactivityTime < INACTIVITY_LIMIT ||
        isSigningOut.current
      ) {
        return;
      }

      isSigningOut.current = true;

      try {
        await signOut();
      } finally {
        window.location.replace("/login");
      }
    }

    const events = [
      "pointerdown",
      "keydown",
      "scroll",
      "touchstart",
    ] as const;

    events.forEach((eventName) => {
      window.addEventListener(eventName, registerActivity, {
        passive: true,
      });
    });

    const intervalId = window.setInterval(
      () => void checkInactivity(),
      CHECK_INTERVAL,
    );

    function handleVisibilityChange() {
      if (document.visibilityState === "visible") {
        void checkInactivity();
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, registerActivity);
      });

      window.clearInterval(intervalId);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [session]);

  return null;
}

export default SessionTimeout;