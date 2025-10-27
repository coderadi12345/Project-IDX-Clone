import Docker from 'dockerode'

const docker = new Docker()

export const handleContainerCreate = async (projectId , socket) =>{
    console.log('Project Id is received for container create', projectId)
    try {
        
        const container = await docker.createContainer({
            Image: 'sandbox',
            AttachStdin: true,
            AttachStdout: true,
            AttachStderr: true,
            CMD: ['/bin/bash'],
            Tty: true,
            User: 'sandbox',
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
                ExposedPorts: {
                    '5173/tcp':{}

                },
                Env: ['HOST=0.0.0.0']
            }
        })

        console.log('Container Created',container.id)
        await container.start()
        console.log('container started')

        container.exec({
            Cmd: ['/bin/bash'],
            User: 'sandbox',
            AttachStdin:true,
            AttachStdout: true,
            AttachStderr:true,

        } , (err,exec)=>{
            if(err){
                console.log('Error while creating exec',err)
                return
            }
            exec.start({hijack:true} , (err , stream)=>{
                  if(err){
                console.log('Error while creating exec',err)
                return
            }
            processStream(stream, socket)
            socket.on('shell-input',(data)=>{
                console.log('received from frontend',data)
                stream.write(data)
            })
            })
        })
    } catch (error) {
        console.log('Error while creating container', error)
    }
}

function processStream(stream , socket){
    let buffer = Buffer.from('')
    stream.on('data',(data)=>{
        buffer = Buffer.concat([buffer,data])
        socket.emit('shell-output', buffer.toString())
        buffer = Buffer.from('')

    })

    stream.on('end', ()=>{
        console.log('Stream ended')
        socket.emit('shell-output', 'stream ended')

    })
    stream.on('error', (err)=>{
        console.log('Stream error',err)
        socket.emit('shell-output','Stream err')

    })
}

