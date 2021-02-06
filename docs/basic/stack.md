# 栈

**先进后出**是典型的栈结构。

栈**只允许在一端插入和删除数据**，所以栈是一种*操作受限的线性表*。

栈主要有两个操作：

- 入栈 push：在栈顶插入数据，空间复杂度为 O(1)，时间复杂度为 O(1)
- 出栈 pop：在栈顶删除数据，空间复杂度为 O(1)，时间复杂度为 O(1)

## 如何实现

数组和链表都可以实现栈：

- 顺序栈：用数组实现
- 链式栈：用链表实现

### 顺序栈

```ts
interface Stack<T> {
  push(value: T): boolean;
  pop(): T;
}

class ArrayStack<T> implements Stack<T> {
  private _size: number;
  private items = [];
  private _count = 0;

  get size() {
    return this._size;
  }

  get count() {
    return this._count;
  }

  constructor(size: number) {
    this._size = size;
  }

  push(value: T) {
    if (this.count === this.size)
      return false;

    this.items[this.count] = value;
    this._count += 1;
    return true;
  }

  pop() {
    if (this.count === 0)
      return null
    const tmp = this.items.pop();
    this._count -= 1;
    return tmp;
  }
}
```

### 链式栈

``` ts
class LinkedListNode {
  data = null;
  next = null;

  constructor(data, next) {
    this.data = data;
    this.next = next;
  }
}

class LinkedListStack<T> implements Stack<T> {
  private _size: number;
  private head = new LinkedListNode();
  private _count = 0;

  constructor(size: number) {
    this._size = size;
  }

  push(value: T) {
    if (this.count === this.size)
      return false;

    this.head = new LinkedListNode(value, this.head.next);
    this._count += 1;
    return true;
  }

  pop() {
    if (this.count === 0)
      return null;
    const tmp = this.head;
    this.head = this.head.next;
    this._count -= 1;
    return tmp;
  }
}
```

## 动态扩容的顺序栈

如果要实现一个支持动态扩容的栈，只需要底层依赖一个支持动态扩容的数组就可以了。这里需要注意的是：

- 出栈：不会涉及内存的重新申请和数据的搬移，所以时间复杂度仍然是 O(1)
- 入栈：
  1. 当栈中有空闲空间时，入栈操作的时间复杂度为 O(1)；
  2. 但当空间不够时，就需要重新申请内存和数据搬移，所以时间复杂度就变成了 O(n)，即：
- 最好情况时间复杂度是 O(1)
- 最坏情况时间复杂度是 O(n)
- 平均情况下的时间复：使用均摊分析得 O(1)

## 应用

### 函数调用栈

操作系统给每个线程分配了一块独立的内存空间，这块内存被组织成“栈”这种结构, 用来存储函数调用时的临时变量。

每进入一个函数，就会将临时变量作为一个栈帧入栈，当被调用函数执行完成，返回之后，将这个函数对应的栈帧出栈。

![函数调用栈](@imgs/17b6c6711e8d60b61d65fb0df5559a1c.jpg)

```ts
function main() {
  const a = 1;
  let ret = 0;
  let res = 0;
  ret = add(3, 5)
  res = a + ret;
  return 0;
}

function add(x: number, y: number) {
  let sum = 0;
  sum = x + y;
  return sum;
}
```

**为什么函数调用要用“栈”来保存临时变量呢？**

不一定非要用栈来保存临时变量，但是函数调用符合后进先出的特性，用栈这种数据结构来实现，是最顺理成章的选择。

**从调用函数进入被调用函数，对于数据来说，变化的是什么呢？**

是作用域。

所以根本上，只要能保证每进入一个新的函数，都是一个新的作用域就可以。而要实现这个，用栈就非常方便。在进入被调用函数的时候，分配一段栈空间给这个函数的变量，在函数结束的时候，将栈顶复位，正好回到调用函数的作用域内。

### 求逆波兰表达式

- 两个栈 S1, S2
  - S1 放运算符，高优先级在上（最底下优先级最低）
  - S2 放操作数
- 从左开始
  - '(' 直接放入 S1
  - ')' 依次取出所有到 '(' 间的运算符，放入 S2
  - 操作符优先级高于 S1 栈顶操作符，直接放入；否则依次取出，直到优先级高于操作符
- S2 逆序处理，S1 顺序处理

![](@imgs/20200809004428479ry131nrkn12.png)

### 逆波兰表达式求值 括号匹配 leetcode-150

![逆波兰表达式](@imgs/0d37e629733b94611e6412fb24c1a032d7230d86d9c2ae80d8d2aebb3e3f18c3-image.png)

```ts
function evalRPN(tokens: string[]): number {
    const OPERATIONS = {
        '+': (a: string, b: string) => Number(a) + Number(b),
        '-': (a: string, b: string) => Number(a) - Number(b),
        '*': (a: string, b: string) => Number(a) * Number(b),
        '/': (a: string, b: string) => Number(b) ? parseInt(Number(a) / Number(b) + '') : 0,
    }
    const isOperator = (s: string) => s in OPERATIONS
    const stack = []
    let value = ''

    while (value = tokens.shift()) {
        if (isOperator(value)) {
            const a = stack.pop()
            const b = stack.pop()
            // 注意位置，因为栈是先进后出，所以应该 b 在前
            stack.push(OPERATIONS[value](b, a))
        } else {
            stack.push(value)
        }
    }

    return stack[0]
};
```

### 表达式求值

- 先求逆波兰表达式
- 再对逆波兰表达式求值

### 括号匹配 leetcode-20

用栈来保存未匹配的左括号，从左到右依次扫描字符串。

- 当扫描到左括号时，则将其压入栈中；
- 当扫描到右括号时，从栈顶取出一个左括号。如果能够匹配，继续扫描剩下的字符串。

```ts
function isValid(s: string): boolean {
    const RIGHT_PAIRS = {
        ')': '(',
        ']': '[',
        '}': '{'
    }
    const stack = []
    let value = ''

    while (value = s.slice(0, 1)) {
        s = s.slice(1)

        if (value in RIGHT_PAIRS) {
            const top = stack.slice(-1)[0]
            if (top === RIGHT_PAIRS[value]) {
                stack.pop()
            } else {
                stack.push(value)
            }
        } else {
            stack.push(value)
        }
    }

    return !stack.length
};
```

### 浏览器前进后退

浏览器的前进后退也是栈的典型应用，通过两个栈即可实现：

- 顺序查看页面时，只需要依次入栈
- 点击后退按钮，则只需要出栈，并将该页面压入另一个栈

## 问题

### Leetcode: 20, 155, 232, 844, 224, 682, 496

### 内存中的堆栈？

内存中的堆栈和数据结构堆栈不是一个概念，内存中的堆栈是真实存在的物理区，数据结构中的堆栈是抽象的数据存储结构。

内存空间在逻辑上分为三部分：

- 代码区：存储方法体的二进制代码。高级调度（作业调度）、中级调度（内存调度）、低级调度（进程调度）控制代码区执行代码的切换
- 静态数据区：存储全局变量、静态变量、常量，常量包括final修饰的常量和String常量。系统自动分配和回收
- 动态数据区
  - 栈区：存储运行方法的形参、局部变量、返回值。由系统自动分配和回收
  - 堆区：new 一个对象的引用或地址存储在栈区，指向该对象存储在堆区中的真实数据
