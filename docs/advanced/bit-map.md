# 位图（BitMap）

网页爬虫是搜索引擎中的非常重要的系统，负责爬取几十亿、上百亿的网页。爬虫的工作原理是，通过解析已经爬取页面中的网页链接，然后再爬取这些链接对应的网页。

同一个网页链接有可能被包含在多个页面中，这就会导致爬虫在爬取的过程中，重复爬取相同的网页。如何避免这些重复的爬取呢？

最容易想到的方法，记录已经爬取的网页链接，在爬取一个新的网页之前，在已经爬取的网页链接列表中搜索该页面的链接：

- 如果存在，说明这个网页已经被爬取过了
- 如果不存在，说明这个网页还没有被爬取过，可以继续去爬取
- 等爬取到这个网页之后，将这个网页的链接添加到已经爬取的网页链接列表

那么该如何记录已经爬取的网页链接呢？需要用什么样的数据结构呢？

## 算法解析

先回想下，是否可以用之前学过的数据结构来解决呢？

这个问题要处理的对象是网页链接，需要支持两个操作：

- 添加一个 URL
- 查询一个 URL

除了这两个功能性的要求之外，在非功能性方面，还要求这两个操作的执行效率要尽可能高。除此之外，因为处理的是上亿的网页链接，内存消耗会非常大，所以在存储效率上，要尽可能地高效。

显然，散列表、红黑树、跳表这些动态数据结构，都能支持快速地插入、查找数据，但是在内存消耗方面，是否可以接受呢？

以散列表为例，假设要爬取 10 亿个网页（像 Google、百度这样的通用搜索引擎，爬取的网页可能会更多），为了判重，把这 10 亿网页链接存储在散列表中。你来估算下，大约需要多少内存？

- 假设一个 URL 的平均长度是 64 字节，那单纯存储这 10 亿个 URL 需要大约 60GB 的内存空间
- 散列表必须维持较小的装载因子，才能保证不会出现过多的散列冲突，导致操作的性能下降
- 用链表法解决冲突的散列表，还会存储链表指针

所以，如果将这 10 亿个 URL 构建成散列表，那需要的内存空间会远大于 60GB，有可能会超过 100GB。

当然，对于一个大型的搜索引擎来说，即便是 100GB 的内存要求，其实也不算太高，可以采用分治的思想，用多台机器（比如 20 台内存是 8GB 的机器）来存储这 10 亿网页链接。

对于爬虫的 URL 去重这个问题，刚刚讲到的分治加散列表的思路，已经是可以实实在在工作的了。考虑一下添加、查询数据的效率以及内存消耗方面，是否还有进一步的优化空间呢？

你可能会说，散列表中添加、查找数据的时间复杂度已经是 O(1)，还能有进一步优化的空间吗？时间复杂度并不能完全代表代码的执行时间。大 O 时间复杂度表示法，会忽略掉常数、系数和低阶，并且统计的对象是语句的频度。不同的语句，执行时间也是不同的。时间复杂度只是表示执行时间随数据规模的变化趋势，并不能度量在特定的数据规模下，代码执行时间的多少。

用基于链表的方法解决冲突问题，散列表中存储的是 URL，那当查询的时候，通过哈希函数定位到某个链表之后，还需要依次比对每个链表中的 URL。这个操作是比较耗时的，主要有两点原因：

- 链表中的结点在内存中不是连续存储的，所以不能一下子加载到 CPU 缓存中，没法很好地利用到 CPU 高速缓存，所以数据访问性能方面会打折扣
- 链表中的每个数据都是 URL，而 URL 不是简单的数字，是平均长度为 64 字节的字符串。也就是说，要让待判重的 URL，跟链表中的每个 URL，做字符串匹配。显然，这样一个字符串匹配操作，比起单纯的数字比对，要慢很多

所以，基于这两点，执行效率方面肯定是有优化空间的。

### 位图

如果要想内存方面有明显的节省，那就得换一种解决方案，也就是我们今天要着重讲的这种存储结构，布隆过滤器（Bloom Filter）。在讲布隆过滤器前，我要先讲一下另一种存储结构，位图（BitMap）。因为，布隆过滤器本身就是基于位图的，是对位图的一种改进。

### 布隆过滤器（Bloom Filter）

如果要想内存方面有明显的节省，那就得换一种解决方案，也就是我们今天要着重讲的这种存储结构，布隆过滤器（Bloom Filter）。在讲布隆过滤器前，我要先讲一下另一种存储结构，位图（BitMap）。因为，布隆过滤器本身就是基于位图的，是对位图的一种改进。