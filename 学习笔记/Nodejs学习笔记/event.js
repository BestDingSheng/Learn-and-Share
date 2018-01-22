//  引入Event模块创建eventsEmitter对象
var events = require('events');
var eventEmitter = new events.EventEmitter();
// 绑定事件处理函数
var connctHandler = function connected(){
	console.log('connected 被调用');
}
eventEmitter.on('connected',connctHandler); // 完成事件绑定

// 触发事件
eventEmitter.emit('connected');

console.log('程序执行完毕');
