// 编写模块的逻辑
function Hello(){
	var name;
	this.setName = function(argName){
		name = argName;
	}
	this.sayHello = function(){
		console.log('Hello  '+name);
	}
}
// 对模块导出
module.exports = Hello;