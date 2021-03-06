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
        ['/basic/analysis-of-algorithm', '复杂度分析'],
        ['/basic/list', '线性表 & 非线性表'],
        ['/basic/array', '数组'],

        ['/basic/linked-list', '链表'],
        ['/basic/linked-list/singly-linked-list.md', '单链表'],
        ['/basic/linked-list/circular-linked-list.md', '循环链表'],
        ['/basic/linked-list/doubly-linked-list.md', '双向链表'],
        ['/basic/linked-list/questions.md', '链表常见问题'],

        ['/basic/stack', '栈'],
        ['/basic/queue', '队列'],
        ['/basic/recursion', '递归'],
      ]
    }, {
      title: '排序',
      path: '/sort/',
      collapsable: false,
      sidebarDepth: 2,
      children: [
        ['/sort/bubble', '冒泡排序'],
        ['/sort/insertion', '插入排序'],
        ['/sort/shell', '希尔排序'],
        ['/sort/selection', '选择排序'],
        ['/sort/merge', '归并排序'],
        ['/sort/quick', '快速排序'],
        ['/sort/bucket', '桶排序 & 计数排序'],
        ['/sort/radix', '基数排序'],
        ['/sort/optimize', '优化排序算法'],
      ]
    }, {
      title: '查找',
      path: '/search/',
      collapsable: false,
      sidebarDepth: 2,
      children: [
        ['/search/binary', '二分查找'],
        ['/search/skip-list', '跳表'],
        ['/search/hash-table', '散列表'],
        ['/search/design-hash-table', '设计散列表'],
        ['/search/hash-table-and-linked-list', '散列表和链表组合'],
        ['/search/hash', 'Hash 算法'],
      ]
    }, {
      title: '树',
      path: '/tree/',
      collapsable: false,
      sidebarDepth: 2,
      children: [
        ['/tree/binary-tree', '二叉树'],
        ['/tree/binary-search-tree', '二叉查找树'],
        ['/tree/red-black-tree', '红黑树'],
        ['/tree/recursion-tree', '递归树'],
        ['/tree/heap', '堆'],
      ]
    }, {
      title: '图',
      path: '/graph/',
      collapsable: false,
      sidebarDepth: 2,
      children: [
        ['/graph/dfs-and-bfs', '深度优先与广度优先'],
      ]
    }, {
      title: '字符串匹配',
      path: '/string-search/',
      collapsable: false,
      sidebarDepth: 2,
      children: [
        ['/string-search/string-search', 'BF & RK & BM & KMP'],
        ['/string-search/trie', 'trie 树'],
        ['/string-search/ac-automation', 'AC 自动机'],
      ]
    }, {
      title: '算法思想',
      path: '/thought/',
      collapsable: false,
      sidebarDepth: 2,
      children: [
        ['/thought/greedy', '贪心算法'],
        ['/thought/divide-and-conquer', '分治思想'],
        ['/thought/back-tracking', '回溯算法'],
        ['/thought/dynamic-programming', '动态规划'],
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
