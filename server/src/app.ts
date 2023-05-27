import Koa, { DefaultContext, DefaultState } from 'koa'
import bodyParser from 'koa-bodyparser'
import auth from './middleware/auth'
import logger from './middleware/logger'
import prismaErrorHandler from './middleware/prismaErrorHandler'
import router from './routes'
import assistantRouter from './controllers/assistantController'

const app = new Koa<DefaultState, DefaultContext>()

app.use(bodyParser())
app.use(logger)
app.use(prismaErrorHandler)
app.use(auth)

app.use(assistantRouter.routes()).use(assistantRouter.allowedMethods())
app.use(router.routes()).use(router.allowedMethods())

export default app
