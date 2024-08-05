import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CustomerController } from "./common/controllers/customer/customer.controller";
import { ExchangeModule } from "./modules/exchange/exchange.module";
import { WalletModule } from "./modules/wallet/wallet.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CustomerModule } from "./modules/customer/customer.module";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "./common/controllers/auth/auth.controller";
import { WalletController } from "./common/controllers/wallet/wallet.controller";
import { AuthService } from "./common/services/auth/auth.service";
import { CustomerService } from "./common/services/customer/customer.service";
import { NotificationApi } from "./api/notificationCall.api";
import { ErrorException } from "./common/exceptions/exceprion.handleError";
import { Helper } from "./common/helpers/helper";
import { CustomerDatabaseService } from "./common/services/database/customer.database/customer.database.service";
import { MongooseModule } from "@nestjs/mongoose";
import { MONGO_DB } from "./config/configs";
import { CustomerDatabaseModule } from "./modules/database/customer.database/customer.database.module";

@Module({
	imports: [
		AuthModule,
		CustomerModule,
		ExchangeModule,
		WalletModule,
		ConfigModule.forRoot({
			envFilePath: ".env",
			isGlobal: true,
		}),
		MongooseModule.forRoot(MONGO_DB.link),
	],
	controllers: [
		AuthController,
		AppController,
		CustomerController,
		WalletController,
	],
	providers: [AuthService, AppService, CustomerService],
})
export class AppModule {}
