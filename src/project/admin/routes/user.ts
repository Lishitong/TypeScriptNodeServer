/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { POST, Controller, GET } from "../decorator/router";

import { user_info_model, user_auth_model, login_log_model } from "../models";
import { getValidateCode, getResult } from "../utils";
import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { resolve } from "path";
import { createHash } from "crypto";

const mima = readFileSync(resolve(__dirname, "../../../", "m.json"), {
	encoding: "utf-8",
});

const { ACCESS_MIMA, REFRESH_MIMA, USER_PASSWORD } = JSON.parse(mima);

@Controller("user")
class Login {
	@POST("/login")
	async login(ctx: any) {
		const { username } = JSON.parse(ctx.request.body);
		const find_name = await user_info_model.findOne({ user_name: username });

		const invalidTime = getResult().invalidTime;
		const dateTime = new Date().getTime();
		const validateCode = invalidTime >= dateTime;

		ctx.body = {
			validate: {
				user_name: !!find_name ? true : false,
				validateCode,
				time: find_name && find_name.time,
				uid: find_name && find_name._id,
			},
			state: "success",
			status: 200,
		};
	}
}

@Controller("user")
class Register {
	@POST("/register")
	async register(ctx: any) {
		const registerInfo = JSON.parse(ctx.request.body);

		let username = true,
			nickname = true;

		const find_user = await user_info_model.find({
			$or: [
				{
					user_name: registerInfo.user_name,
				},
				{
					nick_name: registerInfo.nick_name,
				},
			],
		});

		if (find_user) {
			username = !find_user.filter(
				user => user.user_name === registerInfo.user_name
			).length;
			nickname = !find_user.filter(
				user => user.nick_name === registerInfo.nick_name
			).length;
		}
		if (username && nickname) {
			const user_info = await new user_info_model({
				...registerInfo,
				register_ip: ctx.ip,
				register_system: ctx.header["user-agent"],
			}).save();
			const md5hexPwd = createHash("md5").update(
				registerInfo.pass_word + USER_PASSWORD
			);
			const auth = {
				uid: user_info._id,
				pass_word: md5hexPwd.digest("hex"),
			};
			await new user_auth_model(auth).save();
			await login_log_model.create({ uid: user_info._id });
		}

		ctx.body = {
			validate: {
				username,
				nickname,
			},
			status: 200,
			state: "success",
		};
	}
}

@Controller("user")
class VlidatePwd {
	@POST("validatePwd")
	async validatePwd(ctx: any) {
		const { username, password, uid } = JSON.parse(ctx.request.body);
		const find_pwd = await user_auth_model.findOne({ uid });
		const md5hexPwd = createHash("md5").update(password + USER_PASSWORD);
		const pwd = find_pwd && find_pwd.pass_word === md5hexPwd.digest("hex");
		const now = Date.now();
		const ip = ctx.ip;
		const userAgent = ctx.header["user-agent"];
		if (pwd) {
			const access_token = jwt.sign(
				{ username: username, uid: uid },
				ACCESS_MIMA,
				{
					expiresIn: "15m",
				}
			);
			const refresh_token = jwt.sign(
				{ username: username, uid: uid },
				REFRESH_MIMA,
				{
					expiresIn: "7d",
				}
			);
			await user_auth_model.updateOne(
				{ uid: uid },
				{
					access_token,
					refresh_token,
					login_time: now,
					login_last_time: find_pwd && find_pwd.login_time,
					login_system: ctx.header["user-agent"],
					login_ip: ip,
					login_last_ip: find_pwd && find_pwd.login_ip,
				}
			);

			const login_log = await login_log_model.findOne({ uid: uid });

			await login_log_model.updateOne(
				{ uid: uid },
				{
					times: login_log && [now, ...login_log.times],
					ips: login_log && [ip, ...login_log.ips],
					systems: login_log && [userAgent, ...login_log.systems],
				}
			);

			ctx.set({
				Authorization: access_token,
			});
		}
		ctx.body = {
			state: 200,
			password: pwd,
			status: "success",
		};
	}
}

@Controller("api")
class ValidateCode {
	@GET("validateCode")
	validateCode(ctx: any) {
		getValidateCode();
		const validate = getResult();
		ctx.body = {
			codeInfo: validate,
			status: 200,
			state: "success",
		};
	}
}

export { Login, Register, ValidateCode, VlidatePwd };
