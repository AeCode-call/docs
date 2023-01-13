import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'xbendan',
  description: 'Just playing around.',
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/index' },
      { text: 'Configs', link: '/index' },
    ]
  },
  sidebar: [
    {
      text: 'index',
      items: [
        { text: 'index', link: '/index' },
      ]
    }
  ]
})
