// ts中的函数
// 为函数定义类型
function sum(x:number,y:number):number{
	return x+y;
}
// 完整的函数类型 
let num:number=10;
let mySum:(x:number,y:number)=>number=
	function(x:number,y:number):number{
		return x+y;
	}
// 函数的类型有两部分组成：参数类型和函数返回值的类型
// x和y是参数的









