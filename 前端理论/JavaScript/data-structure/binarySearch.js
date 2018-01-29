function binarySearch (arr, sourceArr) {
  let middle = Math.floor(arr.length / 2);
  if (arr.length === 1) {
    return false;
  }
  if (sourceArr[middle - 1] > sourceArr[middle] && sourceArr[middle + 1] > sourceArr[middle]) {
    return middle;
  }
  let last = arr.length - 1;
  let start = 0;
  if (arr[middle] > arr[0] && arr[middle] < arr[last]) {
    last = middle;
    return binarySearch(arr.slice(start, last), arr);
  } else if (arr[middle] < arr[0] && arr[middle] > arr[last]) {
    start = middle;
    return binarySearch(arr.slice(start, last), arr);
  } else {
    return binarySearch(arr.slice(start, middle), arr) || binarySearch(arr.slice(middle, last), arr);
  }
}

console.log(binarySearch([4,3,7,9,8,6,2,1], [4,3,7,9,8,6,2,1]))