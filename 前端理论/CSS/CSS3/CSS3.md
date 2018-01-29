## CSS3

### background & border

#### 半透明边框

半透明，也就是CSS中的`rgba`以及`hsla`这两种颜色，可以渲染出半透明的颜色。这种颜色不仅仅可以使用在背景上面，还可以使用在页面的其他需要颜色的地方，比如边框。

```css
.container {
  border: 10px solid rgba(255, 255, 255, 0.5);
  background: white;
}
```

但是这样不能够实现正确的边框，因为默认情况下，边框是背景色延伸的终点，也就是内部元素的背景色会一直到边框的位置，这样半透明的边框是覆盖在内部元素的背景色上面的，不会展现外部元素的颜色。

```Css
.container {
  border: 10px solid rgba(255, 255, 255, 0.5);
  background: white;
  background-clip: padding-box;
}
```

这个可以修改为将背景色只延伸到内边距，而不影响边框及其外部的内容。这样半透明的边框颜色就可以显示出外部的背景色了。

#### 多重边框

##### 使用box-shadow模拟

一般的`border`允许为元素添加一个边框，如果需要在外部再添加一个边框的话，可以使用`box-shadow`来进行模拟。

`box-shadow`支持几个属性：

* `h-shadow`：表示阴影的水平位置。
* `v-shadow`：表示阴影的垂直位置。
* `blur`：表示阴影模糊的距离。
* `spread`：表示阴影的尺寸。
* `color`：阴影的颜色。

如果将阴影模糊的距离设置为0，那么就可以得到一个实心的阴影。这时候如果不设置阴影的位置，那么就能得到一个固定大小，类似于边框的阴影，并且这个属性可以设置多个阴影，所以不要`border`也可以实现多个边框。

```css
/* 这样可以实现一个具有三个边框的容器，这三个边框的宽度都是10px */
.container {
  background: white;
  border: 10px solid yellowgreen;
  box-shadow: 0 0 0 10px yellow, 0 0 0 20px yellowgreen;
}
```

但是这样的话有一些问题，`box-shadow`不影响正常的布局，所以需要额外的预留空间，要不然会导致元素间相互覆盖。

##### outline方案

描边可以实现一层边框，再加上原本的边框，这样就可以实现两重边框了，但是也只能够实现两层边框。

```css
.container {
  background: brown;
  border: 10px solid yellowgreen;
  outline: 2px dashed white;
  outline-offset: -20px;
}
```

`outline`的好处在于可以使用CSS中的各种线型格式，比如虚线等等。而且使用`outline-offset`属性可以设置描边的偏移，这个偏移可以是负值，就可以得到内部的描边效果。

*但是描边可能不能贴合元素的圆角*。

#### 灵活的背景定位

有时候需要对背景图片进行偏移定位，也就是背景图片不占满整个容器。

如果不仅仅需要居中、靠左或者靠右的话，可以为`background-position`属性添加在指定方向的偏移值。

```css
/* 这样可以实现背景图片从右侧和下侧的偏移值，这个偏移值是针对padding-box的，也就是
   以padding的外侧作为定位的基准
*/
.container {
  background: url('./img.img') no-repeat;
  background-position: right 10px bottom 10px;
}
/* 可以通过修改背景定位的基准模型，来控制定位相对的起始点 */
.container {
  background: url('./img.img') no-repeat;
  background-position: right 10px bottom 10px;
  background-origin: content-box;
}
```

#### 边框内圆角

有时候需要容器的内侧有圆角，而边框或者描边外面的四个角都是直角。可以使用两个元素来模仿这种效果。

```css
div {
  background: #655;
  padding: .8em;
}
div > div {
  background: tan;
  border-radius: .8em;
  padding: 1em;
}
```

如果需要只用一个元素实现的话，由于描边不能够覆盖圆角，而`box-shadow`可以，所以可以用`box-shadow`来填充圆角位置的颜色，但是这样的做法有点hack，对于版本兼容不是很友好，说不定什么时候描边就可以覆盖圆角了。

```css
div {
  background: tan;
  padding: .8em;
  border-radius: .8em;
  outline: 1em solid #655;
  box-shadow: 0 0 0 .6em #611;
}
```

这样，元素内部，`box-shadow`以及描边三者共同构成了一个内部圆角外部直角的元素，并且圆角和直角之间可以用另外的颜色进行填充。

#### 条纹背景

CSS3渐变可以生成具有渐变颜色的背景：

```css
div {
  height: 200px;
  width: 200px;
  background-image: linear-gradient(#fb3, #58a);
}
```

如果需要这个背景不是渐变，而是两个色条的结合，那么可以设置每个颜色的渐变截断位置，这个位置两侧，一侧为渐变，一侧为纯色。

```css
div {
  height: 200px;
  width: 200px;
  background-image: linear-gradient(#fb3 20%, #58a 80%);
}
```

当两个颜色的截断位置相同的时候，就不存在渐变色了，这是时候就是两个色条的组合。

```css
div {
  height: 200px;
  width: 200px;
  background-image: linear-gradient(#fb3 30%, #58a 30%);
  /* 如果设置了第一个截断位置，但是第二个截断位置为0，则会默认第二个截断位置从第一个开始
  也就是上面代码等价于下面的代码 */
  background-image: linear-gradient(#fb3 30%, #58a 0);
}
```

当需要创建重复条纹的时候，使用`repeating-linear-gradient`的效果很好，这个属性会将定义的色标不停地重复，直到填满整个元素，可以定义较少的色标从而实现循环效果。

```css
div {
  height: 200px;
  width: 200px;
  background-image: repeating-linear-gradient(60deg, #fb3, #fb3 15px, #58a 20px, #58a);
}
```

这样写，每种颜色至少需要两个色标，所以在实现横向和纵向条纹的时候并不是非常需要这个方法，但是实现斜向条纹的时候，这是一个非常好的实践。

#### 复杂的图案背景

##### 网格

使用渐变的各种hack可以实现一些复杂的背景图案，比如网格，可以使用一个横向的渐变加一个纵向的渐变来实现网格效果。

```css
.grid {
  height: 300px;
  width: 300px;
  background-image: repeating-linear-gradient(rgba(70, 30, 180, 0.2), rgba(70, 30, 180, 0.2) 10px, transparent 10px, transparent 20px),
                    repeating-linear-gradient(90deg, rgba(70, 30, 180, 0.2), rgba(70, 30, 180, 0.2) 10px, transparent 10px, transparent 20px);
}
```



##### 波点

波点可以使用`radial-gradient`来实现带圆点的背景，如果需要错开圆点的话，那么可以使用`background-position`来错开两个背景图的位置，这样就可以错开圆点的位置了。

```css
.spot {
  height: 300px;
  width: 300px;
  background-image: radial-gradient(tan 3px, transparent 0),
                    radial-gradient(tan 3px, transparent 0);
  background-size: 30px 30px;
  background-position: 0 0, 15px 15px;
}
```

##### 棋盘

棋盘需要使用直角三角形来进行组合得到，不能够简单的通过叠加获取，需要使用三角形的组合来实现。

### 形状

#### 椭圆 & 半圆

使用`border-radius`来实现一个圆是很正常的事情，但是这个属性还可以用来实现各种各样的圆。这个属性可以传入百分比的参数，来表示每个边的圆角半径：

```css
div {
  height: 200px;
  width: 200px;
  /* 一般情况下实现一个圆，所有的圆角都是100px，刚好形成一个圆 */
  border-radius: 100px;
  /* 用比例也可以实现上面的效果 */
  border-radius: 50%;
  /* 也可以分四个角来表示圆角的半径 */
  border-radius: 50% 50% 0 0;
  /* 或者分成四个角的上下半径以及左右半径，两者之间用 / 分开 */
  border-radius: 100% / 0;
}
/* 实现一个上半椭圆，修改一下高度为一半就能得到上半圆 */
div {
  height: 200px;
  width: 200px;
  border-radius: 50% / 100% 100% 0 0;
}
```

#### 平行四边形

CSS3里面的`transform`属性可以对形状进行一些变换。包括旋转，2D缩放，3D旋转或者2D倾斜等，平行四边形可以使用沿着X轴的2D倾斜来实现：

但是进行2D倾斜的时候，元素内部的内容也会被旋转，这时候使用一个`before`伪元素来实现一个背景，只对这个伪元素进行变形，这样原本的元素就不会发生改变了。

```css
button {
  position: relative;
  /* 用来保证可以显示背景的伪元素 */
  background: transparent;
}
button::before {
  position: absolute;
  top: 0;
  left: 0;
  /* 需要显示原本元素的内容，所以要将这个伪元素放到真正元素的下方，作为背景 */
  z-index: -1;
  background: #000;
  transform: skewX(30deg);
}
```

#### 菱形图片

有时候需要将图片裁剪为菱形，有两种方法。

##### 基于变形的方案

用一个元素包裹着这个图片，然后对外面的元素进行旋转。

#### 切角效果

在设计中，有时候需要对一个元素的角进行切除，可以实现箭头或者类似折角的效果，对于一般的方案，使用一个切过角的图片可以进行，但是这样会增加资源请求的个数，减慢页面的加载速度。

使用渐变可以实现一个角的切角效果：

线性渐变方向偏移的示意图：

![linear-gradient](./resources/linear-gradient.png)

所以，如果要实现一个右下角的切角效果，可以使用-45deg的偏移角，颜色从透明到正常颜色。

```css
.clip-corner {
  width: 300px;
  height: 200px;
  background: #666;
  background: linear-gradient(-45deg, transparent 15px, #666 0);
}
```

单角切角需要一层背景，那么双角切角就需要两层背景来实现，然后用背景位置来将两个背景拼接起来。同理，如果要切掉矩形的四个角，就需要使用四个背景，每个背景分别切掉一个角，然后组合起来。

```css
.clip-four-corner {
  width: 300px;
  height: 200px;
  background: #48a;
  background: linear-gradient(45deg, transparent 15px, #48a 0),
    		  linear-gradient(135deg, transparent 15px, #68a 0),
    		  linear-gradient(-45deg, transparent 15px, #88a 0),
    		  linear-gradient(-135deg, transparent 15px, #a8a 0);
  background-size: 50%;
  background-position: left bottom, left top, right bottom, right top;
}
```

同理，使用径向渐变可以实现另外一种切角方式：内凹切角，其实实现和线性渐变实现一般切角一样。

```css
.clip-gap-corner {
  height: 100px;
  width: 300px;
  background: #58a;
  background: radial-gradient(circle at top left, transparent 15px, #58a 0),
              radial-gradient(circle at bottom left, transparent 15px, #78a 0),
              radial-gradient(circle at top right, transparent 15px, #98a 0),
              radial-gradient(circle at bottom right, transparent 15px, #b8a 0);
  background-size: 50%;
  background-position: top left, bottom left, top right, bottom right;
  background-repeat: no-repeat;
}
```

#### 梯形标签页

实现一个类似chrome浏览器的标签页的梯形样式。这个最基本的是可以使用两个伪元素来表示梯形的两边，但是这样会用完两个仅有的伪元素，如果还要为其添加图标等内容的话，就无法再使用伪元素了。

使用`transform`可以实现梯形标签页：

```css
.trapezium {
  position: relative;
  background: transparent;
}
/* 使用伪元素来实现背景，防止标签内容被变形，并且将伪元素的z轴坐标下调，显示在正常元素下面，
然后由于变形导致的大小变化可以用放大来恢复，并且制定变换的坐标轴，可以控制变换的位置*/
.trapezium::before {
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  height: 100px;
  width: 200px;
  transform: perspective(1em) rotateX(3deg) scale(1.4);
  transform-origin: bottom;
  /* 实现直角梯形 */
  transform-origin: bottom left;
  z-index: -1;
  background: #68a;
}
```

### 视觉效果

#### 单侧投影

投影可以使用CSS3原生的`box-shadow`来实现，关键是这个样式的几个属性，分别为：

```css
.shadow-one-side {
  height: 150px;
  width: 200px;
  background: lightblue;
  box-shadow:   0       4px     2px     -2px   black;
  /* CSS3投影:垂直偏移，水平偏移，阴影模糊，阴影缩放，阴影颜色    */
}
.shadow-sibling-side {
  height: 150px;
  width: 200px;
  background: lightblue;
  box-shadow: 4px 4px 2px 0 black;
}
```

如果要实现单侧投影，那么需要将其余三个方向的投影都缩回到元素本身的下方，如果实现下方投影，那么需要对于整个阴影进行缩放，保证左右在不偏移的情况下，阴影在元素下方，然后再加上一个向下的偏移，就可以实现单侧投影了。

临边投影和单侧投影的原理相同，不需要缩放也可以实现。

如果要实现对向投影，那么就必须要使用两个投影来实现了，因为投影的缩放是整体的，不能够进行单向的缩放。

#### 不规则投影

对于使用CSS正常进行变化的图形来说，其投影是可以正常运作的，比如矩形或者椭圆等，但是对于虚线边框、对话气泡、切角等效果，`box-shadow`不会为其生成投影，这个时候可以使用CSS滤镜来实现投影。

滤镜不管可以实现投影效果，还可以实现转换色相，饱和度，透明度，灰度，模糊等乱七八糟的效果，但是目前浏览器支持率不是非常高，针对IE和Edge都不是完全支持，但是这个属性可以平稳退化，即使浏览器不支持，也就仅仅是不显示而已。

```css
.filter-shadow {
  height: 200px;
  width: 300px;
  border: 10px dashed green;
  filter: drop-shadow(3px 3px 0 black);
}
```

#### 毛玻璃效果

对于背景图上面的文字，可以使用一个带有一定不透明度的背景来帮助文字更加易读，但是对于一些比较花哨的背景来说，这样的效果很差，这时可以使用滤镜的模糊效果来实现，为了防止文字被模糊，这里也要使用伪元素来帮助显示。

#### 折角效果

将元素的一个角处理为类似折角的形状，然后再配上或多或少的拟物样式。

可以使用两层背景来实现这个效果，并且结合起之前的切角效果，然后在生成一个三角形的背景就可以了。

```css
.folder-corner {
  height: 500px;
  width: 300px;
  background: linear-gradient(-135deg, transparent 50%, #68a 0),
    		  linear-gradient(-135deg, transparent 22px, #28a 0);
  background-repeat: no-repeat;
  background-size: 30px 30px, 100%;
  background-position: right top, 0;
}
```

### 字体排印

#### 文本行的斑马条纹

在出现了`nth-child`伪类之后，对于表格等元素的斑马条纹的实现变的非常容易，但是对于整段的文本，由于其是位于一个元素里面的，所以如果要使用这个伪类的话，需要对于每行文本都用一个标签来包裹，这样非常不适合进行响应式布局。

使用CSS线性渐变的背景可以对文本的行高进行定义，并且设置与行高相同的渐变宽度，这样就可以实现整个文本段的斑马条纹了。

```css
.strip {
  padding: 0.5em;
  line-height: 1.5;
  background: beige;
  background-image: linear-gradient(rgba(0, 0, 0, 0.2) 1.5em, transparent 0);
  background-size: 3em;
  /* 为了修复在使用了padding之后，斑马条纹和文本行错开的错误，这样背景只在内容区域生效，
  而不会在内边距中生效。 */
  background-origin: content-box;
}
```

#### 自定义文本下划线

最简单的文本下划线莫过于原生提供的`text-decoration: underline`，但是这个下划线太过简陋了，很多效果都实现不了。

于是开始使用`border-bottom`来进行模拟，但是这个方法又不方便修改下划线和文本之间的距离。

`background`的线性渐变又可以指定位置，所以也可以用来实现文本下划线。这个方法其实和上面的斑马条纹实现方法类似，使用基本同样的方法就可以实现下划线。

#### 现实中的文字效果

对于`text-shadow`样式的各种使用方法。

##### 印刷版效果

印刷版效果可以获得很强的立体感的文本，为深色背景、浅色文字添加一个深色的上阴影，或者为浅色背景、深色文字添加一个浅色的下阴影都可以实现这种效果。

```css
.print {
  padding: 1em;
  background: hsl(210, 13%, 60%);
  color: hsl(210, 13%, 30%);
  /* 阴影模糊一个像素，并且向下偏移一个像素 */
  text-shadow: 0 1px 1px hsla(0, 0%, 100%, .8);
}
```

##### 空心文本

实现空心文本，可以为文本内容添加一个四周扩散的阴影就可以了，但是和`box-shadow`属性不一样的是，`text-shadow`不能够接收用于阴影缩放的第四个参数，所以就需要用4个阴影分别偏向四个方向来进行模拟。

```css
.empty-text {
  padding: 1em;
  font-size: 4em;
  background: lightpink;
  color: white;
  text-shadow: 1px 0 1px black,
    		   0 1px 1px black,
               -1px 0 1px black,
    		   0 -1px 1px black;
}
```

##### 发光文字效果

实现可以发光的文字，只需要使用两个或者多个同色不同模糊度的文本阴影叠加就可以实现了，并且这个效果作用在动画上的效果也很好。

```css
.text-shine {
  padding: 1em;
  font-size: 5em;
  background: darkslateblue;
  color: white;
  text-shadow: none;
  transition: all 1s ease;
}
.text-shine:hover {
  text-shadow: 0 0 .1em white, 0 0 .3em white;
  color: transparent;
  transition: all 1s ease;
}
```

### 用户体验

#### 复选框hack

CSS针对原生复选框的样式支持很差，很少有样式能够直接用户原生的复选框，如果需要对复选框进行美化的话，可以直接隐藏掉原本的复选框，然后使用伪元素创建一个假的复选框来进行样式的修改。

```css
input[type="checkbox"] + label::before {
  /* 这个字符是一个不换行的空格，用来对复选框进行填充 */
  content: '\a0';
  display: inline-block;
  vertical-align: .2em;
  width: .8em;
  height: .8em;
  margin-right: .2em;
  border-radius: .2em;
  background: silver;
  text-indent: .15em;
  line-height: .65;
}
input[type="checkbox"]:checked + label::before {
  /* 表示一个对号，填充在复选框里面表示勾选状态 */
  content: '\2713';
  background: yellowgreen;
}
/* 如果直接使用display: none的话，使用tab键就切换不到复选框了，所以使用这种
hack方法来进行替代 */
input[type="checkbox"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
```

#### 遮罩层hack

对于一些点击时候会产生弹出框的地方，需要用遮罩层来屏蔽掉底层的元素，一般情况下可以使用一个另外的元素来作为遮罩，但是这种方法需要额外添加一个HTML元素。

在不添加HTML元素的情况下，给body上面添加一个伪类，然后用这个伪类来作为遮罩可以不需要一个额外的HTML元素就实现遮罩层。

```css
body.dimmed::before {
  content: "";
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  background: rgba(0, 0, 0, 0.2);
}
```

在配合弹出框，还可以对除了遮罩层以上元素的其他所有元素进行模糊效果，这个效果需要使用到模糊滤镜来进行。但是需要将*除了弹出框之外的所有元素用一个元素包裹起来*，然后对包裹元素进行模糊滤镜，可以使用`main`标签进行包裹。

```css
main.hide {
  filter: blur(10px);
}
```

#### 交互式图片对比

对于两张大部分一致，但是有一小部分不同的图片来说，如果想要更好的看到图片不同的地方，最好将两个图片叠加展示，并且可以通过拖动滚动条来修改两个图片显示的宽度。

主要使用`resize`属性，可以将一个一般的HTML元素变成可以进行放大缩小的，但是这个属性目前浏览器支持率非常低。

### 结构与布局

#### 自适应内部元素

如果不给一个元素指定具体的高度，那么其高度就会自适应内部元素的高度，如果想要让宽度也自适应内部元素的宽度，那么*可以对该元素使用浮动，来得到正确的宽度*，但是这样会导致这个元素脱离文档流，造成布局问题。或者*将该元素设置为行内块级元素，然后再父元素上应用`text-align: center`*，这样会导致所有兄弟元素的文本都居中显示，但是目前这是最好的办法。

在新的CSS规范中，对于`height`和`width`两个属性指定了一些新的关键字，其中的`min-content`可以被解析为这个容器内部最大不可断行的元素宽度，比如最宽的单词、图片或者具有固定宽度的块级元素。

#### 精确控制表格列宽

在一般的表格中，根据每一行的渲染效果，列宽会根据每一行的对应列内容长度来不断重新计算，并且被不停重绘。并且，对于列宽的设置在很多情况下并不能够生效。

如果对表格布局进行修改，使用`table-layout: fixed`，可以将表格的列宽固定，默认情况下，这些列将会平均分配整个表格的宽度。并且对于列宽的指定可以正常生效。`overflow`和`text-overflow`也可以生效。并且，在这种情况下的表格进行渲染的时候，不会发生每一列都进行频繁重绘的情况。

#### 根据兄弟元素的数量设置样式

有时候根据一个容器内部元素的个数，需要对每个元素进行额外的处理，比如之后一个元素的时候，可以完整显示这个元素，而有四个同样元素的时候，需要对每个元素进行缩小，使之仍然保持在一行内。

可以组合使用伪类的组合来实现选择指定的元素，比如，当只有一个元素的时候，可以使用`:only-child`伪类来选择，如果有两个元素的话，就需要组合了：

```css
li:only-child {
  background: lightblue;
}
li:first-child:nth-last-child(2),
li:first-child:nth-last-child(2) ~ li {
  background: lightpink;
}
li:first-child:nth-last-child(3),
li:first-child:nth-last-child(3) ~ li {
  background: lightgreen;
}
```

并且子元素选择器中可以使用变量，比如`nth-child(2n+1)`则表示选取所有的奇数子元素。这里n的取值是0~正无穷。

如果想要在元素数量小于5的时候选择所有的元素，可以使用这个方法来模拟。

```css
/* 选取所有的奇数元素 */
li:nth-child(2n+1) {
  background: green;
}
/* 在元素数量小于5的时候选择所有的元素 */
li:first-child:nth-last-child(-n+6),
li:first-child:nth-last-child(-n+6) ~ li {
  background: green;
}
```

#### 满幅的背景，定宽的内容

这是现在使用的非常多的一种网页设计手法，叫做背景宽度满幅，内容宽度固定。

整个页面分为很多的大区块，每个区块都占据了整个视口的宽度，每个区块的背景都不一样。

所有的内容都是定宽的。

一般这些定宽的内容都是居中显示的，我们常用的方法是使用：

```HTML
<header>
  <div>
    This is header's content!
  </div>
</header>
```

然后设置外部标签的宽度为100%，并且为内部标签添加定宽以及`auto`的外边距实现内部标签的居中。这也是块级元素水平居中的比较好的办法了。

```css
header {
  width: 100%;
}
header > div {
  width: 500px;
  margin-left: auto;
  margin-right: auto;
}
```

但是这样需要使用两个元素，其中一个元素是没有什么语义的，仅仅是为了进行居中而使用的。使用新的`calc()`可以计算，通过设置内边距来让元素居中。

```css
header {
  width: 100%;
  padding: 1em;
  padding: 1em calc(50% - 200px);
}
```

为了平稳退化，设置一个合理范围的内边距，来防止浏览器不支持`calc()`函数。

#### 垂直居中

相比于比较好实现的水平居中：

* 如果是块级元素，对其自身使用`margin: auto;`，
* 如果是行内元素，对其父元素使用`text-align: center;`。

垂直居中是很难完成的。

1. 使用基于绝对定位的偏移

   这种方式通过将元素设置为绝对定位，然后将元素进行其宽度和高度一半的偏移，就可以让元素的中心位于其父元素的中心了，也就实现了居中。

   这种方式也分两种，在该元素的宽和高固定的时候，可以直接进行计算，来计算出来偏移；当元素的宽和高不确定的时候，*可以使用CSS transform的`translate`变形来模拟偏移，因为这个变形的值是根据该元素本身确定的，不像其他属性是根据父元素确定的，*这样可以50%就直接是该元素宽度或者高度的一半了。

   ```css
   main {
     position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%);
   }
   ```

   这个方法可能会导致一些问题，比如有时候不能够对该元素使用绝对定位等。

2. Flexbox布局

   CSS3的弹性布局是解决这种问题最好的方案。

   当使用弹性布局的时候，对于子元素应用`margin: auto;`不仅仅可以使元素在水平方向居中，甚至可以在垂直方向上居中。

   flexbox布局还有一个好处，就是可以让匿名容器也进行居中，比如：

   ```HTML
   <main>
     This is a main content
   </main>
   ```

   中间的文本是没有包裹的，这时候使用弹性布局可以直接使其居中。

   ```css
   main {
     display: flex;
     align-items: center;
     justify-content: center;
     width: 19em;
     height: 10em;
   }
   ```

#### 紧贴底部的页脚

一般的页面都会有一个页脚，当页面长度足够的时候，页脚会直接位于页面的最底部，即使出现滚动条也没有任何关系，但是当页面长度不够的时候，页脚就不能够贴着页面底部了，甚至位于页面的中间。

这种情况最好的解决方案也是flex布局，对于body元素使用flex布局，并且将主轴转移到纵向，然后启用main元素的自动缩放就可以了。

```css
body {
  display: flex;
  min-height: 100vh;
  flex-flow: column;
}
main {
  flex-grow: 1;
}
```

这样，当整个body的高度达不到视口高度的时候，main元素会被拉长，这样footer元素就可以紧贴着底边了。