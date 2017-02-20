# css

####  通用约定

#### 代码组织
* 以组件为单位组织代码段；
* 制定一致的注释规范；
* 组件块和子组件块以及声明块之间使用一空行分隔，子组件块之间三空行分隔；
* 如果使用了多个 CSS 文件，将其按照组件而非页面的形式分拆，因为页面会被重组，而组件只会被移动；

良好的注释是非常重要的。请留出时间来描述组件（component）的工作方式、局限性和构建它们的方法。不要让你的团队其它成员 来猜测一段不通用或不明显的代码的目的。

提示：通过配置编辑器，可以提供快捷键来输出一致认可的注释模式。

```css 
1、文件顶部注释（推荐使用）

/* 
* @description: 中文说明 
* @author: name 
* @update: name (2013-04-13 18:32) 
* */

2、模块注释

/* module: module1 by 张三 */ … 
/* module: module2 by 张三 */

模块注释单独写在一行

3、 单行注释与多行注释

/* this is a short comment */

单行注释可以写在单独一行，也可以写在行尾，注释中的每一行长度不超过40个汉字，或者80个英文字符。

/** this is comment line 1.* this is comment line 2.*/

多行注释必须写在单独行内

4、特殊注释

* TODO: xxxx by name 2013-04-13 18:32 */

/* BUGFIX: xxxx by name 2012-04-13 18:32 */

用于标注修改、待办等信息

5、区块注释

/* Header */ /* Footer */ /* Gallery */

对一个代码区块注释（可选），将样式语句分区块并在新行中对其注释。
```
#### Class 和 ID
* 使用语义化、通用的命名方式；
* 使用连字符 - 作为 ID、Class 名称界定符，不要驼峰命名法和下划线；
* 避免选择器嵌套层级过多，尽量少于 3 级；
* 避免选择器和 Class、ID 叠加使用；

出于[性能考量](http://www.stevesouders.com/blog/2009/06/18/simplifying-css-selectors/)，在没有必要的情况下避免元素选择器叠加 Class、ID 使用。

元素选择器和 ID、Class 混合使用也违反关注分离原则。如果 HTML 标签修改了，就要再去修改 CSS 代码，不利于后期维护。
```CSS 
/* Not recommended */
.red {}
.box_green {}
.page .header .login #username input {}
ul#example {}

/* Recommended */
#nav {}
.box-video {}
#username input {}
#example {}
```
#### 声明块格式
* 选择器分组时，保持独立的选择器占用一行；
* 声明块的左括号 `{ `前添加一个空格；
* 声明块的右括号 `}` 应单独成行；
* 声明语句中的 `:` 后应添加一个空格；
* 声明语句应以分号 `;` 结尾；
* 一般以逗号分隔的属性值，每个逗号后应添加一个空格；
* `rgb()`、`rgba()`、`hsl()`、`hsla()`或 `rect()`括号内的值，逗号分隔，但逗号后不添加一个空格；
* 对于属性值或颜色参数，省略小于 1 的小数前面的 0 （例如，`.5` 代替 `0.5`；`-.5px` 代替 `-0.5px`）；
* 十六进制值应该全部小写和尽量简写，例如，`#fff` 代替 `#ffffff`；
* 避免为 0 值指定单位，例如，用 `margin: 0;` 代替 `margin: 0px;`；

```css
/*  Not recommended  */
.selector, .selector-secondary, .selector[type=text] {
  padding:15px;
  margin:0px 0px 15px;
  background-color:rgba(0, 0, 0, 0.5);
  box-shadow:0px 1px 2px #CCC,inset 0 1px 0 #FFFFFF
}

/* Recommended */
.selector,
.selector-secondary,
.selector[type="text"] {
  padding: 15px;
  margin-bottom: 15px;
  background-color: rgba(0,0,0,.5);
  box-shadow: 0 1px 2px #ccc, inset 0 1px 0 #fff;
}
```

#### 声明顺序
相关属性应为一组，推荐的样式编写顺序
1. Positioning
2. Box model
3. Typographic
4. Visual

由于定位（positioning）可以从正常的文档流中移除元素，并且还能覆盖盒模型（box model）相关的样式，因此排在首位。盒模型决定了组件的尺寸和位置，因此排在第二位。

其他属性只是影响组件的内部（inside）或者是不影响前两组属性，因此排在后面。
```css 
.declaration-order {
  /* Positioning */
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;

  /* Box model */
  display: block;
  box-sizing: border-box;
  width: 100px;
  height: 100px;
  padding: 10px;
  border: 1px solid #e5e5e5;
  border-radius: 3px;
  margin: 10px;
  float: right;
  overflow: hidden;

  /* Typographic */
  font: normal 13px "Helvetica Neue", sans-serif;
  line-height: 1.5;
  text-align: center;

  /* Visual */
  background-color: #f5f5f5;
  color: #fff;
  opacity: .8;

  /* Other */
  cursor: pointer;
}
```

#### 引号使用
`url()`、属性选择符、属性值使用双引号。 参考 [Is quoting the value of url() really necessary?](http://stackoverflow.com/questions/2168855/is-quoting-the-value-of-url-really-necessary)
```css
/* Not recommended */
import url(//www.google.com/css/maia.css);

html {
  font-family: 'open sans', arial, sans-serif;
}

/* Recommended */
import url("//www.google.com/css/maia.css");

html {
  font-family: "open sans", arial, sans-serif;
}

.selector[type="text"] {

}
```

#### 媒体查询（Media query）的位置
将媒体查询放在尽可能相关规则的附近。不要将他们打包放在一个单一样式文件中或者放在文档底部。如果你把他们分开了，将来只会被大家遗忘。
```css 
.element { ... }
.element-avatar { ... }
.element-selected { ... }

@media (max-width: 768px) {
  .element { ...}
  .element-avatar { ... }
  .element-selected { ... }
}
```
#### 不要使用 `@import`
与`<link>`相比，`@import` 要慢很多，不光增加额外的请求数，还会导致不可预料的问题。
替代办法：

* 使用多个 元素；
* 通过 Sass 或 Less 类似的 CSS 预处理器将多个 CSS 文件编译为一个文件；
* 其他 CSS 文件合并工具；

参考 [don’t use @import](http://www.stevesouders.com/blog/2009/04/09/dont-use-import/)；

#### 链接的样式顺序：
`a:link -> a:visited -> a:hover -> a:active（LoVeHAte）`

#### 无需添加浏览器厂商前缀
使用 [Autoprefixer](https://github.com/postcss/autoprefixer) 自动添加浏览器厂商前缀，编写 CSS 时不需要添加浏览器前缀，直接使用标准的 CSS 编写。

Autoprefixer 通过 [Can I use](http://caniuse.com/)，按兼容的要求，对相应的 CSS 代码添加浏览器厂商前缀。

#### 字体排印
暂时参考[网页字体排印指南](http://aaaaaashu.me/shu/)。

#### 模块组织
任何超过 1000 行的 CSS 代码，你都曾经历过这样的体验：
* 这个 class 到底是什么意思呢？
* 这个 class 在哪里被使用呢？
* 如果我创建一个 `xxoo` class，会造成冲突吗？

`Reasonable System for CSS Stylesheet Structure` 的目标就是解决以上问题，它不是一个框架，而是通过规范，让你构建更健壮和可维护的 CSS 代码。

#### Components（组件）
![Alt text](./1.png)

从 `Components` 的角度思考，将网站的模块都作为一个独立的 `Components`。

#### Naming components （组件命名）
`Components` 最少以两个单词命名，通过 `-` 分离，例如：

* 点赞按钮 (`.like-button`)
* 搜索框 (`.search-form`)
* 文章卡片 (`.article-card`)

#### Elements（元素）
![Alt text](./2.png)

`Elements` 是 `Components` 中的元素

#### Naming elements（元素命名）

`Elements` 的类名应尽可能仅有一个单词。
```css 
.search-form {
    > .field { /* ... */ }
    > .action { /* ... */ }
  }
On multiple words （多个单词）
```
对于倘若需要两个或以上单词表达的 `Elements `类名，不应使用中划线和下划线连接，应直接连接。

```css
 .profile-box {
    > .firstname { /* ... */ }
    > .lastname { /* ... */ }
    > .avatar { /* ... */ }
  }
```

### Avoid tag selectors（避免标签选择器）
任何时候尽可能使用 `classnames`。标签选择器在使用上没有问题，但是其性能上稍弱，并且表意不明确。
```css
.article-card {
    > h3    { /* ✗ avoid */ }
    > .name { /* ✓ better */ }
  }
```

#### Variants（变体）
![Alt text](./3.png)

`Components` 和 `Elements` 可能都会拥有 `Variants`。

#### Naming variants（变体命名）
`Variants` 的 `classname` 应带有前缀中划线 -
```css
 .like-button {
    &.-wide { /* ... */ }
    &.-short { /* ... */ }
    &.-disabled { /* ... */ }
  }
```

#### Element variants（元素变体）
```css
.shopping-card {
    > .title { /* ... */ }
    > .title.-small { /* ... */ }
  }
```
#### Dash prefixes（中划线前缀）
为什么使用中划线作为变体的前缀？

* 它可以避免歧义与 `Elements`
* CSS class 仅能以单词和 `_ `或 `-` 开头
* 中划线比下划线更容易输出

#### Layout （布局）
![Alt text](./4.png)

#### Avoid positioning properties（避免定位属性）
Components 应该在不同的上下文中都可以复用，所以应避免设置以下属性：

* Positioning (position, top, left, right, bottom)
* Floats (float, clear)
* Margins (margin)
* Dimensions (width, height) *

#### Fixed dimensions（固定尺寸）
头像和 logos 这些元素应该设置固定尺寸（宽度，高度...）。

#### Define positioning in parents（在父元素中设置定位）
倘若你需要为组件设置定位，应将在组件的上下文（父元素）中进行处理，比如以下例子中，将 `widths` 和 `floats` 应用在 `list component(.article-list)`当中，而不是 `component(.article-card)`自身。
```css
.article-list {
    & {
      @include clearfix;
    }

    > .article-card {
      width: 33.3%;
      float: left;
    }
  }

  .article-card {
    & { /* ... */ }
    > .image { /* ... */ }
    > .title { /* ... */ }
    > .category { /* ... */ }
  }
```

#### Avoid over-nesting（避免过分嵌套）
当出现多个嵌套的时候容易失去控制，应保持不超过一个嵌套。
```css
/* ✗ Avoid: 3 levels of nesting */
  .image-frame {
    > .description {
      /* ... */

      > .icon {
        /* ... */
      }
    }
  }

  /* ✓ Better: 2 levels */
  .image-frame {
    > .description { /* ... */ }
    > .description > .icon { /* ... */ }
  }
```

#### Apprehensions（顾虑）
* 中划线`-`是一坨糟糕的玩意：其实你可以选择性的使用，只要将 Components, Elements, Variants 记在心上即可。
* 我有时候想不出两个单词唉：有些组件的确使用一个单词就能表意，比如 aleter。但其实你可以使用后缀，使其意识更加明确。

比如块级元素：

* .alert-box
* .alert-card
* .alert-block

或行内级元素

* .link-button
* .link-span

## sass/less 规范
代码组织

代码按一下顺序组织：

1. @import
2. 变量声明
3. 样式声明

```css
@import "mixins/size.less";

@default-text-color: #333;

.page {
  width: 960px;
  margin: 0 auto;
}
```
@import 语句

@import 语句引用的文需要写在一对引号内，.less 后缀不得省略。引号使用 ' 和 " 均可，但在同一项目内需统一。
```css
/* Not recommended */
@import "mixins/size";
@import 'mixins/grid.less';

/* Recommended */
@import "mixins/size.less";
@import "mixins/grid.less";
```

混入（Mixin）

1. 在定义 `mixin` 时，如果 `mixin`名称不是一个需要使用的 className，必须加上括号，否则即使不被调用也会输出到 CSS 中。

2. 如果混入的是本身不输出内容的 mixin，需要在 mixin 后添加括号（即使不传参数），以区分这是否是一个 className。
```css
/* Not recommended */
.big-text {
  font-size: 2em;
}

h3 {
  .big-text;
  .clearfix;
}

/* Recommended */
.big-text() {
  font-size: 2em;
}

h3 {
  .big-text(); /* 1 */
  .clearfix(); /* 2 */
}
```
避免嵌套层级过多

1. 将嵌套深度限制在 2 级。对于超过 3 级的嵌套，给予重新评估。这可以避免出现过于详实的 CSS 选择器。
2. 避免大量的嵌套规则。当可读性受到影响时，将之打断。推荐避免出现多于 20 行的嵌套规则出现。
字符串插值

变量可以用类似 ruby 和 php 的方式嵌入到字符串中，像 @{name} 这样的结构:`@base-url: "http://assets.fnord.com"; background-image: url("@{base-url}/images/bg.png")`;

## 性能优化

##### 慎重选择高消耗的样式

高消耗属性在绘制前需要浏览器进行大量计算：

* box-shadows
* border-radius
* transparency
* transforms
* CSS filters（性能杀手）

##### 避免过分重排

当发生重排的时候，浏览器需要重新计算布局位置与大小，更多详情。

常见的重排元素:

* width
* height
* padding
* margin
* display
* border-width
* position
* top
* left
* right
* bottom
* font-size
* float
* text-align
* overflow-y
* font-weight
* overflow
* font-family
* line-height
* vertical-align
* clear
* white-space
* min-height

##### 正确使用 Display 的属性

Display 属性会影响页面的渲染，请合理使用。

* display: inline 后不应该再使用 width、height、margin、padding 以及 float；
* display: inline-block 后不应该再使用 float；
* display: block 后不应该再使用 vertical-align；
* display: table-* 后不应该再使用 margin 或者 float；

##### 不滥用 Float

Float 在渲染时计算量比较大，尽量减少使用。

##### 动画性能优化

动画的实现原理，是利用了人眼的 “视觉暂留” 现象，在短时间内连续播放数幅静止的画面，使肉眼因视觉残象产生错觉，而误以为画面在 “动”。

动画的基本概念：

* 帧：在动画过程中，每一幅静止画面即为一 “帧”；
* 帧率：即每秒钟播放的静止画面的数量，单位是 fps(Frame per second)；
* 帧时长：即每一幅静止画面的停留时间，单位一般是 ms(毫秒)；
* 跳帧 (掉帧 / 丢帧)：在帧率固定的动画中，某一帧的时长远高于平均帧时长，导致其后续数帧被挤压而丢失的现象。

一般浏览器的渲染刷新频率是 60 fps，所以在网页当中，帧率如果达到 50-60 fps 的动画将会相当流畅，让人感到舒适。

* 如果使用基于 javaScript 的动画，尽量使用 requestAnimationFrame。避免使用 setTimeout，setInterval。
* 避免通过类似 jQuery animate()-style 改变每帧的样式，使用 CSS 声明动画会得到更好的浏览器优化。
*  使用 translate 取代 absolute 定位就会得到更好的 fps，动画会更顺滑。
![Alt text](./5.png)

##### 多利用硬件能力，如通过 3D 变形开启 GPU 加速

一般在 Chrome 中，3D 或透视变换（perspective transform）CSS 属性和对 opacity 进行 CSS 动画会创建新的图层，在硬件加速渲染通道的优化下，GPU 完成 3D 变形等操作后，将图层进行复合操作（Compesite Layers），从而避免触发浏览器大面积重绘和重排。

注：3D 变形会消耗更多的内存和功耗。

使用 translate3d 右移 500px 的动画流畅度要明显优于直接使用 left：
```css
.ball-1 {
  transition: -webkit-transform .5s ease;
  -webkit-transform: translate3d(0, 0, 0);
}
.ball-1.slidein{
  -webkit-transform: translate3d(500px, 0, 0);
}
.ball-2 {
  transition: left .5s ease; left：0;
}
.ball-2.slidein {
  left：500px;
}
```

##### 提升 CSS 选择器性能

CSS 选择器对性能的影响源于浏览器匹配选择器和文档元素时所消耗的时间，所以优化选择器的原则是应尽量避免使用消耗更多匹配时间的选择器。而在这之前我们需要了解 CSS 选择器匹配的机制， 如子选择器规则：

```css
#header > a {font-weight:blod;}
```

我们中的大多数人都是从左到右的阅读习惯，会习惯性的设定浏览器也是从左到右的方式进行匹配规则，推测这条规则的开销并不高。

我们会假设浏览器以这样的方式工作：寻找 id 为 header 的元素，然后将样式规则应用到直系子元素中的 a 元素上。我们知道文档中只有一个 id 为 header 的元素，并且它只有几个 a 元素的子节点，所以这个 CSS 选择器应该相当高效。

事实上，却恰恰相反，CSS 选择器是从右到左进行规则匹配。了解这个机制后，例子中看似高效的选择器在实际中的匹配开销是很高的，浏览器必须遍历页面中所有的 a 元素并且确定其父元素的 id 是否为 header 。

如果把例子的子选择器改为后代选择器则会开销更多，在遍历页面中所有 a 元素后还需向其上级遍历直到根节点。
```css
#header  a {font-weight:blod;}
```

\ 理解了 CSS 选择器从右到左匹配的机制后，明白只要当前选择符的左边还有其他选择符，样式系统就会继续向左移动，直到找到和规则匹配的选择符，或者因为不匹配而退出。我们把最右边选择符称之为关键选择器。——更多详情

1.避免使用通用选择器
```css
/* Not recommended */
.content * {color: red;}
```
浏览器匹配文档中所有的元素后分别向上逐级匹配 class 为 content 的元素，直到文档的根节点。因此其匹配开销是非常大的，所以应避免使用关键选择器是通配选择器的情况。

2.避免使用标签或 class 选择器限制 id 选择器
```css
/* Not recommended */
button#backButton {…}
/* Recommended */
#newMenuIcon {…}
```

3.避免使用标签限制 class 选择器
```css
/* Not recommended */
treecell.indented {…}
/* Recommended */
.treecell-indented {…}
/* Much to recommended */
.hierarchy-deep {…}
```

4.避免使用多层标签选择器。使用 class 选择器替换，减少 css 查找
```css
/* Not recommended */
treeitem[mailfolder="true"] > treerow > treecell {…}
/* Recommended */
.treecell-mailfolder {…}
```

5.避免使用子选择器
```css
/* Not recommended */
treehead treerow treecell {…}
/* Recommended */
treehead > treerow > treecell {…}
/* Much to recommended */
.treecell-header {…}
```

6.使用继承
```css
/* Not recommended */
#bookmarkMenuItem > .menu-left { list-style-image: url(blah) }
/* Recommended */
#bookmarkMenuItem { list-style-image: url(blah) }
```
 