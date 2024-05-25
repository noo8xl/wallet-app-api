// Database -> describe the nessesary class methods at each database services
export abstract class Database {
	protected abstract insertData(): Promise<any>;
	protected abstract selectData(): Promise<any>;
	protected abstract selectMultiplyData(): Promise<any>;
	protected abstract updateData(): Promise<string | boolean>;
	protected abstract deleteData(): Promise<boolean>;

	protected abstract initConnection(): Promise<void> | void;
	protected abstract closeConnection(): Promise<void> | void;
}
