# 树

树，一种非线性结构。回忆一下什么是[线性结构](/basic/list.html#线性表)，最多只有前后两个方向。

![树](@imgs/b7043bf29a253bb36221eaec62b2e129.jpg)

## 基础

### 节点

先学习一些关于节点的概念。

如图，树上的每个元素叫作节点，用来连接相邻节点之间的关系（父子关系）。

![节点](@imgs/220043e683ea33b9912425ef759556ae.jpg)

- 根节点：没有父节点的节点，即 E
- 父节点：A 是 B 的父节点
- 兄弟节点：属于同一个父节点，如 B、C、D
- 叶节点：没有子节点，如 G、H、I、J、K、L

### 高度 & 深度 & 层数

![高度 & 深度 & 层数](@imgs/50f89510ad1f7570791dd12f4e9adeb4.jpg)

- 高度：从下往上度量，如楼的高度
  - 节点的高度：节点到叶子结点的最长路径（边数）
  - 树的高度：根节点的高度
- 深度：从上往下度量，如水的深度
  - 节点的深度：根节点到这个节点，所经历的边的个数
- 层数：与深度的计算类似，从 1 开始计
  - 节点的层数：深度 + 1

## 分类

- [二叉树](./binary-tree.md)
- [二叉查找树](./binary-search-tree.md)
- [红黑树](./red-black-tree.md)
- [递归树](./recursion-tree.md)
- [堆](./heap.md)
