import { useParams } from "react-router-dom"
import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent"
import { EditorButton } from "../components/atoms/EditorButton/EditorButton"
import { TreeStructure } from "../components/organisms/TreeSturcture/TreeStructure"
import { useEditorSocketStore } from "../store/editorSocketStore"
import {io} from 'socket.io-client'
import { useEffect,useState } from "react"
import { useTreeStructureStore } from "../store/treeStructureStore"
import { BrowserTerminal } from "../components/molecules/BrowserTerminal/BrowserTerminal"
import { useTerminalSocket } from "../store/terminalSocketStore"
import { Browser } from "../components/organisms/Browser/Browser"
import { usePortStore } from "../store/portStore"
import { Button } from "antd"

export const ProjectPlayground = () => {

const {projectId: projectFromUrl}  = useParams()
  const { setProjectId, projectId } = useTreeStructureStore();

const {setEditorSocket , editorSocket} = useEditorSocketStore()
const { terminalSocket, setTerminalSocket } = useTerminalSocket()

const [loadBrowser, setLoadBrowser] = useState(false)

const {port} = usePortStore()


useEffect(() => {
  if(projectFromUrl){
    setProjectId(projectFromUrl)
    const editorSocketConn = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
      query: {
        projectId: projectFromUrl,
      },
    })
    try {
      const ws  = new WebSocket('ws://localhost:4000/terminal?projectId='+projectFromUrl)
      setTerminalSocket(ws)

    } catch (error) {
      console.log('error in ws',error)
    }
    
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
          <BrowserTerminal/>
        </div>
        <div>
          <Button 
          onClick={()=>setLoadBrowser(true)}
          >Load Browser</Button>
          { loadBrowser && projectFromUrl && terminalSocket && <Browser projectId = {projectFromUrl}/> }
        </div>
        </>
    )
}