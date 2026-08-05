"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useStore } from "zustand";
import { createExamStore, type ExamState, type ExamStore } from "./exam-store";

const ExamStoreContext = createContext<ExamStore | null>(null);

export function ExamStoreProvider({ children, quizId, questionIds, userId }: { children: ReactNode; quizId: number; questionIds: number[]; userId: number }) {
  const [store] = useState(() => createExamStore({ quizId, questionIds, userId }));

  useEffect(() => {
    void store.persist.rehydrate();
  }, [store]);

  return <ExamStoreContext.Provider value={store}>{children}</ExamStoreContext.Provider>;
}

export function useExamStore<T>(selector: (state: ExamState) => T) {
  const store = useContext(ExamStoreContext);
  if (!store) throw new Error("useExamStore must be used inside ExamStoreProvider");
  return useStore(store, selector);
}

export function useExamStoreApi() {
  const store = useContext(ExamStoreContext);
  if (!store) throw new Error("useExamStoreApi must be used inside ExamStoreProvider");
  return store;
}
