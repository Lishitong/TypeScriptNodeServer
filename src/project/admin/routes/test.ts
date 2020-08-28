/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GET, Controller } from "../decorator/router";
import decorators from "../decorator/middleware";

const { Logd } = decorators;

@Controller("test")
class Test {
	@GET("/login")
	@Logd
	isLogin(ctx: any): void {
		ctx.body = {
			status: 200,
		};
	}
}

export { Test };
