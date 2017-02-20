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