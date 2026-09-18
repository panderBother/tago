import type { components } from './types/generated'
import { request } from './client'

export type PublicIdentityDto = components['schemas']['PublicIdentityView']
export type AvatarDto = components['schemas']['Avatar']

export function getProfile() {
  return request<PublicIdentityDto>({ path: '/v1/account/profile' })
}

export function updateProfile(body: components['schemas']['PublicIdentityUpdate']) {
  return request<PublicIdentityDto, components['schemas']['PublicIdentityUpdate']>({
    path: '/v1/account/profile', method: 'PUT', body,
  })
}

export function listAvatars() {
  return request<AvatarDto[]>({ path: '/v1/avatars' })
}

export function changePassword(body: components['schemas']['ChangePasswordInput']) {
  return request<components['schemas']['PasswordChangeView'], components['schemas']['ChangePasswordInput']>({
    path: '/v1/account/password', method: 'PUT', body,
  })
}
