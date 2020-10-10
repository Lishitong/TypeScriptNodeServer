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
		pass_word: {
			type: String,
		},
		menus: {
			type: Array,
			default: [],
		},
		login_system: { type: String },
		login_time: { type: Date },
		login_last_time: { type: Date },
		login_ip: { type: String },
		login_last_ip: { type: String },
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

schema.pre("updateOne", function () {
	this.update(
		{},
		{
			$set: {
				update_time: Date.now(),
			},
		}
	);
});

export const user_auth_model = model(datatables, schema);
