var FPromise = (function() {
  // 保存状态和当前Promise操作得到的值，无论是成功还是失败
  const promiseStatusSymbol = Symbol('PromiseStatus');
  const promiseValueSymbol = Symbol('PromiseValue');
  const STATUS = {
    PENDING: 'PENDING',
    FULFILLED: 'FULFILLED',
    REJECTED: 'REJECTED'
  }
  const transition = function(status) {
    return (value) => {
      this[promiseValueSymbol] = value;
      setStatus.call(this, status);
    }
  }
  /** 
    * 对于状态的改变进行控制，类似于存取器的效果。
    * 如果状态从 PENDING --> FULFILLED，则调用链式的下一个onFulfilled函数
    * 如果状态从 PENDING --> REJECTED， 则调用链式的下一个onRejected函数
    *
    * @returns void
    */
  const setStatus = function(status) {
    this[promiseStatusSymbol] = status;
    if (status === STATUS.FULFILLED) {
      this.deps.resolver && this.deps.resolver();
    } else if (status === STATUS.REJECTED) {
      this.deps.rejecter && this.deps.rejecter();
    }
  }
  const FPromise = function(resolver) {
    if (typeof resolver !== 'function') {
      throw new TypeError(`parameter 1 must be a function, but get a ${typeof func}`);
    }
    if (!(this instanceof FPromise)) {
      return new FPromise(resolver);
    }
    this[promiseStatusSymbol] = STATUS.PENDING;
    this[promiseValueSymbol] = [];
    this.deps = {};
    resolver(
      transition.call(this, STATUS.FULFILLED),
      transition.call(this, STATUS.REJECTED)
    );
  }
  FPromise.prototype.then = function(onFulfilled, onRejected) {
    const self = this;
    return FPromise(function(resolve, reject) {
      const callback = function() {
        if (!onFulfilled) {
          return;
        }
        const resolveValue = onFulfilled(self[promiseValueSymbol]);
        // 这里是对于当返回值是一个thenable对象的时候，
        // 需要对其进行特殊处理，直接调用它的then方法来
        // 获取一个返回值
        if (resolveValue && typeof resolveValue.then === 'function') {
          resolveValue.then(function(data) {
            resolve(data);
          }, function(err) {
            reject(err);
          })
        } else {
          // 注意，这里是then方法进行链式调用的连接点
          // 当初始化状态或者上一次Promise的状态发生改变的时候
          // 这里会通过调用当前Promise成功的方法，来进行当前Promise的状态改变
          // 以及调用链式的下个Promise的回调
          resolve(resolveValue);
        }
      }
      const errCallback = function() {
        if (!onRejected) {
          return;
        }
        const rejectValue = onRejected(self[promiseValueSymbol]);
        // 这里是和上面是一致的
        reject(rejectValue);
      }
      // 这里是对当前Promise状态的处理，如果上一个Promise在执行then方法之前就已经
      // 完成了，那么下一个Promise对应的回调应该直接执行
      if (onFulfilled && self[promiseStatusSymbol] === STATUS.FULFILLED) {
        return callback();
      } else if (onRejected && self[promiseStatusSymbol] === STATUS.REJECTED) {
        return errCallback();
      } else if (self[promiseStatusSymbol] === STATUS.PENDING) {
        self.deps.resolver = callback;
        self.deps.rejecter = errCallback;
      }
    })
  }
  FPromise.resolve = function(obj) {
    if (obj && typeof obj.then === 'function') {
      return FPromise(function(resolve, reject) {
        obj.then(function(data) {
          resolve(data);
        }, function(err) {
          reject(err);
        });
      });
    } else {
      return FPromise(function(resolve, reject) {
        resolve(obj);
      });
    }
  }
  FPromise.reject = function(obj) {
    return FPromise(function(resolve, reject) {
      reject(obj);
    });
  }
  FPromise.all = function(promiseArray) {
    if (Object.prototype.toString.call(promiseArray) !== '[object Array]') {
      throw new TypeError('FPromise.all() need an array parameter');
    }
    return FPromise(function(resolve, reject) {
      const promises = promiseArray;
      const results = [];
      let count = promises.length;
      const resolver = function(index) {
        return function(value) {
          resolveAll(index, value);
        }
      };
      const rejecter = function(err) {
        reject(err);
      }
      const resolveAll = function(index, value) {
        results[index] = value;
        if (--count === 0) {
          resolve(results);
        }
      }
      for (var i = 0; i < count; i++) {
        promises[i].then(
          resolver(i),
          rejecter
        )
      }
    });
  }
  FPromise.race = function(promiseArray) {
    if (Object.prototype.toString.call(promiseArray) !== '[object Array]') {
      throw new TypeError('FPromise.race() need an array parameter');
    }
    return FPromise(function(resolve, reject) {
      for (var i = 0; i < promiseArray.length; i++) {
        promiseArray[i].then(
          resolve,
          reject
        )
      }
    });
  }
  FPromise.prototype.catch = function(rejecter) {
    return this.then(undefined, rejecter);
  }
  return FPromise;
})();

const fs = require('fs');

var p1 = new FPromise(function(resolve, reject){
  fs.readFile('./readmea', function(err, data) {
    if (err) {
      reject(err.toString());
    } else {
      resolve(data.toString());
    }
  });
}).catch(function(err) {
  console.log(err);
})


// var p1 = FPromise.resolve({
//   then: function(onFulfilled, onRejected) {
//     onFulfilled(123);
//   }
// }).then(function(data) {
//   console.log(data);
// })

// var p1 = FPromise.all([
//   new FPromise(function(resolve, reject) {
//     fs.readFile('./readmea', function(err, data) {
//       if (err) {
//         reject(err.toString());
//       } else {
//         resolve(data.toString());
//       }
//     });
//   }),
//   FPromise.resolve(123)
// ]).then(function(data) {
//   console.log(data);
// }, function(err) {
//   console.log(err);
// })

// var p1 = FPromise.all(123);

// var p1 = FPromise.race([
//   new FPromise(function(resolve, reject) {
//     fs.readFile('./readmea', function(err, data) {
//       if (err) {
//         reject(err.toString());
//       } else {
//         resolve(data.toString());
//       }
//     });
//   }),
//   FPromise.resolve(123)
// ]).then(function(data) {
//   console.log(data);
// }, function(err) {
//   console.log(err);
// })