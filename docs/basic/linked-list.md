# 链表

## 链表 vs 数组

先从底层的存储结构上来看一看。

![数组 vs 链表](@imgs/d5d5bee4be28326ba3c28373808a62cd.jpg)

- **数组需要一块连续的内存空间来存储，对内存的要求比较高**。
> 如果申请一个 100MB 大小的数组，当内存中没有连续的、足够大的存储空间时，即便内存的剩余总可用空间大于 100MB，仍然会申请失败。

- **链表恰恰相反，它并不需要一块连续的内存空间，它通过“指针”将一组零散的内存块串联起来使用**。

我们先介绍三种最常见的链表结构：

- [单链表](./linked-list/singly-linked-list.md)
- [循环链表](./linked-list/circular-linked-list.md)
- [双向链表](./linked-list/doubly-linked-list.md)

## 数组 or 链表

### 预读取

- 数组在实现上使用的是连续的内存空间，可以**借助 CPU 的缓存机制，预读数组中的数据，所以访问效率更高**。
- 而链表在内存中并不是连续存储，所以对 CPU 缓存不友好，没办法有效预读。

> CPU 从内存读取数据的时会先把读取到的数据加载到 CPU 的缓存中，且每次从内存读取的是一个数据块，而数组的存储空间是连续的，所以在加载某个下标的时候可以把以后的几个下标元素也加载到 CPU 缓存。

### 内存敏感

- 如果**对内存的使用非常苛刻，那数组就更适合**。
- 因为链表中的每个结点，都需要消耗额外的存储空间去存储一份指向下一个结点的指针，所以内存消耗会翻倍。
- 而且，对链表进行频繁的插入、删除操作，还会导致频繁的内存申请和释放，容易造成内存碎片。

所以，在我们实际的开发中，针对不同类型的项目，要根据具体情况，权衡究竟是选择数组还是链表。

## 缓存淘汰算法（LRU）

思考一个问题，当缓存被用满时，如何判断哪些数据应该被清理出去，哪些数据应该被保留？

### 缓存淘汰策略

这就需要缓存淘汰策略来决定。常见的策略有三种：

- **先进先出策略 FIFO** ( First In，First Out )
- **最少使用策略 LFU** ( Least Frequently Used )
- **最近最少使用策略 LRU** ( Least Recently Used )

### LRU

那么如何基于链表实现 LRU 缓存淘汰算法？

- 维护一个**有序单链表，越靠近链表尾部的结点是越早之前访问的**
- 当有一个新的数据被访问时，从链表头开始顺序遍历链表
  1. 此数据之前已经被缓存在链表中：
     - 遍历得到这个数据对应的结点，并将其从原来的位置删除，然后再插入到链表的头部
  2. 此数据没有在缓存链表中：
     - 此时缓存未满，将此结点直接插入到链表的头部
     - 此时缓存已满，链表尾结点删除，将新的数据结点插入链表的头部

不管缓存有没有满，都需要遍历一遍链表，所以**时间复杂度为 O(n)**。

```ts
class LinkedListForLRU<T> extends LinkedList<T> {
  findByValue(value:T) {
    let node = this.head;

    while(node && node.data !== value) {
      node = node.next;
    }

    return node;
  }

  removeByValue(value: T) {
    let node = this.head;
    let prev = null

    while(node && node.data !== value) {
      node = node.next;
      prev = node;
    }

    if (!node) return false;

    prev.next = node.next;
    return true;
  }
}

class LRUCache<T> {

  private size: number;
  private linkedListForLRU: LinkedListForLRU<T>;

  constructor(size: number) {
    this.size = size;
    this.linkedListForLRU = new LinkedListForLRU<T>();
  }

  public get(value: T) {
    let node = this.linkedListForLRU.findByValue(value);

    if (node) {
      this.linkedListForLRU.removeByValue(value);
    } else {
      node = new LinkedListNode(value);

      // 链表已满
      if (this.linkedListForLRU.size === this.size) {
        // 删除末尾的
        this.linkedListForLRU.remove(this.linkedListForLRU.size - 1);
      }
    }

    this.linkedListForLRU.insertToHead(node);

    return node;
  }
}
```

## 编写链表代码的技巧

想要写好链表代码并不容易，尤其是那些复杂的链表操作，比如链表反转、有序链表合并等，写的时候非常容易出错。下面是总结的写链表代码技巧：

### 理解指针与引用的含义

不管是“指针”还是“引用”，它们的意思都表示对象的内存地址。

对于指针只需要记住下面这句话就可以了：**指针中存储的是内存地址，将某个变量赋值给指针，实际上就是将这个变量的地址赋值给指针。反过来说，指针中存储了这个变量的内存地址，那么通过指针就能找到这个变量**。

### 警惕指针丢失和内存泄漏

写链表代码的时候，一定注意不要弄丢了指针。

对于有些语言来说，比如 C 语言，内存管理是由程序员负责的，如果没有手动释放结点对应的内存空间，就会产生内存泄露。

所以，我们插入结点时，一定要注意操作的顺序，要先将结点 x 的 next 指针指向结点 b，再把结点 a 的 next 指针指向结点 x，这样才不会丢失指针，导致内存泄漏。

同理，删除链表结点时，也一定要记得手动释放内存空间，否则也会出现内存泄漏的问题。

当然，对于像 Java 这种虚拟机自动管理内存的编程语言来说，就不需要考虑这么多了。

### 利用哨兵简化实现难度

- 在结点 node 后面插入一个新的结点 newNode，只需要下面两行代码就可以搞定：

```ts
newNode.next = node.next
node.next = newNode
```

- 但是，当要向一个空链表中插入第一个结点，刚刚的逻辑就不能用了。

```ts
// head 表示链表的头结点
if (head === null) {
  head = new_node;
}
```

也就是说，head 结点的插入逻辑和其他结点的插入逻辑是不一样的。

- 同样的，删除一个结点的后继结点，只需要下面这一行代码就可以搞定：

```ts
node.next = node.next.next
```

- 但是，如果要删除链表的最后一个结点，就需要特殊处理：

```ts
if (node.next === null) {
  head = null
}
```

综上，链表的插入、删除操作，需要对第一个结点和最后一个结点的情况进行特殊处理。

但是这么做感觉很繁琐，而且容易因为考虑不全而出错。此时可以**通过哨兵解决边界问题**。

- 带头链表：引入哨兵结点，head 指针永远指向哨兵结点
- 不带头链表：没有哨兵结点

![哨兵结点](@imgs/7d22d9428bdbba96bfe388fe1e3368c7.jpg)

**哨兵结点不存储数据，因为哨兵结点一直存在，所以插入第一个结点和插入其他结点的操作，就都一样；删除最后一个结点的操作和删除其他结点的操作，也都一样了**。

### 重点留意边界条件处理

常用的检查链表代码是否正确的边界条件有：

- 如果链表为空时，代码是否能正常工作？
- 如果链表只包含一个结点时，代码是否能正常工作？
- 如果链表只包含两个结点时，代码是否能正常工作？
- 代码逻辑在处理头结点和尾结点的时候，是否能正常工作？

### 举例画图，辅助思考

对于稍微复杂的链表操作，需要举例法和画图法。把各种情况都举一个例子，画出插入前和插入后的链表变化，如图所示：

![画图](@imgs/4a701dd79b59427be654261805b349f8.jpg)

## 题目

Leetcode: 206，141，21，19，876 TODO

## 思考

- 如何判断一个字符串是否是回文字符串？

- 如果字符串是通过单链表来存储的，那该如何来判断是一个回文串呢？相应的时间空间复杂度又是多少呢？

- 是否还能够想到其他场景，利用哨兵可以大大地简化编码难度？

- 其他见[链表常见问题](./linked-list/questions.md)
