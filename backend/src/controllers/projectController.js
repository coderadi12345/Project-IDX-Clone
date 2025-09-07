import util from 'util'
import uuid4 from 'uuid4'
import fs from 'fs/promises'
import child_process from 'child_process'

const execPromisified  = util.promisify(child_process.exec);
export const createProjectController = async(req  , res)=>{


    const projectId = uuid4()

    console.log('New project id is',projectId)

    await fs.mkdir(`./projects/${projectId}`)

    const response = await execPromisified('npm create vite@latest sandbox -- --template react' , {
        cwd: `./projects/${projectId}`
    })

            return res.json({message: 'Project Created'})
}  