import * as process from 'process'

export const env = {
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV || 'staging',
  NEXT_PUBLIC_HOST: process.env.NEXT_PUBLIC_HOST || 'http://localhost:3000',

  API_ENDPOINT: process.env.API_ENDPOINT || 'http://localhost:8000',
  API_TOKEN: process.env.API_TOKEN || '',

  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || '',

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',

  NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_LINK_URL: process.env.NEXT_PUBLIC_STRIPE_PLUS_MONTHLY_LINK_URL || ''
}

export const credits_per_page = [
  {
    page: "10ページ未満",
    pdf: "1クレジット",
    ocr: "2クレジット"
  },
  {
    page: "20ページ未満",
    pdf: "2クレジット",
    ocr: "4クレジット"
  },
  {
    page: "30ページ未満",
    pdf: "3クレジット",
    ocr: "6クレジット"
  },
  {
    page: "50ページ未満",
    pdf: "5クレジット",
    ocr: "10クレジット"
  },
  {
    page: "100ページ未満",
    pdf: "10クレジット",
    ocr: "20クレジット"
  },
  {
    page: "100ページ以上",
    pdf: "20クレジット",
    ocr: "40クレジット"
  },
]