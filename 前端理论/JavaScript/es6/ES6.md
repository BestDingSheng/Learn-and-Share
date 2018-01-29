## ES6

### 块级绑定

对于块级变量`let`和`const`来说，其*定义不会被提升到作用域顶部*，并且这个变量*不能够在同一级作用域被重定义*，但是可以在嵌套的作用域被重新定义，并且屏蔽当前的属性，这两点和`var`是不相同的。在跨块级作用域的时候，块级作用域变量甚至*不能够被访问*。

对于常量，*必须要在定义的时候声明*，否则会抛出错误。`const`更加严格，对于已经定义过的变量，无论如何都不能够进行重定义。

`const`声明会阻止对于变量绑定与变量自身值的修改，也就是其不会阻止对于变量成员的修改。

`const`声明不会阻止对于变量成员的修改，也就是在对象中，如果修改对象的属性或者方法是可以的，但是不能够修改对象本身的引用。

#### 暂时性死区

由于声明不会被提前，`let`以及`const`声明的变量在声明之前的位置被称为暂时性死区，在这个区域内，所有块级声明都不能够被访问。以至于*通常都是安全的`typeof`运算符，也变得不安全了。*

#### 循环中的块级绑定

在循环中使用块级作用域是很必要的，*通过`let`声明的循环计数器只在循环内部生效。*

#### 循环中的函数

如果使用`var`进行循环，并且在循环内部创建函数，*可能会导致所有的函数引用的循环计数器是一样的*，不能够达到预期的效果：

```javascript
var funcs = [];
// 这样定义的函数中，i值都是一样的
for (var i = 0; i < 10; i++) {
  func.push(function() { console.log(i); });
}
funcs.forEach(function(func) {
  func();
})
```

这个问题可以用IIFE进行修正，但是在块级作用域出现之后，可以直接使用块级作用域的`let`声明达到同样的效果。

#### 全局块级绑定

当在全局上使用`var`的时候，*会在全局对象上创建一个同名的属性*，也就是可能会无意修改全局对象。但是如果在全局作用域上面使用`let`或者`const`，虽然会在全局作用域内创建一个变量，但是不会影响全局对象。*只可能会屏蔽掉全局属性，但是该属性仍然可以通过全局对象进行访问*。

#### 最佳实践

在使用ES6的时候，应该默认使用`const`，然后在确定需要对变量进行修改的时候才使用`let`。

### 对象

#### 对象速记法

对于ES6中的对象，提供了一些快速构建的方法：

```javascript
function getPerson(name, age) {
  return {
    name,
    age,
    getInfo() {
      console.log(this.name, this.age);
    }
  }
}
```

分为两点：属性，引擎会直接搜索作用域内的同名变量自动赋值，方法，可以省略掉`function`关键字，让代码变得更neat。

#### Object.is()

这个方法比严格相等运算符更加严格，对于严格相等的一些怪异行为进行了修复，比如：

```javascript
NaN === NaN  // false
+0 === -0    // true
Object.is(NaN, NaN)  // true
Object.is(+0, -0)    // false
```

#### Object.assign()

这个方法用来进行属性的复制，该方法的接收无限个对象作为参数。会将第一个参数作为接收对象，将后面所有参数对象上的属性复制到第一个对象上，并且后面的属性可能会覆盖掉前面的同名属性。

对于访问器属性来说，其只会复制访问器属性的值上去，并不会复制访问器上去。

```javascript
var supplier = {
  get name() {
    return 'lucas'
  }
}
var receiver = {}
Object.assign(receiver, supplier);
receiver;  // Object {name: "lucas"}
```

#### 对象原型

在ES5中，对象一旦被生成，那么其原型就是不可以直接改变的，但是可以通过`Object.getPrototypeOf`方法进行访问。

ES6中增加了对于对象原型的修改，可以使用`Object.setPrototypeOf`方法来直接修改对象的原型。

在对象字面量的简写方法内部，可以通过`super`关键字直接访问到对象的原型，其行为和`Object.getPrototype`类似。不过：

```javascript
var supplier = {
  age: 29,
  getAge() {
    console.log(this.age)
  }
}
var sup = {
  getInfo() {
    // 这样调用的效果类似于：
    // Object.getPrototypeOf(this).getAge.call(this);
    super.getAge();
  }
}
Object.setPrototypeOf(sup, supplier);
sup.getInfo();  // 29
```

### 解构

#### 对象解构

对象的解构语法在赋值语句的左侧使用了对象字面量。

```javascript
let node = {
  type: 'element',
  name: 'div'
}
let { type, name } = node  // 直接声明了两个变量并且赋值
```

*这里要注意，使用解构的时候必须要有初始化器----var/let/const三者之一*。

在使用对象解构的时候，如果赋值语句右侧不能够满足左侧的需求，那么对应的变量会赋值为`undefined`。为了防止这种情况的发生，可以对左侧使用默认值，在相应的变量名后面添加赋值表达式即可。

```javascript
let { type, name, value = true } = node;
// 这样value会被赋一个默认值true
```

*如果需要对于本地不同变量名的变量进行解构赋值，要用下面的语法*：

```javascript
let node = {
  type: 'element',
  name: 'div'
}
let { type: localType, name: localName } = node
```

这里要注意，*虽然写法和对象字面量一样的，但是赋值的方向是完全相反的，冒号右侧为要赋值的变量。*这样仍然可以添加默认值，不会影响操作。

嵌套解构，对于嵌套的属性也是可以解构赋值的：

```javascript
let node = {
  type: 'element',
  loc: {
    content: {
      line: 1,
      column: 2
    }
  }
}
let { loc: { content: { line, column }}} = node;
// line = 1, column = 2, content: throw error
```



#### 数组解构

数组解构的语法和对象解构很类似，只是将对象字面量替换成了数组字面量。数组解构是按照数组的下标进行的而不是属性名。

数组解构的时候可以提供占位符来忽略前面的某几项，来从数组中取出任意位置的值。

```javascript
let colors = ['red', 'green', 'yellow', 'blue'];
let [ ,secondColor, , fourthColor ] = colors;
secondColor;  // green
fourthColor;  // blue
```

数组解构有一个特殊的用法，就是互换两个元素的值，以前互换两个元素的值需要一个临时变量作为辅助变量，使用解构赋值可以简单一点。

```javascript
let a = 1, b = 2;
// 可以直接完成变量的值的交换
[a, b] = [b, a];
```

数组的解构赋值也可以使用默认值，并且使用方法和对象的解构赋值是一样的。数组的嵌套解构赋值和对象也是一致的。

##### 剩余项

使用`...`运算符可以将剩余项目赋值给一个指定的变量。这个方法还可以进行快速的数组复制。

```Javascript
let colors = ['red', 'green', 'blue'];
let [firstColor, ...lastColor] = colors;
// ES5中使用concat方法来进行数组复制
var cloneColors = colors.concat();
// ES6可以使用剩余运算符进行复制
var [...cloneColors] = colors;
```

剩余项必须是数组解构赋值模式的最后一个部分，之后不能够再有逗号了。

#### 混合解构

对象的解构赋值可以和数组的解构赋值结合起来使用。

```javascript
let node = {
  type: 'identifier',
  name: 'foo',
  loc: {
    start: {
      line: 1,
      column: 2
    },
    end: {
      line: 1,
      column: 4
    }
  },
  range: [0, 3]
}
let {
  loc: { start: locStart },
  range: [ startIndex ]
}
// locStart: {line: 1, column: 2}
// startIndex = 0
```

#### 函数参数解构

在定义函数的时候，如果需要传递一些额外的不确定的参数，会使用一个对象来保存这些参数，在ES6中，可以使用参数解构来明确这些参数，参数解构和对象解构类似，不过将赋值的目标放到了函数形参列表中：

```javascript
// 在ES5中一般是这样接收多余参数的
function setCookie(name, value, options) {
  let secure = options.secure,
      path = options.path;
}
// ES6中可以用这种方法，更容易看到需要接收的参数都有什么
function setCookie(name, value, { secure, path, domain }) {
  // some logic
}
setCookie('lucas', 111, {
  secure: true,
  domain: 'www.baidu.com'
})
```

如果传入的参数不够的话，和对象的解构赋值一样，这个参数会被传入一个`undefined`。

要注意对于参数解构赋值的时候，必须要传入一个对象，即使是空对象，否则会报错。

```javascript
setCookie('lucas', 111);  // 不传入任何参数会报错
setCookie('lucas', 111, {});  // 最起码要这么调用，才不会报错
// 添加了默认参数之后就不会报错了
function setCookie(name, value, {
  secure = true,
  path = '/index',
  domain = 'www.baidu.com'
} = {})
```

*参数解构的时候也可以使用默认值来解决上面的那个问题*。

### Set和Map

#### Set

ES6新增的Set类型是一个无重复值的有序列表。Set允许对其包含的数据进行快速访问。

使用`set.add()`方法可以快速添加一个值，并且*不会使用强制类型转换来判断这个值是否重复*。这里的判断使用了`Object.is()`方法来进行的。

使用`set.size`属性可以获得当前集合的内容个数。

使用`set.has()`方法可以判断一个值是否位于当前集合中。

使用`set.delete()`方法可以移除集合中的一个值。

使用`set.clear()`方法可以清空数组。

`set.forEach()`方法可以对数组进行遍历，回调函数的三个参数分别为：set中下个位置的值，第二个参数和第一个参数一致，第三个参数为集合本身。

*对于普通的set来说，如果只有自己对某个对象进行引用，那么这个对象就不会被垃圾回收，为了解决这个问题，可以使用`WeakSet`，只允许存储对象的弱引用，甚至不允许存储任何的原始值。也就是当WeakSet中的引用是最后一个引用的时候，这个对象仍然会被垃圾回收。*

```javascript
let set = new WeakSet(),
    key = {};
set.add(key);
set.has(key); // true

key = null;
// 这时候对于原本的对象的引用已经丢失了，并且无法再进行访问。
```

#### Map

Map类型是键值对的有序列表。并且键和值都可以是任意类型，对于键的比较使用的是`Object.is()`方法进行。

Map类型和一般对象的最主要的区别是，该类型可以使用任何类型的值作为键，包括对象等。

使用`map.has()`方法可以判断键是否在map中。

使用`map.delete()`方法可以移除map中的键和对应的值。

使用`set.clear()`方法可以移除map中所有的键值对。

### 代理和反射

通过调用`new Proxy()`，可以创建一个代理，用来代替一个对象，这个代理对目标对象进行了虚拟，代理可以拦截在目标对象上的一些操作，并且使用自己定义的操作来进行替代。

反射给底层的操作提供了默认行为的方法集合，每一个代理陷阱都有一个对应的同名反射方法。

*代理的每个陷阱函数都可以对JS对象的某个内置行为进行重写，如果仍然想要使用原本的内置行为，可以调用对应的反射方法。*

在创建代理的时候，需要传入两个参数，分别是目标对象`target`以及一个包含多个陷阱函数的对象`handler`。所有对于目标对象的操作都会经过代理对象，并且对代理对象产生影响。*如果设置了代理陷阱函数，那么对于目标对象的操作会完全被陷阱函数拦截，不会直接作用到目标对象上。*

```javascript
let person = {
  age: 20,
  name: 'lucas'
};
let personProxy = new Proxy(person, {
  set(target, property, value, receiver) {
  	if (property === 'value') {
      if (value >= 0 && value <=99) {
        return Reflect.set(target, property, value, receiver);
      } else {
        return false;
      }
  	}
    return Reflect.set(target, property, value, receiver);
  }
});
personProxy.age = 0;
person.age;		// 0
personProxy.age = 200;
person.age;		// 0，没有被修改，也就是陷入了陷阱。
```

上面的代码中，*构建的代理对象对于目标对象的操作进行了拦截，而内置的反射对象直接对目标对象进行了操作。*

### 迭代器和生成器

迭代器是被设计专门用于迭代的对象，所有迭代器对象都拥有一个`next`方法，会返回一个结果对象，这个结果对象包含两个属性`value`表示下一个值，`done`表示迭代是否完成。

```javascript
function createIterator(items) {
  let i = 0;
  return {
    next() {
      let done = !!i == items.length;
      let value = items[i] + 1;
      i++;
      return {
        done,
        value
      }
    }
  }
}
```

生成器是一个可以返回迭代器的函数，生成器函数在`function`关键字后面加上一个\*号来表示，并且可以使用`yield`关键字。

`yield`关键字指定了在调用了`next()`方法之后需要返回的值。并且生成器函数会在每次`yield`语句之后停止执行，知道调用了`next()`方法之后才会重新执行到下一个`yield`关键字的位置。

*注意不能够使用箭头函数来构造生成器函数*。

可以在对象上构造默认的迭代器，所有要求使用迭代器的方法都可以对这个对象进行访问了，比如`for..of`循环。

对象的默认迭代器是通过`Symbol.iterator`符号来确定的，也是通过这个符号来判断对象是否是可迭代对象的。如果对象的这个属性含有值，那么对象就是可迭代的。

```javascript
// 对象的默认迭代器
let collection = {
  items: [1, 2, 3, 4],
  // 使用生成器创建迭代器是一个比较简便的方法，当然也是用普通函数自己构建一个迭代器
  [Symbol.iterator]: function*() {
    for (let i = 0; i < this.items.length; i++) {
      yield this.items[i] + 1;
    }
  }
}
for (let x of collection) {
  console.log(x);
}
```

在JavaScript中，集合类型的都是有默认的迭代器的。包括`Map`、`Set`以及`Array`，迭代器的`keys()`、`values()`、`entities()`三个方法分别可以对集合的键、值以及键值对进行迭代。

```javascript
let colors = ['red', 'green', 'blue'];
for (let key of tracking.keys()) {
  console.log(key);
}
```

一般情况下，对于原生集合，使用这些迭代方法就足够了，自定义的迭代器一般都是对于自己构建的对象来使用的。