## setTimeout、setInterval

### 参数

在IE9以上的版本，这两个函数都支持无限个参数，其中第一个参数表示延时之后的回调函数，第二个参数表示延时的时间，而后面的其他参数都表示传入到回调函数的中的参数。

```javascript
setTimeout(function(a, b) {
  console.log(a + b);
}, 2000, 1, 1);
// 2, after 2 seconds
```

作为函数的参数可以是一个函数或者是字符串，如果字符串的话，那么引擎会使用`eval`函数的方式来对其进行执行。所以尽量不要以字符串作为第一个参数。

如果在IE9以下版本需要传入参数的话，那么最好使用IIFE的方式传入。通过闭包来返回另外一个函数作为回调函数。

或者通过`bind`这种方法，将参数绑定到函数上。

```javascript
setTimeout((function(a, b) {
  return function() {
    console.log(a + b);
  }
})(1, 1), 2000);
```

### setTimeout的注意点

无论是函数还是方法，当*其作为setTimeout的第一个回调函数参数的时候，这个函数或者方法内部的this总是指向全局对象。*比如：

```javascript
function User(login) {
  this.login = login;
  this.sayHi = function() {
    console.log(this.login);
  }
} 
var user = new User('John');
setTimeout(user.sayHi, 2000);
// undefined，因为调用的时候，方法中的this的指向切换到了window对象
```

为了防止这个问题，可以通过强制绑定回调函数中的`this`，或者是将其放在一个匿名函数中执行，就不会影响内部的`this`绑定了。

```javascript
// 上面的调用可以通过这样的方式来绑定
setTimeout(function() {
  user.sayHi();
}, 2000);
// 或者这样的方式
setTimeout(user.sayHi.bind(user), 2000);
```

### setTimeout和setInterval的运行机制

其可以将指定的代码和函数调用移出本次执行，等到下一次事件循环的时候才会被执行，其会被推入下一次事件循环的回调队列末尾。

当本地的同步代码执行完成之后，表示本次事件循环结束了，然后会开始下一次的事件循环，每一轮事件循环都会将任务队列中需要执行的任务一次性执行完。

如果有一个同步任务非常耗时，那么下次事件循环的队列中的任务可能会被推迟运行。

### setTimeout(func, 0)

即使设置延迟时间为0，这个回调函数也会在下一个事件循环中被执行，即使首先被添加到事件循环中，那么也需要等待其后面的同步代码执行完成，才会执行这个回调函数，这个回调函数最少会被延迟4ms进行执行。

### setTimeout(func, 0)的应用

由于其内部的代码会延迟在同步代码之后执行，所以在进行同步代码执行的时候，可以将部分代码放到`setTimeout`的回调函数内部，这样可以让同步代码调整执行顺序。

可以用在事件中，来调整事件触发的顺序。

比如我在[DOMEvent 触发顺序](https://github.com/LucaslEliane/lucas-blog/blob/master/BOM/DOMEvent-sequence/DOMEvent-sequence.md)这篇博客中写道过，`blur`事件的触发，是完全在`click`事件之前的，这样就导致了点击按钮的时候，`blur`的事件回调已经完成了对于输入框中的文本的清理工作，当时采用的是`mousedown`事件来进行处理的，因为`mousedown`事件的触发会在`blur`事件之前。

但是这样的事件绑定可能会导致事件的目的的不明确，毕竟点击事件还是由`click`来触发比较完善，保证点击的操作的完成位置。这里就可以利用`setTimeout`来延迟一下`blur`事件的触发时间。

```javascript
const inputBox = document.querySelector('#input-box');
const inputButton = document.querySelector('#input-button');
inputBox.addEventListener(function(event) {
  setTimeout(function() {
    event.target.value = '';
  }, 100);
});
inputButton.addEventListener(function() {
  console.log(inputBox.value);
});
```

这里必须要延迟一段时间才能够起效。

另外，在事件冒泡的过程中，事件的触发顺序在默认情况下是子元素向上，一级一级进行事件回调的触发，如果需要在这个顺序上进行一些小的修改，那么需要给想要延迟的事件回调中加上一个`setTimeout`就可以了。

```javascript
const button = document.querySelector('#input-button');
const body = document.body;
// 默认情况下，事件的冒泡顺序肯定是 button -> body
// 但是对button的事件回调进行了调整之后，即使延迟为0ms
// 但是事件的执行顺序依然被修改成了 body -> button
button.addEventListener(function(event) {
  setTimeout(function() {
    console.log('button clicked');
  }, 0);
});
body.addEventListener(function(event) {
  console.log('body clicked');
});
```

### clearTimeout

`setTimeout`和`setInterval`函数都会返回一个计数器编号的整数值，然后将这个值传入到`clearTimeout`和`clearInterval`函数就可以取消对应的定时器。

一般情况下，这两个函数返回的整数值是连续的。这样可以通过函数来清理所有的`setTimeout`。

```javascript
(function() {
  var gid = setInterval(clearAllTimeouts, 0);
  function clearAllTimeouts() {
    var id = setTimeout(function() {}, 0);
    while(id > 0) {
      if (id !== gid) {
        clearTimeout(id);
      }
      id--;
    }
  }
})()
```

`clearTimeout`函数在防止抖动的时候具有很强的实际意义，当前端接收到用户点击提交按钮的请求之后，会将一个数据包发送到服务器端进行处理，但是如果用户连续点击按钮呢，这样可能会造成事件被持续触发很多次。

防止抖动的方法在于为连续的两次提交设置一个门槛`threhold`，如果在指定的时间内发生了新的事件，则不发送此次通信，并且重新开始计时。直到过了指定时间，没有发生新的事件，才会发送这次消息到服务器端。

```javascript
function debounce(fn, delay) {
  var timer = null;
  return function() {
    var context = this;
    var args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(context, args);
    }, delay);
  };
}
```

### 区别

两者的最大区别在于，`setInterval`是不允许在一个tick的事件队列中存在两个相同的回调函数的。比如：

```javascript
// code split 1
setInterval(function() {}, 10);
// code split 2
```

对于上面这段代码，在代码块1执行完毕之后，`setInterval`会将一个回调函数放入到下一个tick的事件队列中，然后执行代码块2，但是如果代码块2的执行时间为50ms，那么由上面说的内容可以知道，这时候下一个tick的事件队列是不会执行的，但是定时器的时间已经到了，这时候浏览器的gc会自动抛弃这一个回调函数，一直到代码块2执行完毕，才会运行事件队列中的内容，之后才可以添加新的定时器回调函数进去。