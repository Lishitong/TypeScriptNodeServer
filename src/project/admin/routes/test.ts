/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { GET, Controller } from "../decorator/router";
import { LogDecorator, TestDecorator } from "../decorator";

@Controller("test")
class Test {
	@GET("/login")
	@TestDecorator
	@LogDecorator
	isLogin(ctx: any) {
		ctx.body = {
			status: 200,
		};
	}
}

export { Test };
