# 复杂度分析

用于衡量算法的执行效率（运行速度、占用空间） - 时间、空间复杂度。

## 为什么需要复杂度分析

我们可以先把代码跑一遍，通过统计、监控得到算法的执行时间和内存占用。那么为什么还需要复杂度分析？

这样的方式称为：**事后统计法**，有非常大的局限性。

- 测试结果依赖于环境。不同的硬件会对结果造成很大影响，比如分别用 Intel Core i9 处理器和 Intel Core i3 处理器来运行，i9 处理器要比 i3 处理器执行的速度快很多。
- 测试结果受数据规模影响很大。以排序算法为例，对于小规模的数据排序，插入排序可能反倒会比快速排序要快！

## 时间复杂度

通过时间复杂度衡量算法的执行效率。那么如何在算法运行前粗略的评估算法的执行时间呢？

### 大 O 复杂度表示法

```ts
function cal(num: number) {
  let sum = 0
  for (let i = 1; i < n; i++) {
    sum = sum + i
  }

  return sum
}
```

上面这段代码用于求 1,2,3,...,n 的累加和，现在对该算法的执行时间进行评估（假设每行代码的运行时间都为 unit_time）：

- 第 2 行代码只运行 1 次，需要 1 个 unit_time
- 第 3、4 行代码都会运行 n 次，需要 2n * unit_time

最终这段代码的总执行时间为 (2n + 2) * unit_time，那么我们就得到了：

- **代码执行时间 T(n) 与每行代码执行次数之间的函数关系式 T(n) = (2n + 2) * unit_time**
- 并且**代码的执行时间 T(n) 与每行代码的执行次数 n 是成正比的**

将规律总结为大 O 表示法：

```
T(n) = O(f(n))
```

代入上面的例子中：T(n) = O(2n + 2)，通过大 O 表示法表示**代码执行时间随数据规模增长的变化趋势**，注意它并不表示代码的真正执行时间。

当 n 很大时，可以忽略公式中的系数、常量等不影响增长趋势的部分（一阶函数，斜率恒定），所以上例中：T(n) = O(n)。

### 总结

现在，对上述分析时间复杂度的过程进行总结：

1.  关注**循环执行次数最多**的代码
2.  加法法则：总复杂度等于量级最大的代码段的复杂度
3.  乘法法则：嵌套代码的复杂度是嵌套内外代码复杂度的乘积

```ts
function cal(num: number) {
  let sum1 = 0
  for (let i = 1; i < 1000; i++) {
    sum1 = sum1 + i
  }

  let sum2 = 0
  for (let i = 1; i < n; i++) {
    sum2 = sum2 + i
  }

  return sum1 + sum2
}
```

对于这段代码，一定要注意第一个 for 循环虽然执行了 1000 次，但是这是一个常量执行时间，因为它和 n 的规模无关。再次强调**时间复杂度表示的是算法执行效率与数据规模增长的变化趋势**。

### 常见时间复杂度

#### 多项式量级

- O(1)                      常量阶
- O(logn)                   对数阶
- O(n)                      线性阶
- O(n * logn)               线性对数阶
- O(n^2),O(n^3),...,O(n^k)  平方阶
- O(2^n)                    指数阶
- O(n!)                     阶乘阶

这里需要提一下对数阶时间复杂度，因为它非常常见，同时又非常难分析。举个例子：

```ts
let i = 1

while (i <= n) {
  i = i * 2
}
```

根据之前的分析方法，第 4 行代码时循环执行次数最多的，所以只需要计算这一行的执行次数，就能知道时间复杂度。

分析一下这段代码：

- 变量 i 从 1 开始，每次循环就乘以 2
- 当大于 n 时循环结束

所以假设一共执行 x 次，变量 i 的取值则为 2 ^ x，所以最终得到一个 x 与 n 关系的函数 2 ^ x = n，即 x = logn，所以时间复杂度为 O(logn)。

#### 非多项式量级 - NP 问题

- O(2 ^ n)                        指数阶
- O(n!)                           阶乘阶

把时间复杂度为非多项式量级的算法问题叫做 NP（Non-Deterministic Polynomial，非确定多项式）问题。

当 n 越来越大时，非多项式量级算法的执行时间会急剧增加，求解问题的执行时间会无限增长。所以，非多项式时间复杂度的算法是非常低效的算法。

### O(m + n) & O(m * n)

这是和前面都不一样的时间复杂度，**由两个数据的规模决定算法的复杂度**。

```ts
function cal(m: number, n: number) {
  let sum1 = 0
  for (let i = 1; i < m; i++) {
    sum1 = sum1 + i
  }

  let sum2 = 0
  for (let i = 1; i < n; i++) {
    sum2 = sum2 + i
  }

  return sum1 + sum2
}
```

从代码中可以看出，m 和 n 表示两个数据规模，我们事先无法评估 m 和 n 的量级哪个大，所以在表示复杂度时不能简单的利用[加法法则](#总结)，所以上面的代码的时间复杂度为 O(m + n)，此时的加法规则为： T1(m) + T2(n) = O(f(n) + g(n))。

另外，乘法法则依然有效 T1(m) * T2(n) = O(f(m) * f(n))。

## 空间复杂度

空间复杂度用于表示算法的存储空间与数据规模之间的增长关系。

```ts
function print(n: number) {
  const a = new Array(n)

  for (let i = 0; i < n; i++) {
    a[i] = i * i
  }

  return a
}
```

可以看到：

- 第 2 行代码申请了一个大小为 n 的数组
- 第 4 行代码申请了一个空间存储变量 i，它是常量阶的，和数据规模 n 没有关系，所以可以忽略

所以整段代码的空间复杂度是 O(n)。

## 特殊情况的时间复杂度

在一个无序数组中，查找变量 x 的位置，没找到就返回 -1，代码如下：

```ts
function find(arr: number[], x: number) {
  const n = arr.length
  let pos = -1

  for (let i = 0; i < n; i++) {
    if (arr[i] === x) {
      pos = i
    }
  }

  return pos
}
```

这段代码的复杂度是 O(n)，其中 n 代表数组的长度。

但是我们在数组中查找一个数据时，并不需要每次都把数组遍历一次，因为可能中途找到就可以提前退出循环了，所以代码可以优化：

```ts
function find(arr: number[], x: number) {
  const n = arr.length
  let pos = -1

  for (let i = 0; i < n; i++) {
    if (arr[i] === x) {
      pos = i
      // 新增代码
      break
    }
  }

  return pos
}
```

此时就有新的问题了，优化后代码的时间复杂度还是 O(n) 吗？

**不同的输入情况下，复杂度量级是不同的**。

通过[之前](#总结)的分析方法，解决不了这个问题。

### 最好情况时间复杂度

指在最理想的情况下，执行这段代码的时间复杂度。

如果要查找的变量 x，正好是数组中的第一个元素，那时间复杂度就是 O(1)，这就是最好情况时间复杂度。

### 最坏情况时间复杂度

指在最糟糕的情况下，执行这段代码的时间复杂度。

如果要查找的变量 x，需要把整个数组都遍历一遍才行（如数组中并不存在），那时间复杂度就是 O(n)，这就是最坏情况时间复杂度。

### 平均情况时间复杂度

我们知道，最好情况时间复杂度和最坏情况时间复杂度对应的都是极端情况下的代码复杂度，发生的概率其实并不大。

平均情况时间复杂度则是为了更好地表示平均情况下的复杂度，那么该怎么分析平均情况时间复杂度呢？仍旧使用上面的例子：

要查找的变量 x 在数组中的位置有 n + 1 种情况：在数组的 0～n-1 位置中和不在数组中。

把每种情况下，查找需要遍历的元素个数累加起来，再除以 n + 1，就可以得到需要遍历的元素个数的平均值（遍历总次数/遍历次数），即：

![平均情况时间复杂度](@imgs/d889a358b8eccc5bbb90fc16e327a22f.jpg)

最终使用大 O 表示法表示的平均时间复杂度为 O(n)。

这个计算过程还有一些问题，因为 n + 1 种情况，出现的概率并不一样：

- 要查找的变量 x 要么在数组中，要么就不在（这里需要用到概率论的知识），为了方便理解假设这两种情况的概率都为 1/2
- 另外，要查找的数据出现在 0～n-1 这 n 个位置的概率也是一样的，为 1/n。

所以，根据概率乘法法则，要查找的数据出现在 0～n-1 中任意位置的概率就是 1/(2n)。所以最终的平均情况时间复杂度为：

![平均情况时间复杂度](@imgs/36c0aabdac69032f8a43368f5e90c67f.jpg)

而这个值就是概率论中的加权平均值（也叫期望值）。最终使用大 O 表示法表示的平均时间复杂度为 O(n)。

**只有同一块代码在不同的情况下，时间复杂度有量级的差距，我们才会使用这三种复杂度表示法来区分**。

### 均摊时间复杂度 - 平摊分析

```ts
// 假设 num >= 0
let count = 0

function assignOrSum(num: number) {
  if (n === count) {
    for (let i = 0; i < n; i++) {
      count += i;
    }
  } else {
    count = num;
  }

  return count;
}
```

首先，我们分析一下上述代码的时间复杂度：

- 最好情况：此时 `num !== count`，时间复杂度为 O(1)
- 最坏情况：此时 `num === count`，时间复杂度为 O(n)
- 平均情况：此时一共 n + 1 种情况，并且每种情况的概率都是 1/(n + 1)，所以最终平均时间复杂度为 O(1)：![平均情况时间复杂度](@imgs/6df62366a60336d9de3bc34f488d8bed.jpg)

但是这里的平均情况时间复杂度其实并不需要这么复杂，不需要引入概率论的知识。

和之前的例子对比会发现：

- 当前例子的时间复杂度，大部分情况都是 O(1)，而前一个例子只有在最好情况下才是 O(1)
- 当前例子的 O(1) 时间复杂度和 O(n) 时间复杂度的出现频率是有规律的，一般都是一个 O(n) 时间复杂度后，跟着 n - 1 个 O(1) 操作，循环往复

所以针对这一场景，引入了一种简单的分析方法 - 平摊分析，得到的时间复杂度为均摊时间复杂度。

每一次的 O(n) 操作，都会跟着 n - 1 次 O(1) 操作，所以**把耗时多的操作平摊到接下来的 n - 1 次耗时少的操作上**，这就是平摊分析的思路。

对上述内容进行总结后得：

- 大部分情况下的时间复杂度都很低，个别情况下时间复杂度比较高
- 操作之间存在前后连贯的时序关系
- 一般来说，均摊时间复杂度等于最好情况时间复杂度

此时就可以将这一组操作放在一起，看看是否可以将耗时的操作，平摊到耗时少的操作上。

## 思考

分析一下下面这个 add() 函数的时间复杂度：

```ts
// 全局变量，大小为10的数组array，长度len，下标i。
let array = [];
array.length = 10;
let len = array.length;
let i = 0;

// 往数组中添加一个元素
function add(element: number) {
  // 数组空间不够了
  if (i >= len) {
    // 重新申请一个 2 倍大小的数组空间
     let newArray[] = [];
     newArray.length = len * 2;
     // 把原来 array 数组中的数据依次 copy 到newArray
     for (let j = 0; j < len; ++j) {
       newArray[j] = array[j];
     }
     // newArray 赋值给 array，array 现在大小就是2倍len了
     array = newArray;
     len = 2 * len;
   }
   // 将 element 放到下标为i的位置，下标 i 加一
   array[i] = element;
   ++i;
}
```
