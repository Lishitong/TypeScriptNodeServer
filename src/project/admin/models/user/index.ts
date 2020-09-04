import { connect } from "mongoose";
import { password, username, user_url } from "../database";
export { user_login_model } from "./user_login";
export { user_roule_model } from "./user_role";
export { user_info_model } from "./user_info";
export { user_auth_model } from "./user_auth";
export const user_mongodb = (): Promise<typeof import("mongoose")> =>
	connect(
		user_url,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
			user: username,
			pass: password,
		},
		err => (err ? console.log(err) : console.log("链接成功"))
	);
