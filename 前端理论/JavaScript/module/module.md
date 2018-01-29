## 前端模块化

### CommonJS

CommonJS是NodeJS为了在服务器端使用模块化开发而谁的一种规范，而NodeJS的模块功能也就是CommonJS规范的一个实现。

CommonJS提供一个全局的`require`方法来对模块进行引入。NodeJS提供了4个全局变量来处理模块，`module`代表模块本身，在导出模块的时候，导出的是一个对象，而这个对象被挂载到了`module.exports`对象上面了：

```javascript
var var1 = 1;
var var2 = 2;
module.exports.a = {
  var1,
  var2,
}
```

当执行`require`全局函数的时候，NodeJS会执行模块文件，然后将导出的对象，赋值给`require`这个模块的变量，这样就获取了导出对象的一个副本。

而且，每个模块只会被执行一次，因为当一个模块运行了一次之后，模块的结果会被缓存起来，以后的引用都会使用这个缓存。

模块按照其在代码中出现的顺序进行加载。

CommonJS运行在服务端的时候是同步的，并且所有模块文件的读取都是从磁盘上直接读取的，所以可以按照顺序加载，但是在浏览器端，脚本的引入顺序可能和网络速度有关，所以天生是异步的，CommonJS并不适用于浏览器端。

### AMD

AMD(Asynchronous Module Definition)，是浏览器中进行模块化开发的一个规范，不是原生JavaScript支持的，所以其规范化产出了RequireJS。

这个规范是这样的：

1. 用全局函数`define`来定义模块，`define(?id, ?dependencies, factory)`。
2. `id`表示模块的唯一标识符。
3. `dependencies`表示模块所依赖的其他模块数组。
4. `factory`所返回的对象则是模块暴露出来的内容，可供模块外部使用。

所以，使用RequireJS的代码可以这么写：

```javascript
// a.js
define(function() {
  console.log('module a exec');
  return {
    hello: function() {
      console.log('this is module a\'s hello')
    }
  }
})
// index.js
require(['a'], function(a) {
  console.log('index exec');
  a.hello();
})
```

RequireJS通过两个方法`require`和`define`来分别引用和定义模块，并且处理模块的依赖关系。这里`define`需要将所有的依赖都提前作为参数传递进去，并且要传递给函数的参数。如果需要按需加载模块，可以使用CommonJS的在RequireJS中的一些实现：

```javascript
define(function() {
  console.log('index exec');
  require(['a'], function(a) {
    a.hello();
  })
})
```

### CMD

CMD是SeaJS在实现的时候的规范化产出。

CMD和AMD比较类似，不过CMD推崇就近依赖，并且对于依赖的模块，AMD会在依赖的时候就对模块进行执行，而CMD则是在使用的时候进行执行，但是现在好像AMD也可以延迟执行了。两者都是在页面加载到主程序的时候，对于所有的依赖进行加载的。

```javascript
// 就近依赖
// CMD
define(funciton(require, exports, module) {
  var a = require('a');
  a.doSomething();
  var b = require('b');
  b.doSomething();
})
// AMD
define(['a', 'b'], function(a, b) {
  a.doSomething();
  b.doSomething();
})
```

### 当前

在当前版本中，主要使用的模块加载方式变成：

* 客户端：ES6标准的import & export，配合各种打包工具使用。
* 服务端：CommonJS标准的module.exports来进行导出，require来引入。

这两者的区别比较大，主要在于下面几点：

1. 导入方式：CommonJS导入必须导入整个模块的对象，而ES6可以只导入这个模块的一个或者多个接口。这个区别是和下面导出的区别相关的。
2. 导出方式：CommonJS一个模块只允许有一个导出，而ES6可以有多个`export`，但是`export default`只能有一个默认值。
3. `this`指向：CommonJS模块中的`this`指向了模块内部，而ES6指向的是`undefined`。
4. 加载方式：这个区别其实是最重要的，CommonJS的模块引用是引用输出的一个拷贝，并不会修改模块内部，而ES6的引用是模块导出的引用，所以会影响到模块内部的值。