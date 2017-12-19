const Koa = require('koa');
const app = Koa();
app.use(async(ctx)=>{
	ctx.body='hello koa2'
})
app.listen(3000);