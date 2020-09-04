/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { POST, Controller, GET } from "../decorator/router";

// import { user_mongodb, user_info_model, user_auth_model } from "../models";
import { getValidateCode, getResult, setToken } from "../utils";
import jwt from "jsonwebtoken";
// user_mongodb();
// const test = {
// 	user_name: "test",
// 	nick_name: "tes21t",
// };
// const user_info = new user_info_model(test);

// user_info_model.deleteMany({ user_name: "test" }, async err => {
// 	console.log(err);

// 	const save = await user_info.save();
// 	const auth = {
// 		uid: save._id,
// 	};
// 	const user_auth = await new user_auth_model(auth).save();
// 	console.log(save, user_auth);
// });

@Controller("user")
class Login {
	@POST("/login")
	login(ctx: any) {
		const { username, password } = JSON.parse(ctx.request.body);
		const validate = getResult();
		let result = null;
		const dateTime = new Date().getTime();
		console.log(validate, dateTime);
		if (validate.invalidTime < dateTime) {
			result = {
				message: "验证码失效",
				state: "error",
				status: 200,
			};
		} else if (username == "caicaizhi" && password == "woshicaibi") {
			result = {
				username,
				message: "",
				state: "success",
				status: 200,
			};
			const token = jwt.sign({ username }, "caicaizhiAAA");
			setToken(token);
			ctx.set({
				Authorization: token,
			});
		} else {
			result = {
				message: "用户名或密码错误",
				state: "error",
				status: 200,
			};
		}

		ctx.body = {
			...result,
		};
	}
}

@Controller("user")
class Register {
	@POST("/register")
	register(ctx: any) {
		ctx.body = {
			status: 200,
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
