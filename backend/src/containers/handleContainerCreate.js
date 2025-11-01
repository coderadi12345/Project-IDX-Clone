import path from 'path';
import Docker from 'dockerode';

const docker = new Docker();

export const listContainers = async () => {
  const containers = await docker.listContainers();
 console.log('Containers',containers)
 containers.forEach((containerInfo) => {
   console.log(containerInfo.Ports);
 });
}

export const handleContainerCreate = async (projectId, terminalSocket, req, tcpSocket, head) => {
  console.log('Project Id is received for container create', projectId);
  try {
let projectPath = path.resolve(process.cwd(), `projects/${projectId}`);

    if (process.platform === 'win32') {
      projectPath = projectPath.replace(/\\/g, '/'); 
      projectPath = projectPath.replace(/^([A-Z]):/, (_, drive) => `/${drive.toLowerCase()}`);
    }

    console.log('Binding project path to container:', projectPath);

    const container = await docker.createContainer({
      Image: 'sandbox',
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,
      Cmd: ['/bin/bash'],
      Tty: true,
      User: 'sandbox',
      ExposedPorts: { '5173/tcp': {} },
      Env: ['HOST=0.0.0.0'],
      HostConfig: {
        Binds: [`${projectPath}:/home/sandbox/app`],
        PortBindings: {
          '5173/tcp': [{ HostPort: '0' }],
        },
      },
    });

    console.log('Container Created:', container.id);
    await container.start();
    console.log('Container Started');

    terminalSocket.handleUpgrade(req, tcpSocket, head, (establishedWSConn) => {
      console.log('Connection upgraded to WebSocket');
      terminalSocket.emit('connection', establishedWSConn, req, container);
    });
  } catch (error) {
    console.error('Error while creating container:', error);
  }
};
