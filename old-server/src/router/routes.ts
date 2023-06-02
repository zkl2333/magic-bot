import Router from 'koa-router'
import { getCompletions } from '../controllers/chatController'
import assistantRouter from './assistantRouter'
import userRouter from './userRouter'
import verificationRouter from './verificationRouter'

const router = new Router()

// 助手相关
router.use('/assistants', assistantRouter.routes(), assistantRouter.allowedMethods())
router.use('/user', userRouter.routes(), userRouter.allowedMethods())
router.use('/verification', verificationRouter.routes(), verificationRouter.allowedMethods())
router.post('/chat/completions', getCompletions)

export default router
