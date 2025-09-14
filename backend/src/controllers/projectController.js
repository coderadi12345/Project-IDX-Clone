import { createProjectService, getProjectTreeService } from "../service/projectService.js"
import directoryTree from "directory-tree"
export const createProjectController = async(req  , res)=>{

  const projectId = await createProjectService()
return res.json({ 
  message: 'Project Created',
  projectId 
})
}  

export const getProjectTree = async(req,res) =>{

  const tree = await getProjectTreeService(req.params.projectId)
  return res.status(200).json({
    data: tree,
    success: true,
    message: 'Successfully fetched tree'

  })
}