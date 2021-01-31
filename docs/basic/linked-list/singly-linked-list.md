# 单链表

![单链表](@imgs/b93e7ade9bb927baad1348d9a806ddeb.jpg)

单链表有几个重要的概念：

- **结点**：链表通过指针将一组零散的内存块串联在一起，该内存块称为链表的“结点”
- **后继指针（next）**：为了将所有的结点串起来，每个链表的结点除了存储数据之外，还需要记录链上的下一个结点的地址，这个记录下个结点地址的指针叫作后继指针
- **头结点**：第一个结点，用来记录链表的基地址，通过该结点可以遍历得到整条链表
- **尾结点**：最后一个结点，指向一个空地址 NULL，表示这是链表上最后一个结点

## 查找、插入和删除

**在链表中插入和删除一个数据是非常快速的，时间复杂度为 O(1)。**

> 在链表中插入或者删除一个数据，并不需要为了保持内存的连续性而搬移结点，因为链表的存储空间本身就不是连续的。

有利就有弊，链表要想**随机访问第 k 个元素**，就没有数组那么高效了，需要根据指针一个结点一个结点地依次遍历，直到找到相应的结点，**时间复杂度为 O(n)**。

> 因为链表中的数据并非连续存储的，所以无法像数组那样，根据首地址和下标，通过寻址公式就能直接计算出对应的内存地址。

![插入、删除](@imgs/452e943788bdeea462d364389bd08a17.jpg)

```ts
interface List<T> {
  findByIndex(index: number): any;

  remove(index: number): boolean;

  insert(value: T, index: number): boolean;
}

class LinkedListNode<T> {
  data: T;
  next: LinkedListNode;

  constructor(value: T, next = null) {
    this.data = value;
    this.next = next;
  }
}

class LinkedList<T> implements List<T> {

  // 哨兵结点
  protected head = new LinkedListNode<T>(null, this.tail);
  protected tail = new LinkedListNode();
  protected _size = 0;

  get size() {
    return this._size;
  }

  findByIndex(index: number) {
    let node = this.head.next,
        pos = 0;
    while (node && pos !== index) {
      node = node.next;
      pos += 1;
    }

    return node;
  }

  // 删除指定 index 后的结点
  remove(index: number) {
    const node = this.findByIndex(index);

    if (node !== null) {
      node.next = node.next.next;
      this._size -= 1;
      return true
    }

    return false
  }

  // 在指定的 index 后插入结点
  insert(value: T, index: number) {
    const node = this.findByIndex(index);

    if (node !== null) {
      const newNode = new LinkedListNode(value, node.next.next);
      node.next = newNode;
      this._size += 1;
      return true;
    }
    return false;
  }

  // 头插法
  insertToHead(value: T) {
    const newNode = new LinkedListNode(value, this.head.next);
    this.head.next = newNode;
    this._size += 1;
  }

  // 尾插法
  insertToTail(value) {
    const newNode = new LinkedListNode(value, this.tail);
    const node = this.findByIndex(this.size - 1);

    node.next = newNode;
  }
}
```
