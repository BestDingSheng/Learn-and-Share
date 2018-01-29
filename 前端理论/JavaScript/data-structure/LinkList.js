var Node = function(value) {
  this.value = value;
  this.next = null;
}

var LinkList = function() {
  this.head = null;
  this.length = 0;
}

LinkList.prototype.append = function(value) {
  var node = new Node(value);
  if (this.head === null) {
    this.head = node;
  } else {
    var current = this.head;
    while(current.next) {
      current = current.next;
    }
    current.next = node;
  }
  this.length++;
}

LinkList.prototype.insert = function(position, value) {
  var node = new Node(value);
  if (position >= 1 && position <= this.length) {
    var current = this.head;
    var pre;
    for (var i = 0; i < position; i++) {
      pre = current;
      current = current.next;
    }
    pre.next = node;
    node.next = current;
    this.length++;
  } else if (position === 0) {
    node.next = this.head;
    this.head = node;
    this.length++;
  } else {
    return false;
  }
}

LinkList.prototype.removeAt = function(position) {
  if (position >= 1 && position <= this.length) {
    var current = this.head;
    var pre;
    for (var i = 0; i < position; i++) {
      pre = current;
      current = current.next;
    }
    pre.next = current.next;
    this.length--;
    return current.value;
  } else if (position === 0) {
    var current = this.head;
    this.head = this.head.next;
    this.length--;
    return current.value;
  } else {
    return null;
  }
}

var linkList = new LinkList();
linkList.append(1);
linkList.append(2);
linkList.append(3);
linkList.insert(2, 10);
console.log(linkList);



