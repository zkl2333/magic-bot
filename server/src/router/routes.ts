import Router from 'koa-router'
import { getCompletions } from '../controllers/chatController'
import { register, login, userInfo, updateUserInfo, getBalance } from '../controllers/userController'
import assistantRouter from './assistantRouter'

const router = new Router()

// 助手相关
router.use(assistantRouter.routes(), assistantRouter.allowedMethods())
// 用户注册和登录
router.post('/user/register', register)
router.get('/user/info', userInfo)
router.post('/user/info', updateUserInfo)
router.post('/user/login', login)
router.get('/user/balance', getBalance)
router.post('/chat/completions', getCompletions)

export default router
