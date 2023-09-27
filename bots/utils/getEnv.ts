import * as dotenv from 'dotenv'

dotenv.config()

const getEnv = <T>(variable: string, def: T) => {
  const value = process.env[variable]
  if (!value) return def
  if (typeof def === "number") return parseInt(value) as T
  else return value as T
}

export default getEnv
