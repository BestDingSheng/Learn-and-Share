## 原型和原型链

JavaScript中所有的函数都是具有一个原型对象的，当函数被作为构造函数使用的时候，这个原型对象会被绑定到实例对象上面，当前浏览器一般都会支持`__proto__`属性来访问当前对象的原型。而随着继承的深度增加，那么原型的长度就会越来越深，也就是原型对象本身也是具有原型的，这样一层层传递下来就形成了一个链式的结构，这个链式结构就被称作原型链。

### 原型

提到原型，就需要先说一下JavaScript中的构造函数的内部实现。简单来说，当使用`new`关键字调用一个构造函数的时候，会进行下面三个步骤：

1. 首先，会新建一个对象`obj`，这个对象在初始情况下是一个空的对象。
2. 然后用这个空对象来继承构造函数的`prototype`对象，并且将原型对象绑定到`obj`对象的`__proto__`属性上面。
3. 然后将构造函数的`this`指针指向`obj`这个对象，然后调用构造函数。
4. 如果构造函数具有一个明确的返回值，那么会返回这个值，如果没有，那么会返回这个`obj`对象。

这样就构建了一个实例对象，而这个实例对象引用的`prototype`对象就是构造函数的原型，这个原型对象也会被当做实例对象的原型对象。

由于在构造函数刚开始执行之前，就会创建这个对象并且绑定原型，所以在构造函数中可以直接通过`this`指针调用原型上的方法：

```javascript
var Person = function(name) {
  this.name = name;
  this.getName();
}
Person.prototype.getName = function() {
  console.log(this.name);
}
var person1 = new Person('Lucas');
// Lucas
var person2 = new Person('Bob');
// Bob
```

在这里查看`person1`的`__proto__`属性，可以看到`__proto__`属性指向`Person`对象。

并且`Person`的原型对象指向`Object.prototype`，这也是所有对象，包括继承，对象字面量，对象实例等对象的原型的终点。

```javascript
person1.__proto__ === Person.prototype;  // true
var obj = {};
obj.__proto__ === Object.prototype;  // true
Person.prototype.__proto__ === Object.prototype;  // true
person1.__proto__ === person2.__proto__;  // true
```

所以，JavaScript中的原型是用来在对象进行继承的时候，提供一些方法和属性的。但是一般不用来提供属性，因为原型上的属性会在重新赋值之后被修改。

### 原型链

在发生了继承之后，原型层层传递下来，就会生成一个链式结构，也就是原型链。上面例子中的实例对象`person1`也是具有原型链的。只不过其原型链很短`Person.prototype --> Object.prototype`，也就是其可以直接访问到这两个原型对象上面的方法。

由上面原型的描述来说，也可以联想到在JavaScript中使用原型来实现继承：

那么这样继承的步骤应该就是下面这个样子的：

1. 首先子类的构造函数应该绑定上一个新的原型对象，也就是父类的一个实例作为原型对象；
2. 然后在子类的构造函数中调用父类的构造函数，这里构造函数的调用需要注意，调用的时候必须将this指针指向子类。

这种继承方式在JavaScript的权威书籍中被叫做组合寄生式继承：

```javascript
var Person = function(name) {
  this.name = name;
}
Person.prototype.getName = function() {
  console.log(this.name);
}

var Teacher = function(name, detachClass) {
  Person.call(this, name);
  this.detachClass = detachClass;
}
// 重点部分
function getInherit(obj) {
  var F = function() {};
  F.prototype = obj;
  return new F();
}
var prototype = getInherit(Person.prototype);
prototype.constructor = Teacher;
Teacher.prototype = prototype;

Teacher.prototype.getInfo = function() {
  this.getName();
  console.log(this.detachClass);
}

var teacher1 = new Teacher('Lucas', 'math');
var teacher2 = new Teacher('Bob', 'computer science');
teacher1.getInfo();  // Lucas math
teacher2.getInfo();  // Bob computer science;
```

上面的代码中，最关键的部分就是标记出来重点部分的几行代码：

1. 首先，`getInherit`函数根据父类的原型构造了一个新的对象，这个新的对象的原型指向`Person.prototye`。这样做的目的是在于将父类原型上的方法也同步转移到子类的原型上面。并且对于生成的对象—作为子类原型的对象，对其进行的任何修改，完全都是基于一个新的实例进行的，不会影响父类的原型。
2. 第一行代码构造了一个对象，这个对象是根据`Person`的原型对象来进行构建的，也就是这个对象拥有`Person`对象原型上的所有的内容。并且，这个对象的原型就是父类Person的原型对象。
3. 第二行代码将生成的这个新的对象，作为子类的原型对象，来为子类提供父类原型上面的方法。
4. 第三行代码则是恢复第二行代码造成的side-effect，因为设置了新的原型对象之后，对象上面的`constructor`属性，也就是构造函数的指向发生了改变，这里要将构造函数恢复为子类的构造函数。

这些代码里面有几点需要注意：

```Javascript
Person.prototype === Teacher.prototype;   // false
prototype === Person.prototype;		// false
prototype.__proto__ === Person.prototype   // true
teacher1.__proto__ === teacher2.__proto__  // true
```

这样，就形成了一条完整的继承链，所有对于父类方法的访问都是通过原型来实现的，一般不会考虑对于原型上的属性进行继承，仅仅会继承原型上面的方法。

在进行方法调用的时候，就会使用到原型链的概念：

上面的对象的原型是这样的：

```javascript
// 对象实例的原型
teacher1.__proto__ === Teacher.prototype;  // true
Teacher.prototype.__proto__ === Person.prototype;  // true
Person.prototype.__proto__ === Object.prototype;  // true
```

当子类实例`teacher1`调用一个方法的时候，如果这个方法存在于其原型上，就会直接访问这个方法，否则，会沿着原型链向上进行递归查找。直到找到对应的方法为止。然后调用的时候，方法内部的`this`会自动绑定到当前的对象实例上面。方法调用的时候的`this`的指向就是根据JavaScript定义的几种`this`指向的规则有关。

