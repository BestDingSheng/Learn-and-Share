// const Koa=require('koa');
// const app = new Koa();


// async function testAsycn(){
// 	return 'Hello async';
// }
// const resut = testAsycn();
// console.log(resut);

function getSomething(){
	return 'sonmething';
}

async function testAsycn(){
	return {'name':'dingsheng'}
}

async function test(){
	const v1 = await getSomething();
	const v2 = await testAsycn();
	console.log(v1,v2);
}
test();