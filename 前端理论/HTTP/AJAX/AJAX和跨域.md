## AJAX和跨域

### AJAX

AJAX代表(Asynchronous JavaScript And XML)，简而言之就是使用`XMLHttpRequest`对象来实现和服务端的通信。AJAX的主要特性有下面两个：

* 在不刷新页面的情况下完成对于服务器的请求。
* 从服务端接收数据并且对数据进行处理。

#### 进行一次HTTP请求

由于现在基本不需要考虑IE7以下浏览器的兼容性，所以AJAX对象只需要使用`XMLHttpRequest`构造函数来定义就可以了。然后需要给AJAX对象的`onreadystatechange`属性赋值一个函数，这个函数由于不是我们直接调用，所以该函数不能够包含任何参数，如果要包含参数的话，请使用IIFE来包含，然后是打开和服务端的连接，并且发送请求，分别使用`open`和`send`方法。

##### `open方法`

该方法的第一个参数表示请求的方法，任何符合服务器支持的方法都可以使用，字符串必须是全大写的，否则服务端不会接受该请求。

第二个参数表示要请求的URL，出于安全考虑，默认情况下不能从第三方域名请求数据。也就是禁止跨域，跨域会在下面一个部分说。

还有一个可选的第三个参数，这个参数表示该请求是同步的还是异步的。如果设置为`true`或者默认情况下都表示异步请求。

##### `send`方法

该方法是请求的时候想要发送的数据。这些数据可以是JSON、XML、表单或者可以解析的查询字符串`name=value&anothername=this`。如果想要POST数据的话，需要设置HTTP的`Content-Type`首部，使用`setRequestHeader`方法来进行设置。

#### 处理服务端响应

之前在请求的时候添加一个处理响应的回调函数，所有的响应都应该在这个回调中进行处理。首先要判断请求的状态是否完成。`readyState`属性会随着请求的进展发生变化，当`readyState`的状态变为4之后，表示请求已经完成，并且响应也已经准备好了。完成状态也可以用`XMLHttpRequest.DONE`来表示。

`status`状态表示当前HTTP请求的状态码，根据这些状态码进行相应的处理。

`responseText`和`responseXML`属性中包含的内容就是请求所得到的响应字符串或者XML。

如果通信出现了错误，那么在`onreadystatechange`回调函数中会抛出一个异常，可以对异常进行捕获和处理，*这里是通信出现了异常，而不是服务器响应了一个错误的状态码。*

```javascript
const xmlHttp = new window.XMLHttpRequest();
xmlHttp.onreadystatechange = function() {};
xmlHttp.open('GET', 'http://localhost:8080');
xmlHttp.send();
```

##### AJAX上传文件和提交表单

使用AJAX提交表单有两种主要的方法，一个是仅仅使用AJAX，另外一个是和FormData的API配合使用。

1. 仅使用AJAX

如果不需要上传文件的话，那么可以不用使用任何其他的API来作为辅助。最简单的方法就是将需要发送的参数拼接为可以解析的参数字符串发送到服务端，这时候需要注意转义问题，使用`Content-Type: application/x-www-form-urlencoded`来发送，或者使用纯文本格式发送，`Content-Type: text/plain`。

2. 使用FormData

FormData比较方便，但是仅支持POST方法上传表单，通过`new FormData()`构建表单对象，然后调用表单对象的`append()`方法将一个个参数挂载进去就可以了，并且支持文件上传。

##### FormData

`FormData`有几个需要注意的地方：

* 如果直接使用一个表单的DOM元素来构造`FormData`的话，所有的需要上传的项目都需要有`name`属性，这个属性是提交到后台时候的键，会自动和表单里面获取的值对应起来。
* 对于文件元素，如果需要单独`append`进去的话，获取文件元素内容的方法是`document.querySelector('#file').files[0]`，如果是多个文件的话，就是一个数组。

`FormData`使用：

```javascript
var submit = document.querySelector('button');
submit.addEventListener('click', function(event){
  event.preventDefault();
  var formData = new FormData();
  formData.append('username', document.querySelector('#username'));
  formData.append('file', document.querySelector('#file').files[0]);
  // 初始化XMLHttpRequest对象等
  xmlHttp.send(formData);
})
```



##### AJAX的一些方法

* `setRequestHeader`：可以用来设置AJAX请求的首部信息，这个方法需要介于`open`和`send`之间调用才可以。并且是append方式而不是override覆盖。

* `getAllResponseHeaders()`：可以用来获取响应的首部字段信息。这些获取仅限于6个简单首部以及CORS相关的首部。

* `responseType`属性：用来标记客户端需要的响应的类型，这个是AJAX level2添加的功能。比如设置为`xmlHttp.responseType = 'JSON'`，那么获取的数据就直接是JSON对象了，很容易进行解析。而XML类型的格式可以直接使用DOM操作来进行解析，也很方便。

* 上传和下载进度的获取：`xmlHttp.onprogress`、`xmlHttp.onload.onprogress`这两个事件可以添加回调函数，分别为下载和上传的进度，这两个事件回调的事件对象中可以获取需要下载/上传的数据大小以及已经完成的数据大小。

* AJAX的事件触发顺序：

  1. `xmlHttp.onreadystatechange`：并且会在以后每次`readyState`发生变化的时候触发。

  2. `xmlHttp.onloadstart`：调用`send`方法后会立刻触发。表示上传阶段开始。

  3. `xmlHttp.onload`：这个阶段表示上传阶段，也就是从客户端到服务端的上传，分为四个事件触发：

     `xmlHttp.upload.onloadstart`、`xmlHttp.upload.onprogress`、`xmlHttp.upload.onload`、`xmlHttp.upload.onloadend`。

  4. 下载阶段的事件：`xmlHttp.onprogress`、`xmlHttp.onload`、`xmlHttp.onloadend`三个事件。

### 跨域

#### 同源策略

浏览器为了保证用户信息的安全，对于域名、协议、端口三者不是完全相同的A，B页面做了限制，也就是A网站的资源B网站不能够访问，包括：

1. Cookie、localStorage、IndexDB不能够读取；
2. DOM无法获得；
3. AJAX请求不能够发送；

#### AJAX跨域

同源策略规定，AJAX请求只能够发送给同源的网址，否则会报错。

##### JSONP

JSONP是最常用的跨域通信方法，将一个`<script>`标签插入到页面中。并且设置一个回调函数，服务器在接收到这个请求的时候，会将数据放在回调函数的参数中并且返回。

如果使用的是NodeJS服务器，那么需要对服务器进行一定的改造，这时候不能够直接返回JSON的数据内容，而是解析请求里面的`callback`参数，将返回的内容作为参数和`callback`的值连接起来。

```javascript
// client 构建一个新的script标签，将回调函数传入路径，采用这种方式也就表示了JSONP只能够
// 用于GET请求的跨域
function foo(result) {
  console.log(result);
}
const scriptDOM = document.createElement('script');
scriptDOM.setAttribute('type', 'text/javascript');
scriptDOM.setAttribute('src', 'http://localhost:8080?callback=foo');
// server nodejs 服务端将数据和函数整合到一起，数据作为函数参数传入，然后这个脚本被加载
// 到客户端之后会被直接执行，类似于回调函数的功能
server.on('request', function(req, res){
  const callback = req.url.split('=')[1];
  const responseJSON = JSON.stringify({
    'response': true
  });
  res.end(`${callback}(${responseJSON})`);
});
```

##### CORS(Cross-origin resource sharing)

CORS全称跨域资源共享，可以允许浏览器向跨域服务器发出AJAX请求。CORS需要浏览器和服务器的同时支持，IE版本不能低于IE10。浏览器一旦发现了一个AJAX请求是跨域的，就会自动添加一些附加的头信息。针对简单请求，也就是`GET`、`POST`、`HEAD`三种请求方式，浏览器会直接为其添加`Origin`首部字段，这个字段的值是用来标识当前的AJAX请求来自于哪个源的。

1. 首先支持CORS的客户端发起一次跨域的AJAX请求，并且将当前页面的源写入HTTP请求的`Origin`首部中。下面的例子是从本地的9000端口跨域请求到8080端口。

   ```http
   GET / HTTP/1.1
   Host: localhost:8080
   Origin: http://localhost:9000
   ```

2. 服务端接收到了这次请求，发现了这次请求含有`Origin`首部，并且`Origin`首部的信息和自己设置的`Access-Control-Allow-Origin`一致，那么就会给客户端返回一个含有CORS首部内容的响应。这个响应会被浏览器正确解析，实现跨域AJAX请求。

   ```javascript
   server.on('request', function(req, res){
     const responseJSON = JSON.stringify({
       'response': true
     });
     // 这里 * 表示可以接受来自任意源的跨域AJAX请求
     res.setHeader('Access-Control-Allow-Origin', '*');
     res.end(responseJSON);
   });
   ```

   这时候浏览器接收到的响应报文是这样的：

   ```http
   HTTP/1.1 200 OK
   Access-Control-Allow-origin: *
   Date: Thu, 22 Jun 2017 07:24:21 GMT
   Connection: keep-alive
   ```

3. 如果不一致，那么服务端就会返回一个一般的AJAX响应，而这个响应会导致浏览器直接抛出异常。

还有另外两个用于CORS的首部字段：

* `Access-Control-Allow-Credentials`：这个值是一个布尔值，表示是否允许发送Cookie，默认情况下是不允许的，需要将这个值设置为`true`才可以。
* `Access-Control-Expose-Headers`：在默认情况下，`XMLHttpRequest`对象的`getResponseHeader()`方法只能够拿到6个基本的首部信息，其他的首部信息必须要通过这个首部指定了才可以获取。

*而对于非简单请求，首先需要一次预检请求，才能够进行下一步操作*，但是由于AJAX一般不进行这些非简单方法，所以使用的较少。

##### CORS和JSONP的比较

CORS可以针对所有的请求方法来进行AJAX跨域请求修复，而JSONP所有的请求最终都是通过GET方法实现的，局限性太大。但是CORS需要比较新的浏览器支持，基本上已经放弃了IE10以下的版本，所以如果需要对旧版浏览器兼容的话，就需要使用JSONP来进行hack。

##### document.domain

`document.domain`这个属性用来表示下载当前文档的服务器域名。

为了防止有些人为了窃取页面数据，所以这个属性只能够修改成和当前文档域名相同的基础域名，也就是如果当域名的基础域名部分不相同的时候，是不能够使用修改这个属性的方法来跨域子域的。

也就是在主域相同的情况下，可以将`document.domain`设置成当前域名的父级目录。

比如将`"www.example.com/a.html"`切换成`"www.example.com/b.html"`。

这样跨域的方法一般是用在获取其他窗口的内容的，这个方法和AJAX的跨域没有什么关系。比如在一个文档里面嵌入一个`<iframe>`标签，根文档和iframe文档属于相同基础域名内部的不同子域，这样也会导致出现跨域限制，也就是根文档并不能够访问iframe标签的内部信息。为了可以进行访问，将根文档的`document.domain`设置为比较高级的域，就可以访问iframe标签里面的内容了。

##### window.postMessage

这个是HTML5中加入的一个窗口通信的方法，这个方法可以用于窗口之间的通信，这个方法可以不会被浏览器同源策略所限制，也就是无论是否同源都可以进行window的通信。

但是这个方法必须要在两个页面中都设置对应的方法或者接受函数来进行通信。

```
// the window
window.onload = function() {
  window.frames[0].postMessage('getcolor', 'httpL//lslib.com');
}
// the other window
window.addEventListener('message', function(e) {
  var color = document.body.style.backgroundColor
  window.parent.postMessage(color, '*');
})
```

这个方法其实也是用来进行根窗口和子窗口进行通信的。也不算是AJAX跨域的一个方法。