## Promise、generator和async

这三个对象或者方法都是标准为了实现更方便、实用的异步处理方法而实现的。`Promise`在一定程度上解决了回调函数嵌套调用的callback hell的问题，而后面两个方法将JavaScript的异步方案进行了类似同步方式的优化，和`Promise`结合使用可以实现更加清晰的异步代码。

### Promise

`Promise`是三者中的根本，也是基础，`Promise`是一个含有状态的对象，这个对象根据其内部操作的执行程度，来分别调用`resolve`和`reject`方法。当`new`了一个`Promise`的时候，其开始执行内部的操作，状态变更为`pending`，当异步操作执行完成之后，异步操作的状态可能是成功或者失败，对应着`Promise`的`resolve`和`reject`的状态，然后会分别调用其`then`方法中的对应的回调函数。

第一个`then`方法的调用是根据`Promise`初始化时候的处理过程进行的，而后续的`then`方法则是根据之前的返回值来确定的。

```javascript
const fs = require('fs');
const readFile = function(filename) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(err);
      }
    });
  });
}

readFile('readme').then(function(data) {
  return data;
}, function(err) {
  return err;
}).then(function(result) {
  console.log(result.toString());
});
```

上面的代码中，调用函数的时候会返回一个已经开始执行的`Promise`，之后，根据这个`Promise`的执行状态会分别调用`then`方法中的两个函数，由于两个函数的返回值都是一个同步值(也就是字面量)，这样下一个`then`方法就会将其当做一个成功的`Promise`来进行处理，类似于返回了一个`Promise.resolve()`的结果。

如果需要进行异步操作的顺序调用的话，那么需要将返回值设置为一个新的`Promise`对象，然后下面的`then`方法就会根据返回的`Promise`对象来调用`resolve`和`reject`的回调了。

```javascript
// 第一个读取的文件的内容就是第二个需要读取文件的文件名
// 这两个异步操作，必须要保证第一个异步操作完成之后再开始
// 第二次的异步操作
readFile('readme').then(function(data) {
  return readFile(data.toString());
}, function(err) {
  return Promise.reject(err.toString());
}).then(function(data) {
  console.log(data.toString());
}, function(err) {
  console.log(err);
});
// 这样就实现了两个需要顺序进行的异步操作的顺序保证
```

#### Promise的一些方法

Promise和一些polyfill，都实现了一些封装的方法，来实现对于`Promise`快速的流程处理。

`Promise.resolve`和`Promise.reject`可以直接实现一个resolve的或者reject的Promise。

`Promise.all()`必须要参数所有的`Promise`resolve了，状态才会变为resolve。

`Promise.race()`是当第一个`Promise`fulfilled或者是rejected发生了之后，传递到`then`里面。类似于一个竞争的关系。

#### `Promise.resolve`和`Promise.reject`

对于`Promise.resolve`来说，如果参数不同，方法实现的效果都是不同的。

如果参数是一个字面量，那么会返回一个resolve的`Promise`对象。

如果参数是一个`Promise`或者thenable对象的话，那么会将其转换为一个`Promise`，或者产生一个`Promise`的复制。

*但是不会影响当前`Promise`的执行状态。*

```Javascript
const readFile = function(filename) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, function(err, data) {
      if (err) {
        console.log('the promise had been rejected!');
        reject(err.toString());
      } else {
        console.log('the promise has been resolved!');
        resolve(data.toString());
      }
    });
  });
}
// 该文件不存在的话
Promise.resolve(readFile('./readme'))
.then(function(data) {
  console.log('this is resolve callback function!');
  console.log(data);
}, function(err) {
  console.log('this is reject callback function!');
  console.error(err);
});
// the promise had been rejected!
// this is reject callback function!
// Error: ENOENT: no such file or directory, open './readmea'
```

而`Promise.reject`在使用的时候，就不像`Promise.resolve`那么多的作用了。对于其传入一个字面量，会返回一个reject状态的`Promise`。而参数是一个失败的原因。*主要可以用来进行Promise失败的测试*。

#### `Promise.all`

这个方法可以传递很多的`Promise`进去，当所有`Promise`都变成fulfill状态的话，那么生成的这个新的`Promise`才会是fulfill状态，否则是reject状态。

这个`Promise.all`主要用在于几个异步操作需要结合使用的时候，需要几个`Promise`均完成，才能够执行后面的同步操作，这个方法可以返回一个新的`Promise`。

该函数的参数是一个thenable对象的数组，中间可以通过`Promise.resolve`或者`Promise.reject`来将直接量转换为`Promise`对象。

```javascript
Promise.all([
  readFile('./readme'),
  readFile('./nextFile'),
  readFile('./lastFile')
]).then(function(data) {
  console.log(data[0] + data[1] + data[2]);
}, function(err) {
  console.error(err);
});
```

#### `Promise.race`

这个方法也是传递一个可迭代的变量到参数中，迭代的结果应该是一些thenable对象。

这个方法可以用于类似同时请求多个服务器，当第一个服务器返回了一个结果之后，就抛弃其他所有的请求结果，这样可以在请求的时候增加一些容错机制。

```javascript
// server.js
const http = require('http');
const server = http.createServer(function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.url === '/') {
    res.statusCode = 200;
    res.end('/ request OK');
  } else {
    setTimeout(function() {
      res.status = 500;
      res.end('other request error');
    }, 2000);
  }
});
server.listen(9999);
// app.js
const ajaxPromise = function(url) {
  const xmlHttp = new XMLHttpRequest();
  return new Promise(function(resolve, reject) {
    xmlHttp.open('GET', url);
    xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState === 4) {
        if (xmlHttp.status === 200) {
          resolve(xmlHttp.responseText);
        } else {
          reject(xmlHttp.responseText);
        }
      }
    }
  });
}
Promise.race([
  ajaxPromise('http://localhost:9999/'),
  ajaxPromise('http://localhost:9999/index'),
  ajaxPromise('http://localhost:9999/user')
]).then(function(data) {
  console.log(data);
}, function(err) {
  console.error(err);
});
```

这里由于在服务端对于除了根目录的其他的请求都进行了延迟。所以所有的`Promise`的请求结果永远都是请求根目录的结果。

#### `Promise.prototype.catch`

用于对于错误的统一处理，当一个`Promise`链式调用的时候，将这个方法挂在最后，这个方法可以对整个链式调用过程中的任何一个`Promise`产生的reject进行统一处理。

```javascript
readFile('./readme').then(function(data) {
  return data;
}).then(function(data) {
  return readFile(data).then(function(data) {
    console.log(data);
  });
}).catch(function(err) {
  console.error(err);
});
```

上面的代码有两个链式的`Promise`，这里无论第一个`Promise`还是第二个产生了一个reject，`catch`块都会对其进行处理，而不需要额外的reject处理函数，只有两个`Promise`均fulfilled的时候，这个语句块就不会进行执行了。

### generator

生成器是基于ES6的迭代器概念的一种函数，这个函数可以被暂停执行，来方便实现异步代码。

迭代器是用来对数据结构进行遍历，也就是迭代的。每次调用`next()`方法就可以让迭代器进行一步迭代。

生成器的思想和迭代器类似，当构建了一个生成器函数的时候，我们可以对这个生成器进行迭代，不过每次迭代会让函数执行到下一个关键字`yield`标记的暂停的位置。

生成器的样子如下：

```javascript
const readFile = function(filename) {
  return new Promise(function(resolve, reject) {
    fs.readFile(filename, function(err, data) {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}
function * gen(filename) {
  const f1 = yield readFile(filename);
  const f2 = yield readFile(filename);
}
// 构建生成器
const g = gen('./readme');
// 迭代
g.next();
g.next();
g.next();
```

第一个`next()`会执行到第一个`yield`的时候暂停，来让第一个异步操作完成。

第二个`next()`会执行到第二个`yield`的时候暂停，等待第二个异步操作完成。

第三个`next()`会将函数执行完成。

如果`yield`后面跟的不是异步操作，那么会直接将同步值返回，并且仍然会暂停。

但是generator存在一个比较大的问题，就是对于现在经常使用的`Promise`需要手动进行处理，来调用`next()`函数，这也是co这种异步编程库出现的原因。

上面的生成器需要进行手动的`Promise`处理：

```javascript
const g = gen('./readme');
g.next().value.then(function(data) {
  return data.toString('utf-8');
}, function(err) {
  console.log(err);
}).then(function(data) {
  g.next(data).value.then(function(data) {
    return data.toString('utf-8');
  }, function(err) {
    console.log(err);
  }).then(function(data) {
    g.next(data);
  });
});
```

可以看到如果进行大规模的手动处理的话，会存在很大的问题，而且非常不方便，所以ES2017的预定义标准中出现了一种针对于异步编程的终极解决方案。

### async & await

async和await其实本质上就是生成器关于`Promise`的一个语法糖方案。

`async`标志类似于生成器的`*`符号，`await`类似于生成器的`yield`关键字，标记函数暂停的位置。

区别在于对于`Promise`异步，async不需要手动进行处理了，而是会自动调用`resolve`或者`reject`方法，对于异步结果进行处理，所以上面对于生成器的异步代码重写之后应该是这个样子的。

```javascript
const as = async function(filename) {
  const f1 = await readFile(filename).catch(function(err) {
    console.error(err);
    return false;
  });
  const f2 = await readFile(filename).catch(function(err) {
    console.error(err);
    return false;
  });
  console.log(f1.toString('utf-8'));
  console.log(f2.toString('utf-8'));
}
as('./readme');
```

