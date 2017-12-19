//  路由多页面配置
const Koa = require('koa');
const Router = require('koa-router');
const app = new Koa ();
const router = new Router();


router.get('/',function(ctx,next){
	ctx.body='hello dingsheng';
}).get('/home',function(ctx,next){
	ctx.body='home';
})
app.use(router.routes()).
use(router.allowedMethods());

app.listen(3000);