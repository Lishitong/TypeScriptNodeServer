import { Schema, model } from "mongoose";
import { user_login } from "../database";

const { datatables } = user_login;
const schema = new Schema(
	{
		name: String,
	},
	{
		versionKey: false,
	}
);

export const user_login_model = model(datatables, schema);
