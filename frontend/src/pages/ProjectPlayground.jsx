import { useParams } from "react-router-dom"
import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent"
import { EditorButton } from "../components/atoms/EditorButton/EditorButton"
import { TreeStructure } from "../components/organisms/TreeSturcture/TreeStructure"

export const ProjectPlayground = () => {

const {projectId} = useParams()


    return (
        <>
       <p style={{ color: "white" }}>Project Id: {projectId}</p>


     <div style={{display: 'flex'}}>
        <div
        style={{
          backgroundColor: "#333254",
          paddingRight: "10px",
          paddingTop: "0.3vh",
          minWidth: "250px",
          maxWidth: "25%",
          height: "99.7vh",
          overflow: "auto",
        }}
      >
        <TreeStructure />
      </div>
        <EditorComponent/>

     </div>
      
        <EditorButton isActive = {false}/>
        <EditorButton isActive  = {true}/>
        </>
    )
}