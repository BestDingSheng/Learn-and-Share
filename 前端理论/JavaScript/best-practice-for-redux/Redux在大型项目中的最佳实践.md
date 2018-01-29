## Redux在大型项目中的最佳实践

Redux是一种基于Flux思想的一种数据流管理方案实践，使用统一的`store`来进行数据管理，使所有数据都从该数据仓库中流出，通过`reducer`和`action`的组合来控制流入到数据仓库中的内容。将所有视图的状态都汇总到一起，进行单向的数据流管理。

但是在大型项目中，或者是数据密集型的业务逻辑中，`store`数据仓库会形成一个非常庞大的数据块，数据块混乱的管理可能会影响到这个项目的进度。

下面有一些在收集的各种感觉靠谱的大型项目的数据仓库优化方案，留下来备用吧。

### State范式化

这点是在Redux的官方文档中提到的，在这里总结一下：

state的范式化讲的是如何来组织Redux的数据，在业务逻辑密集的大型项目中，各个模块的数据可能会产生耦合，比如在一个大型博客系统中，用户，文章就是会产生耦合的地方，每个文章都有一个作者，那么对于用户信息和文章内容的存储应该如何实现，这在很大程度上会影响到整个系统的效率。

使用索引的方式来存储数据，将同一个类型的数据按照对象索引的方式存储在一起，在需要引用这些数据的时候，采用键的方式来进行读取。这样解除了在数据更新时候的由于耦合造成的大规模嵌套修改。

比如上面的博客的例子：

```json
{
  "users": {
    10212: {
      "username": "lucas",
      "userid": 10212,
      "passage": [123, 124, 125]
    },
    10213: {
      "username": "Bob",
      "userid": 10213,
      "passage": [126, 127, 128]
    }
  },
  "passage": {
    123: {
	  "passageid": 123,
      "passage-content": "this is passage 123"
    },
    124: {
	  "passageid": 124,
      "passage-content": "this is passage 124"
    }
  }
}
```

按照上面的方式对于文章进行索引，可以直接通过对象的键来直接获取某个文章的内容，文章和用户的耦合仅仅通过用户信息内部的一个文章数组来进行，对于文章的修改，除了id之外，其余部分完全不会影响到用户的那部分数据。

当我们需要获取用户列表的时候，只需要封装一个选择器，类似于React-Redux中的`mapStateToProps`，来对用户对象进行遍历：

```javascript
const getSelectedUsers = ({ selectedUserIds, usersById }) => {
  return selectedUserIds.map((id) => usersById[id]);
}
```

这样，如果当数据发生了更新的时候，修改state最少可以使得视图也会有最少的更新，来保证组件不会被频繁渲染。

### 状态切分

我们将通过服务器端获取的各种数据称为标准状态，将从用户UI上获取的`action`操作称为视图状态。将这两者切分开，可以让数据有着更良好的组织。

还是用上面的例子，比如某个用户需要对自己的个人信息进行修改，这时他点击了编辑按钮，这时视图需要进行相应的变化来响应用户的点击。那还是需要对状态进行修改，`isEditing`的状态是应该放在用户的信息当中，还是单独出来一个对象。

不仅仅应该将这些UI状态独立出来，不与标准状态进行耦合，更应该将视图状态的`reducer`，与标准状态的`reducer`进行独立，这样，当服务器端对客户端的标准状态进行更新的时候，不会影响到当前用户的状态。

这里再说一下`reducers`，一般对于`reducer`的组合是使用横向和纵向共同的方式来切分`reducer`，但是横向的多个`reducer`文件的维护难度要远远小于在一个文件中塞入多个状态模块的`reducer`的。

这样做其实也是将不同功能点的状态进行了解耦，使得状态在更新的时候造成的副作用最小。

### 视图之间的状态共享

当项目的规模逐渐扩大的时候，需要不止一个页面来实现很多的功能，并且页面的个数可能会随着项目的扩大而逐渐增多，也许在项目上线的时候，只需要20个页面就可以完成了。但是逐步添加的一个个新的功能，又会需要增加多个页面，这时候，状态的可扩展性也成为了需要考虑的地方。

很多的状态可以在多个页面之间进行共享，比如，当前用户的信息，除非用户退出登录，并且换了一个新的账户，那么用户的信息基本上所有的页面都需要使用。将这些信息提升到顶层的`reducer`中，可以让每个组件都共享这个状态，也减轻了Redux需要维护的状态数量和嵌套层次。

但是大部分的状态都是不适合共享的，基本上离开了当前页面就不再需要了，比如文章的详情和内容，用户浏览完某篇文章并且退出的时候，在一段时间之内很难会再次访问这篇文章，那么这些信息就不应该再被存储在`store`中了，因为下一次打开的可能就是一个新的文章了。

这样的数据就不应该在所有页面之间共享，导致无形之中增加了浏览器的内存压力。

### 在状态之间复用`reducer`

`reducer`是进行数据更新的很重要的一环，有时候有些`reducer`的功能会发生重复，比如在获取文章列表的时候，我们需要翻页操作来获取下一页的文章，而在获取用户关注列表的时候，也需要翻页操作来获取下一页的关注内容。这两个API看似不同，但是其内部的逻辑基本是一致的。

上面的两个操作都需要一个数据结构来保存其当前处于的状态：`loading`、`error`、`success`。但其实这两个操作可以使用同样的一个`reducer`来进行。如果需要对`reducer`进行复用的话，那么要注意的是将这些操作通过其他的手段进行分离，否则一次操作会触发多个`reducer`会导致很大的问题。

可以使用这样一个`reducer`：

```javascript
const loadingReducer = (state = initialLoadingState, action) => {
  const { type, payload } = action;
  if (type === SET_LOADING) {
    return Object.assign({}, state, {
// 通过一个复用的作用域参数来区分这次更新针对的是哪一个模块的数据内容
      [`${payload.scope}Loading`]: payload.loading
    });
  } else {
    return state;
  }
}
```

对应的`action`：

```javascript
const setLoading = (scope, loading) => {
  return {
    type: SET_LOADING,
    payload: {
      scope,
      loading
    }
  }
}
// 通过scope来判断更新的模块内容
store.dispatch(setLoading('users', true));
```

这样下来，所有需要通过服务器端进行获取并且需要获知获取状态的`action`就都可以复用这一个`reducer`来进行。

而对于分页加载来说，新一页的状态如果需要更新到数据仓库中，那么关注列表和文章列表很明显不属于一个模块，那么进行`reducer`更新的时候，为了使用`combineReducer`对分块的`reducer`进行合并，就必须要将这两个模块分离，即使他们的逻辑类似。

这里可以封装一个工厂函数来生成对应的`reducer`：

```javascript
const paginationReducerFor = (prefix) => {
  const paginationReducer = (state = initialPaginationState, action) => {
    const { type, payload } = action;
    switch(type) {
      case prefix + type.SET_PAGINATION:
        const {
          startElement,
          pageSize,
          count
        } = payload;
        return Object.assign({}, state, {
          startElement,
          pageSize,
          count
        });
      default:
        return state;
    }
  }
  return paginationReducer;
}
const userPaginitionReducer = paginationReducerFor('USERS_');
```

通过工厂函数传入一个`prefix`，来生成`prefix`对应的`reducer`。

### 结论

在大规模业务逻辑密集的环境中，对于状态良好的切分和复用，以及对于`reducer`的复用，都可以让业务逻辑，数据，代码更加清晰。

如果希望获取更好的可扩展性，以及较小的数据更新副作用，需要注意*state的范式化*。

如果需要减少状态规模，请注意*视图之间的状态共享*。

如果需要减小`reducer`以及`action`文件的大小，请注意*在状态之间复用`reducer`，以及对于`reducer`的良好切分*。

具体在项目中的使用情况还是要依据项目的实际需求来确定。