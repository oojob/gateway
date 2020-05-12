import profileClient from 'client/profile'
import { promisify } from 'util'

export const createProfile = promisify(profileClient.createProfile).bind(profileClient)
export const confirmProfile = promisify(profileClient.confirmProfile).bind(profileClient)
export const readProfile = promisify(profileClient.readProfile).bind(profileClient)
export const updateProfile = promisify(profileClient.updateProfile).bind(profileClient)
export const validateUsername = promisify(profileClient.validateUsername).bind(profileClient)
export const validateEmail = promisify(profileClient.validateEmail).bind(profileClient)
// export const check = promisify(profileClient.check).bind(profileClient)
// export const watch = promisify(profileClient.watch).bind(profileClient)
