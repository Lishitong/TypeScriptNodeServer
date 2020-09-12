/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { Controller, GET } from "../decorator/router";
import jwt from "jsonwebtoken";

@Controller("api")
class Home {
	@GET("home/index")
	async index(ctx: any) {
		const { authorization } = ctx.header;
		console.log(authorization);
		ctx.body = {
			status: 200,
			state: "success",
		};
	}
}

export { Home };
