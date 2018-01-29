## <meta>

这个标签提供关于HTML文档的元数据，元数据不会显示在页面上，这些数据对于浏览器或者搜索引擎是可读的。

### 针对SEO的meta

针对SEO的元数据都是通过`name`和`content`来进行定义的。这些东西都是表示文档级别的元数据。

* 页面关键词：用来描述网页内容的一组唯一的关键词，这些关键词用逗号分开，放在`content`字符串中。

  ```html
  <meta name="keywords" content="movie gallery, tragedy" />
  ```

* 页面描述：包括一个关于页面内容的缩略而精确的描述。在一些浏览器中，会用这个描述来作为浏览器书签的默认描述。

  ```html
  <meta name="description" content="this is a test page" />
  ```

* 网络爬虫：定义针对该页面的网络爬虫的行为。index和noindex表示当前文件是否可以被爬，follow和nofollow表示文件中的连接是否可以被爬，而all表示全都允许而none表示全都被禁止。

  ```html
  <meta name="robots" content="index, follow" />
  ```

* 页面重定向和刷新：表示文档页面在多少秒之后会被刷新，然后url会指示跳转的位置。

  ```html
  <meta http-equiv="refresh" content="3,url=./login.html" />
  ```

  下面指示的代码表示，页面在加载3秒之后会被刷新，并且跳转到当前目录下的login.html页面。

### 针对移动端样式的meta

* viewport：视口，也就是在浏览器中或者在webapp的webview组件中用来显示页面的那一个区域。这个区域的大小可能大于浏览器可见区域的大小。这个viewport叫做layout viewport，还有一个就是当前可见的视口宽度，这个叫做visual viewport。最后一个叫做ideal viewport，表示在这个宽度之下，整个页面可以在移动端完美适配，不需要横向滚动条和缩放就可以让用户查看到整个页面。

  *这个视口宽度指的是，在整个屏幕的宽度中渲染多少个实际的css像素，也就是，当设置视口宽度为800px的时候，那么在横向上，800px的css就可以填满整个视口。*

  这个属性可以配置多个可选的值，`width/height`可以设置layout viewport的高度和宽度。但是高度一般使用的很少。当这个值为`device-width`的时候，表示和设备的宽度一致。

  另外一个属性就是针对于视口缩放的，`initial-scale`表示初始化的时候，视口的缩放值，而`minimum-scale/maximum-scale`表示允许的最大和最小的缩放值，`user-scalable`表示是否允许用户对于该页面进行缩放。

```html
<meta name="viewport" content="initial-scale=1, width=device-width" />
```

​	上面的代码可以保证在任何浏览器的情况下，整个视口的宽度保证		为ideal viewport。

​	在默认情况下，手机浏览器会按照桌面浏览器一致的宽度对于页面进行渲染，但是这样会出现横向滚动条，并且字体会变的很小难以识别。也就是视口宽度为layout viewport。需要通过上面的代码将视口的宽度收缩回一个合理的位置。

* WebApp全屏模式：将WebApp伪装成离线应用模式。

```html
<meta name="apple-mobile-web-app-capable" content="yes" />
```

* 隐藏状态栏/设置状态栏颜色：

```html
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

### 网页相关

* 说明网页编码，这里的编码值最好使用utf-8，这样可以避免交叉脚本攻击，这个声明必须放在页面的前512个字节，因为浏览器解析的时候，会首先读取512个字节来确定页面编码格式。基本上必须要使用这个标签。

```html
<meta charset="utf-8">
```

* 优先使用IE的最新版本和Chrome进行渲染，避免在进行升级之后，导致某些部分的渲染出错。

```html
<meta http-equiv="X-UA-Compatible" content="IE=edge, chrome=1" />
```

* 禁止从浏览器本地缓存中读取页面的内容：也就是要求强制进行联网加载页面。

```html
<meta http-equiv="Pragma" content="no-cache" />
```

