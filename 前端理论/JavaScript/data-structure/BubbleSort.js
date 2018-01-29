function BubbleSort(arr) {
  if (!arr || !arr.length || arr.length === 1) {
    return arr;
  }
  for (var i = 1; i < arr.length; i++) {
    for (var j = 0; j < arr.length - i; j++) {
      if (arr[j] > arr[j+1]) {
        let temp = arr[j];
        arr[j] = arr[j+1];
        arr[j+1] = temp;
      }
    }
  }
  return arr;
}

console.log(BubbleSort([5,4,2,1,0,8,10,5,20]));