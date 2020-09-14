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

const { ACCESS_MIMA } = JSON.parse(mima);

// 1.接口token错误/失效
// 2.接口token正确，用户token错误
// 3.用户token失效

const Jwt = async (ctx: any, next: any): Promise<any> => {
	console.log(ctx.ip);
	if (tokenApi[ctx.url]) {
		await next();
		return;
	}
	const { authorization } = ctx.header;

	try {
		jwt.verify(authorization, ACCESS_MIMA);
		await next();
	} catch (error) {
		const token = await jwt_refresh_token(authorization);

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

const jwt_refresh_token = async (authorization: string) => {
	const find_token = await user_auth_model.findOne({
		access_token: authorization,
	});
	if (!find_token || !find_token.refresh_token) return false;
	const refresh = _parseBase64JWT(find_token.refresh_token);
	const { username, uid, exp } = refresh;
	const now = new Date().getTime();

	if (!refresh || exp <= now) {
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

const _parseBase64JWT = (base64: string) => {
	if (!base64) return;
	const token = Buffer.from(base64, "base64").toString();
	const reg = /{(.*)}{(.*)}/g;
	const str = reg.exec(token);
	return str && JSON.parse(`{${str[2]}}`);
};

export { Jwt };
