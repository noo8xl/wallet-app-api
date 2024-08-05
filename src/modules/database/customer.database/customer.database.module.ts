import { Module } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
// import { ErrorException } from "src/common/exceptions/exceprion.handleError";
import { UserActionSchema } from "src/common/schemas/customer/actions.schemal";
import { CustomerSchema } from "src/common/schemas/customer/customer.schema";
import { CustomerDatabaseService } from "src/common/services/database/customer.database/customer.database.service";

@Module({
	imports: [
		MongooseModule.forFeature([
			{
				name: "Customer",
				schema: CustomerSchema,
			},
			{
				name: "Actions",
				schema: UserActionSchema,
			},
		]),
		// ErrorException,
	],
	providers: [CustomerDatabaseService],
})
export class CustomerDatabaseModule {}
