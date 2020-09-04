import Koa from "koa";
import KoaRouter from "koa-router";
import Router from "./decorator/router";
import KoaBody from "koa-body";
import { install } from "./routes";

const admin: Koa = new Koa();
const koaRouter: KoaRouter = new KoaRouter();
const installRouter: Router = new Router(koaRouter);
const router: KoaRouter = (() => {
	install();
	return installRouter.init();
})();

admin
	.use(KoaBody())
	.use(router.routes())
	.use(router.allowedMethods())
	.listen(3000, () => {
		console.log("admin server start");
	});
