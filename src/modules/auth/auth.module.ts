import { Module } from "@nestjs/common";
// import { ConfigService } from "@nestjs/config";
import { NotificationApi } from "src/api/notificationCall.api";
import { ErrorException } from "src/common/exceptions/exceprion.handleError";
import { Helper } from "src/common/helpers/helper";
import { CustomerDatabaseModule } from "../database/customer.database/customer.database.module";
import { CustomerDatabaseService } from "src/common/services/database/customer.database/customer.database.service";
// import { ConfigModule } from "@nestjs/config";

@Module({
	imports: [CustomerDatabaseModule],
	providers: [CustomerDatabaseService, Helper, ErrorException, NotificationApi],
})
export class AuthModule {}
