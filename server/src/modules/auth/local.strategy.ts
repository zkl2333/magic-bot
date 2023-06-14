import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException, Dependencies } from '@nestjs/common'
import { AuthService } from './auth.service'

@Injectable()
@Dependencies(AuthService)
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'usernameOrEmail',
      passwordField: 'password'
    })
  }

  async validate(usernameOrEmail, password) {
    const user = await this.authService.validateUser(usernameOrEmail, password)
    return user
  }
}
