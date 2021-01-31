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
