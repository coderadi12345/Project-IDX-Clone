import { useEffect, useRef } from "react"
import { Input, Row } from 'antd'
import { useEditorSocketStore } from "../../../store/editorSocketStore"
import { usePortStore } from "../../../store/portStore"
import { ReloadOutlined, LockOutlined } from '@ant-design/icons';

export const Browser = ({projectId}) =>{

    const browserRef = useRef(null)
    const {port} = usePortStore()

    const {editorSocket} = useEditorSocketStore()

    useEffect(()=>{
        if(!port){
            editorSocket?.emit('getPort',{
                containerName: projectId
            })
        }
    },[port,editorSocket])

    if(!port){
        return (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                Starting container and finding port...
            </div>
        )
    }

    function handleRefresh(){
        if(browserRef.current){
            const oldAddr = browserRef.current.src
            browserRef.current.src = oldAddr
        }
    }

    return(
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
            {/* Fake Browser Address Bar */}
            <div style={{
                backgroundColor: '#252526',
                borderBottom: '1px solid #333',
                padding: '8px 15px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
            }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ff5f56' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                    <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: '#27c93f' }} />
                </div>
                
                <ReloadOutlined 
                    onClick={handleRefresh} 
                    style={{ color: '#ccc', cursor: 'pointer', fontSize: '14px', marginLeft: '10px' }} 
                />

                <div style={{
                    flex: 1,
                    backgroundColor: '#1e1e1e',
                    borderRadius: '4px',
                    padding: '4px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid #333',
                    marginLeft: '10px',
                    color: '#ccc',
                    fontSize: '13px',
                    fontFamily: "'Inter', sans-serif"
                }}>
                    <LockOutlined style={{ color: '#007acc', fontSize: '12px' }} />
                    <span style={{ opacity: 0.8 }}>localhost:{port}</span>
                </div>
            </div>

            <div style={{ flex: 1, position: 'relative' }}>
                <iframe
                    ref={browserRef}
                    src={`http://localhost:${port}`}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        backgroundColor: '#fff'
                    }}
                    title="Browser Preview"
                />
            </div>
        </div>
    )
}