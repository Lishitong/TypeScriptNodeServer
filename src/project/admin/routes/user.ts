/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { POST, Controller, GET } from "../decorator/router";

import { user_info_model, user_auth_model } from "../models";
import { getValidateCode, getResult } from "../utils";
import jwt from "jsonwebtoken";
import { readFileSync } from "fs";
import { resolve } from "path";

const mima = readFileSync(resolve(__dirname, "../../../", "m.json"), {
	encoding: "utf-8",
});

const { ACCESS_MIMA, REFRESH_MIMA } = JSON.parse(mima);

@Controller("user")
class Login {
	@POST("/login")
	async login(ctx: any) {
		const { username, password } = JSON.parse(ctx.request.body);
		const find_name = await user_info_model.findOne({ user_name: username });

		const find_pwd =
			find_name && (await user_auth_model.findOne({ uid: find_name._id }));

		const contrastPwd = find_pwd && find_pwd.pwd === password;
		const invalidTime = getResult().invalidTime;
		const dateTime = new Date().getTime();
		const validateCode = invalidTime >= dateTime;
		if (!!find_name && !!contrastPwd && validateCode && !!find_pwd) {
			const access_token = jwt.sign(
				{ username: username, uid: find_pwd.uid },
				ACCESS_MIMA,
				{
					expiresIn: "30m",
				}
			);
			const refresh_token = jwt.sign(
				{ username: username, uid: find_pwd.uid },
				REFRESH_MIMA,
				{
					expiresIn: "15d",
				}
			);
			await user_auth_model.updateOne(
				{ uid: find_name._id },
				{ access_token, refresh_token, update_time: Date.now() }
			);
			ctx.set({
				Authorization: access_token,
			});
		}
		ctx.body = {
			validate: {
				user_name: !!find_name ? true : false,
				password: !!contrastPwd,
				validateCode,
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
			const user_info = await new user_info_model(registerInfo).save();
			const auth = {
				uid: user_info._id,
				pwd: registerInfo.password,
			};
			await new user_auth_model(auth).save();
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

export { Login, Register, ValidateCode };
