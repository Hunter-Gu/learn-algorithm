# 链表常见问题

下面是常见的链表操作：

- 单链表反转
- 链表中环的检测
- 两个有序的链表合并
- 删除链表倒数第 n 个结点
- 求链表的中间结点

## 单链表反转

```ts
function reverse<T>(linkedList: LinkedList<T>) {
  let pre: LinkedList<T> | null = null
  let node: LinkedList<T> | null = linkedList
  while (node !== null) {
    const tmp: LinkedList<any> | null = node.next
    node.next = pre
    pre = node
    node = tmp
  }
  return pre
}
```

## 检测链表中的环，并找出环的起点

```ts
function entryNodeOfCircularLinkedList(linkedList: LinkedList<T>) {
  let slow = linkedList
  let fast = linkedList.next

  while (slow && fast) {
    if (slow === fast)  {
      break
    }

    slow = slow?.next
    fast = fast?.next?.next
  }

  // 有环
  if (slow === fast) {
    slow = linkedList
    while (slow !== fast) {
      slow = slow.next
      fast = fast.next
    }
    // 环的起点
    return slow;
  } else {
    // 没有环
    return null
  }
}
```

如何获取环的起点？

![获取环的起点](@imgs/1414022376-5b24f006450c5_articlex.png)

如图，设整个链表长度为 L，环长度为 R，且距离具有方向性，CB 是 C 点到 B 点的距离，BC 是 B点到 C 点的距离，CB != BC。

当证明有环时，fast 和 slow 都顺时针到了 B 点，则此时：

- slow 走的距离：AC + CB
- fast 走的距离：AC + k * R + CB ( k = 0, 1, 2 ...)

由于 fast 每次走 2 个节点，slow 每次走 1 个节点，所以：

```
2 * ( AC + CB ) = AC + k * R + CB
AC + CB = k * R
AC + CB = ( k - 1 ) * R + R
AC = ( k - 1) * R + R - CB
AC = ( k - 1) * R + BC
```

从最终的表达式可以看出来，AC 的距离等于绕环若干圈后再加上 BC 的距离，也就是说：

- slow 从 A 点出发以速度 1 前进
- fast 从 B 点出发以速度 1 前进
- slow 到 C 点时，fast 也必然到 C 点

## 两个链表相交，求交点

![](@imgs/dkjdlfjp042095e.png)
