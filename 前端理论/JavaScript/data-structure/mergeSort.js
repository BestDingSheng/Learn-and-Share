function mergeSort (arr) {
  if (arr.length === 1 || arr.length === 0) {
    return arr;
  }
  const middle = Math.floor(arr.length / 2);
  const left = arr.slice(0, middle);
  const right = arr.slice(middle, arr.length);
  return merge(mergeSort(left), mergeSort(right));
}

function merge (left, right) {
  const result = [];
  let li = 0;
  let ri = 0;
  while (li < left.length && ri < right.length) {
    if (left[li] < right[ri]) {
      result.push(left[li++]);
    } else {
      result.push(right[ri++]);
    }
  }
  while (li < left.length) {
    result.push(left[li++]);
  }
  while (ri < right.length) {
    result.push(right[ri++]);
  }
  return result;
}

console.log(mergeSort([5,4,2,1,0,8,10,5,20]))