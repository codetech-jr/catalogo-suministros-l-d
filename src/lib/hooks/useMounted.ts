import { useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Hook to safely determine if the component has mounted on the client.
 * Uses useSyncExternalStore to avoid synchronous setState inside useEffect (React 19 compiler-compliant).
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
