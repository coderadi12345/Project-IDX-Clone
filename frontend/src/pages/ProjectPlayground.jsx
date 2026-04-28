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
import { CodeOutlined } from '@ant-design/icons';
import "allotment/dist/style.css";

export const ProjectPlayground = () => {
  const { projectId: projectFromUrl } = useParams();
  const { setProjectId, projectId } = useTreeStructureStore();
  const { setEditorSocket } = useEditorSocketStore();
  const { terminalSocket, setTerminalSocket } = useTerminalSocket();
  const [loadBrowser, setLoadBrowser] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const { port } = usePortStore();

  useEffect(() => {
    let ws;
    let editorSocketConn;
    if (projectFromUrl) {
      setProjectId(projectFromUrl);
      editorSocketConn = io(`${import.meta.env.VITE_BACKEND_URL}/editor`, {
        query: { projectId: projectFromUrl },
      });
      try {
        ws = new WebSocket(
          `ws://localhost:4000/terminal?projectId=${projectFromUrl}`
        );
        setTerminalSocket(ws);
      } catch (error) {
        console.log("error in ws", error);
      }
      setEditorSocket(editorSocketConn);
    }
    
    return () => {
        if (editorSocketConn) {
            editorSocketConn.disconnect();
        }
        if (ws) {
            ws.close();
        }
        setTerminalSocket(null);
        setEditorSocket(null);
    }
  }, [setProjectId, projectFromUrl, setEditorSocket, setTerminalSocket]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "#1e1e1e",
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          height: "40px",
          backgroundColor: "#181818",
          borderBottom: "1px solid #2b2b2b",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          color: "#ccc",
          fontSize: "13px",
          fontFamily: "'Inter', sans-serif",
          boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CodeOutlined style={{ color: '#007acc', fontSize: '16px' }} />
          <strong>Project IDE</strong>
          <span style={{ opacity: 0.5, margin: '0 8px' }}>|</span>
          <span 
            onClick={() => setShowSidebar(!showSidebar)}
            style={{ 
              color: showSidebar ? '#888' : '#007acc', 
              cursor: 'pointer',
              userSelect: 'none',
              transition: 'color 0.2s',
            }}
            title="Toggle File Explorer"
            onMouseEnter={(e) => e.currentTarget.style.color = '#ccc'}
            onMouseLeave={(e) => e.currentTarget.style.color = showSidebar ? '#888' : '#007acc'}
          >
            {projectFromUrl}
          </span>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          width: "100%",
          overflow: "hidden",
        }}
      >
        <Allotment style={{ height: "100%", width: "100%" }}>
          {/* Left Sidebar */}
          <Allotment.Pane 
            visible={!!(projectId && showSidebar)} 
            preferredSize={250} 
            minSize={200} 
            maxSize={400}
          >
            <div
              style={{
                backgroundColor: "#252526",
                paddingTop: "10px",
                paddingLeft: "5px",
                height: "100%",
                overflowY: "auto",
              }}
            >
              <TreeStructure />
            </div>
          </Allotment.Pane>
          
          {/* Center Split Area */}
          <Allotment.Pane minSize={400}>
            <Allotment vertical>
              <Allotment.Pane preferredSize="70%">
                <div style={{ height: '100%', borderBottom: '1px solid #2b2b2b' }}>
                  <EditorComponent />
                </div>
              </Allotment.Pane>
              <Allotment.Pane preferredSize="30%" minSize={150}>
                <div style={{ height: '100%', backgroundColor: '#1e1e1e' }}>
                  <BrowserTerminal />
                </div>
              </Allotment.Pane>
            </Allotment>
          </Allotment.Pane>

          {/* Right Side (Browser Preview) */}
          <Allotment.Pane preferredSize="35%" minSize={350}>
            <div
              style={{
                height: "100%",
                width: "100%",
                backgroundColor: "#1e1e1e",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Preview Toolbar */}
              <div style={{ 
                padding: "10px 15px", 
                backgroundColor: "#252526", 
                borderBottom: "1px solid #2b2b2b",
                display: "flex",
                alignItems: "center"
              }}>
                <Button
                  type="primary"
                  className="btn-premium"
                  onClick={() => setLoadBrowser(true)}
                  style={{ height: '32px' }}
                >
                 Run Project
                </Button>
                {!loadBrowser && (
                  <span style={{ marginLeft: "15px", color: "#666", fontSize: "12px", fontStyle: "italic" }}>
                    Click run to start preview
                  </span>
                )}
              </div>

              <div style={{ flex: 1, overflow: "hidden", position: "relative" }}>
                {loadBrowser && projectFromUrl && terminalSocket ? (
                  <Browser projectId={projectFromUrl} />
                ) : (
                  <div style={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: '#555'
                  }}>
                     Preview not loaded
                  </div>
                )}
              </div>
            </div>
          </Allotment.Pane>
        </Allotment>
      </div>
      <div style={{ display: 'none' }}>
        <EditorButton isActive={false} />
        <EditorButton isActive={true} />
      </div>
    </div>
  );
};
