export class Example {
  static sort(a: Comparable[]): void {
    // 排序算法
  }

  private static less(v: Comparable, w: Comparable): boolean {
    // 对元素进行比较
    return less(v, w);
  }

  private static exch(a: Comparable[], i: number, j: number): void {
    // 将元素交换位置
    exch(a, i, j);
  }

  private static show(a: Comparable[]): void {
    // 打印数组
    console.log(a.toString());
  }

  static isSorted(a: Comparable[]): boolean {
    // 测试数组是否有序
    for (let i = 1; i < a.length; i++)
      if (this.less(a[i], a[i - 1]))
        return false;
    return true;
  }

  static main(): void {
    // 从 stdin 读取字符，排序后输出
    const arr = [];
    this.sort(arr);
    this.isSorted(arr);
    this.show(arr);
  }
}

class Comparable<T = unknown> {

  private _data: T;

  public get data(): T {
    return this._data;
  }

  constructor(data: T) {
    this._data = data;
  }

  // 比较数据，返回 -1 0 1
  // 对于无法比较或有一个为 null 的情况，抛出异常
  compareTo(data: Comparable<T>): number {
    if (this.data > data.data) {
      return 1;
    } else if (this.data < data.data) {
      return -1;
    } else if (this.data === data.data) {
      return 0;
    }

    throw new Error("UnComparable!");
  }
}

export function exch(a: Array<Comparable | number>, i: number, j: number): void {
  const temp: Comparable = new Comparable(a[i]);
  a[i] = a[j];
  a[j] = temp;
}

export function less(v: Comparable | number, w: Comparable | number): boolean {
  v = new Comparable(v);
  w = new Comparable(w);
  return v.compareTo(w) < 0;
}
