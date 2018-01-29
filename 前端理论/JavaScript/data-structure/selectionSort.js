function selectionSort (arr) {
  let maxIndex;
  for (let i = 0; i < arr.length; i++) {
    maxIndex = 0;
    for (let j = 0; j < arr.length - i; j++) {
      if (arr[j] > arr[maxIndex]) {
        maxIndex = j;
      }
    }
    if (maxIndex !== arr.length - i - 1) {
      let temp = arr[maxIndex];
      arr[maxIndex] = arr[arr.length - i - 1];
      arr[arr.length - i - 1] = temp;
    }
  }
  return arr;
}

console.log(selectionSort([5,4,2,1,0,8,10,5,20]));