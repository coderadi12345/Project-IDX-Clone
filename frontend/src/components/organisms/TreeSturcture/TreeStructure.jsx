import { useParams } from "react-router-dom"
import { useTreeStructureStore } from "../../../store/treeStructureStore"
import { useEffect } from "react"
import { Tree } from "../../molecules/Tree/Tree"

export const TreeStructure = () => {

     const {treeStructure , setTreeStructure} = useTreeStructureStore()

     const {projectId} = useParams()

     useEffect(() =>{

        if(treeStructure){
            console.log('tree:' , treeStructure)
        }
        else {
            setTreeStructure(projectId)
        }
        

     }, [projectId ,setTreeStructure])

    return (
        <div>

            <Tree
            fileFolderData={treeStructure}/>
        </div>
    )
}