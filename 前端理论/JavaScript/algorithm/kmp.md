## KMP算法

KMP算法主要用于模式或者字符串匹配的，对于暴力破解方法来说，会将模式串和目标串逐个字符进行匹配，当遇到了不匹配的字符的时候，需要将目标串的下标后移一位，然后从模式串的开头继续进行匹配。

```
ABCDAB ABD ABCDABD		// 目标串
ABCDABD					// 模式串
// 暴力破解，当匹配到最后一个字符的时候，发生了不匹配的结果，那么将目标串的下标后移一位
ABCDAB ABD ABCDABD
 ABCDABD
// 第一个字符就不匹配，继续后移
ABCDAB ABD ABCDABD
  ABCDABD
ABCDAB ABD ABCDABD
   ABCDABD
ABCDAB ABD ABCDABD
    ABCDABD
// ...这样直到最后，发现了一个匹配结果
ABCDAB ABD ABCDABD
           ABCDABD
```

这样的方法在最坏情况下，需要遍历整个目标串，假设目标串的长度为n，并且在目标串的每个字符匹配的时候，都需要遍历整个模式串，假设模式串的长度为m，那么，暴力破解的最坏时间复杂度为`O(nm)`。这样的复杂度是不能够接受的。

### KMP

KMP算法的思想是，在匹配失败的时候，可以跳过某些失败的字符，这样可以节省很多的时间，利用已经进行过的匹配操作来实现匹配的优化。

前缀：对于一个字符串`chinese`来说，其前缀可能有`c`,`ch`,`chi`,`chine`等等。

而对于字符串`str is a string`来说，其前缀`s`和`str`在字符串的后面都出现过，以此来构建一个跳转表。

跳转表和字符串的每一个字符是一一对应的：

```
 str is a string
-100000100012000
```

第一个字符在跳转表中默认值为-1，如果模式串的某个子串是模式串的前缀，那么这个子串对应的跳转表的值为`0123...`依次类推。

跳转表的作用在于，当一次匹配失败之后，重新匹配将会从跳转表中第一个大于0的位置开始，如果跳转表中没有这样一个位置，那么就会从模式串的头部开始匹配。

比如：

我们有一个这样的字符串：

```
This str is str is a string

// 初始匹配 第一个字符不相同，后移
This str is str is a string
str is a string

// 第二个字符、第三个字符也都不相同，后移
This str is str is a string
 str is a string
 
// 第四个字符和模式串前缀相同，但是检测了下一个字符发现，下一个字符和模式串第二个字符不同，后移
This str is str is a string
   str is a string
   
// 这时，前6个字符匹配，并且is中间的s是跳转表中的一个字符
This str is str is a string
     str is a string
     
// 由于这里匹配了总共7个字符，并且这些字符在跳转表中的值都为0或者-1，所以字符串会向后滑动7位
This str is str is a string
            str is a string
// 匹配结束

// 如果对于目标字符串进行一些修改，这样匹配到str的时候，i发生不匹配，但是i前面的字符在跳转表中值为2，那么字符串会滑动8位，然后直接从第三位开始比较
This str is a str is a string
     str is a string

// 这里会直接从str后面的空格处开始比较
This str is a str is a string
              str is a string
     
```

由于匹配时候的多次滑动，以及符合跳转表要求的匹配情况的出现，会节省很多次比较。

### 代码实现

这里用JavaScript实现：

```javascript
function getNextTable(str) {
  const nextTable = [];
  let i = 1;
  let j = 0;
  nextTable[0] = 0;
  while(i < str.length) {
    if (str[i] === str[j]) {
      j++;
      nextTable[i] = j;
      i++;
    } else {
      j = 0;
      nextTable[i] = j;
      i++;
    }
  }
  return nextTable;
}

function KMPString(target, pattern) {
  const nextTable = getNextTable(pattern);
  let i = 0;
  let j = 0;
  while(i < target.length) {
    while(target[i + j] === pattern[j] && j < pattern.length) {
      j++;
    }
    if (j === pattern.length) {
      return true;
    }
    if (j !== 0) {
      i = i + ( j - nextTable[j - 1] );
      j = nextTable[j - 1];
    } else {
      i++;
      j = 0;
    }
  }
  return false;
}

const target = 'BBC ABCDAB ABCDABDABE';
const pattern = 'ABCDABD';

console.log(KMPString(target, pattern));
```

