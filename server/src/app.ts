import Koa, { DefaultContext, DefaultState } from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { getCompletions } from './controllers/chatController'
import { register, login, userInfo, updateUserInfo } from './controllers/userController'
import dotenv from 'dotenv'
import auth from './middleware/auth'
import logger from './middleware/logger'
import prismaErrorHandler from './middleware/prismaErrorHandler'

dotenv.config()
const app = new Koa<DefaultState, DefaultContext>()
const router = new Router()

app.use(bodyParser())
app.use(logger)
app.use(prismaErrorHandler)
app.use(auth)

// 用户注册和登录
router.post('/user/register', register)
router.get('/user/info', userInfo)
router.post('/user/info', updateUserInfo)
router.post('/user/login', login)
router.post('/chat/completions', getCompletions)

app.use(router.routes()).use(router.allowedMethods())

export default app
