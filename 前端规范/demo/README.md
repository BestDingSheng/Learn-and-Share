##配置入门教程

到 nodejs[官网](http://nodejs.cn/) 下载安装
命令行输入 
`node -v` `npm -v`
输出版本信息，安装成功

#####初始化目录
创建项目目录，命令行cd到当前目录
运行`npm init`,初始化项目信息,会生成一个package.json的文件
[package.json文件详解](http://www.cnblogs.com/tzyy/p/5193811.html)

```javascript
├─ dist		             	打包输出目录, 只需部署这个目录
├─ package.json           	项目配置信息
├─ node_modules           	npm安装的依赖包都在这里面
├─ index.html               入口html
├─ src              		我们的源代码
│   ├─ components		    可以复用的模块放在这里面
│	├─ assets			    资源文件
│   ├─ app.js			    入口js
│   ├─ libs				    不在npm和git上的库扔这里
│   └─ views			    页面放这里
├─ .babelrc               	babel编译配置
├─ .eslintrc               	eslint配置
├─ .eslintignore            eslint忽略文件配置
├─ postcss.config.js        postcss配置
└─ webpack.config.js		webpack配置文件
```
（大致目录，可根据项目调整）

#####webpack
webpack 可以用npm 命令来装
`npm install webpack -g` 
安装开发工具
`npm install webpack-dev-server -g`
`webpack --version`看是否是2.x, 使用2.x的版本
在项目根目录创建`webpack.config.js`文件
```javascript
const { resolve } = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  // 配置页面入口js文件
  entry: {
    index: './src/app.js'
  },
  // 配置打包输出相关
  output: {
    // 打包输出目录
    path: resolve(__dirname, './dist'),
    // 入口js的打包输出文件名
    filename: '[name].js'
  },
  module: {
    /*
    配置各种类型文件的加载器, 称之为loader
    webpack当遇到import ... 时, 会调用这里配置的loader对引用的文件进行编译
    */
    rules: [
      // 用来解析vue后缀的文件
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            sass: ExtractTextPlugin.extract({
              use: ['css-loader', 'sass-loader', 'postcss-loader'],
              fallback: 'style-loader'
            })
          },
          //postcss配置浏览器前缀
          postcss: [require('autoprefixer')({
            browsers: ['last 5 versions', 'android >= 4.2', 'ios >= 7']
          })]
        }
      },
      {
        /*
        使用babel编译ES6/ES7/ES8为ES5代码
        */
        test: /\.js$/,
        // 排除node_modules目录下的文件, npm安装的包不需要编译
        exclude: [/node_modules/, resolve(__dirname, './src/libs')],
        /*
        use指定该文件的loader, 值可以是字符串或者数组.
        这里先使用eslint-loader处理, 返回的结果交给babel-loader处理.
        eslint-loader用来检查代码, 如果有错误, 编译的时候会报错.
        babel-loader用来编译js文件.
        */
        use: ['babel-loader', 'eslint-loader']
      },
      {
        // 匹配.css文件
        test: /\.css$/,
        /*
        先使用css-loader处理, 返回的结果交给style-loader处理.
        */
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        }) 
      },
      {
        // 匹配sass文件
        test: /\.sass$/,
        /*
        先使用sass-loader处理, 返回的结果交给css-loader处理
        */
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader', 'postcss-loader']
        }) 
      },
      {
        /*
        匹配各种格式的图片和字体文件
        */
        test: /\.(png|jpg|jpeg|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
        /*
        使用url-loader, 它接受一个limit参数, 单位为字节(byte)
        当文件体积小于limit时, url-loader把文件转为Data URI的格式内联到引用的地方
        */
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: 'img/[name].[hash:7].[ext]'
            }
          }
        ]
      }
    ]
  },
  /*
  配置webpack插件
  */
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve(__dirname, 'index.html'),
      inject: 'true'
    }),
    new ExtractTextPlugin({
      filename: 'style.css',
      allChunks: true
    }),
    new webpack.HotModuleReplacementPlugin() 
  ],
  /*
  配置开发时用的服务器, 让你可以用 http://127.0.0.1:8100/ 这样的url打开页面来调试
  */
  devServer: {
    // 配置监听端口, 因为8080很常用, 为了避免和其他程序冲突, 我们配个其他的端口号
    port: 8100,
    /*
    historyApiFallback用来配置页面的重定向
    */
    historyApiFallback: true
  },
  resolve: {
    extensions: ['.js', '.vue', '.css']
  },
  // eval-source-map is faster for development
  devtool: '#eval-source-map'
}
```
安装webpack和插件
`npm install webpack --save-dev`
`npm install webpack-dev-server --save-dev`
`npm install html-webpack-plugin --save-dev`
`npm install extract-text-webpack-plugin@2.0.0-rc.3 --save-dev`

安装vue
`npm install vue --save`
安装sass的解析器
`npm install node-sass --save-dev`
`npm install sass-loader --save-dev`
安装vue的加载器,用来解析vue的组件,.vue后缀的文件
`npm install vue-template-compiler@^2.0.0 vue-loader css-loader style-loader file-loader url-loader --save-dev`
使用postcss配置浏览器前缀
`npm install postcss-loader autoprefixer --save-dev`
添加`postcss.config.js`
```javascript
module.exports = {
  plugins: [
    require('autoprefixer')()
  ]
}
```
安装babel，一般的浏览器是不认识es6语法的，babel的作用是将es6的语法编译成浏览器认识的语法
`npm install babel-core babel-loader babel-preset-es2015 babel-preset-stage-2 babel-eslint --save-dev`
在根目录添加`.babelrc`文件，配置es6的编译
```javascript
{
  "presets": [
    ["es2015",{ "modules": false }],"stage-2"
  ]
}
```
安装eslint, 用来检查语法报错, 当我们书写js时, 有错误的地方会出现提示
`npm install eslint eslint-config-enough eslint-loader --save-dev`
在根目录添加`.eslintrc`文件
```javascript
{
  "extends": "enough",
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "node": true
  },
  "rules": {
    "no-trailing-spaces": 0,
    "no-console": 0,
    "no-unused-vars": 0,
    "no-useless-escape": 0
  }
}
```
文件夹需要忽略检查添加`.eslintignore`,在里面添加文件夹目录
```javascript
/src/libs
```
[Eslint配置](http://www.jianshu.com/p/1682b91756b1)

#####简单的demo
index.html
```javascript
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Document</title>
</head>
<body>
  <div id="app"></div>
</body>
</html>
```

在src的views目录里面新建App.vue
```javascript
<!-- 简单写个title和一个循环 -->
<template>
    <div id="example">
        <h1>{{ msg }}</h1>
        <ul>
            <li v-for="n in 5">{{ n }}</li>
        </ul>
    </div>
</template>

<script>
export default {
    data () {
        return {
            msg: 'Hello World!'
        }
    }
}
</script>

<style lang="sass">
#example {
    background: red;
    height: 100vh;
}
</style>
```
app.js
```javascript
/* 引入vue和主页 */
import Vue from 'vue'
import App from './views/App.vue'

/* 实例化一个vue */
new Vue({
  el: '#app',
  render: h => h(App)
})
```
命令行输入`webpack-dev-server`
打开浏览器访问`localhost:8100`