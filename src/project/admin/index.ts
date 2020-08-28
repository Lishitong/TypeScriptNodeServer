import Koa from "koa";
import KoaRouter from "koa-router";
import Router from "./decorator/router";
import { install } from "./routes";

const admin: Koa = new Koa();
const koaRouter: KoaRouter = new KoaRouter();
const installRouter: Router = new Router(koaRouter);
const router: KoaRouter = (() => {
	install();
	return installRouter.init();
})();

admin.use(router.routes()).use(router.allowedMethods());
admin.listen(3000, () => {
	console.log("admin server start");
});
