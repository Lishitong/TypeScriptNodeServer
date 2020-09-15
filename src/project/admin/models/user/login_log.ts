import { Schema, model } from "mongoose";
import { login_log } from "../database";
const ObjectId = Schema.Types.ObjectId;
const { datatables } = login_log;
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
		times: {
			type: Array,
			default: [],
		},
		ips: {
			type: Array,
			default: [],
		},
		systems: {
			type: Array,
			default: [],
		},
	},
	{
		versionKey: false,
	}
);

schema.pre("update", function () {
	this.update(
		{},
		{
			$set: {
				update_time: Date.now(),
			},
		}
	);
});

export const login_log_model = model(datatables, schema);
