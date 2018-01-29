var Graph = function() {
  this.vertices = [];
  this.adjust = {};
}

Graph.prototype.addVertex = function(v) {
  this.vertices.push(v);
  this.adjust[v] = [];
}

Graph.prototype.addEdge = function(v, w) {
  this.adjust[v].push(w);
  this.adjust[w].push(v);
}

Graph.prototype.toString = function() {
  return this.vertices.reduce((r, v, i) => {
    return this.adjust[v].reduce((r, w, i) => {
      return r + `${w}`
    }, `${r}\n${v} => `)
  }, '')
}

Graph.prototype.BFS = function(start) {
  const prepareQueue = [];
  const searchedQueue = [];
  if (!~this.vertices.indexOf(start)) {
    return 'start vertices is not in graph';
  }
  prepareQueue.push(start);
  while (prepareQueue.length !== 0) {
    const vertices = prepareQueue.shift();
    searchedQueue.push(vertices);
    for (let value of this.adjust[vertices]) {
      if (!~searchedQueue.indexOf(value) && !~prepareQueue.indexOf(value)) {
        prepareQueue.push(value);
      }
    }
  }
  return searchedQueue;
}

Graph.prototype.DFS = function(start) {
  const prepareStack = [];
  const searchStack = [];
  if (!~this.vertices.indexOf(start)) {
    return 'start vertices is not in graph';
  }
  prepareStack.push(start);
  while (prepareStack.length !== 0) {
    const vertices = prepareStack.pop();
    searchStack.push(vertices);
    for (let value of this.adjust[vertices]) {
      if (!~prepareStack.indexOf(value) && !~searchStack.indexOf(value)) {
        prepareStack.push(value);
      }
    }
  }
  return searchStack;
}

var graph = new Graph();
graph.addVertex('A');
graph.addVertex('B');
graph.addVertex('C');
graph.addVertex('D');
graph.addVertex('E');
graph.addVertex('F');
graph.addVertex('G');
graph.addVertex('H');
graph.addVertex('I');

graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('A', 'D');
graph.addEdge('B', 'E');
graph.addEdge('B', 'F');
graph.addEdge('E', 'I');
graph.addEdge('C', 'G');
graph.addEdge('D', 'G');
graph.addEdge('D', 'H');

console.log(graph.toString());
console.log(graph.BFS('A'));
console.log(graph.DFS('A'));