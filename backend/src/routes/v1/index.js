import express from 'express'
import { pingCheck } from '../../controllers/pingController.js'
import projecRouter from './project.js'
const router = express.Router()
router.use('/ping',pingCheck)

router.use('/projects',projecRouter)

export default router