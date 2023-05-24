import Koa, { DefaultContext, DefaultState } from 'koa'
import bodyParser from 'koa-bodyparser'
import auth from './middleware/auth'
import logger from './middleware/logger'
import prismaErrorHandler from './middleware/prismaErrorHandler'
import router from './routes'

const app = new Koa<DefaultState, DefaultContext>()

app.use(bodyParser())
app.use(logger)
app.use(prismaErrorHandler)
app.use(auth)

app.use(router.routes()).use(router.allowedMethods())

export default app
