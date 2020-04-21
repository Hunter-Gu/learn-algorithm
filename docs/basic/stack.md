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

### 动态扩容的顺序栈

如果要实现一个支持动态扩容的栈，我们只需要底层依赖一个支持动态扩容的数组就可以了。这里需要注意的是：

- 出栈：不会涉及内存的重新申请和数据的搬移，所以时间复杂度仍然是 O(1)
- 入栈：当栈中有空闲空间时，入栈操作的时间复杂度为 O(1)；但当空间不够时，就需要重新申请内存和数据搬移，所以时间复杂度就变成了 O(n)，即：
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

为什么函数调用要用“栈”来保存临时变量呢？

不一定非要用栈来保存临时变量，但是函数调用符合后进先出的特性，用栈这种数据结构来实现，是最顺理成章的选择。

另外，从调用函数进入被调用函数，对于数据来说，变化的是什么呢？

是作用域。所以根本上，只要能保证每进入一个新的函数，都是一个新的作用域就可以。而要实现这个，用栈就非常方便。在进入被调用函数的时候，分配一段栈空间给这个函数的变量，在函数结束的时候，将栈顶复位，正好回到调用函数的作用域内。

### 表达式求值

编译器利用栈来实现表达式求值，是栈的另一个常见的应用场景。

以只包含加减乘除四则运算为例，比如：3+5*8-6

通过两个栈即可实现：

- 保存操作数的栈
- 保存运算符的栈

![表达式求值](@imgs/bc77c8d33375750f1700eb7778551600.jpg)

从左向右遍历表达式：

- 当遇到数字，直接入栈
- 当遇到运算符，与运算符栈的栈顶元素进行比较
  - 优先级比运算符栈顶元素高，当前运算符压入栈
  - 优先级比运算符栈顶元素低或者相同，从运算符栈中取栈顶运算符，从操作数栈的栈顶取 2 个操作数
  - 进行计算，再把计算完的结果压入操作数栈，继续比较

```ts
function calc(exp: string) {
  const PRIORITY  = ['+', '-'];
  const numbers = new ArrayStack<number>(100);
  const operators = new ArrayStack<string>(100);

  for (let i = 0; i < exp.length; i++) {
    const s = exp[i];
    if (typeof Number(s) === 'number') {
      numbers.push(Number(s));
    } else {
      const top = operators.pop();

      if (PRIORITY.indexOf(top) !== -1 && PRIORITY.indexOf(s) === -1) {
        operators.push(top);
        operators.push(s);
      } else {
        const left = numbers.pop();
        const right = numbers.pop();
        const res = left + s + right;
        numbers.push(res + top + numbers.pop());
      }

      // if ((PRIORITY.indexOf(top) === -1 && PRIORITY.indexOf(s) === -1)
      //   || (PRIORITY.indexOf(top) !== -1 && PRIORITY.indexOf(s) !== -1))
      // {
      //   // 优先级相同，直接计算
      //   const left = numbers.pop();
      //   const right = numbers.pop();
      //   const res = left + s + right;
      //   numbers.push(res + top + numbers.pop());
      // // } else if (PRIORITY.indexOf(top) === -1 && PRIORITY.indexOf(s) !== -1) {
      //   // 顶部优先级高

      // } else if (PRIORITY.indexOf(top) !== -1 && PRIORITY.indexOf(s) === -1) {
      //   operators.push(top);
      //   operators.push(s);
      // }
    }
  }
}
```

### 括号匹配

用栈来保存未匹配的左括号，从左到右依次扫描字符串。

- 当扫描到左括号时，则将其压入栈中；
- 当扫描到右括号时，从栈顶取出一个左括号。如果能够匹配，继续扫描剩下的字符串。

### 浏览器前进后退

浏览器的前进后退也是栈的典型应用，通过两个栈即可实现：

- 顺序查看页面时，只需要依次入栈
- 点击后退按钮，则只需要出栈，并将该页面压入另一个栈

## 题目

Leetcode: 20,155,232,844,224,682,496

## 问题

我们都知道，JVM 内存管理中有个“堆栈”的概念。栈内存用来存储局部变量和方法调用，堆内存用来存储 Java 中的对象。那 JVM 里面的“栈”跟我们这里说的“栈”是不是一回事呢？如果不是，那它为什么又叫作“栈”呢？
