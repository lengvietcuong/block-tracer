import { create } from "zustand";

type PaginationState = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
};

const useExaminerStateStore = create<PaginationState>((set) => ({
  currentPage: 1,
  setCurrentPage: (page) => set({ currentPage: page }),
}));

export default useExaminerStateStore;
