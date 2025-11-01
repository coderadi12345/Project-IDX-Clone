import { useParams } from "react-router-dom"
import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent"
import { EditorButton } from "../components/atoms/EditorButton/EditorButton"
import { TreeStructure } from "../components/organisms/TreeSturcture/TreeStructure"
import { useEditorSocketStore } from "../store/editorSocketStore"
import {io} from 'socket.io-client'
import { useEffect } from "react"
import { useTreeStructureStore } from "../store/treeStructureStore"
import { BrowserTerminal } from "../components/molecules/BrowserTerminal/BrowserTerminal"
import { useTerminalSocket } from "../store/terminalSocketStore"

export const ProjectPlayground = () => {

const {projectId: projectFromUrl}  = useParams()
  const { setProjectId, projectId } = useTreeStructureStore();

const {setEditorSocket , editorSocket} = useEditorSocketStore()
const {setTerminalSocket } = useTerminalSocket()

function fetchPort(){
   editorSocket.emit('getPort')
}

useEffect(() => {
  if(projectFromUrl){
    setProjectId(projectFromUrl)
    const editorSocketConn = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
      query: {
        projectId: projectFromUrl,
      },
    })

    const ws  = new WebSocket('ws://localhost:3000/terminal?projectId='+projectFromUrl)
    setTerminalSocket(ws)
    setEditorSocket(editorSocketConn) 
  }
    
  }, [setProjectId,projectFromUrl, setEditorSocket , setTerminalSocket])


    return (
        <>

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
        <div>
          <button onClick={fetchPort}>
            getPort
          </button>
        </div>
        <div>
          <BrowserTerminal/>
        </div>
        </>
    )
}