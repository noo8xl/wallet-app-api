import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import mongoConfig from "../../../config/database/mongo/config.mongo";

@Module({
	imports: [
		ConfigModule.forRoot({
			load: [mongoConfig],
		}),
	],
})
export class CustomerDatabaseModule {}
