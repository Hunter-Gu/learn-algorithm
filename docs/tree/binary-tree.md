# 二叉树

二叉树，每个节点**最多**有两个子节点，左子节点和右子节点。

![二叉树](@imgs/09c2972d56eb0cf67e727deda0e9412b.jpg)

- **满二叉树**：除了叶子结点，每个节点都有左、右两个子节点。如图中的 (2)
- **完全二叉树**：叶子节点都在最底下两层，最后一层的叶子节点都靠左排列，并且除了最后一层，其他层的节点个数都要达到最大，这种二叉树叫作完全二叉树，如图中的 (3)。

## 如何表示/存储一棵二叉树

### 基于指针/引用的二叉链式存储法

![链式存储](@imgs/12cd11b2432ed7c4dfc9a2053cb70b8e.jpg)

大部分二叉树都通过链式存储实现，每个节点有三个字段：

- 数据
- 左子节点的指针
- 右子节点的指针

```ts
class Node<T = null> {
  public left: Node<T> | null = null;

  public right: Node<T> | null = null;

  public data: T | null = null

  constructor(data: T | null) {
    this.data = data
  }
}

class BinaryTreeLinkedListImpl<T> {

  root: Node | null = null

  constructor(rootData: T) {
    this.root = new Node(rootData)
  }

  setLeft(node: Node, data: T) {
    node.left = new Node(data)
  }

  setRight(node: Node, data: T) {
    node.right = new Node(data)
  }
}
```

### 基于数组的顺序存储法

![完全二叉树顺序存储](@imgs/14eaa820cb89a17a7303e8847a412330.jpg)

以完全二叉树为例，将根节点存储在数组下标为 1 的位置：

- 左子节点存储在下标 2 * i 的位置
- 右子节点存储在下标 2 * i + 1 的位置
- 而 i / 2 位置存储的就是父节点

通过该方式，知道了根节点的位置，就可以遍历整棵树。

```ts
class BinaryTreeArrayImpl<T> {

  private readonly root = 1

  public arr: (T | null)[]

  constructor(rootData: T, amount: number) {
    this.arr = new Array(amount + this.root).fill(null)
    this.arr[this.root] = rootData
  }

  setLeft(root: number, data: T) {
    if (this.arr[root] === null) {
      console.log(`Can't set child at ${root}, because no parent found!`)
      return
    }

    this.arr[2 * root] = data
  }

  setRight(root: number, data: T) {
    if (this.arr[root] === null) {
      console.log(`Can't set child at ${root}, because no parent found!`)
      return
    }

    this.arr[2 * root + 1] = data
  }
}
```

对于非完全二叉树，会浪费更多一点的存储空间：

![非完全二叉树顺序存储](@imgs/08bd43991561ceeb76679fbb77071223.jpg)

### 总结

**用数组存储一颗完全二叉树，是最节省内存的方式**。对于数组，不需要存储额外的左右子节点的指针。

## 遍历二叉树 - 深度优先（DFS)

- 前序遍历：先打印这个节点，然后再打印它的左子树，最后打印它的右子树
- 中序遍历：先打印它的左子树，然后再打印它本身，最后打印它的右子树
- 后序遍历：先打印它的左子树，然后再打印它的右子树，最后打印这个节点本身

![遍历二叉树](@imgs/ab103822e75b5b15c615b68560cb2416.jpg)

二叉树的前、中、后序遍历就是一个递归的过程，递推公式如下：

```
preOrder(root) = print root + preOrder(root.left) + preOrder(root.right)

inOrder(root) = inOrder(root.left) + print root + inOrder(root.right)

postOrder(root) = postOrder(root.left) + postOrder(root.right) + print root
```

有了递推公式，就能很容易写出代码了，以二叉链式存储法为例：

```ts
interface Node<T> {
  left: Node<T> | null;
  right: Node<T> | null;
  data: T;
}

function preOrder(root: Node) {
  console.log(root.data)
  if (root.left) preOrder(root.left)
  if (root.right) preOrder(root.right)
}

function inOrder(root: Node) {
  if (root.left) inOrder(root.left)
  console.log(root.data)
  if (root.right) inOrder(root.right)
}

function postOrder(root: Node) {
  if (root.left) inOrder(root.left)
  if (root.right) inOrder(root.right)
  console.log(root.data)
}
```

### 时间复杂度

从之前的图中，可以看出来，每个节点最多会被访问两次，所以遍历操作的时间复杂度，跟节点的个数 n 成正比，也就是说二叉树遍历的时间复杂度是 O(n)。

## 思考

### 卡特兰数

给定一组数据，比如 1，3，5，6，9，10。你来算算，可以构建出多少种不同的二叉树？

卡特兰数，是 C(2n, n) / (n + 1) 种形状，C 是组合数，节点的不同又是一个全排列，一共就是 n! * C(2n, n) / (n + 1) 个二叉树。可以通过数学归纳法推导得出。

### 二叉树的层序遍历（BFS）

- 借助队列，根节点先入列，队列不空，取出队头元素
- 如果左子节点存在就入列队，否则什么也不做；右节点同理
- 直到队列为空，表示树层次遍历结束

```ts
interface Node<T> {
  left: Node<T> | null;
  right: Node<T> | null;
  data: T;
}

function levelOrder<T>(root: Node<T>) {
  const queue: Node<T>[] = []
  const res: Node<T>[] = []

  queue.push(root)

  while (queue.length) {
    const max = queue.length
    const level = []
    for (let i = 0; i < max; i++) {
      const node = queue.shift()
      level.push(node.data)
      if (node.left) queue.push(node.left)
      if (node.right) queue.push(node.right)
    }
    res.push(level)
  }
  return res
}
```

## 题目

Leetcode: 102
