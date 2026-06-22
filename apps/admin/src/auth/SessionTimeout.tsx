import { useSessionTimeout } from "@admin/hooks/auth/useSessionTimeout";
import { useAuth } from "./useAuth";

function SessionTimeout() {
  const { session, isLoading } = useAuth();

  useSessionTimeout({ session, isLoading });

  return null;
}

export default SessionTimeout;
