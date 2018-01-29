## JavaScript中的一些数据结构和简单算法

### 数据结构

基本的数据结构在JavaScript中都可以使用，很多数据结构的方法在JavaScript的引擎或者是开发环境中都有使用。

* 栈、队列：在JavaScript数组中就有提供方法，如果要实现严格的栈或者队列，那么需要自己进行一下封装，这个封装基本没有什么难度。
* 字典：ES6中的对象其实就是字典的实现，每个值都是一个键值对[key, value]，通过键来进行获取值。
* 树：DOM树就是树的一个实现，JavaScript对于DOM树的遍历就使用的是BFS进行的。
* 图：这个在JavaScript中并没有太多的实现，主要是两个点之间的关系。
* 链表：每个节点包含一个指向下一个节点的指针或者引用，这样每个节点可以在内存中不连续放置。
* 哈希：通过哈希函数来计算值在数组中的位置，这样的数组称为散列表，也成为哈希表。
* 集合：ES6中的Set就是集合的实现，集合中含有各不相同的元素，Set的实现只能够对值进行判断是否在集合中，并不能进行获取。

#### 优先队列

队列的封装很简单，为一个私有数组添加`shift`和`unshift`方法就可以了。

优先队列是对队列的一个修改，原本的队列是FIFO，在优先队列中，元素的添加和删除是基于每个元素的优先级进行的。

优先队列就类似于医院排队，医院会根据患者的优先级来对患者进行处理。

优先队列的在JavaScript中的实现是在队列的基础上，添加一个优先级，然后根据这个优先级进行入队和出队。

这样的话，实现方式就有两种：

1. 在入队的时候，直接根据优先级进行插入。然后可以正常出队。
2. 在入队的时候正常入队，在出队的时候根据优先级进行出队操作。

这里采用方法1进行实现：

```javascript
var PriorityQueue = function(initQueue) {
  var toString = Object.prototype.toString;
  if (toString.call(initQueue) !== '[object Array]') {
    return false;
  }
  this.items = initQueue;
}

PriorityQueue.prototype.enqueue = function(value, priority) {
  var item = {
    value: value,
    priority: priority
  };
  if (!this.items.length) {
    this.items.push(item);
  } else {
    var getIndex = false;
    var i = 0;
    while(!getIndex && i < this.items.length) {
      if (this.items[i].priority < priority) {
        this.items.splice(i, 0, item);
        getIndex = true;
      }
      i++;
      if (i === this.items.length && !getIndex) {
        this.items.push(item);
        getIndex = true;
      }
    }
  }
}

PriorityQueue.prototype.dequeue = function() {
  return this.items.unshift();
}
```

#### 循环队列

为了防止队列出现假溢出的现象，可以将队列设计为一个首尾相接的圆环，这样的队列称为循环队列。

假溢出：当队列中设计为20个元素，那么进行入队和出队操作之后，由于前面的元素被推出队列，后面添加元素，那么20个元素的位置很快就会见底，但是这个时候，队列的前面却因为元素的推出变成空的了，但是队列却容量不足，这样的现象称为假溢出。而循环队列可以很好的解决这个问题。

这个队列如果需要在JavaScript中使用的话，可以直接使用原生的JavaScript数组，以及数组的`push`和`shift`方法，这两个方法分别向数组的尾部推入一个元素，以及从数组头部推出一个元素，来实现先入先出的操作。JavaScript数组会在推出一个值的时候，将其他的值全部往前移动一位，不会发生假溢出的情况。

#### 链表

在JavaScript中，数组的存储依然是在内存中连续放置的，链表本身就是为了解决数组不易进行在中间插入，以及合理的利用内存碎片空间的。所以在JavaScript中，也可以实现链表。

链表的每个元素由一个存储元素本身的节点和一个指向下一个元素的引用组成。但是链表也有一个缺点，如果需要指定访问链表的某个元素，则需要从头部进行迭代，直到找到需要的那个元素，不像数组可以直接进行访问。

```Javascript
var Node = function(value) {
  this.value = value;
  this.next = null;
}

var LinkList = function() {
  this.head = null;
  this.length = 0;
}

LinkList.prototype.append = function(value) {
  var node = new Node(value);
  if (this.head === null) {
    this.head = node;
  } else {
    var current = this.head;
    while(current.next) {
      current = current.next;
    }
    current.next = node;
  }
  this.length++;
}

LinkList.prototype.insert = function(position, value) {
  var node = new Node(value);
  if (position >= 1 && position <= this.length) {
    var current = this.head;
    var pre;
    for (var i = 0; i < position; i++) {
      pre = current;
      current = current.next;
    }
    pre.next = node;
    node.next = current;
    this.length++;
  } else if (position === 0) {
    node.next = this.head;
    this.head = node;
    this.length++;
  } else {
    return false;
  }
}

LinkList.prototype.removeAt = function(position) {
  if (position >= 1 && position <= this.length) {
    var current = this.head;
    var pre;
    for (var i = 0; i < position; i++) {
      pre = current;
      current = current.next;
    }
    pre.next = current.next;
    this.length--;
    return current.value;
  } else if (position === 0) {
    var current = this.head;
    this.head = this.head.next;
    this.length--;
    return current.value;
  } else {
    return null;
  }
}

var linkList = new LinkList();
linkList.append(1);
linkList.append(2);
linkList.append(3);
linkList.insert(2, 10);
console.log(linkList);
```

链表有很多种类型，包括：

* 为了方便进行回溯，可以使用前后分别带有指向前一个元素的指针和指向后一个元素的指针的*双向链表*。并且在链表的头部和尾部分别有一个头结点和一个尾结点。
* 当需要对链表进行回环操作的时候，可以使用最后一个节点指向第一个节点的*循环链表*，这个链表和循环队列有些类似。此外还有双向链表和循环链表的组合：*双向循环链表*。

#### 集合

集合实际上是一个数学的概念，在数据结构中的结合应用了数学中的有限集合的概念，表示一组不同的对象的集。目前ES6中已经支持了集合，内置了`Set`类型的实现。

对于集合的操作有下面几种：

* 并集：对于给定的两个集合，返回包含两个集合中所有元素的集合。
* 交集：对于给定的两个集合，返回包含同时位于两个集合中的共同元素的集合。
* 差集：对于给定的两个集合，返回一个包含在第一个集合中，但是不包含在第二个集合中的元素。
* 子集：判断一个集合的元素是否全部在第二个集合中。

```javascript
var Set = function() {
  this.items = {};
}

Set.prototype.has = function(value) {
  return this.items.hasOwnProperty(value);
}

Set.prototype.add = function(value) {
  if (!this.has(value)) {
    this.items[value] = value;
    return true;
  }
  return false;
}

Set.prototype.remove = function(value) {
  if (this.has(value)) {
    delete this.items[value];
    return true;
  }
  return false;
}

Set.prototype.getSize = function() {
  return Object.keys(this.items).length;
}

Set.prototype.values = function() {
  return Object.keys(this.items);
}

Set.prototype.union = function(otherSet) {
  var unionSet = new Set();
  this.values().forEach(function(value) {
    unionSet.add(value);
  });
  otherSet.values().forEach(function(value) {
    unionSet.add(value);
  });
  return unionSet;
}

Set.prototype.intersection = function(otherSet) {
  var that = this;
  var intersectionSet = new Set();
  this.values().forEach(function(value) {
    otherSet.has(value) && intersectionSet.add(value);
  });
  otherSet.values().forEach(function(value) {
    that.has(value) && intersectionSet.add(value);
  });
  return intersectionSet;
}

Set.prototype.difference = function(otherSet) {
  var that = this;
  var differenceSet = new Set();
  this.values().forEach(function(value) {
    !otherSet.has(value) && differenceSet.add(value);
  });
  otherSet.values().forEach(function(value) {
    !that.has(value) && differenceSet.add(value);
  });
  return differenceSet;
}

Set.prototype.isSubSetOf = function(otherSet) {
  if(otherSet.getSize() < this.getSize()) {
    return false;
  } else {
    return this.values().every(function(value) {
      return otherSet.has(value);
    });
  }
}

var set1 = new Set();
set1.add(1);
set1.add(2);
set1.add(3);
var set2 = new Set();
set2.add(2);

console.log(set1.union(set2));
console.log(set1.intersection(set2));
console.log(set1.difference(set2));
console.log(set1.isSubSetOf(set2));
console.log(set2.isSubSetOf(set1));
```

#### 字典

字典本身和上面的集合非常相似，但是集合对于数据的存储方法是按照`[value value]`的方式进行存储的，而字典则是通过索引来获取每个元素的值，相对于集合的不可以获取的性质，字典可以访问每个键对应的值的内容。也就是通过`[key value]`的方式进行存储的。

在JavaScript中，最基本的对象字面量其实就是字典的一个完整的实现。

#### 散列

散列又叫哈希，是字典的另外一种实现方法。

散列的作用是尽可能快得在数据结构中找到一个值。对于一些数据结构来说，需要要找到一个键对应的值，那么需要遍历整个数据结构，如果采用散列，可以用散列函数尽快在数据结构中找到一个键对应的地址。

```javascript
var HashTable = function() {
  this.table = [];
  this.hashFunction = function(key) {
    var hash = 0;
    var keys = key.toString().split('');
    for (let codePoint of keys) {
      hash += codePoint.charCodeAt();
    }
    return hash % 37;
  }
}

HashTable.prototype.put = function(key, value) {
  var position = this.hashFunction(key);
  this.table[position] = value;
}

HashTable.prototype.get = function(key) {
  return this.table[this.hashFunction(key)];
}

var hashTable = new HashTable();
hashTable.put('lucas', {
  email: 'lucas@gmail.com',
  tel: 134471266
});
hashTable.put('bob', {
  email: 'bob@gmail.com',
  tel: 123512131
});
```

##### 处理散列冲突

对于散列函数来说，不同的值在散列表中可能会位于相同的位置，这种情况在数据量大起来的时候很容易出现。这样数据就没有办法进行存储了。

这个问题有多种的处理方法：

* 分离链接：对于散列表的每一个位置创建一个链表，并且将同一个位置的散列元素存储在里面。
* 线性探查：如果一个散列元素的散列位置被占据了，那么就尝试其后一个位置，然后再后一个位置。
* 更好的散列函数：散列函数的优劣取决于散列的速度，也就是性能，以及散列之后的冲突情况，使用冲突更少的散列函数是设计数据结构一开始的时候就要确定的。

#### 树

树是一种非顺序结构，抽象程度比较高，将元素抽象为不同的分层，并且进行连接，非常适合快速查找和排序。

堆排序就是树的一种应用。

而在DOM中，DOM树就是一个标准的树形结构，其中，document节点是树的根节点，每个节点都有自己的类型，比如：元素节点，文本节点，属性节点等。

##### 二叉搜索树BST

二叉搜索树是二叉树的一种特殊情况，BST中所有节点的左孩子的值都小于其本身，所有节点的右孩子的值都大于其本身。

所以，在构建BST的时候，要注意元素的插入，需要判断其应该插入左子树还是右子树，可以用递归的方法进行插入：

```Javascript
var Node = function(key) {
  this.key = key;
  this.left = null;
  this.right = null;
}

var BinarySearchTree = function() {
  this.root = null;
}

BinarySearchTree.prototype.insert = function(key) {
  var node = new Node(key);
  var insertNode = function(node, newNode) {
    if (newNode.key < node.key) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        insertNode(node.right, newNode);
      }
    }
  }
  if (!this.root) {
    this.root = node;
  } else {
    insertNode(this.root, node);
  }
}

var binarySearchTree = new BinarySearchTree();
binarySearchTree.insert(4);
binarySearchTree.insert(2);
binarySearchTree.insert(3);
binarySearchTree.insert(9);
binarySearchTree.insert(7);

console.log(binarySearchTree);
```

##### 树的遍历

二叉树的遍历主要有三种方式：前序、中序和后序。

前中后三者分别指的是父节点遍历的位置，也就是前序为中左右、中序为左中右、后序为左右中。

这里的例子用先序遍历来演示：

```javascript
var preOrderTraverse = function(tree) {
  var root = tree.root;
  var elementArray = [];
  var preOrderTraverseCore = function(node, elementArray) {
    if (node.key === null) {
      return elementArray;
    }
    // 下面的三行代码分别是对树的父节点，左孩子，右孩子进行遍历
    elementArray.push(node.key);
    node.left !== null && (elementArray = preOrderTraverseCore(node.left, elementArray));
    node.right !== null && (elementArray = preOrderTraverseCore(node.right, elementArray));
    return elementArray;
  }
  return preOrderTraverseCore(root, elementArray);
}
```

如果交换那三行代码的顺序，就可以得到另外的中序和后序遍历。

对于BST，主要的查找内容主要是：查找最大元素，最小元素，打印一个顺序的节点序列以及查找指定元素。

* 最大元素：最大元素可以通过迭代查找右子树获得。
* 最小元素：最小元素可以通过迭代查找左子树获得。
* 节点序列：对于BST，如果要获得一个升序序列，可以通过中序遍历获得。
* 指定元素：类似于二分查找的思想，判断和每个节点的大小，分别递归到左子树或者右子树。

其实上面四种查找的方法基本类似，下面用指定元素为例：

```javascript
// 递归和循环基本上是可以相互转换的，但是由于递归会跟迭代深度有关而消耗大量的内存来将函数调用
// 入栈，所以这里采用循环的方式来进行查找。
var search = function(binarySearchTree, key) {
  var node = binarySearchTree.root;
  while(node && node.key) {
    if (node.key === key) {
      return node;
    }
    node.key > key && (node = node.left);
    node.key < key && (node = node.right);
  }
  return false;
}
```

*BST存在一个比较严重的问题，当节点数过多的时候，如果某个节点的key值是某个较为临界的值，那么就会出现某条分支长度非常长。严重影响了BST的性能。*

##### 平衡二叉树AVL

自平衡二叉树，顾名思义，这种二叉树是平衡的，也就是任意节点的左右子树的高度差不超过1。顺便，AVL是建立在BST的基础上的。

用定义的话语来说，应该是这样的：

* 可以是空树
* 如果不是空树，那么任何一个节点的左子树和右子树都为平衡二叉树，并且高度差的绝对值不超过1

AVL可以保证在进行查找的时候，时间复杂度一直是O(logn)。

平衡二叉树的插入：

在插入的时候，平衡二叉树可以分为四种情况，LL、LR、RR、RL，其中前面的字母表示发生了不平衡的子树方向，而后面的字母表示子树偏向的方向。对于LL和RR两种情况，插入比较简单，只需要将整个子树右旋或者整个子树左旋。而对于LR，需要先将右子树左旋，再将整个树右旋。而对于RL，则相反，需要先将左子树右旋，再将整个树左旋。

#### 图

图是网络结构的抽象模型，图是一组由边连接的节点，任何二元关系都可以用图来进行表示。

一个图`G=(V,E)`由下面几个元素组成，V表示一组顶点，E表示一组边，这些边用来连接V中的顶点。

一个顶点的度数是与其相邻的点的个数。

两个顶点V1到Vk的路径是指一个V1,V2...Vk的顶点的连续序列，其中Vi和Vi+1是相邻的。

简单路径表示在路径中不包含重复的顶点。

如果图中不存在任何一个环路，那么称这个图是无环的。

如果在这个图中，任意两个顶点之间都存在边，那么称这个图是连通的。

##### 有向图和无向图

图最重要的分类就是有向图以及无向图，表示一个图中的边是否存在指定的方向。如果在有向图中，每两个顶点之间都存在双向的边，那么称这个图为强连通的。

##### 邻接矩阵

图最常见的表示方法就是邻接矩阵。每对儿节点通过一个整数相关联，这个整数为1，表示两个节点之间有边相连。

如果是一个稀疏图，那么造成的结果就是矩阵中有很多无用的0，浪费了许多的存储空间。

##### 邻接表

也可以使用邻接表来表示图，邻接表由图中每个顶点的相邻顶点列表组成。

每个顶点作为键，其相邻的顶点作为值，这样可以保存下来每个顶点的相邻顶点，就可以画出整个图了。

##### 关联矩阵

用关联矩阵表示图，那么首先矩阵的行表示顶点，列表示边，使用二维数组来表示两者之间的连通性，如果顶点v是边e的入射点，则表示为1。

关联矩阵更适合表示边的数量远大于顶点数量的图。

##### 图的遍历

图的遍历方法分为两种，广度优先遍历(BFS)和深度优先遍历(DFS)。

深度优先搜索主要是根据栈来实现的，每遍历到一个节点，就将节点入栈，如果存在相邻的节点，就将节点入栈。

广度优先搜索主要是根据队列来实现的，通过将顶点推入队列来进行搜索。

实现上没有什么可说的，一般有两种实现方法，其一是递归，递归的方法可以让代码变得比较简单，但是由于调用栈可能很深，会造成内存泄漏的问题，然后就是用一个循环来进行，其实循环的代码也不是很复杂，而且循环的效率在一般情况下要比递归要高。

### 算法

#### 排序算法

##### 冒泡排序

冒泡排序比较任何两个相邻的项，如果第一个比第二个大，则对其进行交换，每个元素项向上移动至正确的顺序，就好像气泡升至表面一样，所以叫冒泡排序。

```Javascript
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
```

时间复杂度是O(n²)，空间复杂度由于不需要额外的空间，所以为O(1)。

##### 选择排序

找到数据结构中的最小值并且将其放置在第一位，然后找到第二小的值，并且将其放在第二位，依次类推。

```Javascript
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

```

时间复杂度是O(n²)，空间复杂度由于不需要额外的空间，所以为O(1)。

##### 归并排序

归并排序实际上是一种分治算法，是将原始数组分成较小的数组，直到每个小的数组只有一个元素，然后将小数组归并称为大的数组，直到最后只剩一个完成的数组。

```Javascript
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
```

归并排序的时间复杂度是O(n logn)，由于需要一个最长和数组一样的辅助空间，所以空间复杂度为O(n)。

##### 快速排序

快速排序也是分治法的一种实现，将原本的数组分为一个个较小的数组，并且性能通常比其他时间复杂度为O(n logn)的算法性能要好，所以会经常使用。

```javascript
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
```

#### 搜索算法

##### 顺序搜索

这个其实本身不算是一种算法，只是一种方法，挨个搜索目标数据结构中的值。

##### 二分搜索

二分搜索的原理是基于排序数组实现的，始终在可能存在结果的那一半中进行查找，这样将时间复杂度从顺序搜索的O(n)减少到O(logn)。

#### 动态规划

动态规划主要是将一个大型问题分割为其子问题进行求解的算法。

分治法和动态规划最大的区别在于分治法分出来的问题是相互独立的子问题，而动态规划的每一步切分都是有关联的，通过局部最优来求出全局最优，比如：

##### 最长公共子序列

我们需要求解两个数组的公共子序列，那么如果将`c[i][j]`作为最后结果的话，那么其最优解肯定是基于`c[i-i][j-1]`、`c[i-i][j]`、`c[i][j-1]`三者得出来的，那么可以得到该动态规划的状态转移方程：

```
		  | 0,      					i=0 || j=0
c[i][j] = | c[i-1][j-1] + 1,			a[i]==b[j], i!=0, j!=0
		  | max(c[i-1][j], c[i][j-1]),	a[i]!=b[j], i!=0, j!=0
```

通过这个状态转移方程，就可以得到最后的代码了：

```Javascript
function LCString(str1, str2) {
  var arr1 = str1.split('');
  var arr2 = str2.split('');
  var c = [];
  for (let i = 0; i < arr1.length + 1; i++) {
    c[i] = [];
    for (let j = 0; j < arr2.length + 1; j++) {
      c[i][j] = {
        max: 0,
        // 这里是为了保存最常的公共子串，如果不需要保存该字符串，那么就不需要
        // 保存str了，直接可以使用简单的数组，保存最长长度就可以了
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
```

##### 背包问题

背包问题是指，有一个容量为volume的背包，有n个物体，每个物体都有着自己的价值和重量，问这个背包最多能够放入多少价值的物体。

这个问题也是可以通过列状态方程来进行解决的，对于这些物体来说，每个物体都有两种情况，放入或者不放入背包。

```
c[i][j] = max {
  c[i-1][j-w[i]] + v[i],   j > w[i]
  c[i-1][j]
}
```

其中i表示物体的下标，

j表示当前使用的背包容量。

状态转移方程的前者表示该i物体放入背包。

后者表示i物体不放入背包。

```javascript
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
```

