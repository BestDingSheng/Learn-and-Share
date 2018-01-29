var PriorityQueue = function(initQueue) {
  var toString = Object.prototype.toString;
  if (toString.call(initQueue) !== '[object Array]') {
    return false;
  }
  this.items = initQueue;
}

PriorityQueue.prototype.enqueue = function(value, priority) {
  var item = {
    value: value,
    priority: priority
  };
  if (!this.items.length) {
    this.items.push(item);
  } else {
    var getIndex = false;
    var i = 0;
    while(!getIndex && i < this.items.length) {
      if (this.items[i].priority < priority) {
        this.items.splice(i, 0, item);
        getIndex = true;
      }
      i++;
      if (i === this.items.length && !getIndex) {
        this.items.push(item);
        getIndex = true;
      }
    }
  }
}

PriorityQueue.prototype.dequeue = function() {
  return this.items.unshift();
}

PriorityQueue.prototype.showQueue = function() {
  console.log(this.items);
}

var pq = new PriorityQueue([{
  value: 1,
  priority: 10
}, {
  value: 2,
  priority: 7
}, {
  value: 3,
  priority: 3
}, {
  value: 4,
  priority: 1
}]);

pq.enqueue(5, 5);

pq.showQueue();