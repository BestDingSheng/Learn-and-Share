//  给路由添加层级  前缀等 
// 前缀一般是全局的 
// const Koa = require('koa');
// const Router = require('koa-router');
// const app = new Koa();
// const router = new Router({
// 	prefix:'/ding'
// })

// router.get('/',function(ctx,next){
// 	ctx.body='hello dingsheng';
// })
// app.use(router.routes()).
// use(router.allowedMethods());

// app.listen(3000);

// 第二种方式
//  给单个路由添加层级
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa();
let page = new Router();
page.get('/home',function(ctx,next){
	crx.body='home---hah'
});

let router =new Router();
router.use('/page',page.routes(),page.allowedMethods());

app.use(router.routes().use(router.allowedMethods()));

app.listen(3000);


