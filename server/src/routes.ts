import Router from 'koa-router'
import { getCompletions } from './controllers/chatController'
import { register, login, userInfo, updateUserInfo, getBalance } from './controllers/userController'

const router = new Router()

// 用户注册和登录
router.post('/user/register', register)
router.get('/user/info', userInfo)
router.post('/user/info', updateUserInfo)
router.post('/user/login', login)
router.get('/user/balance', getBalance)
router.post('/chat/completions', getCompletions)

export default router
