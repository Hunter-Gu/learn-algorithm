# 递归

递归是一种应用非常广泛的算法（或者编程技巧），去的过程叫“递”，回来的过程叫“归”。基本上，所有的递归问题都可以用递推公式来表示。比如：

```
f(n) = f(n-1) + 1 其中，f(1)=1
```

## 如何编写递归代码？

写递归代码最关键的是写出递推公式，找到终止条件。

## 递归的问题

### 堆栈溢出

编写递归代码时，很可能会遇到堆栈溢出，造成系统性崩溃。

为什么递归代码容易造成堆栈溢出呢？

函数调用会使用栈来保存临时变量。每调用一个函数，都会将临时变量封装为栈帧压入内存栈，等函数执行完成返回时，才出栈。系统栈或者虚拟机栈空间一般都不大。如果递归求解的数据规模很大，调用层次很深，一直压入栈，就会有堆栈溢出的风险。

那么，如何避免出现堆栈溢出呢？

我们可以通过在代码中限制递归调用的最大深度的方式来解决这个问题。

### 警惕重复计算

使用递归时还会出现重复计算的问题。把例子中的整个递归过程分解一下：

![重复计算](@imgs/e7e778994e90265344f6ac9da39e01bf.jpg)

从图中，我们可以直观地看到：

- 想要计算 f(5)，需要先计算 f(4) 和 f(3)
- 而计算 f(4) 还需要计算 f(3)

因此，f(3) 就被计算了很多次，这就是重复计算问题。

为了避免重复计算，我们可以通过一个数据结构（比如散列表）来保存已经求解过的 f(k)。当递归调用到 f(k) 时，先看下是否已经求解过了。如果是，则直接从散列表中取值返回，不需要重复计算，这样就能避免刚讲的问题了。

### 其他问题

递归代码还有很多别的问题：

- 在时间效率上，递归代码里多了很多函数调用，当这些函数调用的数量较大时，就会积聚成一个可观的时间成本
- 在空间复杂度上，因为递归调用一次就会在内存栈中保存一次现场数据，所以在分析递归代码空间复杂度时，需要额外考虑这部分的开销

递归有利有弊：

- 利是递归代码的表达力很强，写起来非常简洁
- 弊是空间复杂度高、有堆栈溢出的风险、存在重复计算、过多的函数调用会耗时较多等问题

所以，在开发过程中，我们要根据实际情况来选择是否需要用递归的方式来实现。