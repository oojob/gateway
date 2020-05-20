import profileClient from 'client/profile'
import { promisify } from 'util'

export const createProfile = promisify(profileClient.createProfile).bind(profileClient)
export const confirmProfile = promisify(profileClient.confirmProfile).bind(profileClient)
export const readProfile = promisify(profileClient.readProfile).bind(profileClient)
export const updateProfile = promisify(profileClient.updateProfile).bind(profileClient)
export const validateUsername = promisify(profileClient.validateUsername).bind(profileClient)
export const validateEmail = promisify(profileClient.validateEmail).bind(profileClient)
export const auth = promisify(profileClient.auth).bind(profileClient)
export const verifyToken = promisify(profileClient.verifyToken).bind(profileClient)
export const logout = promisify(profileClient.logout).bind(profileClient)
export const refreshToken = promisify(profileClient.refreshToken).bind(profileClient)
