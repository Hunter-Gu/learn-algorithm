import { exch, less } from './example';

function selectionSort(arr: number[]) {
  for (let i = 0; i < arr.length; i++) {
    let minIndex = i
    for (let j = i; j < arr.length; j++) {
      if (less(arr[j], arr[minIndex]))
        minIndex = j
    }

    exch(arr, i, minIndex);
  }
}
