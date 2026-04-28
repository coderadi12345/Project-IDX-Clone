import uuid4 from 'uuid4';
import fs from 'fs/promises';
import { REACT_PROJECT_COMMAND } from '../config/serverConfig.js';
import { execPromisified } from '../utils/execUtility.js';
import path from 'path';
import directoryTree from 'directory-tree';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FIX: always use absolute path inside /home/sandbox/app
const BASE_PROJECTS_PATH = path.resolve(__dirname, '../../projects');

export const createProjectService = async () => {
    const projectId = uuid4();
    console.log('New project id is', projectId);

    const projectDir = path.join(BASE_PROJECTS_PATH, projectId);
    await fs.mkdir(projectDir, { recursive: true });

    const response = await execPromisified(REACT_PROJECT_COMMAND, {
        cwd: projectDir
    });

    const viteConfigPath = path.join(projectDir, 'sandbox', 'vite.config.js');
    const viteConfigContent = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    watch: {
      usePolling: true,
      interval: 100
    }
  }
})
`;
    await fs.writeFile(viteConfigPath, viteConfigContent);

    return projectId;
};

export const getProjectTreeService = async (projectId) => {
    const projectPath = path.join(BASE_PROJECTS_PATH, projectId);
    const tree = directoryTree(projectPath);
    return tree;
};
