const baseURL = process.env.NODE_ENV === 'production' ? '/policy-reporter/' : ''

export default defineNuxtConfig({
  extends: '@nuxt-themes/docus',
  app: {
    baseURL,
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: `${baseURL || '/'}favicon.ico` }
      ]
    }
  },
  css: [
    'assets/css/custom.css'
  ],
  runtimeConfig: {}
})
