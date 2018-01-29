## Web Workers

### 功能

Web Worker可以在Web后台线程中运行脚本，并且创建新的线程而不会干扰用户界面。主线程和新的线程可以通过消息进行通信，通过消息发布到该代码的事件处理程序。

web worker对于不能够获取全局的window对象，如果想要获取对象会抛出一个错误。但是可以直接访问WebSockers、IndexedDB，并且可以通过`XMLHttpRequest`对象来进行网络I/O。

#### 消息的接收和发送

`workers`通过`postMessage()`方法和`onmessage`事件处理函数生效。主线程和worker线程互不干扰。两端都使用事件回调来进行消息的传递，也就是上面所述的事件和方法。数据的交互是通过传递数据的副本进行的，而不是直接地共享数据。

worker线程还可以创建新的worker线程，这些线程必须要来自于相同的源才可以。

#### 构造函数

Worker构造函数会创建一个web worker线程，可以运行来自于同源的指定URL上面的脚本。

```javascript
var worker = new Worker('./main.js');
```

#### 使用

在创建完线程之后，会执行该线程的脚本，如果需要发送消息，那么主线程可以通过`worker.postMessage()`方法向worker线程发送一个数据的副本，而worker线程通过监听`onmessage`事件来传递一个回调函数，当接收到主线程发来的消息之后，这个回调函数会被执行。可以从参数中获取数据。

```javascript
// main.js
var worker = new Worker('./worker.js');
worker.postMessage('This is main thread');
worker.onmessage = function(event) {
  console.log(event.data);
}

// worker.js
onmessage = function(event) {
  var message = event.data;
  message += ' worker thread';
  postMessage(message);
}
```

如果需要终止线程的话，可以直接在浏览器主线程中，在worker线程对象上调用`terminate()`方法来终止线程，这样的线程中止是强制的，worker线程不会有任何申诉的机会就直接被中止。

#### 错误处理

通过`error`事件可以捕获到线程里面出现的错误：

```javascript
var worker = new Worker('./worker.js');
worker.addEventListener('error', function(event){
  console.log(event.message);
});
```

### 使用途径

普通的Worker构造函数构造出来的是dedicated web worker。这种对象的线程只能被创建对象的页面本身使用，其余页面是不能够使用的，但是这种线程基本已经够用了。

使用web worker一般是为了和后台进行异步操作的，一般这种操作的速度都可能有点慢，所以才使用这种线程来防止页面被阻塞。这个线程里面虽然不能够获取`window`对象，但是仍然能够获取`XMLHttpRequest`对象，所以依然能够进行AJAX请求。并且异步进行处理。

线程中的操作不会影响到主页面的性能，会在浏览器后台运行，除非执行完成，否则HTML是不知道其进度的。