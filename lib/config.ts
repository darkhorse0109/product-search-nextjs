import * as process from 'process'

export const env = {
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'staging',
  NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000',
  API_ENDPOINT: process.env.API_ENDPOINT || 'http://localhost:8000',
  API_TOKEN: process.env.API_TOKEN || '',
}
