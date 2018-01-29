function package(weight, value, volume) {
  const thLength = weight.length;
  const v = [];
  for (let i = 0; i < thLength + 1; i++) {
    v[i] = Array(volume + 1).fill(0);
    v[i][0] = 0;
  }
  for (let i = 1; i < thLength + 1; i++) {
    for (let j = 1; j < volume + 1; j++) {
      if (j - weight[i - 1] >= 0 && v[i - 1][j - weight[i - 1]] + value[i - 1] > v[i-1][j]) {
        v[i][j] = v[i - 1][j - weight[i - 1]] + value[i - 1];
      } else {
        v[i][j] = v[i - 1][j];
      }
    }
  }
  return v[thLength+1][volume+1];
}

console.log(package([2,2,6,5,4], [6,3,5,4,6], 10));