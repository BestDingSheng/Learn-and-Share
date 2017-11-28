# Webpack

Webpack 是一个打包器，英语叫做 bundler，意思是将不同的脚本打包成一个文件，浏览器可以运行这个文件。

Webpack 的特色。

- 能将依赖的模块，区分成不同的代码块（chunk），按需加载。
- 能将静态资源（样式表、图片、字体等等），像加载模块那样加载。

## 基本用法

Webpack 的基本用法，就是将多个文件打包成一个文件。

```bash
$ webpack ./src/App.js ./build/bundle.js
```

上面代码将`App.js`及其依赖的脚本，打包成一个文件`bundle.js`。

假定`App.js`的代码如下。

```javascript
let $ = require('jquery');
$("p").css({ color: 'red'});
```

那么，打包出来的`bundle.js`就会同时包含`App.js`和`jquery`的代码。

## 命令行用法

`--watch`或`-w`表示监视功能。一旦发现脚本有变动，就立刻重新构建。

```bash
$ webpack -w js/profile.js dist/bundle.js
$ webpack --watch
```

`--devtool`用来指定如何生成 Source map 文件。

```bash
$ webpack -w --devtool source-map js/profile.js dist/bundle.js
```

`--config`参数用来指定配置文件。

```bash
$ webpack --config ./path/to/webpack.dev.js
```

## 配置文件 webpack.config.js

Webpack 的配置文件默认为`webpack.config.js`。它采用 CommonJS 模块格式，输出一个配置对象。

下面是一个例子。

```javascript
module.exports = {
  entry: '...',
  output: '...',
  // ...
};
```

Webpack 配置对象包含多个字段。

### entry 字段

`entry`字段指定打包的入口脚本。它可以是一个字段，一个数组，也可以是一个对象。

```javascript
entry: 'app.js',

// 或者
entry: [
  'react-hot-loader/patch',
  'webpack-dev-server/client?http://localhost:8080',
  'webpack/hot/only-dev-server',
  './src/client.jsx'
],
```

`entry`的值是对象时，通常用于与`output`字段配合，打出多个包。

```javascript
module.exports = {
  entry: {
    desktop: './src/desktop.js',
    mobile: './src/mobile.js'
  },
  output: {
    path: './dist',
    filename: '[name].bundle.js',
    // 多个 bundle.js 共享的异步加载部分
    chunkFilename: '[id].common.js'
  }
};
```

### output 字段

`output`字段指定打包后的输出。

```javascript
output: {
  // 输出路径，即打包后的文件的输出路径
  path: './dist',
  // 输出文件名
  filename: 'bundle.js',
  // 浏览器的实际加载的路径，
  // 即浏览器到什么位置下载打包后的文件
  publicPath: '/',
  // 模块的输出格式，下面是指定输出为全局变量
  libraryTarget: "var",
  // 输出的全局变量的名字
  library: "Foo"
},
```

Webpack 允许文件名包含哈希，比如编译后生成形如`47a0cc1b840cb310842cb85fb5b6116c.js`的脚本名。只要文件发生过变更，哈希就会不同，这对长时间缓存文件很有帮助。

```javascript
module.exports = {
  entry: './src/main.js',
  output: {
    path: './dist',
    filename: '[hash].js'
  }
};
```

### externals 字段

`externals`字段指定哪些模块不需要打包，全局环境本身会提供。

```javascript
// 下面指定不要打包 jquery，由全局环境提供
externals: {
  "jquery": "jQuery"
},
```

### module 字段

有些文件在打包前，需要先进行处理。比如，某些新的语法需要 Babel 转码。`module.rules`用来指定转码规则。

```javascript
module: {
  loaders: [
    { test: /\.css$/, loader: 'style!css' }
  ]
},
```

### resolve 字段

`resolve`字段是一个对象，规定了模块解析的设置。

（1）`resolve.modules`

`resolve.modules`设置模块加载时，依次搜索的目录。

```javascript
resolve: {
  modules: ['node_modules', 'src']
}
```

上面的设置以后，模块的引用路径就可以简化。

下面是`src/dir1/foo.js`的源码。

```javascript
// src/dir1/foo.js
import Bar from '../dir2/bar';
```

上面代码引用`src/dir2/bar.js`。设置了`resolve.modules`以后，就可以改成下面的写法。

```javascript
import Bar from 'dir2/bar';
```

（2）`resolve.extensions`

`resolve.extensions`设置脚本文件的后缀名，即不指定脚本的后缀名时，Webpack 会自动添加的后缀名。

```javascript
resolve: {
  extensions: ['.js', '.jsx']
},
```

（3）`resolve.mainFields`

`package.json`文件里面有`main`字段，指明模块的入口文件。有时，不同的平台要求不同的入口文件，比如浏览器的入口文件很可能不同于 Node 的入口文件。

目前，通行的做法是在`package.json`里面设置三个不同的字段，指明不同平台的入口文件。

- `browser`：浏览器的入口文件
- `module`：ES6 模块格式或 CommonJS 格式的入口文件，通常是`main`文件的另一种写法
- `main`：通用的入口文件，用来覆盖默认的入口文件`index.js`

下面是一个例子（`d3`的`package.json`）。

```javascript
{
  ...
  main: 'build/d3.Node.js',
  browser: 'build/d3.js',
  module: 'index',
  ...
}
```

`resolve.mainFields`就是设置 Webpack 应该采用的入口文件。

如果 Webpack 配置文件的`target`字段设成`webworker`、`web`、或者根本没有设置，那么`resolve.mainFields`默认采用下面的值。

```javascript
mainFields: ["browser", "module", "main"]
```

上面的代码表示，Webpack 优先采用`package.json`的`browser`字段作为入口文件。如果该字段不存在，则采用`module`字段。如果`module`字段也不存在，则采用`main`字段。

`target`字段的其他值（包括设成`node`），`resolve.mainFields`字段都默认采用下面的值。

```javascript
mainFields: ["module", "main"]
```

### plugins 字段

`plugins`指定打包时需要的插件。

## require()

`require`支持模块加载以后，执行回调函数。

```javascript
require(['animals'], function(Animal) {
  var bear = new Animal('bear');
});
```

## require.ensure()

某些脚本只是在一些特定情况下运行，比如用户点击某个按钮后运行。这时，如果把它和其他必备的脚本打包在一起，会增大打包后的体积。理想的方法是视情况而定，只有满足条件时才加载。

这种动态加载就要求，该脚本与其他脚本分开打包。`require.ensure`方法就是用来指定分开打包的脚本。

```javascript
require('./a');

if (condition) {
  require.ensure([], function(require){
    require('./b');
    console.log('done!');
  });
}
```

上面代码中，`a.js`会与`b.js`打在两个包里面，默认是`bundle.js`和`0.bundle.js`。网页运行时只加载`bundle.js`，然后由`bundel.js`根据`condition`，动态加载`0.bundle.js`。

`require.ensure`方法接受三个函数。

第一个参数是一个数组，表示`0.bundle.js`依赖的模块，你可以不输入任何值，表示没有任何依赖。

第二个参数是一个回调函数，该函数将在`0.bundle.js`加载后执行。该函数的参数`require`函数，凡是在函数体内用`require`加载的模块都会被打包进入`0.bundle.js`。

第三个参数是一个字符串，表示当前`require.ensure`打包的这段代码的名字，用于使用多个`require.ensure`时，所有代码可以打包成一个文件，避免打包成多个文件。

```javascript
require.ensure([], function(require){
  require('./a');
}, 'foo');

require.ensure(['foo'], function(require){
  require('./b');
});
```

上面代码中，两段`require.ensure`将打包在一个文件里面。

注意，`require.ensure`的第一个参数只用来作为依赖模块，如果不用到它是不会运行的。

```javascript
require.ensure(['./b.js'], function(require) {
  require('./c.js');
});
```

上面代码中，如果`c.js`没有用到`b.js`，那么`b.js`是不会运行的，但是会打包在`0.bundle.js`里面。所以，不要随意把模块写在第一个参数里面。

## Loader

Webpack 的强大在于，它可以通过`require`加载任何东西。默认情况下，Webpack 认为加载的是 JavaScript 文件。如果不是，就要通过 Loader 变形。

```javascript
var css = require('css!./css/style.css');
// 等同于
var css = require('css-loader!./css/style.css');
```

上面的`css-loader`会将CSS文件转为一个字符串。

多个 Loader 可以连用。

```javascript
require('style!css!./css/style.css');
```

上面的 style-loader，会将CSS字符串转成一个`link`标签。

loader的参数

可以在配置文件里面，指定同一类文件，都使用某个loader。

```javascirpt
module.exports = {
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style!css' }
    ]
  }
};
```

还可以排除某些文件。

```javascript
      { test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      },
```

现在只要直接加载`.css`文件就可以了。

```javscript
require('./css/style.css');
```

 还可以设置 preloader

```javascript
      preLoaders: [
      { test: /\.js?$/, exclude: /node_modules/, loader: 'eslint-loader', include: __dirname + '/' }
    ],
```

## Plugin

插件都用于特定用途。

[压缩插件](http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin)

```javascript
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
    compress: {
        warnings: false
      }
    })
]
```

[提取文本](https://github.com/webpack/extract-text-webpack-plugin)：将特定代码提取为一个文件

```javascript
module.exports = {
    .....,
  module: {
    loaders: [
      // for less files
      { test: /\.less$/,
        exclude: /(node_modules|bower_components)/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader", "less-loader")
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("style.css")
  ]
}
```

## Node API

Webpack 可以在 Node 环境中调用，它是一个构造函数，接受一个配置对象作为参数，生成 Webpack 实例。

```javascript
var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

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

```javascript
// require the webpack Node.js library
var webpack = require('webpack');

webpack({
  // The first argument is your webpack config
  entry: './src/entry.js',
  output: {
    path: './dist',
    filename: 'bundle.js'
  }
}, function(err, stats) {
  // The second argument is a callback function that returns
  // more information about your bundle when it is complete
});
```

另一种写法。

```javascript
var webpack = require('webpack');

// Create an instance of the compiler
var compiler = webpack({ /* webpack config */ });

// Run the compiler manually
compiler.run(function(err, stats) { });
```

`watch`方法可以监视源文件的变动后重新编译。

```javascript
compiler.watch(/* watchDelay */ 200, function(err, stats) { });
```

## 参考链接

- [Module Bundling with Webpack: Getting Started Guide](https://www.codementor.io/javascript/tutorial/module-bundler-webpack-getting-started-guide)，by Chimeremeze Ukah
