## DOM

文档对象模型是HTML和XML文档的编程接口。其提供了对文档的结构化的表述，并且定义了一种方法从程序中对于文档对象模型结构进行访问，来改变文档的结构，样式和内容。DOM将文档解析为一个个由节点和对象组成的结构集合。

一个web页面上的文档是根据HTML显示出来的，HTML解析出来的DOM树就是对文档的另外一种表示方法，这种表示方法可以兼容JavaScript对于文档进行处理。

### 重要的数据类型

在DOM中，有一些非常常用的数据结构，来表示一些很重要的元素。

* `document`：当一个成员返回`document`对象，这个对象就是`document`对象本身。
* `element`：element表示一个元素或者节点，会返回一个node的对象引用。
* `nodeList`：这个是一个元素数组，这个数组里面的内容就是一个node对象的引用。
* `attribute`：表示一个属性节点，在DOM中属性也算是节点和元素一样，但是只不过使用的比较少。
* `nameNodeMap`：和数组类似，但是条目是由`name`或者`index`访问的。

### DOM接口

#### node接口

对于所有的节点元素，都有一个`nodeType`属性来判断节点的类型，基本的是元素节点为1，文本节点为3，注释节点为8等等。

* element节点：`nodeType = 1`，最常用的节点类型，这个节点提供了对于元素标签名，子节点和特性的访问，我们常用的HTML元素div、span、a等标签就是element中的一种。
* text节点：`nodeType = 3`，表示文本节点，内容是纯文本内容。`nodeName = '#text'`。
* attribute节点：`nodeType = 2`，表示属性节点，表示元素的特性。
* comment节点：`nodeType = 8`，表示文档中的注释，`nodeName = '#comment'`。
* document节点：`nodeType = 9`，表示文档，这个对象是HTMLDocument的一个实例，表示整个页面，`nodeName = '#document'`。

#### 节点创建型api

* `createElement`：通过传入的指定标签名来创建一个元素，这个元素创建出来的时候是独立于DOM树的，需要将其挂载到树上才可以显示。

* `createTextNode`：创建一个文本节点，传入的参数是文本节点里面的文本内容。

* `cloneNode`：这个方法返回调用方法的节点的一个副本，接收一个bool参数，用来表示是否复制子元素。当参数为`true`的时候表示对节点的子元素也进行复制。

  对于复制节点的事件处理，如果原本的节点的事件处理是通过`addEventListener`或者`onclick`添加的，那么事件处理函数不会被复制，但是如果是内联方式添加的事件处理函数则也会被触发。

* `createDocumentFragment`：这个方法会创建一个`documentFragment`节点，这个节点的功能是：如果希望将多个节点一次添加的DOM树中，比如有100个节点，那么会产生100次回流，非常影响性能。这时候可以先将需要挂载的节点添加到这个节点下面，然后再将这个节点挂载到DOM树中，这样只需要一次回流就可以完成所有节点的挂载了。*这个节点不会产生一个真实的DOM节点。*

#### 页面修改型api

上面的节点创建型api用来新建一个节点，但是并不挂载到DOM树中，挂载需要页面修改型api来进行。

* `appendChild`：将指定的节点添加到调用该方法的节点的子元素列表的末尾。参数节点会作为调用节点的最后一个子节点出现在DOM树中。

  如果原本的这个节点已经存在在页面中了，那么这个操作会将原来的节点移除，并且放到你所选择的位置。也就是变成了节点的移动操作。并且事件绑定也会随着该操作被移动。

* `insertBefore`：可以将一个节点添加到一个参照节点之前。这个方法必须调用在父元素上面，以两个子节点作为参数。

  `parentNode.insertBefore(newNode, refNode)`，并且第二个参数是必须要传入的，如果传入的是`null`或者`undefined`，则会将该节点挂载到父节点的最后一个子元素后面。

* `removeChild`：删除指定的子节点并且返回该节点。

  `deleteChild = parent.removeChild(node)`，表示将节点从DOM树中移除，但是这个节点仍然保存在内存中。必须要保证需要删除的节点是调用节点的子节点，否则删除会出错。

* `replaceChild`：表示使用一个节点替换另外一个节点，这个方法也要通过父节点进行调用。

  `parent.replaceChild(newChild, oldChild)`，表示用新的节点替换旧的节点，旧的节点必须是页面上的节点，而新的节点则可以是页面上的节点，也可以是内存中的节点。

#### 节点关系型api

HTML文档中的节点都是具有关系的，以树的方式存在于内存中，每一个元素的变动都会意味着其父元素，子元素，兄弟元素的变化。要获取一个节点的各个亲戚节点，需要使用这个api来进行。

* 父节点关系：每一个节点都具有`parentNode`属性，表示一个元素的父节点。可能是各种类型的节点，`document`节点是不具有父节点的。

  而另外一个属性`parentElement`也是用来获取父节点的，但是只有父节点是`element`节点的时候，才会返回，否则返回`null`。

* 兄弟节点关系：

  `previousSibling`：表示节点的前一个节点，如果这个节点是第一个节点，那么返回`null`。

  `previousElementSibling`：表示节点的前一个元素节点。

  `nextSibling`：表示节点的后一个节点，如果是最后一个节点，那么返回`null`。

  `nextElementSibling`：表示节点的后一个元素节点。

* 子关系型：

  `childNodes`：返回一个即时的Nodelist，这个列表会随着元素的更新而更新。表示所有的子节点，不仅仅是元素节点。

  `children`：一个即时的HTMLCollection，获取所有的element节点。

  `firstNode`：第一个子节点。

  `lastNode`：最后一个子节点。

  `hasChildNodes`：方法，判断一个节点是否含有子节点。

  这里要注意一下：*nodeList和HTMLCollection的区别在于：nodeList是节点的集合，可以包括元素节点可以包括文本节点等，而HTMLCollection只有元素节点。*