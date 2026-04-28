import express from "express"
import cors from 'cors'
import { Server } from 'socket.io'
import {createServer} from 'node:http'
import {PORT} from './config/serverConfig.js'
import apiRouter from './routes/index.js'
import chokidar from 'chokidar'
import { handleEditorSocketEvents } from "./socketHandlers/editorHandler.js"
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

        watcher.on('all', (event, path) => {
    console.log(event, path);

    // 🔥 send reload event
    socket.emit('fileChanged', {
        event,
        path
    });
});
    }

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