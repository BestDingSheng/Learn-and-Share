var Node = function(key) {
  this.key = key;
  this.left = null;
  this.right = null;
}

var BinarySearchTree = function() {
  this.root = null;
}

BinarySearchTree.prototype.insert = function(key) {
  var node = new Node(key);
  var insertNode = function(node, newNode) {
    if (newNode.key < node.key) {
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
  if (!this.root) {
    this.root = node;
  } else {
    insertNode(this.root, node);
  }
}

var preOrderTraverse = function(root) {
  var elementArray = [];
  var preOrderTraverseCore = function(node, elementArray) {
    if (node.key === null) {
      return elementArray;
    }
    elementArray.push(node.key);
    if (node.left !== null) {
      elementArray = preOrderTraverseCore(node.left, elementArray);
    }
    if (node.right !== null) {
      elementArray = preOrderTraverseCore(node.right, elementArray);
    }
    return elementArray;
  }
  return preOrderTraverseCore(root, elementArray);
}

var inOrderTraverse = function(root) {
  var elementArray = [];
  var inOrderTraverseCore = function(node, elementArray) {
    if (node.key === null) {
      return elementArray;
    }
    if (node.left !== null) {
      elementArray = inOrderTraverseCore(node.left, elementArray);
    }
    elementArray.push(node.key);
    if (node.right !== null) {
      elementArray = inOrderTraverseCore(node.right, elementArray);
    }
    return elementArray;
  }
  return inOrderTraverseCore(root, elementArray);
}

var postOrderTraverse = function(root) {
  var elementArray = [];
  var postOrderTraverseCore = function(node, elementArray) {
    if (node.key === null) {
      return elementArray;
    }
    node.left !== null && (elementArray = postOrderTraverseCore(node.left, elementArray));
    node.right !== null && (elementArray = postOrderTraverseCore(node.right, elementArray));
    elementArray.push(node.key);
    return elementArray;
  }
  return postOrderTraverseCore(root, elementArray);
}

var search = function(binarySearchTree, key) {
  var node = binarySearchTree.root;
  while(node && node.key) {
    if (node.key === key) {
      return node;
    }
    node.key > key && (node = node.left);
    node.key < key && (node = node.right);
  }
  return false;
}

var binarySearchTree = new BinarySearchTree();
binarySearchTree.insert(4);
binarySearchTree.insert(2);
binarySearchTree.insert(3);
binarySearchTree.insert(9);
binarySearchTree.insert(7);

// console.log(preOrderTraverse(binarySearchTree.root));
// console.log(inOrderTraverse(binarySearchTree.root));
// console.log(postOrderTraverse(binarySearchTree.root));

console.log(search(binarySearchTree, 9));