## React

### ReactDOM.render

React组件的入口就是`render`函数，用来对某个组件进行渲染，并且将这个组件挂载到真实的DOM树中。

对于传入的JSX，首先会被转换为相应的组件，通过构造函数`createElement`进行初始化。比如下面这段JSX，就会被转换为相应的参数传递到构造器里面。主要参数有第一个参数，原生标签的标签名或者是组件对象。最后的几个参数是组件内部的子元素，会作为函数的后面几个参数传递进去。

```react
// 这是两个嵌套了的组件，两个JSX组件都会被转换为使用构造器进行构造
const ChildComponent = () => ( <p>This is child component</p> );
const ParentComponent = () => (
  <div>
    <ChildComponent />
    <p>This is parent component</p>
  </div>
);
// 父组件会变成这样子，子组件被作为参数传递进去了
var ParentComponent = function ParentComponent() {
  return React.createElement(
    "div",
    null,
    React.createElement(ChildComponent, null);
    React.createElement(
      "p",
      null,
      "This is parent component"
    )
  );
};
```

#### createElement

这个方法会返回一个比较简单的数据结构回来，这个对象包含一系列初始化过后的属性，比如常用的`props`、`key`、`ref`等参数，对于默认的`props`会进行初始化，初始化的值来自于`createClass`方法中的`defaultProps`参数。但是现在`createClass`使用的已经比较少了。

这个对象通过`ReactElement`构造函数进行构造，通过`Object.defineProperty`对属性进行访问控制。再对`props`以及元素本身进行`freeze`。

#### ReactMount

`ReactDOM`实际上是用来给`ReactMount`提供公共接口的，也就是本质上是调用`ReactMount`上面的方法的。这里面包含了组件挂载相关的逻辑。

> 挂载是通过创建DOM元素的实例代表来进行初始化的，并且将其挂载到给定的容器当中。

在书写代码的时候官方是推荐使用JSX的，JSX最终会被转换为实际的HTML插入到真实的DOM中的。除了转换JSX之外，还需要对`props`、事件监听器、嵌套的子组件进行处理。

#### 初始化React组件(component)

对于每一种JSX生成的元素，在React内部都是有对应的组件类型与之匹配的。

* 自定义组件  —> `ReactCompositeComponent`
* 原生DOM组件 —> `ReactDOMComponent`
* 简单字符串  —> `ReactDOMTextComponent`

这三种组件类型是虚拟DOM的基础，虚拟DOM通过这三种组件类型被存储在内存中，用来快速进行DOM树的重构，因为操作内存中的对象的速度远比操作真实的DOM更快速。不会造成回流，只在进行渲染的时候会产生一次回流。

在进行嵌套构造的时候，会使用`validateDOMNesting`模块进行嵌套标签的检测，对于不符合HTML规则的标签会进行处理，比如`<p>`标签里面不能嵌套`<div>`标签这样的。

所有的组件构造都是在顶层包装内部的，`TopLevelWrapper`是一个简单的对象。根组件会被构造到这个顶层的包装中。

```react
var nextWrappedElement = React.createElement(
  TopLevelWrapper,
  { child: nextElement }
)
// 这个方法构建一个React组件实例，并且将这个实例返回，实例的公共部分将会通过实例的方法进行返回。
var component = ReactMount._renderNewRootComponent(
  nextWrappedComponent,
  container,
  shouldReuseMarkup,
  nextContext
)._renderedComponent.getPublicInstance();
```

最后通过顶层包装来将整个react应用都包裹起来，这个应用其实就是放在内存中的虚拟DOM，这个包装会被返回。

Element生成一个纯的对象，对象上包含一个元素的各种信息，而Component中就复杂的多了，包含一个组件的声明周期方法等各种和渲染更新有关的内容。

### initial render

#### transaction事务

React对于组件的更新是通过`ReactUpdates`模块进行的，其将需要进行的更新收集起来，并且按块进行更新，而不是一次更新一个元素。对于每一个块的更新，都会添加一个前置和后置操作，而这种操作的添加是依靠*transaction*进行的。

事务除了为操作进行包装之外，还可以对事务流进行控制，如果当前已经有事务正在进行的话，就会阻止当前新加入的事务。事务是由基本的`transaction`类扩展出来的，每种不同的事务的区别主要在于事务的包装器列表，包装器是一个包含初始化方法和结束方法的对象。

在进行render的时候，上面调用了`_renderNewRootComponent`方法，这个方法对事务进行了调用。

```javascript
// ReactMount.js
ReactUpdates.batchedUpdates(
  batchedMountComponentIntoNode,
  componentInstance,
  container,
  shouldReuseMarkup,
  context
);
// ReactUpdates.js
// 这里的批处理的策略就是基本的ReactDefaultBatchingStrategy
function batchedUpdates(callback, a, b, c, d, e) {
  ensureInjected();
  return batchingStrategy.batchedUpdates(callback, a, b, c, d, e);
}
```

React对于基本的批处理的基本事务操作是这样的，有两个基本的wrapper，这两个wrapper会在事务结束的时候，将事务是否正在更新的标识位置为`false`，而另外一个结束函数会在结束之后，然后开始对脏组件进行重新渲染的验证。对于脏组件数组内部的所有组价进行遍历，并且将其置入队列当中。

```Javascript
var RESET_BATCHED_UPDATES = {
  initialize: emptyFunction,
  close: function() {
    ReactDefaultBatchingStrategy.isBatchingUpdates = false;
  }
}
var FLUSH_BATCHED_UPDATE = {
  initialize: emptyFunction,
  close: ReactUpdates.flushBatchedUpdates.bind(ReactUpdates),
}
var TRANSACTION_WRAPPERS = [FLUSH_BATCHED_UPDATES, RESET_BATCHED_UPDATES];
```

在进行组件初更新的时候，最基本的策略是这样的：

1. 首先，对于每一次更新操作，都会调用`ReactUpdates`的批处理方法，在默认情况下的批处理策略是`ReactDefaultBatchingStrategy`。
2. 这时候会判断批处理策略的`isBatchingUpdates`字段的值，也就是当前是否有批处理正在进行中。
3. 如果没有的话，那么就执行当前的事务，也就是React默认的批处理策略事务，并且将`isBatchingUpdates`字段置为`true`，表示当前正在进行批处理。在此次批处理结束之后，再对当前的脏组件进行检测，并且将其放入下次进行批处理的队列当中，开始下一次的批处理过程。
4. 如果有正在进行的批处理，那么这次操作将会被中止，这次的更新将会在下一次批处理的时候被执行。

#### 初始化渲染

上面传递到事务中的回调函数是`ReactMount.batchedMountComponentIntoNode`，也就是在初始化渲染的时候，被事务包装起来的函数就是这个函数，在事务的初始化和结束函数之间，会调用这个函数。

```javascript
// ReactMount.js
function batchedMountComponentIntoNode(...args) {
  var transaction = ReactUpdates.ReactReconcileTransaction.getPooled();
  transaction.perform(mountComponentIntoNode, ...args);
  ReactUpdates.ReactReconcileTransaction.release(transaction);
}
```

这里使用了`ReactUpdates`模块的另外一个事务`ReactReconcileTransaction`，这个事务被包装了三个wrapper。

```javascript
// ReactReconcileTransaction.js
var TRANSACTION_WRAPPERS = [
  SELECTION_RESTORATION,
  EVENT_SUPPRESSION,
  ON_DOM_READY_QUEUEING,
]
```

这三个wrapper分别对当前已经选中的元素的一些状态进行保存，对于由高级DOM操作引起的`focus/blur`状态的改变进行保存，以及当前事务涉及的所有的`componentDidMount`和`componentDidUpdate`回调函数进行保存。并且在结束的时候对这些状态进行恢复。防止DOM操作，也就是防止渲染的时候将这些状态误修改。保证事务完成之后，页面的状态和修改之前一致。

真正的组件挂载过程会返回一个最后要插入DOM的结果，在这个事务当中，实际上调用的方法是`ReactMount.mountComponentIntoNode`。

```javascript
// mountComponentIntoNode
var markup = ReactReconciler.mountComponent(
  wrapperInstance,
  transaction,
  ...args
)
```

在`ReactReconciler.mountComponent`方法中，对于组件进行了初始化，渲染了DOM并且注册了事件监听。

```javascript
mountComponent: function() {
  var markup = internalInstance.mountComponent(
    transaction,
    ...args
  )
  transaction.getReactMountReady().enqueue(attachRefs, internalInstance)
}
```

#### mountComponent

上面完成了在初始化渲染之前，对于当前页面的状态的保存，而保存的这些事件、焦点以及回调函数将会在真实的挂载过程结束之后被恢复或者调用。

组件的挂载过程是非常重要的一个过程，而三个组件类型中的自定义组件`ReactCompositeComponent`的挂载过程是最重要的。

组件树中的根组件是`TopLevelWrapper`，这个组件包裹着所有的React组件。在初始化情况下，被挂载的也是这个组件。

在`TopLevelWrapper`被挂载之后，下一个被挂载的就是其直接子元素，也就是调用`ReactDOM.render`方法的时候传入的第一个参数了。

##### 根组件挂载

所有平台上的React自定义组件都是使用相同的`ReactCompositeComponent`，但是有着不同的`updater`。

`updater`会用于两个重要过程之一的`setState`。来帮助实现组件的更新。不仅仅是这个更新器在挂载的时候被分配，自定义组件的组件实例上还分配了包括`props`、`context`、`refs`等这些组件状态。而这些分配了的属性，也就是在操作React组件时候，可以通过`this`进行访问的属性。

组件的实例通过`_constructComponent`方法进行获取，这个方法会进行组件的实例化`new Component`。也就是调用了在组件定义的时候声明的`constructor`构造函数。

完成实例化工作之后，会调用真正的挂载方法：

```javascript
markup = this.performInitialMount(
  renderElement,
  hostParent,
  ...args
)
```

在这个方法中，会调用生命周期hook的`componentWillMount`函数。这个函数会在`render`方法之前被立即调用，如果在这个方法里面调用了`setState`的话，不会立刻导致一次重新渲染，而是被放到队列中，在这次渲染完成之后再进行重新渲染。

在这个挂载函数中，会再次创建一个React组件的实例，这次创建实例的对象是通过`render`方法获取的，也就是对于当前组件需要渲染的子组件创建实例，然后将这个实例对象传入到`ReactReconciler.mountComponent`方法中，通过这样的一个过程，对于根组件下面一层层的子组件进行渲染。

在这之后，挂载过程的声明周期钩子`componentDidMount`函数将会被置入等待队列中，当挂载完成了之后，所有的`componentDidMount`钩子函数将会被一起调用。

##### DOM组件挂载

```javascript
mountComponent: function(...args) {
  // 这里对于一些特殊的标签进行处理
  switch (this._tag) {
    case 'option':
      ReactDOMOption.mountWrapper(this, props, hostParent);
  }
  // 验证某些属性是否正确
  assertValidProps(this, props);
  // 创建真实的HTML元素，当然这里很复杂，不是简简单单的元素创建，涉及到很多相关的元素
  el = ownerDocument.createElement(this._currentElement.type);
  // 进行属性的绑定
  this._updateDOMProperties(null, props, transaction);
  // 对DOM组件的子组件进行初始化创建
  this._createInitialChildren(transaction, props, context, lazyTree);
}

```



对于自定义组件的挂载过程，就是上面的挂载过程的一层层嵌套和迭代。而除了自定义组件，还有原生DOM组件`ReactDOMComponent`，对于这些组件，也分不同的情况，DOM组件是有`_tag`属性的，这个属性标识了组件的标签类型。对于一些复杂组件来说，是需要在外面包裹一层的，比如，input、option、video等组件。这些DOM元素不仅仅是用来展示信息的，还可以和用户交互，所以需要进行特殊的处理。

在这之后，需要对组件的属性进行验证。通过`assertValidProps`函数进行。来确保设置的属性都是合法的。否则会抛出异常。

之后就会根据元素的标签类型，创建相应的DOM元素了，这些所有的操作都是虚拟的，也就是不会影响真正的DOM。

在最终的递归完成之后，所有的实际DOM都会被挂载到`render`方法指定的`container`上面，完成初始化渲染过程。

##### 属性绑定

通过检测属性值的差异并且根据需要修改DOM来调整属性，这个方法是优化性能的最重要的途径。

属性的比较是通过前一次的属性和当前传入的属性来进行比较的。

这个更新操作是对于DOM组件进行的，在初始化渲染过程中，preProps是空的，而nextProps也就是当前传入的props，所以在初始化渲染过程中的方法调用是这样的`this._updateDOMProperties(null, props, transaction)`。

```javascript
_updateDOMProperties: function(lastProps, nextProps, transaction) {
  // 第一次循环，对于旧属性的循环
  for (propKey in lastProps) {
    if (nextProps.hasOwnProperty(propKey) ||
      !lastProps.hasOwnProperty(propKey) ||
        lastProps[propKey] == null) {
    	continue;      
    }
  }
  // 第二次循环，对于新属性的循环
  for (propKey in nextProps) {
    
  }
}
```



首先会进行检测，对比每个preProps里面的元素，是否都在nextProps中有内容。如果旧的存在而新的不存在的话，也就是这个属性在新的内容中被移除了，那么就需要对于组件上对应的属性进行移除，包括style、事件以及其他一些一般的属性，也就是不是保留属性的属性。

第二次对于nextProps进行遍历，如果props发生了变化，那么就将新的属性替换到旧的属性上面。

完成这些操作之后，就完成了对于属性的更新。

而在初始化渲染的时候，这些属性原本就是一个空的值，所以也不需要对比，直接添加就可以了。之前的过程对DOM元素进行了构建，这里进行了属性的构建，这样也就完成了完整的DOM的构建，可以获取完整的markup了。

##### 子组件挂载

在完成了本身的DOM元素的构建之后，需要对子组件进行创建和挂载。首先要对组件进行挂载，然后再将其和父组件关联起来。

```javascript
// ReactDOMComponent.js mountComponent
this._createInitialChildren(transaction, props, context);
// ReactDOMComponent.js _createInitialChildren
var mountImages = this.mountChildren(
  childrenToUse,
  transaction,
)
// ReactMultiChild.js mountChildren
mountChildren: function(nestedChildren, transaction, context) {
  var children = this._reconcilerInstantiateChildren(
    nestedChildren, transaction, context
  )
  for (var name in children) {
    var mountImage = ReactReconciler.mountComponent(
      children[name],
      transaction,
      this,
      this._hostContainerInfo,
    )
  }
}
```

在进行子组件挂载的时候，主要进行两个工作，第一个是子组件的初始化，然后将其进行挂载。上面的代码中有初始化的过程，以及遍历得到的每一个子组件，然后对于每个子组件进行挂载操作。

到了这里，所有的代码逻辑都是之前连接起来的，如果这个子组件是自定义组件，那么就调用`ReactCompositeComponent.mountComponent`，或者调用`ReactDOMComponent.mountComponent`如果这个子组件是原生的DOM组件。这个递归过程直到某个组件再也不存在子组件为止。

##### conclusion

整个组件的初始化挂载过程是这样的：

1. 首先对于每个自定义组件使用`ReactCompositeComponent`进行初始化，并且执行其生命周期的钩子`componentWillMount`。
2. 在挂载期间，首先会创建自定义组件的实例，这个实例会调用其`constructor`构造函数。
3. 然后调用render方法，然后对于每个元素调用`React.createElement`方法，将元素转换为react的元素，这个过程也可能是babel对JSX进行转义的时候进行的。
4. 在渲染的时候，可能会遇到DOM组件，这时候会初始化一个`ReactDOMComponent`。
5. 然后对这个DOM组件进行挂载。并且对其上的样式、属性和事件监听等内容进行绑定。
6. 之后，对于DOM组件的子组件进行初始化，同样对其创建实例，进行挂载，对于其类型进行判断，看看是创建`ReactDOMComponent`实例，还是创建`ReactCompositeComponent`，并且同样对其进行挂载。

#### 渲染

在完成了组件的挂载操作之后，能够得到一个可以直接挂载到DOM上面的HTML元素，这里面的内容就是所有代码挂载得到的嵌套HTML。

React会将原本的DOM卸载，并且将刚刚计算得到的嵌套HTML插入到原来的位置，这时候就得到了一个完整的DOM结构，后面还需要一些状态恢复工作。

这所有的操作都是在事务中进行的，在调用`insertBefore(tree.node)`之后，会对所有的事务的结束进行操作，包括恢复焦点，数据等，也包括对于之前推入队列的`componentDidMount`方法进行调用。

然后通知之前等待的`dirtyComponents`数组，对于之前存放在脏数组中的操作进行更新，开始下一次挂载。

### setState

之前在进行挂载的时候，对组件的`updater`属性进行了初始化，这个属性上的方法`enqueueSetState`完成了对于组件的更新。这个方法将传入函数的部分state推入到队列`_pendingStateQueue`中。然后执行队列的更新操作。

执行更新操作之前，会首先检测当前是否有更新的批处理正在进行，如果有的话，那么会将这个组件放入到脏组件队列里面，否则就直接进行更新操作。

```Javascript
// ReactUpdateQueue.js
// 注意这里的内部实例是通过公共实例，从ReactInstanceMap中获取的
// 这个集合是React自己定义的用来保存组件实例的集合，也就是虚拟DOM--VDOM
enqueueSetState: function(publicInstance, partialState) {
  var queue = internalInstance._pendingStateQueue;
  queue.push(partialState);
  enqueueUpdate(internalInstance);
}
// ReactUpdates.js
function enqueueUpdate(component) {
  if (!batchingStrategy.isBatchingUpdates) {
    batchingStrategy.batchedUpdates(enqueueUpdate, component);
    return;
  }
  dirtyComponents.push(component);
}
```

每个组件都有其自己的等待状态队列，每次调用`setState`的时候，都会将部分状态对象置入队列，之后这些部分的状态都会被合并到主状态上，然后再被挂载到脏组件列表中，如果可以开启更新事务的话，那么就直接进行更新。

#### 更新的安全问题

`setState`可能在多种情况下被触发，包括异步操作，DOM事件，或者是一些生命周期钩子函数里面。React对于组件的更新是批处理的，将将更新列表收集起来然后一起进行更新操作。

如果三种操作发生了冲突的时候，React会首先确认是否正在更新操作，如果正在更新的话，那么就会置入脏数组中，并且在更新发生的时候，事务初始化操作会首先将组件的事件都解绑，然后在更新完成之后，在将这些事件绑定上去，也就是在更新的时候，DOM的事件监听是无效的。

#### 脏组件的更新

对于正常的更新流程在之前的挂载过程中已经进行过了。对于脏组件，这些组件被放到了数组当中，会在上一次更新完成之后，调用事务结束过程的`ReactUpdates.flushBatchedUpdates`方法进行批处理。

```javascript
// ReactUpdates.js
var flushBatchedUpdates = function() {
  while (dirtyComponents.length || asapEnqueued) {
    if (dirtyComponents.length) {
      var transaction = ReactUpdatesFlushTransaction.getPooled();
      transaction.perform(runBatchedUpdates, null, transaction);
      ReactUpdatesFlushTransaction.release(transaction);
    }
  }
}
function runBatchedUpdate(transaction) {
  var len = transaction.dirtyComponentsLength;
  dirtyComponents.sort(mountOrderComparator);
  updateBatchNumber++;
  for (var i = 0; i < len; i++) {
    var component = dirtyComponents[i];
    ReactReconciler.performUpdateIfNecessary(
      component,
      transaction.reconcileTransaction,
      updateBatchNumber
    )
  }
}
```

这里仍旧使用事务进行更新操作，但是这个事务和之前的正常更新流程的事务不同。这个事务使用了两个wrapper，这些wrapper会检测在关闭的时候，脏组件数组的长度和执行事务之前的长度是否相同，如果不同，则会再次执行更新操作。

事务的操作会首先对脏数组进行排序，首先对父组件进行更新，然后才轮到子组件，这样可以保证对于父组件进行更新之后，子组件被修改了，那么可能会对子组件进行两次更新。

之后对于脏组件数组进行遍历，然后将每个组件都传入`ReactReconciler.performUpdateIfNecessary`方法中。这个方法会调用自定义组件实例的`performUpdateIfNecessary`方法来对组件进行更新。这里又回到了自定义组件`ReactCompositeComponent`的实例当中。

#### 实例的updateComponent

> 进行已经挂载的组件更新。会调用`componentWillReceiveProps`以及`shouldComponentUpdate`方法。然后剩余的更新周期方法被调用来进行DOM的更新。

这个声明周期函数中，会首先检测`props`是否发生了改变，实际上当`setState`被调用以及`props`发生了改变的时候会触发这个声明周期函数。

之后调用`componentWillReceiveProps`周期方法。

然后组件通过`_processPendingState`方法来计算新的state。

再然后设置`shouldUpdate = true`，在没有设置`shouldComponentUpdate`方法的时候，更新会默认进行。如果设置了这个方法的话，那么就会根据其返回的结果来设置`shouldUpdate`的值。

即使确定了不需要更新，那么也需要将props和state设置为新的值。

```javascript
updateComponent: function(...args) {
  var inst = this._instance;
  inst.componentWillReceiveProps(nextProps, nextContext);
  var nextState = this._processPendingState(nextProps, nextContext);
  var shouldUpdate = true;
  shouldUpdate = inst.shouldComponentUpdate(nextProps, nextState, nextContext);
  if (shouldUpdate) {
    this._performComponentUpdate(...args);
  } else {
    inst.props = nextProps;
    inst.state = nextState;
    inst.context = nextContext;
  }
}
```

之后，调用`componentWillUpdate`钩子函数。并且将`componentDidUpdate`钩子推入到队列当中。

这时候首先会进行判断，判断这个组件是否需要完全被替换，完全替换意味着之前的组件需要被首先卸载，然后新的组件会被挂载，渲染然后代替现在的组件，或者这个组件只会被部分更新：

```Javascript
_updateRenderedComponent: function() {
  var preComponentInstance = this._renderedComponent;
  var prevRenderedElement = prevComponentInstance._currentElement;
  var nextRenderedElement = this._renderValidatedComponent();
  if (shouldUpdateReactComponent(prevRenderedElement, nextRenderedElement)) {
    ReactReconciler.receiveComponent(
      prevComponentInstance,
      nextRenderedElement,
    )
  }
}
```

只有当新的元素为空的时候，或者两个元素的类型不同的时候才会被真正的完全替换。

在确定需要对组件进行完全更新之后，会调用组件实例的`receiveComponent`，对于自定义组件来说，调用这个函数实际上相当于调用`updateComponent`，也就是自定义组件继续进行递归更新，对于DOM组件来说：

```javascript
// ReactDOMComponent.js
receiveComponent: function(nextElement, transaction, context) {
  var prevElement = this._currentElement;
  this._currentElement = nextElement;
  this.updateComponent(transaction, prevElement, nextElement, context)
}
```

ReactDOM组件的`updateComponent`主要进行两个部分的工作：更新当前元素的属性，以及更新当前元素的子元素。更新属性的时候使用的是`_updateDOMProperties`方法，这个方法在进行初始化渲染的时候也使用过，另外一个是`_updateDOMChildren`，用来更新子组件。更新子组件的时候会传入之前的属性以及新的属性，子组件的变化都是由于父组件传入的属性发生变化引起的。

对于子组件进行更新的时候，分两种主要的情况，分别是简单组件(也就是纯粹的字符串或者数字等内容)以及复杂组件(依然是React组件)。

首先判断当前的子元素是不是简单组件，如果不是，那么就调用方法对于子组件进行更新，`this.updateChildren()`，遍历子组件数组，对于每个子组件都进行同样的更新操作，如果这个组件是新增的，那么可以直接挂载，否则需要对其继续调用`receiveComponent`方法。

这样递归直到其子元素为简单元素，就直接判断元素是否相同，从而进行更新操作。 

```javascript
// 真正进行更新操作的时候，主要有下面几种情况
switch(update.type) {
  case 'INSERT_MARKUP':
    insertLazyTreeChildAt();
    break;
  case 'MOVE_EXSITING':
    moveChild();
    break;
  case 'SET_MARKUP':
    setInnerHTML();
    break;
  case 'TEXT_CONTENT':
    setTextContent();
    break;
  case 'REMOVE_NODE':
    removeChild();
    break;
}
```

在确定了子组件需要的更新方法之后，会在父组件上调用`processUpdates`方法对子组件进行更新。可能会进行移动、删除、插入、修改文本等操作，比如:

* 如果两个旧节点和新节点的所有父元素都是一样的，而文本节点的文本不同，那么就会进行`TEXT_CONTENT`操作，修改节点的文本。
* 如果遍历子节点的时候，发现其中两个节点是一样的，但是位置不同，那么会进行`MOVE_EXSITING`操作，将节点移动到指定的位置。
* 在遍历的时候，会将不存在于新数组中的节点保存下来，最后对于这些节点进行`REMOVE_NODE`操作，删除旧树上的这个节点。
* 如果发现了一个新节点，则需要对新节点进行挂载操作，进行`INSERT_MARKUP`操作，初始化这个新节点并且挂载到DOM树上面去。

在递归完成了所有的子组件的更新操作之后，需要进行更新事务的收尾工作。调用所有的`componentDidUpdate`声明周期钩子，并且如果脏数组还存在的话，那么需要继续进行更新操作。完成收尾工作。