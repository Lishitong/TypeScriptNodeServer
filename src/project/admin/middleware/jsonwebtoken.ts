/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { getToken } from "../utils";
import jwt from "jsonwebtoken";

// type WhiteList = {
// 	"/user/login": boolean;
// 	"/api/validateCode": boolean;
// };

// const WHITE_LIST: WhiteList = {
// 	"/user/login": true,
// 	"/api/validateCode": true,
// };

const Jwt = async (ctx: any, next: any): Promise<any> => {
	const token = getToken();
	console.log(ctx.url, token);

	// if (WHITE_LIST[ctx.url]) {
	// 	console.log(123);

	// 	await next();
	// } else {
	try {
		jwt.verify(token, "caicaizhiAAA");
		await next();
	} catch (error) {
		ctx.status = 401;
		ctx.body = {
			message: "用户需要认证",
			status: 401,
			state: "success",
		};
		// ctx.throw(401, `用户需要认证:${error}`);

		console.log(error);
	}
	// }
};

export { Jwt };
