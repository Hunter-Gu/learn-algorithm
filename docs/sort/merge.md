# 归并排序

归并排序和快速排序都用到了分治思想，非常巧妙。我们可以借鉴这个思想，来解决非排序的问题，比如：如何在 O(n) 的时间复杂度内查找一个无序数组中的第 K 大元素？ 这就要用到我们今天要讲的内容。

## 归并排序的原理


归并排序的核心思想是**分治**，以对一个数组排序为例：

- 先把数组从中间分成前后两部分
- 对前后两部分分别排序
- 再将排好序的两部分合并在一起

![归并排序](@imgs/db7f892d3355ef74da9cd64aa926dc2b.jpg)

分治思想，是将一个大问题分解成小的子问题来解决。小的子问题解决了，大问题也就解决了。

通过递归实现分治思想很容易，以归并算法为例，其递推公式为：

```
递推公式：
merge_sort(start, end) = merge(merge_sort(start, middle), merge_sort(middle + 1, end))

终止条件：
start === end 不用再继续分解
```

有了递推公式，转化成代码就简单多了。

```ts
function mergeSort(arr: number[]) {
     const mergeOperator = (arr, start, middle, end) => {
          const tmp = new Array(end + 1 - start)

          let i = start, // 记录 start -> middle
              j = middle + 1, // 记录 middle + 1 -> end
              k = 0 // 记录 tmp 数组下标
          while (i <= middle && j <= end) {
               if (arr[i] < arr[j]) {
                    tmp[k] = arr[i]
                    i += 1
               } else {
                    tmp[k] = arr[j]
                    j += 1
               }
               k += 1
          }

          // 处理剩余项
          let restStart = i, restEnd = middle
          if (j <= end) {
               restStart = j
               restEnd = end
          }

          while (restStart <= restEnd) {
               tmp[k] = arr[restStart]
               restStart += 1
               k += 1
          }

          // 将临时数组 tmp 中的数据放回 arr，实现原地排序
          for (let l = start; l < end + 1; l++) {
               arr[l] = tmp[l - start]
          }
     }
     const mergeSortInternal = (arr, start, end) => {
          if (start === end) return
          const middle = Math.floor((end - start) / 2 + start)

           mergeSortInternal(arr, start, middle)
           mergeSortInternal(arr, middle + 1, end)
           mergeOperator(arr, start, middle, end)
     }

     mergeSortInternal(arr, 0, arr.length - 1)
     return arr
}
```

可以看到合并操作时，需要对剩余项进行特殊处理。可以通过哨兵优化：

::: tip
想一下为什么会需要对剩余项进行特殊处理？
造成这个的根本原因，是因为剩余项中的最小值，比另一个数组中的最大值还要大，所以可以在两个数组中都添加一个最大值。
:::

```ts
const mergeOperator = (arr, start, middle, end) => {
     const left = new Array(middle - start + 2)
     const right = new Array(end - (middle + 1) + 2)

     // 复制值并添加哨兵（最大值）
     for (let i = start; i < middle + 1; i++) {
          left[i - start] = arr[i]
     }
     left[left.length - 1] = Infinity

     for (let j = middle + 1; j < end + 1; j++) {
          right[j - middle - 1] = arr[j]
     }
     right[right.length - 1] = Infinity

     let i = 0, j = 0, k = start
     while (k < end + 1) {
          if (left[i] < right[j]) {
               arr[k] = left[i]
               i += 1
               k += 1
          } else {
               arr[k] = right[j]
               j += 1
               k += 1
          }
     }
}
```

## 性能分析

### 稳定性

归并排序是一个稳定的排序算法。

### 时间复杂度

归并排序涉及递归，时间复杂度的分析稍微有点复杂。我们正好借此机会来学习一下，如何分析递归代码的时间复杂度。

在递归那一节我们讲过，递归的适用场景是，一个问题 a 可以分解为多个子问题 b、c，那求解问题 a 就可以分解为求解问题 b、c。问题 b、c 解决之后，我们再把 b、c 的结果合并成 a 的结果。

如果我们定义求解问题 a 的时间是 T(a)，求解问题 b、c 的时间分别是 T(b) 和 T( c)，那我们就可以得到这样的递推关系式：

```
T(a) = T(b) + T(c) + K
```

其中 K 等于将两个子问题 b、c 的结果合并成问题 a 的结果所消耗的时间。

从刚刚的分析，我们可以得到一个重要的结论：不仅递归求解的问题可以写成递推公式，递归代码的时间复杂度也可以写成递推公式。

套用这个公式，我们来分析一下归并排序的时间复杂度。

假设对 n 个元素进行归并排序需要的时间是 T(n)，那分解成两个子数组排序的时间都是 T(n/2)。我们知道，merge() 函数合并两个有序子数组的时间复杂度是 O(n)。所以，套用前面的公式，归并排序的时间复杂度的计算公式就是：

```
T(1) = C；   n = 1 时，只需要常量级的执行时间，所以表示为 C。
T(n) = 2 * T(n/2) + n； n > 1
```

通过这个公式，如何来求解 T(n) 呢？还不够直观？那我们再进一步分解一下计算过程。

```
T(n) = 2 * T(n/2) + n
     = 2 * (2 * T(n/4) + n/2) + n = 4 * T(n/4) + 2 * n
     = 4 * (2 * T(n/8) + n/4) + 2 * n = 8 * T(n/8) + 3 * n
     = 8 * (2 * T(n/16) + n/8) + 3 * n = 16 * T(n/16) + 4 * n
     ......
     = 2 ^ k * T( n/2 ^ k) + k * n
     ......
```

接下来，我们需要求解 k 和 n 的关系，因为 T(1) = C，所以当 T(1) = T( n/2 ^ k)时，即 n/2 ^ k = 1 可以求得 k = log2(n)，代入公式得 T(n)=Cn + n * log2(n)，所以归并排序的时间复杂度是 O(nlogn)。

我们可以看出，归并排序的执行效率与要排序的原始数组的有序程度无关，所以其时间复杂度是非常稳定的，不管是最好情况、最坏情况，还是平均情况，时间复杂度都是 O(nlogn)。

### 原地排序 - 空间复杂度

归并排序不是原地排序算法，这导致了归并排序并没有像快排那样，应用广泛。

因为归并排序的合并函数，在合并时需要借助额外的存储空间。

那么归并排序的空间复杂度到底是多少呢？该如何分析呢？

递归代码的空间复杂度并不能像时间复杂度那样累加。虽然每次合并操作都需要申请额外的内存空间，但在合并完成之后，临时开辟的内存空间就被释放掉了。在任意时刻，CPU 只会有一个函数在执行，也就只会有一个临时的内存空间在使用。临时内存空间最大也不会超过 n 个数据的大小，所以空间复杂度是 O(n)。
