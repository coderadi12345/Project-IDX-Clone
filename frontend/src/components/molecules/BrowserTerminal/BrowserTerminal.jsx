import {Terminal} from '@xterm/xterm'
import { FitAddon} from '@xterm/addon-fit'
import '@xterm/xterm/css/xterm.css' 
import { useEffect , useRef } from 'react'
import {io} from 'socket.io-client'
import { useParams } from 'react-router-dom'
import {AttachAddon} from 'xterm-addon-attach'
import { useTerminalSocket } from '../../../store/terminalSocketStore'
export const BrowserTerminal = () =>{
    
    const terminalRef = useRef(null)
    // const socket = useRef(null)
    // const {projectId: projectFromUrl} = useParams()

    const { terminalSocket} = useTerminalSocket()

    useEffect(()=>{
        const term  = new Terminal({
            cursorBlink: true,
            theme: {
                background: '#282a37',
                foreground: '#f8f8f3',
                cursor: '#f8f8f3',
                cursorAccent: '#282a37',
                red: '#ff5544',
                green: '#50fa7c',
                yellow: '#f1fa8c',
                cyan: '#8be9fd'


            },
            fontSize: 16,
            fontFamily: 'monospace',
            convertEol: true
        })
    
        term.open(terminalRef.current)
        let fitAddon = new FitAddon()
        term.loadAddon(fitAddon)
        fitAddon.fit()

        if(terminalSocket){
            
      terminalSocket.onopen = () =>{
        const attachAddon = new AttachAddon(terminalSocket)
        term.loadAddon(attachAddon)
       }
        }


        return () =>{
            term.dispose()
            
        }
    } , [terminalSocket])

    return (
        <div
        ref={terminalRef}
        style={{
            
            height: '25vh',
            overflow: 'auto'

        }}
        className='terminal'
        id='terminal-container'
        >

        </div>
    )
}
