import { useEffect, useRef, useState } from "react";

import { fetchProfileContactEmail } from "@portfolio/services/profileEmailService";

export type EmailPanelState = "hidden" | "loading" | "success" | "empty" | "error";

const COPY_TOAST_MS = 2500;

async function copyTextToClipboard(value: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    try {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);
      return copied;
    } catch {
      return false;
    }
  }
}

export function useProfileEmailReveal() {
  const [email, setEmail] = useState<string | null>(null);
  const [panelState, setPanelState] = useState<EmailPanelState>("hidden");
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  function clearCopyToast() {
    if (copyTimeoutRef.current) {
      clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = null;
    }

    setIsCopied(false);
  }

  async function handleMailClick() {
    if (panelState === "loading") {
      return;
    }

    if (panelState !== "hidden") {
      clearCopyToast();
      setPanelState("hidden");
      return;
    }

    if (email) {
      setPanelState("success");
      return;
    }

    setPanelState("loading");

    try {
      const result = await fetchProfileContactEmail();

      if (result.kind === "success") {
        setEmail(result.email);
        setPanelState("success");
        return;
      }

      if (result.kind === "empty") {
        setPanelState("empty");
        return;
      }

      setPanelState("error");
    } catch {
      setPanelState("error");
    }
  }

  async function handleCopyEmail() {
    if (!email) {
      return;
    }

    const copied = await copyTextToClipboard(email);

    if (!copied) {
      return;
    }

    clearCopyToast();
    setIsCopied(true);
    copyTimeoutRef.current = setTimeout(() => {
      setIsCopied(false);
      copyTimeoutRef.current = null;
    }, COPY_TOAST_MS);
  }

  return {
    email,
    panelState,
    isCopied,
    isMailExpanded:
      panelState !== "hidden" && panelState !== "loading",
    isMailLoading: panelState === "loading",
    handleMailClick,
    handleCopyEmail,
  };
}
