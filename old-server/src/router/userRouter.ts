import Router from 'koa-router'
import {
  userInfo,
  updateUserInfo,
  getBalance,
  changePassword,
  transaction
} from '../controllers/userController'
import login from '../controllers/userController/login'
import register from '../controllers/userController/register'

const userRouter = new Router()

// 用户注册和登录
userRouter.post('/register', register)
userRouter.get('/info', userInfo)
userRouter.post('/info', updateUserInfo)
userRouter.post('/login', login)
userRouter.get('/balance', getBalance)
userRouter.post('/password', changePassword)
userRouter.get('/transaction', transaction)

export default userRouter
