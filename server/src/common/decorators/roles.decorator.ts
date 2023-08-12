import { SetMetadata } from '@nestjs/common'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: string[]) => {
  console.log('Roles', ROLES_KEY, roles)
  return SetMetadata(ROLES_KEY, roles)
}
