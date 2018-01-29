function quickSort (arr) {
  if (arr.length === 1 || arr.length === 0) {
    return arr;
  }
  let flag = arr[0];
  const left = [];
  const right = [];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] >= arr[0]) {
      right.push(arr[i]);
    } else {
      left.push(arr[i]);
    }
  }
  left.push(flag);
  return [].concat(quickSort(left), quickSort(right));
}

console.log(quickSort([5,4,2,1,0,8,10,5,20]));