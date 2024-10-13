# 循环链表

**一种特殊的[单链表](./singly-linked-list.md)**。

它跟单链表唯一的区别就在尾结点，循环链表的尾结点指针指向链表的头结点。

![](@imgs/86cb7dc331ea958b0a108b911f38d155.jpg)

循环链表的优点是从链尾到链头比较方便，特别适合处理环型结构的数据。如[约瑟夫问题](https://zh.wikipedia.org/wiki/%E7%BA%A6%E7%91%9F%E5%A4%AB%E6%96%AF%E9%97%AE%E9%A2%98)。

## 如何判断是循环链表 - 快慢指针

```ts
interface LinkedListNode<T> {
  data: T;
  next: LinkListNode;
}

function checkCircle<T>(linkedList: LinkedListNode<T>) {
  let slow = linkedList,
      fast = linkedList.next;

  while (fast !== null && fast.next !== null) {
    slow = slow.next;
    fast = fast.next.next;

    if (slow === fast) return true
  }

  return false
}
```

### 约瑟夫环

```ts
class SinglyLinkList<T> {

  get next() {
    return this._next;
  }

  get data() {
    return this._data;
  }

  setNext(nextNode: SinglyLinkList<T>) {
    this._next = nextNode;
  }

  constructor(private _data: T, private _next: SinglyLinkList<T> | null = null) {
  }
}

function createJoseph(total: number): SinglyLinkList<number> {
  let head: SinglyLinkList<number>;
  let tail: SinglyLinkList<number>;
  for (let i = 0; i < total; i++) {
    const node = new SinglyLinkList(i + 1)
    // @ts-ignore
    if (tail) {
      tail.setNext(node)
    } else {
      head = node
    }
    tail = node
  }
  tail!.setNext(head!)
  // @ts-ignore
  return head
}

function runJoseph(total: number, skip: number) {
  let joseph = createJoseph(total)

  if (total <= 1) {
    return joseph;
  } else {
    while (joseph.next !== joseph) {
      // 删除某个元素
      for (let i = 1; i < skip; i++) {
        joseph = joseph.next!;
      }
      const next = joseph.next
      console.log('删除 ', next.data)
      joseph.setNext(next.next!)
      joseph = next!.next!
    }
  }
  console.log('还剩', joseph.data)
}

runJoseph(10, 3)
```

该方法的缺陷：

- 时间复杂度受 total 或 skip 影响 `O(total * skip)`

### 数学公式

由于求解在约瑟夫环只需要求出最后的一个出列者的序号，而不必要去模拟整个报数的过程。因此，为了追求效率，可以考虑从数学角度进行推算，找出规律然后再编写程序。

- 假设 0 ~ (N - 1) 这 N 个人的原始编号为 0  1  2  3  …  N-3  N-2  N-1，间距为 M
- 第一个出列的人的编号一定是 (M - 1) % N
- 有一人出列后的列表 0  1  2  3  …  M-3  M-2  ○  M  M+1  M+2  …  N-3  N-2  N-1
- 出列后序号又从 0 开始，所以以上列表调整为 M  M+1  M+2  …  N-2  N-1  0  1  …  M-3  M-2
- 即得到以下对应关系

```
M    M+1  M+2   …   N-2     N-1     0     1       …   M-3   M-2
0    1    2     …   N-(M+2) N-(M+1) N-M   N-(M-1) …   N-3   N-2
```

假设上一行的数为 x，下一行的数为 y 则:

```
x = (y + M) % N
y = (x - M + N) % N
```

- 对于 N 个人报数的问题，可以分解为先求解 N - 1 个人报数的子问题；
- 而对于 N - 1 个人报数的子问题，又可分解为先求 (N - 1) - 1 个人报数的子问题
- ...

列出函数：

```
F(1) = 0
F(2) = [F(1) + M] % N = [F(1) + M] % 2
F(3) = [F(2) + M] % N = [F(2) + M] % 3
```

即：

```
F(1) = 0
F(N) = [F(N - 1) + M] % N      (N>1)
```

## 其他用途

- 任务调度：操作系统的轮转调度

任务调度器使用循环队列来管理任务队列，以便公平地分配处理时间。循环队列确保所有任务都能获得处理时间，并且当任务完成或暂停时，可以循环地分配处理器资源
