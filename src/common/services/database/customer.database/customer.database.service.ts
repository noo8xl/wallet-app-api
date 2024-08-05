import { Inject, Injectable } from "@nestjs/common";
import { IsNumber } from "class-validator";
import { ErrorException } from "src/common/exceptions/exceprion.handleError";
import {
	Customer,
	CustomerDocument,
} from "src/common/schemas/customer/customer.schema";
import {
	UserAction,
	UserActionDocument,
} from "src/common/schemas/customer/actions.schemal";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

@Injectable()
export class CustomerDatabaseService {
	@IsNumber()
	private readonly stamp: number = new Date().getTime();

	constructor(
		// @InjectConnection() private connection: Connection,
		@InjectModel("Customer")
		private readonly customer: Model<CustomerDocument>,
		@InjectModel("Actions")
		private readonly userActions: Model<UserActionDocument>,
		@Inject() private readonly errorHandler: ErrorException,
	) {}

	public async findUserByEmailFilter(userEmail: string): Promise<Customer> {
		try {
			const result: Customer = await this.customer.findOne({ userEmail });
			if (!result) throw await this.errorHandler.NotFoundError();
			return result;
		} catch (e) {
			console.log("error is -> ", e);
			throw await this.errorHandler.ServerError("Searching for user by key");
		}
	}

	public async findUserByKeyFilter(key: string): Promise<Customer> {
		try {
			const result: Customer = await this.customer.findOne({
				apiKey: key,
			});
			if (!result) throw await this.errorHandler.NotFoundError();
			return result;
		} catch (e) {
			console.log("error is -> ", e);
			throw await this.errorHandler.ServerError("Searching for user by key");
		}
	}

	public async saveNewClient(userDto: Customer): Promise<void> {
		userDto.createdAt = this.stamp;
		userDto.updatedAt = this.stamp;

		const initUser = new this.customer(userDto);
		const user = await initUser.save();
		if (!user) throw await this.errorHandler.ServerError("Insert customer.");

		const actionLog: UserAction = {
			userId: user._id.toString(),
			date: this.stamp,
			status: "success",
			action: "Customer has been successfully registred.",
		};

		await this.saveUserLogsData(actionLog);
		// create a user session here stored in redis

		// const cache: CACHE_DTO = {
		// 	userId: user._id.toString(),
		// 	apiKey: userDto.apiKey,
		// };

		// await this.cacheService.setSessionData(cache);
	}

	// getActionHistory -> get user action history by setted params
	public async getActionHistory(dto: any): Promise<UserAction[]> {
		// dto => userId, skip, limit

		const result: UserAction[] = await this.userActions
			.find({ _id: dto.userId })
			.skip(dto.skip)
			.limit(dto.limit)
			.sort()
			.exec();

		if (!result) throw await this.errorHandler.BadRequest();
		if (!result.length) throw await this.errorHandler.NotFoundError();

		return result;
	}

	// saveUserLogsData -> save customer actions log to db
	public async saveUserLogsData(actionLog: UserAction): Promise<void> {
		const initAct = new this.userActions(actionLog);
		const action = await initAct.save();
		if (!action) throw await this.errorHandler.ServerError("Save action log.");
	}
}
