# JavaScript

[JavaScript Standard Style 编码规范参考](https://github.com/feross/standard/blob/master/RULES.md)

#### 命名
**变量**，使用 Camel 命名法。
```js 
var loadingModules = {};
```
__私有属性、变量__和方法以下划线 _ 开头。
```js
var _privateMethod = {};
```
__常量__，使用全部字母大写，单词间下划线分隔的命名方式。
```js
var HTML_ENTITY = {};
```
1. __函数__，使用 Camel 命名法。
2. 函数的__参数__，使用 Camel 命名法。
```js
function stringFormat(source) {}

function hear(theBells) {}
```
1. 类，使用 Pascal 命名法
2. 类的 方法/属性，使用 Camel 命名法
```js
function TextNode(value, engine) {
    this.value = value;
    this.engine = engine;
}

TextNode.prototype.clone = function () {
    return this;
};
```
1. __枚举变量__使用 Pascal 命名法。
2. __枚举的属性__，使用全部字母大写，单词间下划线分隔的命名方式。
```js
var TargetState = {
    READING: 1,
    READED: 2,
    APPLIED: 3,
    READY: 4
};
```
由多个单词组成的__缩写词__，在命名中，根据当前命名法和出现的位置，所有字母的大小写与首字母的大小写保持一致。
```js
function XMLParser() {}

function insertHTML(element, html) {}

var httpRequest = new HTTPRequest();
```

#### 命名语法
__类名__，使用名词。
```js
function Engine(options) {}
```
__函数名__，使用动宾短语。
```js
function getStyle(element) {}
```
__boolean__ 类型的变量使用 is 或 has 开头。
```js
var isReady = false;
var hasMoreCommands = false;
```
__Promise__ 对象用动宾短语的进行时表达。
```js
var loadingData = ajax.get('url');
loadingData.then(callback);
```

#### 接口命名规范
1. 可读性强，见名晓义；
2. 尽量不与 jQuery 社区已有的习惯冲突；
3. 尽量写全。不用缩写，除非是下面列表中约定的；（变量以表达清楚为目标，uglify 会完成压缩体积工作）

|	常用词	 		| 说明       |
| 	:---------- 		| :----------| 
| 	options			| 表示选项，与 jQuery 社区保持一致，不要用 config, opts 等
| 	active			| 表示当前，不要用 current 等
| 	index			| 表示索引，不要用 idx 等
| 	trigger		| 触点元素
| 	triggerType	|	触发类型、方式
| 	context		|	表示传入的 this 对象
| 	object			| 	推荐写全，不推荐简写为 o，obj 等
| 	element		| 	推荐写全，不推荐简写为 el，elem 等
| 	length			| 	不要写成 len，l
| 	prev				| 	previous 的缩写
|	next				|	next 下一个
|	constructor	|	不能写成 ctor
|	easing			|	示动画平滑函数
|	min				|	minimize 的缩写
|	max				|	maximize 的缩写
|	DOM				|	不要写成 dom，Dom
|	.hbs	使用 	|	hbs 后缀表示模版
|	btn				|	button 的缩写
|	link				|	超链接
|	title				|	主要文本
|	img				|	图片路径（img 标签 src 属性）
|	dataset			|	html5 data-xxx 数据接口
|	theme			|	主题
|	className	|	类名
|	classNameSpace	|	class 命名空间     

#### True 和 False 布尔表达式
类型检测优先使用 typeof。对象类型检测使用 instanceof。null 或 undefined 的检测使用 == null。

下面的布尔表达式都返回 false:

* null
* undefined
* '' 空字符串
* 0 数字 0

但小心下面的，可都返回 true:

* '0' 字符串 0
* [] 空数组
* {} 空对象

#### 不要在 Array 上使用 for-in 循环
for-in 循环只用于 `object/map/hash` 的遍历，对 `Array` 用 for-in 循环有时会出错. 因为它并不是从 0 到 length - 1 进行遍历, 而是所有出现在对象及其原型链的键值。
```js
// Not recommended
function printArray(arr) {
  for (var key in arr) {
    print(arr[key]);
  }
}

printArray([0,1,2,3]);  // This works.

var a = new Array(10);
printArray(a);  // This is wrong.

a = document.getElementsByTagName('*');
printArray(a);  // This is wrong.

a = [0,1,2,3];
a.buhu = 'wine';
printArray(a);  // This is wrong again.

a = new Array;
a[3] = 3;
printArray(a);  // This is wrong again.

// Recommended
function printArray(arr) {
  var l = arr.length;
  for (var i = 0; i < l; i++) {
    print(arr[i]);
  }
}
```

#### 二元和三元操作符
操作符始终写在前一行，以免分号的隐式插入产生预想不到的问题。
```js
var x = a ? b : c;

var y = a ?
    longButSimpleOperandB : longButSimpleOperandC;

var z = a ?
        moreComplicatedB :
        moreComplicatedC;
. 操作符也是如此：

var x = foo.bar().
    doSomething().
    doSomethingElse();
```

#### 条件 (三元) 操作符 (?:)
三元操作符用于替代 if 条件判断语句。
```js
// Not recommended
if (val != 0) {
  return foo();
} else {
  return bar();
}

// Recommended
return val ? foo() : bar();
```

#### && 和 ||
二元布尔操作符是可短路的，只有在必要时才会计算到最后一项。
```js
// Not recommended
function foo(opt_win) {
  var win;
  if (opt_win) {
    win = opt_win;
  } else {
    win = window;
  }
  // ...
}

if (node) {
  if (node.kids) {
    if (node.kids[index]) {
      foo(node.kids[index]);
    }
  }
}

// Recommended
function foo(opt_win) {
  var win = opt_win || window;
  // ...
}

var kid = node && node.kids && node.kids[index];
if (kid) {
  foo(kid);
}
```