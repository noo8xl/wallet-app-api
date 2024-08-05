import * as mongoose from "mongoose";
import { HydratedDocument } from "mongoose";
import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";

import { IsBoolean, IsNumber, IsString } from "class-validator";
import { CUSTOMER, FIAT_NAME } from "src/common/types/customer/customer.types";

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ collection: "Customer" })
export class Customer implements CUSTOMER {
	_id?: mongoose.Schema.Types.ObjectId | string;

	@IsString()
	@Prop({ unique: true, type: String, require: true })
	userEmail: string;

	@IsString()
	@Prop({ unique: true, type: String, require: true })
	companyName: string;

	@IsString()
	@Prop({ unique: true, type: String, require: true })
	domainName: string;

	@IsString()
	@Prop({ unique: true, type: String, require: true })
	apiKey: string;

	@IsBoolean()
	@Prop({ type: Boolean, require: true })
	isActive: boolean;

	@Prop({
		enum: ["AUD", "USD", "EUR", "RUB", "AED"],
		type: String,
		require: true,
	})
	@IsString()
	fiatName: FIAT_NAME;

	@IsNumber()
	@Prop({ unique: true, type: Number, require: true })
	telegramId: number;

	@IsNumber()
	@Prop({ type: Number, require: true })
	createdAt: number;

	@IsNumber()
	@Prop({ type: Number, require: true })
	updatedAt: number;
}

export const CustomerSchema: mongoose.Schema<Customer> =
	SchemaFactory.createForClass(Customer);
