import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'xbendan',
  description: 'Just playing around.',
  lastUpdated: true,
  base: '/docs/',
  themeConfig: {
    editLink: {
      pattern: 'https://github.com/AeCode-call/docs/blob/master/docs/:path',
      text: '在 GitHub 上编辑'
    },
    outlineTitle: '目录',
    lastUpdatedText: '更新时间',
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    nav: [
      { text: '首页', link: '/index' },
      { text: '分享', link: '/myspace/' },
    ],
    sidebar: {
      "/myspace/":[
        {
          text: '会议分享',
          collapsible: true,
          items: [
            { text: '构建一个 cli 工具集', link: '/myspace/' },
            { text: '偷懒技巧之批量导出', link: '/myspace/one' },
          ]
        }
      ]
    }
  },
  
})
