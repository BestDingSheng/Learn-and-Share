## TypeScript

### 函数的类型

对于函数来说，有两种声明方式，包括函数定义以及函数表达式。

在typeScript中，由于对于所有的函数都要进行类型检查，所以需要做的就是为函数的参数和返回值进行类型定义。

对于函数声明来说：

```typescript
function add(a: number, b: number): number {
  return a + b;
}
// 调用的时候不能够输入多余的参数或者是缺少参数
add(1,2,3);  // error
add(1,2);	 // error
```

函数表达式比较麻烦，首先要对变量进行类型定义，这个定义需要和函数的一致。这样就会得到一个很长的函数定义：

```typescript
const mySum: (a: number, b: number) => number = function(a: number, b: number): number {
  return a + b;
}
```

*这样要保证变量定义和函数定义的参数和返回值个数以及类型都是一致的。*

#### 接口中函数的定义

也可以使用接口的方式来定义一个函数的形状：

```typescript
// 接口定义的函数形式可以复用，并且可以将函数表达式定义方法的长度缩短
interface SearchFunc {
  (source: string, subString: string): boolean;
}
let mySearch: searchFunc;
mySearch = function(source: string, subString: string): string {
  return source.search(subString) !== -1;
}
```

#### 可选参数

由于不允许输入多余的参数或者比较少的参数，这样的话就需要可选参数来进行复用。使用`?`问号来表示可选的参数。

```typescript
function getName(firstName: string, lastName?: string): string {
  if (lastName) {
	return `${firstName} ${lastName}`;
  } else {
    return firstName;
  }
}
```

使用可选参数要注意，可选参数的后面不允许再出现必须参数了。

和ES6中相同，可以对函数传入默认的参数值，并且这样可以避免可选参数必须在必须参数后面这个条件了。这个特性和ES6中的使用方法相同。

*可选参数不能传入默认值，只有必选参数才可以使用默认值。*

#### 剩余参数

ES6的剩余参数在这里面也可以使用，但是剩余参数必须是最后一个参数，用一个数组类型来进行表示。

```typescript
function push(array: any[], ...args: any[]): any[] {
  args.forEach((value) => {
    array.push(value);
  });
  return array;
}
```

#### 函数重载

和一般的强类型面向对象语言一样，如果需要函数针对不同的输入类型，进行不同的处理，可以使用函数重载来进行。

```typescript
function reverse(x: string): string;
function reverse(x: number): number;
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''));
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('');
  } else {
    return '';
  }
}
```

### 类型断言

在变量或者参数使用联合类型的时候，可能并不确定当前参数的类型，所以一些类型方法的定义会出现错误，这时候可以使用类型断言来告知编译器当前变量或参数的类型，来覆盖编译器推断的类型。

*断言只能够选择联合类型中存在的类型。*

使用尖括号包裹需要断言的类型，来表示类型断言。

```Typescript
function getLength(x: number | string): number {
  if ((<string>x).length) {
    return (<string>x).length;
  } else {
    return x.toString().length;
  }
}
```

### 声明文件

使用第三方库的时候，对于其内部的各种方法和对象本身是没有定义过类型的。这时候需要自己对这些对象和方法进行类型声明。

一般比较常用的库都是有对应的`.d.ts`的声明文件的，可以用npm进行下载。

### 内置对象

JavaScript中本身就有一些内置对象，比如DOM、BOM对象等，这些对象基本上都是定义在全局环境中的：

#### ECMAScript对象

ES中，有`Boolean`、`Date`、`RegExp`、`Error`等内置对象，这些类型在typeScript的类型定义中也是可以直接使用的。

#### DOM、BOM对象

在浏览器环境中，文档对象模型DOM和浏览器对象模型BOM对象也都是在TypeScript中直接可以使用的。

包括一些DOM类型，包括事件类型等。

TypeScript对于这些内置对象的类型定义已经定义在环境中了，可以直接使用。

#### NodeJS

NodeJS不是内置的对象的一部分，如果要使用NodeJS的话，那么需要引入第三方的声明文件。

### 类型推论

对于未定义类型或者是使用联合类型声明的变量来说，其类型会在对其每一次赋值之后被推论。

```javascript
// 联合类型，变量的类型可以选择其中的任意一种
let value: number | string;
value = 'this is string';
console.log(value.length);
value = 2;
console.log(value.length);
// property length is not existed in type number
// 也就是重新赋值之后，变量的类型被重新推论为了number
```

### interface

interface可以对类的一部分行为进行抽象，也可以对对象的形状进行描述。

这样，对象在定义的时候就不能够比接口多出或缺少属性，如果想要多出属性的话，需要在接口中使用可选属性，如果想要缺少属性的话，需要在接口中使用任意属性。

```typescript
interface Person {
  name: string;
  // 被标记为可选属性的属性可以进行省略
  age?: number;
  // 被标记为任意属性的属性可以选择任意的属性名
  [propName: string]: any
}
let lucas: Person {
  name: 'Lucas',
  website: 'http://lucas.com'
}
```

如果确定了可选属性的类型，那么接口中其余属性的类型必须是任意属性类型的子类型，任意属性只需要定义一个，就可以添加多个任意属性。

如果不希望一个属性在声明定义之后被修改，那么可以设置这个属性的类型为只读`readonly`

```typescript
interface Person {
  name: string;
  age?: number;
  // 这里必须包含至少三个类型，其中string是name属性的类型
  // 而age属性的类型可能是undefined或者是number，因为其是
  // 一个可选属性
  [propName: string]: string | number | undefined;
  readonly password: string;
}
const lucas:Person = {
  name: 'Lucas',
  age: 20,
  // 这里的两个属性都是被任意属性定义的，只需要类型在联合类型
  // 的列表当中就可以了
  website: 'http://lucas.com',
  username: 'temporary',
  password: '111111'
}
// 这里会发生报错
// Cannot assign to password because it is a constant or a read-only property.
lucas.password = '111222';
```

### 类型别名

#### 类型别名

使用`type`关键字可以定义一个类型的别名，可以定义一些自定义类型，并且为其起名。

主要针对一些自定义类型或者是联合类型等使用。对于比较简单的类型倒是不需要这样的自定义类型名。

比如这样：

```Typescript
interface Person {
  age: number;
  name: string;
  information?: string;
}

type Department = Person[];

const person1 = {
  age: 20,
  name: 'lucas'
}

const person2 = {
  age: 25,
  name: 'Bob',
  information: 'stay at home'
}

const person3 = {
  age: 30,
  name: 'Essay'
}

const newDepartment = [person1, person2, person3];
```

#### 字符串字面量类型

类似于枚举类型，表示某个内容的取值只能是某几个字符串中的一个。具体的定义方式和使用类型别名+联合类型类似，也就是将几个字符串联合起来。

```typescript
type eventName = 'click' | 'focus' | 'hover';
const element: HTMLElement = document.querySelector('div');
function registerCallback(event: eventName, target: HTMLElement) {
  // some logic
}
```

### 元组

数组一般用来合并相同类型的变量，如果需要合并不同类型的变量，使用元组比数组要好。

元组需要多所有的内容都进行类型定义，如果不满足需求请使用数组。

元组的访问和数组是一致的。

```typescript
let tuple: [number, number, string] = [1, 2, 'string'];
// error 初始化的内容类型和元组定义的不相同
let tuple: [number, number, string] = ['string', 1, 3];
```

如果初始化或者赋值的时候，越过了元组定义时候的边界，那么越界的元素的类型会被设置为整个元组的所有类型的联合类型。

当访问一个越界元素的时候，这个越界元素的类型也会被认作是每个类型的联合类型。

### 枚举

枚举类型用于限制取值被限定在一定范围内的场景。比如一周的七天等。

枚举成员会被赋值为从0开始的数字，枚举值到枚举名也可以进行反向映射。

```typescript
enum Day { Mon, Tue, Wen, Thu, Fri, Sat, Sun };
Day[0] === 'Mon'  // true
Day['Mon'] === 0  // true
```

也可以在定义的时候手动给枚举对象进行赋值，这个赋值需要在声明枚举类型的时候。

```typescript
enum Days { Mon = 3, Tue = 2, Wen, Thu, Fri, Sat, Sun };
Day[3] === 'Mon'  // false
// 这里可以看出TypeScript对于自赋值的枚举，其他没有赋值的枚举项
// 的值仍然会按照之前的顺序进行递增，如果出现了相同的枚举值，后面的则会覆盖前面的。
// 赋值的结果是这样： Mon 3，Tue 2，Wen 3，Thu 4，Fri 5，Sat 6，Sun 7
```

*所以手动给枚举项赋值的时候要注意冲突问题，要不然会导致部分枚举项不能够被访问到。*

#### 常数枚举

常数枚举和正常枚举的区别在于其会在编译阶段被删除，并不包含计算成员，其编译出来的结果就是一个简单的数组。

```typescript
const enum Directions = { Up, Down, Left, Right };
// 编译出来的结果就是这样的，其实这个数组都不会显示在编译结果中
// 编译出来的数组也会被删除，并且将所用使用枚举的地方都进行了替换
var Directions = [0, 1, 2, 3];
```

使用这种枚举可以减少代码量，适合用于代码内部的枚举，枚举在进行判断的时候要比直接用字符串准确。并且和限制变量的具体取值。

### 类

TypeScript中的类是对ES6类的一个扩展，增加了修饰符：

* `public`修饰的属性或者方法是公有的，能够在任何地方被访问到，默认情况下都是`public`的。
* `private`修饰的是私有的属性或者方法，不能够在类的外部被访问。
* `protected`修饰的属性或者方法是受保护的，只能够在类或者子类的内部被访问。

`abstract`关键字可以用来定义抽象类，用来对类进行抽象，*抽象类是不能够进行实例化的，并且抽象类中的抽象方法必须被子类所继承。*可以在抽象类中将子类需要的公共方法都进行抽象，抽象成抽象方法，然后子类中对其进行实现，其余的属性和方法会直接被子类继承。

```typescript
abstract class Animal {
  protected name: string;
  public constructor(name: string) {
    this.name = name;
  }
  public abstract sayName(): string;
}

class Cat extends Animal {
  public sayName() {
    return this.name;
  }
}

const cat = new Cat('cat');
cat.sayName();
```

#### 类与接口

类可以实现对同一个类型的对象进行抽象，然后通过不同的参数进行实例化，抽象类可以对类的方法和属性进行抽象，而接口可以对类的形状进行描述，其实也相当于对类的一部分进行抽象。

不同于一个类只可以继承一个父类或者是抽象类，被抽象出来的接口，一个类可以实现多个接口，也就是一个类可以将多个接口的内容进行实例化，类似于常用的混入Mixin。

接口可以继承类，也可以继承接口，这些操作都是非常灵活的。