//  ejs 模板引擎
const Koa =require('koa');
const views = require('koa-views');
const path = require('path');
const app = new Koa();

app.use(views(path.join(__dirname,'./views'),{
	extension:'ejs'
}))

app.use(async(ctx)=>{
	let title = 'hellow koa2';
	await ctx.render('index',{
		title
	})
})

app.listen(3000);