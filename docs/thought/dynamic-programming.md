# 动态规划

**动态规划适合用来求解最优问题**。它可以非常显著地降低时间复杂度，提高代码的执行效率。

## 0-1 背包问题

对于一组不同重量、不可分割的物品，需要选择一些装入背包，在满足背包最大重量限制的前提下，背包中物品总重量的最大值是多少呢？

可以通过回溯方法，穷举搜索所有可能的装法，然后找出满足条件的最大值。但是回溯算法的复杂度比较高，是指数级别的。

<!-- TODO -->

如图，假设背包的最大承载重量是 9，有 5 个不同的物品，每个物品的重量分别是 2，2，4，6，3。

如果把这个例子的回溯求解过程，用递归树画出来，就是下面这个样子：

![递归树](@imgs/42ca6cec4ad034fc3e5c0605fbacecea.jpg)

递归树中的每个节点表示一种状态，用（i, cw）来表示：

- i 表示将要决策第几个物品是否装入背包
- cw 表示当前背包中物品的总重量
- 比如，（2，2）表示将要决策第 2 个物品是否装入背包，在决策前，背包中物品的总重量是 2。

从递归树中可以发现，有些子问题的求解是重复的，比如图中 f(2, 2) 和 f(3, 4) 都被重复计算了两次，可以借助“备忘录”避免冗余计算。

<!-- TODO -->

这种解决方法和动态规划的执行效率基本上没有差别，看看动态规划是怎么做的：

- 把整个求解过程分为 n 个阶段
- 每个阶段会决策一个物品是否放到背包中
- 每个物品决策（放入或者不放入背包）完之后，背包中的物品的重量会有多种情况，也就是说，会达到多种不同的状态，对应到递归树中，就是有很多不同的节点
- 把每一层重复的状态（节点）合并，只记录不同的状态
- 然后基于上一层的状态集合，来推导下一层的状态集合

通过合并每一层重复的状态，这样就保证每一层不同状态的个数都不会超过 w 个（w 表示背包的承载重量），也就是例子中的 9。于是就成功避免了每层状态个数的指数级增长。

用一个二维数组 states[n][w+1]，来记录每层可以达到的不同状态：

- 第 0 个（下标从 0 开始编号）物品的重量是 2，要么装入背包，要么不装入背包，决策完之后，会对应背包的两种状态，背包中物品的总重量是 0 或者 2
- 用 `states[0][0] = true` 和 `states[0][2] = true` 来表示这两种状态
- 第 1 个物品的重量也是 2，基于之前的背包状态，在这个物品决策完之后，不同的状态有 3 个，背包中物品总重量分别是 0(0+0)，2(0+2 or 2+0)，4(2+2)
- 用 `states[1][0] = true`，`states[1][2] = true`，`states[1][4] = true` 来表示这三种状态
- ...
- 以此类推，直到考察完所有的物品后，整个 states 状态数组就都计算好了

下图是整个计算过程。图中 0 表示 false，1 表示 true。只需要在最后一层，找一个值为 true 的最接近 w（这里是 9）的值，就是背包中物品总重量的最大值：

![](@imgs/aaf51df520ea6b8056f4e62aed81a5b5.jpg)

<!-- TODO -->

这就是一种用动态规划解决问题的思路。把问题分解为多个阶段，每个阶段对应一个决策。记录每一个阶段可达的状态集合（去掉重复的），然后通过当前阶段的状态集合，来推导下一个阶段的状态集合，动态地往前推进。

### 时间复杂度

用回溯算法解决这个问题的时间复杂度 O(2 ^ n)，是指数级的。那动态规划解决方案的时间复杂度是多少呢？

耗时最多的部分就是代码中的两层 for 循环，所以时间复杂度是 O(n * w)。n 表示物品个数，w 表示背包可以承载的总重量。

指数级的时间复杂度肯定要比 O(n * w) 高很多，为了让你有更加深刻的感受，举个例子比较一下。假设有 10000 个物品，重量分布在 1 到 15000 之间，背包可以承载的总重量是 30000。

- 用回溯算法解决，时间复杂度是 2 ^ 10000
- 用动态规划解决，时间复杂度是 10000 * 30000，和 2^10000 比起来，要小太多了。

尽管动态规划的执行效率比较高，但是需要额外申请一个 n 乘以 w + 1 的二维数组，对空间的消耗比较多。所以动态规划是一种空间换时间的解决思路。

有什么办法可以降低空间消耗吗？

实际上，只需要一个大小为 w + 1 的一维数组就可以解决这个问题。动态规划状态转移的过程，都可以基于这个一维数组来操作。

<!-- TODO -->

## 0-1 背包问题升级版

刚刚讲的背包问题，只涉及背包重量和物品重量，现在引入物品价值这一变量。对于一组不同重量、不同价值、不可分割的物品，选择将某些物品装入背包，在满足背包最大重量限制的前提下，背包中可装入物品的总价值最大是多少呢？

这个问题依旧可以用回溯算法来解决：

<!-- TODO -->

如图在递归树中，每个节点表示一个状态。现在需要 3 个变量（i, cw, cv）来表示一个状态。其中，i 表示即将要决策第 i 个物品是否装入背包，cw 表示当前背包中物品的总重量，cv 表示当前背包中物品的总价值。

![递归树](@imgs/bf0aa18f367db1b8dfd392906cb5693f.jpg)

可以发现，在递归树中，有几个节点的 i 和 cw 是完全相同的，比如 f(2,2,4) 和 f(2,2,3)。

在背包中物品总重量一样的情况下，f(2,2,4) 这种状态对应的物品总价值更大，可以舍弃 f(2,2,3) 这种状态，只需要沿着 f(2,2,4) 这条决策路线继续往下决策就可以。也就是说，对于 (i, cw) 相同的不同状态，只需要保留 cv 值最大的那个，继续递归处理，其他状态不予考虑。

但是如果用回溯算法，这个问题就没法再用“备忘录”解决了。所以需要换一种思路，看看动态规划是不是更容易解决这个问题。

仍旧把整个求解过程分为 n 个阶段，每个阶段会决策一个物品是否放到背包中。每个阶段决策完之后，背包中的物品的总重量以及总价值，会有多种情况，也就是会达到多种不同的状态。用一个二维数组 states[n][w+1]，来记录每层可以达到的不同状态。不过这里数组存储的值不再是 boolean 类型的了，而是当前状态对应的最大总价值。把每一层中 (i, cw) 重复的状态（节点）合并，只记录 cv 值最大的那个状态，然后基于这些状态来推导下一层的状态。

<!-- TODO -->

## 什么样的问题适合用动态规划

### 一个模型三个特征

一个模型：指动态规划适合解决的问题的模型 - 多阶段决策最优解模型。

动态规划一般用来解决最优问题。而解决问题的过程，需要经历多个决策阶段。每个决策阶段都对应着一组状态。通过寻找一组决策序列，经过这组决策序列，能够产生最终期望求解的最优值。

三个特征：

- 最优子结构
- 无后效性
- 重复子问题

### 最优子结构

指问题的最优解包含子问题的最优解。即可以通过子问题的最优解，推导出问题的最优解（后面阶段的状态可以通过前面阶段的状态推导出来）。

### 无后效性

无后效性有两层含义：

- 在推导后面阶段的状态的时候，只关心前面阶段的状态值，不关心这个状态是怎么一步一步推导出来的
- 某阶段状态一旦确定，就不受之后阶段的决策影响。

无后效性是一个非常“宽松”的要求。只要满足前面提到的动态规划问题模型，其实基本上都会满足无后效性。

### 重复子问题

不同的决策序列，到达某个相同的阶段时，可能会产生重复的状态。

### 举例

有一个 n * n 的矩阵 w[n][n]，存储的都是正整数。棋子起始位置在左上角，终止位置在右下角。

将棋子从左上角移动到右下角，每次只能向右或者向下移动一位。从左上角到右下角，会有很多不同的路径可以走。把每条路径经过的数字加起来看作路径的长度。

从左上角移动到右下角的最短路径长度是多少呢？

![](@imgs/652dff86c5dcc6a0e2a0de9a814b079f.jpg)

先看看这个问题是否符合“一个模型”？

从 (0, 0) 走到 (n - 1, n - 1)，总共要走 2 * (n - 1) 步，也就对应着 2 * (n - 1) 个阶段。每个阶段都有向右走或者向下走两种决策，并且每个阶段都会对应一个状态集合。

把状态定义为 min_dist(i, j)，其中 i 表示行，j 表示列。min_dist 表达式的值表示从 (0, 0) 到达 (i, j) 的最短路径长度。所以这个问题是一个多阶段决策最优解问题，符合动态规划的模型。

![](@imgs/b0da245a38fafbfcc590782486b85269.jpg)

再看看这个问题是否符合“三个特征”？

可以用回溯算法来解决这个问题。如果画一下递归树，就会发现，递归树中有重复的节点。重复的节点表示，从左上角到节点对应的位置，有多种路线，这也能说明这个问题中存在重复子问题。

![](@imgs/64403695861da87f41f7b2ec83d44365.jpg)

如果走到 (i, j) 这个位置，只能通过 (i - 1, j)，(i, j - 1) 这两个位置移动过来，也就是说，想要计算 (i, j) 位置对应的状态，只需要关心 (i - 1, j)，(i, j - 1) 两个位置对应的状态，并不关心棋子是通过什么样的路线到达这两个位置的。而且，仅仅允许往下和往右移动，不允许后退，所以，前面阶段的状态确定之后，不会被后面阶段的决策所改变，所以，这个问题符合“无后效性”这一特征。

刚刚定义状态的时候，把从起始位置 (0, 0) 到 (i, j) 的最小路径，记作 min_dist(i, j)。因为只能往右或往下移动，所以只有可能从 (i, j - 1) 或者 (i - 1, j) 两个位置到达 (i, j)。也就是说，到达 (i, j) 的最短路径要么经过 (i, j - 1)，要么经过 (i - 1, j)，而且到达 (i, j) 的最短路径肯定包含到达这两个位置的最短路径之一。换句话说就是，min_dist(i, j) 可以通过 min_dist(i, j - 1) 和 min_dist(i - 1, j) 两个状态推导出来。这就说明，这个问题符合“最优子结构”。

```
min_dist(i, j) = w[i][j] + min(min_dist(i, j-1), min_dist(i-1, j))
```

## 解题思路总结

### 状态转移表法

能用动态规划解决的问题，一般都可以使用回溯算法的暴力搜索解决。

所以拿到问题时，可以先用简单的回溯算法解决，然后定义状态，每个状态表示一个节点，画出递归树。

从递归树中，很容易可以看出来，是否存在重复子问题，以及重复子问题是如何产生的。以此来寻找规律，看是否能用动态规划解决。

找到重复子问题之后，有两种处理思路：

- 第一种，直接用回溯加“备忘录”的方法，来避免重复子问题。从执行效率上来讲，这跟动态规划的解决思路没有差别
- 第二种，使用动态规划的解决方法，状态转移表法。

看看状态转移表法是如何工作的。

- 先画出一个状态表。状态表一般都是二维的，所以你可以把它想象成二维数组
  - 其中，每个状态包含三个变量，行、列、数组值
- 根据决策的先后过程，从前往后，根据递推关系，分阶段填充状态表中的每个状态
- 最后，将这个递推填表的过程，翻译成代码，就是动态规划代码了

尽管大部分状态表都是二维的，但是如果问题的状态比较复杂，需要很多变量来表示，那对应的状态表可能就是高维的，比如三维、四维。

这个时候，我们就不适合用状态转移表法来解决了：

- 因为高维状态转移表不好画图表示
- 因为人脑确实很不擅长思考高维的东西

尝试套用状态转移表法，解决矩阵最短路径的问题。

从起点到终点有很多种不同的走法。可以穷举所有走法，然后对比找出一个最短走法。如何才能无重复又不遗漏地穷举出所有走法呢？

可以用回溯算法这个比较有规律的穷举算法：

<!-- TODO 代码 -->

有了回溯代码之后，画出递归树，以此来寻找重复子问题。在递归树中，一个状态（也就是一个节点）包含三个变量 (i, j, dist)，其中 i，j 分别表示行和列，dist 表示从起点到达 (i, j) 的路径长度。从图中可以看出，尽管 (i, j, dist) 不存在重复的，但是 (i, j) 重复的有很多。对于 (i, j) 重复的节点，只需要选择 dist 最小的节点，继续递归求解，其他节点就可以舍弃了。

![](@imgs/2c3ec820fa8f8cc7df838c0304b030e2.jpg)

既然存在重复子问题，就可以尝试下，是否可以用动态规划来解决呢？

画出二维状态表，表中的行、列表示棋子所在的位置，表中的数值表示从起点到这个位置的最短路径。按照决策过程，通过不断状态递推演进，将状态表填好：

![](@imgs/b3f0de1c81533a0d24c43426eaf09aca.jpg)
![](@imgs/05a48baf7fb4d251bf5078840079107d.jpg)

<!-- TODO -->

### 状态转移方程法

状态转移方程法有点类似递归的解题思路。通过分析最优子结构，根据最优子结构，写出递归公式，也就是所谓的状态转移方程。有了状态转移方程，代码实现就非常简单了。

一般有两种代码实现方法：

- 一种是递归加“备忘录”
- 另一种是迭代递推

还是以刚才的例子举例，状态转移方程如下：

```
min_dist(i, j) = w[i][j] + min(min_dist(i, j-1), min_dist(i-1, j))
```

强调一下，**状态转移方程是解决动态规划的关键**。

下面是递归加“备忘录”的方式，将状态转移方程翻译成来代码：

<!-- TODO -->

## 比较四种思想

将这四种算法思想分类：

- 贪心、回溯、动态规划可以归为一类
- 分治单独可以作为一类，因为它跟其他三个都不大一样

前三个算法解决问题的模型，都可以抽象成多阶段决策最优解模型，而分治算法解决的问题尽管大部分也是最优解问题，但是，大部分都不能抽象成多阶段决策模型。

回溯算法是个“万金油”。基本上能用的动态规划、贪心解决的问题，都可以用回溯算法解决。回溯算法相当于穷举搜索。穷举所有的情况，然后对比得到最优解。不过，回溯算法的时间复杂度非常高，是指数级别的，只能用来解决小规模数据的问题。对于大规模数据的问题，用回溯算法解决的执行效率就很低了。

动态规划比回溯算法高效，但并不是所有问题，都可以用动态规划来解决。能用动态规划解决的问题，需要满足三个特征，最优子结构、无后效性和重复子问题。在重复子问题这一点上，动态规划和分治算法的区分非常明显。分治算法要求分割成的子问题，不能有重复子问题，而动态规划正好相反。动态规划之所以高效，就是因为回溯算法实现中存在大量的重复子问题。

贪心算法实际上是动态规划算法的一种特殊情况。它解决问题起来更加高效，代码实现也更加简洁。不过，它可以解决的问题也更加有限，需要满足三个条件，最优子结构、无后效性和贪心选择性（这里我们不怎么强调重复子问题）。其中，最优子结构、无后效性跟动态规划中的无异。“贪心选择性”的意思是，通过局部最优的选择，能产生全局的最优选择。每一个阶段都选择当前看起来最优的决策，所有阶段的决策完成之后，最终由这些局部最优解构成全局最优解。

## 应用

### 凑单问题

购物车中有 n 个商品，针对每个商品都决策是否购买。每次决策之后，对应不同的状态集合，用一个二维数组 states[n][x]，来记录每次决策之后所有可达的状态。

### 硬币找零

硬币找零问题，我们在贪心算法那一节中讲过一次。我们今天来看一个新的硬币找零问题。假设我们有几种不同币值的硬币 v1，v2，……，vn（单位是元）。如果我们要支付 w 元，求最少需要多少个硬币。比如，我们有 3 种不同的硬币，1 元、3 元、5 元，我们要支付 9 元，最少需要 3 个硬币（3 个 3 元的硬币）。

### 拼写纠错

利用 Trie 树，可以实现搜索引擎的关键词提示功能，这样可以节省用户输入搜索关键词的时间。

实际上，搜索引擎在用户体验方面的优化还有很多，比如经常会用的拼写纠错功能。当你在搜索框中，一不小心输错单词时，搜索引擎会非常智能地检测出拼写错误，并且用对应的正确单词来进行搜索。

#### 如何量化两个字符串的相似度？

计算机只认识数字，所以要解答该问题，就要先来看如何量化两个字符串之间的相似程度呢？

编辑距离（Edit Distance）。

编辑距离指的就是，将一个字符串转化成另一个字符串，需要的最少编辑操作次数（比如增加一个字符、删除一个字符、替换一个字符）：

- 编辑距离越大，说明两个字符串的相似程度越小
- 相反，编辑距离就越小，说明两个字符串的相似程度越大
- 对于两个完全相同的字符串来说，编辑距离就是 0

根据所包含的编辑操作种类的不同，编辑距离有多种不同的计算方式，比较著名的有：

- 莱文斯坦距离（Levenshtein distance）：允许增加、删除、替换字符这三个编辑操作
  - 距离的大小，表示两个字符串差异的大小
- 最长公共子串长度（Longest common substring length）：只允许增加、删除字符这两个编辑操作
  - 表示两个字符串相似程度的大小

举例说明这两种计算方法，字符串 mitcmu 和 mtacnu 的莱文斯坦距离是 3，最长公共子串长度是 4：

![](@imgs/f0e72008ce8451609abed7e368ac420f.jpg)

#### 编程计算莱文斯坦距离

这个问题是求把一个字符串变成另一个字符串，需要的最少编辑次数。

整个求解过程，涉及多个决策阶段，需要依次考察一个字符串中的每个字符，跟另一个字符串中的字符是否匹配，匹配的话如何处理，不匹配的话又如何处理。所以，这个问题符合多阶段决策最优解模型。贪心、回溯、动态规划可以解决的问题，都可以抽象成这样一个模型。

先看一看，用最简单的回溯算法，该如何来解决：

- 回溯是一个递归处理的过程
- 如果 a[i] 与 b[j] 匹配，递归考察 a[i+1] 和 b[j+1]
- 如果 a[i] 与 b[j] 不匹配，那就有多种处理方式可选
  - 可以删除 a[i]，然后递归考察 a[i+1] 和 b[j]
  - 可以删除 b[j]，然后递归考察 a[i] 和 b[j+1]
  - 可以在 a[i] 前面添加一个跟 b[j] 相同的字符，然后递归考察 a[i] 和 b[j+1]
  - 可以在 b[j] 前面添加一个跟 a[i] 相同的字符，然后递归考察 a[i+1] 和 b[j]
  - 可以将 a[i] 替换成 b[j]，或者将 b[j] 替换成 a[i]，然后递归考察 a[i+1] 和 b[j+1]

<!-- TODO -->

根据回溯算法的代码实现，画出递归树，看是否存在重复子问题：

- 如果存在重复子问题，那就可以考虑能否用动态规划来解决
- 如果不存在重复子问题，那回溯就是最好的解决方法

![](@imgs/864f25506eb3db427377bde7bb4c9589.jpg)

在递归树中，每个节点代表一个状态，状态包含三个变量 (i, j, edist)，其中，edist 表示处理到 a[i] 和 b[j] 时，已经执行的编辑操作的次数。

在递归树中，(i, j) 两个变量重复的节点很多，比如 (3, 2) 和 (2, 3)。对于 (i, j) 相同的节点，只需要保留 edist 最小的，继续递归处理就可以了，剩下的节点都可以舍弃。

所以，状态就从 (i, j, edist) 变成了 (i, j, min_edist)，其中 min_edist 表示处理到 a[i] 和 b[j]，已经执行的最少编辑次数。

可以发现，状态 (i, j) 可能从 (i-1, j)，(i, j-1)，(i-1, j-1) 三个状态中的任意一个转移过来：

![](@imgs/11ffcba9b3c722c5487de7df5a0d6c89.jpg)

尝试把状态转移的过程，用公式写出来：

```

如果：a[i]!=b[j]，那么：min_edist(i, j)就等于：
min(min_edist(i-1,j)+1, min_edist(i,j-1)+1, min_edist(i-1,j-1)+1)

如果：a[i]==b[j]，那么：min_edist(i, j)就等于：
min(min_edist(i-1,j)+1, min_edist(i,j-1)+1，min_edist(i-1,j-1))

其中，min表示求三数中的最小值。
```

了解了状态与状态之间的递推关系，画出一个二维的状态表，按行依次来填充状态表中的每个值：

![](@imgs/ab44eb53fad2601c19f73604747d652d.jpg)

<!-- TODO -->

#### 编程计算最长公共子串长度

最长公共子串作为编辑距离中的一种，只允许增加、删除字符两种编辑操作。

从本质上来说，它表征的也是两个字符串之间的相似程度。

这个问题的解决思路，跟莱文斯坦距离的解决思路非常相似，也可以用动态规划解决。

每个状态包括三个变量 (i, j, max_lcs)，max_lcs 表示 a[0…i] 和 b[0…j] 的最长公共子串长度。那 (i, j) 这个状态都是由哪些状态转移过来的呢？

先看看回溯的处理思路。从 a[0] 和 b[0] 开始，依次考察两个字符串中的字符是否匹配：

- 如果 a[i] 与 b[j] 互相匹配，将最大公共子串长度加一，并且继续考察 a[i+1] 和 b[j+1]
- 如果 a[i] 与 b[j] 不匹配，最长公共子串长度不变，此时有两个不同的决策路线
  - 删除 a[i]，或者在 b[j] 前面加上一个字符 a[i]，然后继续考察 a[i+1] 和 b[j]
  - 删除 b[j]，或者在 a[i] 前面加上一个字符 b[j]，然后继续考察 a[i] 和 b[j+1]

反过来也就是说，如果要求 a[0…i] 和 b[0…j] 的最长公共长度 max_lcs(i, j)，只有可能通过下面三个状态转移过来：

- (i-1, j-1, max_lcs)，其中 max_lcs 表示 a[0…i-1] 和 b[0…j-1] 的最长公共子串长度
- (i-1, j, max_lcs)，其中 max_lcs 表示 a[0…i-1] 和 b[0…j] 的最长公共子串长度
- (i, j-1, max_lcs)，其中 max_lcs 表示 a[0…i] 和 b[0…j-1] 的最长公共子串长度

写出状态转移方程：

```
如果：a[i]==b[j]，那么：max_lcs(i, j)就等于：
max(max_lcs(i-1,j-1)+1, max_lcs(i-1, j), max_lcs(i, j-1))；

如果：a[i]!=b[j]，那么：max_lcs(i, j)就等于：
max(max_lcs(i-1,j-1), max_lcs(i-1, j), max_lcs(i, j-1))；

其中max表示求三数中的最大值。
```

<!-- TODO -->

#### 拼写纠错

最基本的原理：当用户在搜索框内，输入一个拼写错误的单词时，就拿这个单词跟词库中的单词一一进行比较，计算编辑距离，将编辑距离最小的单词，作为纠正之后的单词，提示给用户。

真正用于商用的搜索引擎，拼写纠错功能显然不会就这么简单：

- 一方面，单纯利用编辑距离来纠错，效果并不一定好
- 另一方面，词库中的数据量可能很大，搜索引擎每天要支持海量的搜索，所以对纠错的性能要求很高

针对纠错效果不好的问题，有很多种优化思路，这里介绍几种：

- 并不仅仅取出编辑距离最小的那个单词，而是取出编辑距离最小的 TOP 10，然后根据其他参数，决策选择哪个单词作为拼写纠错单词。比如使用搜索热门程度来决定哪个单词作为拼写纠错单词
- 还可以用多种编辑距离计算方法，比如今天讲到的两种，然后分别编辑距离最小的 TOP 10，然后求交集，用交集的结果，再继续优化处理
- 还可以通过统计用户的搜索日志，得到最常被拼错的单词列表，以及对应的拼写正确的单词。搜索引擎在拼写纠错的时候，首先在这个最常被拼错单词列表中查找。如果一旦找到，直接返回对应的正确的单词。这样纠错的效果非常好
- 还有更加高级一点的做法，引入个性化因素。针对每个用户，维护这个用户特有的搜索喜好，也就是常用的搜索关键词。当用户输入错误的单词的时候，首先在这个用户常用的搜索关键词中，计算编辑距离，查找编辑距离最小的单词

针对纠错性能方面，也有相应的优化方式，下面两种是基于分治的优化思路：

- 如果纠错功能的 TPS 不高，可以部署多台机器，每台机器运行一个独立的纠错功能。当有一个纠错请求的时候，我们通过负载均衡，分配到其中一台机器，来计算编辑距离，得到纠错单词
- 如果纠错系统的响应时间太长，也就是，每个纠错请求处理时间过长，可以将纠错的词库，分割到很多台机器。当有一个纠错请求的时候，就将这个拼写错误的单词，同时发送到这多台机器，让多台机器并行处理，分别得到编辑距离最小的单词，然后再比对合并，最终决定出一个最优的纠错单词。


## 思考

### 课后思考“杨辉三角”不知道你听说过吗？我们现在对它进行一些改造。每个位置的数字可以随意填写，经过某个数字只能到达下面一层相邻的两个数字。假设你站在第一层，往下移动，我们把移动到最底层所经过的所有数字之和，定义为路径的长度。请你编程求出从最高层移动到最底层的最短路径长度


### 我们有一个数字序列包含 n 个不同的数字，如何求出这个序列中的最长递增子序列长度？比如 2, 9, 3, 6, 5, 1, 7 这样一组数字序列，它的最长递增子序列就是 2, 3, 5, 7，所以最长递增子序列的长度是 4。