import { Schema, model } from "mongoose";
import { user_auth } from "../database";

const ObjectId = Schema.Types.ObjectId;
const { datatables } = user_auth;
const schema = new Schema(
	{
		uid: {
			type: ObjectId,
		},
		id: {
			type: ObjectId,
		},
		pwd: {
			type: String,
		},
		// token: {
		// 	type: String,
		// },
		access_token: {
			type: String,
		},
		refresh_token: {
			type: String,
		},
		create_time: {
			type: Date,
			default: Date.now(),
		},
		update_time: {
			type: Date,
			default: Date.now(),
		},
	},
	{
		versionKey: false,
	}
);

export const user_auth_model = model(datatables, schema);
