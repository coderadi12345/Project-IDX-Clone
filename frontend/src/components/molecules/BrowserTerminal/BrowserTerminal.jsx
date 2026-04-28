import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import { useEffect, useRef } from 'react';
import { AttachAddon } from 'xterm-addon-attach';
import { useTerminalSocket } from '../../../store/terminalSocketStore';

export const BrowserTerminal = () => {
  const terminalRef = useRef(null);
  const { terminalSocket } = useTerminalSocket();
  const fitAddonRef = useRef(null);
  const termRef = useRef(null);

  // Initialize terminal only once on mount
  useEffect(() => {
    const term = new Terminal({
      cursorBlink: true,
      theme: {
        background: '#282a37',
        foreground: '#f8f8f3',
        cursor: '#f8f8f3',
        cursorAccent: '#282a37',
        red: '#ff5544',
        green: '#50fa7c',
        yellow: '#f1fa8c',
        cyan: '#8be9fd',
      },
      fontSize: 16,
      fontFamily: 'monospace',
      convertEol: true,
    });

    const fitAddon = new FitAddon();
    fitAddonRef.current = fitAddon;
    term.loadAddon(fitAddon);
    term.open(terminalRef.current);
    termRef.current = term;

    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });
    resizeObserver.observe(terminalRef.current);

    setTimeout(() => fitAddon.fit(), 100);

    return () => {
      resizeObserver.disconnect();
      term.dispose();
      termRef.current = null;
    };
  }, []);

  // Attach socket when available
  useEffect(() => {
    if (terminalSocket && termRef.current) {
      const attachAddon = new AttachAddon(terminalSocket);
      
      if (terminalSocket.readyState === WebSocket.OPEN) {
        termRef.current.loadAddon(attachAddon);
      } else {
        const handleOpen = () => {
          if (termRef.current) {
            termRef.current.loadAddon(attachAddon);
          }
        };
        terminalSocket.addEventListener('open', handleOpen);
        
        return () => {
          terminalSocket.removeEventListener('open', handleOpen);
          attachAddon.dispose();
        };
      }

      return () => {
        attachAddon.dispose();
      };
    }
  }, [terminalSocket]);

  return (
    <div
      ref={terminalRef}
      style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
      }}
      className="terminal"
      id="terminal-container"
    />
  );
};

