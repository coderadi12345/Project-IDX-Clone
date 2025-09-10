import { useParams } from "react-router-dom"
import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent"

export const ProjectPlayground = () => {

const {projectId} = useParams()


    return (
        <>
           
        Project Id: {projectId}
        <EditorComponent/>
        </>
    )
}