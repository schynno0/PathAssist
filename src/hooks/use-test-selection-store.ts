
import { create } from 'zustand';
import type { Test } from '@/types';

interface TestSelectionState {
  selectedTestIds: string[];
  tests: Pick<Test, 'id' | 'name' | 'price'>[];
  addTest: (test: Pick<Test, 'id' | 'name' | 'price'>) => void;
  removeTest: (testId: string) => void;
  clearSelection: () => void;
  isTestSelected: (testId: string) => boolean;
}

export const useTestSelectionStore = create<TestSelectionState>((set, get) => ({
  selectedTestIds: [],
  tests: [],
  addTest: (test) =>
    set((state) => {
      if (!state.selectedTestIds.includes(test.id)) {
        return {
          selectedTestIds: [...state.selectedTestIds, test.id],
          tests: [...state.tests, test],
        };
      }
      return state;
    }),
  removeTest: (testId) =>
    set((state) => ({
      selectedTestIds: state.selectedTestIds.filter((id) => id !== testId),
      tests: state.tests.filter((t) => t.id !== testId),
    })),
  clearSelection: () => set({ selectedTestIds: [], tests: [] }),
  isTestSelected: (testId: string) => get().selectedTestIds.includes(testId),
}));
