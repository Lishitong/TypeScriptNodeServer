import { Schema, model } from "mongoose";
import { user_roule } from "../database";

const { datatables } = user_roule;
const schema = new Schema(
	{
		name: String,
	},
	{
		versionKey: false,
	}
);

export const user_roule_model = model(datatables, schema);
