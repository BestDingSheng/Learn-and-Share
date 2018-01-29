## webpack

### 概念

webpack将项目中的所有资源打包，让浏览器不需要关注考虑这些。

webpack将每个文件都作为模块处理，然而webpack只理解JavaScript，所以需要loader来将资源转换为模块。

```javascript
module: {
  rules: [
    { test: /\.txt$/, use: 'raw-loader' }
  ]
}
```

这个loader的配置展示了webpack loader的主要任务：

1. 识别出应该被对应loader进行转换的文件(`test`)，
2. 转换这些文件，转换为JavaScript并添加到依赖(`use`)。

> 在解析文件的时候，如果引入了后缀为txt的文件，就使用`raw-loader`将该文件转换为JavaScript。

webpack的插件可以在编译和打包的声明周期提供更多的方法，需要将其添加到`plugins`数组中并且通过`new`关键字进行实例化。

#### webpack支持的模块形式

webpack支持的模块依赖方式包括：

1. ES6的`import`语句；
2. CommonJS的`require`语句；
3. AMD的`define`和`require`语句；
4. css/sass/less的`@import`语句；
5. 样式的`url()`或者HTML的`<img src=>`中的图片链接。

通过这些依赖获取的任何模块都可以用对应的loader对其进行解析并且加载，在打包好的文件中引入这些依赖。

webpack接收三种路径方式：*绝对路径*、*相对路径*、*模块路径*，重点是第三种方式，模块将会在`resolve.modules`配置项指定的目录内搜索。并且可以使用`resolve.alias`为替换模块路径创建一个别名。

在完成了模块解析之后，webpack会生成一张依赖图来表示所有模块的依赖关系。

#### webpack打包的代码类型

1. 自己编写的源代码
2. 源代码依赖的各种第三方库或者`vendor`代码
3. webpack的runtime和manifest，来管理模块的交互

Runtime和Manifest负责在浏览器运行的时候，将打包好的各种代码连接起来，执行各个模块的依赖以及懒加载模块的执行逻辑。

### 开发环境

#### 热模块替换

这个功能允许在运行的时候更新各种模块，而不需要进行完全刷新。

在开发环境下，使用`webpack-dev-server`：

```javascript
plugins: [
  new webpack.HotModuleReplacementPlugin()
],
devServer: {
  hot: true,
  port: 9000,
  contentBase: path.resolve(__dirname, 'dist')
}
```

这里`contentBase`属性表示告诉服务器从哪里提供内容。也就是服务器的根目录。webpack-dev-server打出来的包并没有存在磁盘上，而是存在了内存中。

`publicPath`属性指定了资源文件被访问的路径，默认为`/`，如果设置`publicPath: '/assets/'`，那么就需要访问`http://localhost: 9000/assets/`来访问该项目。

#### 区分环境来使用不同配置

一般开发环境和生产环境下，需要使用的插件和配置都不尽相同，比如开发下需要使用`devServer`，生产下需要`UglifyJsPlugin`，并且开发和生产环境下使用的`sourceMap`也是不同的，一般使用两个配置文件来区分，`webpack.prod.js`和`webpack.dev.js`，然后在`package.json`文件中指定`build`的环境。

```JSON
// package.json
"scripts": {
  "build:dev": "webpack --env=dev --progress --profile --colors",
  "build:prod": "webpack --env=prod --progress --profile --colors"
}
// webpack.config.js
module.exports = function(env) {
  return require(`./webpack.${env}.js`);
}
```

使用`webpack-merge`可以将文件进行合并，这样就可以提取出两个环境下的公共模块，然后再将公共模块和私有模块合并，生成一个该环境下的配置文件。

```javascript
const Merge = require('webpack-merge');
const CommonConfig = require('./webpack.common.js');

module.exports = Merge(CommonConfig, {
  // 这里添加一些公用的模块
})
```

主要将所有的配置文件合并了之后，放在指定目录下面要注意路径。

#### 缓存

在生产环境进行打包的时候，由于对代码进行了拆分，并且每个模块都使用的了固定的名字，不利于进行缓存的更新，客户端验证只能够通过`Etag`和`Last-Modified`进行判断。

为每个模块添加哈希可以直接判断出文件的修改情况。但是这样又会导致一些没有被修改的文件哈希发生变化。

使用`[chunkhash]`可以对文件生成唯一的哈希，也就是文件发生了变化，哈希值才会发生变化。但是由于文件模块的依赖，所以`manifest`会在每次打包的时候都发生变化，这时候为了不影响`manifest`所在的模块的哈希变化，可以将`manifest`模块通过`CommonChunkPlugin`单独提取出来，或者通过`ChunkManifestWebpackPlugin`来将`manifest`提取到一个单独的JSON文件中。

`[name].[chunkhash]`应该只在生产模式中使用，在开发模式中仍然使用`[name]`，这样可以减少代码编译的时间。

#### resolve

`resolve`选项能够设置模块如何被解析，webpack提供的是默认值，这里可以对一些细节进行修改。当模块发生依赖，比如在`index.js`中`require('lodash')`，那么这里负责对于`lodash`的查找方式进行修改。

`resolve.alias`可以配置模块依赖的别名：

```javascript
// webpack.config.js
alias: {
  Commons: path.resolve(__dirname, '../node_modules')
}
// index.js
import xor from 'Commons/lodash/xor.js'
import xor from '../node_modules/lodash/xor.js'
// 这两段代码的模块引入的结果是相同的
```

#### externals

可以防止将某些依赖模块包打包到`bundle`中，而是在运行时从外部获取这些扩展依赖模块。

对于一些外部CDN提供的模块，可以将其放到`externals`里面，并且给其别名，通过别名进行引入，这些资源需要在HTML里面首先进行加载：

```html
<head>
  <script src="//cdn.bootcss.com/lodash.js/4.17.4/lodash.min.js"></script>
  <script src="//cdn.bootcss.com/jquery/3.2.1/jquery.min.js"></script>
</head>
```

```javascript
// webpack.config.js
entry: {
  'index': path.resolve(__dirname, '../src/index.js')
}
// 注意这里引入的模块标识必须要和外部模块所导出的一致，比如第二个使用'lodash': 'lodash'就是不可以的
externals: {
  'jquery': 'jQuery',
  'lodash': '_'
}

// index.js
import $ from 'jquery';
import _ from 'lodash';
```

这样，外部模块就可以不打包到bundle中，而是通过外部的CDN进行引入了。

### 插件

#### `CommonsChunkPlugin`

这个插件可以提取公共模块，然后将这些模块打包，这些模块可以被浏览器缓存，提升下次访问的速度。

`name`参数指定需要打包的模块，在多入口文件的情况下，这些入口文件引用的公共模块将会被打包到该数组的第一个模块内，其余的模块将会按照`entry`指定的模块进行打包，如果没有匹配的模块，那么这个将会生成一个空的模块，并且*最后一个指定的模块中会被打包进加载逻辑，所以这个模块需要在HTML中最后一个引用。*

`minChunks`参数指定多入口文件中，某个模块需要最少被引用多少次才会被打包进公共模块中。

`chunks`数组参数表示通用模块打包时引用的入口文件，在这个数组之外的入口文件的内容将不会被考虑在共有模块打包的范围之内。

指定`name`参数包含`'manifest'`会将webpack模块的启动模块打包进这个文件中，由于webpack模块加载的启动模块无论有多少个参与公共模块提取的模块都需要打包，所以其`minChunks`参数必须指定为`Infinity`。

```javascript
const path = require('path');
const srcPath = path.resolve(__dirname, './src/');
const config = {
  entry: {
    'vendor': ['jquery'],
    'index': srcPath + '/index.js',
    'home': srcPath + '/home.js',
    'person': srcPath + '/person.js'
  }
  // some webpack configure logic
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: ['chunk', 'vendor'],
  	  minChunks: 2,
      chunks: ['index', 'home']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity
    })
  ]
}
```

这样打包出来的结果是：

1. `index.js`、`home.js`、`person.js`，三个业务模块的业务逻辑；
2. `chunk`，index和home两个模块的公有模块业务逻辑；
3. `vendor`，jquery外部依赖模块；
4. `manifest`，webpack的模块启动逻辑，*该模块必须在HTML中最后加载*。

一个chunk的多个子chunk可能会有公共的依赖，为了防止重复，可以将这些依赖移入到父chunk中。

这里需要设置`chilren: true`参数。

#### `HtmlWebpackPlugin`

这个插件可以为你生成一个HTML5文件，这个文件中的script包含对于脚本的引用。

并且插件可以使用ejs模板来生成HTML文件，还可以给模板里面传入参数。

```javascript
plugins: [
  new HtmlWebpackPlugin({
    name: 'index.html',
    title: 'Template',
    template: './template.ejs'
  })
]
```

```ejs
<!DOCTYPE HTML>
<html>
  <head>
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    
  </body>
</html>
```

会自动生成带有所有模块script标签的HTML文件。

#### `DefinePlugin`

允许创建一些在编译时可以配置的常量，对于区分开发模式或者是生产模式来说很好用。

```javascript
plugins: [
  new webpack.DefinePlugin({
    PRODUCTION: JSON.stringify(true),
    VERSION: JSON.stringify("5afc2d")
  })
]
```

#### `clean-webpack-plugin`

用来在构建代码之前，对于之前已经构建好的代码进行移除。

```javascript
const distPath = path.resolve(__dirname, './dist');

plugins: [
  new CleanWebpackPlugin(distPath, {
    verbose: true
  })
]
```

#### `uglifyjsWebpackPlugin`

这个插件可以将js代码用uglify进行压缩。

由于这个插件在开发环境下基本没什么用，并且会严重影响开发时候文件的打包速度，所以这个插件基本只会用在生产环境中。

#### `DllPlugin`和`DllReferencePlugin`

可以将一些比较大的外部库打包成类似windows的dll静态库，这样在开发环境下调试的时候，这些库如果不发生改变，那么就不需要重新打包，加快了打包的速度。

`DllPlugin`用来配置当前打包过程中，库的位置，以及一些打包的信息，这些最后会得到一个完整的库文件以及一个配置的`manifest`文件。

```javascript
// webpack.vendor.js
// 这个配置文件用来对需要的库进行打包
const config = {
  entry: {
    vendor: ['lodash', 'jquery']
  },
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dist/dll'),
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '../dist/dll/[name]-manifest.json'),
      // 这里的name要和output.library相同，否则引用会出问题。
      name: '[name]_library'
    })
  ]
}
// webpack.dev.js
const config = {
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.resolve(__dirname, '../dist/'),
      manifest: require(path.resolve(__dirname, '../dist/dll/vendor.manifest.json'))
    })
  ]
}
// 在HTML文件中需要对打包出来的内容进行引用，然后通过插件的manifest属性，来对打包的模块的
// 依赖进行配置。
```

