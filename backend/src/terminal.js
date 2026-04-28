import express from 'express'
import cors from 'cors'
import { createServer } from 'http'
import { handleContainerCreate, listContainers } from "./containers/handleContainerCreate.js"
import {WebSocketServer} from 'ws'
import { handleTerminalCreation } from "./containers/handleTerminalCreation.js"

const app = express()
const server = createServer(app)

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

server.listen(4000, () => {
    console.log(`Server running at port 4000`)
    console.log(process.cwd())
})

const webSocketForTerminal = new WebSocketServer({
   server
})

webSocketForTerminal.on('connection',async(ws,req,container)=>{
    console.log('Terminal Connected')
    const isTerminal = req.url.includes('/terminal')

    if(isTerminal){
        console.log(req.url)
        const projectId = req.url.split('=')[1]
        console.log('Project id received after connection' , projectId)

        const container = await handleContainerCreate(projectId,webSocketForTerminal)

        if (container) {
            handleTerminalCreation(container, ws);
        } else {
            console.log('Container creation failed, closing socket');
            ws.close();
        }
    }

    ws.on('getPort', () => {
        console.log('getPort event received');
    }
    )
    
})

