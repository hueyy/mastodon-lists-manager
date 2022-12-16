export const isValidString = (input: string) => typeof input === `string` && input.length > 0
export const makeAPIURL = (host: string) => `https://${host}`