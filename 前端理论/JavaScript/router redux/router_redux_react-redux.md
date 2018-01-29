## 一句话解释

### Redux

Redux使用*pub/sub*设计模式进行状态管理，store进行状态管理、dispatch负责状态的发布和更新、actions为状态更新操作打上标签，分发给对应的reducer、reducers对状态进行合并。

内置方法：

1. `subscribe`：订阅，将订阅数据仓库的函数注册到`listeners`数组当中，采用快照进行操作，并且返回一个取消订阅的方法。
2. `getState`：获取，获取当前数据仓库的状态。
3. `dispatch`：利用`try...finally`代码块来进行原子操作，对于对应的`action`标签，调用`reducers`来进行数据更新操作，完成后通知所有的订阅者，也就是调用监听器数组当前的快照。

*Redux是flux的一个简洁友好的实现，将state和reducer分离，采用pure function来对数据进行操作，而不能够直接写入。*

### React Redux

`Provider`组件通过HOC高阶组件的方式将Redux的`store`和基本的React组件树的`this.context`上下文联系到一起。对于需要使用的属性，应该要通过`mapStateToProps`方法，将状态转移到组件的`this.props`上面进行访问。

### React Router

React路由组件间的通信完全是通过组件的上下文实现的，根路由需要是一个`Router`的子类路由，因为需要传入相应的`history`对象，嵌套路由可以是`Router`路由。每个`Router`组件会将其继承组件的`history`对象以及当前路由的匹配结果传入到所有的子组件当中，每个相关的其他路由组件都会从上下文中获取这些路由信息，而自定义组件也可以通过定义上下文来获取相关的路由信息。

```react
class App extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  }
}
```

当当前的URL发生了改变的时候，监听URL的`history`对象会进行相应的改变，调用回调，这个时候由于传入到`Router`的`history`参数发生了改变，也就是`props`变化了，所以组件会进行re-render，对于服务器端渲染的`StaticRouter`来说，由于不能够检测到URL的变化，所以需要通过回调函数来进行`setState`的设置来触发re-render过程。

