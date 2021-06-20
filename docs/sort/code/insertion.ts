import {exch, less} from './example';

function insertionSort(arr: number[]) {
  // 遍历未排区间
  for (let i = 1; i < arr.length; i++) {
		// 反向遍历已排区间
		// 将 a[i] 插入到 a[i-1]、a[i-2]、a[i-3]...之中
    for (let j = i; j > 0 && less(arr[j], arr[j - 1]); j--) {
      exch(arr, j, j - 1);
    }
  }
}
