const { resolve } = require('path')

module.exports = {
  base: '/learn-algorithm/',
  title: '数据结构与算法',
  themeConfig: {
    activeHeaderLinks: true,
    sidebarDepth: 2,
    sidebar: [{
      title: '基础',   // 必要的
      path: '/basic/',      // 可选的, 应该是一个绝对路径
      collapsable: false, // 可选的, 默认值是 true,
      sidebarDepth: 2,    // 可选的, 默认值是 1
      children: [
        // ['/basic/README', '前言'],
        ['/basic/analysis-of-algorithm', '复杂度分析']
      ]
    }],
    repo: 'Hunter-Gu/learn-algorithm',
    docsDir: 'docs',
    // editLinks: true,
  },
  plugins: [
    'vuepress-plugin-mermaidjs'
  ],
  configureWebpack: {
    resolve: {
      alias: {
        '@imgs': resolve(__dirname, './imgs')
      }
    }
  }
}
