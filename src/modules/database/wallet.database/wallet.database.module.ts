import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import sqlConfig from "../../../config/database/mysql/config.mysql";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [sqlConfig],
		}),
	],
})
export class WalletDatabaseModule {}
