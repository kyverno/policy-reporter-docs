const baseURL = process.env.NODE_ENV === 'production' ? '/policy-reporter/' : ''

export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  app: {
    baseURL
  },
  css: [
    'assets/css/custom.css'
  ],
  runtimeConfig: {}
})
