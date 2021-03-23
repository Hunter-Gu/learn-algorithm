# 二叉查找树（BST)

二叉查找树最大的特点是：**支持动态数据集合的快速插入、删除、查找操作**。

## 是什么

二叉查找树为**实现快速查找**而生，并且还支持快速插入、删除一个数据。

对于树中的任意一个节点，二叉查找树要求：

- 左子树中的每个节点的值，都小于这个节点的值
- 右子树中的每个节点的值，都大于这个节点的值

![二叉查找树](@imgs/f3bb11b6d4a18f95aa19e11f22b99bae.jpg)

## 操作

### 查找

- 先取根节点，如果等于要查找的数据则直接返回
- 要查找的数据小于根节点，在左子树中递归查找
- 要查找的数据大于根节点，在右子树中递归查找

```ts
interface Node<T> {
  left: Node<T> | null;
  right: Node<T> | null;
  data: T;
}

function find<T>(node: Node<T>, data: T) {
  let root = node

  while(root !== null) {
    if (data < root.data) root = root.left
    else if (data > root.data) root = root.right
    else return root
  }

  return null
}
```

### 插入

- 如果要插入的数据比节点的数据大，则处理右子树
  - 右子树为空：将新数据直接插到右子节点的位置
  - 右子树不为空：递归遍历右子树，查找插入位置
- 如果要插入的数据比节点数值小，则处理左子树
  - 左子树为空：将新数据插入到左子节点的位置
  - 左子树不为空：递归遍历左子树，查找插入位置

```ts
class Node<T = null> {
  public left: Node<T> | null = null;

  public right: Node<T> | null = null;

  public data: T | null = null

  constructor(data: T | null) {
    this.data = data
  }
}

function insert<T>(node: Node<T>, data: T) {
  while (node !== null) {
    if (data > node.data) {
      // 处理右子树
      if (node.right === null) {
        node.right = new Node(data)
      } else {
        node = node.right
      }
    } else if (data < node.data) {
      // 处理左子树
      if (node.left === null) {
        node.left = new Node(data)
      } else {
        node = node.left
      }
    }
  }
}
```

### 删除

删除操作比较复杂，针对要删除节点的子节点数量，要分三种情况处理：

- 没有子节点：从父节点中删除即可
- 有一个子节点：更新父节点的指针，指向被删节点的子节点
- 有两个子节点：
  - 找到被删节点的右子树中的最小节点，替换到被删节点上

```ts
interface Node<T> {
  left: Node<T> | null;
  right: Node<T> | null;
  data: T;
}

function delete<T>(node: Node<T>, data: T) {
  let root = node
  let parent = null

  // 查找并设置父节点
  while (root && root.data !== data) {
    parent = root
    if (data > root.data) root = root.right
    else if (data < root.data) root = root.left
  }

  // 没有找到
  if (!root) return

  // 有两个子节点
  if (root.left !== null && root.right !== null) {
    let minRoot: Node = root.right
    let minRootParent: Node | null = null
    // 最小值一定在左子树的叶节点
    while (minRoot.left !== null) {
      minRootParent = minRoot
      minRoot = minRoot.left
    }
    // 交换
    root.data = minRoot.data
    // 方便之后统一操作
    root = minRoot
    parent = minParent
  }

  // 小于等于一个子节点
  let child: Node | null = null
  if (root.left !== null) {
    child = root.left
  } else if (root.right !== null) {
    child = root.right
  }

  if (parent === null) node = child // 删除的是根节点
  else if (parent.left === root) parent.left = child
  else if (parent.right === root) parent.right = child
}
```

实际上，二叉查找树的删除操作，有个非常简单、取巧的方法 -- 将要删除的节点标记为“已删除”，但是并不真正从树中将这个节点去掉。这样比较浪费内存空间，但是删除操作就变得简单了很多。而且，这种处理方法也并没有增加插入、查找操作代码实现的难度。

### 其他操作

二叉查找树支持**快速地查找最大节点和最小节点、前驱节点和后继节点**。

```ts
interface Node<T> {
  left: Node<T> | null;
  right: Node<T> | null;
  data: T;
}

function findMin<T>(node: Node<T>) {
  if (node === null) return null

  let root = node
  while (root.left !== null) {
    root = root.left
  }

  return root
}

function findMax<T>(node: Node<T>) {
  if (node === null) return null

  let root = node
  while (root.right !== null) {
    root = root.right
  }

  return root
}
```

- 前驱节点：小于该节点值中值最大的节点
  - 有左子树：左子树的右子树叶节点（right most）
  - 没有左子树：判断该节点与父节点的关系
    - 是父节点的右子节点：前驱节点是父节点
    - 是父节点的左子节点：向上寻找，找到节点 P，P 是其父节点 Q 的右子节点
- 后继节点：大于该节点值中值最小的节点
  - 有右子树：右子树的左子树叶节点（left most）
  - 没有右子树：判断该节点与父节点的关系
    - 是父节点的左子节点：后继节点是父节点
    - 是父节点的右子节点：向上寻找，找到节点 P，P 是其父节点 Q 的左子节点

```ts
interface Node<T> {
  left: Node<T> | null;
  right: Node<T> | null;
  data: T;
}

function findPredecessor<T>(root: Node<T>, data: T) {
  let predecessor = null
  let parent: Node<T> | null = null
  // 右节点的父节点
  let parentRight: Node<T> | null = null

  while (root && root.data === data) {
    parent = root
    if (data > root.data) {
      root = root.right
      parentRight = parent
    } else if (data < root.data) {
      root = root.left
    }
  }

  if (root === null) return

  if (root.left !== null) {
    // 存在左子树
    root = root.left
    while (root.right !== null) {
      root = root.right
    }
    predecessor = root
  } else if (root === parent.right) {
    // 不存在左子树，且是父节点的右子节点
    predecessor = parent
  } else if (root === parent.left) {
    predecessor = parentRight
  }
}

function findSuccessor<T>(node: Node<T>) {
  let sucessor = null
  let parent: Node<T> | null = null
  // 左节点的父节点
  let parentRight: Node<T> | null = null

  while (root && root.data === data) {
    parent = root
    if (data > root.data) {
      root = root.right
    } else if (data < root.data) {
      root = root.left
      parentRight = parent
    }
  }

  if (root === null) return

  if (root.right !== null) {
    // 存在右子树
    root = root.right
    while (root.left !== null) {
      root = root.left
    }
    sucessor = root
  } else if (root === parent.left) {
    // 不存在左子树，且是父节点的左子节点
    sucessor = parent
  } else if (root === parent.right) {
    sucessor = parentRight
  }
}
```

另外，二叉查找树还有一个重要的特性：通过[中序遍历](/tree/binary-tree.html#遍历二叉树-深度优先)二叉查找树，可以输出有序的数据序列，时间复杂度是 O(n)。

## 重复数据

实际开发时，二叉查找树中存储的一般都是对象，以对象的某个字段作为键（key）来构建二叉查找树，而对象中的其他字段叫作卫星数据。

那么如果两个对象的键（key）相同，该如何处理？

### 同一个节点存储多个数据

方法一，二叉查找树中每一个节点可以存储多个数据，所以可以通过链表和支持动态扩容的数组等数据结构，把键（key）相同的数据存储在同一个节点上。

### 插入右子树

方法二，把这个新插入的数据当作大于这个节点的值来处理（将这个要插入的数据放到这个节点的右子树）。

![插入到右子树](@imgs/3f59a40e3d927f567022918d89590a5f.jpg)

#### 查找

这种方法在查找数据时，为了把键值相等的所有节点都找出来，遇到键值相同的节点，并不停止查找操作，而是继续在**右子树**中查找，直到遇到叶子节点，才停止。

![查找](@imgs/fb7b320efd59a05469d6d6fcf0c98eff.jpg)

#### 删除

这种方法在删除数据时，需要先查找到所有要删除的节点，然后再按照[之前的删除方法](/tree/binary-search-tree.html#删除)依次删除。

![删除](@imgs/254a4800703d31612c0af63870260517.jpg)

## 时间复杂度 - 求二叉树层数

二叉查找树的形态多种多样，如图，同一组数据就可以构造出三种二叉查找树，并且它们的查找、插入、删除操作的时间复杂度都不同。

![同一组数据的多种二叉查找树](@imgs/e3d9b2977d350526d2156f01960383d9.jpg)

最糟糕的情况就如图 (1) 所示，根节点的左右子树极度不平衡，已经退化为链表了，所以查找操作的时间复杂度也就变为了 O(n)。

### 完全二叉树时间复杂度

最理想情况下，二叉查找树是一棵完全二叉树（或满二叉树）。

不管是插入、删除还是查找，**时间复杂度和树的高度成正比**，即 O(height)。而树的高度等于最大层数减 1，那么问题就变成了如何求完全二叉树的层数？

对于包含 n 个节点的完全二叉树来说，下一层节点的个数是上一层的 2 倍，那么第 k 层的节点个数就是 2 ^ (k - 1)，所以最后一层的节点数量的范围就是 1 ~ 2 ^ (L - 1)，L 为最大层数。得到 n 和 L 的关系式：

```
n >= 1 + 2 + 4 + 8 + ... + 2 ^ (L - 2) + 1
n <= 1 + 2 + 4 + 8 + ... + 2 ^ (L - 2) + 2 ^ (L - 1)
```

得到 L 的范围是 [log(n + 1), logn + 1]，即完全二叉树的高度小于等于 logn，时间复杂度是 O(logn)。

显然，极度不平衡的二叉查找树的查找性能是比较差的。我们需要一种在任何时候，都能保持任意节点左、右子树都比较平衡的二叉查找树。

## 思考

### 二叉树 vs. 散列表

散列表也是支持动态数据集合的快速插入、删除、查找操作的，并且散列表的这些操作比二叉查找树更高效，时间复杂度是 O(1)。既然有了这么高效的散列表，使用二叉树的地方是不是都可以替换成散列表呢？有没有哪些地方是散列表做不了，必须要用二叉树来做的呢？

- 散列表的插入、删除、查找操作的时间复杂度可以做到常量级的 O(1)，非常高效
- 二叉查找树在比较平衡的情况下，插入、删除、查找操作时间复杂度才是 O(logn)

相对散列表，二叉查找树好像并没有什么优势，那为什么还要用二叉查找树呢？

- **数据有序**
  - 散列表中的数据是无序存储的，如果要输出有序的数据，需要先进行排序
  - 二叉查找树只需要中序遍历，就可以在 O(n) 的时间复杂度内，输出有序的数据序列
- 扩容
  - 散列表扩容耗时很多，而且当遇到散列冲突时，性能不稳定
  - **平衡的二叉查找树的性能非常稳定，时间复杂度稳定在 O(logn)**
- 散列冲突。散列表会有哈希冲突的情况，所以尽管散列表的查找等操作的时间复杂度是常量级的，但这个常量不一定比 logn 小，所以实际的查找速度可能不一定比 O(logn) 快。再加上 Hash 函数也需要耗时，也不一定就比平衡二叉查找树的效率高
- 数据结构的复杂度
  - 散列表的构造比二叉查找树要复杂，需要考虑的东西很多。比如散列函数的设计、冲突解决办法、扩容、缩容等
  - 平衡二叉查找树只需要考虑平衡性这一个问题，而且这个问题的解决方案比较成熟、固定
- 装载因子。为了避免过多的散列冲突，散列表装载因子不能太大，特别是基于开放寻址法解决冲突的散列表，不然会浪费一定的存储空间

综上，**二叉查找树在某些方面还是优于散列表的**，这两者的存在并不冲突。实际的开发过程中，需要结合具体的需求来选择使用哪一个。

### 求二叉树的高度

如何求出一棵给定二叉树的确切高度？

两种思路：

- 深度优先

```ts
interface Node<T> {
  left: Node<T> | null;
  right: Node<T> | null;
  data: T;
}

function getHeight<T>(root: Node<T>) {
  if (root === null) return 0

  const leftHeight = getHeight(root.left)
  const rightHeight = getHeight(root.right)

  return leftHeight > rightHeight ? leftHeight + 1 : rightHeight + 1
}
```

- 广度优先

```ts
function getHeight<T>(root: Node<T>) {
  const queue = []
  queue.push(root)

  let height = 1
  let cnt = 1

  while(queue.length > 0) {
    const node = queue.pop()

    cnt--

    if (node.left) queue.push(node.left)
    if (node.right) queue.push(node.right)

    // 表示一层遍历结束，开始下一层
    if (cnt === 0) {
      cnt = queue.length
      height += 1
    }
  }

  return height
}
```
