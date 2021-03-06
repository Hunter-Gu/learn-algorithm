# AC 自动机

内容网站如 BBS，大都会有敏感词过滤功能，这个功能最基本的原理就是字符串匹配算法。通过维护一个敏感词的字典，通过字符串匹配算法，查找用户输入的文字，是否包含敏感词。

前面几种字符串匹配算法，都可以处理这个问题。但对于访问量巨大的网站来说（比如淘宝，用户每天的评论数有几亿、甚至几十亿），对敏感词过滤系统的性能要求就要很高。

## 基于单模式串和 Trie 树实现的敏感词过滤

- 单模式串匹配算法：BF 算法、RK 算法、BM 算法、KMP。在一个模式串和一个主串之间进行匹配（在一个主串中查找一个模式串）
- 多模式串匹配算法：Trie 树。在多个模式串和一个主串之间做匹配（在一个主串中查找多个模式串）

与单模式匹配算法相比，多模式匹配算法在这个问题的处理上很高效。它只需要扫描一遍主串，就能在主串中一次性查找多个模式串是否存在，从而大大提高匹配效率。

那如何用 Trie 树实现敏感词过滤功能呢？

对敏感词字典进行预处理，构建成 Trie 树结构。这个预处理的操作只需要做一次，如果敏感词字典动态更新了，比如删除、添加了一个敏感词，只需要动态更新一下 Trie 树就可以了。

- 当用户输入一个文本内容后，把用户输入的内容作为主串，从第一个字符（假设是字符 C）开始，在 Trie 树中匹配
- 当匹配到 Trie 树的叶子节点，或者中途遇到不匹配字符的时候，将主串的开始匹配位置后移一位，也就是从字符 C 的下一个字符开始，重新在 Trie 树中匹配

该处理方法有点类似单模式串匹配的 BF 算法。在单模式串匹配算法中，KMP 算法对 BF 算法进行改进，引入了 next 数组，让匹配失败时，尽可能将模式串往后多滑动几位。借鉴单模式串的优化改进方法，能否对多模式串 Trie 树进行改进，进一步提高 Trie 树的效率呢？这就要用到 AC 自动机算法了。

## 经典的多模式串匹配算法：AC 自动机

AC 自动机实际上就是在 Trie 树之上，加了类似 KMP 的 next 数组，只不过此处的 next 数组是构建在树上的。

AC 自动机的构建，包含两个操作：

- 将多个模式串构建成 Trie 树
- 在 Trie 树上构建失败指针（相当于 KMP 中的失效函数 next 数组）

以模式串 c，bc，bcd，abcd，主串 abcd 为例：

![例子](@imgs/f80487051d8f44cabf488195de8db1f1.jpg)

- 沿 Trie 树走到 p 节点（图中的紫色节点），那 p 的失败指针就是从 root 走到紫色节点形成的字符串 abc，跟所有模式串前缀匹配的最长可匹配后缀子串，就是箭头指的 bc 模式串

![步骤一](@imgs/582ec4651948b4cdc1e1b49235e4f8ca.jpg)

> 可匹配后缀子串：某个后缀子串可以匹配某个模式串的前缀，该后缀子串叫作可匹配后缀子串。

将 p 节点的失败指针指向那个最长匹配后缀子串对应的模式串的前缀的最后一个节点，就是图中箭头指向的节点。

把树中相同深度的节点放到同一层，那么某个节点的失败指针只有可能出现在它所在层的上一层，所以可以逐层依次来求解每个节点的失败指针。

### 寻找子节点的失败指针

当我们已经求得某个节点 p 的失败指针之后，如何寻找它的子节点的失败指针呢？

- 假设节点 p 的失败指针指向节点 q
- 看节点 p 的子节点 pc 对应的字符，是否也可以在节点 q 的子节点中找到

如果找到了节点 q 的一个子节点 qc，对应的字符跟节点 pc 对应的字符相同，则将节点 pc 的失败指针指向节点 qc：

![](@imgs/da685b7ac5f7dc41b2db6cf5d9a35a1f.jpg)

如果节点 q 中没有子节点的字符等于节点 pc 包含的字符，则令 q=q->fail（fail 表示失败指针）：

![](@imgs/91123d8c38a050d32ca730a93c7aa061.jpg)

继续上面的查找，直到 q 是 root 为止，如果还没有找到相同字符的子节点，就让节点 pc 的失败指针指向 root。

<!-- TODO 代码 -->

最后构建完成之后的 AC 自动机就是下面这个样子：

![](@imgs/5150d176502dda4adfc63e9b2915b23c.jpg)

那么该如何在 AC 自动机上匹配主串？

继续以之前的例子分析。在匹配过程中，主串从 i=0 开始，AC 自动机从指针 p=root 开始，假设模式串是 b，主串是 a。

- 如果 p 指向的节点有一个等于 b[i] 的子节点 x，就更新 p 指向 x，这个时候我们需要通过失败指针，检测一系列失败指针为结尾的路径是否是模式串。处理完之后，将 i 加一，继续这两个过程
- 如果 p 指向的节点没有等于 b[i] 的子节点，那失败指针就派上用场了，让 `p = p -> fail`，然后继续这 2 个过程

<!-- TODO 代码 -->

## 复杂度

Trie 树构建的时间复杂度是 O(m * len)，其中 len 表示敏感词的平均长度，m 表示敏感词的个数。

那构建失败指针的时间复杂度是多少呢？

假设 Trie 树中总的节点个数是 k，每个节点构建失败指针的时候，最耗时的环节是 while 循环中的 `q = q -> fail`，每运行一次这个语句，q 指向节点的深度都会减少 1，而树的高度最高也不会超过 len，所以每个节点构建失败指针的时间复杂度大概是 O(len)。整个失败指针的构建过程大概就是 O(k*len)。

不过，AC 自动机的构建过程都是预先处理好的，构建好之后，并不会频繁地更新，所以不会影响到敏感词过滤的运行效率。

用 AC 自动机做匹配的时间复杂度是多少？

for 循环依次遍历主串中的每个字符，for 循环内部最耗时的部分也是 while 循环，而这一部分的时间复杂度也是 O(len)，所以总的匹配的时间复杂度就是 O(n * len)。

因为敏感词并不会很长，而且这个时间复杂度只是一个非常宽泛的上限，实际情况下，可能近似于 O(n)，所以 AC 自动机做敏感词过滤，性能非常高。

从时间复杂度上看，AC 自动机匹配的效率跟 Trie 树一样。但实际上，因为失效指针可能大部分情况下都指向 root 节点，所以绝大部分情况下，在 AC 自动机上做匹配的效率要远高于刚刚计算出的比较宽泛的时间复杂度。只有在极端情况下，如图所示，AC 自动机的性能才会退化的跟 Trie 树一样。

![最差情况](@imgs/8cd064ab3103f9f38b02f298fc01c237.jpg)
