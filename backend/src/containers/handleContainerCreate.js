import path from 'path';
import Docker from 'dockerode';

const docker = new Docker();
const pendingCreations = new Map();

export const listContainers = async () => {
  const containers = await docker.listContainers();
 console.log('Containers',containers)
 containers.forEach((containerInfo) => {
   console.log(containerInfo.Ports);
 });
}

export const handleContainerCreate = async (projectId, terminalSocket, req, tcpSocket, head) => {
  console.log('Project Id is received for container create', projectId);

  if (pendingCreations.has(projectId)) {
    console.log('Container creation already in progress. Waiting...');
    return await pendingCreations.get(projectId);
  }

  const creationPromise = (async () => {
    try {
      let projectPath = path.resolve(process.cwd(), `projects/${projectId}`);

      if (process.platform === 'win32') {
        projectPath = projectPath.replace(/\\/g, '/'); 
        projectPath = projectPath.replace(/^([A-Z]):/, (_, drive) => `/${drive.toLowerCase()}`);
      }

      console.log('Binding project path to container:', projectPath);

      const existingContainer = await docker.listContainers({
        all: true,
        filters: JSON.stringify({ name: [`^/${projectId}$`] })
      });

      console.log("Existing container", existingContainer);

      if (existingContainer.length > 0) {
        console.log('Container already exists, reusing it');
        const container = docker.getContainer(existingContainer[0].Id);
        if (existingContainer[0].State !== 'running') {
          console.log('Starting stopped container');
          await container.start();
        }
        return container;
      }

      console.log("Creating a new container");


      const container = await docker.createContainer({
        Image: 'sandbox',
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Cmd: ['/bin/bash'],
        name: projectId,
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

      return container;
    } catch (error) {
      console.error('Error while creating container:', error);
      return undefined;
    }
  })();

  pendingCreations.set(projectId, creationPromise);
  try {
    return await creationPromise;
  } finally {
    pendingCreations.delete(projectId);
  }
};

export async function getContainerPort(containerName) {
    const container = await docker.listContainers({
        name: containerName
    });

    if(container.length > 0) {
        const containerInfo = await docker.getContainer(container[0].Id).inspect();
        console.log("Container info", containerInfo);
        try {
            return containerInfo?.NetworkSettings?.Ports["5173/tcp"][0].HostPort;
        } catch(error) {
            console.log("port not present");
            return undefined
        }
        
    }
}
