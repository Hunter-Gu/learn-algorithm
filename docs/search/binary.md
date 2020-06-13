# 二分查找

## 二分思想

二分查找是一种非常简单易懂的快速查找算法。

二分查找**针对的是一个有序的数据集合**，查找思想有点类似分治思想。每次都通过跟区间的中间元素对比，将待查找的区间缩小为之前的一半，直到找到要查找的元素，或者区间被缩小为 0。

## 时间复杂度

我们假设数据量大小是 n，每次查找后数据都会缩小为原来的一半，也就是会除以 2。最坏情况下，直到查找区间被缩小为空，才停止：

```
被查找区间的大小变化：

n, n/2, n/4, n/8, ..., n / 2^k, ...
```

这是一个等比数列，当 n / 2^k = 1 时，k = log2(n) 就是总共缩小的次数。并且每一次缩小操作只涉及两个数据的大小比较，所以经过 k 次区间缩小，时间复杂度就是 O(k)，即 O(logn)。

O(logn) 是非常惊人的查找速度，即使 n 非常大，对应的 logn 也很小。有的时候 O(logn) 甚至比时间复杂度是常量级 O(1) 的算法还要高效！

用大 O 标记法表示时间复杂度的时候，会省略掉常数、系数和低阶。对于常量级时间复杂度的算法来说，O(1) 有可能表示的是一个非常大的常量值，比如 O(1000)、O(10000)。所以，常量级时间复杂度的算法有时候可能还没有 O(logn) 的算法执行效率高。

## 二分查找的实现

### 递归

```ts
function binarySearch<T>(arr: T[], target: T) {
  const binarySearchInternal = (
    arr: T[],
    target: T,
    start: number,
    end: number
  ): number | null => {
    const middle = Math.floor((end - start) / 2) + start;

    if (start === end) {
      return arr[middle] !== target ? -1 : middle;
    }

    if (arr[middle] === target) {
      return middle;
    } else if (arr[middle] > target) {
      return binarySearchInternal(arr, target, start, middle - 1);
    } else {
      return binarySearchInternal(arr, target, middle + 1, end);
    }
  };

  return binarySearchInternal(arr, target, 0, arr.length - 1);
}
```

### 非递归

```ts
function binarySearch<T>(arr: T[], target: T) {
  let lowIdx = 0,
    highIdx = arr.length - 1;

  while (highIdx >= lowIdx) {
    const middle = Math.floor((highIdx - lowIdx) / 2) + lowIdx;
    if (target === arr[middle]) {
      return middle;
    } else if (target > arr[middle]) {
      lowIdx = middle + 1;
    } else {
      highIdx = middle - 1;
    }
  }
  return -1;
}
```

## 局限性

并不是什么情况下都可以用二分查找，它的应用场景是有很大局限性的。

### 顺序表结构

二分查找**依赖的是顺序表结构，简单点说就是数组**。

那二分查找能否依赖其他数据结构呢？比如链表？

答案是不可以的，主要原因是二分查找算法需要按照下标随机访问元素：

- 数组按照下标随机访问数据的时间复杂度是 O(1)
- 链表随机访问的时间复杂度是 O(n)

所以，如果数据使用链表存储，二分查找的时间复杂就会变得很高。

### 有序数据

二分查找**针对的是有序数据**。如果数据没有序，我们需要先排序。排序的时间复杂度最低是 O(nlogn)。

#### 静态数据

如果我们针对的是一组静态的数据，没有频繁地插入、删除，我们可以进行一次排序，多次二分查找。这样排序的成本可被均摊，二分查找的边际成本就会比较低。

#### 动态数据

但是，如果我们的数据集合有频繁的插入和删除操作，要想用二分查找，要么每次插入、删除操作之后保证数据仍然有序，要么在每次二分查找之前都先进行排序。针对这种动态数据集合，无论哪种方法，维护有序的成本都是很高的。

所以，二分查找只**适用于在插入、删除操作不频繁，一次排序多次查找的场景中；不适用动态变化的数据集合**。

### 不适用于数据量太小的情况

如果要处理的数据量很小，完全没有必要用二分查找，顺序遍历就足够了。

比如我们在一个大小为 10 的数组中查找一个元素，不管用二分查找还是顺序遍历，查找速度都差不多。只有数据量比较大的时候，二分查找的优势才会比较明显。

有一个例外。如果数据之间的比较操作非常耗时，不管数据量大小，都推荐使用二分查找。

这么做是为了**尽可能减少比较的次数**。比如，数组中存储的都是长度超过 300 的字符串，如此长的两个字符串之间比对大小，就会非常耗时。我们需要尽可能地减少比较次数，而比较次数的减少会大大提高性能，这个时候二分查找就比顺序遍历更有优势。

### 不适用于数据量太大的情况

数据量太大也不适合二分查找。

二分查找的底层需要依赖数组这种数据结构，而**数组要求内存空间连续，对内存的要求比较苛刻**。

比如，我们有 1GB 大小的数据，如果希望用数组来存储，那就需要 1GB 的连续内存空间。注意这里的“连续”二字，也就是说，即便有 2GB 的内存空间剩余，但是如果这剩余的 2GB 内存空间都是零散的，没有连续的 1GB 大小的内存空间，那照样无法申请一个 1GB 大小的数组。

二分查找是作用在数组这种数据结构之上的，所以太大的数据用数组存储就比较吃力了，也就不能用二分查找了。

## 二分法的变体

### 查找第一个值等于给定值

之前讲的只是二分查找中最简单的一种情况：有序数据集合中不存在重复的数据。

现在这样一个有序数组，其中，`a[5]`, `a[6]`, `a[7]` 的值都等于 8，是重复的数据，现在希望查找第一个等于 8 的数据，也就是下标是 5 的元素。

![存在重复元素](@imgs/503c572dd0f9d734b55f1bd12765c4f8.jpg)

之前的二分查找就无法处理这种情况了。

```ts
function binarySearchForFirst(arr: number[], target: number) {
  let lowIdx = 0;
  let highIdx = arr.length - 1;

  while (lowIdx <= highIdx) {
    let middle = (lowIdx + highIdx) >> 1;

    if (arr[middle] > target)
      highIdx = middle;
    else if (arr[middle] < target)
      lowIdx = middle;
    else if (middle === 0 || arr[middle - 1] !== arr[middle])
      return middle;
    else
      highIdx = middle - 1;
  }

  return -1;
}
```

### 查找最后一个值等于给定值

把问题稍微改一下，查找最后一个值等于给定值的元素，又该如何做呢？

```ts
function binarySearchForLast(arr: number[], target: number) {
  let lowIdx = 0;
  let highIdx = arr.length - 1;

  while (lowIdx <= highIdx) {
    let middle = ~~((lowIdx + highIdx) / 2);

    if (arr[middle] > target)
      highIdx = middle;
    else if (arr[middle] < target)
      lowIdx = middle;
    else if (middle === arr.length || arr[middle + 1] !== arr[middle])
      return middle;
    else
      lowIdx = middle + 1;
  }

  return -1;
}
```

### 查找第一个大于等于给定值

```ts
function binarySearchForFirst(arr: number[], target: number) {
  let lowIdx = 0;
  let highIdx = arr.length - 1;

  while (lowIdx <= highIdx) {
    let middle = ~~((lowIdx + highIdx) / 2);

    if (arr[middle] >= target)
      if (middle === 0 || arr[middle - 1] < value) return middle;
      else highIdx = middle - 1;
    else lowIdx = middle + 1;
  }

  return -1;
}
```

### 查找最后一个小于等于给定值的元素

```ts
function binarySearchForFirst(arr: number[], target: number) {
  let lowIdx = 0;
  let highIdx = arr.length - 1;

  while (lowIdx <= highIdx) {
    let middle = ~~((lowIdx + highIdx) / 2);

    if (arr[middle] <= target)
      if (middle === arr.length - 1 || arr[middle + 1] > target)
        return middle;
      else
        lowIdx = middle + 1;
    else
      highIdx = middle - 1;
  }

  return -1;
}
```

总结：二分查找**适合用在“近似”查找问题**。比如那几种变体的二分查找算法，用其他数据结构，比如散列表、二叉树，就比较难实现了。

## 思考

### 查找某个值

假设我们有 1000 万个整数数据，每个数据占 8 个字节，如何设计数据结构和算法，快速判断某个整数是否出现在这 1000 万数据中？

希望这个功能不要占用太多的内存空间，最多不要超过 100MB，怎么做呢？

分析：每个数据大小是 8 字节，最简单的办法就是将数据存储在数组中，内存占用差不多是 80MB，符合内存的限制 100 MB。

- 先对这 1000 万数据从小到大排序
- 然后再利用二分查找算法，就可以快速地查找想要的数据了

```ts
function quickSort() {}

function binarySearch() {}
```

### 求解平方根

如何实现“求一个数的平方根”？要求精确到小数点后 6 位。

分析：因为要精确到后六位，可以先用二分查找出整数位，然后再二分查找小数第一位，第二位，...，一直到第六位。

- 整数查找很简单，判断当前数小于+1 后大于即可找到
- 小数查找举查找小数后第一位来说，从 x.0 到 (x+1).0，查找终止条件与整数一样，当前数小于，加 0.1 大于
- 后面的位数以此类推，可以用 x \* 10 ^ (-i) 通项来循环或者递归，终止条件是 i > 6

```ts
// TODO
function sqrt(num: number, prec = 0) {
  const calcBit = (base, step = 1) => {
    for (let i = base; i < num; i = i + step) {
      const j = i + step;

      if (j * j > num && i * i <= num) {
        return i - base;
      }
    }
  };

  let acc = 0;
  let coeff = 1;
  for (let i = 0; i < prec + 1; i++) {
    acc += +calcBit(acc, coeff).toFixed(i);
    coeff *= 0.1;
  }

  return acc;
}

console.log('calc result:', sqrt(2, 17));
console.log('Math.sqrt():', Math.sqrt(2));
```

想了一下复杂度，每次二分是 logn，包括整数位会查找 7 次，所以时间复杂度为 7logn。空间复杂度没有开辟新的储存空间，空间复杂度为 1。

### 链表的二分法

如果数据使用链表存储，二分查找的时间复杂就会变得很高，那查找的时间复杂度究竟是多少呢？

假设链表长度为 n，二分查找每次都要找到中间点(计算中忽略奇偶数差异):

- 第一次查找中间点，需要移动指针 n/2 次
- 第二次，需要移动指针 n/4 次
- 第三次需要移动指针 n/8 次
- ......
- 以此类推，一直到 1 次为值

`指针移动总次数(查找次数) = n/2 + n/4 + n/8 + ... + 1`，是一个等比数列，根据等比数列求和公式：`sum = n - 1`.

所以算法时间复杂度是：O(n)，和顺序查找时间复杂度相同

但是在二分查找的时候，由于要进行多余的运算，严格来说，会比顺序查找时间慢。

### IP 查找问题

通过 IP 地址来查找 IP 归属地的功能很常用，这个功能并不复杂，它是通过维护一个很大的 IP 地址库来实现的。地址库中包括 IP 地址范围和归属地的对应关系。

当想要查询 202.102.133.13 这个 IP 地址的归属地时，就在地址库中搜索，发现这个 IP 地址落在 [202.102.133.0, 202.102.133.255] 这个地址范围内，就可以将这个 IP 地址范围对应的归属地“山东东营市”显示给用户了。

```
[202.102.48.0, 202.102.48.255]    江苏宿迁
[202.102.49.15, 202.102.51.251]   江苏泰州
[202.102.56.0, 202.102.56.255]    江苏连云港
[202.102.133.0, 202.102.133.255]  山东东营市
[202.102.135.0, 202.102.136.255]  山东烟台
[202.102.156.34, 202.102.157.255] 山东青岛
```

但是在庞大的地址库中逐一比对 IP 地址所在的区间，是非常耗时的。

假设有 12 万条这样的 IP 区间与归属地的对应关系，如何快速定位出一个 IP 地址的归属地呢？

如果 IP 区间与归属地的对应关系不经常更新，可以先预处理这 12 万条数据，让其按照起始 IP 从小到大排序。如何来排序呢？

IP 地址可以转化为 32 位的整型数，所以可以将起始地址，按照对应的整型值的大小关系，从小到大进行排序，那么这个问题就可以转化为二分查找的变形问题“在有序数组中，查找最后一个小于等于某个给定值的元素”。

当要查询某个 IP 归属地时，先通过二分查找，找到最后一个起始 IP 小于等于这个 IP 的 IP 区间，然后检查这个 IP 是否在这个 IP 区间内：

- 如果在，就取出对应的归属地显示
- 如果不在，就返回未查找到

### 循环有序数组

如果有序数组是一个循环有序数组，比如 4，5，6，1，2，3。针对这种情况，如何实现一个求“值等于给定值”的二分查找算法呢？

```ts
function search(nums: number[], target: number): number {
  let lowIdx = 0,
    highIdx = nums.length - 1;

  while (lowIdx <= highIdx) {
    let middleIdx = ~~((lowIdx + highIdx) / 2);

    if (target === nums[middleIdx])
      return middleIdx;
    if (nums[lowIdx] <= nums[middleIdx]) {
      if (target <= nums[middleIdx] && target >= nums[lowIdx])
        highIdx = middleIdx;
      else
        lowIdx = middleIdx + 1;
    } else {
      if (target >= nums[middleIdx] && target <= nums[highIdx])
        lowIdx = middleIdx;
      else
        highIdx = middleIdx - 1;
    }
  }

  return -1;
}
```

以数组中间点为分区，会将数组分成一个有序数组和一个循环有序数组。

- 如果首元素小于 mid，说明前半部分是有序的，后半部分是循环有序数组
- 如果首元素大于 mid，说明后半部分是有序的，前半部分是循环有序的数组
- 如果目标元素在有序数组范围中，使用二分查找
- 如果目标元素在循环有序数组中，设定数组边界后，使用以上方法继续查找
