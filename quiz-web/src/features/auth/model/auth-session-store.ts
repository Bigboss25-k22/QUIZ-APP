import { createStore } from "zustand/vanilla";

export type AuthStatus = "initializing" | "authenticated" | "anonymous";

export type AuthSessionState = {
  status: AuthStatus;
  setAuthenticated: () => void;
  setAnonymous: () => void;
};

export function createAuthSessionStore() {
  return createStore<AuthSessionState>()((set) => ({
    status: "initializing",
    setAuthenticated: () => set({ status: "authenticated" }),
    setAnonymous: () => set({ status: "anonymous" }),
  }));
}

export type AuthSessionStore = ReturnType<typeof createAuthSessionStore>;
