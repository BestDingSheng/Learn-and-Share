var HashTable = function() {
  this.table = [];
  this.hashFunction = function(key) {
    var hash = 0;
    var keys = key.toString().split('');
    for (let codePoint of keys) {
      hash += codePoint.charCodeAt();
    }
    return hash % 37;
  }
}

HashTable.prototype.put = function(key, value) {
  var position = this.hashFunction(key);
  this.table[position] = value;
}

HashTable.prototype.get = function(key) {
  return this.table[this.hashFunction(key)];
}

var hashTable = new HashTable();
hashTable.put('lucas', {
  email: 'lucas@gmail.com',
  tel: 134471266
});
hashTable.put('bob', {
  email: 'bob@gmail.com',
  tel: 123512131
});