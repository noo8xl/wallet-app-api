import { MongoClient } from "mongodb";
import { Injectable } from "@nestjs/common";
import { Database } from "../database.abstract";
import { IsInt, IsString } from "class-validator";
import {
	CUSTOMER,
	CUSTOMER_ACTION,
} from "src/common/types/customer/customer.types";
import { ErrorExceptoin } from "src/common/exceptions/exceprion.handleError";

@Injectable()
export class CustomerDatabaseService extends Database {
	@IsString()
	private readonly mongoUri: string = "";
	@IsString()
	private readonly databaseName: string = "";
	@IsString()
	private readonly databaseUser: string = "";
	@IsString()
	private readonly databasePassword: string = ""; // get all params from config !-

	private client: MongoClient; // mongodb client instance
	private collectionName: string; // Customer | Actions
	private filter: any; // using as filter to find data or as object to save data
	private updatedDoc: any; // data to update
	@IsInt()
	private readonly stamp: number = new Date().getTime();

	constructor(private readonly errorHandler: ErrorExceptoin) {
		super();
		this.initConnection();
	}

	public async findUserByEmailFilter(userEmail: string): Promise<CUSTOMER> {
		this.filter = { userEmail };
		const result = await this.selectData();

		await this.closeConnection();
		return result;
	}

	public async findUserByKeyFilter(key: string): Promise<CUSTOMER> {
		this.filter = { apiKey: key };
		const result = await this.selectData();

		await this.closeConnection();
		return result;
	}

	public async saveNewClient(userDto: CUSTOMER): Promise<void> {
		this.collectionName = "Customer";
		this.filter = userDto;
		// const expiredAt: number = this.stamp + 600_000;
		this.filter.createdAt = this.stamp;
		this.filter.updatedAt = this.stamp;

		const result = await this.insertData(); // string or boolean
		const actionLog: CUSTOMER_ACTION = {
			userId: result,
			date: this.stamp,
			status: "success",
			action: "Customer has been successfully registred.",
		};

		// const cache: CACHE_DTO = {
		// 	userId: result,
		// 	apiKey: userDto.apiKey,
		// 	sessionExpired: expiredAt,
		// };

		await this.saveUserLogsData(actionLog);
		// await this.cacheService.setSessionData(cache);
		await this.closeConnection();
	}

	// getActionHistory -> get user action history by setted params
	public async getActionHistory(userDto: any): Promise<CUSTOMER_ACTION[]> {
		this.collectionName = "Actions";
		this.filter = userDto.filter;
		this.updatedDoc = userDto.doc;

		const result: CUSTOMER_ACTION[] = await this.selectMultiplyData();

		await this.closeConnection();
		return result;
	}

	// saveUserLogsData -> save customer actions log to db
	public async saveUserLogsData(actionLog: CUSTOMER_ACTION): Promise<void> {
		this.collectionName = "Actions";
		this.filter = actionLog;

		await this.insertData();
		await this.closeConnection();
	}

	// ########################################################################################
	// ############################# methods for internal usage ONLY ##########################
	// ########################################################################################

	protected async insertData(): Promise<any> {
		let c: any;
		const database = this.client.db(this.databaseName);
		const colection = database.collection(this.collectionName);
		try {
			c = await colection.insertOne(this.filter);
		} catch (e) {
			throw await this.errorHandler.ServerError("Customer DB insertion");
		}
		return c.insertedId.toString();
	}

	protected async selectData(): Promise<CUSTOMER> {
		let result: CUSTOMER;
		const database = this.client.db(this.databaseName);
		const colection = database.collection(this.collectionName);

		try {
			result = await colection.findOne<CUSTOMER>(this.filter);
		} catch (e) {
			throw await this.errorHandler.ServerError("Customer DB selection");
		}
		return result;
	}

	protected async selectMultiplyData(): Promise<CUSTOMER_ACTION[]> {
		let result: CUSTOMER_ACTION[];
		const database = this.client.db(this.databaseName);
		const colection = database.collection(this.collectionName);

		try {
			result = await colection.find<CUSTOMER_ACTION>(this.filter).toArray();
		} catch (e) {
			throw await this.errorHandler.ServerError("Customer DB selection");
		}
		return result;
	}

	protected async updateData(): Promise<string | boolean> {
		let result: string;
		const database = this.client.db(this.databaseName);
		const colection = database.collection(this.collectionName);

		try {
			const temp = await colection.updateOne(this.filter, this.updatedDoc);
			result = temp.upsertedId.toString();
		} catch (e) {
			throw await this.errorHandler.ServerError("Customer DB updating");
		}
		return result;
	}

	protected async deleteData(): Promise<boolean> {
		throw new Error("Method not implemented.");
	}

	// ########################################################################################

	protected async initConnection(): Promise<void> {
		const uri: string = await this.getMongoUri();
		if (!uri)
			return await this.errorHandler.ServerError("Customer DB connection");
		this.client = new MongoClient(uri);
	}

	protected async closeConnection(): Promise<void> {
		await this.client.close();
	}

	private async getMongoUri(): Promise<string> {
		const template: string = this.mongoUri;

		const temp: string = template.replace("<userName>", this.databaseUser);
		const uri: string = temp.replace("<userPassword>", this.databasePassword);
		return uri;
	}
}
