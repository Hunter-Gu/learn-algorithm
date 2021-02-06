# 队列

**先进先出**是典型的队列。

和栈相似，队列主要有两个操作：

- 入队 enqueue：将一个数据放到队列尾部
- 出队 dequeue：从队列头部取一个元素

常见的队列有：

- [循环队列](#循环队列)
- [阻塞队列](#阻塞队列-生产者-消费者)
- [并发队列](#并发队列-线程安全)

## 如何实现

需要头指针和尾指针。

### 顺序队列 - 数组实现

```ts
interface Queue<T> {
  enqueue(value: T): boolean;
  dequeue(): T;
}

class ArrayQueue<T> implements Queue<T> {

  private _size = 0;
  private _count = 0;
  private items = [];
  private head = 0;
  private tail = 0;

  get size() {
    return this._size;
  }

  get count() {
    return this._count;
  }

  constructor(size: number) {
    this._size = size;
  }

  enqueue(value: T) {
    // 队满
    if (this.tail === this._size)
      return false
    this.items[this.tail] = value;
    this._count++;
    this.tail++
  }

  dequeue() {
    // 队空
    if (this.head === this.tail)
      return null;
    const tmp = this.items[this.head];
    this.head++;
    return tmp;
  }
}
```

#### 数据搬移

举个例子，当 a、b、c、d 依次入队之后，队列中的 head 指针指向下标为 0 的位置，tail 指针指向下标为 4 的位置：

![初始队列](@imgs/5c0ec42eb797e8a7d48c9dbe89dc93cb.jpg)

执行次出队操作之后，队列中 head 指针指向下标为 2 的位置，tail 指针仍然指向下标为 4 的位置：

![两次出队后](@imgs/dea27f2c505dd8d0b6b86e262d03430d.jpg)

随着不停地进行入队、出队操作，head 和 tail 都会持续往后移动。

当 tail 移动到最右边，即使数组中还有空闲空间，也无法继续往队列中添加数据了。这个问题该如何解决呢？

- 如果每次出队都删除数组下标为 0 的数据，此时需要搬移整个队列中的数据，这样出队操作的时间复杂度就会从原来的 O(1) 变为 O(n)
- 实际上，出队时可以先不搬移数据，等到没有空闲空间了，再在入队时，集中触发一次数据的搬移操作

```ts
class ArrayQueue<T> implements Queue<T> {

  //...

  enqueue(value: T) {
    // 队满
    if (this.tail === this._size) {
      if (this.head === 0) {
        // 没有空位
        return false;
      } else {
        this.move();
      }
    }
    this.items[this.tail] = value;
    this._count++;
    this.tail++
  }

  // 数据搬移
  private move() {
    for (let i = this.head; i < this.tail; i++) {
      this.items[i - this.head] = this.items[i]
    }
    this.head = 0;
    this.tail -= this.head;
    this._count -= this.head;
  }
}
```

**那么如何判断数组实现的队列的队空和队满状态？**

- 队空：`head == tail`
- 队满：`tail == n`

### 链式队列 - 链表实现

```ts
class LinkedListNode<T> {
  data: T = null;
  next: LinkedListNode<T> = null;

  constructor(value: T, next: LinkedListNode<T> = null) {
    this.data = value;
    this.next = next;
  }
}

class LinkedListQueue implements Queue<T> {

  private _size = 0;
  private tail = new LinkedListNode(null);
  private head = new LinkedListNode(null);
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

  enqueue(value: T) {
    // 队满
    if (this.count === this.size)
      return false;

    this.tail.next = new LinkedListNode(value);
    this._count++;
  }

  dequeue() {
    if (this.head.next === this.tail)
      return null;
    const tmp = this.head.next;
    this.head.next = tmp.next;
    this._count--;
    return tmp;
  }
}
```

### 循环队列 - 避免数据搬移

用数组来实现队列的时候，在 `tail == n` 时，会有数据搬移操作，这样入队操作性能就会受到影响。

循环队列，就是把首尾相连，扳成了一个环：

![循环队列](@imgs/58ba37bb4102b87d66dffe7148b0f990.jpg)

图中这个队列的大小为 8，当前 `head = 4`，`tail = 7`。

- 当有一个新的元素 a 入队时，放入下标为 7 的位置
- 此时并不把 tail 更新为 8，而是将其在环中后移一位，到下标为 0 的位置
- 当再有一个元素 b 入队时，将 b 放入下标为 0 的位置，然后 tail 更新为 1

所以，在 a，b 依次入队之后，循环队列中的元素就变成了下面的样子：

![循环队列](@imgs/71a41effb54ccea9dd463bde1b6abe80.jpg)

**如何判断循环队列的队空和队满状态？**

- 队空：`head == tail`
- 队满：`(tail + 1) % size == head`

队满的判断条件稍微有点复杂：

![队满](@imgs/3d81a44f8c42b3ceee55605f9aeedcec.jpg)

图中就是队满情况：`tail = 3`，`head = 4`，`size = 8`。多画几张图，你就会发现，当队满时，`(tail + 1) % size == head`。

```ts
class CircleQueue<T> extends ArrayQueue<T> {

  enqueue(value: T) {
    // 队满
    if ((this.tail + 1) % this.size === this.head) {
      return false;
    }
    this.items[this.tail] = value;
    this._count++;
    this.tail++;
  }
}
```

### 阻塞队列 -> 生产者 - 消费者

在队列基础上增加**阻塞操作**：

- 队空时，出队操作（获取数据）会被阻塞（因为此时还没有数据可取，直到队列中有了数据才会返回）
- 队满时，入队操作（插入数据）会被阻塞（因为此时队满，直到队列中有空闲位置后才会再插入数据）

![阻塞队列](@imgs/5ef3326181907dea0964f612890185eb.jpg)

上述的定义就是一个“生产者 - 消费者模型”！使用阻塞队列，轻松实现一个“生产者 - 消费者模型”！

#### 协调生产和消费速度

基于阻塞队列实现的“生产者 - 消费者模型”，可以有效地**协调生产和消费的速度**。

当“生产者”生产数据的速度过快，“消费者”来不及消费时，存储数据的队列很快就会满了。这个时候，生产者就阻塞等待，直到“消费者”消费了数据，“生产者”才会被唤醒继续“生产”。

#### 协调生产者和消费者数量，提高数据处理效率

基于阻塞队列，我们还可以通过**协调“生产者”和“消费者”的个数，来提高数据的处理效率**。比如前面的例子，我们可以多配置几个“消费者”，来应对一个“生产者”。

![阻塞队列](@imgs/9f539cc0f1edc20e7fa6559193898067.jpg)

### 并发队列 - 线程安全

在多线程情况下，会有多个线程同时操作队列，这个时候就会存在线程安全问题，那如何实现一个线程安全的队列呢？

线程安全的队列我们叫作并发队列。

#### 线程锁

最简单直接的实现方式是直接在 enqueue()、dequeue() 方法上加锁，但是锁粒度大并发度会比较低，同一时刻仅允许一个存或者取操作。

#### CAS 原子操作

实际上，基于数组的循环队列，利用 CAS 原子操作，可以实现非常高效的并发队列。这也是循环队列比链式队列应用更加广泛的原因。

## 应用

### 线程池等有限资源池

CPU 资源是有限的，任务的处理速度与线程个数并不是线性正相关。相反，过多的线程反而会导致 CPU 频繁切换，处理性能下降。所以，线程池的大小一般都是综合考虑要处理任务的特点和硬件环境，来事先设置的。

当向固定大小的线程池中请求一个线程时，如果线程池中没有空闲的线程资源了，这个时候线程池如何处理这个请求？是拒绝请求还是排队请求？各种处理策略又是怎么实现的呢？

一般有两种处理策略：

- **非阻塞**的处理方式，直接拒绝任务请求
- **阻塞**的处理方式，将请求排队，等到有空闲线程时，取出排队的请求继续处理

那如何存储排队的请求呢？

为了公平地处理每个排队的请求，先进者先服务，所以**队列很适合用来存储排队请求**。

队列有基于链表和基于数组这两种实现方式。这两种实现方式对于排队请求又有什么区别呢？

#### 基于链表的实现

- **可以实现一个支持无限排队的无界队列（unbounded queue），但是可能会导致过多的请求排队等待，请求处理的响应时间过长**
- **所以不合适对响应时间比较敏感的系统**

#### 基于数组的实现

- **可以实现有界队列（bounded queue），队列的大小有限，所以线程池中排队的请求超过队列大小时，接下来的请求就会被拒绝**
- **适用于对响应时间敏感的系统来说**

但是设置一个合理的队列大小，也是非常有讲究的：

- 队列太大导致等待的请求太多
- 队列太小会导致无法充分利用系统资源、发挥最大性能

总的来说，**队列可以在任何有限资源池中，用于排队请求**，比如数据库连接池等。

## 思考

- 除了线程池这种池结构会用到队列排队请求，还有哪些类似的池结构或者场景中会用到队列的排队请求呢？
  - 分布式消息队列，如 kafka 也是一种队列

- 如何实现无锁并发队列？
  - 考虑使用 CAS 实现无锁队列，在入队前获取 tail 位置，入队时比较 tail 是否发生变化
  - 如果否则允许入队；反之本次入队失败
  - 出队则是获取 head 位置，进行 cas
