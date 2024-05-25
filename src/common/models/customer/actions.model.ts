import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { HydratedDocument } from "mongoose";

import { IsNumber, IsString } from "class-validator";
import {
	ACTION_STATUS,
	CUSTOMER_ACTION,
} from "src/common/types/customer/customer.types";

export type UserActionDocument = HydratedDocument<UserAction>;

@Schema({ collection: "UserAction" })
export class UserAction implements CUSTOMER_ACTION {
	_id?: mongoose.Schema.Types.ObjectId | string;

	@IsNumber()
	@Prop({ type: Number, require: true })
	date: number;

	@IsString()
	@Prop({ type: String, require: true })
	action: string;

	@Prop({
		enum: ["success", "failed", "pending"],
		type: String,
		required: true,
	})
	@IsString()
	status: ACTION_STATUS;

	@Prop({
		ref: "Customer",
		type: mongoose.Schema.Types.ObjectId || String,
		required: true,
	})
	userId: mongoose.Schema.Types.ObjectId | string;
}

export const UserActionSchema: mongoose.Schema<UserAction> =
	SchemaFactory.createForClass(UserAction);
