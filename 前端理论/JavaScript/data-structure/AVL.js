var Node = function(key) {
  this.key = key;
  this.left = null;
  this.right = null;
  this.balanceFactor = 0;
  this.count = 1;
}

var AVLTree = function() {
  this.root = null;
}

AVLTree.prototype.insert = function(key) {
  var insertStack = [];
  var node = new Node(key);
  var insertNode = function(node, newNode) {
    if (newNode.key === node.key) {
      node.count++;
      insertStack = [];
      return;
    } else if (newNode.key < node.key) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        insertNode(node.right, newNode);
      }
    }
  }
  if (this.root === null) {
    this.root = node;
    return true;
  }

}

AVLTree.prototype.justifyBalanceFactor = function(orient, )