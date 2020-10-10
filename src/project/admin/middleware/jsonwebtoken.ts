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

// 1.接口token错误/失效
// 2.接口token正确，用户token错误
// 3.用户token失效

const Jwt = async (ctx: any, next: any): Promise<any> => {
	if (tokenApi[ctx.url] || ctx.method === "OPTIONS") {
		await next();
		return;
	}
	const { authorization } = ctx.header;
	try {
		jwt.verify(authorization, ACCESS_MIMA);
		await next();
	} catch (error) {
		const decodeAuth = jwt.decode(authorization, ACCESS_MIMA);
		const uid = decodeAuth && decodeAuth.uid;
		const token = await jwt_refresh_token(uid);
		if (!token) {
			ctx.status = 401;
			ctx.body = {
				message: "用户需要认证",
				status: 401,
				state: "success",
			};
		} else {
			ctx.set({
				Authorization: token,
			});
			await next();
		}
		// ctx.throw(401, `用户需要认证:${error}`);
	}
};

const jwt_refresh_token = async (uid: string) => {
	const find_token = await user_auth_model.findOne({
		uid,
	});
	if (!find_token) return false;
	const refresh = jwt.decode(find_token.refresh_token, REFRESH_MIMA);
	const { username, exp } = refresh;
	const now = new Date().getTime();
	console.log(exp * 1000, now);
	if (exp * 1000 > now) {
		const new_access_token = jwt.sign(
			{ username: username, uid: uid },
			ACCESS_MIMA,
			{
				expiresIn: "15m",
			}
		);
		await user_auth_model.updateOne(
			{ uid },
			{ access_token: new_access_token, update_time: new Date(now) }
		);
		return new_access_token;
	}
	return false;
};

export { Jwt };
