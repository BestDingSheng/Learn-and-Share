function LCString(str1, str2) {
  var arr1 = str1.split('');
  var arr2 = str2.split('');
  var c = [];
  for (let i = 0; i < arr1.length + 1; i++) {
    c[i] = [];
    for (let j = 0; j < arr2.length + 1; j++) {
      c[i][j] = {
        max: 0,
        str: ''
      }
    }
  }
  for (let i = 1; i <= arr1.length; i++) {
    for (let j = 1; j <= arr2.length; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        c[i][j].max = c[i-1][j-1].max + 1;
        c[i][j].str = c[i-1][j-1].str + arr1[i - 1];
      } else {
        if (c[i-1][j].max > c[i][j-1].max) {
          c[i][j].max = c[i-1][j].max;
          c[i][j].str = c[i-1][j].str;
        } else {
          c[i][j].max = c[i][j-1].max;
          c[i][j].str = c[i][j-1].str;          
        }
      }
    }
  }
  return c;
}

console.log(LCString('ABCBDAB', 'BDCABA'));