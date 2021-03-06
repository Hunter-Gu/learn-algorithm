# 回溯算法

回溯算法思想非常简单，但是应用却非常广泛，比如正则表达式匹配、编译原理中的语法分析等；此外很多经典的数学问题也可以用回溯算法解决，比如数独、八皇后、0-1 背包、图的着色、旅行商问题、全排列等等。

## 是什么

以八皇后问题为例，有一个 8x8 的棋盘，希望往里放 8 个棋子（皇后），每个棋子所在的行、列、对角线都不能有另一个棋子。如图：

- 第一幅图是满足条件的方法
- 第二幅图是不满足条件的方法

![八皇后问题](@imgs/a0e3994319732ca77c81e0f92cc77ff5.jpg)

八皇后问题就是期望找到所有满足这种要求的放棋子方式。

把这个问题划分成 8 个阶段：

- 依次将 8 个棋子放到第一行、第二行、第三行...第八行
- 在放置的过程中，不停地检查当前放法，是否满足要求
  - 如果满足，则跳到下一行继续放置棋子
  - 如果不满足，那就再换一种放法，继续尝试

<!-- TODO  -->

## 应用

### 0-1 背包

这个问题的经典解法是动态规划，回溯算法是一种简单但没有那么高效的解法。

0-1 背包问题有很多变体，这里介绍一种比较基础的。有一个背包，总的承载重量是 Wkg；有 n 个物品，每个物品的重量不等，并且不可分割。

期望选择几件物品，装载到背包中，在不超过背包所能装载重量的前提下，让背包中物品的总重量最大？

0-1 背包问题是指物品是不可分割的，要么装要么不装。对于每个物品来说，都有两种选择，装进背包或者不装进背包。对于 n 个物品来说，总的装法就有 2 ^ n 种，去掉总重量超过 Wkg 的，从剩下的装法中选择总重量最接近 Wkg 的。

通过回溯方法，把物品依次排列，整个问题就分解为了 n 个阶段，每个阶段对应一个物品怎么选择：

- 先对第一个物品进行处理，选择装进去或者不装进去
- 然后再递归地处理剩下的物品
- 当发现已经选择的物品的重量超过 Wkg 之后，就停止继续探测剩下的物品（搜索剪枝）

<!-- TODO -->

### 正则表达式

正则表达式里最重要的一种算法思想就是回溯。

为方便讲解，假设正则表达式中只包含 “\*” 和 “?” 这两种通配符，并且对这两个通配符的语义稍微做些改变：

- \*：表示匹配任意多个（大于等于 0 个）任意字符
- ?： 表示匹配零个或者一个任意字符

- 非通配符时
  - 依次考察正则表达式中的每个字符，直接跟文本的字符进行匹配，如果相同，则继续往下处理
  - 如果不同，则回溯
- 通配符时
  - 有多种处理方式了，也就是所谓的岔路口
  - \* 有多种匹配方案，可以匹配任意个文本串中的字符
  - 先随意的选择一种匹配方案，然后继续考察剩下的字符
  - 如果中途发现无法继续匹配下去了，就回到这个岔路口，重新选择一种匹配方案
  - 再继续匹配剩下的字符

<!-- TODO -->

回溯算法的思想大部分情况下，都是用来解决广义的搜索问题，即从一组可能的解中，选择出一个满足要求的解。

### 剪枝操作

回溯算法非常适合用递归来实现，在实现的过程中，剪枝操作是提高回溯效率的一种技巧。利用剪枝，并不需要穷举搜索所有的情况，从而提高搜索效率。
