import { create } from "zustand"

export const useTerminalSocket = create((set)=>{

    return {
        terminalSocket:null,
        setTerminalSocket: (incomingSocket) =>{
            set({terminalSocket: incomingSocket})
        }
    }

})