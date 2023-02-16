import Logo from "./components/Logo.vue"

export default defineAppConfig({
  docus: {
    title: 'Policy Reporter',
    image: 'https://kyverno.github.io/policy-reporter/images/logo-dark.png',
    description: 'The best place to start your documentation.',
    socials: {
      twitter: 'FrankJogeleit',
      github: 'kyverno/policy-reporter-docs',
    },
    github: {
      repo: 'https://github.com/kyverno/policy-reporter-docs'
    },
    aside: {
      level: 0,
      exclude: []
    },
    header: {
      logo: Logo,
      showLinkIcon: false,
      exclude: []
    },
    footer: {
      iconLinks: []
    }
  },
})
