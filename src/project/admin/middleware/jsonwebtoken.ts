/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { tokenApi } from "../config";
import jwt from "jsonwebtoken";
import { user_auth_model } from "../models";
import { readFileSync } from "fs";
import { resolve } from "path";

const mima = readFileSync(resolve(__dirname, "../../../", "m.json"), {
	encoding: "utf-8",
});

const { ACCESS_MIMA, REFRESH_MIMA } = JSON.parse(mima);

const Jwt = async (ctx: any, next: any): Promise<any> => {
	if (tokenApi[ctx.url]) {
		await next();
		return;
	}
	const { authorization } = ctx.header;

	try {
		jwt.verify(authorization, ACCESS_MIMA);
		await next();
	} catch (error) {
		console.log(error);

		ctx.status = 401;
		ctx.body = {
			message: "用户需要认证",
			status: 401,
			state: "success",
		};
		// ctx.throw(401, `用户需要认证:${error}`);
	}
	// }
};

const jwt_refresh_token = async (authorization: string) => {
	const find_token = await user_auth_model.findOne({
		access_token: authorization,
	});

	
	console.log(find_token);
};

export { Jwt };
