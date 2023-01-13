import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'xbendan',
  description: 'Just playing around.',
  themeConfig: {
    editLink: {
      pattern: 'https://github.com/AeCode-call/docs/blob/master/docs/:path',
      text: 'Edit this page on GitHub'
    },
    nav: [
      { text: 'home', link: '/index' },
      { text: 'myspace', link: '/myspace/index' },
    ],
    sidebar: {
      "/myspace/":[
        {
          text: '会议分享',
          items: [
            { text: '构建一个 cli 工具集', link: '/myspace/' },
            { text: '偷懒技巧之批量导出', link: '/myspace/one' },
          ]
        }
      ]
    }
  },
  
})
