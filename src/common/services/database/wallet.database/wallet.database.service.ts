import mysql from "mysql2";
import { Injectable } from "@nestjs/common";
import { Database } from "../database.abstract";
import { IsString } from "class-validator";
import { NotificationService } from "../../notification/notification.service";

@Injectable()
export class WalletDatabaseService extends Database {
	private db: mysql.Connection;
	@IsString()
	private readonly databaseHost: string = "";
	@IsString()
	private readonly databaseName: string = "";
	@IsString()
	private readonly databaseUser: string = "";
	@IsString()
	private readonly databasePassword: string = "";

	constructor(private readonly notification: NotificationService) {
		super();
		this.initConnection();
	}

	public insertData(): Promise<any> {
		throw new Error("Method not implemented.");
	}
	public selectData(): Promise<any> {
		throw new Error("Method not implemented.");
	}
	public selectMultiplyData(): Promise<any> {
		throw new Error("Method not implemented.");
	}
	public updateData(): Promise<string | boolean> {
		throw new Error("Method not implemented.");
	}
	public deleteData(): Promise<boolean> {
		this.closeConnection();
		throw new Error("Method not implemented.");
	}

	// initConnection -> init mysql connection
	protected initConnection(): void {
		this.db = mysql.createConnection({
			host: this.databaseHost,
			user: this.databaseUser,
			password: this.databasePassword,
			database: this.databaseName,
		});

		this.db.connect(async (err: mysql.QueryError | null) => {
			if (err)
				return await this.notification.sendErrorMessage("Wallet DB connection");
			return console.log("mysql database was connected.");
		});
	}

	protected closeConnection(): void {
		this.db.destroy();
	}
}
