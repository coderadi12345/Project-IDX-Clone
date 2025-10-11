import { QueryClient } from "@tanstack/react-query";
import { getProjectTree } from "../apis/project";
import { create } from "zustand";

export const useTreeStructureStore = create((set) => {
  const queryClient = new QueryClient();

  return {
    projectId: null,
    treeStructure: null,
    loading: false,
    error: null,

    setProjectId: (projectId) => set({ projectId }),

    setTreeStructure: async (projectId) => {
      if (!projectId) return;

      set({ loading: true, error: null });

      try {
        const data = await queryClient.fetchQuery({
          queryKey: [`projecttree-${projectId}`],
          queryFn: () => getProjectTree({ projectId }),
        });

        console.log("Fetched tree:", data);

        set({ treeStructure: data, loading: false });
      } catch (err) {
        set({ error: err.message, loading: false });
        console.error("Failed to fetch tree:", err);
      }
    },
  };
});

