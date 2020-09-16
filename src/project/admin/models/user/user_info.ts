import { Schema, model } from "mongoose";
import { user_info } from "../database";

const ObjectId = Schema.Types.ObjectId;
const { datatables } = user_info;
const schema = new Schema(
	{
		email: {
			type: String,
			default: null,
		},
		mobile_phones: {
			type: Number,
			default: null,
		},
		card_id: {
			type: Number,
			default: null,
		},
		// 用户名
		user_name: {
			type: String,
			required: true,
		},
		// 昵称
		nick_name: {
			type: String,
			required: true,
		},
		// 性别
		gender: {
			type: Number,
			default: 0,
		},
		// 生日
		birthday: {
			type: String,
			default: "1999-01-01",
		},
		// 签名
		signature: {
			type: String,
			default: null,
		},
		// 头像
		face: {
			type: Buffer,
			default: null,
		},
		id: {
			type: ObjectId,
		},
		time: {
			type: Number,
		},
		register_system: { type: String, default: null },
		register_time: {
			type: Date,
			default: Date.now(),
		},
		register_ip: {
			type: String,
			default: null,
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

export const user_info_model = model(datatables, schema);
