import Koa from "koa";
import KoaRouter from "koa-router";
import Router from "./decorator/router";
import KoaBody from "koa-body";
import { install } from "./routes";
import { dao_ip_filter, Jwt } from "./middleware";
import { user_mongodb } from "./models";
const admin: Koa = new Koa();
const koaRouter: KoaRouter = new KoaRouter();
const installRouter: Router = new Router(koaRouter);
const router: KoaRouter = (() => {
	install(); // 注册路由信息
	return installRouter.init(); // 挂载到router，并返回router实例
})();
user_mongodb();

admin
	.use(KoaBody())
	.use(dao_ip_filter)
	.use(Jwt)
	.use(router.routes())
	.use(router.allowedMethods())
	.listen(3000, "0.0.0.0", () => {
		console.log("admin server start");
	});
