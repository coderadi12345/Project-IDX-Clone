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

    return projectId;
};

export const getProjectTreeService = async (projectId) => {
    const projectPath = path.join(BASE_PROJECTS_PATH, projectId);
    const tree = directoryTree(projectPath);
    return tree;
};
