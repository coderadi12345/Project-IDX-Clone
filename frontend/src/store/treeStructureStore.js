import { QueryClient } from "@tanstack/react-query"
import { getProjectTree } from "../apis/project"
import { create } from "zustand"

export const useTreeStructureStore = create((set) => {

const queryClient  = new QueryClient()

    return {
        treeStructure: null,
        setTreeStructure: async(projectId) =>{
            const data = await queryClient.fetchQuery({
                   queryKey: ["projectTree", projectId],
                queryFn: () => getProjectTree({projectId})

            })
            console.log(data)

            set({
                treeStructure: data
            })
        }
    }

})