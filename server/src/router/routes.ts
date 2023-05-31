import Router from 'koa-router'
import { getCompletions } from '../controllers/chatController'
import assistantRouter from './assistantRouter'
import userRouter from './userRouter'
import VerificationController from '../controllers/VerificationController'

const router = new Router()

// 助手相关
router.use('/assistants', assistantRouter.routes(), assistantRouter.allowedMethods())
router.use('/user', userRouter.routes(), userRouter.allowedMethods())
router.post('/chat/completions', getCompletions)
router.post('/verify/:email/:code', VerificationController.verifyEmail)

export default router
