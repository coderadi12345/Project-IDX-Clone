import Docker from 'dockerode'

const docker = new Docker()

export const handleContainerCreate = async (projectId , terminalSocket,req,tcpSocket,head) =>{
    console.log('Project Id is received for container create', projectId)
    try {
        
        const container = await docker.createContainer({
            Image: 'sandbox',
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            Cmd: ['/bin/bash'],
            Tty: true,
            User: 'sandbox',

            ExposedPorts: {
                    '5173/tcp':{}

                },
            Env: ['HOST=0.0.0.0'],
            HostConfig: {
                Binds: [
                    `${process.cwd()}/../projects/${projectId}:/home/sandbox/app`

                ],
                PortBindings: {
                    '5173/tcp': [
                        {
                            'HostPort': '0'
                        }
                    ]
                },
                
            }
        })

        console.log('Container Created',container.id)
        await container.start()
        console.log('container started')

        terminalSocket.handleUpgrade(req, tcpSocket,head ,(establishedWSConn)=>{
            console.log("Connection upgraded to websocket")
           terminalSocket.emit('connection',establishedWSConn , req,container)
        })
    } catch (error) {
        console.log('Error while creating container', error)
    }
}

