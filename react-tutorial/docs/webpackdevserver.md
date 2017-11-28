# WebpackDevServer

WebpackDevServer在脚本中调用时，第一个参数是Webpack的实例，第二个参数是配置对象。

```javascript
var server = new WebpackDevServer(webpack(config), {
  contentBase: './dev',
  publicPath: config.output.publicPath,
  hot: true
});

server.listen(3000, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:3000');
});
```

- `contentBase`属性指定HTTP服务器对外访问的主目录，即源文件应该在这个目录。
- `publicPath`属性指定静态资源的目录，它是针对网站根目录的，而不是针对服务器根目录。比如，设定`publicPath: "/assets/"`和`file: "bundle.js"`以后，`bundle.js`的位置就是`/assets/bundle.js`。

## 配置文件

`webpack.config.js`里面的`devServer`字段，用来配置 Dev server。

- hot：是否打开热替换
- contentBase：存放静态文件的位置
- publicPath：存放打包文件的位置，一般与`output.publicPath`相同。
- historyApiFallback：发生 404 错误时打开的位置

下面是一个例子。

```javascript
 devServer: {
    contentBase: './dist',
    // 是否开启 hot-loader
    hot: true,
    // 是否兼容BrowserHistory
    historyApiFallback: true
},
```

Dev server 的配置，也可以在命令行设置。

```bash
$ webpack-dev-server --inline --hot --content-base ./path/to/index.html
```


