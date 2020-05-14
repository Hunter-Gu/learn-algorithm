# 堆

堆：一种特殊的树，满足以下条件：

- 完全二叉树
- 每一个节点的值都必须大于等于（或小于等于）其子树中每个节点的值
  - 大于等于：大顶堆
  - 小于等于：小顶堆

## 如何实现一个堆

要实现一个堆，先要知道：

- 堆支持哪些操作
- 如何存储一个堆

之前讲过，完全二叉树比较适合用数组来存储，那么堆也一样。

:::tip
堆的操作都以大顶堆为例
:::

### 插入

往堆中插入一个元素后，需要让它继续满足堆的两个特性。

堆化（heapify）：如果把新插入的元素放到堆的最后，不符合堆的特性，就需要进行调整，让其重新满足堆的特性。

有两种堆化方式：

- 从下往上
- 从上往下

堆化非常简单，就是顺着节点所在的路径，向上或者向下，对比，然后交换。以从下往上为例：

![从下往上](@imgs/e3744661e038e4ae570316bc862b2c0e.jpg)

<!-- TODO 代码 -->

### 删除

从堆的第二条定义可以发现，堆顶元素存储的是堆中数据的最大值或者最小值。

假设构造的是大顶堆，堆顶元素就是最大的元素。当删除堆顶元素之后，就需要把第二大的元素放到堆顶，而第二大元素肯定会出现在左、右子节点中。然后再迭代地删除第二大节点，以此类推，直到叶子节点被删除。如图：

![删除堆顶元素](@imgs/5916121b08da6fc0636edf1fc24b5a81.jpg)