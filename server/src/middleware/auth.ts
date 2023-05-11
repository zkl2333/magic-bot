import koaJwt from 'koa-jwt'
import { jwtSecret } from '../constence'

const auth = koaJwt({ secret: jwtSecret }).unless({ path: [/^\/user\/register/, /^\/user\/login/] })

export default auth
