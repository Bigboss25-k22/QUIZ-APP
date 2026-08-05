import { describe, expect, it } from "vitest";
import { createAuthSessionStore } from "./auth-session-store";

describe("auth session store", () => {
  it("chỉ quản lý lifecycle của phiên, không chứa user data", () => {
    const store = createAuthSessionStore();
    expect(store.getState().status).toBe("initializing");
    store.getState().setAuthenticated();
    expect(store.getState().status).toBe("authenticated");
    store.getState().setAnonymous();
    expect(store.getState().status).toBe("anonymous");
    expect(store.getState()).not.toHaveProperty("user");
  });
});
