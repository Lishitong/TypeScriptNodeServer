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
