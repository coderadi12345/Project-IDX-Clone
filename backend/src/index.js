import express from "express"
import cors from 'cors'
import { Server } from 'socket.io'
import {createServer} from 'node:http'
import {PORT} from './config/serverConfig.js'
import apiRouter from './routes/index.js'
import chokidar from 'chokidar'
import { handleEditorSocketEvents } from "./socketHandlers/editorHandler.js"
import queryString from 'query-string'
import { handleContainerCreate, listContainers } from "./containers/handleContainerCreate.js"
import {WebSocketServer} from 'ws'
import { handleTerminalCreation } from "./containers/handleTerminalCreation.js"
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always point watcher to backend/projects
const BASE_PROJECTS_PATH = path.resolve(__dirname, '../projects');


const app = express()
const server = createServer(app)
const io = new Server(server , {
    cors: {
        origin: '*',
        method: ['GET', 'POST'],
    }
})

app.use(express.json())
app.use(express.urlencoded())
app.use(cors())

app.use('/api',apiRouter)

app.get('/ping' , (req,res)=>{
    return res.json({message: 'pong'})
})

const editorNamespace = io.of('/editor')

editorNamespace.on('connection', (socket) =>{
    console.log('editor connected')
   
    let projectId = socket.handshake.query['projectId']
    console.log('Project Id received after connection',projectId)

    if(projectId){
var watcher = chokidar.watch(path.join(BASE_PROJECTS_PATH, projectId), {
            ignored: (path) => path.includes('node_modules'),
            persistent: true,

            awaitWriteFinish: {
                stabilityThreshold: 2000
            },
            ignoreInitial: true
        })

        watcher.on('all' , (event , path) =>{
            console.log(event , path)
        })
    }

    socket.on('getPort', () => {
        console.log('getPort event received');
        listContainers();
    })

    handleEditorSocketEvents(socket,editorNamespace)

    socket.on('disconnect', async () => {
  if (watcher) {
    await watcher.close();
    console.log('Watcher closed');
  }
  console.log('editor disconnected');
});

})


server.listen(PORT,()=>{
    console.log(`Server running at port ${PORT}`)
    console.log(process.cwd())
})

const webSocketForTerminal = new WebSocketServer({
    noServer:true,
})

server.on('upgrade' ,(req ,tcp ,head)=>{
    const isTerminal  = req.url.includes('/terminal')

    if(isTerminal){
        console.log(req.url)
        const projectId = req.url.split('=')[1]
        console.log('Project id received after connection' , projectId)
        handleContainerCreate(projectId,webSocketForTerminal ,req , tcp,head)
    }
})

webSocketForTerminal.on('connection',(ws,req,container)=>{
    console.log('Terminal Connected')
    handleTerminalCreation(container , ws)


    ws.on('close',()=>{
        container.remove({force:true},(err,data)=>{
            if(err){
                console.log('Error while Removing container',err)
            }
            console.log('Container Removed',data)
        })
    })
})

