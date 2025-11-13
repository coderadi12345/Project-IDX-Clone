import { useParams } from "react-router-dom";
import { EditorComponent } from "../components/molecules/EditorComponent/EditorComponent";
import { EditorButton } from "../components/atoms/EditorButton/EditorButton";
import { TreeStructure } from "../components/organisms/TreeSturcture/TreeStructure";
import { useEditorSocketStore } from "../store/editorSocketStore";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { useTreeStructureStore } from "../store/treeStructureStore";
import { BrowserTerminal } from "../components/molecules/BrowserTerminal/BrowserTerminal";
import { useTerminalSocket } from "../store/terminalSocketStore";
import { Browser } from "../components/organisms/Browser/Browser";
import { usePortStore } from "../store/portStore";
import { Button } from "antd";
import { Allotment } from "allotment";
import "allotment/dist/style.css";

export const ProjectPlayground = () => {
  const { projectId: projectFromUrl } = useParams();
  const { setProjectId, projectId } = useTreeStructureStore();
  const { setEditorSocket } = useEditorSocketStore();
  const { terminalSocket, setTerminalSocket } = useTerminalSocket();
  const [loadBrowser, setLoadBrowser] = useState(false);
  const { port } = usePortStore();

  useEffect(() => {
    if (projectFromUrl) {
      setProjectId(projectFromUrl);
      const editorSocketConn = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
        query: { projectId: projectFromUrl },
      });
      try {
        const ws = new WebSocket(
          `ws://localhost:4000/terminal?projectId=${projectFromUrl}`
        );
        setTerminalSocket(ws);
      } catch (error) {
        console.log("error in ws", error);
      }
      setEditorSocket(editorSocketConn);
    }
  }, [setProjectId, projectFromUrl, setEditorSocket, setTerminalSocket]);

  return (
    <>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        {/* Left Sidebar */}
        {projectId && (
          <div
            style={{
              backgroundColor: "#333254",
              paddingRight: "10px",
              paddingTop: "0.3vh",
              minWidth: "250px",
              maxWidth: "25%",
              height: "100%",
              overflowY: "auto",
            }}
          >
            <TreeStructure />
          </div>
        )}

        {/* Main Split Area */}
        <div style={{ flex: 1, height: "100%" }}>
          <Allotment style={{ height: "100%", width: "100%" }}>
            {/* Left Side (Editor + Terminal) */}
            <Allotment.Pane minSize={400}>
              <Allotment vertical>
                <Allotment.Pane preferredSize="70%">
                  <EditorComponent />
                </Allotment.Pane>
                <Allotment.Pane preferredSize="30%" minSize={150}>
                  <BrowserTerminal />
                </Allotment.Pane>
              </Allotment>
            </Allotment.Pane>

            {/* Right Side (Browser Preview) */}
            <Allotment.Pane preferredSize="35%" minSize={350}>
              <div
                style={{
                  height: "100%",
                  width: "100%",
                  backgroundColor: "#fff",
                  padding: "10px",
                  display: "flex",
                  flexDirection: "column",
                  boxSizing: "border-box",
                }}
              >
                <Button
                  onClick={() => setLoadBrowser(true)}
                  style={{ alignSelf: "flex-start", marginBottom: "10px" }}
                >
                  Load Browser
                </Button>

                <div style={{ flex: 1, overflow: "auto" }}>
                  {loadBrowser && projectFromUrl && terminalSocket && (
                    <Browser projectId={projectFromUrl} />
                  )}
                </div>
              </div>
            </Allotment.Pane>
          </Allotment>
        </div>
      </div>
      {}
      <EditorButton isActive={false} />
      <EditorButton isActive={true} />
    </>
  );
};
