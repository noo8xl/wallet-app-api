import mongoose from "mongoose";

export type FIAT_NAME = "AUD" | "USD" | "EUR" | "RUB" | "AED";
export type ACTION_STATUS = "success" | "failed" | "pending";

export type CUSTOMER = {
	_id?: mongoose.Schema.Types.ObjectId | string;
	userEmail: string;
	domainName: string;
	companyName: string;
	apiKey: string;
	telegramId: number;
	fiatName: FIAT_NAME;
	isActive: boolean;
	createdAt: number;
	updatedAt: number;
};

export type CUSTOMER_ACTION = {
	_id?: mongoose.Schema.Types.ObjectId | string;
	userId: mongoose.Schema.Types.ObjectId | string;
	date: number;
	status: ACTION_STATUS;
	action: string;
};
