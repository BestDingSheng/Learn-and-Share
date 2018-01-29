var Set = function() {
  this.items = {};
}

Set.prototype.has = function(value) {
  return this.items.hasOwnProperty(value);
}

Set.prototype.add = function(value) {
  if (!this.has(value)) {
    this.items[value] = value;
    return true;
  }
  return false;
}

Set.prototype.remove = function(value) {
  if (this.has(value)) {
    delete this.items[value];
    return true;
  }
  return false;
}

Set.prototype.getSize = function() {
  return Object.keys(this.items).length;
}

Set.prototype.values = function() {
  return Object.keys(this.items);
}

Set.prototype.union = function(otherSet) {
  var unionSet = new Set();
  this.values().forEach(function(value) {
    unionSet.add(value);
  });
  otherSet.values().forEach(function(value) {
    unionSet.add(value);
  });
  return unionSet;
}

Set.prototype.intersection = function(otherSet) {
  var that = this;
  var intersectionSet = new Set();
  this.values().forEach(function(value) {
    otherSet.has(value) && intersectionSet.add(value);
  });
  otherSet.values().forEach(function(value) {
    that.has(value) && intersectionSet.add(value);
  });
  return intersectionSet;
}

Set.prototype.difference = function(otherSet) {
  var that = this;
  var differenceSet = new Set();
  this.values().forEach(function(value) {
    !otherSet.has(value) && differenceSet.add(value);
  });
  otherSet.values().forEach(function(value) {
    !that.has(value) && differenceSet.add(value);
  });
  return differenceSet;
}

Set.prototype.isSubSetOf = function(otherSet) {
  if(otherSet.getSize() < this.getSize()) {
    return false;
  } else {
    return this.values().every(function(value) {
      return otherSet.has(value);
    });
  }
}

var set1 = new Set();
set1.add(1);
set1.add(2);
set1.add(3);
var set2 = new Set();
set2.add(2);

console.log(set1.union(set2));
console.log(set1.intersection(set2));
console.log(set1.difference(set2));
console.log(set1.isSubSetOf(set2));
console.log(set2.isSubSetOf(set1));