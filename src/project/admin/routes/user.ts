/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { POST, Controller, GET } from "../decorator/router";

import { user_info_model, user_auth_model, login_log_model } from "../models";
import { getResult } from "../utils";
import jwt from "jsonwebtoken";
import { createHash } from "crypto";
import { readFileSync } from "fs";
import { resolve } from "path";

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

			await login_log_model.updateOne(
				{ uid: uid },
				{
					$push: {
						times: now,
						ips: ip,
						systems: userAgent,
					},
				}
			);

			ctx.set({
				Authorization: access_token,
			});
		}
		ctx.body = {
			state: "success",
			password: pwd,
			status: 200,
		};
	}
}

@Controller("user")
class UserInfo {
	@GET("/userInfo")
	async userInfo(ctx: any) {
		const { authorization } = ctx.header;
		const jwt_p = jwt.decode(authorization, ACCESS_MIMA);
		const uid = jwt_p && jwt_p.uid;
		const user_info = await user_info_model.findById(uid);
		const user_auth = await user_auth_model.findOne({ uid });
		let data = null;
		if (user_info && user_auth) {
			data = {
				nickname: user_info.nick_name,
				username: user_info.user_name,
				face: user_info.face,
				userlevel: user_auth.user_level,
			};
		}
		ctx.body = {
			status: 200,
			state: "success",
			data,
		};
	}
}

@Controller("user")
class UserMenus {
	@GET("/userMenus")
	async userMenus(ctx: any) {
		let data = null;
		const { authorization } = ctx.header;
		const jwt_p = jwt.decode(authorization, ACCESS_MIMA);
		const uid = jwt_p && jwt_p.uid;
		const user_auth = await user_auth_model.findOne({ uid });

		if (user_auth) {
			data = {
				menus: user_auth.menus,
			};
		}

		ctx.body = {
			status: 200,
			state: "success",
			data,
		};
	}
}

@Controller("user")
class ConfigMenus {
	@POST("/configMenus")
	async configMenus(ctx: any) {
		let message = "保存失败，请重新尝试",
			data = null,
			state = "error";
		const { menus, userUid } = ctx.request.body;
		const { authorization } = ctx.header;
		const jwt_p = jwt.decode(authorization, ACCESS_MIMA);
		const uid = userUid || (jwt_p && jwt_p.uid);
		const user_auth = await user_auth_model.findOneAndUpdate(
			{ uid },
			{
				menus: menus.sort(
					(a: { key: string }, b: { key: string }) => a.key > b.key
				),
			}
		);

		if (user_auth) {
			message = "保存成功，刷新或重登后生效";
			state = "success";
			data = {
				visual: menus.find((m: any) => m.key === "visual"),
				personnel: menus.find((m: any) => m.key === "personnel"),
				article: menus.find((m: any) => m.key === "article"),
			};
		}
		console.log(menus);
		ctx.body = {
			status: 200,
			state,
			message,
			data,
		};
	}
}
@Controller("user")
class GetOwnedMenus {
	@GET("/getOwnedMenus")
	async getOwnedMenus(ctx: any) {
		let data = null;
		const { authorization } = ctx.header;
		const jwt_p = jwt.decode(authorization, ACCESS_MIMA);
		const uid = jwt_p && jwt_p.uid;
		const user_auth = await user_auth_model.findOne({ uid });

		if (user_auth) {
			data = {
				visual: user_auth.menus.find((m: any) => m.key === "visual"),
				personnel: user_auth.menus.find((m: any) => m.key === "personnel"),
				article: user_auth.menus.find((m: any) => m.key === "article"),
			};
		}
		ctx.body = {
			status: 200,
			state: "success",
			data,
		};
	}
}

@Controller("user")
class GetUserInfoList {
	@GET("/getUserInfoList")
	async getUserInfoList(ctx: any) {
		const { userLevel } = ctx.query;
		console.log(userLevel);
		let data = null;
		const user_list = await user_info_model.find(
			{ user_level: { $gte: userLevel } },
			{ nick_name: 1 }
		);

		if (user_list) {
			data = user_list;
		}
		ctx.body = {
			status: 200,
			state: "success",
			data,
		};
	}
}

@Controller("user")
class GetSingleUserAuth {
	@GET("/getSingleUserAuth")
	async getSingleUserAuth(ctx: any) {
		let data = null,
			status = 400;
		console.log(ctx.query);
		const { uid } = ctx.query;
		if (uid) {
			const single_user = await user_auth_model.findOne({ uid });

			if (single_user) {
				// data = { menus: single_user.menus, uid };
				data = {
					menus: {
						visual: single_user.menus.find((m: any) => m.key === "visual"),
						personnel: single_user.menus.find(
							(m: any) => m.key === "personnel"
						),
						article: single_user.menus.find((m: any) => m.key === "article"),
					},
					uid,
				};
			}
			status = 200;
		} else {
			ctx.status = 400;
		}
		ctx.body = {
			status,
			state: "success",
			data,
		};
	}
}

export {
	Login,
	Register,
	VlidatePwd,
	ConfigMenus,
	GetOwnedMenus,
	GetUserInfoList,
	UserInfo,
	UserMenus,
	GetSingleUserAuth,
};
