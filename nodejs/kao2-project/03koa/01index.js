// 第一个路由程序
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa ();
const router = new Router();


router.get('/',function(ctx,next){
	ctx.body='hello dingsheng';
})
app.use(router.routes()).
use(router.allowedMethods());

app.listen(3000);