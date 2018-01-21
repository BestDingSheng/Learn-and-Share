//  接口
interface Person{
	name:string;
	age:number;
}
function creatPerson(per:Person){
	console.log(per.age);
}
let perNew = {name:"dingsheng",age:20}
creatPerson(perNew)

// 可选属性
interface Animal{
	color?:string;
	size?:number;
}

function creatAnimal(ani:Animal):{
	color:string;size:number
}{
	var aniTemp ={
		color:"yellow",
		size:100
	}
	if(ani.color){
		aniTemp.color=ani.color;
	}
	if(ani.size){
		aniTemp.size=ani.size;
	}
	return aniTemp;

}
creatAnimal({color:"red"})










