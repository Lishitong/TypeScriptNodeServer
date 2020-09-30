/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { readFileSync } from "fs";
import { resolve } from "path";
import { Controller, GET } from "../decorator/router";
import { user_info_model } from "../models";

import jwt from "jsonwebtoken";
const mima = readFileSync(resolve(__dirname, "../../../", "m.json"), {
	encoding: "utf-8",
});

const { ACCESS_MIMA } = JSON.parse(mima);
@Controller("api")
class Home {
	@GET("home/index")
	async index(ctx: any) {
		const { authorization } = ctx.header;
		const jwt_p = jwt.decode(authorization, ACCESS_MIMA);
		const uid = jwt_p && jwt_p.uid;
		const user_info = await user_info_model.findById(uid);
		let data = null;
		if (user_info) {
			data = {
				nickname: user_info.nick_name,
				username: user_info.user_name,
				face: user_info.face,
			};
		}
		ctx.body = {
			status: 200,
			state: "success",
			data,
		};
	}
}

export { Home };
