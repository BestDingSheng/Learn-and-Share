## Promise

### 回调

回调是在`Promise`出现之前，最开始的异步实现方法。当程序执行到了一个异步代码块的时候，会将回调函数挂起，并且继续执行同步代码，直到异步操作完成，代码会在下一个时钟周期将控制权交给异步回调函数，在异步回调函数执行完毕之后，再继续执行同步代码。实现了最基本的异步操作。但是这样的异步存在一些问题，当异步的嵌套变多了之后，会产生`Callback Hell`，代码显得很冗余。

并且很多时候需要调用封装的异步库，在调用异步库的时候，回调函数的控制权是需要交给第三方代码的，这样显得极不安全，因为回调函数最终的执行权并不是自己写的，所以第三方调用代码的方式我们并不清楚，有可能是切换了上下文调用的，或者是调用了多次都是有可能的。第三方是不能完全信任的，所以将回调代码的控制权最好掌握在自己的手里。

### Promise

首先，代码会承诺给我们一个值，或者是拒绝我们的请求，无论如果都会产生一个决议结果。我们对代码给我们的这个决议结果进行预先处理，这样当决议到来的时候，就会调用已经定义好的处理模块来对决议结果进行处理。

决议的结果可能不是完成，可能是一个拒绝，当决议结果是拒绝的时候，会有拒绝值，这个拒绝值称为拒绝原因。`Promise`的决议可以接受两个函数作为参数，分别对完成决议和拒绝决议进行处理。

在使用了`Promise`之后，异步操作的完成时间并不被关心，只需要知道`Promise`何时结束就可以了。每次对于`Promise`调用`then`方法，都会返回一个新的`Promise`，一次拒绝会导致后面所有的`Promise`都被拒绝。这样就支持了`Promise`的链式调用。并且不管从`then()`调用的完成回调返回的值是什么，并且都会被自动设置为被链接`Promise`的完成。

在`Promise`链式调用的时候，一步一步的传递的值是可选的，如果不显式返回一个值，就会隐式返回`undefined`。

在链接`Promise`的过程中，下一个`then`方法会等待上一次的`Promise`取得决议，并且返回新的`Promise`，然后获取决议的结果，进行自己本次的处理。

```javascript
const delay = function(time, value){
  return new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve(value);
    }, time);
    return value;
  })
}
delay(1000, 'STEP1').then(function(value){
  console.log(value);
  return delay(2000, 'STEP2');
})
```

决议的结果是不会变的，当一个决议被发出，即使`Promise`里面会产生其他的决议，也只有第一个发出的决议有效。

### Promise实现异步操作

对于异步代码来说，返回的是一个`Promise`对象，当确定决议可以完成的时候，调用传入的`resolve`方法，这时，`Promise`的状态是fulfilled，表示决议已经被完成；反之，则调用`reject`方法，这时候状态是rejected，也就是决议被拒绝了。

如果使用jQuery的AJAX方法来表示异步操作的话，可以对这个异步操作进行封装。将其封装为一个`Promise`，初始的时候，`Promise`的状态是*pending*，也就是正在进行异步操作，当AJAX请求成功之后，状态会变为*fulfilled*，决议完成（决议完成的标志是调用`resolve`方法）。

```javascript
var http = {
  get: function(url) {
    var promise = new Promise(function(resolve, reject){
		$.ajax({
          url: url,
          method: 'get',
          success: function(data){
            // 调用决议完成的函数，表示决议已经完成，状态变为fulfill
            resolve(data);
          },
          error: function(xhr, statusText){
			reject(statusText);	
          }
		})
    })
    return promise;
  }
}
// 这时候异步操作刚刚初始化，还没有决议，所以状态为pending
http.get('data.php').then(function(data){
  console.log(data);
}, function(err){
  console.error(err);
})
```

对于`Promise`链来说，有一个很特殊的地方，当第一个`Promise`被拒绝了之后，如果`reject`函数里面不返回一个被拒绝的`Promise`的话，那么链式调用的下一个`then`方法将会被决议为`resolve`。

因为执行前一个`Promise`的`reject`的时候，并没有出现错误，虽然这是一个被拒绝了的决议，但是处理的函数并没有产生拒绝，所以下一个决议还会是完成状态。